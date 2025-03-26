
import React, { useState, useEffect } from 'react';
import { setupCMS } from '@/lib/database-setup';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const CMSSetup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [setupMessage, setSetupMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const { toast } = useToast();

  const runSetup = async () => {
    try {
      setIsLoading(true);
      setSetupError(null);
      setSetupMessage(null);

      const result = await setupCMS();
      
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
          description: result.message,
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
          <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
            <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Setup Failed</p>
              <p className="text-red-700 text-sm mt-1">{setupError}</p>
            </div>
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
