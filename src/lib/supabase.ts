
import { createClient } from '@supabase/supabase-js';

// Default to empty strings for type safety, but provide clear error messages
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if the required environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERROR: Supabase URL and Anon Key must be provided in environment variables');
  // Consider adding a more visible error message in the app UI if needed
}

// Create the Supabase client with proper error handling
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    }
  }
);

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    console.error('Authentication check failed:', error);
    return false;
  }
};

// Types for user profiles
export type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'admin' | 'editor' | 'viewer';
  created_at: string;
};
