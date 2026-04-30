import { useState, useEffect } from 'react';

interface TeaserProps {
  onNavigate: (v: string) => void;
}

function LockOverlay({ onNavigate }: { onNavigate: (v: string) => void }) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl"
      style={{ background: 'linear-gradient(to bottom, rgba(10,14,26,0.3) 0%, rgba(10,14,26,0.92) 60%, rgba(10,14,26,1) 100%)' }}>
      <div className="flex flex-col items-center gap-3 px-4 text-center">
        <div className="w-11 h-11 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xl mb-1">🔒</div>
        <p className="text-white font-black text-base uppercase tracking-wide">Unlock with $BEEP</p>
        <p className="text-muted-foreground text-xs max-w-[200px] leading-relaxed">Register for Phase 1 to get full access to the platform</p>
        <button
          onClick={() => onNavigate('register')}
          className="mt-1 px-5 py-2.5 bg-primary hover:bg-orange-500 text-black font-black uppercase tracking-wider rounded text-xs glow-orange transition-all"
          data-testid="button-teaser-unlock"
        >
          Get $BEEP — Register Free
        </button>
      </div>
    </div>
  );
}

/* ── BET SLIP ─────────────────────────────────────────── */
function BetSlipTeaser({ onNavigate }: { onNavigate: (v: string) => void }) {
  const legs = [
    { team: 'Chiefs ML', odds: '-150', game: 'KC vs PHI', sport: '🏈' },
    { team: 'Celtics -3.5', odds: '-110', game: 'BOS vs LAL', sport: '🏀' },
    { team: 'Over 224.5', odds: '-110', game: 'BOS vs LAL', sport: '🏀' },
  ];
  const combo = (-150 / 100) * (110 / 100) * (110 / 100);
  return (
    <div className="relative bg-card border border-card-border rounded-xl overflow-hidden">
      <LockOverlay onNavigate={onNavigate} />
      <div className="filter blur-[2px] pointer-events-none select-none">
        <div className="bg-[hsl(222_47%_9%)] border-b border-card-border px-4 py-3 flex items-center justify-between">
          <span className="text-white font-black text-sm uppercase tracking-wider">Bet Slip</span>
          <span className="bg-primary text-black text-[10px] font-black px-2 py-0.5 rounded-full">{legs.length}</span>
        </div>
        <div className="p-3 flex flex-col gap-2">
          {legs.map((leg, i) => (
            <div key={i} className="bg-[hsl(222_40%_13%)] rounded-lg p-3 flex items-start justify-between gap-2 border border-card-border">
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-muted-foreground mb-0.5">{leg.sport} {leg.game}</div>
                <div className="text-white font-bold text-sm truncate">{leg.team}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-primary font-black text-sm">{leg.odds}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="px-3 pb-3 flex flex-col gap-2">
          <div className="bg-[hsl(222_40%_13%)] rounded-lg p-3 border border-card-border">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground font-semibold">Parlay Odds</span>
              <span className="text-primary font-black">+{Math.round(combo * 100)}%</span>
            </div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground font-semibold">Stake</span>
              <span className="text-white font-black">500 $BEEP</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground font-semibold">To Win</span>
              <span className="text-green-400 font-black">1,240 $BEEP</span>
            </div>
          </div>
          <button className="w-full py-3 bg-primary text-black font-black uppercase text-sm rounded tracking-wide">
            Place Parlay
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── SAME GAME PARLAY ─────────────────────────────────── */
function SGPTeaser({ onNavigate }: { onNavigate: (v: string) => void }) {
  const [selected, setSelected] = useState([0, 2]);
  const options = [
    { label: 'Mahomes 300+ Pass Yds', odds: '-115' },
    { label: 'Kelce 75+ Rec Yds', odds: '+110' },
    { label: 'Chiefs Win', odds: '-150' },
    { label: 'Over 47.5 Total', odds: '-110' },
    { label: 'Eagles Cover +4.5', odds: '-110' },
    { label: 'Hurts 1+ Rush TD', odds: '+130' },
  ];
  return (
    <div className="relative bg-card border border-card-border rounded-xl overflow-hidden">
      <LockOverlay onNavigate={onNavigate} />
      <div className="filter blur-[2px] pointer-events-none select-none">
        <div className="bg-[hsl(222_47%_9%)] border-b border-card-border px-4 py-3 flex items-center gap-2">
          <span className="text-white font-black text-sm uppercase tracking-wider">Same-Game Parlay</span>
          <span className="text-[10px] text-primary font-bold">🏈 Chiefs vs Eagles</span>
        </div>
        <div className="p-3 flex flex-col gap-1.5">
          {options.map((o, i) => (
            <div
              key={i}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 border transition-colors ${
                selected.includes(i) ? 'bg-primary/20 border-primary/50' : 'bg-[hsl(222_40%_13%)] border-card-border'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${selected.includes(i) ? 'bg-primary border-primary' : 'border-card-border'}`}>
                  {selected.includes(i) && <span className="text-black text-[9px] font-black">✓</span>}
                </div>
                <span className={`text-xs font-semibold ${selected.includes(i) ? 'text-white' : 'text-muted-foreground'}`}>{o.label}</span>
              </div>
              <span className={`text-xs font-black ${selected.includes(i) ? 'text-primary' : 'text-muted-foreground'}`}>{o.odds}</span>
            </div>
          ))}
        </div>
        <div className="px-3 pb-3">
          <div className="bg-[hsl(222_40%_13%)] rounded-lg p-3 border border-card-border mb-2 flex justify-between text-xs">
            <span className="text-muted-foreground">SGP Odds ({selected.length} legs)</span>
            <span className="text-primary font-black">+{185 + selected.length * 40}</span>
          </div>
          <button className="w-full py-2.5 bg-primary text-black font-black uppercase text-xs rounded tracking-wide">Add to Bet Slip</button>
        </div>
      </div>
    </div>
  );
}

/* ── ODDS BOOSTS ──────────────────────────────────────── */
function BoostsTeaser({ onNavigate }: { onNavigate: (v: string) => void }) {
  const boosts = [
    { title: 'LeBron 30+ Points', from: '+150', to: '+220', sport: '🏀', expires: '2:14:33' },
    { title: 'Mahomes 3+ TDs', from: '+180', to: '+300', sport: '🏈', expires: '4:02:11' },
    { title: 'Man City & Over 2.5', from: '+140', to: '+240', sport: '⚽', expires: '0:44:09' },
    { title: 'Judge HR Today', from: '+280', to: '+450', sport: '⚾', expires: '1:30:00' },
  ];
  return (
    <div className="relative bg-card border border-card-border rounded-xl overflow-hidden">
      <LockOverlay onNavigate={onNavigate} />
      <div className="filter blur-[2px] pointer-events-none select-none">
        <div className="bg-[hsl(222_47%_9%)] border-b border-card-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <span className="text-white font-black text-sm uppercase tracking-wider">Odds Boosts</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-bold uppercase">Today Only</span>
        </div>
        <div className="p-3 flex flex-col gap-2">
          {boosts.map((b, i) => (
            <div key={i} className="bg-[hsl(222_40%_13%)] rounded-lg p-3 border border-card-border">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-muted-foreground mb-0.5">{b.sport} Boost</div>
                  <div className="text-white font-bold text-sm">{b.title}</div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-muted-foreground line-through text-xs">{b.from}</span>
                  <span className="text-green-400 font-black text-base">{b.to}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className="live-dot w-1.5 h-1.5 rounded-full bg-red-500" />
                  Expires {b.expires}
                </div>
                <button className="px-3 py-1 bg-primary/20 border border-primary/40 text-primary text-[10px] font-black uppercase rounded tracking-wide">Add</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── MY BETS ──────────────────────────────────────────── */
function MyBetsTeaser({ onNavigate }: { onNavigate: (v: string) => void }) {
  const bets = [
    { desc: 'Lakers ML', odds: '+100', stake: '200 $BEEP', toWin: '200 $BEEP', status: 'live', progress: 62 },
    { desc: 'Celtics -3.5', odds: '-110', stake: '110 $BEEP', toWin: '100 $BEEP', status: 'live', progress: 78 },
    { desc: 'Chiefs / Eagles Parlay', odds: '+285', stake: '100 $BEEP', toWin: '385 $BEEP', status: 'pending', progress: 0 },
    { desc: 'Over 224.5 (LAL/BOS)', odds: '-110', stake: '110 $BEEP', toWin: '100 $BEEP', status: 'won', progress: 100 },
  ];

  const statusColors: Record<string, string> = {
    live: 'text-red-400 bg-red-500/10 border-red-500/20',
    pending: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    won: 'text-green-400 bg-green-500/10 border-green-500/20',
    lost: 'text-muted-foreground bg-muted/10 border-muted/20',
  };

  return (
    <div className="relative bg-card border border-card-border rounded-xl overflow-hidden">
      <LockOverlay onNavigate={onNavigate} />
      <div className="filter blur-[2px] pointer-events-none select-none">
        <div className="bg-[hsl(222_47%_9%)] border-b border-card-border px-4 py-3 flex items-center justify-between">
          <span className="text-white font-black text-sm uppercase tracking-wider">My Bets</span>
          <div className="flex gap-2 text-[10px] font-bold">
            <span className="text-primary">Active: 3</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-green-400">Won: 1</span>
          </div>
        </div>
        <div className="p-3 flex flex-col gap-2">
          {bets.map((b, i) => (
            <div key={i} className="bg-[hsl(222_40%_13%)] rounded-lg p-3 border border-card-border">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm truncate">{b.desc}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{b.stake} staked · {b.toWin} to win</div>
                </div>
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border flex-shrink-0 ${statusColors[b.status]}`}>
                  {b.status === 'live' ? '● ' : ''}{b.status}
                </span>
              </div>
              {b.status === 'live' && (
                <div className="w-full h-1 bg-card-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${b.progress}%` }} />
                </div>
              )}
              {b.status === 'won' && (
                <div className="w-full h-1 bg-green-500/30 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="px-3 pb-3">
          <div className="bg-[hsl(222_40%_13%)] border border-card-border rounded-lg p-3 flex justify-between text-xs">
            <span className="text-muted-foreground font-semibold">Total Wagered</span>
            <span className="text-white font-black">520 $BEEP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── LIVE IN-PLAY ─────────────────────────────────────── */
function LiveBettingTeaser({ onNavigate }: { onNavigate: (v: string) => void }) {
  const [odds, setOdds] = useState([
    { label: 'Lakers Next Score', options: [{ name: 'LeBron James', val: '+180' }, { name: 'AD', val: '+220' }, { name: 'Team FG', val: '-160' }] },
    { label: 'BOS Next TD Driver', options: [{ name: 'Tatum Drive', val: '+200' }, { name: 'Brown Cut', val: '+250' }, { name: 'White 3', val: '+350' }] },
  ]);

  useEffect(() => {
    const t = setInterval(() => {
      setOdds(prev => prev.map(market => ({
        ...market,
        options: market.options.map(o => {
          const num = parseInt(o.val.replace('+', ''));
          const shift = Math.floor((Math.random() - 0.5) * 20);
          const newNum = num + shift;
          return { ...o, val: newNum >= 0 ? `+${newNum}` : `${newNum}` };
        }),
      })));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative bg-card border border-card-border rounded-xl overflow-hidden">
      <LockOverlay onNavigate={onNavigate} />
      <div className="filter blur-[2px] pointer-events-none select-none">
        <div className="bg-[hsl(222_47%_9%)] border-b border-card-border px-4 py-3 flex items-center gap-2">
          <span className="live-dot w-2 h-2 rounded-full bg-red-500" />
          <span className="text-white font-black text-sm uppercase tracking-wider">Live In-Play</span>
          <span className="text-red-400 text-[10px] font-bold">Odds updating live</span>
        </div>
        <div className="p-3 flex flex-col gap-3">
          {odds.map((market, mi) => (
            <div key={mi}>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">{market.label}</p>
              <div className="flex gap-1.5">
                {market.options.map((opt, oi) => (
                  <div key={oi} className="flex-1 bg-[hsl(222_40%_13%)] border border-card-border rounded-lg px-2 py-2 text-center">
                    <div className="text-[9px] text-muted-foreground truncate mb-1">{opt.name}</div>
                    <div className="text-primary font-black text-sm tabular-nums">{opt.val}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-primary font-bold uppercase tracking-wider">20+ Live Markets Available</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Microbets · Next Play · Drive Outcomes</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── LEADERBOARD ──────────────────────────────────────── */
function LeaderboardTeaser({ onNavigate }: { onNavigate: (v: string) => void }) {
  const leaders = [
    { rank: 1, name: 'whale_xxxxxxx', profit: '+12,440', winRate: '67%', badge: '🥇' },
    { rank: 2, name: 'beeper_xxx', profit: '+8,220', winRate: '61%', badge: '🥈' },
    { rank: 3, name: 'cardano_xxxx', profit: '+6,100', winRate: '59%', badge: '🥉' },
    { rank: 4, name: 'you?', profit: '---', winRate: '---', badge: '?' },
  ];
  return (
    <div className="relative bg-card border border-card-border rounded-xl overflow-hidden">
      <LockOverlay onNavigate={onNavigate} />
      <div className="filter blur-[2px] pointer-events-none select-none">
        <div className="bg-[hsl(222_47%_9%)] border-b border-card-border px-4 py-3 flex items-center justify-between">
          <span className="text-white font-black text-sm uppercase tracking-wider">🏆 Weekly Leaderboard</span>
          <span className="text-[10px] text-muted-foreground font-bold">Resets in 2d 14h</span>
        </div>
        <div className="p-3 flex flex-col gap-2">
          {leaders.map((l, i) => (
            <div key={i} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 border ${l.rank <= 3 ? 'bg-[hsl(222_40%_13%)] border-card-border' : 'bg-primary/10 border-primary/30'}`}>
              <span className="text-lg w-7 text-center">{l.badge}</span>
              <div className="flex-1 min-w-0">
                <div className={`font-bold text-sm ${l.rank === 4 ? 'text-primary italic' : 'text-white'}`}>{l.name}</div>
                <div className="text-[10px] text-muted-foreground">Win rate: {l.winRate}</div>
              </div>
              <div className={`text-right font-black text-sm ${l.rank === 4 ? 'text-muted-foreground' : 'text-green-400'}`}>{l.profit}</div>
            </div>
          ))}
        </div>
        <div className="px-3 pb-3">
          <div className="bg-[hsl(222_40%_13%)] border border-card-border rounded-lg p-2.5 text-center text-[10px] text-muted-foreground">
            Top 10 weekly earners receive <span className="text-primary font-black">bonus $BEEP</span> rewards
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN EXPORT ──────────────────────────────────────── */
export default function SportsbookTeaser({ onNavigate }: TeaserProps) {
  return (
    <section className="py-20 bg-[hsl(222_47%_5%)] border-t border-card-border relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(247,118,13,0.05) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-5">
            <span className="live-dot w-2 h-2 rounded-full bg-primary" />
            <span className="text-primary text-xs font-black uppercase tracking-widest">Platform Preview</span>
          </div>
          <h2 className="heading-font text-5xl sm:text-7xl text-white mb-4">
            THIS IS WHAT YOU'RE<br /><span className="text-primary glow-orange-text">BUYING INTO</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed">
            A real sportsbook powered by <span className="text-primary font-bold">$BEEP tokens</span>. 
            Bet, build parlays, track wins, climb the leaderboard — all on-chain, all yours. 
            Register now to secure your Phase 1 allocation.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <BetSlipTeaser onNavigate={onNavigate} />
          <SGPTeaser onNavigate={onNavigate} />
          <BoostsTeaser onNavigate={onNavigate} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MyBetsTeaser onNavigate={onNavigate} />
          <LiveBettingTeaser onNavigate={onNavigate} />
          <LeaderboardTeaser onNavigate={onNavigate} />
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm mb-4">
            Full platform access requires <span className="text-primary font-bold">$BEEP tokens</span> · Phase 1 pricing locked at $0.12
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onNavigate('register')}
              className="px-8 py-3.5 bg-primary hover:bg-orange-500 text-black font-black uppercase tracking-wider rounded glow-orange transition-all text-sm"
              data-testid="button-teaser-cta-main"
            >
              Register Free — Claim $BEEP
            </button>
            <a
              href="#bundles"
              className="px-8 py-3.5 border border-white/20 text-white hover:border-primary hover:text-primary font-bold uppercase tracking-wider rounded transition-all text-sm flex items-center justify-center"
            >
              Buy Tokens Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
