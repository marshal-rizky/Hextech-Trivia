import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sword, Lock, User as UserIcon, Loader2 } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { loginUser, registerUser } from '../utils/auth';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const isLogin = location.pathname === '/login';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please provide both summoner name and password.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match. Please verify your secret phrase.');
      return;
    }

    setIsLoading(true);
    try {
      let result;
      if (isLogin) {
        result = await loginUser(username, password);
      } else {
        result = await registerUser(username, password);
      }

      if (result.success) {
        login(result.user);
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected authentication error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] animate-in slide-in-from-bottom-8 duration-500">
      
      <Card className="w-full max-w-md p-8 relative overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[var(--color-gold)] opacity-50 m-2 rounded-tl-lg pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[var(--color-hextech-blue)] opacity-50 m-2 rounded-br-lg pointer-events-none" />

        <div className="text-center mb-8">
          <Sword className="w-12 h-12 mx-auto text-[var(--color-hextech-blue)] mb-4 glow-blue" />
          <h2 className="text-3xl font-[Cinzel] font-bold text-white mb-2">
            {isLogin ? 'Artifact Vault Login' : 'Create New Account'}
          </h2>
          <p className="text-sm text-gray-400">
            {isLogin ? 'Welcome back, summoner.' : 'Register to forge your own trials.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-[var(--color-gold)] uppercase tracking-wider mb-2">Summoner Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="w-full bg-[var(--color-deep-navy)] border border-[var(--color-glass-border)] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[var(--color-hextech-blue)] transition-colors disabled:opacity-50"
                placeholder="Enter your alias"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--color-gold)] uppercase tracking-wider mb-2">Secret Phrase (Password)</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full bg-[var(--color-deep-navy)] border border-[var(--color-glass-border)] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[var(--color-hextech-blue)] transition-colors disabled:opacity-50"
                placeholder="Enter your password"
              />
            </div>
          </div>
          
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-[var(--color-gold)] uppercase tracking-wider mb-2">Confirm Secret Phrase</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-[var(--color-deep-navy)] border border-[var(--color-glass-border)] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[var(--color-hextech-blue)] transition-colors disabled:opacity-50"
                  placeholder="Repeat your secret phrase"
                />
              </div>
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full !py-3 font-bold shadow-[0_0_20px_rgba(10,200,185,0.2)]">
            {isLoading ? (
              <Loader2 className="w-5 h-5 mx-auto animate-spin" />
            ) : (
              isLogin ? 'Authenticate' : 'Create Account'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          {isLogin ? (
            <p>
              New to the Vault?{' '}
              <button 
                type="button"
                onClick={() => navigate('/register')} 
                disabled={isLoading}
                className="text-[var(--color-gold)] hover:text-white transition-colors underline underline-offset-4 decoration-dashed font-bold disabled:opacity-50"
              >
                Sign Up Here
              </button>
            </p>
          ) : (
            <p>
              Already a member?{' '}
              <button 
                type="button"
                onClick={() => navigate('/login')} 
                disabled={isLoading}
                className="text-[var(--color-hextech-blue)] hover:text-white transition-colors underline underline-offset-4 decoration-dashed font-bold disabled:opacity-50"
              >
                Log In Here
              </button>
            </p>
          )}
        </div>
      </Card>

    </div>
  );
};

export default AuthPage;
