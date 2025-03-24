
import React, { useEffect } from 'react';
import Hero from '@/components/home/Hero';
import AboutPreview from '@/components/home/AboutPreview';
import ServicesSection from '@/components/home/ServicesSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import ProjectsPreview from '@/components/home/ProjectsPreview';
import CtaSection from '@/components/home/CtaSection';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import ServiceFinder from '@/components/home/ServiceFinder';
import Fiber3DModel from '@/components/home/Fiber3DModel';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Infi-Net LLC | Fiber & Low-Voltage Solutions You Can Trust";
    
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
      <div className="fixed top-5 right-5 z-50">
        <ThemeToggle />
      </div>
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <AboutPreview />
        <div className="py-16 md:py-24 bg-infinet-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="reveal text-sm font-semibold text-infinet-600 dark:text-infinet-400 uppercase tracking-wider">Interactive 3D Model</span>
              <h2 className="reveal text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">
                Explore Fiber Optic Technology
              </h2>
              <p className="reveal text-gray-600 dark:text-gray-300 mt-4 text-lg">
                Interact with our 3D fiber optic model to visualize the technology that powers our high-speed connectivity solutions.
              </p>
            </div>
            <div className="reveal max-w-4xl mx-auto">
              <Fiber3DModel />
            </div>
          </div>
        </div>
        <ServicesSection />
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
