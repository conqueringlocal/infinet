import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

// Main navigation links
const navLinks = [{
  path: '/',
  label: 'Home'
}, {
  path: '/about',
  label: 'About Us'
}, {
  path: '/services',
  label: 'Services',
  hasSubmenu: true
}, {
  path: '/projects',
  label: 'Projects'
}, {
  path: '/contact',
  label: 'Contact'
}];

// Service submenu items
const serviceLinks = [
  { path: '/service/fiber', label: 'Fiber Optic Installation' },
  { path: '/service/structured', label: 'Structured Cabling' },
  { path: '/service/wireless', label: 'Wireless Solutions' },
  { path: '/service/ptp', label: 'Point-to-Point' },
  { path: '/service/network', label: 'Network Design' },
  { path: '/service/maintenance', label: 'Maintenance & Support' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showServiceMenu, setShowServiceMenu] = useState(false);
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
    <header className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300', scrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md py-3 shadow-md' : 'bg-transparent py-5')}>
      {/* Gradient Loading Animation */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-infinetYellow-400 to-infinet-500"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/2d58718b-9a89-4dde-b37e-43621ecf8a95.png" alt="Infi-NET LLC" className="h-12" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => 
              link.hasSubmenu ? (
                <NavigationMenu key={link.path}>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className={cn(
                        'px-3 py-2 text-sm font-medium transition-colors',
                        location.pathname.includes('/service/') ? 'text-infinet-600 bg-infinet-50' : 'text-gray-700 hover:text-infinet-600 hover:bg-infinet-50'
                      )}>
                        {link.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 w-[220px]">
                          <li>
                            <NavigationMenuLink asChild>
                              <Link 
                                to={link.path}
                                className="block p-2 hover:bg-infinet-50 rounded-md text-sm font-medium text-gray-700 hover:text-infinet-600"
                              >
                                All Services
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          {serviceLinks.map((serviceLink) => (
                            <li key={serviceLink.path}>
                              <NavigationMenuLink asChild>
                                <Link 
                                  to={serviceLink.path}
                                  className={cn(
                                    "block p-2 hover:bg-infinet-50 rounded-md text-sm font-medium transition-colors",
                                    location.pathname === serviceLink.path ? 'text-infinet-600 bg-infinet-50' : 'text-gray-700 hover:text-infinet-600'
                                  )}
                                >
                                  {serviceLink.label}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              ) : (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={cn('px-3 py-2 rounded-md text-sm font-medium transition-colors', 
                    location.pathname === link.path ? 'text-infinet-600 bg-infinet-50' : 'text-gray-700 hover:text-infinet-600 hover:bg-infinet-50')}
                >
                  {link.label}
                </Link>
              )
            )}
            <Button variant="accent" size="sm" className="ml-2" onClick={() => window.location.href = '/contact'}>Get in Touch</Button>
            <ThemeToggle />
          </nav>

          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 dark:text-gray-300 hover:text-infinet-600 dark:hover:text-infinet-400" aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} className="transition-transform duration-300 transform rotate-90" /> : <Menu size={24} className="transition-transform duration-300" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn('md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 transform', isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none')}>
        <div className="container mx-auto px-4 py-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map(link => 
              link.hasSubmenu ? (
                <div key={link.path} className="flex flex-col">
                  <button 
                    onClick={() => setShowServiceMenu(!showServiceMenu)}
                    className={cn(
                      'flex items-center justify-between px-3 py-3 rounded-md text-base font-medium transition-colors', 
                      location.pathname.includes('/service/') ? 'text-infinet-600 bg-infinet-50' : 'text-gray-700 hover:text-infinet-600 hover:bg-infinet-50'
                    )}
                  >
                    <span>{link.label}</span>
                    <ChevronDown 
                      className={cn(
                        "h-4 w-4 transition-transform", 
                        showServiceMenu && "transform rotate-180"
                      )} 
                    />
                  </button>
                  <div className={cn(
                    "pl-4 space-y-1 overflow-hidden transition-all duration-200",
                    showServiceMenu ? "max-h-96 py-2" : "max-h-0"
                  )}>
                    <Link 
                      to={link.path} 
                      className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:text-infinet-600 hover:bg-infinet-50"
                    >
                      All Services
                    </Link>
                    {serviceLinks.map((serviceLink) => (
                      <Link 
                        key={serviceLink.path} 
                        to={serviceLink.path} 
                        className={cn(
                          "block px-3 py-2 rounded-md text-sm transition-colors",
                          location.pathname === serviceLink.path ? 'text-infinet-600 bg-infinet-50' : 'text-gray-700 hover:text-infinet-600 hover:bg-infinet-50'
                        )}
                      >
                        {serviceLink.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={cn(
                    'px-3 py-3 rounded-md text-base font-medium transition-colors', 
                    location.pathname === link.path ? 'text-infinet-600 bg-infinet-50' : 'text-gray-700 hover:text-infinet-600 hover:bg-infinet-50'
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
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
