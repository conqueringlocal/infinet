import React, { useEffect, useRef } from 'react';
import { Cable, Network, Radio, Building, Construction, Wifi, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const serviceCategories = [
  {
    id: 'fiber',
    icon: Network,
    title: 'Fiber Optic Installations',
    description: 'High-speed, reliable fiber optic cabling solutions for businesses and organizations of all sizes.',
    color: 'text-blue-600 bg-blue-100',
    features: [
      'Single-mode and multi-mode fiber installations',
      'Fusion splicing and termination',
      'Fiber optic testing and certification',
      'Backbone and horizontal cabling systems',
      'Fiber-to-the-desk solutions',
      'Outdoor fiber installations and aerial fiber deployments'
    ],
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    path: '/service/fiber'
  },
  {
    id: 'data-cabling',
    icon: Cable,
    title: 'Low-Voltage Data Cabling',
    description: 'Comprehensive structured cabling solutions designed for optimal performance and scalability.',
    color: 'text-green-600 bg-green-100',
    features: [
      'CAT5e, CAT6, and CAT6A installations',
      'Structured cabling design and implementation',
      'Cable management systems',
      'Testing and certification',
      'Data center cabling',
      'Audio/video cabling solutions'
    ],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    path: '/service/structured'
  },
  {
    id: 'ptp',
    icon: Radio,
    title: 'Point-to-Point Applications',
    description: 'Connect multiple buildings or facilities with secure, high-bandwidth point-to-point solutions.',
    color: 'text-purple-600 bg-purple-100',
    features: [
      'Building-to-building connectivity',
      'Campus network infrastructure',
      'Long-distance fiber solutions',
      'Redundant connectivity options',
      'High-bandwidth PTP links',
      'Secure transmission systems'
    ],
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    path: '/service/ptp'
  },
  {
    id: 'underground',
    icon: Construction,
    title: 'Underground Services',
    description: 'Professional underground utility installation, directional boring, and trenching solutions with minimal disruption.',
    color: 'text-amber-600 bg-amber-100',
    features: [
      'Directional boring and horizontal drilling',
      'Trenching and excavation services',
      'Utility locating and mapping',
      'Conduit and duct bank installation',
      'Underground fiber optic pathways',
      'Complete restoration services'
    ],
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    path: '/service/underground'
  },
  {
    id: 'greenfield',
    icon: Building,
    title: 'Greenfield Site Builds',
    description: 'Complete infrastructure solutions for new construction projects, designed from the ground up.',
    color: 'text-teal-600 bg-teal-100',
    features: [
      'New construction network design',
      'Infrastructure planning and consulting',
      'Code-compliant installations',
      'Coordination with other contractors',
      'Future-proof cabling systems',
      'Complete documentation and as-builts'
    ],
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    path: '/service/network'
  },
  {
    id: 'brownfield',
    icon: Construction,
    title: 'Brownfield Site Builds',
    description: 'Upgrade existing infrastructure with minimal disruption to ongoing operations.',
    color: 'text-amber-600 bg-amber-100',
    features: [
      'Infrastructure assessment and planning',
      'Phased implementation strategies',
      'Legacy system integration',
      'Minimal disruption approaches',
      'Systematic cable replacement',
      '24/7 implementation options'
    ],
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    path: '/service/network'
  },
  {
    id: 'other',
    icon: Wifi,
    title: 'Additional Services',
    description: 'Complementary services to support your complete network infrastructure needs.',
    color: 'text-red-600 bg-red-100',
    features: [
      'Network rack and cabinet installation',
      'Equipment mounting and configuration',
      'Cable management solutions',
      'Infrastructure documentation',
      'Site surveys and assessments'
    ],
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    path: '/service/network'
  }
];

const Services = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Our Services | Infi-Net LLC";

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

    const elements = pageRef.current?.querySelectorAll('.reveal');
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
    <div className="min-h-screen flex flex-col" ref={pageRef}>
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-infinet-800 to-infinet-950 py-16 md:py-20 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="reveal text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
              <p className="reveal text-xl text-blue-100">
                Comprehensive fiber optic and low-voltage solutions delivered with expertise and precision nationwide.
              </p>
            </div>
          </div>
        </section>

        {/* Service Introduction */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <p className="reveal text-lg text-gray-600">
                At Infi-NET LLC, we offer a comprehensive range of network infrastructure services tailored to your specific needs across the United States. From fiber optic installations to structured cabling and point-to-point applications, our certified technicians deliver quality solutions designed for reliability, performance, and scalability.
              </p>
            </div>
          </div>
        </section>

        {/* Service Categories */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            {serviceCategories.map((service, index) => (
              <div 
                key={service.id} 
                id={service.id}
                className="reveal mb-20 last:mb-0 scroll-mt-24"
              >
                <div className={cn(
                  "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center",
                  index % 2 === 0 ? "" : "lg:flex-row-reverse"
                )}>
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mr-4", service.color)}>
                        <service.icon className="h-6 w-6" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">{service.title}</h2>
                    </div>
                    
                    <p className="text-lg text-gray-600">{service.description}</p>
                    
                    <div className="space-y-3">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                          <p className="text-gray-700">{feature}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4">
                      <Link to={service.path}>
                        <Button variant="default">
                          Learn More About This Service
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className={cn(
                      "absolute -z-10 rounded-lg",
                      index % 2 === 0 ? "-top-4 -right-4 w-32 h-32 bg-infinet-100" : "-top-4 -left-4 w-32 h-32 bg-infinet-100"
                    )}></div>
                    <div className={cn(
                      "absolute -z-10 rounded-lg",
                      index % 2 === 0 ? "-bottom-4 -left-4 w-32 h-32 bg-infinet-50" : "-bottom-4 -right-4 w-32 h-32 bg-infinet-50"
                    )}></div>
                    <div className="bg-white rounded-lg overflow-hidden shadow-xl">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="w-full h-80 object-cover object-center"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-infinet-800 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="reveal text-3xl md:text-4xl font-bold mb-6">
                Ready to Discuss Your Project?
              </h2>
              <p className="reveal text-xl text-blue-100 mb-8">
                Contact us today for a free consultation and quote on your fiber optic or low-voltage needs. We serve clients nationwide across all 50 states.
              </p>
              <div className="reveal">
                <Link to="/contact">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="bg-white text-infinet-800 hover:bg-blue-50"
                  >
                    Get in Touch
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Services;
