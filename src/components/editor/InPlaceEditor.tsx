
import React, { useState, useEffect } from 'react';
import { X, Save, LogOut, Edit, Image, Type } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface InPlaceEditorProps {
  isEnabled: boolean;
}

const InPlaceEditor = ({ isEnabled }: InPlaceEditorProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already logged in
    const authStatus = localStorage.getItem('edit_authenticated');
    if (authStatus === 'true') {
      setIsLoggedIn(true);
    } else if (isEnabled) {
      setLoginDialogOpen(true);
    }

    // Add edit mode class to body when in edit mode
    if (isEnabled && isLoggedIn && editMode) {
      document.body.classList.add('edit-mode');
      initializeEditables();
    } else {
      document.body.classList.remove('edit-mode');
    }

    return () => {
      document.body.classList.remove('edit-mode');
    };
  }, [isEnabled, isLoggedIn, editMode]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple mock login - would connect to auth system in production
    if (email === 'admin@conqueringlocal.com' && password === 'admin123') {
      localStorage.setItem('edit_authenticated', 'true');
      setIsLoggedIn(true);
      setLoginDialogOpen(false);
      toast({
        title: "Login successful",
        description: "You can now edit the page content",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('edit_authenticated');
    setIsLoggedIn(false);
    setEditMode(false);
    window.location.href = window.location.pathname.replace('/edit', '');
  };

  const initializeEditables = () => {
    // Find all editable elements and make them actually editable
    const editableElements = document.querySelectorAll('[data-editable]');
    editableElements.forEach(el => {
      el.setAttribute('contenteditable', 'true');
      el.classList.add('editable-content');
      
      // Add focus/blur styling
      el.addEventListener('focus', () => el.classList.add('editing'));
      el.addEventListener('blur', () => el.classList.remove('editing'));
    });
  };

  const saveChanges = () => {
    // In a real implementation, this would send data to a backend
    // For this demo, we'll show a toast and persist some changes to localStorage
    
    const editableElements = document.querySelectorAll('[data-editable]');
    const savedContent: Record<string, string> = {};
    
    editableElements.forEach(el => {
      const id = el.getAttribute('data-editable');
      if (id) {
        savedContent[id] = el.innerHTML;
      }
    });
    
    // Save to localStorage as a simple persistence mechanism
    localStorage.setItem('page_content', JSON.stringify(savedContent));
    
    toast({
      title: "Changes saved",
      description: "Your content has been updated successfully",
    });

    // Turn off edit mode after saving
    setEditMode(false);
    
    // Redirect to the non-edit version to see changes
    setTimeout(() => {
      window.location.href = window.location.pathname.replace('/edit', '');
    }, 1000);
  };

  // If not in edit mode or not logged in, don't show anything
  if (!isEnabled || !isLoggedIn) {
    return null;
  }

  return (
    <>
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login to Edit</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@conqueringlocal.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <p className="text-xs text-gray-500">
                For demo: admin@conqueringlocal.com / admin123
              </p>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Login</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-lg p-2 flex items-center gap-2">
        {!editMode ? (
          <Button 
            size="sm" 
            onClick={() => setEditMode(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Page
          </Button>
        ) : (
          <>
            <Button 
              size="sm" 
              onClick={saveChanges}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => setEditMode(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </>
        )}
        <Button 
          size="sm" 
          variant="outline"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Add styles for editable content */}
      <style jsx global>{`
        .edit-mode [data-editable] {
          outline: 2px dashed #0070f3;
          position: relative;
          min-height: 1em;
          transition: outline 0.2s;
        }
        
        .edit-mode [data-editable]:hover {
          outline: 2px dashed #0070f3;
        }
        
        .edit-mode [data-editable].editing {
          outline: 2px solid #0070f3;
          background-color: rgba(0, 112, 243, 0.05);
        }
        
        .edit-mode [data-editable]::before {
          content: attr(data-editable);
          position: absolute;
          top: -20px;
          left: 0;
          background: #0070f3;
          color: white;
          font-size: 10px;
          padding: 2px 5px;
          border-radius: 3px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        
        .edit-mode [data-editable]:hover::before {
          opacity: 1;
        }
      `}</style>
    </>
  );
};

export default InPlaceEditor;
