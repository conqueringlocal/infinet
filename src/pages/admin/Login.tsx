
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Simple mock login - in a real app, this would connect to your auth system
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock credentials for demo - in production use proper authentication
    if (email === 'admin@conqueringlocal.com' && password === 'admin123') {
      // Set mock auth in localStorage (use a proper auth system in production)
      localStorage.setItem('admin_authenticated', 'true');
      
      toast({
        title: "Login successful",
        description: "Welcome to the Conquering Local CMS",
      });
      
      // Navigate to dashboard
      navigate('/admin/dashboard');
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/82c5769b-887a-49f8-a103-392bb5e996d5.png" 
            alt="Conquering Local" 
            className="h-16 md:h-24 mx-auto mb-6" 
          />
          <h1 className="text-2xl font-bold text-[#003366] mb-2">Admin Login</h1>
          <p className="text-gray-600">Access your website management dashboard</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@conqueringlocal.com"
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                For demo: admin@conqueringlocal.com / admin123
              </p>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-[#003366] hover:bg-[#002244]"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
