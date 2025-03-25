
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Network, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const FiberServicePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Fiber Optic Installation | Infi-NET LLC";
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
                  <Network className="h-8 w-8 text-infinet-400" />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold">Fiber Optic Installation</h1>
              </div>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl">
                High-speed fiber optic cabling for reliable, future-proof connectivity with enterprise-grade performance.
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
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Enterprise-Grade Fiber Solutions</h2>
                  <p className="text-lg text-gray-700">
                    Our fiber optic installation services provide the backbone for your organization's digital infrastructure, 
                    enabling lightning-fast data transmission, reduced latency, and unparalleled reliability for your critical operations.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-gray-900">Key Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Enterprise-grade connectivity</h4>
                        <p className="text-gray-700">Reliable, high-performance connectivity suitable for mission-critical applications and services.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Higher bandwidth capacity</h4>
                        <p className="text-gray-700">Support for massive data transfers and high-bandwidth applications without performance degradation.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Longer transmission distances</h4>
                        <p className="text-gray-700">Signal integrity maintained over greater distances compared to traditional copper cabling.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Enhanced security</h4>
                        <p className="text-gray-700">Inherently more secure than traditional methods, with improved protection against eavesdropping and interference.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Future-proof installation</h4>
                        <p className="text-gray-700">Designed to accommodate growing demands and evolving technology standards for years to come.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Fiber Optic Installation Process</h3>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">1. Comprehensive Site Survey</h4>
                      <p className="text-gray-700">We begin with a thorough assessment of your facility and requirements, designing a custom installation plan based on your specific needs.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">2. Precision Installation</h4>
                      <p className="text-gray-700">Our certified technicians implement the fiber optic cabling system with meticulous attention to detail, ensuring optimal performance.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">3. Comprehensive Testing</h4>
                      <p className="text-gray-700">We conduct rigorous testing and certification to verify that your installation meets or exceeds industry standards and specifications.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">4. Documentation & Support</h4>
                      <p className="text-gray-700">You'll receive complete documentation of your installation, along with ongoing support to ensure continued optimal performance.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6 shadow-sm sticky top-24">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Get Started?</h3>
                  <p className="text-gray-700 mb-6">Contact us today to discuss your fiber optic installation needs.</p>
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
                        <Link to="/service/structured" className="text-infinet-600 hover:text-infinet-800 font-medium flex items-center">
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Structured Cabling
                        </Link>
                      </li>
                      <li>
                        <Link to="/service/network" className="text-infinet-600 hover:text-infinet-800 font-medium flex items-center">
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Network Design & Implementation
                        </Link>
                      </li>
                      <li>
                        <Link to="/service/maintenance" className="text-infinet-600 hover:text-infinet-800 font-medium flex items-center">
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Maintenance & Support
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
            <h2 className="text-3xl font-bold mb-6">Ready for Enterprise-Grade Connectivity?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Let our experts design and implement the perfect fiber optic solution for your organization.
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

export default FiberServicePage;
