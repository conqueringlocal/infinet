
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  ChevronDown,
  UploadCloud,
  Grid,
  List,
  Image,
  File,
  FileText,
  MoreHorizontal
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Media = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Sample media items - in a real application, this would come from your database
  const mediaItems = [
    { 
      id: 1, 
      name: 'company-logo.png', 
      type: 'image', 
      size: '254 KB', 
      uploaded: '2 days ago',
      url: '/lovable-uploads/82c5769b-887a-49f8-a103-392bb5e996d5.png'
    },
    { 
      id: 2, 
      name: 'hero-background.jpg', 
      type: 'image', 
      size: '1.2 MB', 
      uploaded: '1 week ago',
      url: '/placeholder.svg'
    },
    { 
      id: 3, 
      name: 'service-document.pdf', 
      type: 'document', 
      size: '3.5 MB', 
      uploaded: '2 weeks ago',
      url: '/placeholder.svg'
    },
    { 
      id: 4, 
      name: 'client-testimonial.mp4', 
      type: 'video', 
      size: '15.7 MB', 
      uploaded: '1 month ago',
      url: '/placeholder.svg'
    },
    { 
      id: 5, 
      name: 'product-sheet.xlsx', 
      type: 'spreadsheet', 
      size: '842 KB', 
      uploaded: '1 month ago',
      url: '/placeholder.svg'
    },
  ];

  const filteredMedia = mediaItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      toast({
        title: "File upload",
        description: `Uploaded: ${files[0].name}`,
      });
    }
  };

  const getFileIcon = (type: string) => {
    switch(type) {
      case 'image':
        return <Image className="h-6 w-6 text-blue-500" />;
      case 'document':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'video':
        return <File className="h-6 w-6 text-purple-500" />;
      case 'spreadsheet':
        return <File className="h-6 w-6 text-green-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Media Library</h1>
        <label>
          <Input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button 
            variant="default" 
            className="bg-[#003366] hover:bg-[#002244] cursor-pointer"
            onClick={() => document.querySelector('input[type="file"]')?.click()}
          >
            <UploadCloud className="h-4 w-4 mr-2" /> Upload
          </Button>
        </label>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search media..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex space-x-2 self-end">
          <Button variant="outline" className="flex items-center">
            Filter
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
          <div className="border rounded-md flex">
            <Button 
              variant="ghost" 
              size="icon"
              className={viewMode === 'grid' ? 'bg-gray-100' : ''}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className={viewMode === 'list' ? 'bg-gray-100' : ''}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMedia.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden group">
              <div className="aspect-square bg-gray-100 relative flex items-center justify-center">
                {item.type === 'image' ? (
                  <img 
                    src={item.url} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-6">
                    {getFileIcon(item.type)}
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="sm">View</Button>
                    <Button variant="secondary" size="sm">Delete</Button>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-800 truncate">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.size} • {item.uploaded}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-500">File</th>
                  <th className="text-left p-4 font-medium text-gray-500">Type</th>
                  <th className="text-left p-4 font-medium text-gray-500">Size</th>
                  <th className="text-left p-4 font-medium text-gray-500">Uploaded</th>
                  <th className="text-right p-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedia.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center">
                        {getFileIcon(item.type)}
                        <span className="font-medium ml-2">{item.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500 capitalize">{item.type}</td>
                    <td className="p-4 text-gray-500">{item.size}</td>
                    <td className="p-4 text-gray-500">{item.uploaded}</td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;
