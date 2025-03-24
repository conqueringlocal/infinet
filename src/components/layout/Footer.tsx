
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, ChevronRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">
              Infi-<span className="text-infinet-400">Net</span> <span className="text-sm">LLC</span>
            </h3>
            <p className="text-gray-300 max-w-xs">
              Fiber & Low-Voltage Solutions You Can Trust. Providing expert network infrastructure services in Lakeland, Florida and beyond.
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
              {[
                { label: 'Home', path: '/' },
                { label: 'About Us', path: '/about' },
                { label: 'Our Services', path: '/services' },
                { label: 'Projects', path: '/projects' },
                { label: 'Contact Us', path: '/contact' },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 hover:text-infinet-400 transition-colors flex items-center"
                  >
                    <ChevronRight size={14} className="mr-1" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-white/90">Our Services</h4>
            <ul className="space-y-2">
              {[
                { label: 'Fiber Optic Installations', path: '/services#fiber' },
                { label: 'Low-Voltage Data Cabling', path: '/services#data-cabling' },
                { label: 'Point-to-Point Applications', path: '/services#ptp' },
                { label: 'Greenfield Site Builds', path: '/services#greenfield' },
                { label: 'Brownfield Site Builds', path: '/services#brownfield' },
              ].map((service, index) => (
                <li key={index}>
                  <Link 
                    to={service.path} 
                    className="text-gray-400 hover:text-infinet-400 transition-colors flex items-center"
                  >
                    <ChevronRight size={14} className="mr-1" />
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-white/90">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-infinet-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-300">Lakeland, Florida</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-infinet-400 mr-3 flex-shrink-0" />
                <a href="tel:+18631234567" className="text-gray-300 hover:text-infinet-400 transition-colors">
                  (863) 123-4567
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-infinet-400 mr-3 flex-shrink-0" />
                <a href="mailto:info@infinetllc.com" className="text-gray-300 hover:text-infinet-400 transition-colors">
                  info@infinetllc.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {currentYear} Infi-Net LLC. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <a href="#" className="hover:text-infinet-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-infinet-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
