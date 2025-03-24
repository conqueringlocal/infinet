
import React, { useEffect } from 'react';
import Hero from '@/components/home/Hero';
import AboutPreview from '@/components/home/AboutPreview';
import ServicesSection from '@/components/home/ServicesSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import ProjectsPreview from '@/components/home/ProjectsPreview';
import CtaSection from '@/components/home/CtaSection';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Infi-Net LLC | Fiber & Low-Voltage Solutions You Can Trust";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <AboutPreview />
        <ServicesSection />
        <WhyChooseUs />
        <ProjectsPreview />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
