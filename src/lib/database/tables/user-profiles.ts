
import { supabase } from '../../supabase';
import { executeSql, executeRawSql, createTable, createTableWithSql } from '../utils';

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

/**
 * Creates the user_profiles table if it doesn't exist
 */
export const initializeUserProfilesTable = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Creating user_profiles table...');
    
    // Check if the table already exists
    const { error: checkError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
    
    if (checkError) {
      if (checkError.code === '42P01') { // Table doesn't exist code
        console.log('Table user_profiles does not exist, creating it...');
        
        // Try multiple approaches to create the table
        
        // 1. Try using SQL via functions API
        try {
          console.log('Attempting to create user_profiles table via Functions API...');
          const { data, error } = await supabase.functions.invoke('execute-sql', {
            body: { sql: USER_PROFILES_SQL }
          });
          
          if (!error) {
            console.log('User profiles table created successfully using Supabase Functions');
            return { success: true, message: 'User profiles table created successfully' };
          } else {
            console.warn('Supabase Functions approach failed:', error.message);
          }
        } catch (functionsError) {
          console.warn('Supabase Functions approach failed:', functionsError);
        }
        
        // 2. Try using RPC
        try {
          console.log('Attempting to create user_profiles table via RPC...');
          const sqlResult = await executeRawSql(USER_PROFILES_SQL);
          
          if (sqlResult.success) {
            console.log('User profiles table created successfully using RPC');
            return { success: true, message: 'User profiles table created successfully' };
          } else {
            console.warn('RPC approach failed:', sqlResult.message);
          }
        } catch (rpcError) {
          console.warn('RPC approach failed:', rpcError);
        }
        
        // 3. Try using direct SQL execution
        try {
          console.log('Attempting to create user_profiles table via direct SQL...');
          const sqlResult = await executeSql(USER_PROFILES_SQL);
          
          if (sqlResult.success) {
            console.log('User profiles table created successfully using direct SQL');
            return { success: true, message: 'User profiles table created successfully' };
          } else {
            console.warn('Direct SQL approach failed:', sqlResult.message);
          }
        } catch (sqlError) {
          console.warn('Direct SQL approach failed:', sqlError);
        }
        
        // 4. Try using createTable helper
        try {
          console.log('Attempting to create user_profiles table via createTable...');
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
          
          const tableResult = await createTable('user_profiles', schema);
          
          if (tableResult.success) {
            console.log('User profiles table created successfully using createTable');
            
            // Add RLS policies manually
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
            
            return { success: true, message: 'User profiles table created successfully' };
          } else {
            console.warn('createTable approach failed:', tableResult.message);
          }
        } catch (createTableError) {
          console.warn('createTable approach failed:', createTableError);
        }
        
        // 5. Try specialized function approach
        try {
          console.log('Attempting to create user_profiles table via specialized function...');
          const { data, error } = await supabase.functions.invoke('setup-tables', {
            body: { table: 'user_profiles' }
          });
          
          if (!error) {
            console.log('User profiles table created successfully using specialized function');
            return { success: true, message: 'User profiles table created successfully' };
          } else {
            console.warn('Specialized function approach failed:', error.message);
          }
        } catch (specializedError) {
          console.warn('Specialized function approach failed:', specializedError);
        }
        
        // If all automatic approaches fail, inform the user they need to create it manually
        console.error('All automated approaches to create the user_profiles table failed');
        return { 
          success: false, 
          message: 'Could not automatically create the user_profiles table. Please create it manually in the Supabase dashboard using this SQL:\n\n' + USER_PROFILES_SQL
        };
      } else {
        console.error('Error checking user_profiles table:', checkError);
        return { success: false, message: `Error checking user_profiles table: ${checkError.message}` };
      }
    } else {
      console.log('user_profiles table already exists');
      return { success: true, message: 'User profiles table already exists' };
    }
  } catch (error) {
    console.error('Error initializing user_profiles table:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error initializing user_profiles table' 
    };
  }
};
