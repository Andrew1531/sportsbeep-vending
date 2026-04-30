import { useState, useEffect, useCallback } from 'react';

interface Prop {
  player: string;
  team: string;
  market: string;
  over: string;
  under: string;
  line: string;
}

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
  spreadHome: string;
  spreadAway: string;
  total: string;
  isLive: boolean;
  homeLogo: string;
  awayLogo: string;
  props: Prop[];
}

interface PlayerStat {
  name: string;
  team: string;
  position: string;
  stat: string;
  value: string;
  sport: string;
}

// Games sourced from VegasInsider.com — April 30, 2026
const SPORTS_TABS = ['ALL', 'NBA', 'NHL', 'MLB'];

const MOCK_GAMES: Game[] = [
  // ── NBA PLAYOFFS ──────────────────────────────────────────────
  {
    id: 1, sport: 'NBA', sportIcon: '🏀',
    homeTeam: 'Knicks', awayTeam: 'Hawks',
    homeScore: 0, awayScore: 0,
    status: 'PLAYOFFS', quarter: '7:00 PM ET',
    homeOdds: '-135', awayOdds: '+115',
    spread: 'NYK -2.5', spreadHome: '-2.5 (-115)', spreadAway: '+2.5 (-105)',
    total: 'O/U 218.5',
    isLive: false, homeLogo: 'NYK', awayLogo: 'ATL',
    props: [
      { player: 'Jalen Brunson', team: 'NYK', market: 'Points', over: '-115', under: '-105', line: '26.5' },
      { player: 'Trae Young', team: 'ATL', market: 'Points', over: '-110', under: '-110', line: '24.5' },
      { player: 'Karl-Anthony Towns', team: 'NYK', market: 'Rebounds', over: '-115', under: '-105', line: '9.5' },
      { player: 'Trae Young', team: 'ATL', market: 'Assists', over: '-110', under: '-110', line: '8.5' },
    ],
  },
  {
    id: 2, sport: 'NBA', sportIcon: '🏀',
    homeTeam: 'Celtics', awayTeam: '76ers',
    homeScore: 0, awayScore: 0,
    status: 'PLAYOFFS', quarter: '8:00 PM ET',
    homeOdds: '-340', awayOdds: '+280',
    spread: 'BOS -8.5', spreadHome: '-8.5 (-110)', spreadAway: '+8.5 (-110)',
    total: 'O/U 214.5',
    isLive: false, homeLogo: 'BOS', awayLogo: 'PHI',
    props: [
      { player: 'Jayson Tatum', team: 'BOS', market: 'Points', over: '-120', under: '+100', line: '29.5' },
      { player: 'Joel Embiid', team: 'PHI', market: 'Points', over: '-110', under: '-110', line: '26.5' },
      { player: 'Jaylen Brown', team: 'BOS', market: 'Points', over: '-115', under: '-105', line: '24.5' },
      { player: 'Tyrese Maxey', team: 'PHI', market: 'Assists', over: '-110', under: '-110', line: '6.5' },
    ],
  },
  {
    id: 3, sport: 'NBA', sportIcon: '🏀',
    homeTeam: 'Timberwolves', awayTeam: 'Nuggets',
    homeScore: 0, awayScore: 0,
    status: 'PLAYOFFS', quarter: '9:30 PM ET',
    homeOdds: '+105', awayOdds: '-125',
    spread: 'DEN -1.5', spreadHome: '+1.5 (-115)', spreadAway: '-1.5 (-105)',
    total: 'O/U 216.5',
    isLive: false, homeLogo: 'MIN', awayLogo: 'DEN',
    props: [
      { player: 'Nikola Jokic', team: 'DEN', market: 'Points', over: '-115', under: '-105', line: '29.5' },
      { player: 'Anthony Edwards', team: 'MIN', market: 'Points', over: '-110', under: '-110', line: '27.5' },
      { player: 'Nikola Jokic', team: 'DEN', market: 'Rebounds', over: '-115', under: '-105', line: '12.5' },
      { player: 'Rudy Gobert', team: 'MIN', market: 'Blocks', over: '+110', under: '-130', line: '1.5' },
    ],
  },
  // ── NHL PLAYOFFS ───────────────────────────────────────────────
  {
    id: 4, sport: 'NHL', sportIcon: '🏒',
    homeTeam: 'Wild', awayTeam: 'Stars',
    homeScore: 0, awayScore: 0,
    status: 'PLAYOFFS', quarter: '7:30 PM ET',
    homeOdds: '-120', awayOdds: '+102',
    spread: 'MIN -1.5 +185', spreadHome: '-1.5 (+185)', spreadAway: '+1.5 (-220)',
    total: 'O/U 5.5',
    isLive: false, homeLogo: 'MIN', awayLogo: 'DAL',
    props: [
      { player: 'Jason Robertson', team: 'DAL', market: 'Points', over: '+115', under: '-135', line: '0.5' },
      { player: 'Kirill Kaprizov', team: 'MIN', market: 'Goals', over: '+185', under: '-225', line: '0.5' },
      { player: 'Jake Oettinger', team: 'DAL', market: 'Saves', over: '-120', under: '+100', line: '27.5' },
    ],
  },
  {
    id: 5, sport: 'NHL', sportIcon: '🏒',
    homeTeam: 'Oilers', awayTeam: 'Ducks',
    homeScore: 0, awayScore: 0,
    status: 'PLAYOFFS', quarter: '10:00 PM ET',
    homeOdds: '-240', awayOdds: '+200',
    spread: 'EDM -1.5 (+130)', spreadHome: '-1.5 (+130)', spreadAway: '+1.5 (-155)',
    total: 'O/U 5.5',
    isLive: false, homeLogo: 'EDM', awayLogo: 'ANA',
    props: [
      { player: 'Connor McDavid', team: 'EDM', market: 'Points', over: '-130', under: '+110', line: '0.5' },
      { player: 'Leon Draisaitl', team: 'EDM', market: 'Goals', over: '+160', under: '-190', line: '0.5' },
      { player: 'Stuart Skinner', team: 'EDM', market: 'Saves', over: '-110', under: '-110', line: '26.5' },
    ],
  },
  // ── MLB ────────────────────────────────────────────────────────
  {
    id: 6, sport: 'MLB', sportIcon: '⚾',
    homeTeam: 'Pirates', awayTeam: 'Cardinals',
    homeScore: 0, awayScore: 0,
    status: 'FINAL', quarter: '12:35 PM ET',
    homeOdds: '-220', awayOdds: '+189',
    spread: 'PIT -1.5', spreadHome: '-1.5 (+160)', spreadAway: '+1.5 (-185)',
    total: 'O/U 8.5',
    isLive: false, homeLogo: 'PIT', awayLogo: 'STL',
    props: [
      { player: 'Paul Skenes', team: 'PIT', market: 'Strikeouts', over: '-115', under: '-105', line: '7.5' },
      { player: 'Nolan Arenado', team: 'STL', market: 'Total Bases', over: '-110', under: '-110', line: '1.5' },
      { player: 'Oneil Cruz', team: 'PIT', market: 'Hits', over: '-120', under: '+100', line: '0.5' },
    ],
  },
  {
    id: 7, sport: 'MLB', sportIcon: '⚾',
    homeTeam: 'Nationals', awayTeam: 'Mets',
    homeScore: 0, awayScore: 0,
    status: 'TODAY', quarter: '1:10 PM ET',
    homeOdds: '+130', awayOdds: '-150',
    spread: 'NYM -1.5', spreadHome: '+1.5 (-165)', spreadAway: '-1.5 (+145)',
    total: 'O/U 8.5',
    isLive: false, homeLogo: 'WSH', awayLogo: 'NYM',
    props: [
      { player: 'Pete Alonso', team: 'NYM', market: 'Home Runs', over: '+260', under: '-320', line: '0.5' },
      { player: 'Francisco Lindor', team: 'NYM', market: 'Total Bases', over: '-115', under: '-105', line: '1.5' },
      { player: 'Juan Soto', team: 'NYM', market: 'RBIs', over: '-110', under: '-110', line: '0.5' },
    ],
  },
  {
    id: 8, sport: 'MLB', sportIcon: '⚾',
    homeTeam: 'Orioles', awayTeam: 'Astros',
    homeScore: 0, awayScore: 0,
    status: 'LIVE', quarter: 'BOT 5th',
    homeOdds: '+110', awayOdds: '-130',
    spread: 'HOU -1.5', spreadHome: '+1.5 (-170)', spreadAway: '-1.5 (+150)',
    total: 'O/U 8.5',
    isLive: true, homeLogo: 'BAL', awayLogo: 'HOU',
    props: [
      { player: 'Jose Altuve', team: 'HOU', market: 'Total Bases', over: '-110', under: '-110', line: '1.5' },
      { player: 'Yordan Alvarez', team: 'HOU', market: 'Home Runs', over: '+235', under: '-280', line: '0.5' },
      { player: 'Adley Rutschman', team: 'BAL', market: 'Hits', over: '-120', under: '+100', line: '0.5' },
    ],
  },
  {
    id: 9, sport: 'MLB', sportIcon: '⚾',
    homeTeam: 'Phillies', awayTeam: 'Giants',
    homeScore: 0, awayScore: 0,
    status: 'TONIGHT', quarter: '5:35 PM ET',
    homeOdds: '-155', awayOdds: '+135',
    spread: 'PHI -1.5', spreadHome: '-1.5 (+145)', spreadAway: '+1.5 (-165)',
    total: 'O/U 8.0',
    isLive: false, homeLogo: 'PHI', awayLogo: 'SF',
    props: [
      { player: 'Bryce Harper', team: 'PHI', market: 'Total Bases', over: '-115', under: '-105', line: '1.5' },
      { player: 'Trea Turner', team: 'PHI', market: 'Stolen Bases', over: '+210', under: '-255', line: '0.5' },
      { player: 'Matt Chapman', team: 'SF', market: 'RBIs', over: '-110', under: '-110', line: '0.5' },
    ],
  },
  {
    id: 10, sport: 'MLB', sportIcon: '⚾',
    homeTeam: 'Twins', awayTeam: 'Blue Jays',
    homeScore: 0, awayScore: 0,
    status: 'TONIGHT', quarter: '7:40 PM ET',
    homeOdds: '-115', awayOdds: '-105',
    spread: 'MIN -1.5', spreadHome: '-1.5 (+165)', spreadAway: '+1.5 (-190)',
    total: 'O/U 8.0',
    isLive: false, homeLogo: 'MIN', awayLogo: 'TOR',
    props: [
      { player: 'Vladimir Guerrero Jr.', team: 'TOR', market: 'Home Runs', over: '+250', under: '-300', line: '0.5' },
      { player: 'Byron Buxton', team: 'MIN', market: 'Total Bases', over: '-110', under: '-110', line: '1.5' },
      { player: 'Bo Bichette', team: 'TOR', market: 'Hits', over: '-130', under: '+110', line: '0.5' },
    ],
  },
  {
    id: 11, sport: 'MLB', sportIcon: '⚾',
    homeTeam: 'Tigers', awayTeam: 'Braves',
    homeScore: 0, awayScore: 0,
    status: 'TONIGHT', quarter: '7:40 PM ET',
    homeOdds: '+125', awayOdds: '-145',
    spread: 'ATL -1.5', spreadHome: '+1.5 (-175)', spreadAway: '-1.5 (+155)',
    total: 'O/U 8.5',
    isLive: false, homeLogo: 'DET', awayLogo: 'ATL',
    props: [
      { player: 'Ronald Acuña Jr.', team: 'ATL', market: 'Stolen Bases', over: '+165', under: '-200', line: '0.5' },
      { player: 'Marcell Ozuna', team: 'ATL', market: 'RBIs', over: '-110', under: '-110', line: '0.5' },
      { player: 'Spencer Torkelson', team: 'DET', market: 'Total Bases', over: '-115', under: '-105', line: '1.5' },
    ],
  },
];

const PLAYER_STATS: PlayerStat[] = [
  { name: 'Jalen Brunson', team: 'NYK', position: 'G', stat: 'PTS AVG', value: '28.7', sport: 'NBA' },
  { name: 'Jayson Tatum', team: 'BOS', position: 'F', stat: 'PTS AVG', value: '30.1', sport: 'NBA' },
  { name: 'Nikola Jokic', team: 'DEN', position: 'C', stat: 'PTS AVG', value: '29.2', sport: 'NBA' },
  { name: 'Connor McDavid', team: 'EDM', position: 'C', stat: 'PTS', value: '4', sport: 'NHL' },
  { name: 'Yordan Alvarez', team: 'HOU', position: 'DH', stat: 'HR', value: '8', sport: 'MLB' },
  { name: 'Bryce Harper', team: 'PHI', position: '1B', stat: 'AVG', value: '.302', sport: 'MLB' },
];

function TeamAbbr({ abbr, size = 'md' }: { abbr: string; size?: 'sm' | 'md' | 'lg' }) {
  const colors: Record<string, string> = {
    // NBA
    NYK: 'bg-blue-800', ATL: 'bg-red-800', BOS: 'bg-green-900', PHI: 'bg-blue-900',
    MIN: 'bg-green-900', DEN: 'bg-yellow-900', LAL: 'bg-purple-900', GSW: 'bg-yellow-800',
    MIL: 'bg-green-800', BKN: 'bg-slate-800', MIA: 'bg-red-900', CHI: 'bg-red-800',
    // NHL (overrides where different)
    DAL: 'bg-green-900', EDM: 'bg-orange-900', ANA: 'bg-orange-800',
    NYR: 'bg-blue-800', TBL: 'bg-blue-900', FLA: 'bg-red-900',
    COL: 'bg-red-900', CAR: 'bg-red-800', WPG: 'bg-blue-800',
    // MLB
    STL: 'bg-red-900', PIT: 'bg-yellow-900', NYM: 'bg-blue-800', WSH: 'bg-red-900',
    BAL: 'bg-orange-900', HOU: 'bg-orange-900', SF: 'bg-orange-800',
    TOR: 'bg-blue-800', DET: 'bg-slate-800', KC: 'bg-blue-900',
    OAK: 'bg-green-900', ARI: 'bg-red-800', CIN: 'bg-red-800',
    NYY: 'bg-slate-800', TEX: 'bg-blue-900',
    // Soccer
    MCI: 'bg-sky-900', ARS: 'bg-red-900',
  };
  const sizes = { sm: 'w-7 h-7 text-[9px]', md: 'w-9 h-9 text-[10px]', lg: 'w-14 h-14 text-sm' };
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center font-black text-white ${colors[abbr] || 'bg-card-border'} flex-shrink-0 border border-white/10`}>
      {abbr.slice(0, 3)}
    </div>
  );
}

function OddsButton({ label, value, highlight = false, selected = false, onClick }: {
  label?: string; value: string; highlight?: boolean; selected?: boolean; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center rounded px-3 py-1.5 text-center transition-all min-w-[64px] border ${
        selected
          ? 'bg-primary border-primary scale-105'
          : highlight
          ? 'bg-primary/20 border-primary/60 hover:bg-primary/30'
          : 'bg-[hsl(222_40%_15%)] border-[hsl(222_30%_22%)] hover:bg-[hsl(222_40%_20%)] hover:border-primary/40'
      }`}
      data-testid="button-odds"
    >
      {label && <span className={`text-[9px] uppercase tracking-wider leading-none mb-0.5 ${selected ? 'text-black/70' : 'text-muted-foreground'}`}>{label}</span>}
      <span className={`text-sm font-bold ${selected ? 'text-black' : highlight ? 'text-primary' : 'text-white'}`}>{value}</span>
    </button>
  );
}

function GameDetailModal({ game, onClose, onRegister }: {
  game: Game;
  onClose: () => void;
  onRegister: () => void;
}) {
  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'lines' | 'props'>('lines');
  const [liveHome, setLiveHome] = useState(game.homeScore);
  const [liveAway, setLiveAway] = useState(game.awayScore);

  useEffect(() => {
    if (!game.isLive) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        if (Math.random() < 0.5) setLiveHome(h => h + [1, 2, 3][Math.floor(Math.random() * 3)]);
        else setLiveAway(a => a + [1, 2, 3][Math.floor(Math.random() * 3)]);
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [game.isLive]);

  const handleSelect = (id: string) => {
    setSelectedBet(prev => prev === id ? null : id);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      data-testid="modal-game-detail"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto bg-[hsl(222_47%_7%)] border border-card-border sm:rounded-xl shadow-2xl flex flex-col">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-[hsl(222_47%_7%)] border-b border-card-border px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{game.sportIcon}</span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{game.sport}</span>
            {game.isLive && (
              <span className="flex items-center gap-1.5 bg-red-500/20 text-red-400 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                <span className="live-dot w-1.5 h-1.5 rounded-full bg-red-500" />
                Live
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-card-border hover:bg-muted text-muted-foreground hover:text-white transition-colors text-lg"
            data-testid="button-close-modal"
          >
            ×
          </button>
        </div>

        {/* Scoreboard */}
        <div className="px-5 py-6 border-b border-card-border bg-[hsl(222_40%_9%)]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col items-center gap-2 flex-1">
              <TeamAbbr abbr={game.awayLogo} size="lg" />
              <span className="text-white font-bold text-base">{game.awayTeam}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-widest">Away</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              {game.isLive ? (
                <>
                  <div className="text-5xl font-black text-white tabular-nums tracking-tight">
                    {liveAway} <span className="text-card-border text-3xl">–</span> {liveHome}
                  </div>
                  <span className="text-xs text-red-400 font-bold uppercase tracking-widest">{game.quarter}</span>
                </>
              ) : (
                <>
                  <span className="text-xl font-black text-white uppercase tracking-wider">{game.status}</span>
                  <span className="text-sm text-muted-foreground">{game.quarter}</span>
                </>
              )}
            </div>
            <div className="flex flex-col items-center gap-2 flex-1">
              <TeamAbbr abbr={game.homeLogo} size="lg" />
              <span className="text-white font-bold text-base">{game.homeTeam}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-widest">Home</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-card-border">
          {(['lines', 'props'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-white'
              }`}
              data-testid={`button-tab-${tab}`}
            >
              {tab === 'lines' ? 'Betting Lines' : 'Player Props'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-5 py-4 flex flex-col gap-3">
          {activeTab === 'lines' && (
            <>
              {/* Moneyline */}
              <div className="bg-card rounded-lg p-4 border border-card-border">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-3">Moneyline</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelect('ml-away')}
                    className={`flex-1 py-3 rounded-lg border font-bold transition-all text-sm ${selectedBet === 'ml-away' ? 'bg-primary border-primary text-black' : 'bg-[hsl(222_40%_15%)] border-card-border text-white hover:border-primary/40'}`}
                    data-testid="button-ml-away"
                  >
                    <div className="text-xs text-inherit opacity-70 mb-1">{game.awayTeam}</div>
                    <div className="text-xl font-black">{game.awayOdds}</div>
                  </button>
                  {game.drawOdds && (
                    <button
                      onClick={() => handleSelect('ml-draw')}
                      className={`flex-1 py-3 rounded-lg border font-bold transition-all text-sm ${selectedBet === 'ml-draw' ? 'bg-primary border-primary text-black' : 'bg-[hsl(222_40%_15%)] border-card-border text-white hover:border-primary/40'}`}
                      data-testid="button-ml-draw"
                    >
                      <div className="text-xs text-inherit opacity-70 mb-1">Draw</div>
                      <div className="text-xl font-black">{game.drawOdds}</div>
                    </button>
                  )}
                  <button
                    onClick={() => handleSelect('ml-home')}
                    className={`flex-1 py-3 rounded-lg border font-bold transition-all text-sm ${selectedBet === 'ml-home' ? 'bg-primary border-primary text-black' : 'bg-[hsl(222_40%_15%)] border-card-border text-white hover:border-primary/40'}`}
                    data-testid="button-ml-home"
                  >
                    <div className="text-xs text-inherit opacity-70 mb-1">{game.homeTeam}</div>
                    <div className="text-xl font-black">{game.homeOdds}</div>
                  </button>
                </div>
              </div>

              {/* Spread */}
              <div className="bg-card rounded-lg p-4 border border-card-border">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-3">Spread</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelect('spread-away')}
                    className={`flex-1 py-3 rounded-lg border font-bold transition-all ${selectedBet === 'spread-away' ? 'bg-primary border-primary text-black' : 'bg-[hsl(222_40%_15%)] border-card-border text-white hover:border-primary/40'}`}
                    data-testid="button-spread-away"
                  >
                    <div className="text-xs opacity-70 mb-1">{game.awayTeam}</div>
                    <div className="font-black">{game.spreadAway}</div>
                  </button>
                  <button
                    onClick={() => handleSelect('spread-home')}
                    className={`flex-1 py-3 rounded-lg border font-bold transition-all ${selectedBet === 'spread-home' ? 'bg-primary border-primary text-black' : 'bg-[hsl(222_40%_15%)] border-card-border text-white hover:border-primary/40'}`}
                    data-testid="button-spread-home"
                  >
                    <div className="text-xs opacity-70 mb-1">{game.homeTeam}</div>
                    <div className="font-black">{game.spreadHome}</div>
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="bg-card rounded-lg p-4 border border-card-border">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-3">Total — {game.total}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelect('total-over')}
                    className={`flex-1 py-3 rounded-lg border font-bold transition-all ${selectedBet === 'total-over' ? 'bg-primary border-primary text-black' : 'bg-[hsl(222_40%_15%)] border-card-border text-white hover:border-primary/40'}`}
                    data-testid="button-total-over"
                  >
                    <div className="text-xs opacity-70 mb-1">Over</div>
                    <div className="font-black">-110</div>
                  </button>
                  <button
                    onClick={() => handleSelect('total-under')}
                    className={`flex-1 py-3 rounded-lg border font-bold transition-all ${selectedBet === 'total-under' ? 'bg-primary border-primary text-black' : 'bg-[hsl(222_40%_15%)] border-card-border text-white hover:border-primary/40'}`}
                    data-testid="button-total-under"
                  >
                    <div className="text-xs opacity-70 mb-1">Under</div>
                    <div className="font-black">-110</div>
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === 'props' && (
            <div className="flex flex-col gap-2">
              {game.props.map((prop, i) => (
                <div key={i} className="bg-card rounded-lg p-4 border border-card-border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-white font-bold text-sm">{prop.player}</span>
                      {prop.team && <span className="text-muted-foreground text-xs ml-2 uppercase">{prop.team}</span>}
                    </div>
                    <span className="text-primary text-xs font-bold uppercase tracking-wider">{prop.market} {prop.line !== '-' ? `${prop.line}` : ''}</span>
                  </div>
                  <div className="flex gap-2">
                    {prop.line !== '-' ? (
                      <>
                        <button
                          onClick={() => handleSelect(`prop-${i}-over`)}
                          className={`flex-1 py-2.5 rounded border font-bold text-sm transition-all ${selectedBet === `prop-${i}-over` ? 'bg-primary border-primary text-black' : 'bg-[hsl(222_40%_15%)] border-card-border text-white hover:border-primary/40'}`}
                          data-testid={`button-prop-${i}-over`}
                        >
                          <div className="text-[10px] opacity-70 mb-0.5">Over {prop.line}</div>
                          <div className="font-black">{prop.over}</div>
                        </button>
                        <button
                          onClick={() => handleSelect(`prop-${i}-under`)}
                          className={`flex-1 py-2.5 rounded border font-bold text-sm transition-all ${selectedBet === `prop-${i}-under` ? 'bg-primary border-primary text-black' : 'bg-[hsl(222_40%_15%)] border-card-border text-white hover:border-primary/40'}`}
                          data-testid={`button-prop-${i}-under`}
                        >
                          <div className="text-[10px] opacity-70 mb-0.5">Under {prop.line}</div>
                          <div className="font-black">{prop.under}</div>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleSelect(`prop-${i}-yes`)}
                        className={`flex-1 py-2.5 rounded border font-bold text-sm transition-all ${selectedBet === `prop-${i}-yes` ? 'bg-primary border-primary text-black' : 'bg-[hsl(222_40%_15%)] border-card-border text-white hover:border-primary/40'}`}
                        data-testid={`button-prop-${i}-yes`}
                      >
                        {prop.over}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sticky bet slip / CTA */}
        <div className="sticky bottom-0 border-t border-card-border bg-[hsl(222_47%_7%)] px-5 py-4">
          {selectedBet ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-semibold">Selected:</span>
                <span className="text-primary font-bold uppercase tracking-wide">{selectedBet.replace(/-/g, ' ')}</span>
              </div>
              <button
                onClick={onRegister}
                className="w-full py-3.5 bg-primary hover:bg-orange-500 text-black font-black uppercase tracking-wider rounded glow-orange transition-all text-sm"
                data-testid="button-place-bet"
              >
                Place Bet with $BEEP — Register Now
              </button>
              <p className="text-center text-[10px] text-muted-foreground">You need $BEEP tokens to bet on the platform · Registration is free</p>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                <span className="text-white font-semibold">Select a line</span> above, then register to place bets with $BEEP
              </p>
              <button
                onClick={onRegister}
                className="flex-shrink-0 px-5 py-2.5 bg-primary/20 hover:bg-primary border border-primary/60 hover:border-primary text-primary hover:text-black font-bold uppercase tracking-wider rounded transition-all text-xs"
                data-testid="button-get-beep"
              >
                Get $BEEP
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GameCard({ game, onClick }: { game: Game; onClick: () => void }) {
  const [localHome, setLocalHome] = useState(game.homeScore);
  const [localAway, setLocalAway] = useState(game.awayScore);

  useEffect(() => {
    if (!game.isLive) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.08) {
        const pts = [1, 2, 3][Math.floor(Math.random() * 3)];
        if (Math.random() < 0.5) setLocalHome(h => h + pts);
        else setLocalAway(a => a + pts);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [game.isLive]);

  const homeWinning = localHome > localAway;
  const awayWinning = localAway > localHome;

  return (
    <div
      className="sport-card p-4 flex flex-col gap-3 cursor-pointer group"
      onClick={onClick}
      data-testid={`card-game-${game.id}`}
    >
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
          {game.isLive && <span className={`text-xl font-black tabular-nums ${awayWinning ? 'text-white' : 'text-muted-foreground'}`}>{localAway}</span>}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TeamAbbr abbr={game.homeLogo} />
            <span className={`font-bold text-sm ${homeWinning ? 'text-white' : 'text-muted-foreground'}`}>{game.homeTeam}</span>
          </div>
          {game.isLive && <span className={`text-xl font-black tabular-nums ${homeWinning ? 'text-white' : 'text-muted-foreground'}`}>{localHome}</span>}
        </div>
      </div>

      <div className="flex gap-1.5 pt-2 border-t border-card-border items-center justify-between">
        <div className="flex gap-1">
          <span className="text-[10px] bg-[hsl(222_40%_15%)] border border-card-border rounded px-2 py-1 text-muted-foreground font-mono">{game.awayOdds}</span>
          {game.drawOdds && <span className="text-[10px] bg-[hsl(222_40%_15%)] border border-card-border rounded px-2 py-1 text-muted-foreground font-mono">{game.drawOdds}</span>}
          <span className="text-[10px] bg-[hsl(222_40%_15%)] border border-card-border rounded px-2 py-1 text-muted-foreground font-mono">{game.homeOdds}</span>
        </div>
        <span className="text-[10px] text-primary font-bold group-hover:underline">View Lines →</span>
      </div>
    </div>
  );
}

export default function LiveSportsPanel({ onNavigate }: { onNavigate: (v: string) => void }) {
  const [activeTab, setActiveTab] = useState('ALL');
  const [activeView, setActiveView] = useState<'games' | 'players'>('games');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const filtered = activeTab === 'ALL' ? MOCK_GAMES : MOCK_GAMES.filter(g => g.sport === activeTab);
  const liveCount = MOCK_GAMES.filter(g => g.isLive).length;

  const handleClose = useCallback(() => setSelectedGame(null), []);

  return (
    <section className="bg-[hsl(222_47%_5%)] border-y border-card-border" data-testid="section-live-sports">

      {/* Modal */}
      {selectedGame && (
        <GameDetailModal
          game={selectedGame}
          onClose={handleClose}
          onRegister={() => { handleClose(); onNavigate('register'); }}
        />
      )}

      {/* Section header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="live-dot w-2.5 h-2.5 rounded-full bg-red-500" />
                <h2 className="text-white font-black text-lg uppercase tracking-wider">Live Odds & Scores</h2>
                <span className="bg-red-500/20 text-red-400 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">{liveCount} Live</span>
                <span className="bg-primary/10 border border-primary/30 text-primary text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">NBA · NHL · MLB Playoffs</span>
              </div>
              <p className="text-muted-foreground text-xs">
                Click any game to view full lines and player props · Bet with $BEEP
              </p>
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
        <div className="flex gap-0.5 overflow-x-auto pb-0">
          {SPORTS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-white hover:border-card-border'
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
              <GameCard key={game.id} game={game} onClick={() => setSelectedGame(game)} />
            ))}
          </div>
        </div>
      )}

      {/* Players view */}
      {activeView === 'players' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PLAYER_STATS.map((p, i) => (
              <div key={i} className="sport-card p-4 flex items-center gap-3 cursor-pointer hover:border-primary/40 transition-colors" data-testid={`card-player-${i}`}>
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
            <span className="text-primary">$BEEP holders</span> get full access to live betting, props & more
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-wider">
            <span className="live-dot w-2 h-2 rounded-full bg-green-500" />
            Platform launching soon · Register to secure your spot
          </div>
        </div>
      </div>
    </section>
  );
}
