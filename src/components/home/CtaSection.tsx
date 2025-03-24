
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const CtaSection = () => {
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
      className="py-16 md:py-24 bg-gradient-to-r from-infinet-800 to-infinet-950 text-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
          <pattern id="a" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 20L20 0L40 20L20 40Z" fill="none" stroke="#fff" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#a)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6">
            <h2 className="reveal text-3xl md:text-4xl font-bold leading-tight">
              Work With Infi-Net LLC
            </h2>
            
            <p className="reveal text-lg text-blue-100 max-w-3xl mx-auto">
              Whether you need expert fiber optic installations, low-voltage cabling, or customized network solutions, Infi-Net LLC is here to deliver. With a commitment to precision, reliability, and customer satisfaction, we ensure your projects are completed on time and to the highest standards. Let's build the future of connectivity together!
            </p>
            
            <div className="reveal pt-4 flex flex-wrap justify-center gap-6">
              {["Certified Technicians", "Quality Guaranteed", "Timely Delivery", "Exceptional Support"].map((item, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-infinet-400 mr-2" />
                  <span className="text-blue-100">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="reveal pt-6">
              <Link to="/contact">
                <Button size="lg" variant="secondary" className="bg-white text-infinet-800 hover:bg-blue-50">
                  Request a Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
