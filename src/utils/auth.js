import { supabase } from './supabase';

/**
 * Wraps a promise with a timeout.
 */
const withTimeout = (promise, ms = 10000) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Request timed out after ${ms / 1000}s. Please check your internet connection.`)), ms)
  );
  return Promise.race([promise, timeout]);
};

/**
 * Registers a new user via Supabase Auth.
 * The profile is automatically created by a database trigger (handle_new_user).
 * We do NOT insert the profile here to avoid the Web Locks race condition.
 */
export const registerUser = async (username, password) => {
  try {
    const email = `${username.toLowerCase()}@hextech.com`;

    const { data: authData, error: authError } = await withTimeout(
      supabase.auth.signUp({
        email,
        password,
        options: { data: { username } } // username stored in user_meta_data for the trigger
      })
    );

    if (authError) throw authError;
    if (!authData.user) throw new Error("Authentication failed — no user returned.");

    // Wait for the DB trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 1200));

    return { success: true, user: { id: authData.user.id, username, role: 'user' } };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: error.message || 'Registration failed. Please try again.' };
  }
};

/**
 * Logs in a user via Supabase Auth.
 */
export const loginUser = async (username, password) => {
  try {
    const email = `${username.toLowerCase()}@hextech.com`;

    const { data: authData, error: authError } = await withTimeout(
      supabase.auth.signInWithPassword({ email, password })
    );

    if (authError) throw authError;

    const { data: profile, error: profileError } = await withTimeout(
      supabase.from('profiles').select('*').eq('id', authData.user.id).single()
    );

    if (profileError) throw profileError;

    return { success: true, user: profile };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: error.message || 'Login failed. Please try again.' };
  }
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Logout error:", error);
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return profile;
};

export const getTotalUserCount = async () => {
  try {
    const { count, error } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("User count error:", error);
    return 0;
  }
};

export const setGuestMode = () => {
  const sessionData = { id: 'guest_' + Date.now(), username: 'Guest', role: 'guest' };
  localStorage.setItem('hextech_trivia_guest_session', JSON.stringify(sessionData));
  return { success: true, user: sessionData };
};
