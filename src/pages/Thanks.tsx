import React, { useState } from 'react';
import { View } from '../App';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy, Twitter } from 'lucide-react';

interface ThanksProps {
  onNavigate: (view: View) => void;
  promoCode: string;
}

export default function Thanks({ onNavigate, promoCode }: ThanksProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTweet = () => {
    const text = encodeURIComponent(`I just registered for the $BEEP token allocation! Use my code ${promoCode} to join the SPORTSBEEP beta! 🚀 #Cardano #BEEP @SportsBeep`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <div className="relative flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 text-center">
      {/* Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=1600')" }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 to-black/95" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="mb-8 flex justify-center animate-pulse-green rounded-full w-24 h-24 mx-auto items-center bg-green-500/10">
          <CheckCircle className="w-16 h-16 text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
        </div>
        
        <h2 className="heading-font text-5xl sm:text-7xl text-white mb-4">
          THANK <span className="text-primary glow-orange-text">YOU</span>
        </h2>
        <p className="text-muted-foreground text-xl mb-10">
          Registration Complete. Check your email soon.
        </p>

        <div className="bg-card border border-card-border rounded-xl shadow-xl overflow-hidden p-6 sm:p-8 mb-8">
          <h3 className="text-primary uppercase font-bold text-sm tracking-widest mb-4">
            Your Unique Referral Promo Code
          </h3>
          
          <div className="bg-background border-2 border-dashed border-primary/50 rounded-lg p-4 mb-6 relative group overflow-hidden">
            <div className="absolute inset-0 bg-primary/5" />
            <p className="relative z-10 font-mono text-3xl sm:text-4xl font-bold tracking-wider text-white">
              {promoCode || 'BEEP-XXXXX'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Button 
              variant="outline" 
              onClick={handleCopy}
              className="h-12 font-bold uppercase tracking-wider border-border hover:bg-secondary transition-colors"
              data-testid="button-copy-code"
            >
              {copied ? <span className="text-green-500">Copied! ✓</span> : <><Copy className="w-4 h-4 mr-2" /> Copy Code</>}
            </Button>
            <Button 
              onClick={handleTweet}
              className="h-12 font-bold uppercase tracking-wider bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white border-none"
              data-testid="button-tweet-code"
            >
              <Twitter className="w-4 h-4 mr-2" /> Tweet Code
            </Button>
          </div>

          <p className="text-sm text-muted-foreground italic">
            Share this code to earn 100 $BEEP for every 10 verified registrations.
          </p>
        </div>

        <Button 
          variant="ghost"
          onClick={() => onNavigate('landing')}
          className="text-muted-foreground hover:text-white hover:bg-white/5 uppercase tracking-wider text-sm font-semibold"
          data-testid="button-return-home"
        >
          Return to Ecosystem Home
        </Button>
      </div>
    </div>
  );
}
