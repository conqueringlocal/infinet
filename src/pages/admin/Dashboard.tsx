
import React from 'react';
import { Card } from '@/components/ui/card';
import { FileText, Image, Users, Globe, ArrowRight, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const stats = [
    {
      title: "Pages",
      value: "7",
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
      link: "/admin/pages"
    },
    {
      title: "Media Assets",
      value: "23",
      icon: Image,
      color: "bg-purple-100 text-purple-600",
      link: "/admin/media"
    },
    {
      title: "Users",
      value: "3",
      icon: Users,
      color: "bg-green-100 text-green-600",
      link: "/admin/users"
    },
    {
      title: "Site Traffic",
      value: "1.2k",
      icon: Globe,
      color: "bg-amber-100 text-amber-600",
      link: "/admin/analytics"
    }
  ];

  const recentEdits = [
    { page: "Home Page", user: "Admin", date: "2 hours ago" },
    { page: "About Us", user: "Admin", date: "Yesterday" },
    { page: "Services", user: "Jane Smith", date: "3 days ago" }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="hidden md:flex"
            onClick={() => window.open('/', '_blank')}
          >
            <Globe className="h-4 w-4 mr-2" />
            View Site
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <Link to={stat.link} className="text-sm font-medium text-[#003366] flex items-center mt-4 hover:underline">
              View details 
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Edits</h2>
          <div className="space-y-4">
            {recentEdits.map((edit, index) => (
              <div key={index} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-800">{edit.page}</p>
                  <p className="text-sm text-gray-500">Edited by {edit.user}</p>
                </div>
                <span className="text-sm text-gray-500">{edit.date}</span>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="mt-4 text-[#003366]">
            View all activity
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Edit Home Page
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Image className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Site Settings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
