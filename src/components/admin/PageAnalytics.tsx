
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAllPagesAnalytics, getPopularPages, PageAnalytics } from '@/lib/analytics-service';
import { Skeleton } from '@/components/ui/skeleton';
import { Info } from 'lucide-react';

const PageAnalyticsComponent = () => {
  const [analyticsData, setAnalyticsData] = useState<PageAnalytics[]>([]);
  const [popularPages, setPopularPages] = useState<PageAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('week');

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        const [allPages, topPages] = await Promise.all([
          getAllPagesAnalytics(),
          getPopularPages(5)
        ]);
        
        setAnalyticsData(allPages);
        setPopularPages(topPages);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAnalytics();
  }, [timeframe]);

  // Format data for charts
  const pageViewData = analyticsData.map(page => ({
    name: page.page_path.replace(/^\/|\/$/g, '') || 'Home',
    views: page.view_count,
    visitors: page.unique_visitors
  }));

  // Sort popular pages for the table
  const sortedPopularPages = [...popularPages].sort((a, b) => b.view_count - a.view_count);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Page Analytics</CardTitle>
        <CardDescription>View visitor statistics and page performance</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="pages">Popular Pages</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-2">
              <select 
                className="text-sm border rounded-md px-2 py-1"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="day">Last 24 Hours</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
          
          <TabsContent value="overview" className="pt-2">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : pageViewData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pageViewData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#003366" name="Total Views" />
                    <Bar dataKey="visitors" fill="#33C3F0" name="Unique Visitors" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] border rounded-md bg-gray-50">
                <div className="text-center text-gray-500">
                  <Info className="mx-auto h-10 w-10 text-gray-400" />
                  <p className="mt-2">No analytics data available yet.</p>
                  <p className="text-sm">Data will appear as visitors browse your site.</p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pages">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : sortedPopularPages.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left font-medium">Page</th>
                      <th className="py-2 px-4 text-right font-medium">Views</th>
                      <th className="py-2 px-4 text-right font-medium">Unique Visitors</th>
                      <th className="py-2 px-4 text-right font-medium">Last Viewed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPopularPages.map((page, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 text-left">
                          {page.page_path === '/' ? 'Home' : page.page_path.replace(/^\/|\/$/g, '')}
                        </td>
                        <td className="py-2 px-4 text-right">{page.view_count}</td>
                        <td className="py-2 px-4 text-right">{page.unique_visitors}</td>
                        <td className="py-2 px-4 text-right">
                          {new Date(page.last_viewed_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 border rounded-md bg-gray-50">
                <div className="text-center text-gray-500">
                  <Info className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2">No page views recorded yet</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PageAnalyticsComponent;
