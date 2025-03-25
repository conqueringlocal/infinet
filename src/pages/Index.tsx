
import React, { useEffect } from 'react';
import Hero from '@/components/home/Hero';
import AboutPreview from '@/components/home/AboutPreview';
import ServicesSection from '@/components/home/ServicesSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import ProjectsPreview from '@/components/home/ProjectsPreview';
import CtaSection from '@/components/home/CtaSection';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ServiceFinder from '@/components/home/ServiceFinder';
import NationwideService from '@/components/home/NationwideService';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Infi-NET LLC | Fiber & Low-Voltage Solutions You Can Trust";
    
    // Initialize intersection observer for revealing elements on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all elements with the 'reveal' class
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      // Clean up the observer
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <AboutPreview />
        <ServicesSection />
        <NationwideService />
        <ServiceFinder />
        <WhyChooseUs />
        <ProjectsPreview />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
