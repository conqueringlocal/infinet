
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { FileText, ArrowRight, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import DashboardSummary from '@/components/admin/DashboardSummary';
import { supabase } from '@/lib/supabase';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import PageAnalyticsComponent from '@/components/admin/PageAnalytics';
import { getAllUserProfiles } from '@/lib/user-service';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPages: 0,
    totalMediaAssets: 0,
    totalUsers: 0,
    totalPageViews: 0,
    lastUpdate: new Date().toISOString(),
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [recentEdits, setRecentEdits] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Fetch real data
        const [mediaResult, usersData, analyticsData, pageEditsResult] = await Promise.all([
          // Get total media assets
          supabase.storage.from('media').list(),
          // Get user profiles
          getAllUserProfiles(),
          // Get analytics data
          supabase.from('page_analytics').select('*'),
          // Get recent edits
          supabase.from('page_content')
            .select('id, page_path, updated_at, updated_by')
            .order('updated_at', { ascending: false })
            .limit(5)
        ]);
        
        // Get total page views
        let totalViews = 0;
        if (analyticsData.data) {
          totalViews = analyticsData.data.reduce((sum, item) => sum + (item.view_count || 0), 0);
        }
        
        // Get most recent update timestamp
        let lastUpdateDate = new Date().toISOString();
        if (pageEditsResult.data && pageEditsResult.data.length > 0) {
          lastUpdateDate = pageEditsResult.data[0].updated_at;
        }
        
        // Process recent edits
        const recentEditsData = [];
        if (pageEditsResult.data) {
          for (const edit of pageEditsResult.data) {
            // Format page path for display
            const pageName = edit.page_path === '/' 
              ? 'Home Page' 
              : edit.page_path.replace(/^\/|\/$/g, '').replace(/-/g, ' ');
              
            // Format time difference
            const editDate = new Date(edit.updated_at);
            const timeDiff = getTimeDifference(editDate);
            
            recentEditsData.push({
              page: pageName.charAt(0).toUpperCase() + pageName.slice(1),
              user: edit.updated_by || 'Admin',
              date: timeDiff
            });
          }
        }
        
        // Update state with actual data
        setStats({
          totalPages: 7, // Fixed number of main site pages
          totalMediaAssets: mediaResult.data ? mediaResult.data.length : 0,
          totalUsers: usersData ? usersData.length : 0,
          totalPageViews: totalViews,
          lastUpdate: lastUpdateDate,
        });
        
        setRecentEdits(recentEditsData.length > 0 ? recentEditsData : [
          { page: "Home Page", user: "Admin", date: "2 hours ago" },
          { page: "About Us", user: "Admin", date: "Yesterday" },
          { page: "Services", user: "Jane Smith", date: "3 days ago" }
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  // Helper function to format time difference
  const getTimeDifference = (date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return diffMins === 1 ? '1 minute ago' : `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

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
      
      <PageAnalyticsComponent />
    </div>
  );
};

export default Dashboard;
