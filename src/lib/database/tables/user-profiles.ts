
import { supabase } from '../../supabase';
import { executeSql, executeRawSql, createTable, executeSqlDirect } from '../utils';

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
        
        // 1. Try using the .query() method if available
        try {
          console.log('Trying direct SQL query...');
          const { data, error } = await supabase.query(`
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
            
            -- RLS policies for user_profiles
            ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
            
            -- Create view policy
            DO $$
            BEGIN
              IF NOT EXISTS (
                SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can view all profiles'
              ) THEN
                CREATE POLICY "Users can view all profiles" 
                ON public.user_profiles FOR SELECT 
                USING (true);
              END IF;
            END
            $$;
            
            -- Create update policy
            DO $$
            BEGIN
              IF NOT EXISTS (
                SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can update own profile'
              ) THEN
                CREATE POLICY "Users can update own profile" 
                ON public.user_profiles FOR UPDATE 
                USING (auth.uid() = id);
              END IF;
            END
            $$;
            
            -- Create admin policy
            DO $$
            BEGIN
              IF NOT EXISTS (
                SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Admins can update any profile'
              ) THEN
                CREATE POLICY "Admins can update any profile" 
                ON public.user_profiles FOR UPDATE 
                USING (
                  EXISTS (
                    SELECT 1 FROM public.user_profiles 
                    WHERE id = auth.uid() AND role = 'admin'
                  )
                );
              END IF;
            END
            $$;
          `);
          
          if (!error) {
            console.log('User profiles table created successfully using direct query');
            return { success: true, message: 'User profiles table created successfully' };
          } else {
            console.warn('Direct query method failed:', error.message);
            // Continue to next approach
          }
        } catch (directQueryError) {
          console.warn('Direct query approach failed:', directQueryError);
          // Continue to next approach
        }
        
        // 2. Try using SQL script with the execute_sql stored procedure
        try {
          console.log('Trying RPC execute_sql approach...');
          const sqlResult = await executeRawSql(`
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
          
          if (sqlResult.success) {
            console.log('User profiles table created successfully using RPC');
            return { success: true, message: 'User profiles table created successfully' };
          } else {
            console.warn('RPC approach failed:', sqlResult.message);
            // Continue to next approach
          }
        } catch (rpcError) {
          console.warn('RPC approach failed:', rpcError);
          // Continue to next approach
        }
        
        // 3. Try using the Functions API approach
        try {
          console.log('Trying Functions API approach...');
          const functionResult = await fetch('https://gqcfneuiruffgpwhkecy.supabase.co/functions/v1/setup-tables', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabase.auth.session()?.access_token}`
            },
            body: JSON.stringify({
              table: 'user_profiles'
            })
          });
          
          if (functionResult.ok) {
            console.log('User profiles table created successfully using Functions API');
            return { success: true, message: 'User profiles table created successfully' };
          } else {
            console.warn('Functions API approach failed:', await functionResult.text());
            // Continue to next approach
          }
        } catch (functionsError) {
          console.warn('Functions API approach failed:', functionsError);
          // Continue to next approach
        }
        
        // 4. If all else fails, notify the user that manual table creation is needed
        console.error('All automated approaches to create the user_profiles table failed');
        return { 
          success: false, 
          message: 'Could not automatically create the user_profiles table. Please create it manually in the Supabase dashboard.' 
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
