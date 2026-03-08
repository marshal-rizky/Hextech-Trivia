import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../utils/supabase';
import { logoutUser, setGuestMode as authSetGuestMode } from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // ⚡ Safety net: ALWAYS stop loading after 4 seconds no matter what.
    // This prevents the app from hanging if Supabase is slow or unreachable.
    const safetyTimer = setTimeout(() => {
      if (mounted) {
        console.warn('Auth check timed out. Proceeding without session.');
        setLoading(false);
      }
    }, 4000);

    const initializeAuth = async () => {
      // 1. Check for Guest Session first (instant, no network needed)
      const guestSession = localStorage.getItem('hextech_trivia_guest_session');
      if (guestSession) {
        if (mounted) {
          setUser(JSON.parse(guestSession));
          setLoading(false);
          clearTimeout(safetyTimer);
        }
        return;
      }

      // 2. Check for active Supabase session
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('getSession error:', error);
        }

        if (session?.user && mounted) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (mounted) setUser(profile || null);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        // Mark loading done and cancel safety timer
        clearTimeout(safetyTimer);
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // 3. Listen for future auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
        return;
      }

      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (mounted) setUser(profile || null);
        } catch (err) {
          console.error('Profile fetch error on sign-in:', err);
        } finally {
          if (mounted) setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, []);

  const login = (userData) => {
    setUser(userData);
    setLoading(false);
  };

  const logout = async () => {
    await logoutUser();
    localStorage.removeItem('hextech_trivia_guest_session');
    setUser(null);
  };

  const setGuest = () => {
    const res = authSetGuestMode();
    setUser(res.user);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
