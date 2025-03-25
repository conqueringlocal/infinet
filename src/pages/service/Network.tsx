
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Server, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const NetworkPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Network Design & Implementation | Infi-NET LLC";
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
                  <Server className="h-8 w-8 text-infinet-400" />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold">Network Design & Implementation</h1>
              </div>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl">
                Comprehensive network design, configuration, and deployment tailored to your business needs.
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
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Expert Network Design & Implementation</h2>
                  <p className="text-lg text-gray-700">
                    Our network design and implementation services provide a holistic approach to creating robust, 
                    secure, and high-performance network infrastructures tailored specifically to your organization's 
                    operational requirements and growth projections.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-gray-900">Key Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Custom network architecture</h4>
                        <p className="text-gray-700">Tailored network designs that align with your specific business requirements, traffic patterns, and growth plans.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Hardware configuration</h4>
                        <p className="text-gray-700">Expert configuration of switches, routers, firewalls, and other network equipment to ensure optimal performance.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Security implementation</h4>
                        <p className="text-gray-700">Comprehensive security measures including VLANs, access control lists, threat protection, and policy enforcement.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Performance optimization</h4>
                        <p className="text-gray-700">Fine-tuning of network parameters, traffic shaping, and QoS configurations to maximize efficiency and throughput.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Documentation & training</h4>
                        <p className="text-gray-700">Comprehensive documentation of network design and configuration, along with knowledge transfer to your team.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Network Design & Implementation Process</h3>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">Requirements Analysis</h4>
                      <p className="text-gray-700">In-depth assessment of your current infrastructure, business processes, and future growth plans to understand your specific needs.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">Network Design</h4>
                      <p className="text-gray-700">Creation of detailed network architecture and topology designs, including hardware specifications and configuration plans.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">Implementation & Configuration</h4>
                      <p className="text-gray-700">Systematic deployment and configuration of all network components according to the design specifications and best practices.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">Testing & Optimization</h4>
                      <p className="text-gray-700">Comprehensive testing of all network functions and performance, with optimization to ensure everything performs as expected.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6 shadow-sm sticky top-24">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Get Started?</h3>
                  <p className="text-gray-700 mb-6">Contact us today to discuss your network design and implementation needs.</p>
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
                        <Link to="/service/structured" className="text-infinet-600 hover:text-infinet-800 font-medium flex items-center">
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Structured Cabling
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
            <h2 className="text-3xl font-bold mb-6">Build a Network That Grows With Your Business</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Let our experts design and implement a network infrastructure that provides the performance, security, and scalability your organization needs.
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

export default NetworkPage;
