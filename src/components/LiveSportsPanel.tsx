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

const SPORTS_TABS = ['ALL', 'NFL', 'NBA', 'MLB', 'NHL', 'UFC', 'SOCCER'];

const MOCK_GAMES: Game[] = [
  {
    id: 1, sport: 'NBA', sportIcon: '🏀',
    homeTeam: 'Lakers', awayTeam: 'Celtics',
    homeScore: 87, awayScore: 91,
    status: 'LIVE', quarter: 'Q3 4:32',
    homeOdds: '+100', awayOdds: '-120',
    spread: 'CEL -3.5', spreadHome: '+3.5 (-110)', spreadAway: '-3.5 (-110)',
    total: 'O/U 224.5',
    isLive: true, homeLogo: 'LAL', awayLogo: 'BOS',
    props: [
      { player: 'LeBron James', team: 'LAL', market: 'Points', over: '-115', under: '-105', line: '27.5' },
      { player: 'Jayson Tatum', team: 'BOS', market: 'Points', over: '-120', under: '-100', line: '28.5' },
      { player: 'Anthony Davis', team: 'LAL', market: 'Rebounds', over: '-110', under: '-110', line: '11.5' },
      { player: 'Jaylen Brown', team: 'BOS', market: 'Assists', over: '+105', under: '-125', line: '3.5' },
    ],
  },
  {
    id: 2, sport: 'NFL', sportIcon: '🏈',
    homeTeam: 'Chiefs', awayTeam: 'Eagles',
    homeScore: 21, awayScore: 14,
    status: 'LIVE', quarter: 'Q2 1:15',
    homeOdds: '-150', awayOdds: '+130',
    spread: 'KC -4.5', spreadHome: '-4.5 (-110)', spreadAway: '+4.5 (-110)',
    total: 'O/U 47.5',
    isLive: true, homeLogo: 'KC', awayLogo: 'PHI',
    props: [
      { player: 'Patrick Mahomes', team: 'KC', market: 'Pass Yards', over: '-115', under: '-105', line: '289.5' },
      { player: 'Jalen Hurts', team: 'PHI', market: 'Pass Yards', over: '-110', under: '-110', line: '254.5' },
      { player: 'Travis Kelce', team: 'KC', market: 'Receiving Yards', over: '-120', under: '+100', line: '72.5' },
      { player: 'DeVonta Smith', team: 'PHI', market: 'Receptions', over: '-115', under: '-105', line: '5.5' },
    ],
  },
  {
    id: 3, sport: 'MLB', sportIcon: '⚾',
    homeTeam: 'Yankees', awayTeam: 'Red Sox',
    homeScore: 3, awayScore: 2,
    status: 'LIVE', quarter: 'BOT 7th',
    homeOdds: '-130', awayOdds: '+110',
    spread: 'NYY -1.5', spreadHome: '-1.5 (+150)', spreadAway: '+1.5 (-170)',
    total: 'O/U 8.5',
    isLive: true, homeLogo: 'NYY', awayLogo: 'BOS',
    props: [
      { player: 'Aaron Judge', team: 'NYY', market: 'Home Runs', over: '+280', under: '-340', line: '0.5' },
      { player: 'Gerrit Cole', team: 'NYY', market: 'Strikeouts', over: '-115', under: '-105', line: '7.5' },
      { player: 'Rafael Devers', team: 'BOS', market: 'Total Bases', over: '-110', under: '-110', line: '1.5' },
      { player: 'Alex Verdugo', team: 'NYY', market: 'Hits', over: '-130', under: '+110', line: '0.5' },
    ],
  },
  {
    id: 4, sport: 'NHL', sportIcon: '🏒',
    homeTeam: 'Rangers', awayTeam: 'Bruins',
    homeScore: 2, awayScore: 2,
    status: 'LIVE', quarter: 'P3 11:20',
    homeOdds: '+105', awayOdds: '-125',
    spread: 'BOS -1.5 +175', spreadHome: '+1.5 (-210)', spreadAway: '-1.5 (+175)',
    total: 'O/U 5.5',
    isLive: true, homeLogo: 'NYR', awayLogo: 'BOS',
    props: [
      { player: 'Artemi Panarin', team: 'NYR', market: 'Points', over: '+110', under: '-130', line: '0.5' },
      { player: 'David Pastrnak', team: 'BOS', market: 'Goals', over: '+200', under: '-240', line: '0.5' },
      { player: 'Igor Shesterkin', team: 'NYR', market: 'Saves', over: '-120', under: '+100', line: '28.5' },
    ],
  },
  {
    id: 5, sport: 'NBA', sportIcon: '🏀',
    homeTeam: 'Warriors', awayTeam: 'Bucks',
    homeScore: 0, awayScore: 0,
    status: 'TONIGHT', quarter: '7:30 PM ET',
    homeOdds: '+120', awayOdds: '-140',
    spread: 'MIL -2.5', spreadHome: '+2.5 (-110)', spreadAway: '-2.5 (-110)',
    total: 'O/U 230.5',
    isLive: false, homeLogo: 'GSW', awayLogo: 'MIL',
    props: [
      { player: 'Giannis Antetokounmpo', team: 'MIL', market: 'Points', over: '-110', under: '-110', line: '31.5' },
      { player: 'Stephen Curry', team: 'GSW', market: '3-Pointers', over: '-105', under: '-115', line: '4.5' },
      { player: 'Damian Lillard', team: 'MIL', market: 'Assists', over: '-115', under: '-105', line: '6.5' },
    ],
  },
  {
    id: 6, sport: 'SOCCER', sportIcon: '⚽',
    homeTeam: 'Man City', awayTeam: 'Arsenal',
    homeScore: 1, awayScore: 1,
    status: 'LIVE', quarter: "73'",
    homeOdds: '+120', awayOdds: '+220', drawOdds: '+240',
    spread: 'ARS +0.5', spreadHome: '-0.5 (-110)', spreadAway: '+0.5 (-110)',
    total: 'O/U 2.5',
    isLive: true, homeLogo: 'MCI', awayLogo: 'ARS',
    props: [
      { player: 'Erling Haaland', team: 'MCI', market: 'Goals', over: '+160', under: '-190', line: '0.5' },
      { player: 'Bukayo Saka', team: 'ARS', market: 'Shots on Target', over: '-110', under: '-110', line: '1.5' },
      { player: 'Kevin De Bruyne', team: 'MCI', market: 'Assists', over: '+175', under: '-210', line: '0.5' },
    ],
  },
  {
    id: 7, sport: 'UFC', sportIcon: '🥊',
    homeTeam: 'Jones', awayTeam: 'Miocic',
    homeScore: 0, awayScore: 0,
    status: 'SAT MAY 3', quarter: 'Main Event',
    homeOdds: '-320', awayOdds: '+260',
    spread: 'Jones -1.5', spreadHome: '-1.5 (+130)', spreadAway: '+1.5 (-150)',
    total: 'O/U 2.5 Rds',
    isLive: false, homeLogo: 'JJ', awayLogo: 'SM',
    props: [
      { player: 'Jon Jones', team: '', market: 'Method of Victory (KO/TKO)', over: '+150', under: '-', line: '-' },
      { player: 'Jon Jones', team: '', market: 'Method of Victory (Sub)', over: '+400', under: '-', line: '-' },
      { player: 'Stipe Miocic', team: '', market: 'Fight to Go Distance', over: '+220', under: '-', line: '-' },
    ],
  },
  {
    id: 8, sport: 'NFL', sportIcon: '🏈',
    homeTeam: 'Ravens', awayTeam: 'Cowboys',
    homeScore: 0, awayScore: 0,
    status: 'SUN 1PM ET', quarter: 'Week 18',
    homeOdds: '-180', awayOdds: '+155',
    spread: 'BAL -4', spreadHome: '-4 (-110)', spreadAway: '+4 (-110)',
    total: 'O/U 44.5',
    isLive: false, homeLogo: 'BAL', awayLogo: 'DAL',
    props: [
      { player: 'Lamar Jackson', team: 'BAL', market: 'Pass Yards', over: '-115', under: '-105', line: '274.5' },
      { player: 'Dak Prescott', team: 'DAL', market: 'Pass Yards', over: '-110', under: '-110', line: '259.5' },
      { player: 'Derrick Henry', team: 'BAL', market: 'Rush Yards', over: '-115', under: '-105', line: '84.5' },
      { player: 'CeeDee Lamb', team: 'DAL', market: 'Receiving Yards', over: '-120', under: '+100', line: '88.5' },
    ],
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

function TeamAbbr({ abbr, size = 'md' }: { abbr: string; size?: 'sm' | 'md' | 'lg' }) {
  const colors: Record<string, string> = {
    LAL: 'bg-purple-900', BOS: 'bg-green-900', KC: 'bg-red-900', PHI: 'bg-green-800',
    NYY: 'bg-slate-800', GSW: 'bg-yellow-900', MIL: 'bg-green-900', NYR: 'bg-blue-900',
    MCI: 'bg-sky-900', ARS: 'bg-red-900', JJ: 'bg-slate-700', SM: 'bg-blue-900',
    BAL: 'bg-purple-900', DAL: 'bg-slate-800', EDM: 'bg-orange-900',
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
              </div>
              <p className="text-muted-foreground text-xs">Click any game to view full lines and player props · Powered by $BEEP</p>
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
