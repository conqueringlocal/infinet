
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Users = () => {
  const { toast } = useToast();
  
  // Sample users - in a real application, this would come from your database
  const users = [
    { 
      id: 1, 
      name: 'Admin User', 
      email: 'admin@conqueringlocal.com', 
      role: 'Administrator',
      status: 'Active',
      lastActive: 'Just now'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@conqueringlocal.com', 
      role: 'Editor',
      status: 'Active',
      lastActive: '2 hours ago'
    },
    { 
      id: 3, 
      name: 'Bob Johnson', 
      email: 'bob@conqueringlocal.com', 
      role: 'Viewer',
      status: 'Inactive',
      lastActive: '1 week ago'
    }
  ];

  const handleAddUser = () => {
    toast({
      title: "Add user",
      description: "This would open a form to add a new user",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <Button 
          variant="default" 
          className="bg-[#003366] hover:bg-[#002244]"
          onClick={handleAddUser}
        >
          <UserPlus className="h-4 w-4 mr-2" /> Add User
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium text-gray-500">Name</th>
                <th className="text-left p-4 font-medium text-gray-500">Email</th>
                <th className="text-left p-4 font-medium text-gray-500">Role</th>
                <th className="text-left p-4 font-medium text-gray-500">Status</th>
                <th className="text-left p-4 font-medium text-gray-500">Last Active</th>
                <th className="text-right p-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium">{user.name}</div>
                  </td>
                  <td className="p-4 text-gray-500">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'Administrator' 
                        ? 'bg-purple-100 text-purple-700' 
                        : user.role === 'Editor'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">{user.lastActive}</td>
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
    </div>
  );
};

export default Users;
