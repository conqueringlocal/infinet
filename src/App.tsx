
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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

// Import individual service pages
import FiberServicePage from "./pages/service/Fiber";
import StructuredCablingPage from "./pages/service/Structured";
import WirelessPage from "./pages/service/Wireless";
import PointToPointPage from "./pages/service/PointToPoint";
import NetworkPage from "./pages/service/Network";
import MaintenancePage from "./pages/service/Maintenance";

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
    }
    
    document.title = pageTitle;
  }, [pathname]);
  
  return null;
};

const AppRoutes = () => {
  return (
    <PageTransition>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Individual service routes */}
        <Route path="/service/fiber" element={<FiberServicePage />} />
        <Route path="/service/structured" element={<StructuredCablingPage />} />
        <Route path="/service/wireless" element={<WirelessPage />} />
        <Route path="/service/ptp" element={<PointToPointPage />} />
        <Route path="/service/network" element={<NetworkPage />} />
        <Route path="/service/maintenance" element={<MaintenancePage />} />
        
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
