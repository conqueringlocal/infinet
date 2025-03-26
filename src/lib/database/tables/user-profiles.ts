
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
CREATE POLICY IF NOT EXISTS "Users can view all profiles" 
ON public.user_profiles FOR SELECT 
USING (true);

-- Create update policy
CREATE POLICY IF NOT EXISTS "Users can update own profile" 
ON public.user_profiles FOR UPDATE 
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
      
      // Approach 1: Create table with complete SQL definition
      try {
        const result = await createTableWithSql('user_profiles', USER_PROFILES_SQL);
        if (result.success) {
          return result;
        }
      } catch (error) {
        console.warn('Failed to create table with complete SQL definition:', error);
      }
      
      // Approach 2: Create table with simplified SQL (just the table, no policies)
      try {
        const result = await createTableWithSql('user_profiles', SIMPLE_USER_PROFILES_SQL);
        if (result.success) {
          console.log('Created table without policies, attempting to add policies...');
          
          // Now try to add policies
          const policiesSQL = USER_PROFILES_SQL.split('CREATE TABLE')[1].split(';').slice(1).join(';');
          await executeSql(policiesSQL);
          
          return { success: true, message: 'User profiles table created successfully with basic structure' };
        }
      } catch (error) {
        console.warn('Failed to create table with simplified SQL:', error);
      }
      
      // Approach 3: Create with schema object
      try {
        const schema = {
          id: 'uuid primary key',
          email: 'text not null',
          display_name: 'text',
          full_name: 'text',
          role: 'text not null default \'viewer\'',
          created_at: 'timestamp with time zone default now()',
          updated_at: 'timestamp with time zone default now()',
          avatar_url: 'text',
          bio: 'text',
          settings: 'jsonb'
        };
        
        const result = await createTable('user_profiles', schema);
        if (result.success) {
          console.log('Created table with schema object, attempting to add RLS...');
          
          // Try to add RLS policies
          try {
            await executeSql(`
              ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
              
              CREATE POLICY "Users can view all profiles" 
              ON public.user_profiles FOR SELECT 
              USING (true);
              
              CREATE POLICY "Users can update own profile" 
              ON public.user_profiles FOR UPDATE 
              USING (auth.uid() = id);
              
              CREATE POLICY "Admins can update any profile" 
              ON public.user_profiles FOR UPDATE 
              USING (
                EXISTS (
                  SELECT 1 FROM public.user_profiles 
                  WHERE id = auth.uid() AND role = 'admin'
                )
              );
            `);
          } catch (error) {
            console.warn('Failed to add RLS policies, but table was created:', error);
          }
          
          return { success: true, message: 'User profiles table created successfully' };
        }
      } catch (error) {
        console.warn('Failed to create table with schema object:', error);
      }
      
      // Approach 4: Try using the REST API directly
      try {
        // Get the URL and API key from environment variables or configuration
        const url = import.meta.env.VITE_SUPABASE_URL || 'https://gqcfneuiruffgpwhkecy.supabase.co';
        const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxY2ZuZXVpcnVmZmdwd2hrZWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NjUyNzAsImV4cCI6MjA1ODU0MTI3MH0.Wm8coMFjXv8TA2bQfiXoDYjzml92iTPSDuZOlPJhD_0';
        
        const response = await fetch(`${url}/rest/v1/rpc/execute_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey,
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({ sql_query: SIMPLE_USER_PROFILES_SQL })
        });
        
        if (response.ok) {
          return { success: true, message: 'User profiles table created successfully via REST API' };
        }
      } catch (error) {
        console.warn('Failed to create table via REST API:', error);
      }
      
      // If all automatic approaches fail, provide SQL for manual creation
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
