import React, { useState, useEffect, useRef } from 'react';
import { X, Save, LogOut, Edit, Image as ImageIcon, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { savePageContent, getPageContent } from '@/lib/content-service';
import { useAuth } from '@/hooks/use-auth';
import { hasEditPermission, canEditPage, hasPermission } from '@/lib/user-service';

interface InPlaceEditorProps {
  isEnabled: boolean;
}

const getNormalRouteFromPath = (path: string): string => {
  if (path === '/edit') return '/';
  if (path.endsWith('/edit')) {
    return path.slice(0, -5);
  }
  return path;
};

const InPlaceEditor = ({ isEnabled }: InPlaceEditorProps) => {
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentImageElement, setCurrentImageElement] = useState<HTMLImageElement | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [contentChanged, setContentChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [savingFeedbackVisible, setSavingFeedbackVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signOut } = useAuth();

  const isEditUrl = location.pathname === '/edit' || location.pathname.endsWith('/edit');
  const normalRoute = getNormalRouteFromPath(location.pathname);

  useEffect(() => {
    console.log('==== EDITOR MOUNT EFFECT ====');

    const shouldEnableEditMode = isEditUrl || isEnabled;
    console.log('Should enable edit mode?', shouldEnableEditMode);

    const checkPermission = async () => {
      if (user) {
        const hasPermission = await hasEditPermission();
        const canEditCurrentPage = await canEditPage(normalRoute);
        
        const effectiveCanEdit = hasPermission && canEditCurrentPage;
        setCanEdit(effectiveCanEdit);
        
        console.log('User has edit permission:', hasPermission);
        console.log('User can edit this page:', canEditCurrentPage);
        
        if (shouldEnableEditMode && effectiveCanEdit) {
          console.log('Auto-activating edit mode');
          setEditMode(true);
          setTimeout(initializeEditables, 500);
        } else if (shouldEnableEditMode && !effectiveCanEdit) {
          toast({
            title: "Permission denied",
            description: canEditCurrentPage 
              ? "You don't have editing privileges" 
              : "You don't have permission to edit this specific page",
            variant: "destructive",
          });
          navigateToNonEditVersion();
        }
      } else if (shouldEnableEditMode) {
        console.log('Opening login dialog for edit mode');
        setLoginDialogOpen(true);
      }
    };
    
    checkPermission();
  }, [isEditUrl, isEnabled, user]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        console.log('Loading content from Supabase for path:', normalRoute);
        const content = await getPageContent(normalRoute);

        if (content) {
          console.log('Content loaded from Supabase:', Object.keys(content).length, 'elements');
          
          // Store in both localStorage and sessionStorage for fallback
          localStorage.setItem('page_content', JSON.stringify(content));
          sessionStorage.setItem('page_content', JSON.stringify(content));
          
          // Re-initialize editables to apply the content
          if (editMode) {
            setTimeout(initializeEditables, 500);
          }
          return true;
        } else {
          console.log('No content found in Supabase for path:', normalRoute);
        }
      } catch (error) {
        console.error('Error loading content from Supabase:', error);
      }
      return false;
    };

    // Load content whenever the route changes
    loadContent();
  }, [location.pathname, editMode]);

  useEffect(() => {
    if (editMode) {
      const checkForChanges = () => {
        const editableElements = document.querySelectorAll('[data-editable]');
        editableElements.forEach(el => {
          el.addEventListener('input', () => {
            setContentChanged(true);
          });
        });
      };

      setTimeout(checkForChanges, 1000);
    }
  }, [editMode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Login attempt with:', email);

    try {
      await signIn(email, password);
      
      const hasPermission = await hasEditPermission();
      const canEditCurrentPage = await canEditPage(normalRoute);
      
      if (hasPermission && canEditCurrentPage) {
        setLoginDialogOpen(false);
        setEditMode(true);
        setTimeout(initializeEditables, 500);
      } else {
        toast({
          title: "Permission denied",
          description: canEditCurrentPage 
            ? "You don't have editing privileges" 
            : "You don't have permission to edit this specific page",
          variant: "destructive",
        });
        navigateToNonEditVersion();
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setEditMode(false);
      navigateToNonEditVersion();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigateToNonEditVersion = () => {
    navigate(normalRoute);
  };

  const initializeEditables = () => {
    console.log('==== INITIALIZING EDITABLES ====');

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
        el.setAttribute('contenteditable', 'true');
        el.classList.add('editable-content');

        el.addEventListener('focus', () => el.classList.add('editing'));
        el.addEventListener('blur', () => el.classList.remove('editing'));

        el.addEventListener('input', () => setContentChanged(true));

        console.log(`Element ${id} is now editable as text`);
      } else if (type === 'image') {
        el.classList.add('editable-image');
        el.addEventListener('click', (e) => {
          if (editMode) {
            e.preventDefault();
            e.stopPropagation();
            openImageDialog(el as HTMLImageElement);
          }
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
      setContentChanged(true);

      toast({
        title: "Image updated",
        description: "Changes will be automatically saved",
      });
      
      // Auto-save after a short delay to allow user to make additional changes
      autoSaveChanges();
    }
  };

  const autoSaveChanges = () => {
    // Set a timeout to save changes after a brief delay
    setTimeout(() => {
      saveChanges();
    }, 1000);
  };

  const saveChanges = async () => {
    console.log('Saving changes to Supabase...');
    setIsSaving(true);
    setSavingFeedbackVisible(true);

    const editableElements = document.querySelectorAll('[data-editable]');
    console.log(`Found ${editableElements.length} editable elements to save`);

    const contentToSave: Record<string, string> = {};

    editableElements.forEach(el => {
      const id = el.getAttribute('data-editable');
      const type = el.getAttribute('data-editable-type') || 'text';

      if (id) {
        if (type === 'text') {
          contentToSave[id] = el.innerHTML;
          console.log(`Saving text content for: ${id}`);
        } else if (type === 'image') {
          contentToSave[id] = (el as HTMLImageElement).src;
          console.log(`Saving image source for: ${id}`);
        }
      }
    });

    try {
      const pagePath = getNormalRouteFromPath(location.pathname);
      console.log('Saving content to Supabase for path:', pagePath);
      
      const canPublish = await hasPermission('publish_content');
      
      // Save to Supabase
      const saveResult = await savePageContent(pagePath, contentToSave, user?.id);
      
      if (saveResult) {
        console.log('Content saved successfully to Supabase');
        
        // Update localStorage after successful save to Supabase
        localStorage.setItem('page_content', JSON.stringify(contentToSave));
        sessionStorage.setItem('page_content', JSON.stringify(contentToSave));

        toast({
          title: canPublish ? "Changes saved and published" : "Changes saved as draft",
          description: canPublish 
            ? "Your content has been updated and published to the site" 
            : "Your changes have been saved as a draft and are awaiting approval",
        });
      } else {
        throw new Error("Failed to save content to Supabase");
      }

      // Hide the saving feedback after a brief delay
      setTimeout(() => {
        setSavingFeedbackVisible(false);
      }, 2000);
    } catch (error: any) {
      console.error('Error saving content to Supabase:', error);
      toast({
        title: "Error saving changes",
        description: error.message || "There was a problem saving your changes",
        variant: "destructive",
      });
      setSavingFeedbackVisible(false);
    } finally {
      setIsSaving(false);
      setContentChanged(false);
    }
  };

  const shouldShowEditor = isEditUrl || isEnabled;

  if (!shouldShowEditor) {
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
                placeholder="admin@example.com"
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
            </div>
            <div className="flex justify-end">
              <Button type="submit">Login</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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

      {/* Saving Feedback Toast */}
      {savingFeedbackVisible && (
        <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-5">
          <div className="spinner w-5 h-5 border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <span>{isSaving ? "Saving changes..." : "Changes saved!"}</span>
        </div>
      )}

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-lg p-2 flex items-center gap-2">
        {!editMode ? (
          <Button 
            size="sm" 
            onClick={() => setEditMode(true)}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!user || !canEdit}
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
              disabled={!contentChanged || isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : contentChanged ? "Save Changes" : "No Changes"}
            </Button>
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => {
                setEditMode(false);
                setContentChanged(false);
              }}
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
          cursor: pointer;
        }
        
        .edit-mode [data-editable].editing {
          outline: 2px solid #0070f3;
          background-color: rgba(0, 112, 243, 0.05);
        }
        
        .edit-mode [data-editable-type="image"] {
          cursor: pointer !important;
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
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .spinner {
          animation: spin 1s linear infinite;
        }
        
        .animate-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        `}
      </style>
    </>
  );
};

export default InPlaceEditor;
