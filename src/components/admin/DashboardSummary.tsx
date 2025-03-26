
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Eye, Clock, ArrowRight, Image } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardSummaryProps {
  stats: {
    totalPages: number;
    totalMediaAssets: number;
    totalUsers: number;
    totalPageViews: number;
    lastUpdate: string;
  };
  isLoading: boolean;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ stats, isLoading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardDescription className="text-gray-500">Media Assets</CardDescription>
              <CardTitle className="text-3xl font-bold mt-2">
                {isLoading ? '...' : stats.totalMediaAssets}
              </CardTitle>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Image className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <Link to="/admin/media" className="text-sm font-medium text-[#003366] flex items-center mt-4 hover:underline">
            View details 
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardDescription className="text-gray-500">Users</CardDescription>
              <CardTitle className="text-3xl font-bold mt-2">
                {isLoading ? '...' : stats.totalUsers}
              </CardTitle>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <Link to="/admin/users" className="text-sm font-medium text-[#003366] flex items-center mt-4 hover:underline">
            View details 
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardDescription className="text-gray-500">Site Traffic</CardDescription>
              <CardTitle className="text-3xl font-bold mt-2">
                {isLoading ? '...' : stats.totalPageViews.toLocaleString()}
              </CardTitle>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <Eye className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div className="text-sm font-medium text-[#003366] flex items-center mt-4 hover:underline">
            View details 
            <ArrowRight className="h-4 w-4 ml-1" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardDescription className="text-gray-500">Last Updated</CardDescription>
              <CardTitle className="text-2xl font-bold mt-2">
                {isLoading ? '...' : (
                  new Date(stats.lastUpdate).toLocaleDateString(undefined, { 
                    month: 'short', 
                    day: 'numeric' 
                  })
                )}
              </CardTitle>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;
