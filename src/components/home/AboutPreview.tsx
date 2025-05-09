
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import EditableContent from '@/components/editor/EditableContent';

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
          <div className="reveal order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-infinet-100 rounded-lg -z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-infinet-50 rounded-lg -z-10"></div>
              <div className="bg-gray-50 rounded-lg overflow-hidden shadow-xl border border-infinet-100">
                <EditableContent 
                  id="about-preview-image" 
                  type="image" 
                  imageSrc="/lovable-uploads/169d5fd5-78b8-499f-bad0-6aea1ccb4938.png" 
                  imageAlt="Digital infrastructure and connectivity visualization"
                  className="w-full h-auto object-cover object-center"
                />
                <div className="p-4 bg-infinetYellow-50 border-t border-infinet-100">
                  <h3 className="text-lg font-medium text-gray-900">
                    <EditableContent id="about-preview-card-title">
                      Advanced Connectivity Solutions
                    </EditableContent>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    <EditableContent id="about-preview-card-description">
                      Explore our cutting-edge network infrastructure and fiber optic technologies.
                    </EditableContent>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 order-1 lg:order-2">
            <div className="reveal">
              <EditableContent id="about-section-title" tag="span" className="text-sm font-semibold text-infinet-600 uppercase tracking-wider">
                About Infi-NET LLC
              </EditableContent>
              <EditableContent id="about-section-heading" tag="h2" className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                Leading Provider of Fiber & Low Voltage Solutions
              </EditableContent>
            </div>

            <div className="reveal">
              <EditableContent id="about-section-description" tag="p" className="text-gray-600 text-lg">
                We bring over 35 years of combined experience to every project. Based in Lakeland, Florida, we specialize in fiber optic installations, low-voltage data cabling, and point-to-point applications for businesses across industries.
              </EditableContent>
            </div>

            <div className="reveal space-y-3">
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-infinetYellow-100 flex items-center justify-center mt-1 mr-2 flex-shrink-0">
                  <span className="text-infinet-600 font-bold">✓</span>
                </div>
                <EditableContent id="about-bullet-1" tag="p" className="text-gray-700">
                  Certified fiber optic specialists with extensive field experience
                </EditableContent>
              </div>
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-infinetYellow-100 flex items-center justify-center mt-1 mr-2 flex-shrink-0">
                  <span className="text-infinet-600 font-bold">✓</span>
                </div>
                <EditableContent id="about-bullet-2" tag="p" className="text-gray-700">
                  Client-first approach with customized solutions for every project
                </EditableContent>
              </div>
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-infinetYellow-100 flex items-center justify-center mt-1 mr-2 flex-shrink-0">
                  <span className="text-infinet-600 font-bold">✓</span>
                </div>
                <EditableContent id="about-bullet-3" tag="p" className="text-gray-700">
                  Commitment to quality, safety, and industry best practices
                </EditableContent>
              </div>
            </div>

            <div className="reveal pt-4">
              <Link to="/about">
                <Button 
                  className="w-full md:w-auto flex items-center justify-center"
                >
                  <EditableContent id="about-cta-text">
                    Learn More About Us
                  </EditableContent>
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
