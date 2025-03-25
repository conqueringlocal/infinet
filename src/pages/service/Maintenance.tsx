
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const MaintenancePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Maintenance & Support | Infi-NET LLC";
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
                  <RefreshCw className="h-8 w-8 text-infinet-400" />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold">Maintenance & Support</h1>
              </div>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl">
                Ongoing monitoring, maintenance, and rapid issue resolution to keep your network running smoothly.
              </p>
              <Link to="/contact">
                <Button size="lg" className="bg-white text-infinet-800 hover:bg-blue-50">
                  Request a Consultation
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
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Proactive Network Support & Maintenance</h2>
                  <p className="text-lg text-gray-700">
                    Our maintenance and support services provide comprehensive coverage for your network infrastructure, 
                    ensuring continuous operation, rapid problem resolution, and proactive maintenance to prevent issues 
                    before they impact your business.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-gray-900">Key Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">24/7 monitoring options</h4>
                        <p className="text-gray-700">Around-the-clock monitoring of your network infrastructure to detect and address issues before they affect operations.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Preventative maintenance</h4>
                        <p className="text-gray-700">Regular scheduled maintenance activities to ensure optimal performance and prevent potential failures.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Rapid emergency response</h4>
                        <p className="text-gray-700">Quick response to critical issues with defined SLAs to minimize downtime and business impact.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Regular performance testing</h4>
                        <p className="text-gray-700">Periodic assessment of network performance to identify bottlenecks and optimization opportunities.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">System upgrades & patches</h4>
                        <p className="text-gray-700">Timely implementation of firmware updates, security patches, and system upgrades to maintain security and performance.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Maintenance & Support Services</h3>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">Network Monitoring</h4>
                      <p className="text-gray-700">Continuous monitoring of your network infrastructure for availability, performance metrics, and security alerts.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">Scheduled Maintenance</h4>
                      <p className="text-gray-700">Regular preventative maintenance visits to inspect, clean, and optimize network equipment and infrastructure.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">Troubleshooting & Repairs</h4>
                      <p className="text-gray-700">Expert diagnosis and resolution of network issues, with on-site support when required for complex problems.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-lg text-gray-900 mb-2">Firmware & Software Updates</h4>
                      <p className="text-gray-700">Regular updates to network equipment firmware and software to address security vulnerabilities and add new features.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6 shadow-sm sticky top-24">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Get Started?</h3>
                  <p className="text-gray-700 mb-6">Contact us today to discuss your maintenance and support needs and receive a customized solution.</p>
                  <Link to="/contact" className="block">
                    <Button className="w-full" size="lg">
                      Request a Quote
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
            <h2 className="text-3xl font-bold mb-6">Keep Your Network Running at Peak Performance</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Let our experts provide the ongoing maintenance and support your network needs to ensure reliability and optimal performance.
            </p>
            <Link to="/contact">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-infinet-800 hover:bg-blue-50"
              >
                Contact Us Today
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

export default MaintenancePage;
