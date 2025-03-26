
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import PageTransition from "./components/layout/PageTransition";
import { useEffect } from "react";
import ScrollProgressBar from "./components/ui/ScrollProgressBar";
import Chatbot from "./components/ui/Chatbot";
import InPlaceEditor from "./components/editor/InPlaceEditor";

// Import individual service pages
import FiberServicePage from "./pages/service/Fiber";
import StructuredCablingPage from "./pages/service/Structured";
import WirelessPage from "./pages/service/Wireless";
import PointToPointPage from "./pages/service/PointToPoint";
import NetworkPage from "./pages/service/Network";
import MaintenancePage from "./pages/service/Maintenance";

// Import admin pages
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPages from "./pages/admin/Pages";
import AdminMedia from "./pages/admin/Media";
import AdminUsers from "./pages/admin/Users";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Update document title based on current page
    let pageTitle = "Infi-NET LLC | Fiber & Low-Voltage Solutions";
    
    if (pathname === "/about") {
      pageTitle = "About Us | Infi-NET LLC";
    } else if (pathname === "/services") {
      pageTitle = "Our Services | Infi-NET LLC";
    } else if (pathname === "/projects") {
      pageTitle = "Our Projects | Infi-NET LLC";
    } else if (pathname === "/contact") {
      pageTitle = "Contact Us | Infi-NET LLC";
    } else if (pathname.includes("/service/")) {
      const service = pathname.split("/").pop();
      if (service) {
        pageTitle = `${service.charAt(0).toUpperCase() + service.slice(1)} Services | Infi-NET LLC`;
      }
    } else if (pathname.includes("/admin")) {
      pageTitle = "Admin Dashboard | Conquering Local CMS";
    } else if (pathname === "/edit") {
      pageTitle = "Edit Mode | Infi-NET LLC";
    }
    
    document.title = pageTitle;
  }, [pathname]);
  
  return null;
};

// Enhanced PageWrapper component to handle edit mode
const PageWrapper = ({ Component }: { Component: React.ComponentType<any> }) => {
  const location = useLocation();
  
  // Check if we're in edit mode by looking for /edit at the end of the path or if it's exactly '/edit'
  const isEditMode = location.pathname === '/edit' || location.pathname.endsWith('/edit');
  
  // Get the base path without /edit for component rendering
  // Special case for root path - '/edit' should render the Index component
  const basePath = location.pathname === '/edit' 
    ? '/' 
    : isEditMode 
      ? location.pathname.slice(0, -5) 
      : location.pathname;
  
  useEffect(() => {
    // Log the current path and edit mode status
    console.log('Current path:', location.pathname);
    console.log('Edit mode:', isEditMode);
    console.log('Base path for rendering:', basePath);
  }, [location.pathname, isEditMode, basePath]);
  
  return (
    <>
      <Component />
      <InPlaceEditor isEnabled={isEditMode} />
    </>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  
  // Determine if we're in edit mode
  const isEditMode = location.pathname === '/edit' || location.pathname.endsWith('/edit');
  
  // For all paths, we need to get the base path for route matching
  // For the root edit path ('/edit'), we want to match the '/' route
  const basePath = location.pathname === '/edit'
    ? '/'
    : isEditMode
      ? location.pathname.slice(0, -5)
      : location.pathname;
      
  console.log('AppRoutes - basePath:', basePath);
    
  return (
    <PageTransition>
      <Routes location={basePath}>
        <Route path="/" element={<PageWrapper Component={Index} />} />
        <Route path="/about" element={<PageWrapper Component={About} />} />
        <Route path="/services" element={<PageWrapper Component={Services} />} />
        <Route path="/projects" element={<PageWrapper Component={Projects} />} />
        <Route path="/contact" element={<PageWrapper Component={Contact} />} />
        
        {/* Individual service routes */}
        <Route path="/service/fiber" element={<PageWrapper Component={FiberServicePage} />} />
        <Route path="/service/structured" element={<PageWrapper Component={StructuredCablingPage} />} />
        <Route path="/service/wireless" element={<PageWrapper Component={WirelessPage} />} />
        <Route path="/service/ptp" element={<PageWrapper Component={PointToPointPage} />} />
        <Route path="/service/network" element={<PageWrapper Component={NetworkPage} />} />
        <Route path="/service/maintenance" element={<PageWrapper Component={MaintenancePage} />} />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
          {/* Redirect /admin to /admin/dashboard */}
          <Route path="" element={<AdminDashboard />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollProgressBar />
        <ScrollToTop />
        <AppRoutes />
        <Chatbot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
