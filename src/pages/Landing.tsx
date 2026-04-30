import React, { useState, useEffect, useCallback } from 'react';
import { View } from '../App';
import { Button } from '@/components/ui/button';
import { FaDiscord, FaTelegram, FaTwitter, FaWallet } from 'react-icons/fa';
import LiveSportsPanel from '../components/LiveSportsPanel';
import SportsbookTeaser from '../components/SportsbookTeaser';

interface LandingProps {
  onNavigate: (view: View) => void;
}

const PHASE_END = new Date('2026-06-01T00:00:00Z').getTime();

const ACTIVITY_FEED = [
  { city: 'Miami, FL', action: 'claimed 200 $BEEP', time: '2s ago' },
  { city: 'Las Vegas, NV', action: 'bought $50 bundle', time: '8s ago' },
  { city: 'Chicago, IL', action: 'registered wallet', time: '14s ago' },
  { city: 'New York, NY', action: 'claimed 833 $BEEP', time: '21s ago' },
  { city: 'Dallas, TX', action: 'bought $20 bundle', time: '35s ago' },
  { city: 'Los Angeles, CA', action: 'registered wallet', time: '41s ago' },
  { city: 'Atlanta, GA', action: 'claimed 416 $BEEP', time: '52s ago' },
  { city: 'Phoenix, AZ', action: 'bought $10 bundle', time: '1m ago' },
];

function useCountdown(target: number) {
  const calc = useCallback(() => {
    const diff = Math.max(0, target - Date.now());
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  }, [target]);
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);
  return time;
}

export default function Landing({ onNavigate }: LandingProps) {
  const { d, h, m, s } = useCountdown(PHASE_END);
  const [activityIdx, setActivityIdx] = useState(0);
  const [activityVisible, setActivityVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setActivityVisible(false);
      setTimeout(() => {
        setActivityIdx(i => (i + 1) % ACTIVITY_FEED.length);
        setActivityVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');
  const activity = ACTIVITY_FEED[activityIdx];

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── GLASS NAV ── */}
      <header className="fixed top-0 left-0 right-0 z-50 dk-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: 'Sportsbook', href: '#live-sports' },
              { label: 'Live Betting', href: '#live-sports' },
              { label: 'Parlays', href: '#platform-preview' },
              { label: 'Props', href: '#live-sports' },
            ].map(item => (
              <a
                key={item.label}
                href={item.href}
                className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-white uppercase tracking-wider transition-colors rounded hover:bg-white/5"
                onClick={e => {
                  e.preventDefault();
                  document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 ml-auto">
            <div className="hidden sm:flex items-center gap-2">
              <span className="live-dot w-2 h-2 rounded-full bg-green-400" />
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Phase 1 Live</span>
            </div>
            <button
              onClick={() => onNavigate('register')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/10 text-[11px] font-bold text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 uppercase tracking-wider transition-all"
              data-testid="button-nav-register"
            >
              <FaWallet className="w-3 h-3" />
              Connect Wallet
            </button>
            <Button
              size="sm"
              className="bg-primary text-black hover:bg-orange-500 font-bold uppercase tracking-wider text-xs px-4 glow-orange ring-pulse rounded"
              onClick={() => onNavigate('register')}
              data-testid="button-nav-cta"
            >
              Claim $BEEP
            </Button>
            <div className="flex items-center gap-2 border-l border-card-border pl-4">
              <div className="heading-font text-lg text-white leading-none hidden sm:block">SPORTS<span className="text-primary">BEEP</span></div>
              <img src="/logo-nobg.png" alt="SPORTSBEEP" className="w-9 h-9 object-contain flex-shrink-0" />
            </div>
          </div>
        </div>
      </header>

      {/* ── WEB3 HERO ── */}
      <section className="relative pt-14 min-h-screen flex flex-col overflow-hidden">

        {/* Arena background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=1920')" }}
        />
        {/* Dark vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/95" />
        {/* Subtle mesh grid on top */}
        <div className="absolute inset-0 mesh-bg" />
        {/* Single orange orb — center glow */}
        <div className="orb-orange w-[800px] h-[800px] top-[-100px] left-1/2 -translate-x-1/2 opacity-30" />

        {/* Large watermark logo */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <img src="/logo-nobg.png" alt="" className="w-[500px] h-[500px] object-contain opacity-[0.04] select-none" />
        </div>

        {/* Scanline */}
        <div className="absolute inset-0 scanlines pointer-events-none z-10" />

        {/* Content */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto w-full">

          {/* Hero logo */}
          <div className="mb-6 float-slow">
            <img src="/logo-nobg.png" alt="SPORTSBEEP" className="w-24 h-24 object-contain drop-shadow-2xl" style={{ filter: 'drop-shadow(0 0 24px rgba(247,118,13,0.5))' }} />
          </div>

          {/* Status badges */}
          <div className="flex items-center gap-3 mb-6 flex-wrap justify-center">
            <div className="glass rounded-full px-4 py-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-black text-primary uppercase tracking-[0.25em]">Cardano Mainnet</span>
            </div>
            <div className="glass rounded-full px-4 py-1.5 flex items-center gap-2">
              <span className="live-dot w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[11px] font-black text-red-400 uppercase tracking-[0.25em]">Phase 1 · Closing Fast</span>
            </div>
          </div>

          {/* Main headline */}
          <div className="text-center mb-4">
            <h1 className="heading-font text-[clamp(4rem,14vw,11rem)] text-white leading-none mb-0 drop-shadow-2xl">
              BET. EARN.
            </h1>
            <h1 className="heading-font text-[clamp(4rem,14vw,11rem)] leading-none drop-shadow-2xl">
              <span className="gradient-text">WIN WITH $BEEP</span>
            </h1>
          </div>

          <p className="text-center text-gray-300 max-w-xl mb-10 text-sm md:text-base leading-relaxed drop-shadow">
            The first sports betting protocol on <span className="text-primary font-bold">Cardano</span>.{' '}
            Secure your <span className="text-primary font-bold">$BEEP</span> at founder pricing before the public launch.
          </p>

          {/* ── COUNTDOWN ── */}
          <div className="mb-10 w-full max-w-2xl">
            <p className="text-center text-[10px] font-black uppercase tracking-[0.35em] text-muted-foreground mb-4">
              ⚡ Phase 1 Closes In
            </p>
            <div className="grid grid-cols-4 gap-3">
              {[
                { val: pad(d), label: 'Days' },
                { val: pad(h), label: 'Hours' },
                { val: pad(m), label: 'Min' },
                { val: pad(s), label: 'Sec' },
              ].map(({ val, label }) => (
                <div key={label} className="glass gradient-border rounded-xl p-4 text-center token-card-shine">
                  <div className="countdown-digit text-5xl sm:text-6xl md:text-7xl">{val}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-2">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── GLASSMORPHISM STATS ── */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-xl mb-10">
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-primary glow-orange-text">$0.12</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Per $BEEP</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-white">10M</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Fixed Supply</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-primary glow-orange-text">100</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">$BEEP / Referral</div>
            </div>
          </div>

          {/* ── CTAs ── */}
          <div className="flex flex-col sm:flex-row gap-3 items-center mb-10">
            <Button
              size="lg"
              className="h-14 px-10 text-sm font-black uppercase tracking-wider glow-orange-strong hover:bg-orange-500 text-black transition-all rounded-lg ring-pulse"
              onClick={() => onNavigate('register')}
              data-testid="button-hero-cta"
            >
              <FaWallet className="mr-2 w-4 h-4" />
              Connect Wallet — Claim Free
            </Button>
            <a
              href="#bundles"
              className="h-14 px-8 flex items-center text-sm font-black uppercase tracking-wider glass rounded-lg text-white hover:border-primary/60 hover:text-primary transition-all border border-white/10"
            >
              Buy $BEEP Now →
            </a>
          </div>

          {/* ── CONTRACT INFO ── */}
          <div className="glass rounded-xl px-6 py-3 flex flex-col sm:flex-row items-center gap-4 mb-8 max-w-2xl w-full">
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-0.5">Policy ID · Cardano</p>
              <p className="font-mono text-[11px] text-primary truncate">a221e11c9d474ac3709911161bcfd02969d268e927089d3c55a4c3c2</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Policy Locked</span>
            </div>
          </div>

          {/* ── ACTIVITY FEED ── */}
          <div
            className="flex items-center gap-3 glass rounded-full px-5 py-2.5"
            style={{ transition: 'opacity 0.3s', opacity: activityVisible ? 1 : 0 }}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 animate-pulse" />
            <span className="text-xs text-muted-foreground">
              <span className="text-white font-bold">Someone in {activity.city}</span>
              {' '}{activity.action}
            </span>
            <span className="text-[10px] text-muted-foreground/50 flex-shrink-0">{activity.time}</span>
          </div>

        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />
      </section>

      {/* ── LIVE SPORTS PANEL ── */}
      <div id="live-sports">
        <LiveSportsPanel onNavigate={onNavigate} />
      </div>

      {/* ── SPORTSBOOK TEASER ── */}
      <div id="platform-preview">
        <SportsbookTeaser onNavigate={onNavigate} />
      </div>

      {/* ── DISTRIBUTION & MILESTONES ── */}
      <section className="py-20 bg-background relative z-10 overflow-hidden">
        <div className="absolute inset-0 mesh-bg-cyan opacity-60" />
        <div className="orb-orange w-[400px] h-[400px] top-[-100px] right-[-50px] opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Key Metrics — glass card */}
            <div className="glass-strong rounded-2xl p-8 gradient-border token-card-shine">
              <div className="flex items-center gap-3 mb-2">
                <img src="/logo-nobg.png" alt="SB" className="w-10 h-10 object-contain flex-shrink-0" />
                <h3 className="heading-font text-3xl text-white">KEY METRICS</h3>
              </div>
              <p className="text-primary text-sm uppercase font-bold tracking-widest mb-8">Fixed Infrastructure</p>
              <ul className="space-y-6 mb-8">
                <li className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-muted-foreground font-semibold">Initial Price per $BEEP</span>
                  <span className="text-primary font-bold text-xl glow-orange-text">$0.12</span>
                </li>
                <li className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-muted-foreground font-semibold">Fixed Total Supply</span>
                  <span className="text-white font-bold text-xl">10,000,000</span>
                </li>
                <li className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-muted-foreground font-semibold">Current Phase</span>
                  <span className="text-white font-bold">Phase 1: Closed Beta</span>
                </li>
              </ul>
              <div className="glass rounded-lg p-4 mb-4">
                <p className="text-xs text-muted-foreground uppercase font-bold mb-2 tracking-wider">Policy ID</p>
                <p className="font-mono text-sm text-primary break-all">a221e11c9d474ac3709911161bcfd02969d268e927089d3c55a4c3c2</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-green" />
                <p className="text-sm text-muted-foreground italic">Policy locked since 2025-10-14 18:31:24 UTC</p>
              </div>
            </div>

            {/* Roadmap card */}
            <div className="glass-strong rounded-2xl p-8">
              <h3 className="heading-font text-3xl text-white mb-1">PHASED DISTRIBUTION</h3>
              <p className="text-primary text-sm uppercase font-bold tracking-widest mb-8">Ecosystem Roadmap</p>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-card-border before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <span className="text-black font-bold text-sm">1</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-primary/40 glass shadow-lg">
                    <h4 className="text-primary font-bold text-lg mb-1 uppercase tracking-wide">Closed Beta Allocation</h4>
                    <p className="text-sm text-muted-foreground">Tokens for founders, contributors, and beta testers. Not publicly tradable yet.</p>
                  </div>
                </div>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-card-border shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <span className="text-muted-foreground font-bold text-sm">2</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl glass border border-white/5 shadow-lg">
                    <h4 className="text-white font-bold text-lg mb-1 uppercase tracking-wide">Expansion</h4>
                    <p className="text-sm text-muted-foreground">50,000 $BEEP allocated to deepen liquidity and fund app development.</p>
                  </div>
                </div>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-card-border shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <span className="text-muted-foreground font-bold text-sm">3</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl glass border border-white/5 shadow-lg">
                    <h4 className="text-white font-bold text-lg mb-1 uppercase tracking-wide">Community Growth</h4>
                    <p className="text-sm text-muted-foreground">250,000 $BEEP for staking rewards and referral program payouts.</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-sm text-muted-foreground italic">
                  Remaining Supply (6.2M $BEEP) Reserved for future milestones...
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── BUNDLES SECTION ── */}
      <section id="bundles" className="py-20 bg-black relative border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 mesh-bg" />
        <div className="orb-orange w-[500px] h-[500px] top-[0] left-[-100px] opacity-20" />
        <div className="orb-orange w-[400px] h-[400px] bottom-[-100px] right-[-50px] opacity-25" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <img src="/logo-nobg.png" alt="SPORTSBEEP" className="w-16 h-16 object-contain" style={{ filter: 'drop-shadow(0 0 16px rgba(247,118,13,0.45))' }} />
            </div>
            <p className="text-primary text-sm uppercase font-bold tracking-widest mb-2">Instant Access — Phase 1 Pricing</p>
            <h2 className="heading-font text-5xl sm:text-6xl text-white mb-6">BUY <span className="gradient-text">$BEEP</span> NOW</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Secure your allocation before Phase 2. Current fixed rate is $0.12 per token.
            </p>
          </div>

          {/* Social Banner */}
          <div className="glass-strong rounded-2xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-l-primary">
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-3">
                <img src="/logo-nobg.png" alt="SB" className="w-10 h-10 object-contain flex-shrink-0" />
                <div className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-green-500/20">Free Access</div>
              </div>
              <h3 className="heading-font text-2xl text-white">JOIN OUR COMMUNITY — 100% FREE</h3>
              <p className="text-sm text-muted-foreground">No purchase required. Connect with the team and early adopters.</p>
            </div>
            <div className="flex gap-3">
              {[
                { href: 'https://x.com/PlaySportsBeep', icon: <FaTwitter className="w-5 h-5" /> },
                { href: 'https://discord.gg/fNfaaTbrP8', icon: <FaDiscord className="w-5 h-5" /> },
                { href: 'https://t.me/sportsbeepnews', icon: <FaTelegram className="w-5 h-5" /> },
              ].map(({ href, icon }) => (
                <a key={href} href={href} target="_blank" rel="noreferrer"
                  className="w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:text-primary hover:border-primary/40 transition-colors border border-white/5">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Bundles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Bundle 1 */}
            <div className="glass rounded-2xl p-6 flex flex-col hover:-translate-y-1 transition-all duration-300 hover:border-primary/30 border border-white/5">
              <div className="w-12 h-12 glass rounded-full flex items-center justify-center text-2xl mb-4">🎯</div>
              <h3 className="text-4xl font-black text-white mb-1">$5</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-primary">41 $BEEP</span>
                <span className="text-xs text-muted-foreground">@ $0.12 / token</span>
              </div>
              <ul className="space-y-3 my-6 flex-1 text-sm text-gray-300">
                <li className="flex items-start gap-2"><span className="text-primary mt-1">▸</span> Starter allocation</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">▸</span> Beta access badge</li>
              </ul>
              <Button asChild className="w-full bg-primary text-black hover:bg-orange-600 font-bold uppercase tracking-wider glow-orange rounded-lg">
                <a href="https://buy.stripe.com/28EcMXfXk4Rb3Oa3740Ba00" target="_blank" rel="noreferrer">Buy Now</a>
              </Button>
            </div>

            {/* Bundle 2 */}
            <div className="glass rounded-2xl p-6 flex flex-col hover:-translate-y-1 transition-all duration-300 hover:border-primary/30 border border-white/5">
              <div className="w-12 h-12 glass rounded-full flex items-center justify-center text-2xl mb-4">⚡</div>
              <h3 className="text-4xl font-black text-white mb-1">$10</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-primary">83 $BEEP</span>
                <span className="text-xs text-muted-foreground">@ $0.12 / token</span>
              </div>
              <ul className="space-y-3 my-6 flex-1 text-sm text-gray-300">
                <li className="flex items-start gap-2"><span className="text-primary mt-1">▸</span> Core allocation</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">▸</span> Beta access badge</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">▸</span> Early holder status</li>
              </ul>
              <Button asChild className="w-full bg-primary text-black hover:bg-orange-600 font-bold uppercase tracking-wider glow-orange rounded-lg">
                <a href="https://buy.stripe.com/cNi3cn8uS4Rb70m2300Ba01" target="_blank" rel="noreferrer">Buy Now</a>
              </Button>
            </div>

            {/* Bundle 3 — Most Popular */}
            <div className="rounded-2xl p-6 flex flex-col relative transform lg:-translate-y-4 z-10 gradient-border glass-strong token-card-shine">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black text-xs font-black uppercase tracking-widest px-4 py-1 rounded-full whitespace-nowrap z-10">
                🔥 Most Popular
              </div>
              <div className="w-12 h-12 glass rounded-full flex items-center justify-center text-2xl mb-4">🚀</div>
              <h3 className="text-4xl font-black mb-1 shimmer-text">$20</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-primary">166 $BEEP</span>
                <span className="text-xs text-muted-foreground">@ $0.12 / token</span>
              </div>
              <ul className="space-y-3 my-6 flex-1 text-sm text-gray-300">
                <li className="flex items-start gap-2"><span className="text-primary mt-1">▸</span> Boosted allocation</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">▸</span> Priority wallet delivery</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">▸</span> Discord VIP role</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">▸</span> Referral bonus eligible</li>
              </ul>
              <Button asChild className="w-full bg-primary text-black hover:bg-orange-600 font-bold uppercase tracking-wider glow-orange-strong rounded-lg">
                <a href="https://buy.stripe.com/eVqeV5h1ocjDgAWdLI0Ba04" target="_blank" rel="noreferrer">Buy Now</a>
              </Button>
            </div>

            {/* Bundle 4 */}
            <div className="glass rounded-2xl p-6 flex flex-col hover:-translate-y-1 transition-all duration-300 hover:border-primary/30 border border-white/5">
              <div className="w-12 h-12 glass rounded-full flex items-center justify-center text-2xl mb-4">💎</div>
              <h3 className="text-4xl font-black text-white mb-1">$35</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-primary">291 $BEEP</span>
                <span className="text-xs text-muted-foreground">@ $0.12 / token</span>
              </div>
              <ul className="space-y-3 my-6 flex-1 text-sm text-gray-300">
                <li className="flex items-start gap-2"><span className="text-primary mt-1">▸</span> Core holder</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">▸</span> All $20 perks</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">▸</span> Higher referral tier</li>
              </ul>
              <Button asChild className="w-full bg-primary text-black hover:bg-orange-600 font-bold uppercase tracking-wider glow-orange rounded-lg">
                <a href="https://buy.stripe.com/6oU7sD8uSefL3Oa3780Ba02" target="_blank" rel="noreferrer">Buy Now</a>
              </Button>
            </div>

            {/* Bundle 5 */}
            <div className="glass rounded-2xl p-6 flex flex-col relative hover:-translate-y-1 transition-all duration-300 border border-primary/20 glow-orange">
              <div className="absolute top-4 right-4 glass border border-primary/40 text-primary text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg">
                ⭐ Best Value
              </div>
              <div className="w-12 h-12 glass rounded-full flex items-center justify-center text-2xl mb-4">🏆</div>
              <h3 className="text-4xl font-black text-white mb-1">$50</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-primary">416 $BEEP</span>
                <span className="text-xs text-muted-foreground">@ $0.12 / token</span>
              </div>
              <ul className="space-y-3 my-6 flex-1 text-sm text-gray-300">
                <li className="flex items-start gap-2"><span className="text-primary mt-1">▸</span> Serious allocation</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">▸</span> Priority delivery</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">▸</span> VIP Discord role</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">▸</span> Tier 2 referral earnings</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">▸</span> Whitelist priority</li>
              </ul>
              <Button asChild className="w-full bg-primary text-black hover:bg-orange-600 font-bold uppercase tracking-wider glow-orange rounded-lg">
                <a href="https://buy.stripe.com/eVq6ox3aydnHaas6Iy0Ba03" target="_blank" rel="noreferrer">Buy Now</a>
              </Button>
            </div>

            {/* Bundle 6 — Whale */}
            <div className="rounded-2xl p-6 flex flex-col relative whale-card bg-[#120d00] border border-[#f7760d]/50 token-card-shine">
              <div className="absolute -top-3 right-4 bg-gradient-to-r from-[#f7760d] to-[#ffd700] text-black text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg z-10">
                🐋 Whale Tier
              </div>
              <div className="w-12 h-12 glass rounded-full flex items-center justify-center text-2xl mb-4">👑</div>
              <h3 className="text-4xl font-black mb-1 shimmer-text">$100</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-primary">833 $BEEP</span>
                <span className="text-xs text-muted-foreground">@ $0.12 / token</span>
              </div>
              <ul className="space-y-3 my-6 flex-1 text-sm text-[#e0e0e0]">
                <li className="flex items-start gap-2"><span className="text-[#ffd700] mt-1">★</span> Maximum allocation</li>
                <li className="flex items-start gap-2"><span className="text-[#ffd700] mt-1">★</span> Instant priority delivery</li>
                <li className="flex items-start gap-2"><span className="text-[#ffd700] mt-1">★</span> Diamond Discord</li>
                <li className="flex items-start gap-2"><span className="text-[#ffd700] mt-1">★</span> Top referral tier</li>
                <li className="flex items-start gap-2"><span className="text-[#ffd700] mt-1">★</span> Founding member status</li>
                <li className="flex items-start gap-2"><span className="text-[#ffd700] mt-1">★</span> Direct team access</li>
              </ul>
              <Button asChild className="w-full bg-gradient-to-r from-[#f7760d] to-[#ffd700] text-black hover:opacity-90 font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,215,0,0.3)] border-none rounded-lg">
                <a href="https://buy.stripe.com/8wMaEP5iGdnHb0w1iu0Ba05" target="_blank" rel="noreferrer">Buy Now</a>
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground italic">
            Tokens delivered to your Cardano wallet within 24 hours of purchase...
          </p>
        </div>
      </section>

      {/* ── PROMO CODE SECTION ── */}
      <section className="py-20 bg-background border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-60" />
        <div className="orb-orange w-[500px] h-[500px] top-[-100px] right-[-100px] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <img src="/logo-nobg.png" alt="SPORTSBEEP" className="w-14 h-14 object-contain opacity-90" style={{ filter: 'drop-shadow(0 0 12px rgba(247,118,13,0.4))' }} />
            </div>
            <p className="text-primary text-sm uppercase font-bold tracking-widest mb-2">Coming Soon — Phase 2 Launch</p>
            <h2 className="heading-font text-5xl sm:text-6xl text-white mb-6">EARN WITH YOUR <span className="gradient-text">PROMO CODE</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get paid for building the ecosystem. Share your unique code and earn $BEEP on every referral.
            </p>
          </div>

          <div className="glass-strong rounded-2xl p-6 mb-12 border-t-4 border-t-primary">
            <p className="text-center text-xs text-muted-foreground uppercase font-bold tracking-widest mb-6">Referral Program Snapshot</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:divide-x divide-white/5">
              {[
                { val: '%', label: 'Cut of every sale' },
                { val: '∞', label: 'No referral cap' },
                { val: '$BEEP', label: 'Paid in tokens' },
                { val: 'Auto', label: 'Tracked instantly' },
              ].map(({ val, label }) => (
                <div key={label} className="text-center px-4">
                  <div className="text-3xl font-black text-white mb-1 heading-font italic gradient-text">{val}</div>
                  <div className="text-sm text-primary font-bold">{label}</div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-6 italic">
              * Exact % and payout schedule announced at Phase 2 launch
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { emoji: '📋', step: '1', title: 'Register Wallet', desc: 'Sign up via beta registration form. You\'ll be issued a unique BEEP-XXXXX promo code.' },
              { emoji: '📣', step: '2', title: 'Share Code', desc: 'Post it on social media. Every registration or purchase using your code gets credited.' },
              { emoji: '💸', step: '3', title: 'Earn a Cut', desc: 'Earn a percentage of every bundle purchase. Paid in $BEEP tokens directly to your Cardano wallet.' },
              { emoji: '📈', step: '4', title: 'Build Network', desc: 'The bigger your reach, the bigger your earnings. Top referrers unlock bonus tiers.' },
            ].map(({ emoji, step, title, desc }) => (
              <div key={step} className="glass rounded-2xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all border border-white/5">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-4xl mb-4">{emoji}</div>
                <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">{step}. {title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="h-14 px-8 text-lg font-bold uppercase tracking-wider glass border-2 border-primary text-primary hover:bg-primary hover:text-black transition-all rounded-lg"
              onClick={() => onNavigate('register')}
              data-testid="button-promo-cta"
            >
              Get Your Promo Code — Register Free
            </Button>
          </div>
        </div>
      </section>

      {/* ── WALLETS SECTION ── */}
      <section className="py-20 bg-[#060a12] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <img src="/logo-nobg.png" alt="SPORTSBEEP" className="w-14 h-14 object-contain" style={{ filter: 'drop-shadow(0 0 12px rgba(247,118,13,0.4))' }} />
          </div>
          <h2 className="heading-font text-4xl sm:text-5xl text-white mb-4">NEW TO <span className="gradient-text">CARDANO?</span></h2>
          <p className="text-muted-foreground mb-12">You'll need a Cardano wallet to receive your $BEEP tokens. These are free to set up.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'ETERNL', recommended: true, desc: 'Browser extension & mobile. Multi-account, dApp connector, and hardware wallet support.', href: 'https://eternl.io/' },
              { name: 'LACE', recommended: false, desc: 'Official IOG wallet. Simple interface, built-in staking, multi-chain features coming soon.', href: 'https://www.lace.io/' },
              { name: 'NAMI', recommended: false, desc: 'Lightweight and simple. One-click dApp connection and easy token management.', href: 'https://namiwallet.io/' },
            ].map(({ name, recommended, desc, href }) => (
              <div key={name} className={`glass rounded-2xl p-6 relative border ${recommended ? 'border-primary/40 glow-orange' : 'border-white/5'}`}>
                {recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    Recommended
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-3 mt-2 uppercase tracking-widest ${recommended ? 'text-primary glow-orange-text' : 'text-white'}`}>{name}</h3>
                <p className="text-sm text-muted-foreground mb-6 h-16">{desc}</p>
                <Button asChild variant="outline" className="w-full border-white/10 hover:bg-white/5 hover:border-primary/40">
                  <a href={href} target="_blank" rel="noreferrer">Get {name.charAt(0) + name.slice(1).toLowerCase()}</a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-black py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-3">
                <img src="/logo-nobg.png" alt="SPORTSBEEP" className="w-12 h-12 object-contain" />
                <h2 className="heading-font text-3xl text-white">SPORTS<span className="gradient-text">BEEP</span></h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Next-generation sports ecosystem built on Cardano.</p>
              <div className="flex gap-4">
                {[
                  { href: 'https://x.com/PlaySportsBeep', icon: <FaTwitter className="w-5 h-5" /> },
                  { href: 'https://discord.gg/fNfaaTbrP8', icon: <FaDiscord className="w-5 h-5" /> },
                  { href: 'https://t.me/sportsbeepnews', icon: <FaTelegram className="w-5 h-5" /> },
                ].map(({ href, icon }) => (
                  <a key={href} href={href} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">{icon}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => onNavigate('register')} className="text-muted-foreground hover:text-primary transition-colors">Beta Registration</button></li>
                <li><span className="text-muted-foreground/50 cursor-not-allowed">Sportsbook (Soon)</span></li>
                <li><a href="https://sportsbeep.com/whitepaper.html" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Whitepaper</a></li>
                <li><span className="text-muted-foreground/50 cursor-not-allowed">Tokenomics</span></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Legal Disclaimer</h4>
              <div className="text-xs text-muted-foreground/70 space-y-2 leading-relaxed">
                <p><strong className="text-muted-foreground">RISK WARNING:</strong> Cryptocurrency investments are subject to high market risk. Please make your investments cautiously. SPORTSBEEP will not be held responsible for your investment losses.</p>
                <p><strong className="text-muted-foreground">BETA PHASE:</strong> The SPORTSBEEP platform is currently in Closed Beta. Features, tokenomics, and pricing are subject to change before the public launch.</p>
                <p><strong className="text-muted-foreground">USER RESPONSIBILITY:</strong> You are solely responsible for the security of your Cardano wallet. Never share your seed phrase.</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground font-semibold">
              © 2026 SPORTSBEEP. ALL RIGHTS RESERVED. <span className="mx-2">|</span> Privacy Policy <span className="mx-2">|</span> Cookie Settings
            </p>
            <div className="flex items-center gap-6">
              <p className="text-xs text-muted-foreground/60 uppercase tracking-wider">
                Designed and Engineered by <a href="https://ladmedia.co" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-white">LAD MEDIA</a> EST. 2012
              </p>
              <p className="text-xl heading-font text-muted-foreground/40 tracking-wider">1-800-GAMBLER</p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
