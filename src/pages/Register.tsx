import React, { useState } from 'react';
import { View } from '../App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface RegisterProps {
  onNavigate: (view: View) => void;
  onSuccess: (promoCode: string) => void;
}

const generatePromoCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'BEEP-';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default function Register({ onNavigate, onSuccess }: RegisterProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    promoCode: '',
    email: '',
    wallet: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const generatedCode = generatePromoCode();

    try {
      const formBody = new FormData();
      formBody.append('name', formData.name);
      formBody.append('email', formData.email);
      formBody.append('wallet', formData.wallet);
      formBody.append('referred_by', formData.promoCode);
      formBody.append('generated_code', generatedCode);
      formBody.append('_subject', 'New SPORTSBEEP Beta Registration');
      formBody.append('_template', 'table');

      await fetch('https://formsubmit.co/ajax/andrew@ladmedia.co', {
        method: 'POST',
        body: formBody,
      });

      onSuccess(generatedCode);
    } catch (error) {
      console.error('Submission error:', error);
      // Even if there's an error with formsubmit.co, let them through for the demo
      onSuccess(generatedCode);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=1600')" }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 to-black/95" />

      {/* Content */}
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="text-center mb-8">
          <button 
            onClick={() => onNavigate('landing')}
            className="text-muted-foreground hover:text-white transition-colors text-sm font-semibold tracking-wide mb-6 inline-flex items-center"
            data-testid="button-back-landing"
          >
            ← Back to Homepage
          </button>
          
          <h2 className="heading-font text-5xl sm:text-6xl text-white mb-2">
            BETA <span className="text-primary glow-orange-text">ACCESS</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Complete the form below to register your wallet for the Phase 1 $BEEP token allocation.
          </p>
        </div>

        <div className="bg-card border border-card-border rounded-xl shadow-xl overflow-hidden p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-muted-foreground uppercase text-xs font-bold tracking-wider">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  required 
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-background border-border focus-visible:ring-primary h-12"
                  placeholder="John Doe"
                  data-testid="input-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="promoCode" className="text-muted-foreground uppercase text-xs font-bold tracking-wider">Promo Code (Optional)</Label>
                <Input 
                  id="promoCode" 
                  name="promoCode" 
                  value={formData.promoCode}
                  onChange={handleChange}
                  className="bg-background border-border focus-visible:ring-primary h-12 uppercase"
                  placeholder="BEEP-XXXXX"
                  data-testid="input-promo"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground uppercase text-xs font-bold tracking-wider">Email Address</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                required 
                value={formData.email}
                onChange={handleChange}
                className="bg-background border-border focus-visible:ring-primary h-12"
                placeholder="john@example.com"
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallet" className="text-muted-foreground uppercase text-xs font-bold tracking-wider">Cardano Wallet Address</Label>
              <Input 
                id="wallet" 
                name="wallet" 
                required 
                value={formData.wallet}
                onChange={handleChange}
                className="bg-background border-border focus-visible:ring-primary h-12 font-mono text-sm"
                placeholder="addr1..."
                data-testid="input-wallet"
              />
              <p className="text-xs text-muted-foreground italic mt-1">
                Note: Use Eternl, Lace, or Nami for best compatibility.
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 text-lg font-bold uppercase tracking-wider glow-orange hover:bg-orange-600 text-black transition-all"
              data-testid="button-submit-register"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Registering...
                </>
              ) : (
                'Confirm Registration'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
