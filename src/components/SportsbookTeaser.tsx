interface TeaserProps {
  onNavigate: (v: string) => void;
}

interface FeatureCard {
  title: string;
  description: string;
  icon: string;
  bgImage: string;
  bgPosition: string;
  bgSize: string;
  tag?: string;
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    title: 'Live Odds & Scores',
    description: 'Real-time odds on every game — NBA, NFL, MLB, NHL, Soccer & UFC — updated as the action happens.',
    icon: '📡',
    bgImage: '/screens/fullpage.jpg',
    bgPosition: '0% 26%',
    bgSize: '100%',
    tag: 'Live Now',
  },
  {
    title: 'Game Betting Lines',
    description: 'Moneyline, spread, and totals for every matchup. Click any game to see the full board and place your bet.',
    icon: '📊',
    bgImage: '/screens/fullpage.jpg',
    bgPosition: '50% 30%',
    bgSize: '120%',
  },
  {
    title: 'Same-Game Parlays',
    description: 'Stack multiple outcomes from a single game into one bet. Higher risk, massive $BEEP payouts.',
    icon: '⚡',
    bgImage: '/screens/hero.jpg',
    bgPosition: '0% 0%',
    bgSize: '100%',
    tag: 'Fan Favourite',
  },
  {
    title: 'Player Props',
    description: 'Bet on individual player performances — points, yards, strikeouts, shots on target and more.',
    icon: '🏆',
    bgImage: '/screens/fullpage.jpg',
    bgPosition: '100% 32%',
    bgSize: '160%',
  },
  {
    title: 'Live In-Play Betting',
    description: 'Micro-bet in real time as the game unfolds. Next score, next drive, next possession — all live.',
    icon: '🔴',
    bgImage: '/screens/fullpage.jpg',
    bgPosition: '30% 28%',
    bgSize: '130%',
    tag: 'Real-Time',
  },
  {
    title: 'Weekly Leaderboard',
    description: 'Compete against other $BEEP holders. Top earners win bonus token rewards every week.',
    icon: '🥇',
    bgImage: '/screens/fullpage.jpg',
    bgPosition: '70% 22%',
    bgSize: '110%',
  },
];

export default function SportsbookTeaser({ onNavigate }: TeaserProps) {
  return (
    <section className="py-20 bg-[hsl(222_47%_5%)] border-t border-card-border relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(247,118,13,0.06) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-1.5 mb-5">
            <span className="live-dot w-2 h-2 rounded-full bg-primary" />
            <span className="text-primary text-xs font-black uppercase tracking-widest">Platform Preview</span>
          </div>
          <h2 className="heading-font text-5xl sm:text-7xl text-white mb-4">
            THIS IS WHAT YOU'RE<br />
            <span className="text-primary glow-orange-text">BUYING INTO</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed">
            A real sportsbook powered by <span className="text-primary font-bold">$BEEP tokens</span>.
            Bet, build parlays, track wins, climb the leaderboard — all on-chain, all yours.
            Register now to secure your Phase 1 allocation.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURE_CARDS.map((card, i) => (
            <div
              key={i}
              className="relative rounded-xl overflow-hidden border border-card-border group cursor-pointer"
              style={{ minHeight: 280 }}
              onClick={() => onNavigate('register')}
              data-testid={`card-feature-${i}`}
            >
              {/* Screenshot background */}
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${card.bgImage})`,
                  backgroundPosition: card.bgPosition,
                  backgroundSize: card.bgSize,
                  backgroundRepeat: 'no-repeat',
                }}
              />

              {/* Dark gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to bottom, rgba(10,14,26,0.35) 0%, rgba(10,14,26,0.55) 40%, rgba(10,14,26,0.92) 75%, rgba(10,14,26,1) 100%)',
                }}
              />

              {/* Top tag */}
              {card.tag && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-primary/90 text-black text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    {card.tag}
                  </span>
                </div>
              )}

              {/* Lock icon top-right */}
              <div className="absolute top-3 right-3 z-10">
                <div className="w-7 h-7 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-xs backdrop-blur-sm">
                  🔒
                </div>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-base">{card.icon}</span>
                  <span className="text-white font-black text-sm uppercase tracking-wide">{card.title}</span>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed mb-3">{card.description}</p>
                <button
                  className="w-full py-2 bg-primary/20 hover:bg-primary border border-primary/50 hover:border-primary text-primary hover:text-black text-xs font-black uppercase tracking-wider rounded transition-all"
                  data-testid={`button-feature-unlock-${i}`}
                >
                  Unlock with $BEEP — Register Free
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm mb-4">
            Full platform access requires{' '}
            <span className="text-primary font-bold">$BEEP tokens</span> · Phase 1 pricing locked at $0.12
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
              onClick={e => {
                e.preventDefault();
                document.querySelector('#bundles')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Buy Tokens Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
