import { Link, useLocation } from 'react-router-dom';
import { Swords, Settings as SettingsIcon, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="w-full glass-panel border-b border-[var(--color-glass-border)] z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-hextech-blue)] to-[var(--color-navy)] flex items-center justify-center border border-[var(--color-gold)] group-hover:glow-blue transition-all duration-300">
              <Swords className="text-[var(--color-gold)] w-6 h-6" />
            </div>
            <span className="font-[Cinzel] text-xl font-bold text-gradient-gold tracking-wider">
              Hextech Trivia
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                isActive('/') ? 'text-[var(--color-hextech-blue)]' : 'text-gray-300 hover:text-[var(--color-gold)]'
              }`}
            >
              Dashboard
              {isActive('/') && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-hextech-blue)] glow-blue rounded-t-md" />
              )}
            </Link>

            <Link 
              to="/vault" 
              className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                isActive('/vault') ? 'text-[var(--color-hextech-blue)]' : 'text-gray-300 hover:text-[var(--color-gold)]'
              }`}
            >
              Vault
              {isActive('/vault') && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-hextech-blue)] glow-blue rounded-t-md" />
              )}
            </Link>

            <Link 
              to="/settings" 
              className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                isActive('/settings') ? 'text-[var(--color-hextech-blue)]' : 'text-gray-300 hover:text-[var(--color-gold)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <SettingsIcon className="w-4 h-4" />
                Settings
              </div>
              {isActive('/settings') && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--color-hextech-blue)] glow-blue rounded-t-md" />
              )}
            </Link>
          </div>

          {/* Maker Profile */}
          <div className="flex items-center gap-4 border-l border-[var(--color-glass-border)] pl-6">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-gray-200">{user?.username || 'Summoner'}</span>
              <span className="text-xs text-[var(--color-gold)] capitalize">
                {user?.role === 'guest' ? 'Wanderer' : 'Grandmaster'}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-[var(--color-gold)] overflow-hidden bg-[var(--color-deep-navy)] flex items-center justify-center">
              <User className="text-gray-400 w-6 h-6" />
            </div>
            
            {user && (
              <button 
                onClick={logout}
                className="ml-2 p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all group"
                title="Log Out"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
