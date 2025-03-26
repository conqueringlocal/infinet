import { supabase } from '../../supabase';
import { executeSql, executeRawSql, executeDirectSql, createTable, createTableWithSql } from '../utils';

/**
 * SQL definition for the user_profiles table
 */
const USER_PROFILES_SQL = `
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  avatar_url TEXT,
  bio TEXT,
  settings JSONB
);

-- RLS policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create view policy
CREATE POLICY "Users can view all profiles" 
ON public.user_profiles FOR SELECT 
USING (true);

-- Create update policy
CREATE POLICY "Users can update own profile" 
ON public.user_profiles FOR UPDATE 
USING (auth.uid() = id);

-- Create insert policy for initialization
CREATE POLICY "Allow authenticated users to create their profile" 
ON public.user_profiles FOR INSERT 
USING (auth.uid() = id);

-- Create admin policy
CREATE POLICY "Admins can update any profile" 
ON public.user_profiles FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create admin RPC function to bypass RLS
CREATE OR REPLACE FUNCTION create_admin_user(user_id UUID, user_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- This runs with the privileges of the function creator
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role, created_at, updated_at)
  VALUES (user_id, user_email, 'admin', NOW(), NOW())
  ON CONFLICT (id) 
  DO UPDATE SET 
    role = 'admin',
    updated_at = NOW();
END;
$$;
`;

// Simpler SQL definition that only creates the table (no policies)
const SIMPLE_USER_PROFILES_SQL = `
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  avatar_url TEXT,
  bio TEXT,
  settings JSONB
);

-- Create an insert policy so users can create their profiles
CREATE POLICY IF NOT EXISTS "Allow authenticated users to create their profile" 
ON public.user_profiles FOR INSERT 
USING (auth.uid() = id);

-- Create admin RPC function
CREATE OR REPLACE FUNCTION create_admin_user(user_id UUID, user_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role, created_at, updated_at)
  VALUES (user_id, user_email, 'admin', NOW(), NOW())
  ON CONFLICT (id) 
  DO UPDATE SET 
    role = 'admin',
    updated_at = NOW();
END;
$$;
`;

/**
 * Creates the user_profiles table if it doesn't exist
 */
export const initializeUserProfilesTable = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Creating user_profiles table...');
    
    // Check if the table already exists by attempting to query it
    const { data: existingData, error: checkError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    // If no error, table exists
    if (!checkError) {
      console.log('Table user_profiles already exists');
      return { success: true, message: 'User profiles table already exists' };
    }
    
    // If table doesn't exist, try to create it
    if (checkError && checkError.code === '42P01') {
      console.log('Table user_profiles does not exist, attempting to create it...');
      
      // Try multiple approaches to create the table
      
      // Approach 1: Direct SQL execution through fetch API (most reliable)
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gqcfneuiruffgpwhkecy.supabase.co';
        const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxY2ZuZXVpcnVmZmdwd2hrZWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NjUyNzAsImV4cCI6MjA1ODU0MTI3MH0.Wm8coMFjXv8TA2bQfiXoDYjzml92iTPSDuZOlPJhD_0';
        
        // Create the table first
        const tableResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey,
            'Authorization': `Bearer ${apiKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ 
            query: SIMPLE_USER_PROFILES_SQL 
          })
        });
        
        if (tableResponse.ok) {
          console.log('Successfully created user_profiles table via direct fetch');
          
          // Now try to add RLS policies
          const rlsSQL = `
            ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
            
            -- Create view policy
            CREATE POLICY IF NOT EXISTS "Users can view all profiles" 
            ON public.user_profiles FOR SELECT 
            USING (true);
            
            -- Create update policy
            CREATE POLICY IF NOT EXISTS "Users can update own profile" 
            ON public.user_profiles FOR UPDATE 
            USING (auth.uid() = id);
            
            -- Create insert policy
            CREATE POLICY IF NOT EXISTS "Allow authenticated users to create their profile" 
            ON public.user_profiles FOR INSERT 
            USING (auth.uid() = id);
            
            -- Create admin policy
            CREATE POLICY IF NOT EXISTS "Admins can update any profile" 
            ON public.user_profiles FOR UPDATE 
            USING (
              EXISTS (
                SELECT 1 FROM public.user_profiles 
                WHERE id = auth.uid() AND role = 'admin'
              )
            );
          `;
          
          const policyResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': apiKey,
              'Authorization': `Bearer ${apiKey}`,
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ 
              query: rlsSQL 
            })
          });
          
          if (policyResponse.ok) {
            return { success: true, message: 'User profiles table and policies created successfully' };
          } else {
            return { success: true, message: 'User profiles table created, but policies may need manual setup' };
          }
        }
      } catch (error) {
        console.warn('Failed to create table via direct fetch:', error);
      }
      
      // If all automated approaches fail, return the COMPLETE SQL for manual creation
      return { 
        success: false, 
        message: 'Could not automatically create the user_profiles table. Please create it manually in the Supabase dashboard using this SQL:\n\n' + USER_PROFILES_SQL
      };
    } else {
      console.error('Error checking user_profiles table:', checkError);
      return { success: false, message: `Error checking user_profiles table: ${checkError.message}` };
    }
  } catch (error) {
    console.error('Error initializing user_profiles table:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error initializing user_profiles table' 
    };
  }
};
