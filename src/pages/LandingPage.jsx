import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sword, Users, Trophy, Play } from 'lucide-react';
import Button from '../components/Button';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] animate-in zoom-in duration-700 text-center relative max-w-5xl mx-auto px-4">
      
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-hextech-blue)] opacity-10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-gold)] opacity-5 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <div className="relative z-10 mb-16">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-[var(--color-navy)] border border-[var(--color-glass-border)] shadow-2xl mb-8 glow-blue">
           <Sword className="w-16 h-16 text-[var(--color-hextech-blue)]" />
        </div>
        
        <h1 className="text-6xl md:text-7xl font-[Cinzel] font-bold text-white mb-6 drop-shadow-2xl leading-tight">
          Welcome to <br/>
          <span className="text-gradient-gold">Hextech Trivia</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 font-medium">
          Forge custom trials, test your lore knowledge, and challenge summoners across Runeterra. 
          Are you ready to prove your worth?
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button onClick={() => navigate('/login')} className="!px-12 !py-4 text-lg w-full sm:w-auto shadow-[0_0_30px_rgba(10,200,185,0.3)]">
            Log In to Vault
          </Button>
          <Button onClick={() => navigate('/register')} variant="secondary" className="!px-12 !py-4 text-lg w-full sm:w-auto">
            Create Account
          </Button>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2">
            <span className="text-gray-500">or</span>
            <button 
                onClick={() => navigate('/guest')} 
                className="text-[var(--color-hextech-blue)] hover:text-white transition-colors underline underline-offset-4 decoration-dashed font-bold flex items-center gap-2"
            >
                <Play className="w-4 h-4"/> Play as Guest
            </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-12 relative z-10">
        <div className="glass-panel p-8 rounded-xl border border-[var(--color-glass-border)] text-left hover:-translate-y-2 transition-transform duration-300">
          <Sword className="w-10 h-10 text-[var(--color-hextech-blue)] mb-4" />
          <h3 className="text-xl font-bold text-white mb-3">Create Trials</h3>
          <p className="text-gray-400">Design intricate quizzes with custom imagery, timers, and bounty points.</p>
        </div>
        <div className="glass-panel p-8 rounded-xl border border-[var(--color-glass-border)] text-left hover:-translate-y-2 transition-transform duration-300">
          <Trophy className="w-10 h-10 text-[var(--color-gold)] mb-4" />
          <h3 className="text-xl font-bold text-white mb-3">Climb Ranks</h3>
          <p className="text-gray-400">Score points based on speed and accuracy to achieve Challenger rank.</p>
        </div>
        <div className="glass-panel p-8 rounded-xl border border-[var(--color-glass-border)] text-left hover:-translate-y-2 transition-transform duration-300">
          <Users className="w-10 h-10 text-blue-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-3">Guest Mode</h3>
          <p className="text-gray-400">Jump right into the action as a wanderer to play community-made artifacts.</p>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;
