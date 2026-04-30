import React from 'react';
import { View } from '../App';
import { Button } from '@/components/ui/button';
import { FaDiscord, FaTelegram, FaTwitter } from 'react-icons/fa';
import LiveSportsPanel from '../components/LiveSportsPanel';
import SportsbookTeaser from '../components/SportsbookTeaser';

interface LandingProps {
  onNavigate: (view: View) => void;
}

export default function Landing({ onNavigate }: LandingProps) {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* TOP NAV — DraftKings/FanDuel style */}
      <header className="fixed top-0 left-0 right-0 z-50 dk-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Left: nav links */}
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

          {/* Right: logo + CTA */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <span className="live-dot w-2 h-2 rounded-full bg-green-400" />
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Phase 1 Live</span>
            </div>
            <button
              onClick={() => onNavigate('register')}
              className="text-xs font-bold text-muted-foreground hover:text-white uppercase tracking-wider transition-colors"
              data-testid="button-nav-register"
            >
              Sign Up
            </button>
            <Button
              size="sm"
              className="bg-primary text-black hover:bg-orange-500 font-bold uppercase tracking-wider text-xs px-4 glow-orange"
              onClick={() => onNavigate('register')}
              data-testid="button-nav-cta"
            >
              Claim $BEEP
            </Button>
            {/* Logo (top right) */}
            <div className="flex items-center gap-2 ml-2 border-l border-card-border pl-4">
              <div>
                <div className="heading-font text-lg text-white leading-none">SPORTS<span className="text-primary">BEEP</span></div>
                <div className="text-[8px] text-muted-foreground uppercase tracking-[0.2em] leading-none">Next-Gen Sports</div>
              </div>
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-black text-black text-xs heading-font flex-shrink-0">SB</div>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-14 overflow-hidden border-b-2 border-primary/60">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=1600')" }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 to-black/90" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 text-center flex flex-col items-center">
          <div className="flex items-center gap-3 mb-5">
            <span className="live-dot w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-xs font-bold uppercase tracking-[0.35em] text-red-400">Phase 1 Allocation — Limited Slots Remaining</span>
          </div>
          <h2 className="heading-font text-7xl sm:text-9xl md:text-[10rem] text-white mb-4 leading-none">
            THE CLOCK<br /><span className="text-primary glow-orange-text">IS TICKING</span>
          </h2>
          <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Phase 1 is <span className="text-white font-bold">live and closing fast</span>. Secure your <span className="text-primary font-bold">$BEEP</span> at founder pricing before the public launch — then use it to bet, earn, and win on the SPORTSBEEP platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-center mb-8">
            <Button 
              size="lg"
              className="h-14 px-10 text-base font-bold uppercase tracking-wider glow-orange hover:bg-orange-500 text-black transition-all rounded"
              onClick={() => onNavigate('register')}
              data-testid="button-hero-cta"
            >
              Claim My $BEEP — Register Free
            </Button>
            <a href="#bundles" className="h-14 px-8 flex items-center text-base font-bold uppercase tracking-wider border border-white/20 text-white hover:border-primary hover:text-primary transition-all rounded">
              Buy Tokens Now
            </a>
          </div>
          {/* Quick stats bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-muted-foreground uppercase tracking-widest">
            <span><span className="text-primary text-lg font-black">$0.12</span> / $BEEP</span>
            <span className="w-px h-4 bg-card-border" />
            <span><span className="text-white text-lg font-black">10M</span> fixed supply</span>
            <span className="w-px h-4 bg-card-border" />
            <span><span className="text-green-400 text-lg font-black">100</span> $BEEP per 10 referrals</span>
          </div>
        </div>
      </section>

      {/* LIVE SPORTS PANEL — directly under hero */}
      <div id="live-sports">
        <LiveSportsPanel onNavigate={onNavigate} />
      </div>

      {/* SPORTSBOOK TEASER */}
      <div id="platform-preview">
        <SportsbookTeaser onNavigate={onNavigate} />
      </div>

      {/* DISTRIBUTION & MILESTONES */}
      <section className="py-20 bg-background relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Card */}
            <div className="bg-card border border-card-border rounded-xl p-8">
              <h3 className="heading-font text-3xl text-white mb-1">KEY METRICS</h3>
              <p className="text-primary text-sm uppercase font-bold tracking-widest mb-8">Fixed Infrastructure</p>
              
              <ul className="space-y-6 mb-8">
                <li className="flex justify-between items-center border-b border-card-border pb-4">
                  <span className="text-muted-foreground font-semibold">Initial Price per $BEEP</span>
                  <span className="text-primary font-bold text-xl">$0.12</span>
                </li>
                <li className="flex justify-between items-center border-b border-card-border pb-4">
                  <span className="text-muted-foreground font-semibold">Fixed Total Supply</span>
                  <span className="text-white font-bold text-xl">10,000,000</span>
                </li>
                <li className="flex justify-between items-center border-b border-card-border pb-4">
                  <span className="text-muted-foreground font-semibold">Current Phase</span>
                  <span className="text-white font-bold">Phase 1: Closed Beta</span>
                </li>
              </ul>

              <div className="bg-background rounded-lg p-4 mb-4 border border-card-border">
                <p className="text-xs text-muted-foreground uppercase font-bold mb-2 tracking-wider">Policy ID</p>
                <p className="font-mono text-sm text-primary break-all">a221e11c9d474ac3709911161bcfd02969d268e927089d3c55a4c3c2</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-green"></div>
                <p className="text-sm text-muted-foreground italic">Policy locked since 2025-10-14 18:31:24 UTC</p>
              </div>
            </div>

            {/* Right Card */}
            <div className="bg-card border border-card-border rounded-xl p-8">
              <h3 className="heading-font text-3xl text-white mb-1">PHASED DISTRIBUTION PLAN</h3>
              <p className="text-primary text-sm uppercase font-bold tracking-widest mb-8">Ecosystem Roadmap</p>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-card-border before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <span className="text-black font-bold text-sm">1</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-primary/50 bg-background shadow-lg">
                    <h4 className="text-primary font-bold text-lg mb-1 uppercase tracking-wide">Closed Beta Allocation</h4>
                    <p className="text-sm text-muted-foreground">Tokens for founders, contributors, and beta testers. Not publicly tradable yet.</p>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-card-border shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <span className="text-muted-foreground font-bold text-sm">2</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-card-border bg-background shadow-lg">
                    <h4 className="text-white font-bold text-lg mb-1 uppercase tracking-wide">Expansion</h4>
                    <p className="text-sm text-muted-foreground">50,000 $BEEP allocated to deepen liquidity and fund app development.</p>
                  </div>
                </div>

                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-card-border shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <span className="text-muted-foreground font-bold text-sm">3</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-card-border bg-background shadow-lg">
                    <h4 className="text-white font-bold text-lg mb-1 uppercase tracking-wide">Community Growth</h4>
                    <p className="text-sm text-muted-foreground">250,000 $BEEP for staking rewards and referral program payouts.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-card-border text-center">
                <p className="text-sm text-muted-foreground italic">
                  Remaining Supply (6.2M $BEEP) Reserved for future milestones...
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BUNDLES SECTION */}
      <section id="bundles" className="py-20 bg-black relative border-t border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <p className="text-primary text-sm uppercase font-bold tracking-widest mb-2">Instant Access — Phase 1 Pricing</p>
            <h2 className="heading-font text-5xl sm:text-6xl text-white mb-6">BUY <span className="text-primary">$BEEP</span> NOW</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Secure your allocation before Phase 2. Current fixed rate is $0.12 per token.
            </p>
          </div>

          {/* Social Banner */}
          <div className="bg-card border-l-4 border-l-primary rounded-r-xl p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex flex-col items-start gap-2">
              <div className="bg-green-500/20 text-green-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Free Access</div>
              <h3 className="heading-font text-2xl text-white">JOIN OUR COMMUNITY — 100% FREE</h3>
              <p className="text-sm text-muted-foreground">No purchase required. Connect with the team and early adopters.</p>
            </div>
            <div className="flex gap-3">
              <a href="https://x.com/PlaySportsBeep" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-background border border-card-border flex items-center justify-center text-white hover:text-primary hover:border-primary transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="https://discord.gg/fNfaaTbrP8" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-background border border-card-border flex items-center justify-center text-white hover:text-primary hover:border-primary transition-colors">
                <FaDiscord className="w-5 h-5" />
              </a>
              <a href="https://t.me/sportsbeepnews" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-background border border-card-border flex items-center justify-center text-white hover:text-primary hover:border-primary transition-colors">
                <FaTelegram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Bundles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Bundle 1 */}
            <div className="bg-card border border-card-border rounded-xl p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center text-2xl mb-4">🎯</div>
              <h3 className="text-4xl font-black text-white mb-1">$5</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-primary">41 $BEEP</span>
                <span className="text-xs text-muted-foreground">@ $0.12 / token</span>
              </div>
              <ul className="space-y-3 my-6 flex-1 text-sm text-gray-300">
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Starter allocation</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Beta access badge</li>
              </ul>
              <Button asChild className="w-full bg-primary text-black hover:bg-orange-600 font-bold uppercase tracking-wider glow-orange">
                <a href="https://buy.stripe.com/28EcMXfXk4Rb3Oa3740Ba00" target="_blank" rel="noreferrer">Buy Now</a>
              </Button>
            </div>

            {/* Bundle 2 */}
            <div className="bg-card border border-card-border rounded-xl p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center text-2xl mb-4">⚡</div>
              <h3 className="text-4xl font-black text-white mb-1">$10</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-primary">83 $BEEP</span>
                <span className="text-xs text-muted-foreground">@ $0.12 / token</span>
              </div>
              <ul className="space-y-3 my-6 flex-1 text-sm text-gray-300">
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Core allocation</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Beta access badge</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Early holder status</li>
              </ul>
              <Button asChild className="w-full bg-primary text-black hover:bg-orange-600 font-bold uppercase tracking-wider glow-orange">
                <a href="https://buy.stripe.com/cNi3cn8uS4Rb70m2300Ba01" target="_blank" rel="noreferrer">Buy Now</a>
              </Button>
            </div>

            {/* Bundle 3 (Featured) */}
            <div className="bg-card border-2 border-primary rounded-xl p-6 flex flex-col relative transform lg:-translate-y-4 shadow-[0_0_30px_rgba(247,118,13,0.15)] z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black text-xs font-black uppercase tracking-widest px-4 py-1 rounded-full whitespace-nowrap">
                🔥 Most Popular
              </div>
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center text-2xl mb-4">🚀</div>
              <h3 className="text-4xl font-black text-white mb-1 shimmer-text">$20</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-primary">166 $BEEP</span>
                <span className="text-xs text-muted-foreground">@ $0.12 / token</span>
              </div>
              <ul className="space-y-3 my-6 flex-1 text-sm text-gray-300">
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Boosted allocation</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Priority wallet delivery</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Discord VIP role</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Referral bonus eligible</li>
              </ul>
              <Button asChild className="w-full bg-primary text-black hover:bg-orange-600 font-bold uppercase tracking-wider glow-orange">
                <a href="https://buy.stripe.com/eVqeV5h1ocjDgAWdLI0Ba04" target="_blank" rel="noreferrer">Buy Now</a>
              </Button>
            </div>

            {/* Bundle 4 */}
            <div className="bg-card border border-card-border rounded-xl p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center text-2xl mb-4">💎</div>
              <h3 className="text-4xl font-black text-white mb-1">$35</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-primary">291 $BEEP</span>
                <span className="text-xs text-muted-foreground">@ $0.12 / token</span>
              </div>
              <ul className="space-y-3 my-6 flex-1 text-sm text-gray-300">
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Core holder</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> All $20 perks</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Higher referral tier</li>
              </ul>
              <Button asChild className="w-full bg-primary text-black hover:bg-orange-600 font-bold uppercase tracking-wider glow-orange">
                <a href="https://buy.stripe.com/6oU7sD8uSefL3Oa3780Ba02" target="_blank" rel="noreferrer">Buy Now</a>
              </Button>
            </div>

            {/* Bundle 5 (Featured) */}
            <div className="bg-card border border-primary/50 rounded-xl p-6 flex flex-col relative hover:-translate-y-1 transition-transform duration-300">
              <div className="absolute top-4 right-4 bg-background border border-primary/50 text-primary text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                ⭐ Best Value
              </div>
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center text-2xl mb-4">🏆</div>
              <h3 className="text-4xl font-black text-white mb-1">$50</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-primary">416 $BEEP</span>
                <span className="text-xs text-muted-foreground">@ $0.12 / token</span>
              </div>
              <ul className="space-y-3 my-6 flex-1 text-sm text-gray-300">
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Serious allocation</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Priority delivery</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> VIP Discord role</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Tier 2 referral earnings</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span> Whitelist priority</li>
              </ul>
              <Button asChild className="w-full bg-primary text-black hover:bg-orange-600 font-bold uppercase tracking-wider glow-orange">
                <a href="https://buy.stripe.com/eVq6ox3aydnHaas6Iy0Ba03" target="_blank" rel="noreferrer">Buy Now</a>
              </Button>
            </div>

            {/* Bundle 6 (Whale) */}
            <div className="bg-[#1a1500] border border-[#f7760d] rounded-xl p-6 flex flex-col relative whale-card">
              <div className="absolute -top-3 right-4 bg-gradient-to-r from-[#f7760d] to-[#ffd700] text-black text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                🐋 Whale Tier
              </div>
              <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-2xl mb-4">👑</div>
              <h3 className="text-4xl font-black text-white mb-1 shimmer-text">$100</h3>
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
              <Button asChild className="w-full bg-gradient-to-r from-[#f7760d] to-[#ffd700] text-black hover:opacity-90 font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,215,0,0.4)] border-none">
                <a href="https://buy.stripe.com/8wMaEP5iGdnHb0w1iu0Ba05" target="_blank" rel="noreferrer">Buy Now</a>
              </Button>
            </div>

          </div>

          <p className="text-center text-sm text-muted-foreground italic">
            Tokens delivered to your Cardano wallet within 24 hours of purchase...
          </p>

        </div>
      </section>

      {/* PROMO CODE SECTION */}
      <section className="py-20 bg-background border-t border-card-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <p className="text-primary text-sm uppercase font-bold tracking-widest mb-2">Coming Soon — Phase 2 Launch</p>
            <h2 className="heading-font text-5xl sm:text-6xl text-white mb-6">EARN WITH YOUR <span className="text-primary">PROMO CODE</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get paid for building the ecosystem. Share your unique code and earn $BEEP on every referral.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="bg-card border border-card-border border-t-4 border-t-primary rounded-xl p-6 mb-12 shadow-xl">
            <p className="text-center text-xs text-muted-foreground uppercase font-bold tracking-widest mb-6">Referral Program Snapshot</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:divide-x divide-card-border">
              <div className="text-center px-4">
                <div className="text-3xl font-black text-white mb-1">%</div>
                <div className="text-sm text-primary font-bold">Cut of every sale</div>
              </div>
              <div className="text-center px-4">
                <div className="text-3xl font-black text-white mb-1">∞</div>
                <div className="text-sm text-primary font-bold">No referral cap</div>
              </div>
              <div className="text-center px-4">
                <div className="text-3xl font-black text-white mb-1 heading-font italic">$BEEP</div>
                <div className="text-sm text-primary font-bold">Paid in tokens</div>
              </div>
              <div className="text-center px-4">
                <div className="text-3xl font-black text-white mb-1">Auto</div>
                <div className="text-sm text-primary font-bold">Tracked instantly</div>
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-6 italic">
              * Exact % and payout schedule announced at Phase 2 launch
            </p>
          </div>

          {/* 4 Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-black border border-card-border p-6 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-4xl mb-4">📋</div>
              <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">1. Register Wallet</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sign up via beta registration form. You'll be issued a unique BEEP-XXXXX promo code.
              </p>
            </div>
            <div className="bg-black border border-card-border p-6 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-4xl mb-4">📣</div>
              <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">2. Share Code</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Post it on social media. Every registration or purchase using your code gets credited.
              </p>
            </div>
            <div className="bg-black border border-card-border p-6 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-4xl mb-4">💸</div>
              <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">3. Earn a Cut</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Earn a percentage of every bundle purchase. Paid in $BEEP tokens directly to your Cardano wallet.
              </p>
            </div>
            <div className="bg-black border border-card-border p-6 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-4xl mb-4">📈</div>
              <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">4. Build Network</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The bigger your reach, the bigger your earnings. Top referrers unlock bonus tiers.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button 
              size="lg"
              className="h-14 px-8 text-lg font-bold uppercase tracking-wider bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-black transition-all"
              onClick={() => onNavigate('register')}
              data-testid="button-promo-cta"
            >
              Get Your Promo Code — Register Free
            </Button>
          </div>

        </div>
      </section>

      {/* WALLETS SECTION */}
      <section className="py-20 bg-[#0a0f18] border-t border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-font text-4xl sm:text-5xl text-white mb-12">NEW TO <span className="text-primary">CARDANO?</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            
            <div className="bg-card border border-primary/30 rounded-xl p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                Recommended
              </div>
              <h3 className="text-xl font-bold text-white mb-3 mt-2 uppercase tracking-widest">ETERNL</h3>
              <p className="text-sm text-muted-foreground mb-6 h-16">
                Browser extension & mobile. Multi-account, dApp connector, and hardware wallet support.
              </p>
              <Button asChild variant="outline" className="w-full border-border hover:bg-secondary">
                <a href="https://eternl.io/" target="_blank" rel="noreferrer">Get Eternl</a>
              </Button>
            </div>

            <div className="bg-card border border-card-border rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-widest">LACE</h3>
              <p className="text-sm text-muted-foreground mb-6 h-16">
                Official IOG wallet. Simple interface, built-in staking, multi-chain features coming soon.
              </p>
              <Button asChild variant="outline" className="w-full border-border hover:bg-secondary">
                <a href="https://www.lace.io/" target="_blank" rel="noreferrer">Get Lace</a>
              </Button>
            </div>

            <div className="bg-card border border-card-border rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-widest">NAMI</h3>
              <p className="text-sm text-muted-foreground mb-6 h-16">
                Lightweight and simple. One-click dApp connection and easy token management.
              </p>
              <Button asChild variant="outline" className="w-full border-border hover:bg-secondary">
                <a href="https://namiwallet.io/" target="_blank" rel="noreferrer">Get Nami</a>
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-16 border-t border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            <div className="md:col-span-1">
              <h2 className="heading-font text-3xl text-white mb-2">SPORTS<span className="text-primary">BEEP</span></h2>
              <p className="text-sm text-muted-foreground mb-6">
                Next-generation sports ecosystem built on Cardano.
              </p>
              <div className="flex gap-4">
                <a href="https://x.com/PlaySportsBeep" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <FaTwitter className="w-5 h-5" />
                </a>
                <a href="https://discord.gg/fNfaaTbrP8" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <FaDiscord className="w-5 h-5" />
                </a>
                <a href="https://t.me/sportsbeepnews" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <FaTelegram className="w-5 h-5" />
                </a>
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

          <div className="border-t border-card-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground font-semibold">
              © 2026 SPORTSBEEP. ALL RIGHTS RESERVED. <span className="mx-2">|</span> Privacy Policy <span className="mx-2">|</span> Cookie Settings
            </p>
            <div className="flex items-center gap-6">
              <p className="text-xs text-muted-foreground/60 uppercase tracking-wider">
                Designed and Engineered by <a href="https://ladmedia.co" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-white">LAD MEDIA</a> EST. 2012
              </p>
              <p className="text-xl heading-font text-muted-foreground/40 tracking-wider">
                1-800-GAMBLER
              </p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
