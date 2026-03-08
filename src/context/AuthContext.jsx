import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../utils/supabase';
import { logoutUser, setGuestMode as authSetGuestMode } from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check for Guest Session first
    const guestSession = localStorage.getItem('hextech_trivia_guest_session');
    if (guestSession) {
      setUser(JSON.parse(guestSession));
      setLoading(false);
    }

    // 2. Setup Supabase Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser(profile);
          // If we logged in, clear guest session
          localStorage.removeItem('hextech_trivia_guest_session');
        }
      } else if (!guestSession) {
        // Only clear user if there's no guest session being processed
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    await logoutUser();
    localStorage.removeItem('hextech_trivia_guest_session');
    setUser(null);
  };

  const setGuest = () => {
    const res = authSetGuestMode();
    setUser(res.user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
