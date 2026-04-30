import { useState, useEffect } from 'react';

interface Game {
  id: number;
  sport: string;
  sportIcon: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
  quarter: string;
  homeOdds: string;
  awayOdds: string;
  drawOdds?: string;
  spread: string;
  total: string;
  isLive: boolean;
  homeLogo: string;
  awayLogo: string;
}

interface PlayerStat {
  name: string;
  team: string;
  position: string;
  stat: string;
  value: string;
  sport: string;
}

const SPORTS_TABS = ['ALL', 'NFL', 'NBA', 'MLB', 'NHL', 'UFC', 'SOCCER'];

const MOCK_GAMES: Game[] = [
  {
    id: 1, sport: 'NBA', sportIcon: '🏀',
    homeTeam: 'Lakers', awayTeam: 'Celtics',
    homeScore: 87, awayScore: 91,
    status: 'LIVE', quarter: 'Q3 4:32',
    homeOdds: '-110', awayOdds: '-110', spread: 'CEL -3.5', total: 'O/U 224.5',
    isLive: true, homeLogo: 'LAL', awayLogo: 'BOS',
  },
  {
    id: 2, sport: 'NFL', sportIcon: '🏈',
    homeTeam: 'Chiefs', awayTeam: 'Eagles',
    homeScore: 21, awayScore: 14,
    status: 'LIVE', quarter: 'Q2 1:15',
    homeOdds: '-150', awayOdds: '+130', spread: 'KC -4.5', total: 'O/U 47.5',
    isLive: true, homeLogo: 'KC', awayLogo: 'PHI',
  },
  {
    id: 3, sport: 'MLB', sportIcon: '⚾',
    homeTeam: 'Yankees', awayTeam: 'Red Sox',
    homeScore: 3, awayScore: 2,
    status: 'LIVE', quarter: 'BOT 7th',
    homeOdds: '-130', awayOdds: '+110', spread: 'NYY -1.5', total: 'O/U 8.5',
    isLive: true, homeLogo: 'NYY', awayLogo: 'BOS',
  },
  {
    id: 4, sport: 'NHL', sportIcon: '🏒',
    homeTeam: 'Rangers', awayTeam: 'Bruins',
    homeScore: 2, awayScore: 2,
    status: 'LIVE', quarter: 'P3 11:20',
    homeOdds: '+105', awayOdds: '-125', spread: 'BOS -1.5 +175', total: 'O/U 5.5',
    isLive: true, homeLogo: 'NYR', awayLogo: 'BOS',
  },
  {
    id: 5, sport: 'NBA', sportIcon: '🏀',
    homeTeam: 'Warriors', awayTeam: 'Bucks',
    homeScore: 0, awayScore: 0,
    status: 'TONIGHT', quarter: '7:30 PM ET',
    homeOdds: '+120', awayOdds: '-140', spread: 'MIL -2.5', total: 'O/U 230.5',
    isLive: false, homeLogo: 'GSW', awayLogo: 'MIL',
  },
  {
    id: 6, sport: 'SOCCER', sportIcon: '⚽',
    homeTeam: 'Man City', awayTeam: 'Arsenal',
    homeScore: 1, awayScore: 1,
    status: 'LIVE', quarter: "73'",
    homeOdds: '+120', awayOdds: '+220', drawOdds: '+240', spread: 'ARS +0.5', total: 'O/U 2.5',
    isLive: true, homeLogo: 'MCI', awayLogo: 'ARS',
  },
  {
    id: 7, sport: 'UFC', sportIcon: '🥊',
    homeTeam: 'Jones', awayTeam: 'Miocic',
    homeScore: 0, awayScore: 0,
    status: 'SAT MAY 3', quarter: 'Main Event',
    homeOdds: '-320', awayOdds: '+260', spread: 'Jones -1.5', total: 'O/U 2.5 Rds',
    isLive: false, homeLogo: 'JJ', awayLogo: 'SM',
  },
  {
    id: 8, sport: 'NFL', sportIcon: '🏈',
    homeTeam: 'Ravens', awayTeam: 'Cowboys',
    homeScore: 0, awayScore: 0,
    status: 'SUN 1PM ET', quarter: 'Week 18',
    homeOdds: '-180', awayOdds: '+155', spread: 'BAL -4', total: 'O/U 44.5',
    isLive: false, homeLogo: 'BAL', awayLogo: 'DAL',
  },
];

const PLAYER_STATS: PlayerStat[] = [
  { name: 'LeBron James', team: 'LAL', position: 'F', stat: 'PTS', value: '28', sport: 'NBA' },
  { name: 'Jayson Tatum', team: 'BOS', position: 'F', stat: 'PTS', value: '31', sport: 'NBA' },
  { name: 'Patrick Mahomes', team: 'KC', position: 'QB', stat: 'PASS YDS', value: '287', sport: 'NFL' },
  { name: 'Aaron Judge', team: 'NYY', position: 'OF', stat: 'HR', value: '12', sport: 'MLB' },
  { name: 'Connor McDavid', team: 'EDM', position: 'C', stat: 'PTS', value: '3', sport: 'NHL' },
  { name: 'Erling Haaland', team: 'MCI', position: 'ST', stat: 'GOALS', value: '27', sport: 'SOCCER' },
];

function OddsButton({ label, value, highlight = false }: { label?: string; value: string; highlight?: boolean }) {
  return (
    <button
      className={`flex flex-col items-center justify-center rounded px-3 py-1.5 text-center transition-colors min-w-[64px] border ${
        highlight
          ? 'bg-primary/20 border-primary/60 hover:bg-primary/30'
          : 'bg-[hsl(222_40%_15%)] border-[hsl(222_30%_22%)] hover:bg-[hsl(222_40%_20%)] hover:border-primary/40'
      }`}
      data-testid="button-odds"
    >
      {label && <span className="text-[9px] text-muted-foreground uppercase tracking-wider leading-none mb-0.5">{label}</span>}
      <span className={`text-sm font-bold ${highlight ? 'text-primary' : 'text-white'}`}>{value}</span>
    </button>
  );
}

function TeamAbbr({ abbr }: { abbr: string }) {
  const colors: Record<string, string> = {
    LAL: 'bg-purple-900', BOS: 'bg-green-900', KC: 'bg-red-900', PHI: 'bg-green-800',
    NYY: 'bg-slate-800', GSW: 'bg-yellow-900', MIL: 'bg-green-900', NYR: 'bg-blue-900',
    MCI: 'bg-sky-900', ARS: 'bg-red-900', JJ: 'bg-slate-700', SM: 'bg-blue-900',
    BAL: 'bg-purple-900', DAL: 'bg-slate-800', EDM: 'bg-orange-900',
  };
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black text-white ${colors[abbr] || 'bg-card-border'} flex-shrink-0`}>
      {abbr.slice(0, 3)}
    </div>
  );
}

function GameCard({ game }: { game: Game }) {
  const [localHome, setLocalHome] = useState(game.homeScore);
  const [localAway, setLocalAway] = useState(game.awayScore);

  useEffect(() => {
    if (!game.isLive) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.08) {
        const scorer = Math.random() < 0.5 ? 'home' : 'away';
        const pts = [1, 2, 3][Math.floor(Math.random() * 3)];
        if (scorer === 'home') setLocalHome(h => h + pts);
        else setLocalAway(a => a + pts);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [game.isLive]);

  const homeWinning = localHome > localAway;
  const awayWinning = localAway > localHome;

  return (
    <div className="sport-card p-4 flex flex-col gap-3 min-w-[300px] sm:min-w-0" data-testid={`card-game-${game.id}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">{game.sportIcon}</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{game.sport}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {game.isLive && <span className="live-dot w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />}
          <span className={`text-[10px] font-bold uppercase tracking-wide ${game.isLive ? 'text-red-400' : 'text-muted-foreground'}`}>
            {game.status}
          </span>
          <span className="text-[10px] text-muted-foreground">· {game.quarter}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TeamAbbr abbr={game.awayLogo} />
            <span className={`font-bold text-sm ${awayWinning ? 'text-white' : 'text-muted-foreground'}`}>{game.awayTeam}</span>
          </div>
          {game.isLive || game.status === 'LIVE' ? (
            <span className={`text-xl font-black tabular-nums ${awayWinning ? 'text-white' : 'text-muted-foreground'}`}>{localAway}</span>
          ) : null}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TeamAbbr abbr={game.homeLogo} />
            <span className={`font-bold text-sm ${homeWinning ? 'text-white' : 'text-muted-foreground'}`}>{game.homeTeam}</span>
          </div>
          {game.isLive || game.status === 'LIVE' ? (
            <span className={`text-xl font-black tabular-nums ${homeWinning ? 'text-white' : 'text-muted-foreground'}`}>{localHome}</span>
          ) : null}
        </div>
      </div>

      <div className="flex gap-1.5 pt-1 border-t border-card-border">
        <OddsButton label={game.awayTeam} value={game.awayOdds} />
        {game.drawOdds && <OddsButton label="DRAW" value={game.drawOdds} />}
        <OddsButton label={game.homeTeam} value={game.homeOdds} />
        <OddsButton label="SPREAD" value={game.spread} />
        <OddsButton label="TOTAL" value={game.total} highlight />
      </div>
    </div>
  );
}

export default function LiveSportsPanel() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [activeView, setActiveView] = useState<'games' | 'players'>('games');

  const filtered = activeTab === 'ALL' ? MOCK_GAMES : MOCK_GAMES.filter(g => g.sport === activeTab);
  const liveCount = MOCK_GAMES.filter(g => g.isLive).length;

  return (
    <section className="bg-[hsl(222_47%_5%)] border-y border-card-border" data-testid="section-live-sports">
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="live-dot w-2.5 h-2.5 rounded-full bg-red-500" />
                <h2 className="text-white font-black text-lg uppercase tracking-wider">Live Odds & Scores</h2>
                <span className="bg-red-500/20 text-red-400 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">{liveCount} Live</span>
              </div>
              <p className="text-muted-foreground text-xs">Real-time data powered by $BEEP · This is what you're buying into</p>
            </div>
          </div>
          <div className="flex gap-1 bg-[hsl(222_40%_11%)] rounded-lg p-1">
            <button
              onClick={() => setActiveView('games')}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-colors ${activeView === 'games' ? 'bg-primary text-black' : 'text-muted-foreground hover:text-white'}`}
              data-testid="button-view-games"
            >Games</button>
            <button
              onClick={() => setActiveView('players')}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-colors ${activeView === 'players' ? 'bg-primary text-black' : 'text-muted-foreground hover:text-white'}`}
              data-testid="button-view-players"
            >Players</button>
          </div>
        </div>

        {/* Sport tabs */}
        <div className="flex gap-0.5 overflow-x-auto pb-0 scrollbar-none">
          {SPORTS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-white hover:border-card-border'
              }`}
              data-testid={`button-tab-${tab.toLowerCase()}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Games grid */}
      {activeView === 'games' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filtered.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      )}

      {/* Players view */}
      {activeView === 'players' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PLAYER_STATS.map((p, i) => (
              <div key={i} className="sport-card p-4 flex items-center gap-3" data-testid={`card-player-${i}`}>
                <div className="w-10 h-10 rounded-full bg-card-border flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                  {p.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-sm truncate">{p.name}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{p.team} · {p.position} · {p.sport}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-primary">{p.value}</div>
                  <div className="text-[10px] text-muted-foreground uppercase">{p.stat}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6 italic">Stats update in real-time on the live platform · Available to $BEEP holders</p>
        </div>
      )}

      {/* Bottom CTA strip */}
      <div className="bg-primary/10 border-t border-primary/20 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="text-sm font-bold text-white">
            <span className="text-primary">$BEEP holders</span> get full access to live odds, scores, player props & more
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span className="live-dot w-2 h-2 rounded-full bg-green-500" />
            Platform launching soon · Register now to secure your spot
          </div>
        </div>
      </div>
    </section>
  );
}
