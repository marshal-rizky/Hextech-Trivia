import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import QuizMaker from './pages/QuizMaker';
import GameTaker from './pages/GameTaker';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import QuizVault from './pages/QuizVault';
import LeaderboardPage from './pages/LeaderboardPage';
import { useAuth } from './context/AuthContext';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Guest Redirect Wrapper (For Login/Register pages)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  // Allow true guests to visit the landing page and auth pages so they can upgrade their account
  if (user && user.role !== 'guest') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Auto-guest setter for /guest route
// Auto-guest setter for /guest route
const GuestLogin = () => {
  const { setGuest } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setGuest();
    // Use navigate immediately to stay within the SPA context
    navigate('/dashboard', { replace: true });
  }, [setGuest, navigate]);

  return <div className="text-white text-center mt-20">Entering as Wanderer...</div>;
};

function App() {
  const { loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-[var(--color-navy)] flex items-center justify-center text-[var(--color-gold)] font-[Cinzel] text-2xl">Loading the Vault...</div>;

  return (
    <Router>
      <div className="min-h-screen flex flex-col relative w-full overflow-hidden text-gray-100 font-sans">
        {/* Ambient background glow effects */}
        <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#0ac8b9]/10 to-transparent pointer-events-none z-0" />
        <div className="fixed -top-[20%] -left-[10%] w-[50%] h-[50%] bg-[#0ac8b9]/5 blur-[120px] rounded-full pointer-events-none z-0" />
        <div className="fixed top-[20%] -right-[10%] w-[40%] h-[40%] bg-[#c8aa6e]/5 blur-[100px] rounded-full pointer-events-none z-0" />
        
        <Navbar />
        
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 w-full">
          <Routes>
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><AuthPage /></PublicRoute>} />
            <Route path="/guest" element={<GuestLogin />} />
            <Route path="/vault" element={<ProtectedRoute><QuizVault /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/create" element={<ProtectedRoute><QuizMaker /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            
            {/* GameTaker is accessible by anyone who has the link (including guests) */}
            <Route path="/play/:id" element={<ProtectedRoute><GameTaker /></ProtectedRoute>} />
            <Route path="/leaderboard/:id" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
