
import React, { useEffect } from 'react';
import Hero from '@/components/home/Hero';
import ServicesSection from '@/components/home/ServicesSection';
import AboutPreview from '@/components/home/AboutPreview';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import ProjectsPreview from '@/components/home/ProjectsPreview';
import CtaSection from '@/components/home/CtaSection';
import FiberInfo from '@/components/home/FiberInfo';
import NationwideService from '@/components/home/NationwideService';
import ServiceFinder from '@/components/home/ServiceFinder';
import { useSEO } from '@/hooks/use-seo';
import { usePerformance, preloadRoutes } from '@/hooks/use-performance';
import { usePageView } from '@/hooks/use-page-view';

const Index = () => {
  // Track page view for analytics
  usePageView();
  
  // Set SEO metadata for the home page
  useSEO({
    title: 'Infi-NET LLC | Fiber & Low-Voltage Infrastructure Solutions',
    description: 'High-quality fiber optic and low-voltage installation services from certified specialists. Serving businesses nationwide with reliable network infrastructure.',
    keywords: 'fiber optic installation, low voltage solutions, structured cabling, data center solutions, network infrastructure, IT services',
    ogType: 'website'
  });
  
  // Apply performance optimizations
  usePerformance();
  
  // Preload critical routes
  useEffect(() => {
    preloadRoutes(['/services', '/about', '/contact', '/projects']);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <ServicesSection />
      <ServiceFinder />
      <AboutPreview />
      <WhyChooseUs />
      <FiberInfo />
      <NationwideService />
      <ProjectsPreview />
      <CtaSection />
    </div>
  );
};

export default Index;
