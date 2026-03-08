import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../utils/supabase';
import { logoutUser, setGuestMode as authSetGuestMode } from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      // 1. Check for an existing Guest session immediately
      const guestSession = localStorage.getItem('hextech_trivia_guest_session');
      if (guestSession) {
        if (mounted) {
          setUser(JSON.parse(guestSession));
          setLoading(false);
        }
        return; // We have a guest, no need to check Supabase
      }

      // 2. Check for an active Supabase session (this is the reliable way)
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          // Fetch the profile from our database
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (mounted) {
            setUser(profile || null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        // Always mark loading as done, regardless of what happened
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // 3. Listen for future auth changes (login, logout, etc.)
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

          if (mounted) {
            setUser(profile || null);
          }
        } catch (err) {
          console.error('Profile fetch on sign-in error:', err);
        } finally {
          if (mounted) setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
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
