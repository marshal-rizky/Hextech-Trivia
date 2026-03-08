import { supabase } from './supabase';

/**
 * Registers a new user via Supabase Auth and creates a profile.
 * We use a dummy email derived from the username to maintain the "Summoner Name" experience.
 */
export const registerUser = async (username, password) => {
  try {
    const email = `${username.toLowerCase()}@hextech.com`;
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Authentication failed");

    // Create the public profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { id: authData.user.id, username, role: 'user' }
      ]);

    if (profileError) {
      console.error("Profile creation failed:", profileError);
      return { success: false, error: `Summoner profile creation failed: ${profileError.message}` };
    }

    return { success: true, user: { id: authData.user.id, username, role: 'user' } };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: error.message || 'Registration failed.' };
  }
};

/**
 * Logs in a user via Supabase Auth.
 */
export const loginUser = async (username, password) => {
  try {
    const email = `${username.toLowerCase()}@hextech.com`;
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) throw authError;

    // Fetch profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) throw profileError;

    return { success: true, user: profile };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: 'Invalid summoner name or password.' };
  }
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Logout error:", error);
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
};

export const getTotalUserCount = async () => {
  try {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("User count error:", error);
    return 0;
  }
};

/**
 * Guest mode still uses LocalStorage for simplicity as it's ephemeral
 */
export const setGuestMode = () => {
    const sessionData = {
        id: 'guest_' + Date.now(),
        username: 'Guest',
        role: 'guest'
    };
    // Note: AuthContext will need to handle both Supabase session and this local guest
    localStorage.setItem('hextech_trivia_guest_session', JSON.stringify(sessionData));
    return { success: true, user: sessionData };
};
