
import React, { useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarHeaderTitle,
  SidebarNav,
  SidebarNavHeader,
  SidebarNavTitle,
  SidebarNavItems,
  SidebarNavItem,
  SidebarFooter
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  Settings, 
  LogOut, 
  Users, 
  Globe,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  // Check if user is authenticated - skip check for setup page
  useEffect(() => {
    const isSetupPage = location.pathname === '/admin/setup';
    const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
    
    if (!isAuthenticated && !isSetupPage) {
      navigate('/admin/login');
    }
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/admin/login');
  };

  // If on setup page, render only the setup component without the admin layout
  if (location.pathname === '/admin/setup') {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar onLogout={handleLogout} />
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/82c5769b-887a-49f8-a103-392bb5e996d5.png" 
            alt="Conquering Local" 
            className="h-8" 
          />
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <AdminSidebar onLogout={handleLogout} />
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        <div className="md:p-8 p-4 pt-16 md:pt-8 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

type AdminSidebarProps = {
  onLogout: () => void;
};

const AdminSidebar = ({ onLogout }: AdminSidebarProps) => {
  return (
    <Sidebar className="fixed inset-y-0 left-0 z-50 w-64 border-r border-sidebar-border bg-[#003366] text-white shadow">
      <SidebarHeader className="p-4 border-b border-blue-800">
        <SidebarHeaderTitle>
          <div className="flex items-center justify-center">
            <img 
              src="/lovable-uploads/82c5769b-887a-49f8-a103-392bb5e996d5.png" 
              alt="Conquering Local" 
              className="h-10 w-auto"
            />
          </div>
        </SidebarHeaderTitle>
      </SidebarHeader>
      
      <SidebarNav>
        <SidebarNavHeader>
          <SidebarNavTitle className="text-xs font-medium text-blue-200">
            Content Management
          </SidebarNavTitle>
        </SidebarNavHeader>
        
        <SidebarNavItems>
          <SidebarNavItem href="/admin/dashboard" title="Dashboard" icon={<LayoutDashboard className="h-4 w-4" />} />
          <SidebarNavItem href="/admin/pages" title="Pages" icon={<FileText className="h-4 w-4" />} />
          <SidebarNavItem href="/admin/media" title="Media" icon={<Image className="h-4 w-4" />} />
          <SidebarNavItem href="/admin/users" title="Users" icon={<Users className="h-4 w-4" />} />
          <SidebarNavItem href="/admin/settings" title="Settings" icon={<Settings className="h-4 w-4" />} />
        </SidebarNavItems>
        
        <div className="mt-6">
          <SidebarNavHeader>
            <SidebarNavTitle className="text-xs font-medium text-blue-200">
              Website
            </SidebarNavTitle>
          </SidebarNavHeader>
          
          <SidebarNavItems>
            <SidebarNavItem 
              href="/" 
              external
              title="View Site" 
              icon={<Globe className="h-4 w-4" />} 
            />
            <SidebarNavItem 
              title="Logout" 
              icon={<LogOut className="h-4 w-4" />}
              disabled={false}
              active={false}
              onClick={onLogout}
            />
          </SidebarNavItems>
        </div>
      </SidebarNav>
      
      <SidebarFooter className="border-t border-blue-800 p-4">
        <div className="text-xs text-center text-blue-200">
          Conquering Local CMS v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminLayout;
