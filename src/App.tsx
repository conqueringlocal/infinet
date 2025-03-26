
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

// This component determines if we're in edit mode
const PageWithEditor = () => {
  const location = useLocation();
  const isEditMode = location.pathname === '/edit' || location.pathname.endsWith('/edit');
  
  console.log('====== APP ROUTING ======');
  console.log('Current URL path:', location.pathname);
  console.log('Is edit mode enabled?', isEditMode);
  
  // Get the corresponding normal route for this edit route
  const getNormalRoute = () => {
    if (location.pathname === '/edit') return '/';
    if (location.pathname.endsWith('/edit')) {
      return location.pathname.slice(0, -5);
    }
    return location.pathname;
  };
  
  const normalRoute = getNormalRoute();
  console.log('Normal route equivalent:', normalRoute);
  
  // Function to render the appropriate component based on the route
  const renderComponent = () => {
    // Strip "/edit" suffix if present to determine which page to render
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
      case '/service/maintenance': return <MaintenancePage />;
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
  return (
    <PageTransition>
      <Routes>
        {/* Regular routes */}
        <Route path="/" element={<PageWithEditor />} />
        <Route path="/about" element={<PageWithEditor />} />
        <Route path="/services" element={<PageWithEditor />} />
        <Route path="/projects" element={<PageWithEditor />} />
        <Route path="/contact" element={<PageWithEditor />} />
        <Route path="/service/fiber" element={<PageWithEditor />} />
        <Route path="/service/structured" element={<PageWithEditor />} />
        <Route path="/service/wireless" element={<PageWithEditor />} />
        <Route path="/service/ptp" element={<PageWithEditor />} />
        <Route path="/service/network" element={<PageWithEditor />} />
        <Route path="/service/maintenance" element={<PageWithEditor />} />
        
        {/* Edit mode routes */}
        <Route path="/edit" element={<PageWithEditor />} />
        <Route path="/:page/edit" element={<PageWithEditor />} />
        <Route path="/service/:service/edit" element={<PageWithEditor />} />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
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
