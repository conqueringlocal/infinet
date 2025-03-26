
import React, { useState, useEffect, useRef } from 'react';
import { X, Save, LogOut, Edit, Image as ImageIcon, Upload } from 'lucide-react';
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
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentImageElement, setCurrentImageElement] = useState<HTMLImageElement | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on an edit URL (ends with /edit)
  const isEditUrl = location.pathname === '/edit' || location.pathname.endsWith('/edit');
  
  console.log('==== EDITOR INIT ====');
  console.log('Current path:', location.pathname);
  console.log('isEditUrl detected:', isEditUrl);
  console.log('isEnabled prop value:', isEnabled);
  
  // Set up the editor on initial load
  useEffect(() => {
    console.log('==== EDITOR MOUNT EFFECT ====');
    
    // Detect edit mode from URL or prop
    const shouldEnableEditMode = isEditUrl || isEnabled;
    console.log('Should enable edit mode?', shouldEnableEditMode);
    
    // Check if user is authenticated for editing
    const authStatus = localStorage.getItem('edit_authenticated');
    const isAuthenticated = authStatus === 'true';
    setIsLoggedIn(isAuthenticated);
    console.log('Is authenticated?', isAuthenticated);
    
    // If edit mode should be enabled and user is logged in
    if (shouldEnableEditMode && isAuthenticated) {
      console.log('Auto-activating edit mode');
      setEditMode(true);
      
      // Initialize editables with a delay to ensure DOM is ready
      setTimeout(initializeEditables, 500);
    }
    // If edit mode should be enabled but user is not logged in
    else if (shouldEnableEditMode && !isAuthenticated) {
      console.log('Opening login dialog for edit mode');
      setLoginDialogOpen(true);
    }
  }, [isEditUrl, isEnabled]);

  // Effect for handling edit mode changes
  useEffect(() => {
    console.log('==== EDIT MODE CHANGED ====');
    console.log('Edit mode active?', editMode);
    console.log('User is logged in?', isLoggedIn);
    
    if (editMode && isLoggedIn) {
      console.log('Adding edit-mode class to body');
      document.body.classList.add('edit-mode');
      
      // Initialize editables whenever edit mode is activated
      setTimeout(initializeEditables, 500);
    } else {
      console.log('Removing edit-mode class from body');
      document.body.classList.remove('edit-mode');
    }
    
    return () => {
      document.body.classList.remove('edit-mode');
    };
  }, [editMode, isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Login attempt with:', email);
    
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
      
      // Initialize editables after login
      setTimeout(initializeEditables, 500);
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
    navigateToNonEditVersion();
  };

  const navigateToNonEditVersion = () => {
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
    console.log('==== INITIALIZING EDITABLES ====');
    
    // Find all editable elements
    const editableElements = document.querySelectorAll('[data-editable]');
    console.log(`Found ${editableElements.length} editable elements`);
    
    if (editableElements.length === 0) {
      console.warn('No editable elements found. Are EditableContent components rendered?');
      return;
    }
    
    editableElements.forEach(el => {
      const id = el.getAttribute('data-editable');
      const type = el.getAttribute('data-editable-type') || 'text';
      console.log(`Setting up editable: ${id} (${type})`);
      
      if (type === 'text') {
        // Make text editable
        el.setAttribute('contenteditable', 'true');
        el.classList.add('editable-content');
        
        // Add focus/blur styling
        el.addEventListener('focus', () => el.classList.add('editing'));
        el.addEventListener('blur', () => el.classList.remove('editing'));
        
        console.log(`Element ${id} is now editable as text`);
      } else if (type === 'image') {
        // For images, we need click handler to open image dialog
        el.classList.add('editable-image');
        el.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openImageDialog(el as HTMLImageElement);
        });
        
        console.log(`Element ${id} is now editable as image`);
      }
    });
    
    console.log('All elements are now editable');
  };

  const openImageDialog = (imgElement: HTMLImageElement) => {
    setCurrentImageElement(imgElement);
    setNewImageUrl(imgElement.src);
    setImageDialogOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setNewImageUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const updateImage = () => {
    if (currentImageElement && newImageUrl) {
      currentImageElement.src = newImageUrl;
      setImageDialogOpen(false);
      
      toast({
        title: "Image updated",
        description: "Don't forget to save your changes",
      });
    }
  };

  const saveChanges = () => {
    console.log('Saving changes...');
    
    const editableElements = document.querySelectorAll('[data-editable]');
    console.log(`Found ${editableElements.length} editable elements to save`);
    
    const contentToSave: Record<string, string> = {};
    
    // First load any existing saved content
    try {
      const existingSaved = localStorage.getItem('page_content');
      if (existingSaved) {
        Object.assign(contentToSave, JSON.parse(existingSaved));
      }
    } catch (e) {
      console.error('Error loading existing saved content', e);
    }
    
    // Now update with the current page's content
    editableElements.forEach(el => {
      const id = el.getAttribute('data-editable');
      const type = el.getAttribute('data-editable-type') || 'text';
      
      if (id) {
        if (type === 'text') {
          contentToSave[id] = el.innerHTML;
          console.log(`Saved text content for: ${id}`);
        } else if (type === 'image') {
          contentToSave[id] = (el as HTMLImageElement).src;
          console.log(`Saved image source for: ${id}`);
        }
      }
    });
    
    // Save to localStorage
    localStorage.setItem('page_content', JSON.stringify(contentToSave));
    
    // Also save to sessionStorage for redundancy
    sessionStorage.setItem('page_content', JSON.stringify(contentToSave));
    
    toast({
      title: "Changes saved",
      description: "Your content has been updated successfully",
    });

    // Turn off edit mode after saving
    setEditMode(false);
    
    // Navigate to the non-edit version
    navigateToNonEditVersion();
  };

  // Determine if editor should be shown (based on URL or prop)
  const shouldShowEditor = isEditUrl || isEnabled;
  
  console.log('==== RENDER DECISION ====');
  console.log('Should show editor?', shouldShowEditor);

  // Don't render anything if we shouldn't show the editor
  if (!shouldShowEditor) {
    console.log('Not rendering editor component');
    return null;
  }
  
  console.log('Rendering editor component and UI');
  
  return (
    <>
      {/* Login Dialog */}
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

      {/* Image Edit Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {currentImageElement && (
              <div className="border rounded p-2 mb-4">
                <p className="text-sm text-gray-500 mb-2">Current image:</p>
                <img 
                  src={currentImageElement.src} 
                  alt="Current" 
                  className="w-full h-40 object-contain mb-2"
                />
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Upload Image</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Choose File
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="imageUrl" className="text-sm font-medium">Or Enter Image URL</label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              {newImageUrl && newImageUrl !== currentImageElement?.src && (
                <div className="border rounded p-2">
                  <p className="text-sm text-gray-500 mb-2">Preview:</p>
                  <img 
                    src={newImageUrl} 
                    alt="Preview" 
                    className="w-full h-40 object-contain"
                    onError={() => {
                      toast({
                        title: "Error loading image",
                        description: "The URL might be invalid or the image is not accessible",
                        variant: "destructive"
                      });
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={updateImage}>
                Update Image
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Editor Controls */}
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

      {/* Styles for editable content */}
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
        
        .edit-mode [data-editable-type="image"] {
          cursor: pointer;
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
