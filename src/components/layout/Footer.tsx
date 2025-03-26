
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, LinkedIn, ChevronRight, LockKeyhole } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Infi-NET LLC</h3>
            <p className="text-gray-400 mb-4">Professional fiber optic and low-voltage solutions for businesses nationwide.</p>
            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-infinet-500 mr-2 mt-0.5" />
                <span className="text-gray-400">123 Network Lane, Suite 100<br />Atlanta, GA 30303</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-infinet-500 mr-2" />
                <span className="text-gray-400">(555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-infinet-500 mr-2" />
                <a href="mailto:info@infi-net.net" className="text-gray-400 hover:text-white transition-colors">info@infi-net.net</a>
              </div>
            </div>
          </div>
          
          {/* Column 2: Services */}
          <div>
            <h3 className="text-xl font-bold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/service/fiber" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Fiber Optic Solutions
                </Link>
              </li>
              <li>
                <Link to="/service/structured" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Structured Cabling
                </Link>
              </li>
              <li>
                <Link to="/service/wireless" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Wireless Solutions
                </Link>
              </li>
              <li>
                <Link to="/service/ptp" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Point-to-Point Connectivity
                </Link>
              </li>
              <li>
                <Link to="/service/network" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Network Design & Implementation
                </Link>
              </li>
              <li>
                <Link to="/service/maintenance" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Maintenance & Support
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Project Portfolio
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#privacy" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Terms of Service
                </a>
              </li>
              <li>
                <Link to="/admin/login" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <LockKeyhole className="h-4 w-4 mr-1" />
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Newsletter Signup */}
          <div>
            <h3 className="text-xl font-bold mb-4">Stay Connected</h3>
            <p className="text-gray-400 mb-4">Follow us on social media for industry news and updates.</p>
            <div className="flex space-x-3 mb-6">
              <a href="#facebook" className="bg-blue-600 hover:bg-blue-700 p-2 rounded-full transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#twitter" className="bg-blue-400 hover:bg-blue-500 p-2 rounded-full transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#instagram" className="bg-pink-600 hover:bg-pink-700 p-2 rounded-full transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#linkedin" className="bg-blue-800 hover:bg-blue-900 p-2 rounded-full transition-colors">
                <LinkedIn className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright Bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-2 md:mb-0">
            &copy; {year} Infi-NET LLC. All rights reserved.
          </p>
          <div>
            <p className="text-gray-500 text-sm">
              Website managed by <a href="https://conqueringlocal.com" target="_blank" rel="noopener noreferrer" className="text-infinet-400 hover:text-infinet-300">Conquering Local</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
