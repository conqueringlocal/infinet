
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, ChevronRight } from 'lucide-react';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img src="/lovable-uploads/2d58718b-9a89-4dde-b37e-43621ecf8a95.png" alt="Infi-NET LLC" className="h-12" />
            </div>
            <p className="text-gray-300 max-w-xs">
              Fiber & Low-Voltage Solutions You Can Trust. Providing expert network infrastructure services nationwide across the United States.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-infinet-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-infinet-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-infinet-400 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-white/90">Quick Links</h4>
            <ul className="space-y-2">
              {[{
              label: 'Home',
              path: '/'
            }, {
              label: 'About Us',
              path: '/about'
            }, {
              label: 'Our Services',
              path: '/services'
            }, {
              label: 'Projects',
              path: '/projects'
            }, {
              label: 'Contact Us',
              path: '/contact'
            }].map((link, index) => <li key={index}>
                  <Link to={link.path} className="text-gray-400 hover:text-infinet-400 transition-colors flex items-center">
                    <ChevronRight size={14} className="mr-1" />
                    {link.label}
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-white/90">Our Services</h4>
            <ul className="space-y-2">
              {[{
              label: 'Fiber Optic Installations',
              path: '/services#fiber'
            }, {
              label: 'Low-Voltage Data Cabling',
              path: '/services#data-cabling'
            }, {
              label: 'Point-to-Point Applications',
              path: '/services#ptp'
            }, {
              label: 'Greenfield Site Builds',
              path: '/services#greenfield'
            }, {
              label: 'Brownfield Site Builds',
              path: '/services#brownfield'
            }].map((service, index) => <li key={index}>
                  <Link to={service.path} className="text-gray-400 hover:text-infinet-400 transition-colors flex items-center">
                    <ChevronRight size={14} className="mr-1" />
                    {service.label}
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-white/90">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-infinet-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-300">Nationwide Service, Based in Lakeland, Florida</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-infinet-400 mr-3 flex-shrink-0" />
                <a href="tel:+17274177050" className="text-gray-300 hover:text-infinet-400 transition-colors">(727) 417-7050</a>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-infinet-400 mr-3 flex-shrink-0" />
                <a href="mailto:info@infi-net.net" className="text-gray-300 hover:text-infinet-400 transition-colors">info@infi-net.net</a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {currentYear} Infi-NET LLC. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <a href="#" className="hover:text-infinet-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-infinet-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;
