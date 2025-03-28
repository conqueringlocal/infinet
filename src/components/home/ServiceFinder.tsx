import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Cable, Network, Radio, Wifi, Server, CheckCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

type ServiceOption = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  path: string;
};

const services: ServiceOption[] = [
  {
    id: 'fiber',
    title: 'Fiber Optic Installation',
    description: 'High-speed fiber optic cabling for reliable, future-proof connectivity.',
    icon: Network,
    features: [
      'Enterprise-grade connectivity',
      'Higher bandwidth capacity',
      'Longer transmission distances',
      'Enhanced security',
      'Future-proof installation'
    ],
    path: '/service/fiber'
  },
  {
    id: 'structured',
    title: 'Structured Cabling',
    description: 'Comprehensive CAT5e, CAT6, and CAT6A installation for your network infrastructure.',
    icon: Cable,
    features: [
      'Organized network layout',
      'Simplified troubleshooting',
      'Scalable infrastructure',
      'Enhanced reliability',
      'Industry standard compliance'
    ],
    path: '/service/structured'
  },
  {
    id: 'wireless',
    title: 'Wireless Solutions',
    description: 'Enterprise-grade wireless connectivity and point-to-point solutions.',
    icon: Wifi,
    features: [
      'Campus-wide coverage',
      'High-density deployment',
      'Outdoor connectivity options',
      'Wireless distribution systems',
      'Managed WiFi services'
    ],
    path: '/service/wireless'
  },
  {
    id: 'ptp',
    title: 'Point-to-Point Solutions',
    description: 'Connect multiple facilities with secure, high-bandwidth links.',
    icon: Radio,
    features: [
      'Building-to-building connectivity',
      'Secure data transmission',
      'High-bandwidth connections',
      'No recurring lease costs',
      'Rapid deployment options'
    ],
    path: '/service/ptp'
  },
  {
    id: 'network',
    title: 'Network Design & Implementation',
    description: 'Comprehensive network design, configuration, and deployment.',
    icon: Server,
    features: [
      'Custom network architecture',
      'Hardware configuration',
      'Security implementation',
      'Performance optimization',
      'Documentation & training'
    ],
    path: '/service/network'
  }
];

const ServiceFinder = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [stage, setStage] = useState<'selection' | 'details'>('selection');

  const handleSelect = (id: string) => {
    setSelected(id);
    setStage('details');
  };

  const handleReset = () => {
    setStage('selection');
    setSelected(null);
  };

  const selectedService = services.find(service => service.id === selected);

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-semibold text-infinet-600 uppercase tracking-wider">Find Your Solution</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Discover the Perfect Service for Your Needs
          </h2>
          <p className="text-gray-600 mt-4 text-lg">
            We offer a wide range of connectivity solutions. Explore our services to find the perfect match for your requirements.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {stage === 'selection' ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col relative overflow-hidden"
                  onClick={() => handleSelect(service.id)}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="mb-4">
                    <service.icon className="h-10 w-10 text-infinet-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>
                  <Button 
                    variant="outline" 
                    className="w-full md:w-auto mt-2 flex items-center justify-center" 
                    asChild
                  >
                    <Link to={service.path} className="flex items-center justify-center">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="bg-white rounded-xl shadow-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {selectedService && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="bg-infinet-50 p-6 rounded-full">
                      <selectedService.icon className="h-16 w-16 text-infinet-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{selectedService.title}</h3>
                      <p className="text-lg text-gray-600 mt-2">{selectedService.description}</p>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedService.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-infinet-600 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button variant="default" size="lg" asChild>
                      <Link to={selectedService.path}>View Service Details</Link>
                    </Button>
                    <Button variant="outline" size="lg" onClick={handleReset}>
                      View Other Services
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
          <div className="mt-12 text-center">
            <Button 
              variant="default" 
              size="lg" 
              className="w-full md:w-auto px-8 flex items-center justify-center mx-auto" 
              asChild
            >
              <Link to="/services" className="flex items-center justify-center">
                View All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceFinder;
