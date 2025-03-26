
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
  Eye
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

const Pages = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPage, setEditingPage] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const pages = [
    { id: 1, title: 'Home', slug: '/', lastEdited: '2 hours ago', status: 'Published', content: '<h1>Welcome to Infi-NET</h1><p>Your trusted provider of fiber and low-voltage solutions.</p>' },
    { id: 2, title: 'About Us', slug: '/about', lastEdited: 'Yesterday', status: 'Published', content: '<h1>About Infi-NET</h1><p>Learn about our company history and mission.</p>' },
    { id: 3, title: 'Services', slug: '/services', lastEdited: '3 days ago', status: 'Published', content: '<h1>Our Services</h1><p>Discover our range of professional services.</p>' },
    { id: 4, title: 'Projects', slug: '/projects', lastEdited: '1 week ago', status: 'Published', content: '<h1>Projects</h1><p>View our portfolio of completed projects.</p>' },
    { id: 5, title: 'Contact', slug: '/contact', lastEdited: '2 weeks ago', status: 'Published', content: '<h1>Contact Us</h1><p>Get in touch with our team today.</p>' },
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
  };

  const handleViewPage = (slug: string) => {
    window.open(slug, '_blank');
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
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditPage(page)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
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
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Page: {editingPage?.title}</DialogTitle>
            <DialogDescription>
              Make changes to the page content. Click save when you're done.
            </DialogDescription>
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
                  <label htmlFor="pageContent" className="text-sm font-medium">
                    Content
                  </label>
                  <div className="border rounded-md p-4 min-h-[300px] bg-white">
                    <Textarea 
                      id="pageContent"
                      value={editingPage.content}
                      onChange={(e) => setEditingPage({...editingPage, content: e.target.value})}
                      className="min-h-[250px] w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Use HTML tags for formatting. For example, &lt;h1&gt;Title&lt;/h1&gt; for headings.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="seo" className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="metaTitle" className="text-sm font-medium">
                    Meta Title
                  </label>
                  <Input id="metaTitle" placeholder="Meta Title for Search Engines" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="metaDescription" className="text-sm font-medium">
                    Meta Description
                  </label>
                  <Textarea 
                    id="metaDescription" 
                    placeholder="Description for search engine results"
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="ogImage" className="text-sm font-medium">
                    Social Share Image
                  </label>
                  <div className="flex items-center gap-2">
                    <Input id="ogImage" placeholder="URL to image" className="flex-1" />
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
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pages;
