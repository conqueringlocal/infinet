
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
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

const Pages = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
  const pages = [
    { id: 1, title: 'Home', slug: '/', lastEdited: '2 hours ago', status: 'Published' },
    { id: 2, title: 'About Us', slug: '/about', lastEdited: 'Yesterday', status: 'Published' },
    { id: 3, title: 'Services', slug: '/services', lastEdited: '3 days ago', status: 'Published' },
    { id: 4, title: 'Projects', slug: '/projects', lastEdited: '1 week ago', status: 'Published' },
    { id: 5, title: 'Contact', slug: '/contact', lastEdited: '2 weeks ago', status: 'Published' },
  ];

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditPage = (pageId: number) => {
    toast({
      title: "Edit page",
      description: `Editing page ID: ${pageId}`,
    });
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
          <DialogContent>
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
                        onClick={() => handleEditPage(page.id)}
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
    </div>
  );
};

export default Pages;
