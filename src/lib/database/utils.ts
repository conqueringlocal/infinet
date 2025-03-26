
import { supabase } from '../supabase';

/**
 * Execute SQL statements directly on the database using Supabase Functions
 */
export const executeSql = async (sqlQuery: string): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Executing SQL via Supabase Functions:', sqlQuery.substring(0, 100) + '...');
    
    // Use Supabase Functions to execute SQL
    const { data, error } = await supabase.functions.invoke('execute-sql', {
      body: { sql: sqlQuery }
    });
    
    if (error) {
      console.error('Error executing SQL via Functions:', error);
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
 * Execute SQL using Supabase RPC
 */
export const executeRawSql = async (sqlQuery: string): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Executing SQL via RPC:', sqlQuery.substring(0, 100) + '...');
    
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
 * A simpler method that creates tables using Supabase's insert approach
 */
export const createTable = async (tableName: string, schema: Record<string, string>): Promise<{ success: boolean; message: string }> => {
  try {
    console.log(`Creating table ${tableName} with schema:`, schema);
    
    // First check if the table exists
    const { error: checkError } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    // If table doesn't exist, we'll get a specific error code
    if (checkError && checkError.code === '42P01') {
      console.log(`Table ${tableName} doesn't exist, attempting to create it`);
      
      // Try using a function to create the table
      const { data, error } = await supabase.functions.invoke('create-table', {
        body: { 
          tableName: tableName,
          schema: schema
        }
      });
      
      if (error) {
        console.error(`Error creating table ${tableName} via Functions:`, error);
        return { 
          success: false, 
          message: `Error creating table: ${error.message}` 
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
 * Create a table directly using SQL string
 */
export const createTableWithSql = async (
  tableName: string, 
  sqlDefinition: string
): Promise<{ success: boolean; message: string }> => {
  try {
    console.log(`Creating table ${tableName} with direct SQL`);
    
    const result = await executeSql(sqlDefinition);
    return result;
  } catch (error) {
    console.error(`Error creating table ${tableName} with SQL:`, error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : `Unknown error creating table ${tableName}` 
    };
  }
};
