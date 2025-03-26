
import React, { useState, useRef } from 'react';
import { setupCMS } from '@/lib/database';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle, Copy, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CMSSetup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [setupMessage, setSetupMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [activeTab, setActiveTab] = useState('setup');
  const { toast } = useToast();
  const sqlRef = useRef<HTMLPreElement>(null);

  // Extract SQL from error message
  const extractSqlFromErrorMessage = (message: string) => {
    if (message.includes('CREATE TABLE')) {
      // Find all CREATE TABLE sections
      const createTableRegex = /(CREATE TABLE IF NOT EXISTS[^;]+;)/g;
      const matches: string[] = [];
      let match;
      while ((match = createTableRegex.exec(message)) !== null) {
        matches.push(match[1]);
      }
      
      if (matches.length > 0) {
        return matches.join('\n\n');
      }
      
      // If regex didn't work, use a simpler approach
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

  const getTables = () => {
    return [
      {
        name: 'user_profiles',
        sql: `CREATE TABLE IF NOT EXISTS public.user_profiles (
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

-- Create admin policy
CREATE POLICY "Admins can update any profile" 
ON public.user_profiles FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);`
      },
      {
        name: 'page_assignments',
        sql: `CREATE TABLE IF NOT EXISTS public.page_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id),
  role TEXT NOT NULL DEFAULT 'editor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_id, user_id)
);

-- RLS policies for page_assignments
ALTER TABLE public.page_assignments ENABLE ROW LEVEL SECURITY;

-- Create view policy
CREATE POLICY "Users can view their own page assignments" 
  ON public.page_assignments FOR SELECT 
  USING (user_id = auth.uid());

-- Create admin view policy
CREATE POLICY "Admins can view all page assignments" 
  ON public.page_assignments FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create admin modify policy
CREATE POLICY "Admins can modify page assignments" 
  ON public.page_assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );`
      },
      {
        name: 'page_content',
        sql: `CREATE TABLE IF NOT EXISTS public.page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content_data JSONB NOT NULL,
  version INT NOT NULL DEFAULT 1,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES public.user_profiles(id),
  updated_by UUID REFERENCES public.user_profiles(id),
  UNIQUE(page_id, content_id, version)
);

-- Enable RLS
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- Anyone can view published content
CREATE POLICY "Anyone can view published content" 
  ON public.page_content FOR SELECT 
  USING (published = true);

-- Admin access
CREATE POLICY "Admins can view all content" 
  ON public.page_content FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin modify access
CREATE POLICY "Admins can modify all content" 
  ON public.page_content FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Editor view access through page assignments
CREATE POLICY "Assigned editors can view all page content" 
  ON public.page_content FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.page_assignments 
      WHERE page_id = page_content.page_id 
      AND user_id = auth.uid()
    )
  );

-- Editor modify access through page assignments
CREATE POLICY "Assigned editors can modify content" 
  ON public.page_content FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.page_assignments 
      WHERE page_id = page_content.page_id 
      AND user_id = auth.uid()
    )
  );`
      },
      {
        name: 'page_analytics',
        sql: `CREATE TABLE IF NOT EXISTS public.page_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL,
  view_count INT NOT NULL DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  first_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies
ALTER TABLE public.page_analytics ENABLE ROW LEVEL SECURITY;

-- Create admin view policy
CREATE POLICY "Admins can view all analytics" 
  ON public.page_analytics FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create admin modify policy
CREATE POLICY "Admins can modify analytics" 
  ON public.page_analytics FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );`
      }
    ];
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
        setActiveTab('manual');
        toast({
          title: "Setup Failed",
          description: "Please check the manual setup instructions",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during setup';
      setSetupError(errorMessage);
      setActiveTab('manual');
      toast({
        title: "Setup Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tables = getTables();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>CMS Setup</CardTitle>
        <CardDescription>
          Initialize the database and create an admin user
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="setup">Automatic Setup</TabsTrigger>
            <TabsTrigger value="manual">Manual Setup</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup">
            {setupComplete ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-800 font-medium">Setup Complete!</p>
                  <p className="text-green-700 text-sm mt-1">{setupMessage}</p>
                </div>
              </div>
            ) : setupError ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
                <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">Setup Failed</p>
                  <p className="text-red-700 text-sm mt-1">
                    {setupError && !setupError.includes('CREATE TABLE') 
                      ? setupError 
                      : "Could not automatically create the required tables. Please use the Manual Setup tab to create them in Supabase."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
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
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="manual">
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Manual Setup Instructions</h3>
                <p className="text-xs text-blue-700 mb-3">
                  You need to create the following tables in your Supabase database 
                  in this exact order due to dependencies between tables:
                </p>
                <ol className="list-decimal text-xs text-blue-700 pl-5 space-y-1">
                  <li>Create the user_profiles table</li>
                  <li>Create the page_assignments table (depends on user_profiles)</li>
                  <li>Create the page_content table (depends on user_profiles)</li>
                  <li>Create the page_analytics table (depends on page_content)</li>
                </ol>
              </div>
              
              <div className="flex justify-end mb-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={openSupabaseSqlEditor}
                  className="text-xs"
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                  Open SQL Editor in Supabase
                </Button>
              </div>
              
              <div className="space-y-4">
                {tables.map((table, index) => (
                  <div key={table.name} className="border border-gray-200 rounded-md overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-gray-700 font-medium text-sm">{index + 1}. {table.name}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          navigator.clipboard.writeText(table.sql);
                          toast({
                            title: "SQL Copied",
                            description: `SQL for ${table.name} has been copied to clipboard`,
                          });
                        }}
                        className="h-8 px-2 text-xs"
                      >
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy SQL
                      </Button>
                    </div>
                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">
                        Run this SQL in your Supabase SQL Editor:
                      </p>
                    </div>
                    <div className="bg-gray-900 p-3 overflow-x-auto max-h-[200px]">
                      <pre className="text-xs text-gray-100 whitespace-pre-wrap">
                        {table.sql}
                      </pre>
                    </div>
                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                      <p className="text-xs text-gray-600">
                        After running this SQL, make sure it executes successfully before moving to the next table.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">Troubleshooting</h3>
                <ul className="list-disc text-xs text-yellow-700 pl-5 space-y-1">
                  <li>If you get syntax errors, try running the CREATE TABLE statement first, then the ALTER TABLE statement, then each CREATE POLICY statement one by one.</li>
                  <li>If a policy already exists, you might need to remove the "IF NOT EXISTS" from the CREATE POLICY statement.</li>
                  <li>Once all tables are created, return to the Automatic Setup tab to create the admin user.</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        {activeTab === 'setup' && !setupComplete && (
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
        {activeTab === 'manual' && !setupComplete && (
          <Button 
            className="w-full"
            onClick={() => setActiveTab('setup')}
          >
            Try Automatic Setup
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
