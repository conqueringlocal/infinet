
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cable, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const StructuredCablingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Structured Cabling Services | Infi-NET LLC";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-infinet-800 to-infinet-950 py-16 md:py-24 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-6">
                <div className="bg-white/10 p-3 rounded-lg mr-4">
                  <Cable className="h-8 w-8 text-infinet-400" />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold">Structured Cabling</h1>
              </div>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl">
                Comprehensive CAT5e, CAT6, and CAT6A installation for your network infrastructure with industry-standard compliance.
              </p>
              <Link to="/contact">
                <Button size="lg" className="bg-white text-infinet-800 hover:bg-blue-50">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional Structured Cabling Systems</h2>
                  <p className="text-lg text-gray-700">
                    Our structured cabling services provide the foundation for your organization's communications infrastructure, 
                    enabling reliable connectivity for data, voice, video, and building management systems through a standardized, 
                    organized, and scalable approach.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-gray-900">Key Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Organized network layout</h4>
                        <p className="text-gray-700">Meticulously planned cabling pathways and management systems for an organized and efficient network structure.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Simplified troubleshooting</h4>
                        <p className="text-gray-700">Logical organization and comprehensive labeling make identifying and resolving issues faster and more efficient.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Scalable infrastructure</h4>
                        <p className="text-gray-700">Designed to accommodate future growth and technology changes with minimal disruption and cost.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Enhanced reliability</h4>
                        <p className="text-gray-700">Consistent implementation of quality components and best practices ensures long-term dependability.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Industry standard compliance</h4>
                        <p className="text-gray-700">All installations meet or exceed ANSI/TIA/EIA and ISO/IEC standards for structured cabling systems.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Structured Cabling Services</h3>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">CAT5e, CAT6, and CAT6A Installations</h4>
                      <p className="text-gray-700">Complete installation of various category cabling options to match your performance requirements and budget constraints.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">Cable Management Solutions</h4>
                      <p className="text-gray-700">Comprehensive organization systems including J-hooks, cable trays, and rack management to maintain an orderly infrastructure.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">Testing and Certification</h4>
                      <p className="text-gray-700">Rigorous testing using industry-standard equipment to certify each cable run meets specifications and performance requirements.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">Infrastructure Documentation</h4>
                      <p className="text-gray-700">Detailed documentation including cable maps, test results, and as-built diagrams for simplified maintenance and future upgrades.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6 shadow-sm sticky top-24">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Get Started?</h3>
                  <p className="text-gray-700 mb-6">Contact us today to discuss your structured cabling needs.</p>
                  <Link to="/contact" className="block">
                    <Button className="w-full" size="lg">
                      Get in Touch
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Related Services</h4>
                    <ul className="space-y-3">
                      <li>
                        <Link to="/service/fiber" className="text-infinet-600 hover:text-infinet-800 font-medium flex items-center">
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Fiber Optic Installation
                        </Link>
                      </li>
                      <li>
                        <Link to="/service/wireless" className="text-infinet-600 hover:text-infinet-800 font-medium flex items-center">
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Wireless Solutions
                        </Link>
                      </li>
                      <li>
                        <Link to="/service/network" className="text-infinet-600 hover:text-infinet-800 font-medium flex items-center">
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Network Design & Implementation
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-infinet-800 text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Transform Your Network Infrastructure</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Let our experts design and implement a structured cabling system that meets your current needs and future growth.
            </p>
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
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default StructuredCablingPage;
