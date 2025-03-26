
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { FileText, Image, Users, Globe, ArrowRight, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import DashboardSummary from '@/components/admin/DashboardSummary';
import { supabase } from '@/lib/supabase';
import { InteractiveCard } from '@/components/ui/InteractiveCard';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPages: 7,
    totalMediaAssets: 23,
    totalUsers: 3,
    totalPageViews: 1200,
    lastUpdate: new Date().toISOString(),
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [recentEdits, setRecentEdits] = useState([
    { page: "Home Page", user: "Admin", date: "2 hours ago" },
    { page: "About Us", user: "Admin", date: "Yesterday" },
    { page: "Services", user: "Jane Smith", date: "3 days ago" }
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // We could fetch real data from Supabase here
        // For now, just simulate loading
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
        
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
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
      
      <DashboardSummary stats={stats} isLoading={isLoading} />
      
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
            <Link to="/" className="block w-full">
              <InteractiveCard 
                className="flex items-center p-4 w-full"
                variant="outline"
                hoverEffect="lift"
              >
                <FileText className="h-4 w-4 mr-2 text-[#003366]" />
                <span>Edit Home Page</span>
              </InteractiveCard>
            </Link>
            
            <Link to="/admin/media" className="block w-full">
              <InteractiveCard 
                className="flex items-center p-4 w-full"
                variant="outline"
                hoverEffect="lift"
              >
                <Image className="h-4 w-4 mr-2 text-[#003366]" />
                <span>Upload Media</span>
              </InteractiveCard>
            </Link>
            
            <Link to="/admin/users" className="block w-full">
              <InteractiveCard 
                className="flex items-center p-4 w-full"
                variant="outline"
                hoverEffect="lift"
              >
                <Users className="h-4 w-4 mr-2 text-[#003366]" />
                <span>Manage Users</span>
              </InteractiveCard>
            </Link>
            
            <Link to="/admin/settings" className="block w-full">
              <InteractiveCard 
                className="flex items-center p-4 w-full"
                variant="outline"
                hoverEffect="lift"
              >
                <Settings className="h-4 w-4 mr-2 text-[#003366]" />
                <span>Site Settings</span>
              </InteractiveCard>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
