
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const navLinks = [{
  path: '/',
  label: 'Home'
}, {
  path: '/about',
  label: 'About Us'
}, {
  path: '/services',
  label: 'Services'
}, {
  path: '/projects',
  label: 'Projects'
}, {
  path: '/contact',
  label: 'Contact'
}];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300', scrolled ? 'bg-white/90 backdrop-blur-md py-3 shadow-md' : 'bg-transparent py-5')}>
      {/* Gradient Loading Animation */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-infinetYellow-400 to-infinet-500"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/2d58718b-9a89-4dde-b37e-43621ecf8a95.png" alt="Infi-NET LLC" className="h-12" />
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => <Link key={link.path} to={link.path} className={cn('px-3 py-2 rounded-md text-sm font-medium transition-colors', location.pathname === link.path ? 'text-infinet-600 bg-infinet-50' : 'text-gray-700 hover:text-infinet-600 hover:bg-infinet-50')}>
                {link.label}
              </Link>)}
            <Button variant="accent" size="sm" className="ml-2" onClick={() => window.location.href = '/contact'}>Get in Touch</Button>
          </nav>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-700 hover:text-infinet-600" aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} className="transition-transform duration-300 transform rotate-90" /> : <Menu size={24} className="transition-transform duration-300" />}
          </button>
        </div>
      </div>

      <div className={cn('md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg transition-all duration-300 transform', isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none')}>
        <div className="container mx-auto px-4 py-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map(link => <Link key={link.path} to={link.path} className={cn('px-3 py-3 rounded-md text-base font-medium transition-colors', location.pathname === link.path ? 'text-infinet-600 bg-infinet-50' : 'text-gray-700 hover:text-infinet-600 hover:bg-infinet-50')}>
                {link.label}
              </Link>)}
            <Button variant="accent" size="sm" className="mt-2" onClick={() => window.location.href = '/contact'}>
              Get in Touch
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
