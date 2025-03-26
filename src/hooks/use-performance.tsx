
import { useEffect, useState } from 'react';

// Define the NetworkInformation interface that's missing in the standard lib
interface NetworkInformation {
  effectiveType: string;
  addEventListener: (type: string, listener: EventListener) => void;
  removeEventListener: (type: string, listener: EventListener) => void;
}

// Extend Navigator to include connection property
interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
}

interface PerformanceOptions {
  lazyLoadImages?: boolean;
  disableAnimationsOnLowPower?: boolean;
  maxCachedRoutes?: number;
}

/**
 * Hook to optimize performance based on user's device capabilities
 */
export const usePerformance = ({
  lazyLoadImages = true,
  disableAnimationsOnLowPower = true,
  maxCachedRoutes = 5
}: PerformanceOptions = {}) => {
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [connectionType, setConnectionType] = useState<string | null>(null);
  
  useEffect(() => {
    // Detect connection type if available
    if ('connection' in navigator) {
      const nav = navigator as NavigatorWithConnection;
      const connection = nav.connection;
      
      if (connection) {
        setConnectionType(connection.effectiveType);
        
        // Listen for changes
        const updateConnectionStatus = () => {
          setConnectionType(connection.effectiveType);
        };
        
        connection.addEventListener('change', updateConnectionStatus);
        return () => connection.removeEventListener('change', updateConnectionStatus);
      }
    }
  }, []);
  
  useEffect(() => {
    // Fix for Battery API - use feature detection and handle errors
    if ('getBattery' in navigator) {
      try {
        // @ts-ignore - Battery API not in standard lib
        const batteryPromise = navigator.getBattery();
        
        if (batteryPromise && typeof batteryPromise.then === 'function') {
          batteryPromise.then((battery: any) => {
            const checkPowerMode = () => {
              setIsLowPowerMode(battery.level < 0.2 && !battery.charging);
            };
            
            checkPowerMode();
            battery.addEventListener('levelchange', checkPowerMode);
            battery.addEventListener('chargingchange', checkPowerMode);
            
            return () => {
              battery.removeEventListener('levelchange', checkPowerMode);
              battery.removeEventListener('chargingchange', checkPowerMode);
            };
          }).catch(err => {
            console.warn('Battery API error:', err);
          });
        }
      } catch (e) {
        console.warn('Battery API not fully supported:', e);
      }
    }
  }, []);
  
  useEffect(() => {
    // Apply optimizations based on device capabilities
    
    // Lazy load images if requested
    if (lazyLoadImages) {
      const images = document.querySelectorAll('img:not([loading])');
      images.forEach(img => {
        img.setAttribute('loading', 'lazy');
      });
    }
    
    // Disable animations on low power or slow connection
    if (disableAnimationsOnLowPower && (isLowPowerMode || connectionType === 'slow-2g' || connectionType === '2g')) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
    
    // Add a style tag for reduced motion if it doesn't exist
    if (!document.getElementById('reduce-motion-styles')) {
      const styleTag = document.createElement('style');
      styleTag.id = 'reduce-motion-styles';
      styleTag.textContent = `
        .reduce-motion * {
          animation-duration: 0.001ms !important;
          transition-duration: 0.001ms !important;
        }
      `;
      document.head.appendChild(styleTag);
    }
    
  }, [lazyLoadImages, disableAnimationsOnLowPower, isLowPowerMode, connectionType]);
  
  // Return performance info that components can use
  return {
    isLowPowerMode,
    connectionType,
    shouldReduceMotion: isLowPowerMode || connectionType === 'slow-2g' || connectionType === '2g'
  };
};

// Helper function to preload critical routes for faster navigation
export const preloadRoutes = (routes: string[]) => {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const link = entry.target as HTMLAnchorElement;
          const href = link.getAttribute('href');
          
          if (href && routes.includes(href) && !preloadedRoutes.has(href)) {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'prefetch';
            preloadLink.href = href;
            document.head.appendChild(preloadLink);
            preloadedRoutes.add(href);
          }
          
          // Unobserve after preloading
          observer.unobserve(entry.target);
        }
      });
    });
    
    // Track which routes have been preloaded
    const preloadedRoutes = new Set<string>();
    
    // Observe all links that match our critical routes
    setTimeout(() => {
      document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && routes.includes(href)) {
          observer.observe(link);
        }
      });
    }, 1000); // Slight delay to not block initial render
  }
};
