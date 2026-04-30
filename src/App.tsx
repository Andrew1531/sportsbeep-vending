import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Thanks from './pages/Thanks';
import { Toaster } from "@/components/ui/toaster";

export type View = 'landing' | 'register' | 'thanks';

function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [promoCode, setPromoCode] = useState<string>('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleNavigate = (view: View) => {
    setCurrentView(view);
  };

  const handleRegisterSuccess = (code: string) => {
    setPromoCode(code);
    setCurrentView('thanks');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      <AnimatePresence mode="wait">
        {currentView === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            <Landing onNavigate={handleNavigate} />
          </motion.div>
        )}
        {currentView === 'register' && (
          <motion.div
            key="register"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            <Register onNavigate={handleNavigate} onSuccess={handleRegisterSuccess} />
          </motion.div>
        )}
        {currentView === 'thanks' && (
          <motion.div
            key="thanks"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            <Thanks onNavigate={handleNavigate} promoCode={promoCode} />
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster />
    </div>
  );
}

export default App;
