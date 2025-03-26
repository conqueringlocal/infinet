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

// We're using the UserProfile from user-service.ts to keep it DRY
export { type UserRole } from './user-service';
export type { UserProfile } from './user-service';
