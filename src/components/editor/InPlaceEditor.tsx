import React, { useState, useEffect, useRef } from 'react';
import { X, Save, LogOut, Edit, Image as ImageIcon, Upload, Download, FileInput, Import, FileDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { savePageContent, getPageContent, validateContentImport, importPageContent, ContentExport } from '@/lib/content-service';
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
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentImageElement, setCurrentImageElement] = useState<HTMLImageElement | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [contentChanged, setContentChanged] = useState(false);
  const [exportedContent, setExportedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importFileInputRef = useRef<HTMLInputElement>(null);
  const exportContentRef = useRef<HTMLTextAreaElement>(null);
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
        const content = await getPageContent(normalRoute);

        if (content) {
          localStorage.setItem('page_content', JSON.stringify(content));
          sessionStorage.setItem('page_content', JSON.stringify(content));
          console.log('Loaded content from Supabase for path:', normalRoute);
          
          setTimeout(initializeEditables, 500);
          return true;
        }
      } catch (error) {
        console.error('Error loading content from Supabase:', error);
      }
      return false;
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
    return getNormalRouteFromPath(location.pathname);
  };

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
      
      const canPublish = await hasPermission('publish_content');
      
      await savePageContent(pagePath, contentToSave, user?.id);

      toast({
        title: canPublish ? "Changes saved and published" : "Changes saved as draft",
        description: canPublish 
          ? "Your content has been updated and published to the site" 
          : "Your changes have been saved as a draft and are awaiting approval",
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

  const handleImportClick = () => {
    setImportDialogOpen(true);
    setImportError(null);
    setImportSuccess(null);
  };

  const handleImportFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(null);
    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        if (event.target?.result) {
          const fileContent = event.target.result as string;
          const validationResult = validateContentImport(fileContent);
          
          if (!validationResult.valid) {
            setImportError(validationResult.error || 'Invalid file format');
            setIsImporting(false);
            return;
          }

          const importResult = await importPageContent(
            validationResult.data as ContentExport, 
            user?.id
          );

          if (importResult.success) {
            setImportSuccess(importResult.message);
            const currentRoute = getNormalRoute();
            if (validationResult.data?.pageUrl === currentRoute) {
              await loadPageContent();
              setContentChanged(true);
            }
          } else {
            setImportError(importResult.message);
          }
        }
      } catch (error: any) {
        setImportError(error.message || 'Error processing import file');
        console.error('Import error:', error);
      } finally {
        setIsImporting(false);
      }
    };

    reader.onerror = () => {
      setImportError('Error reading file');
      setIsImporting(false);
    };

    reader.readAsText(file);
  };

  const handlePasteImport = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      const validationResult = validateContentImport(clipboardText);
      
      if (!validationResult.valid) {
        setImportError(validationResult.error || 'Invalid clipboard content');
        return;
      }

      setIsImporting(true);
      const importResult = await importPageContent(
        validationResult.data as ContentExport, 
        user?.id
      );

      if (importResult.success) {
        setImportSuccess(importResult.message);
        const currentRoute = getNormalRoute();
        if (validationResult.data?.pageUrl === currentRoute) {
          await loadPageContent();
          setContentChanged(true);
        }
      } else {
        setImportError(importResult.message);
      }
    } catch (error: any) {
      setImportError(error.message || 'Error processing clipboard content');
      console.error('Import error:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const loadPageContent = async () => {
    try {
      const content = await getPageContent(normalRoute);

      if (content) {
        localStorage.setItem('page_content', JSON.stringify(content));
        sessionStorage.setItem('page_content', JSON.stringify(content));
        console.log('Loaded content from Supabase for path:', normalRoute);
        
        setTimeout(initializeEditables, 500);
        return true;
      }
    } catch (error) {
      console.error('Error loading content from Supabase:', error);
    }
    return false;
  };

  const shouldShowEditor = isEditUrl || isEnabled;
  const hasMediaPermission = useRef<boolean>(false);

  useEffect(() => {
    const checkMediaPermission = async () => {
      if (user) {
        const canManageMedia = await hasPermission('manage_media');
        hasMediaPermission.current = canManageMedia;
      }
    };
    
    checkMediaPermission();
  }, [user]);

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

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Content</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-gray-600">
              Import previously exported content. This will replace the current content for the specified page.
            </p>

            <div className="space-y-2">
              <label className="text-sm font-medium block">
                Upload JSON File
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={importFileInputRef}
                  onChange={handleImportFileUpload}
                  accept=".json,application/json"
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  onClick={() => importFileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2"
                  disabled={isImporting}
                >
                  <FileInput className="h-4 w-4" />
                  {isImporting ? "Processing..." : "Choose File"}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 py-2">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-xs text-gray-500">OR</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={handlePasteImport}
              disabled={isImporting}
            >
              Paste from Clipboard
            </Button>

            {importError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                <p className="font-medium">Import Error</p>
                <p>{importError}</p>
              </div>
            )}

            {importSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
                <p className="font-medium">Success</p>
                <p>{importSuccess}</p>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setImportDialogOpen(false)}
              >
                Close
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
            
            <div className="border-r h-6 mx-1 border-gray-300"></div>
            
            {hasMediaPermission.current && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleImportClick}
                title="Import Content"
              >
                <FileDown className="h-4 w-4" />
              </Button>
            )}
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
