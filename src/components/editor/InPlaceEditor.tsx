
import React, { useState, useEffect } from 'react';
import { X, Save, LogOut, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const navigate = useNavigate();
  const location = useLocation();

  // Set up the editor on initial load
  useEffect(() => {
    console.log('InPlaceEditor: isEnabled =', isEnabled);
    console.log('Current path:', location.pathname);
    console.log('Edit URL detected:', location.pathname.endsWith('/edit'));
    
    // Check if already logged in from localStorage
    const authStatus = localStorage.getItem('edit_authenticated');
    
    if (authStatus === 'true') {
      console.log('User is already logged in');
      setIsLoggedIn(true);
      
      // If we're on an edit URL, activate edit mode
      if (isEnabled) {
        console.log('Edit mode enabled via URL');
        setEditMode(true);
        
        // This timeout ensures DOM is fully loaded before we initialize editables
        setTimeout(() => {
          initializeEditables();
        }, 500); // Increased timeout to ensure page is fully loaded
      }
    } else if (isEnabled) {
      // Not logged in but on edit URL - show login dialog
      console.log('Not logged in but on edit URL - showing login dialog');
      setLoginDialogOpen(true);
    }
  }, [isEnabled, location.pathname]);

  // Effect for handling edit mode changes
  useEffect(() => {
    console.log('Edit mode changed to:', editMode, 'isLoggedIn:', isLoggedIn);
    
    if (editMode && isLoggedIn) {
      console.log('Activating edit mode on body');
      document.body.classList.add('edit-mode');
      
      // Initialize editables whenever edit mode is activated
      setTimeout(() => {
        initializeEditables();
      }, 500); // Increased timeout
    } else {
      document.body.classList.remove('edit-mode');
    }
    
    return () => {
      document.body.classList.remove('edit-mode');
    };
  }, [editMode, isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Attempting login with:', email);
    
    // Simple mock login - would connect to auth system in production
    if (email === 'admin@conqueringlocal.com' && password === 'admin123') {
      localStorage.setItem('edit_authenticated', 'true');
      setIsLoggedIn(true);
      setLoginDialogOpen(false);
      setEditMode(true); // Automatically enable edit mode after login
      
      toast({
        title: "Login successful",
        description: "You can now edit the page content",
      });
      
      console.log('Login successful, edit mode enabled');
      
      // Initialize editables after login
      setTimeout(() => {
        initializeEditables();
      }, 500); // Increased timeout
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
    
    toast({
      title: "Logged out",
      description: "You've been logged out successfully",
    });
    
    // Navigate to the non-edit version of the page
    const currentPath = location.pathname;
    let basePath = currentPath;
    
    if (currentPath === '/edit') {
      basePath = '/';
    } else if (currentPath.endsWith('/edit')) {
      basePath = currentPath.slice(0, -5);
    }
      
    navigate(basePath);
  };

  const initializeEditables = () => {
    // Find all editable elements and make them actually editable
    console.log('Initializing editable elements');
    const editableElements = document.querySelectorAll('[data-editable]');
    console.log('Found', editableElements.length, 'editable elements');
    
    if (editableElements.length === 0) {
      console.warn('No editable elements found on the page. Check if EditableContent components are being rendered.');
    }
    
    editableElements.forEach(el => {
      const id = el.getAttribute('data-editable');
      console.log('Setting up editable:', id);
      el.setAttribute('contenteditable', 'true');
      el.classList.add('editable-content');
      
      // Add focus/blur styling
      el.addEventListener('focus', () => el.classList.add('editing'));
      el.addEventListener('blur', () => el.classList.remove('editing'));
    });
  };

  const saveChanges = () => {
    console.log('Saving changes...');
    
    const editableElements = document.querySelectorAll('[data-editable]');
    const savedContent: Record<string, string> = {};
    
    editableElements.forEach(el => {
      const id = el.getAttribute('data-editable');
      if (id) {
        savedContent[id] = el.innerHTML;
        console.log('Saved content for:', id);
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
    
    // Navigate to the non-edit version to see changes
    const currentPath = location.pathname;
    let basePath = currentPath;
    
    if (currentPath === '/edit') {
      basePath = '/';
    } else if (currentPath.endsWith('/edit')) {
      basePath = currentPath.slice(0, -5);
    }
      
    setTimeout(() => {
      navigate(basePath);
    }, 1000);
  };

  // Check if we're actually in edit mode - either explicitly enabled or URL ends with /edit
  const actuallyEnabled = isEnabled || location.pathname.endsWith('/edit');
  
  console.log('InPlaceEditor render - Actually enabled:', actuallyEnabled);

  // If not enabled (not in edit mode URL), don't show anything
  if (!actuallyEnabled) {
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
      <style>
        {`
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
          z-index: 100;
        }
        
        .edit-mode [data-editable]:hover::before {
          opacity: 1;
        }
        `}
      </style>
    </>
  );
};

export default InPlaceEditor;
