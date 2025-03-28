import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wifi, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const WirelessPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Wireless Solutions | Infi-NET LLC";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-infinet-800 to-infinet-950 py-16 md:py-24 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-6">
                <div className="bg-white/10 p-3 rounded-lg mr-4">
                  <Wifi className="h-8 w-8 text-infinet-400" />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold">Wireless Solutions</h1>
              </div>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl">
                Enterprise-grade wireless connectivity and coverage solutions for businesses of all sizes.
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
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Enterprise-Grade Wireless Networks</h2>
                  <p className="text-lg text-gray-700">
                    Our wireless solutions provide secure, reliable, and high-performance connectivity for your 
                    organization, supporting the demands of modern business operations while offering the flexibility 
                    and mobility your team needs.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-gray-900">Key Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Campus-wide coverage</h4>
                        <p className="text-gray-700">Seamless connectivity across your entire facility, eliminating dead zones and ensuring consistent performance.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">High-density deployment</h4>
                        <p className="text-gray-700">Specialized configurations for areas with high user concentration, ensuring performance even during peak usage.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Outdoor connectivity options</h4>
                        <p className="text-gray-700">Weather-resistant solutions for extending wireless coverage to outdoor areas, parking lots, and between buildings.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Wireless distribution systems</h4>
                        <p className="text-gray-700">Strategic implementation of wireless access points with centralized management for optimal performance.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Managed WiFi services</h4>
                        <p className="text-gray-700">Ongoing monitoring, management, and optimization of your wireless network for peak performance and security.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Wireless Implementation Process</h3>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">Wireless Site Survey</h4>
                      <p className="text-gray-700">A comprehensive assessment of your facility to identify coverage requirements, interference sources, and optimal access point placement.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">Custom Wireless Design</h4>
                      <p className="text-gray-700">Development of a tailored wireless implementation plan based on your specific requirements, building layout, and user density.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">Professional Installation</h4>
                      <p className="text-gray-700">Expert deployment of wireless access points, controllers, and supporting infrastructure according to the design specifications.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">Configuration & Optimization</h4>
                      <p className="text-gray-700">Fine-tuning of wireless parameters, channel planning, and security settings to ensure optimal performance and protection.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6 shadow-sm sticky top-24">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Get Started?</h3>
                  <p className="text-gray-700 mb-6">Contact us today to discuss your wireless networking needs.</p>
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
                        <Link to="/service/network" className="text-infinet-600 hover:text-infinet-800 font-medium flex items-center">
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Network Design & Implementation
                        </Link>
                      </li>
                      <li>
                        <Link to="/service/ptp" className="text-infinet-600 hover:text-infinet-800 font-medium flex items-center">
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Point-to-Point Solutions
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
            <h2 className="text-3xl font-bold mb-6">Unlock Wireless Freedom for Your Business</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Let our experts design and implement a wireless solution that provides the coverage, performance, and security your organization needs.
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
    </div>
  );
};

export default WirelessPage;
