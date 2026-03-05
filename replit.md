# SPORTSBEEP - Pre-Liquidity Beta

## Overview
SPORTSBEEP is a Cardano-based daily fantasy sports platform. This is the pre-liquidity beta website for $BEEP tokens featuring a Closed Access Phase for founders, contributors, and beta testers. Includes a referral rewards system (100 $BEEP per 10 verified referrals), registration system with unique referral links, and off-chain allocation tracking with on-chain delivery via admin panel.

## Project Type
Python-served frontend application with blockchain wallet integration and PostgreSQL data persistence

## Technology Stack
- **Frontend**: HTML, Tailwind CSS (CDN), Vanilla JavaScript
- **Blockchain**: Cardano blockchain integration via CIP-30
- **Wallet Support**: Yoroi, Nami, Lace, and other CIP-30 compatible wallets
- **Libraries**: @emurgo/cardano-serialization-lib (CDN)
- **Server**: Python HTTP server with API endpoints, cache control, and admin auth
- **Data**: PostgreSQL database (Replit built-in, persists across deployments)
- **Database Driver**: psycopg2-binary

## Project Structure
```
.
├── index.html          # Main application (homepage with beta registration CTA, stats)
├── register.html       # Registration page with referral link generation and sharing
├── admin.html          # Admin token distribution panel (protected by HTTP Basic Auth)
├── whitepaper.html     # SPORTSBEEP whitepaper
├── server.py           # Python HTTP server with API endpoints, auth, referral tracking
├── data/               # JSON data directory
│   ├── allocations.json  # Registration and allocation tracking
│   └── distributions.json # Distribution history
├── logo.png            # SPORTSBEEP logo
├── .gitignore          # Git ignore patterns
└── replit.md           # Project documentation
```

## Features
- **CIP-30 Wallet Integration**: Full support for all major Cardano wallets
  - Eternl (Browser & Mobile)
  - Nami (Browser Extension)
  - Yoroi (Browser & Mobile)
  - Lace (IOG Official)
  - Flint (Browser Extension)
  - GeroWallet (Built-in Swap)
  - Typhon (Hardware Support)
  - NuFi (Multi-chain)
  - VESPR (Mobile First)
  - Begin Wallet (dApp Browser)
  - And any other CIP-30 compatible wallet
- **Token Swap Interface**: Exchange ADA for $BEEP tokens (disabled until liquidity launch)
- **Registration System**: Wallet address registration for beta allocation
- **Referral Rewards**: 100 $BEEP per 10 verified referrals with unique referral codes (BEEP + 6 chars)
- **Allocation Tracker**: Admin panel tracks registrations, sets allocations, manages distributions
- **Dynamic Rate Adjustment**: Test different swap rates in real-time
- **Transaction Building**: Uses Cardano Serialization Library
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Automatic Wallet Detection**: Dynamically detects installed wallets with proper branding

## Key Configuration
- **Port**: 5000 (frontend)
- **Host**: 0.0.0.0 (allows proxy access)
- **Cache Control**: Disabled for development (no-cache headers)

## Token Information
- **Token**: $BEEP (SPORTSBEEP)
- **Total Supply**: 10,000,000 $BEEP
- **Founders Release**: 271 $BEEP
- **Default Rate**: 1 ADA = 5.48 $BEEP
- **Blockchain**: Cardano

## Development Notes
- The application requires a Cardano wallet browser extension (CIP-30 compatible)
- All external dependencies loaded via CDN
- No build process required - pure static HTML/CSS/JS
- Cache control headers prevent stale content during development

## Important Constants (in index.html)
- `SWAP_RECEIVING_ADDRESS`: Address for receiving ADA (currently mock)
- `BEEP_POLICY_ID`: a221e11c9d474ac3709911161bcfd02969d268e927089d3c55a4c3c2
- `BEEP_ASSET_NAME_HEX`: 42454550 (hex for "BEEP")

## API Endpoints (server.py)
- `POST /api/register` - Register wallet address (with optional referral code)
- `GET /api/allocations` - List all registrations (admin-only, requires Basic Auth)
- `POST /api/allocations/update` - Update allocation amount/status (admin-only)
- `GET /api/distributions` - Public distribution history (addresses truncated)
- `POST /api/distributions/add` - Record distribution (admin-only)
- `GET /api/stats` - Public stats (registration count, allocated, distributed totals)
- `GET /api/referral-stats?code=BEEPXXXXXX` - Get referral stats for a specific code

## User Flow
1. User visits homepage, sees "Join the Closed Beta" section with live stats
2. User clicks "Register for $BEEP Allocation" to go to /register.html
3. User submits wallet address and name to register
4. User receives unique referral code (BEEP + 6 alphanumeric chars)
5. User shares referral link via Telegram/X to earn 100 $BEEP per 10 referrals
6. Admin reviews registrations and sets allocations via admin panel
7. Admin sends tokens on-chain via CIP-30 transaction builder

## Admin Panel
- **URL**: /admin.html (protected by HTTP Basic Auth)
- **Default Password**: sportsbeep2026 (can be changed via ADMIN_PASSWORD environment variable)
- **Features**:
  - Server-side authentication (HTTP Basic Auth)
  - CIP-30 wallet connection with ADA and $BEEP balance display
  - Allocation tracker with referral count column
  - Token distribution form with address validation
  - Transaction builder using Cardano Serialization Library
  - Confirmation modal before sending
  - Distribution history with CSV export
  - Configurable Policy ID and Asset Name

## Recent Changes
- 2026-03-03: Fixed CSL transaction builder config
  - Added `ex_unit_prices` (memory + step prices) to TransactionBuilderConfigBuilder — required field in Babbage/Conway era
  - Added `prefer_pure_change(true)` for cleaner change outputs
  - Used step-by-step builder assignment (`cb = cb.method()`) for proper WASM ownership handling
  - Added protocol params `price_mem` and `price_step` from Koios to fetchNetworkParams
  - Added diagnostic CSL config test on admin page load (shows pass/fail in status indicator)
- 2026-03-03: Migrated data persistence from JSON files to PostgreSQL
  - All registration/allocation data now stored in PostgreSQL (survives redeployments)
  - Distribution history stored in PostgreSQL with proper ID-based deletion
  - Admin distribution history loads from server API instead of localStorage
  - Fixed transaction builder: explicitly adds token-bearing UTXOs as inputs, then uses LargestFirst coin selection for ADA UTXOs
  - Added DATABASE_URL validation at startup
- 2026-02-17: Built referral rewards system and registration flow
  - Created register.html with wallet registration form
  - Unique referral codes (BEEP + 6 chars) generated on registration
  - Referral tracking: 100 $BEEP per 10 verified referrals
  - Social sharing buttons for Telegram and X
  - Real-time referral stats display after registration
  - Server-side referral tracking in allocations.json
  - Added "Join the Closed Beta" section to homepage with live stats
  - Updated admin panel with referral count column in allocation tracker
  - Fixed admin panel API auth to use credentials: 'include' for same-origin requests
  - Added /api/register, /api/referral-stats, /api/stats endpoints
- 2025-11-17: Enabled mobile wallet connections
  - Added mobile device detection
  - Created mobile-specific connection modal with step-by-step instructions
  - Integrated deep links for Eternl and VESPR mobile wallets
  - Users on mobile are guided to use their wallet's built-in dApp browser
  - Automatically detects if already in wallet browser and shows normal connection flow
- 2025-11-17: Added $BEEP logo and favicon
  - Uploaded official $BEEP logo (logo.png)
  - Set as favicon for browser tabs
  - Added logo to navbar alongside text branding
  - Added logo to footer for consistent branding
- 2025-11-17: Integrated whitepaper and updated social links
  - Added complete SPORTSBEEP whitepaper (whitepaper.html)
  - Connected "READ WHITEPAPER" button to local whitepaper file
  - Updated footer social links: X (@playsportsbeep), Discord (@playsportsbeep), Telegram (https://t.me/sportsbeepnews)
- 2025-11-17: Added real-time price calculator
  - Integrated CoinGecko API for live ADA/USD prices
  - Real-time display of ADA price, $BEEP per ADA, and $BEEP USD value
  - Auto-updates every 30 seconds with exponential backoff on errors
  - Shows timestamp of last update with live countdown
  - Price alert system for stale data
  - Instant recalculation when swap rate changes
- 2025-11-17: Enhanced CIP-30 wallet integration
  - Added support for all major Cardano wallets (Eternl, Nami, Yoroi, Lace, Flint, GeroWallet, Typhon, NuFi, VESPR, Begin)
  - Improved wallet detection with proper icons and branding
  - Added "Supported Wallets" section to homepage
  - Enhanced wallet selection modal with better error messages
- 2025-11-17: Initial project setup in Replit environment
  - Configured Python HTTP server on port 5000 with address reuse
  - Added cache control headers for development
  - Created project documentation
  - Configured deployment settings

## Legal & Compliance
The application includes comprehensive legal disclaimers about:
- Risk warnings for digital assets
- Sales finality (non-refundable)
- User responsibility for wallet security

## Credits
Designed and engineered by LAD MEDIA
