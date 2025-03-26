import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Search, 
  ChevronDown,
  Edit,
  Trash2,
  Plus,
  Eye,
  Save,
  Code,
  Layout,
  Copy,
  Smartphone,
  Monitor,
  Tablet,
  MessageSquare
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const Pages = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPage, setEditingPage] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState<'code' | 'visual'>('visual');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<any>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [fullPreviewMode, setFullPreviewMode] = useState(false);
  const [selectedEditableElement, setSelectedEditableElement] = useState<string | null>(null);
  
  const pages = [
    { 
      id: 1, 
      title: 'Home', 
      slug: '/', 
      lastEdited: '2 hours ago', 
      status: 'Published', 
      content: `
<div class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold text-center mb-8">Welcome to Infi-NET</h1>
  <p class="text-lg text-center mb-12">Your trusted provider of fiber and low-voltage solutions.</p>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Fiber Solutions</h2>
      <p>We provide comprehensive fiber optic installation and maintenance services for businesses of all sizes.</p>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Low-Voltage Systems</h2>
      <p>Our low-voltage solutions include structured cabling, security systems, and audio/visual installations.</p>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Network Services</h2>
      <p>We design, implement, and maintain reliable and secure network infrastructure for your business.</p>
    </div>
  </div>
  
  <div class="bg-blue-50 p-8 rounded-lg mb-12">
    <h2 class="text-2xl font-bold mb-4 text-center">Why Choose Infi-NET?</h2>
    <ul class="list-disc pl-8">
      <li class="mb-2">Over 15 years of industry experience</li>
      <li class="mb-2">Certified technicians and engineers</li>
      <li class="mb-2">Comprehensive project management</li>
      <li class="mb-2">24/7 support and maintenance</li>
      <li class="mb-2">Competitive pricing and flexible solutions</li>
    </ul>
  </div>
  
  <div class="text-center">
    <h2 class="text-2xl font-bold mb-4">Ready to Get Started?</h2>
    <p class="mb-6">Contact us today for a free consultation and quote.</p>
    <button class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Contact Us</button>
  </div>
</div>
      `,
      metaTitle: 'Infi-NET | Fiber & Low-Voltage Solutions',
      metaDescription: 'Infi-NET provides professional fiber optic and low-voltage solutions for businesses. Get reliable network infrastructure with our expert services.',
      ogImage: '/images/home-og.jpg',
    },
    { 
      id: 2, 
      title: 'About Us', 
      slug: '/about', 
      lastEdited: 'Yesterday', 
      status: 'Published', 
      content: `
<div class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold text-center mb-8">About Infi-NET</h1>
  <p class="text-lg text-center mb-12">Learn about our company history and mission.</p>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
    <div>
      <h2 class="text-2xl font-semibold mb-4">Our Story</h2>
      <p class="mb-4">Founded in 2008, Infi-NET has grown from a small local contractor to a leading provider of fiber optic and low-voltage solutions in the region.</p>
      <p>With a focus on quality workmanship and customer satisfaction, we've built a reputation for delivering reliable and innovative solutions for businesses of all sizes.</p>
    </div>
    <div class="bg-gray-100 p-6 rounded-lg">
      <h2 class="text-2xl font-semibold mb-4">Our Mission</h2>
      <p>To provide businesses with reliable, scalable, and future-proof network infrastructure through expert design, quality installation, and responsive support.</p>
    </div>
  </div>
  
  <div class="mb-12">
    <h2 class="text-2xl font-semibold text-center mb-6">Our Core Values</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-medium mb-3">Quality</h3>
        <p>We never compromise on the quality of our work, using only the best materials and following industry best practices.</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-medium mb-3">Integrity</h3>
        <p>We operate with honesty and transparency in all our business dealings, earning the trust of our clients.</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-medium mb-3">Innovation</h3>
        <p>We stay at the forefront of technology, continually updating our skills and services to provide cutting-edge solutions.</p>
      </div>
    </div>
  </div>
  
  <div class="bg-blue-50 p-8 rounded-lg mb-12">
    <h2 class="text-2xl font-bold mb-4">Our Team</h2>
    <p class="mb-4">Our team consists of certified technicians, engineers, and project managers with extensive experience in fiber optics, structured cabling, and network infrastructure.</p>
    <p>We invest in ongoing training and certification to ensure our team is equipped with the latest knowledge and skills in the industry.</p>
  </div>
</div>
      `,
      metaTitle: 'About Us | Infi-NET LLC',
      metaDescription: 'Learn about Infi-NET, our history, mission, and values. Discover why we are the trusted choice for fiber optic and low-voltage solutions.',
      ogImage: '/images/about-og.jpg',
    },
    // ... keep existing code for other pages
  ];

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditPage = (page: any) => {
    setEditingPage(page);
    setIsEditDialogOpen(true);
  };

  const handleSavePage = () => {
    // In a real application, this would save to a database
    toast({
      title: "Page updated",
      description: `Successfully updated ${editingPage.title}`,
    });
    setIsEditDialogOpen(false);
    setFullPreviewMode(false);
  };

  const handleViewPage = (slug: string) => {
    window.open(slug, '_blank');
  };

  const toggleEditMode = () => {
    setEditMode(editMode === 'code' ? 'visual' : 'code');
    setSelectedEditableElement(null);
  };

  const toggleFullPreviewMode = () => {
    setFullPreviewMode(!fullPreviewMode);
  };

  const confirmDeletePage = (page: any) => {
    setPageToDelete(page);
    setIsDeleteDialogOpen(true);
  };

  const handleDeletePage = () => {
    // In a real application, this would delete from a database
    toast({
      title: "Page deleted",
      description: `Successfully deleted ${pageToDelete.title}`,
    });
    setIsDeleteDialogOpen(false);
  };

  const handleCopyHtml = (html: string) => {
    navigator.clipboard.writeText(html);
    toast({
      title: "HTML copied",
      description: "HTML content copied to clipboard",
    });
  };

  const handleVisualEdit = (newContent: string) => {
    if (editingPage) {
      setEditingPage({...editingPage, content: newContent});
    }
  };

  const getPreviewWidth = () => {
    switch(previewDevice) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      default:
        return 'max-w-full';
    }
  };

  const getEditModeTip = () => {
    if (editMode === 'visual') {
      return (
        <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-md mb-2">
          <MessageSquare className="h-4 w-4" />
          <span>Click directly on content in the preview to edit it. Changes are saved automatically.</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Pages</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" className="bg-[#003366] hover:bg-[#002244]">
              <Plus className="h-4 w-4 mr-2" /> New Page
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Create new page</DialogTitle>
              <DialogDescription>
                Add a new page to your website
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="title" className="text-right">
                  Title
                </label>
                <Input
                  id="title"
                  placeholder="Page Title"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="slug" className="text-right">
                  Slug
                </label>
                <Input
                  id="slug"
                  placeholder="/page-slug"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-[#003366] hover:bg-[#002244]">Create Page</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search pages..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center">
          Filter
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium text-gray-500">Title</th>
                <th className="text-left p-4 font-medium text-gray-500">URL</th>
                <th className="text-left p-4 font-medium text-gray-500">Last Edited</th>
                <th className="text-left p-4 font-medium text-gray-500">Status</th>
                <th className="text-right p-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPages.map((page) => (
                <tr key={page.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">{page.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500">{page.slug}</td>
                  <td className="p-4 text-gray-500">{page.lastEdited}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                      {page.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewPage(page.slug)}
                        title="View page"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditPage(page)}
                        title="Edit page"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => confirmDeletePage(page)}
                        title="Delete page"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Page Editor Dialog */}
      <Dialog 
        open={isEditDialogOpen && !fullPreviewMode} 
        onOpenChange={(open) => {
          if (!open) {
            setIsEditDialogOpen(false);
            setFullPreviewMode(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[90vw] h-[90vh] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Edit Page: {editingPage?.title}</DialogTitle>
                <DialogDescription>
                  Make changes to the page content. Click save when you're done.
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleEditMode}
                  className="flex items-center gap-1"
                >
                  {editMode === 'code' ? (
                    <>
                      <Layout className="h-4 w-4" />
                      Visual Editor
                    </>
                  ) : (
                    <>
                      <Code className="h-4 w-4" />
                      Code Editor
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFullPreviewMode}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  Full Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editingPage && handleCopyHtml(editingPage.content)}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-4 w-4" />
                  Copy HTML
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          {editingPage && (
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="pageTitle" className="text-sm font-medium">
                    Page Title
                  </label>
                  <Input 
                    id="pageTitle" 
                    value={editingPage.title} 
                    onChange={(e) => setEditingPage({...editingPage, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="pageContent" className="text-sm font-medium">
                      Content
                    </label>
                    {editMode === 'visual' && (
                      <div className="flex border rounded-md overflow-hidden">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className={`px-3 py-1 rounded-none ${previewDevice === 'desktop' ? 'bg-gray-100' : ''}`}
                          onClick={() => setPreviewDevice('desktop')}
                        >
                          <Monitor className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className={`px-3 py-1 rounded-none ${previewDevice === 'tablet' ? 'bg-gray-100' : ''}`}
                          onClick={() => setPreviewDevice('tablet')}
                        >
                          <Tablet className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className={`px-3 py-1 rounded-none ${previewDevice === 'mobile' ? 'bg-gray-100' : ''}`}
                          onClick={() => setPreviewDevice('mobile')}
                        >
                          <Smartphone className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {editMode === 'code' && (
                      <span className="text-xs text-gray-500">
                        Use HTML tags for formatting. For example, &lt;h1&gt;Title&lt;/h1&gt; for headings.
                      </span>
                    )}
                  </div>
                  
                  {getEditModeTip()}
                  
                  <div className={`${editMode === 'visual' && previewDevice !== 'desktop' ? 'flex justify-center bg-gray-50 p-4' : ''}`}>
                    <div className={editMode === 'visual' ? getPreviewWidth() : ''}>
                      <Textarea 
                        id="pageContent"
                        value={editingPage.content}
                        onChange={(e) => setEditingPage({...editingPage, content: e.target.value})}
                        className={editMode === 'visual' ? "" : "min-h-[400px] font-mono"}
                        preview={true}
                        previewClassName={`min-h-[400px] ${editMode === 'visual' ? 'visual-editor' : ''}`}
                        editMode={editMode}
                        onVisualEdit={handleVisualEdit}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="seo" className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="metaTitle" className="text-sm font-medium">
                    Meta Title
                  </label>
                  <Input 
                    id="metaTitle" 
                    placeholder="Meta Title for Search Engines" 
                    value={editingPage.metaTitle || ''}
                    onChange={(e) => setEditingPage({...editingPage, metaTitle: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="metaDescription" className="text-sm font-medium">
                    Meta Description
                  </label>
                  <Textarea 
                    id="metaDescription" 
                    placeholder="Description for search engine results"
                    className="min-h-[100px]"
                    value={editingPage.metaDescription || ''}
                    onChange={(e) => setEditingPage({...editingPage, metaDescription: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="ogImage" className="text-sm font-medium">
                    Social Share Image
                  </label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="ogImage" 
                      placeholder="URL to image" 
                      className="flex-1"
                      value={editingPage.ogImage || ''}
                      onChange={(e) => setEditingPage({...editingPage, ogImage: e.target.value})}
                    />
                    <Button variant="outline">Select Image</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="pageSlug" className="text-sm font-medium">
                    URL Slug
                  </label>
                  <Input 
                    id="pageSlug" 
                    value={editingPage.slug} 
                    onChange={(e) => setEditingPage({...editingPage, slug: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Page Status
                  </label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="published"
                        name="status"
                        value="published"
                        checked={editingPage.status === "Published"}
                        onChange={() => setEditingPage({...editingPage, status: "Published"})}
                        className="h-4 w-4 text-blue-600"
                      />
                      <label htmlFor="published">Published</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="draft"
                        name="status"
                        value="draft"
                        checked={editingPage.status === "Draft"}
                        onChange={() => setEditingPage({...editingPage, status: "Draft"})}
                        className="h-4 w-4 text-blue-600"
                      />
                      <label htmlFor="draft">Draft</label>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-[#003366] hover:bg-[#002244]"
              onClick={handleSavePage}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full Preview Mode */}
      {fullPreviewMode && editingPage && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="border-b p-4 flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-semibold">Previewing: {editingPage.title}</h2>
            <div className="flex items-center gap-3">
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`px-3 py-1 rounded-none ${previewDevice === 'desktop' ? 'bg-gray-100' : ''}`}
                  onClick={() => setPreviewDevice('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`px-3 py-1 rounded-none ${previewDevice === 'tablet' ? 'bg-gray-100' : ''}`}
                  onClick={() => setPreviewDevice('tablet')}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`px-3 py-1 rounded-none ${previewDevice === 'mobile' ? 'bg-gray-100' : ''}`}
                  onClick={() => setPreviewDevice('mobile')}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={toggleFullPreviewMode}
              >
                Exit Preview
              </Button>
              <Button 
                className="bg-[#003366] hover:bg-[#002244]"
                onClick={handleSavePage}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-gray-100 p-4">
            <div className={`mx-auto bg-white shadow-lg ${getPreviewWidth()}`}>
              <Textarea 
                id="fullPageContent"
                value={editingPage.content}
                onChange={(e) => setEditingPage({...editingPage, content: e.target.value})}
                preview={true}
                fullPreview={true}
                previewClassName="min-h-[calc(100vh-200px)]"
                editMode={editMode}
                onVisualEdit={handleVisualEdit}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the page
              "{pageToDelete?.title}" and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePage} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Pages;

