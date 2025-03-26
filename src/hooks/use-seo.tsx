
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
}

/**
 * Hook to set SEO metadata for each page
 */
export const useSEO = ({
  title = 'Infi-NET LLC | Fiber & Low-Voltage Solutions',
  description = 'Professional fiber optic and low-voltage solutions for businesses across the United States. Expert installation, maintenance, and design services.',
  keywords = 'fiber optic installation, low voltage solutions, structured cabling, network solutions, IT infrastructure',
  ogImage = '/og-image.png',
  ogType = 'website'
}: SEOProps) => {
  const location = useLocation();
  
  useEffect(() => {
    // Set page title
    document.title = title;
    
    // Update meta tags
    const metaTags = {
      description,
      keywords,
      'og:title': title,
      'og:description': description,
      'og:type': ogType,
      'og:url': `https://infi-net.net${location.pathname}`,
      'og:image': ogImage,
      'twitter:title': title,
      'twitter:description': description
    };
    
    // Update existing or create new meta tags
    Object.entries(metaTags).forEach(([name, content]) => {
      let metaTag: HTMLMetaElement | null;
      
      if (name.startsWith('og:')) {
        metaTag = document.querySelector(`meta[property="${name}"]`);
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('property', name);
          document.head.appendChild(metaTag);
        }
      } else {
        metaTag = document.querySelector(`meta[name="${name}"]`);
        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('name', name);
          document.head.appendChild(metaTag);
        }
      }
      
      metaTag.setAttribute('content', content);
    });
    
    // Set canonical URL
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', `https://infi-net.net${location.pathname}`);
    
    return () => {
      // Cleanup function if needed
    };
  }, [title, description, keywords, ogImage, ogType, location.pathname]);
};
