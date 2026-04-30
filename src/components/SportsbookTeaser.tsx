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
    title: 'MLB Betting Lines',
    description: 'Every MLB game — full spread, total, and moneyline odds. Bet on any game with $BEEP tokens.',
    icon: '⚾',
    bgImage: '/screens/sb-mlb.png',
    bgPosition: '50% 20%',
    bgSize: 'cover',
    tag: '15 Games Today',
  },
  {
    title: 'NFL Lines + Active Wagers',
    description: 'See your open bets and live NFL lines in one view. Your $BEEP balance is your bankroll.',
    icon: '🏈',
    bgImage: '/screens/sb-nfl.png',
    bgPosition: '50% 30%',
    bgSize: 'cover',
    tag: 'Game Balance: 700 $BEEP',
  },
  {
    title: 'NHL Betting Board',
    description: 'Full NHL lines — Maple Leafs, Oilers, Knights and more. Spread, total, and ML on every game.',
    icon: '🏒',
    bgImage: '/screens/sb-nhl.png',
    bgPosition: '50% 35%',
    bgSize: 'cover',
  },
  {
    title: 'NBA Lines',
    description: 'Lakers vs Celtics. Warriors vs Nuggets. Live NBA spreads and totals, all bettable in $BEEP.',
    icon: '🏀',
    bgImage: '/screens/sb-nba.png',
    bgPosition: '50% 40%',
    bgSize: 'cover',
    tag: '5 Games',
  },
  {
    title: 'Active Wagers Tracker',
    description: 'See every open bet in real time. Moneyline bets on Edmonton, Dallas, Florida — all in $BEEP.',
    icon: '📋',
    bgImage: '/screens/sb-nfl.png',
    bgPosition: '50% 5%',
    bgSize: 'cover',
  },
  {
    title: 'Multi-Sport Dashboard',
    description: 'Switch between MLB, NFL, NBA and NHL in one interface. Your full sportsbook — powered by $BEEP.',
    icon: '🏆',
    bgImage: '/screens/sb-nba.png',
    bgPosition: '50% 5%',
    bgSize: 'cover',
    tag: 'Coming Soon',
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
            <span className="text-primary text-xs font-black uppercase tracking-widest">Real Platform · Live Now</span>
          </div>
          <h2 className="heading-font text-5xl sm:text-7xl text-white mb-4">
            THIS IS WHAT YOU'RE<br />
            <span className="text-primary glow-orange-text">BUYING INTO</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed">
            The <span className="text-primary font-bold">SPORTSBEEP platform is already built</span> and running.
            These are real screenshots. $BEEP tokens are your access pass — register now to secure Phase 1 pricing.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURE_CARDS.map((card, i) => (
            <div
              key={i}
              className="relative rounded-xl overflow-hidden border border-card-border group cursor-pointer"
              style={{ minHeight: 300 }}
              onClick={() => onNavigate('register')}
              data-testid={`card-feature-${i}`}
            >
              {/* Real screenshot background */}
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${card.bgImage})`,
                  backgroundPosition: card.bgPosition,
                  backgroundSize: card.bgSize,
                  backgroundRepeat: 'no-repeat',
                }}
              />

              {/* Dark gradient — lighter at top so screenshot reads, heavier at bottom for text */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to bottom, rgba(10,14,26,0.15) 0%, rgba(10,14,26,0.25) 35%, rgba(10,14,26,0.80) 65%, rgba(10,14,26,0.97) 100%)',
                }}
              />

              {/* Hover ring */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/40 transition-colors duration-300" />

              {/* Top tag */}
              {card.tag && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-primary/90 text-black text-[9px] font-black px-2.5 py-1 rounded uppercase tracking-wider shadow-lg">
                    {card.tag}
                  </span>
                </div>
              )}

              {/* Lock badge top-right */}
              <div className="absolute top-3 right-3 z-10">
                <div className="flex items-center gap-1.5 bg-black/60 border border-white/15 rounded-full px-2 py-1 backdrop-blur-sm">
                  <span className="text-[10px]">🔒</span>
                  <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wide">$BEEP Required</span>
                </div>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-lg">{card.icon}</span>
                  <span className="text-white font-black text-sm uppercase tracking-wide">{card.title}</span>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed mb-3">{card.description}</p>
                <button
                  className="w-full py-2.5 bg-primary/20 hover:bg-primary border border-primary/50 hover:border-primary text-primary hover:text-black text-xs font-black uppercase tracking-wider rounded transition-all duration-200"
                  data-testid={`button-feature-unlock-${i}`}
                >
                  Get Access — Register Free
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Authenticity note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
          <span>Screenshots taken from the live SPORTSBEEP platform · Not mockups</span>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
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
