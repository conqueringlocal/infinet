
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
 * Execute SQL using direct query approach
 */
export const executeDirectSql = async (sqlQuery: string): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Executing SQL via direct query:', sqlQuery.substring(0, 100) + '...');
    
    // Execute the SQL directly
    const { data, error } = await supabase.from('_sql').rpc('execute', { query: sqlQuery });

    if (error) {
      console.error('Error in direct SQL execution:', error);
      return { 
        success: false, 
        message: `Error executing SQL: ${error.message}` 
      };
    }

    return { success: true, message: 'SQL executed successfully' };
  } catch (error) {
    console.error('Error executing direct SQL:', error);
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
      
      // Construct SQL for table creation
      let createTableSQL = `CREATE TABLE IF NOT EXISTS public.${tableName} (`;
      const columns = [];
      
      for (const [columnName, columnType] of Object.entries(schema)) {
        columns.push(`${columnName} ${columnType}`);
      }
      
      createTableSQL += columns.join(', ');
      createTableSQL += ');';
      
      // Try multiple approaches to create the table
      
      // Approach 1: Using the supabase.functions.invoke method
      try {
        const functionsResult = await executeSql(createTableSQL);
        if (functionsResult.success) {
          return { success: true, message: `Table ${tableName} created successfully via Functions` };
        }
      } catch (e) {
        console.warn('Failed to create table via Functions:', e);
      }
      
      // Approach 2: Using RPC
      try {
        const rpcResult = await executeRawSql(createTableSQL);
        if (rpcResult.success) {
          return { success: true, message: `Table ${tableName} created successfully via RPC` };
        }
      } catch (e) {
        console.warn('Failed to create table via RPC:', e);
      }
      
      // Approach 3: Using direct SQL
      try {
        const directResult = await executeDirectSql(createTableSQL);
        if (directResult.success) {
          return { success: true, message: `Table ${tableName} created successfully via direct SQL` };
        }
      } catch (e) {
        console.warn('Failed to create table via direct SQL:', e);
      }
      
      // Approach 4: Using create-table function
      try {
        const { data, error } = await supabase.functions.invoke('create-table', {
          body: { 
            tableName: tableName,
            schema: schema
          }
        });
        
        if (!error) {
          return { success: true, message: `Table ${tableName} created successfully via create-table function` };
        }
      } catch (e) {
        console.warn('Failed to create table via create-table function:', e);
      }
      
      // If all methods failed, return detailed instructions
      const schemaString = Object.entries(schema)
        .map(([name, type]) => `${name} ${type}`)
        .join(',\n  ');
      
      return {
        success: false,
        message: `Could not automatically create the ${tableName} table. Please create it manually in the Supabase dashboard using this SQL:
CREATE TABLE IF NOT EXISTS public.${tableName} (
  ${schemaString}
);`
      };
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
    
    // Try multiple approaches
    
    // Approach 1: Using Supabase Functions
    try {
      const functionsResult = await executeSql(sqlDefinition);
      if (functionsResult.success) {
        return { success: true, message: `Table ${tableName} created successfully via Functions` };
      }
    } catch (e) {
      console.warn('Failed to create table via Functions:', e);
    }
    
    // Approach 2: Using RPC
    try {
      const rpcResult = await executeRawSql(sqlDefinition);
      if (rpcResult.success) {
        return { success: true, message: `Table ${tableName} created successfully via RPC` };
      }
    } catch (e) {
      console.warn('Failed to create table via RPC:', e);
    }
    
    // Approach 3: Using direct SQL
    try {
      const directResult = await executeDirectSql(sqlDefinition);
      if (directResult.success) {
        return { success: true, message: `Table ${tableName} created successfully via direct SQL` };
      }
    } catch (e) {
      console.warn('Failed to create table via direct SQL:', e);
    }
    
    // Approach 4: Using REST API
    try {
      const response = await fetch(`${supabase.supabaseUrl}/rest/v1/rpc/execute_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabase.supabaseKey,
          'Authorization': `Bearer ${supabase.supabaseKey}`
        },
        body: JSON.stringify({ sql_query: sqlDefinition })
      });
      
      if (response.ok) {
        return { success: true, message: `Table ${tableName} created successfully via REST API` };
      }
    } catch (e) {
      console.warn('Failed to create table via REST API:', e);
    }
    
    // If all methods failed, return the SQL for manual creation
    return {
      success: false,
      message: `Could not automatically create the ${tableName} table. Please create it manually in the Supabase dashboard using this SQL:\n\n${sqlDefinition}`
    };
  } catch (error) {
    console.error(`Error creating table ${tableName} with SQL:`, error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : `Unknown error creating table ${tableName}` 
    };
  }
};
