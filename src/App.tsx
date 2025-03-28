
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
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
import { usePageView } from "./hooks/use-page-view";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Import individual service pages
import FiberServicePage from "./pages/service/Fiber";
import StructuredCablingPage from "./pages/service/Structured";
import WirelessPage from "./pages/service/Wireless";
import PointToPointPage from "./pages/service/PointToPoint";
import NetworkPage from "./pages/service/Network";
import UndergroundServicePage from "./pages/service/Underground";

// Import admin pages
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminMedia from "./pages/admin/Media";
import AdminUsers from "./pages/admin/Users";
import AdminSettings from "./pages/admin/Settings";
import SetupPage from '@/components/admin/SetupPage';

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
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
    } else if (pathname === "/edit" || pathname.endsWith("/edit")) {
      pageTitle = "Edit Mode | Infi-NET LLC";
    }
    
    document.title = pageTitle;
  }, [pathname]);
  
  return null;
};

const PageContent = () => {
  const location = useLocation();
  const isEditMode = location.pathname === '/edit' || location.pathname.endsWith('/edit');
  
  usePageView();
  
  console.log('====== APP ROUTING ======');
  console.log('Current URL path:', location.pathname);
  console.log('Is edit mode enabled?', isEditMode);
  
  const getNormalRoute = () => {
    if (location.pathname === '/edit') return '/';
    if (location.pathname.endsWith('/edit')) {
      return location.pathname.slice(0, -5);
    }
    return location.pathname;
  };
  
  const normalRoute = getNormalRoute();
  console.log('Normal route equivalent:', normalRoute);
  
  useEffect(() => {
    try {
      const sessionContent = sessionStorage.getItem('page_content');
      if (sessionContent && !localStorage.getItem('page_content')) {
        localStorage.setItem('page_content', sessionContent);
        console.log('Restored content from session storage');
      }
    } catch (e) {
      console.error('Error restoring content from session storage', e);
    }
  }, [location.pathname]);
  
  const renderComponent = () => {
    switch (normalRoute) {
      case '/': return <Index />;
      case '/about': return <About />;
      case '/services': return <Services />;
      case '/projects': return <Projects />;
      case '/contact': return <Contact />;
      case '/service/fiber': return <FiberServicePage />;
      case '/service/structured': return <StructuredCablingPage />;
      case '/service/wireless': return <WirelessPage />;
      case '/service/ptp': return <PointToPointPage />;
      case '/service/network': return <NetworkPage />;
      case '/service/underground': return <UndergroundServicePage />;
      default: return <NotFound />;
    }
  };
  
  return (
    <>
      {renderComponent()}
      <InPlaceEditor isEnabled={isEditMode} />
    </>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Only render Navbar and Footer for non-admin routes
  if (isAdminRoute) {
    return (
      <PageTransition>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/setup" element={<SetupPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </PageTransition>
    );
  }
  
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <PageTransition>
          <Routes>
            <Route path="/" element={<PageContent />} />
            <Route path="/about" element={<PageContent />} />
            <Route path="/services" element={<PageContent />} />
            <Route path="/projects" element={<PageContent />} />
            <Route path="/contact" element={<PageContent />} />
            <Route path="/service/fiber" element={<PageContent />} />
            <Route path="/service/structured" element={<PageContent />} />
            <Route path="/service/wireless" element={<PageContent />} />
            <Route path="/service/ptp" element={<PageContent />} />
            <Route path="/service/network" element={<PageContent />} />
            <Route path="/service/underground" element={<PageContent />} />
            
            <Route path="/edit" element={<PageContent />} />
            <Route path="/:page/edit" element={<PageContent />} />
            <Route path="/service/:service/edit" element={<PageContent />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </div>
      <Footer />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
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
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
