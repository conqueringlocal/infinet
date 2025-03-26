import React, { useState, useEffect, useRef } from 'react';
import { X, Save, LogOut, Edit, Image as ImageIcon, Upload, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { savePageContent, getPageContent } from '@/lib/content-service';
import { useAuth } from '@/hooks/use-auth';

interface InPlaceEditorProps {
  isEnabled: boolean;
}

const InPlaceEditor = ({ isEnabled }: InPlaceEditorProps) => {
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentImageElement, setCurrentImageElement] = useState<HTMLImageElement | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [contentChanged, setContentChanged] = useState(false);
  const [exportedContent, setExportedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportContentRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signOut } = useAuth();

  const isEditUrl = location.pathname === '/edit' || location.pathname.endsWith('/edit');

  useEffect(() => {
    console.log('==== EDITOR MOUNT EFFECT ====');

    const shouldEnableEditMode = isEditUrl || isEnabled;
    console.log('Should enable edit mode?', shouldEnableEditMode);

    if (shouldEnableEditMode && user) {
      console.log('Auto-activating edit mode');
      setEditMode(true);

      setTimeout(initializeEditables, 500);
    } else if (shouldEnableEditMode && !user) {
      console.log('Opening login dialog for edit mode');
      setLoginDialogOpen(true);
    }
  }, [isEditUrl, isEnabled, user]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const normalRoute = getNormalRoute();
        const content = await getPageContent(normalRoute);

        if (content) {
          localStorage.setItem('page_content', JSON.stringify(content));
          sessionStorage.setItem('page_content', JSON.stringify(content));
          console.log('Loaded content from Supabase for path:', normalRoute);
        }
      } catch (error) {
        console.error('Error loading content from Supabase:', error);
      }
    };

    loadContent();
  }, [location.pathname]);

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

  const getNormalRoute = () => {
    if (location.pathname === '/edit') return '/';
    if (location.pathname.endsWith('/edit')) {
      return location.pathname.slice(0, -5);
    }
    return location.pathname;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Login attempt with:', email);

    try {
      await signIn(email, password);
      setLoginDialogOpen(false);
      setEditMode(true);

      setTimeout(initializeEditables, 500);
    } catch (error) {
      console.error('Login error:', error);
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
        description: "Don't forget to save your changes",
      });
    }
  };

  const saveChanges = async () => {
    console.log('Saving changes to Supabase...');
    setIsSaving(true);

    const editableElements = document.querySelectorAll('[data-editable]');
    console.log(`Found ${editableElements.length} editable elements to save`);

    const contentToSave: Record<string, string> = {};

    try {
      const existingSaved = localStorage.getItem('page_content');
      if (existingSaved) {
        Object.assign(contentToSave, JSON.parse(existingSaved));
      }
    } catch (e) {
      console.error('Error loading existing saved content', e);
    }

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

    localStorage.setItem('page_content', JSON.stringify(contentToSave));
    sessionStorage.setItem('page_content', JSON.stringify(contentToSave));

    try {
      const pagePath = getNormalRoute();
      await savePageContent(pagePath, contentToSave, user?.id);

      toast({
        title: "Changes saved",
        description: "Your content has been updated and stored in the database",
      });

      prepareExportContent(contentToSave);
      setExportDialogOpen(true);
    } catch (error: any) {
      console.error('Error saving content to Supabase:', error);
      toast({
        title: "Error saving changes",
        description: error.message || "There was a problem saving your changes",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setContentChanged(false);
    }
  };

  const prepareExportContent = (contentData: Record<string, string>) => {
    const formattedDate = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
    const exportObject = {
      version: 1,
      timestamp: new Date().toISOString(),
      pageUrl: window.location.pathname,
      content: contentData
    };

    setExportedContent(JSON.stringify(exportObject, null, 2));
  };

  const handleExportDone = () => {
    setExportDialogOpen(false);

    setEditMode(false);
    navigateToNonEditVersion();
  };

  const copyExportedContent = () => {
    if (exportContentRef.current) {
      exportContentRef.current.select();
      document.execCommand('copy');

      toast({
        title: "Copied to clipboard",
        description: "The content has been copied to your clipboard",
      });
    }
  };

  const downloadExportedContent = () => {
    const element = document.createElement('a');
    const formattedDate = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
    const pageName = location.pathname.replace(/\//g, '-').replace('edit', '');
    const fileName = `site-content${pageName ? '-' + pageName : ''}-${formattedDate}.json`;

    const file = new Blob([exportedContent], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Content downloaded",
      description: "Save this file for your developer to implement the changes",
    });
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

      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Your Content Changes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-gray-700">
              Your changes have been saved locally. To make them permanent across all devices, 
              you need to share this content with your developer to apply to the website code.
            </p>
            
            <div className="border rounded p-2 bg-gray-50">
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">Content JSON:</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyExportedContent}
                  className="h-7 text-xs"
                >
                  Copy to clipboard
                </Button>
              </div>
              <textarea
                ref={exportContentRef}
                value={exportedContent}
                readOnly
                className="w-full h-64 p-2 text-xs font-mono bg-gray-100 rounded border border-gray-300"
              />
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <Button 
                variant="outline"
                onClick={downloadExportedContent}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download JSON File
              </Button>
              
              <Button onClick={handleExportDone}>
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-lg p-2 flex items-center gap-2">
        {!editMode ? (
          <Button 
            size="sm" 
            onClick={() => setEditMode(true)}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!user}
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
        `}
      </style>
    </>
  );
};

export default InPlaceEditor;
