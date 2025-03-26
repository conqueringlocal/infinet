
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Eye, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardSummaryProps {
  stats: {
    totalPages: number;
    totalUsers: number;
    totalPageViews: number;
    lastUpdate: string;
  };
  isLoading: boolean;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ stats, isLoading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Link to="/admin/pages" className="block">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardDescription>Total Pages</CardDescription>
                <CardTitle className="text-2xl font-bold mt-2">
                  {isLoading ? '...' : stats.totalPages}
                </CardTitle>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
      
      <Link to="/admin/users" className="block">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardDescription>Users</CardDescription>
                <CardTitle className="text-2xl font-bold mt-2">
                  {isLoading ? '...' : stats.totalUsers}
                </CardTitle>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardDescription>Page Views</CardDescription>
              <CardTitle className="text-2xl font-bold mt-2">
                {isLoading ? '...' : stats.totalPageViews}
              </CardTitle>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardDescription>Last Updated</CardDescription>
              <CardTitle className="text-2xl font-bold mt-2">
                {isLoading ? '...' : (
                  new Date(stats.lastUpdate).toLocaleDateString(undefined, { 
                    month: 'short', 
                    day: 'numeric' 
                  })
                )}
              </CardTitle>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;
