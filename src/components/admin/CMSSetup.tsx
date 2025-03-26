
import React, { useState, useRef } from 'react';
import { setupCMS } from '@/lib/database';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle, Copy, ExternalLink } from 'lucide-react';

const CMSSetup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [setupMessage, setSetupMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const { toast } = useToast();
  const sqlRef = useRef<HTMLPreElement>(null);

  // Enhanced SQL extraction to handle multiple tables
  const extractSqlFromErrorMessage = (message: string) => {
    if (message.includes('CREATE TABLE')) {
      // Find all SQL sections for each table
      const tables: string[] = [];
      
      // Extract SQL for each table mention
      const regex = /(CREATE TABLE IF NOT EXISTS[^;]+;(?:\s*--[^\n]*\n)*(?:\s*(?:ALTER|CREATE)[^;]+;)*)/g;
      let match;
      
      while ((match = regex.exec(message)) !== null) {
        tables.push(match[1]);
      }
      
      if (tables.length > 0) {
        return tables.join('\n\n');
      }
      
      // Fallback: If regex didn't work, try a simple extraction
      const startIdx = message.indexOf('CREATE TABLE');
      if (startIdx !== -1) {
        return message.substring(startIdx);
      }
    }
    return null;
  };

  const copyToClipboard = () => {
    if (sqlRef.current) {
      const sql = sqlRef.current.textContent || '';
      navigator.clipboard.writeText(sql);
      toast({
        title: "SQL Copied",
        description: "SQL has been copied to clipboard",
      });
    }
  };

  const openSupabaseSqlEditor = () => {
    // Extract the Supabase project ID from the env
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gqcfneuiruffgpwhkecy.supabase.co';
    const projectId = supabaseUrl.replace('https://', '').split('.')[0];
    
    // Open the SQL editor URL in a new tab
    window.open(`https://app.supabase.com/project/${projectId}/sql/new`, '_blank');
  };

  const runSetup = async () => {
    try {
      setIsLoading(true);
      setSetupError(null);
      setSetupMessage(null);

      const result = await setupCMS(email, password);
      
      if (result.success) {
        setSetupComplete(true);
        setSetupMessage(result.message);
        toast({
          title: "Setup Complete",
          description: result.message,
        });
      } else {
        setSetupError(result.message);
        toast({
          title: "Setup Failed",
          description: "Please check the error details below",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during setup';
      setSetupError(errorMessage);
      toast({
        title: "Setup Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sql = setupError ? extractSqlFromErrorMessage(setupError) : null;

  // Helper function to split SQL into manageable parts for execution
  const splitSqlIntoStatements = (sql: string | null) => {
    if (!sql) return [];
    
    // Split the SQL into table creation and policy sections
    const sections = [];
    let currentSection = '';
    
    // Split on CREATE TABLE statements
    sql.split(/(?=CREATE TABLE)/i).forEach(part => {
      if (part.trim()) {
        sections.push(part.trim());
      }
    });
    
    return sections;
  };

  const sqlStatements = splitSqlIntoStatements(sql);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>CMS Setup</CardTitle>
        <CardDescription>
          Initialize the database and create an admin user
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {setupComplete ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-800 font-medium">Setup Complete!</p>
              <p className="text-green-700 text-sm mt-1">{setupMessage}</p>
            </div>
          </div>
        ) : setupError ? (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
              <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Setup Failed</p>
                <p className="text-red-700 text-sm mt-1">
                  {setupError && !setupError.includes('CREATE TABLE') 
                    ? setupError 
                    : "Could not automatically create the required tables. Please create them manually in Supabase."}
                </p>
              </div>
            </div>
            
            {sql && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Required SQL</h3>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-2 text-xs"
                      onClick={copyToClipboard}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy SQL
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 px-2 text-xs"
                      onClick={openSupabaseSqlEditor}
                    >
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      Open SQL Editor
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-md border border-gray-200 p-3 overflow-auto max-h-[500px]">
                  <pre ref={sqlRef} className="text-xs whitespace-pre-wrap text-gray-800">{sql}</pre>
                </div>
                
                {sqlStatements.length > 1 && (
                  <div className="mt-3 text-xs text-gray-600 p-3 bg-blue-50 border border-blue-100 rounded">
                    <p className="font-medium mb-1">For best results:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Create each table separately in this order: user_profiles, page_assignments, page_content, page_analytics</li>
                      <li>For each table, first run just the CREATE TABLE statement</li>
                      <li>Then run the ALTER TABLE and CREATE POLICY statements</li>
                      <li>Remove the "IF NOT EXISTS" phrases from the policy creation lines</li>
                    </ol>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  After running this SQL in your Supabase dashboard, return here and try again. 
                  Note: Remove the "IF NOT EXISTS" phrases from the policy creation lines if you encounter syntax errors.
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Admin Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500">
                Default: admin123 (make sure to change this after setup)
              </p>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        {!setupComplete && (
          <Button 
            className="w-full" 
            onClick={runSetup} 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Setting up...
              </>
            ) : (
              'Initialize CMS'
            )}
          </Button>
        )}
        {setupComplete && (
          <Button 
            className="w-full"
            onClick={() => window.location.href = '/admin/login'}
          >
            Go to Admin Login
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CMSSetup;
