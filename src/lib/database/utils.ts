
import { supabase } from '../supabase';

/**
 * Execute SQL statements directly on the database
 * This function uses the Supabase stored procedure approach
 */
export const executeSql = async (sqlQuery: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Use the rpc function to execute SQL (this assumes the function exists in Supabase)
    // Instead of trying to POST directly to the REST API, we'll use Supabase's query builder
    const { data, error } = await supabase
      .from('_manual_sql')
      .insert({ query: sqlQuery })
      .select('success')
      .maybeSingle();
    
    if (error) {
      console.error('Error executing SQL:', error);
      return { 
        success: false, 
        message: `Error executing SQL: ${error.message}` 
      };
    }

    return { success: true, message: 'SQL executed successfully' };
  } catch (error) {
    console.error('Error executing SQL:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error executing SQL' 
    };
  }
};

/**
 * Alternative method to execute SQL using Supabase functions
 * This can be used if the above method doesn't work
 */
export const executeRawSql = async (sqlQuery: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Call a Supabase function to execute the SQL
    const { data, error } = await supabase.rpc('execute_sql', { 
      sql_query: sqlQuery 
    });

    if (error) {
      console.error('Error in execute_sql RPC:', error);
      return { 
        success: false, 
        message: `Error executing SQL: ${error.message}` 
      };
    }

    return { success: true, message: 'SQL executed successfully' };
  } catch (error) {
    console.error('Error executing raw SQL:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error executing SQL' 
    };
  }
};

/**
 * A simpler method that creates tables using Supabase's native query builder
 * This is more limited but safer for basic table operations
 */
export const createTable = async (tableName: string, schema: Record<string, string>): Promise<{ success: boolean; message: string }> => {
  try {
    // First check if the table exists
    const { error: checkError } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    // If table doesn't exist, we'll get a specific error code
    if (checkError && checkError.code === '42P01') {
      console.log(`Table ${tableName} doesn't exist, will try to create it via direct DDL`);
      
      // Since we can't create tables with the query builder directly,
      // we have to fall back to using the auth.uid() function which is available in Supabase
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: 'admin@example.com',
        password: 'admin123',
      });
      
      if (authError) {
        console.error('Error authenticating to create table:', authError);
        return { 
          success: false, 
          message: `Authentication failed: ${authError.message}` 
        };
      }
      
      // Now we can try a direct SQL approach with the admin user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return { 
          success: false, 
          message: 'Failed to get authenticated session for table creation' 
        };
      }
      
      // Use the service role key (this would be in a secure environment only)
      const { error: sqlError } = await supabase.rpc('create_table', { 
        table_name: tableName,
        table_schema: JSON.stringify(schema)
      });
      
      if (sqlError) {
        console.error(`Error creating table ${tableName}:`, sqlError);
        return { 
          success: false, 
          message: `Error creating table: ${sqlError.message}` 
        };
      }
      
      return { success: true, message: `Table ${tableName} created successfully` };
    } else if (checkError) {
      console.error(`Error checking table ${tableName}:`, checkError);
      return { 
        success: false, 
        message: `Error checking table: ${checkError.message}` 
      };
    } else {
      console.log(`Table ${tableName} already exists`);
      return { success: true, message: `Table ${tableName} already exists` };
    }
  } catch (error) {
    console.error(`Error creating table ${tableName}:`, error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : `Unknown error creating table ${tableName}` 
    };
  }
};

/**
 * Simple function to execute direct SQL using the Supabase REST API
 * This is more reliable but requires proper authentication
 */
export const executeSqlDirect = async (sqlQuery: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Instead of using the .query() method which doesn't exist,
    // we'll use a custom Supabase Edge Function or send to an RPC
    const { data, error } = await supabase.functions.invoke('execute-sql', {
      body: { sql: sqlQuery }
    });
    
    if (error) {
      console.error('Error executing SQL directly:', error);
      return { 
        success: false, 
        message: `Error executing SQL: ${error.message}` 
      };
    }

    return { success: true, message: 'SQL executed successfully' };
  } catch (error) {
    console.error('Error executing SQL directly:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error executing SQL' 
    };
  }
};
