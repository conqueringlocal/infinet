
import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    const elements = heroRef.current?.querySelectorAll('.reveal');
    if (elements) {
      elements.forEach((el) => observer.observe(el));
    }

    return () => {
      if (elements) {
        elements.forEach((el) => observer.unobserve(el));
      }
    };
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-br from-gray-50 to-infinet-50"
    >
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
            <div className="reveal inline-block bg-infinetYellow-200 text-gray-800 px-4 py-1 rounded-full text-sm font-medium mb-6">
              Fiber & Low-Voltage Solutions You Can Trust
            </div>
            
            {/* Main Headline */}
            <h1 className="reveal text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight md:leading-tight lg:leading-tight text-balance">
              Building the Infrastructure <br className="hidden md:block" />
              <span className="text-infinet-600">for Tomorrow's Connectivity</span>
            </h1>
            
            {/* Subheadline */}
            <p className="reveal text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              With over 35 years of combined experience, we deliver high-quality fiber optic and low-voltage installations that meet the highest industry standards.
            </p>
            
            {/* CTA Buttons */}
            <div className="reveal flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Button size="lg" variant="default" onClick={() => window.location.href = '/contact'}>
                Get in Touch
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="accent" size="lg" onClick={() => window.location.href = '/services'}>
                Explore Our Services
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
