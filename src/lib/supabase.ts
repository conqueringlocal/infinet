
import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase values since environment variables aren't loading correctly
const supabaseUrl = "https://gqcfneuiruffgpwhkecy.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxY2ZuZXVpcnVmZmdwd2hrZWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NjUyNzAsImV4cCI6MjA1ODU0MTI3MH0.Wm8coMFjXv8TA2bQfiXoDYjzml92iTPSDuZOlPJhD_0";

// Create the Supabase client
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
  updated_at?: string;
};
