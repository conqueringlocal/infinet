
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Network, Cable, Radio, Construction, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const services = [
  {
    id: 'fiber',
    title: 'Fiber Optic Installations',
    description: 'High-speed, high-capacity fiber optic cabling solutions designed for reliability and future-proofing your network infrastructure.',
    icon: Network,
    color: 'bg-blue-50 text-blue-600',
    link: '/service/fiber'
  },
  {
    id: 'data-cabling',
    title: 'Low-Voltage Data Cabling',
    description: 'Professional CAT5e, CAT6, and CAT6A installations with meticulous attention to detail and comprehensive testing.',
    icon: Cable,
    color: 'bg-green-50 text-green-600',
    link: '/service/structured'
  },
  {
    id: 'underground',
    title: 'Underground Services',
    description: 'Professional underground utility installation, directional boring, and trenching with minimal disruption to surrounding areas.',
    icon: Construction,
    color: 'bg-amber-50 text-amber-600',
    link: '/service/underground'
  },
  {
    id: 'ptp',
    title: 'Point-to-Point Applications',
    description: 'Connect multiple buildings or facilities with secure, high-bandwidth point-to-point solutions tailored to your specific needs.',
    icon: Radio,
    color: 'bg-purple-50 text-purple-600',
    link: '/service/ptp'
  }
];

const ServicesSection = () => {
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
      className="py-16 md:py-24 bg-gray-50"
      id="services"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="reveal text-sm font-semibold text-infinet-600 uppercase tracking-wider">Our Services</span>
          <h2 className="reveal text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Professional Network Infrastructure Solutions
          </h2>
          <p className="reveal text-gray-600 mt-4 text-lg">
            From fiber optic installations to comprehensive low-voltage cabling, we provide the expertise and precision your projects demand.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.id}
              className="reveal bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6 flex-grow">
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4", service.color)}>
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
              </div>
              <div className="px-6 pb-5 pt-2">
                <Link 
                  to={service.link} 
                  className="inline-flex items-center text-infinet-600 hover:text-infinet-700 font-medium"
                >
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="reveal text-center mt-12">
          <Link to="/services">
            <Button size="lg" variant="default">
              View All Services
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
