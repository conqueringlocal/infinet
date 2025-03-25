
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ArrowRight, CheckCircle } from 'lucide-react';

const AboutPreview = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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

    const elements = sectionRef.current?.querySelectorAll('.reveal');
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
    <section 
      ref={sectionRef}
      className="py-16 md:py-24 bg-white"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Column */}
          <div className="reveal order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-infinet-100 rounded-lg -z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-infinet-50 rounded-lg -z-10"></div>
              <div className="bg-gray-200 rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Team of technicians working on fiber optic installation"
                  className="w-full h-80 object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="reveal">
              <span className="text-sm font-semibold text-infinet-600 uppercase tracking-wider">About Infi-NET LLC</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Connecting Florida with Precision and Expertise</h2>
            </div>

            <div className="reveal">
              <p className="text-gray-600 text-lg">
                Founded on principles of quality and reliability, Infi-NET LLC brings over 35 years of combined experience to every project. Based in Lakeland, Florida, we specialize in fiber optic installations, low-voltage data cabling, and point-to-point applications for businesses across industries.
              </p>
            </div>

            <div className="reveal space-y-3">
              {[
                "Certified fiber optic specialists with extensive field experience",
                "Client-first approach with customized solutions for every project",
                "Commitment to quality, safety, and industry best practices"
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-2 flex-shrink-0" />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>

            <div className="reveal pt-4">
              <Link to="/about">
                <Button>
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
