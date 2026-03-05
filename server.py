import http.server
import socketserver
import os
import base64
import hashlib
import json
import time
import string
import random
import psycopg2
import psycopg2.extras
from urllib.parse import urlparse, parse_qs
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError

PORT = 5000
HOST = "0.0.0.0"

ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'sportsbeep2026')
ADMIN_PASSWORD_HASH = hashlib.sha256(ADMIN_PASSWORD.encode()).hexdigest()

DATABASE_URL = os.environ.get('DATABASE_URL')
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is required. Provision a PostgreSQL database first.")

def get_db():
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = True
    return conn

def init_db():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS allocations (
            id VARCHAR(36) PRIMARY KEY,
            address TEXT NOT NULL,
            label VARCHAR(255) DEFAULT '',
            email VARCHAR(255) DEFAULT '',
            amount VARCHAR(50) DEFAULT '',
            status VARCHAR(20) DEFAULT 'pending',
            tx_hash TEXT DEFAULT '',
            registered_at TIMESTAMP DEFAULT NOW(),
            referral_code VARCHAR(20) DEFAULT '',
            referred_by VARCHAR(20) DEFAULT '',
            referrals JSONB DEFAULT '[]'::jsonb,
            notes TEXT DEFAULT ''
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS distributions (
            id SERIAL PRIMARY KEY,
            date TIMESTAMP DEFAULT NOW(),
            address TEXT NOT NULL,
            label VARCHAR(255) DEFAULT '',
            amount INTEGER DEFAULT 0,
            tx_hash TEXT DEFAULT ''
        )
    """)
    cur.close()
    conn.close()

def db_get_allocations():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT * FROM allocations ORDER BY registered_at ASC")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    result = []
    for r in rows:
        result.append({
            'id': r['id'],
            'address': r['address'],
            'label': r['label'] or '',
            'email': r['email'] or '',
            'amount': r['amount'] or '',
            'status': r['status'] or 'pending',
            'txHash': r['tx_hash'] or '',
            'registeredAt': r['registered_at'].strftime('%Y-%m-%d %H:%M:%S UTC') if r['registered_at'] else '',
            'referralCode': r['referral_code'] or '',
            'referredBy': r['referred_by'] or '',
            'referrals': r['referrals'] if r['referrals'] else [],
            'notes': r['notes'] or ''
        })
    return result

def db_get_distributions():
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT * FROM distributions ORDER BY date DESC")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    result = []
    for r in rows:
        result.append({
            'id': r['id'],
            'date': r['date'].strftime('%Y-%m-%d %H:%M UTC') if r['date'] else '',
            'address': r['address'] or '',
            'label': r['label'] or '',
            'amount': r['amount'] or 0,
            'txHash': r['tx_hash'] or ''
        })
    return result

def generate_referral_code():
    chars = string.ascii_uppercase + string.digits
    return 'BEEP' + ''.join(random.choices(chars, k=6))

def is_admin(handler):
    auth_header = handler.headers.get('Authorization')
    if not auth_header:
        return False
    try:
        auth_type, credentials = auth_header.split(' ', 1)
        if auth_type.lower() != 'basic':
            return False
        decoded = base64.b64decode(credentials).decode('utf-8')
        username, password = decoded.split(':', 1)
        return hashlib.sha256(password.encode()).hexdigest() == ADMIN_PASSWORD_HASH
    except Exception:
        return False

class SportsbeepHandler(http.server.SimpleHTTPRequestHandler):

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == '/admin.html' or path == '/admin':
            if not is_admin(self):
                self.send_response(401)
                self.send_header('WWW-Authenticate', 'Basic realm="SPORTSBEEP Admin"')
                self.send_header('Content-Type', 'text/html')
                self.end_headers()
                self.wfile.write(b'<html><body style="background:#04172B;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh"><h1>Unauthorized - Enter admin credentials</h1></body></html>')
                return
            try:
                with open('admin.html', 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'text/html')
                self.send_header('Content-Length', str(len(content)))
                self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
                self.send_header('Pragma', 'no-cache')
                self.send_header('Expires', '0')
                self.end_headers()
                self.wfile.write(content)
            except FileNotFoundError:
                self.send_error(404, 'Admin page not found')
            return

        if path == '/api/cardano/tip':
            try:
                req = Request('https://api.koios.rest/api/v1/tip', headers={'Accept': 'application/json'})
                with urlopen(req, timeout=10) as resp:
                    data = resp.read()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(data)
            except Exception as e:
                self._send_json(502, {'error': 'Failed to fetch network tip: ' + str(e)})
            return

        if path.startswith('/api/cardano/epoch_params'):
            try:
                epoch = parse_qs(parsed.query).get('_epoch_no', [''])[0]
                url = 'https://api.koios.rest/api/v1/epoch_params'
                if epoch:
                    url += '?_epoch_no=' + epoch
                req = Request(url, headers={'Accept': 'application/json'})
                with urlopen(req, timeout=10) as resp:
                    data = resp.read()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(data)
            except Exception as e:
                self._send_json(502, {'error': 'Failed to fetch epoch params: ' + str(e)})
            return

        if path == '/api/allocations':
            if not is_admin(self):
                self._send_json(401, {'error': 'Unauthorized'})
                return
            data = db_get_allocations()
            self._send_json(200, data)
            return

        if path == '/api/distributions':
            data = db_get_distributions()
            if is_admin(self):
                self._send_json(200, data)
            else:
                public_data = []
                for d in data:
                    addr = d.get('address', '')
                    public_data.append({
                        'date': d.get('date', ''),
                        'label': d.get('label', ''),
                        'amount': d.get('amount', ''),
                        'txHash': d.get('txHash', ''),
                        'address': addr[:15] + '...' if addr else ''
                    })
                self._send_json(200, public_data)
            return

        if path == '/api/stats':
            allocations = db_get_allocations()
            distributions = db_get_distributions()
            total_allocated = sum(float(a.get('amount', 0) or 0) for a in allocations)
            total_distributed = sum(float(d.get('amount', 0) or 0) for d in distributions)
            total_registrations = len(allocations)
            total_referrals = sum(len(a.get('referrals', [])) for a in allocations)
            self._send_json(200, {
                'totalRegistrations': total_registrations,
                'totalAllocated': total_allocated,
                'totalDistributed': total_distributed,
                'totalReferrals': total_referrals
            })
            return

        if path == '/api/referral-stats':
            params = parse_qs(parsed.query)
            code = params.get('code', [None])[0]
            if not code:
                self._send_json(400, {'error': 'Referral code required'})
                return
            conn = get_db()
            cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            cur.execute("SELECT * FROM allocations WHERE referral_code = %s", (code,))
            row = cur.fetchone()
            cur.close()
            conn.close()
            if row:
                referrals = row['referrals'] if row['referrals'] else []
                referral_count = len(referrals)
                rewards_earned = (referral_count // 10) * 100
                self._send_json(200, {
                    'code': code,
                    'referralCount': referral_count,
                    'rewardsEarned': rewards_earned,
                    'nextMilestone': 10 - (referral_count % 10),
                    'label': row['label'] or ''
                })
            else:
                self._send_json(404, {'error': 'Referral code not found'})
            return

        super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)

        try:
            data = json.loads(body) if body else {}
        except json.JSONDecodeError:
            self._send_json(400, {'error': 'Invalid JSON'})
            return

        if path == '/api/cardano/submit':
            if not is_admin(self):
                self._send_json(401, {'error': 'Unauthorized'})
                return
            try:
                tx_cbor_hex = data.get('txCbor', '')
                tx_bytes = bytes.fromhex(tx_cbor_hex)
                req = Request(
                    'https://api.koios.rest/api/v1/submittx',
                    data=tx_bytes,
                    headers={'Content-Type': 'application/cbor'},
                    method='POST'
                )
                with urlopen(req, timeout=30) as resp:
                    result = resp.read().decode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'txHash': result.strip().strip('"')}).encode())
            except HTTPError as e:
                error_body = e.read().decode('utf-8') if e.fp else str(e)
                self._send_json(e.code, {'error': 'Cardano node rejected transaction: ' + error_body})
            except Exception as e:
                self._send_json(502, {'error': 'Failed to submit transaction: ' + str(e)})
            return

        if path == '/api/register':
            address = data.get('address', '').strip()
            label = data.get('label', '').strip()
            email = data.get('email', '').strip()
            referredBy = data.get('referredBy', '').strip()

            if not address or not address.startswith('addr1'):
                self._send_json(400, {'error': 'Valid Cardano address (addr1...) required'})
                return
            if len(address) < 50:
                self._send_json(400, {'error': 'Address appears too short'})
                return
            if not label:
                self._send_json(400, {'error': 'Name or label is required'})
                return

            conn = get_db()
            cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

            cur.execute("SELECT id, referral_code FROM allocations WHERE address = %s", (address,))
            existing = cur.fetchone()
            if existing:
                cur.close()
                conn.close()
                self._send_json(409, {
                    'error': 'This wallet address is already registered',
                    'referralCode': existing['referral_code'] or ''
                })
                return

            if referredBy:
                cur.execute("SELECT id FROM allocations WHERE referral_code = %s", (referredBy,))
                if not cur.fetchone():
                    referredBy = ''

            referral_code = generate_referral_code()
            cur.execute("SELECT id FROM allocations WHERE referral_code = %s", (referral_code,))
            while cur.fetchone():
                referral_code = generate_referral_code()
                cur.execute("SELECT id FROM allocations WHERE referral_code = %s", (referral_code,))

            entry_id = str(int(time.time() * 1000))
            registered_at = time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime())

            cur.execute("""
                INSERT INTO allocations (id, address, label, email, amount, status, tx_hash, registered_at, referral_code, referred_by, referrals, notes)
                VALUES (%s, %s, %s, %s, '', 'pending', '', %s, %s, %s, '[]'::jsonb, '')
            """, (entry_id, address, label, email, registered_at, referral_code, referredBy))

            if referredBy:
                referral_entry = json.dumps({
                    'address': address[:15] + '...',
                    'label': label,
                    'date': registered_at + ' UTC'
                })
                cur.execute("""
                    UPDATE allocations
                    SET referrals = referrals || %s::jsonb
                    WHERE referral_code = %s
                """, (referral_entry, referredBy))

            cur.close()
            conn.close()
            self._send_json(201, {
                'message': 'Registration successful',
                'id': entry_id,
                'referralCode': referral_code
            })
            return

        if path == '/api/allocations/update':
            if not is_admin(self):
                self._send_json(401, {'error': 'Unauthorized'})
                return

            entry_id = data.get('id')
            if not entry_id:
                self._send_json(400, {'error': 'Entry ID required'})
                return

            conn = get_db()
            cur = conn.cursor()

            updates = []
            params = []
            if 'amount' in data:
                updates.append("amount = %s")
                params.append(data['amount'])
            if 'status' in data:
                updates.append("status = %s")
                params.append(data['status'])
            if 'txHash' in data:
                updates.append("tx_hash = %s")
                params.append(data['txHash'])
            if 'notes' in data:
                updates.append("notes = %s")
                params.append(data['notes'])

            if not updates:
                cur.close()
                conn.close()
                self._send_json(400, {'error': 'No fields to update'})
                return

            params.append(entry_id)
            cur.execute(f"UPDATE allocations SET {', '.join(updates)} WHERE id = %s", params)

            if cur.rowcount == 0:
                cur.close()
                conn.close()
                self._send_json(404, {'error': 'Entry not found'})
                return

            cur.close()
            conn.close()
            self._send_json(200, {'message': 'Updated'})
            return

        if path == '/api/allocations/delete':
            if not is_admin(self):
                self._send_json(401, {'error': 'Unauthorized'})
                return

            entry_id = data.get('id')
            if not entry_id:
                self._send_json(400, {'error': 'Entry ID required'})
                return

            conn = get_db()
            cur = conn.cursor()
            cur.execute("DELETE FROM allocations WHERE id = %s", (entry_id,))

            if cur.rowcount == 0:
                cur.close()
                conn.close()
                self._send_json(404, {'error': 'Entry not found'})
                return

            cur.close()
            conn.close()
            self._send_json(200, {'message': 'Registration deleted'})
            return

        if path == '/api/distributions/delete':
            if not is_admin(self):
                self._send_json(401, {'error': 'Unauthorized'})
                return

            dist_id = data.get('id')
            if dist_id is None:
                self._send_json(400, {'error': 'Distribution ID required'})
                return

            conn = get_db()
            cur = conn.cursor()
            cur.execute("DELETE FROM distributions WHERE id = %s", (dist_id,))

            if cur.rowcount == 0:
                cur.close()
                conn.close()
                self._send_json(404, {'error': 'Distribution not found'})
                return

            cur.close()
            conn.close()
            self._send_json(200, {'message': 'Distribution record deleted'})
            return

        if path == '/api/distributions/add':
            if not is_admin(self):
                self._send_json(401, {'error': 'Unauthorized'})
                return

            conn = get_db()
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO distributions (date, address, label, amount, tx_hash)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                data.get('date', time.strftime('%Y-%m-%d %H:%M', time.gmtime())),
                data.get('address', ''),
                data.get('label', ''),
                data.get('amount', 0),
                data.get('txHash', '')
            ))
            cur.close()
            conn.close()
            self._send_json(201, {'message': 'Distribution recorded'})
            return

        self._send_json(404, {'error': 'Not found'})

    def _send_json(self, status, data):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

os.chdir(os.path.dirname(os.path.abspath(__file__)))
init_db()

with ReusableTCPServer((HOST, PORT), SportsbeepHandler) as httpd:
    print(f"Server running at http://{HOST}:{PORT}/")
    httpd.serve_forever()
