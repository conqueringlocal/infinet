import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Hero from '@/components/home/Hero';
import AboutPreview from '@/components/home/AboutPreview';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import ProjectsPreview from '@/components/home/ProjectsPreview';
import CtaSection from '@/components/home/CtaSection';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ServiceFinder from '@/components/home/ServiceFinder';
import NationwideService from '@/components/home/NationwideService';
import EditableContent from '@/components/editor/EditableContent';

// Export components for use in page editor
export const HomePageComponents = {
  Hero,
  AboutPreview,
  WhyChooseUs,
  ProjectsPreview,
  CtaSection,
  ServiceFinder,
  NationwideService
};

// Enhanced Hero component with editable content
const EditableHero = () => {
  return (
    <div className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-br from-gray-50 to-infinet-50">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-infinetYellow-400 to-infinet-500"></div>
      <div className="absolute bottom-0 right-0 w-full h-full max-w-3xl -z-10 opacity-10 translate-x-1/4">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#15cadb" d="M53.6,-65.3C67.6,-53.1,76.3,-34.6,79.7,-15.3C83.1,4,81.2,24.2,71.8,39.4C62.3,54.5,45.3,64.6,27.7,70C10.2,75.3,-7.9,75.9,-25.6,71.1C-43.4,66.3,-60.8,56.1,-70.1,40.7C-79.3,25.3,-80.4,4.7,-77,-15.4C-73.7,-35.5,-65.8,-55,-51.2,-67.2C-36.6,-79.4,-15.3,-84.3,2.6,-87.4C20.6,-90.5,39.6,-77.6,53.6,-65.3Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-8">
            {/* Tagline Chip */}
            <EditableContent id="hero-tagline" tag="div" className="reveal inline-block bg-infinetYellow-200 text-gray-800 px-4 py-1 rounded-full text-sm font-medium mb-6">
              Fiber & Low-Voltage Solutions You Can Trust
            </EditableContent>
            
            {/* Main Headline */}
            <EditableContent id="hero-headline" tag="h1" className="reveal text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight md:leading-tight lg:leading-tight text-balance">
              Building the Infrastructure <br className="hidden md:block" />
              <span className="text-infinet-600">for Tomorrow's Connectivity</span>
            </EditableContent>
            
            {/* Subheadline */}
            <EditableContent id="hero-subheadline" tag="p" className="reveal text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              With over 35 years of combined experience, we deliver high-quality fiber optic and low-voltage installations that meet the highest industry standards.
            </EditableContent>
            
            {/* CTA Buttons */}
            <div className="reveal flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Button size="lg" variant="default" onClick={() => window.location.href = '/contact'}>
                <EditableContent id="hero-cta-primary" tag="span">
                  Get in Touch
                </EditableContent>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="accent" size="lg" onClick={() => window.location.href = '/services'}>
                <EditableContent id="hero-cta-secondary" tag="span">
                  Explore Our Services
                </EditableContent>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Edit AboutPreview component to make it fully editable
const EditableAboutPreview = () => {
  return (
    <section className="py-16 px-4 md:py-24">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <EditableContent 
              id="about-section-image" 
              type="image" 
              imageSrc="/lovable-uploads/f3e6c9f7-b849-4255-84ee-0d5681586a86.png"
              imageAlt="About Infi-NET" 
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
          
          <div className="order-1 md:order-2">
            <div className="space-y-6">
              <EditableContent id="about-section-title" tag="span" className="text-sm font-semibold text-infinet-600 uppercase tracking-wider">
                About Infi-NET
              </EditableContent>
              
              <EditableContent id="about-section-heading" tag="h2" className="text-3xl md:text-4xl font-bold text-gray-900">
                Leading Provider of Fiber & Low Voltage Solutions
              </EditableContent>
              
              <EditableContent id="about-section-description" tag="p" className="text-lg text-gray-600">
                We bring over 35 years of combined experience to every project. Based in Lakeland, Florida, we specialize in fiber optic installations, low-voltage data cabling, and point-to-point applications for businesses across industries.
              </EditableContent>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-infinetYellow-100 flex items-center justify-center mt-1">
                    <span className="text-infinet-600 font-bold">✓</span>
                  </div>
                  <EditableContent id="about-bullet-1" tag="p" className="ml-3 text-gray-500">
                    Certified fiber optic specialists with extensive field experience
                  </EditableContent>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-infinetYellow-100 flex items-center justify-center mt-1">
                    <span className="text-infinet-600 font-bold">✓</span>
                  </div>
                  <EditableContent id="about-bullet-2" tag="p" className="ml-3 text-gray-500">
                    Client-first approach with customized solutions for every project
                  </EditableContent>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-infinetYellow-100 flex items-center justify-center mt-1">
                    <span className="text-infinet-600 font-bold">✓</span>
                  </div>
                  <EditableContent id="about-bullet-3" tag="p" className="ml-3 text-gray-500">
                    Commitment to quality, safety, and industry best practices
                  </EditableContent>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  className="group"
                  variant="outline"
                  onClick={() => window.location.href = '/about'}
                >
                  <EditableContent id="about-cta-button" tag="span">
                    Learn More About Us
                  </EditableContent>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Edit ServiceFinder component to make it fully editable
const EditableServiceFinder = () => {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl text-center">
        <EditableContent id="service-finder-section-title" tag="span" className="text-sm font-semibold text-infinet-600 uppercase tracking-wider">
          FIND YOUR SOLUTION
        </EditableContent>
        
        <EditableContent id="service-finder-heading" tag="h2" className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 max-w-3xl mx-auto">
          Discover the Perfect Service for Your Needs
        </EditableContent>
        
        <EditableContent id="service-finder-description" tag="p" className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          We offer a wide range of connectivity solutions. Explore our services to find the perfect match for your requirements.
        </EditableContent>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
            <div className="text-infinet-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M2 12h20M7 17l5-5 5 5M7 7l5 5 5-5" />
              </svg>
            </div>
            <EditableContent id="service-finder-fiber-title" tag="h3" className="text-xl font-semibold mb-2">
              Fiber Optic Installation
            </EditableContent>
            <EditableContent id="service-finder-fiber-desc" tag="p" className="text-gray-500 mb-4">
              High-speed data transmission solutions for businesses of all sizes with industry-leading quality.
            </EditableContent>
            <Button 
              variant="link"
              className="text-infinet-600 hover:text-infinet-700 group p-0"
              onClick={() => window.location.href = '/service/fiber'}
            >
              <EditableContent id="service-finder-fiber-cta" tag="span">
                Learn More
              </EditableContent>
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
            <div className="text-infinet-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="2" />
                <path d="M7 12h10M12 7v10" />
              </svg>
            </div>
            <EditableContent id="service-finder-structured-title" tag="h3" className="text-xl font-semibold mb-2">
              Structured Cabling
            </EditableContent>
            <EditableContent id="service-finder-structured-desc" tag="p" className="text-gray-500 mb-4">
              Comprehensive infrastructure solutions for voice, data, video, and building management systems.
            </EditableContent>
            <Button 
              variant="link"
              className="text-infinet-600 hover:text-infinet-700 group p-0"
              onClick={() => window.location.href = '/service/structured'}
            >
              <EditableContent id="service-finder-structured-cta" tag="span">
                Learn More
              </EditableContent>
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
            <div className="text-infinet-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <EditableContent id="service-finder-wireless-title" tag="h3" className="text-xl font-semibold mb-2">
              Wireless Solutions
            </EditableContent>
            <EditableContent id="service-finder-wireless-desc" tag="p" className="text-gray-500 mb-4">
              Enterprise-grade WiFi networks with complete coverage, security, and performance.
            </EditableContent>
            <Button 
              variant="link"
              className="text-infinet-600 hover:text-infinet-700 group p-0"
              onClick={() => window.location.href = '/service/wireless'}
            >
              <EditableContent id="service-finder-wireless-cta" tag="span">
                Learn More
              </EditableContent>
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Editable WhyChooseUs component
const EditableWhyChooseUs = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <EditableContent id="why-choose-title" tag="span" className="text-sm font-semibold text-infinet-600 uppercase tracking-wider">
            WHY CHOOSE US
          </EditableContent>
          
          <EditableContent id="why-choose-heading" tag="h2" className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
            The Infi-NET Advantage
          </EditableContent>
          
          <EditableContent id="why-choose-description" tag="p" className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            We set ourselves apart through our commitment to quality, expertise, and customer satisfaction.
          </EditableContent>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-infinetYellow-100 flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-infinet-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <EditableContent id="advantage-1-title" tag="h3" className="text-xl font-semibold text-gray-900">
                Industry Expertise
              </EditableContent>
            </div>
            <EditableContent id="advantage-1-desc" tag="p" className="text-gray-600">
              Our team brings decades of combined experience and specialized knowledge of the latest technologies and best practices.
            </EditableContent>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-infinetYellow-100 flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-infinet-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <EditableContent id="advantage-2-title" tag="h3" className="text-xl font-semibold text-gray-900">
                Quality Assurance
              </EditableContent>
            </div>
            <EditableContent id="advantage-2-desc" tag="p" className="text-gray-600">
              We maintain rigorous quality controls throughout every project, ensuring installations meet or exceed industry standards.
            </EditableContent>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-infinetYellow-100 flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-infinet-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <EditableContent id="advantage-3-title" tag="h3" className="text-xl font-semibold text-gray-900">
                Nationwide Coverage
              </EditableContent>
            </div>
            <EditableContent id="advantage-3-desc" tag="p" className="text-gray-600">
              With our headquarters in Florida and nationwide capabilities, we can service clients across the country.
            </EditableContent>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-infinetYellow-100 flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-infinet-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <EditableContent id="advantage-4-title" tag="h3" className="text-xl font-semibold text-gray-900">
                Certified Technicians
              </EditableContent>
            </div>
            <EditableContent id="advantage-4-desc" tag="p" className="text-gray-600">
              Our team holds industry certifications including BICSI, FOA, and manufacturer-specific credentials to ensure expertise.
            </EditableContent>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-infinetYellow-100 flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-infinet-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <EditableContent id="advantage-5-title" tag="h3" className="text-xl font-semibold text-gray-900">
                Dedicated Support
              </EditableContent>
            </div>
            <EditableContent id="advantage-5-desc" tag="p" className="text-gray-600">
              We provide attentive customer service and ongoing maintenance to ensure your systems function optimally.
            </EditableContent>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-infinetYellow-100 flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-infinet-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <EditableContent id="advantage-6-title" tag="h3" className="text-xl font-semibold text-gray-900">
                Custom Solutions
              </EditableContent>
            </div>
            <EditableContent id="advantage-6-desc" tag="p" className="text-gray-600">
              We design tailored solutions based on your specific needs, industry requirements, and growth plans.
            </EditableContent>
          </div>
        </div>
      </div>
    </section>
  );
};

// Editable CTA Section
const EditableCta = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-infinet-600 to-infinet-700 text-white">
      <div className="container mx-auto max-w-6xl text-center">
        <EditableContent id="cta-heading" tag="h2" className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Upgrade Your Network Infrastructure?
        </EditableContent>
        
        <EditableContent id="cta-description" tag="p" className="text-lg mb-8 max-w-2xl mx-auto">
          Contact our team today to discuss your project requirements and receive a customized quote.
        </EditableContent>
        
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <div className="flex items-center">
            <svg className="h-6 w-6 mr-2 text-infinetYellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <EditableContent id="cta-feature-1" tag="span">
              Free consultation
            </EditableContent>
          </div>
          
          <div className="flex items-center">
            <svg className="h-6 w-6 mr-2 text-infinetYellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <EditableContent id="cta-feature-2" tag="span">
              Detailed quote
            </EditableContent>
          </div>
          
          <div className="flex items-center">
            <svg className="h-6 w-6 mr-2 text-infinetYellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <EditableContent id="cta-feature-3" tag="span">
              Fast turnaround
            </EditableContent>
          </div>
          
          <div className="flex items-center">
            <svg className="h-6 w-6 mr-2 text-infinetYellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <EditableContent id="cta-feature-4" tag="span">
              Ongoing support
            </EditableContent>
          </div>
        </div>
        
        <Button 
          size="lg" 
          variant="accent"
          className="bg-infinetYellow-500 hover:bg-infinetYellow-600 text-gray-900 px-8 py-3 text-lg"
          onClick={() => window.location.href = '/contact'}
        >
          <EditableContent id="cta-button" tag="span">
            Contact Us Today
          </EditableContent>
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
};

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
        <EditableHero />
        <EditableAboutPreview />
        <EditableServiceFinder />
        <NationwideService />
        <EditableWhyChooseUs />
        <ProjectsPreview />
        <EditableCta />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
