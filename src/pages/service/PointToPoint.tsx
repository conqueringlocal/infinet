
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Radio, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const PointToPointPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Point-to-Point Solutions | Infi-NET LLC";
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
                  <Radio className="h-8 w-8 text-infinet-400" />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold">Point-to-Point Solutions</h1>
              </div>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl">
                Connect multiple facilities with secure, high-bandwidth links designed for reliability and performance.
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
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">High-Performance Building-to-Building Connectivity</h2>
                  <p className="text-lg text-gray-700">
                    Our point-to-point solutions enable secure, reliable connectivity between buildings or campuses, 
                    providing high-bandwidth connections without the ongoing costs of leased lines or the challenges 
                    of physical cabling over long distances.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-gray-900">Key Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Building-to-building connectivity</h4>
                        <p className="text-gray-700">Establish direct, high-speed links between separate buildings or facilities without traditional wired infrastructure.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Secure data transmission</h4>
                        <p className="text-gray-700">Advanced encryption and security protocols ensure that your data remains protected across wireless links.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">High-bandwidth connections</h4>
                        <p className="text-gray-700">Gigabit-capable connections support demanding applications and high volumes of data transfer between locations.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">No recurring lease costs</h4>
                        <p className="text-gray-700">Eliminate monthly charges for leased lines with a one-time investment in your own point-to-point infrastructure.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Rapid deployment options</h4>
                        <p className="text-gray-700">Quick implementation compared to traditional trenching and physical cabling options, especially over difficult terrain.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Point-to-Point Implementation</h3>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">Path and Feasibility Study</h4>
                      <p className="text-gray-700">Thorough assessment of terrain, distance, and line-of-sight conditions to determine the optimal solution for your specific environment.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">Custom Solution Design</h4>
                      <p className="text-gray-700">Engineering of a tailored point-to-point system matching your bandwidth requirements, distance constraints, and environmental conditions.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">Professional Installation</h4>
                      <p className="text-gray-700">Expert mounting, alignment, and configuration of point-to-point equipment to ensure optimal signal strength and reliability.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">Testing and Verification</h4>
                      <p className="text-gray-700">Comprehensive testing of the link for throughput, latency, packet loss, and stability under various conditions to ensure performance.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6 shadow-sm sticky top-24">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Get Started?</h3>
                  <p className="text-gray-700 mb-6">Contact us today to discuss your point-to-point connectivity needs.</p>
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
                      <li>
                        <Link to="/service/fiber" className="text-infinet-600 hover:text-infinet-800 font-medium flex items-center">
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Fiber Optic Installation
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
            <h2 className="text-3xl font-bold mb-6">Connect Your Facilities Seamlessly</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Let our experts design and implement a point-to-point solution that bridges your locations with high-performance connectivity.
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

export default PointToPointPage;
