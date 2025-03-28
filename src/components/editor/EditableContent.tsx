
import React, { useEffect, useRef, useState, memo } from 'react';
import { getPageContent } from '@/lib/content-service';
import { useLocation } from 'react-router-dom';

interface EditableContentProps {
  id: string;
  children?: React.ReactNode;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
  type?: 'text' | 'image';
  imageSrc?: string;
  imageAlt?: string;
  defaultContent?: string; // Adding defaultContent as optional for backward compatibility
}

const EditableContent: React.FC<EditableContentProps> = ({ 
  id, 
  children, 
  className = '', 
  tag = 'div',
  type = 'text',
  imageSrc,
  imageAlt = '',
  defaultContent // For backward compatibility
}) => {
  const contentRef = useRef<HTMLElement | null>(null);
  const [initialContentSet, setInitialContentSet] = useState(false);
  const [imageSource, setImageSource] = useState(imageSrc);
  const location = useLocation();
  
  // Handle defaultContent (for backward compatibility)
  useEffect(() => {
    if (defaultContent && !children && type === 'text' && contentRef.current && !initialContentSet) {
      // Only use defaultContent if there are no children and content hasn't been set yet
      contentRef.current.innerHTML = defaultContent;
    }
  }, [defaultContent, children, type, initialContentSet]);
  
  // Debug logging - only in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`EditableContent "${id}" mounted with tag: ${tag}, type: ${type}`);
      
      return () => {
        console.log(`EditableContent "${id}" unmounted`);
      };
    }
  }, [id, tag, type]);
  
  // Normalize the current route path for content loading
  const getNormalizedPath = () => {
    const path = location.pathname;
    if (path === '/edit') return '/';
    if (path.endsWith('/edit')) {
      return path.slice(0, -5);
    }
    return path;
  };
  
  // Load saved content on mount
  useEffect(() => {
    // Only run once to avoid overwriting user edits
    if (initialContentSet) return;
    
    const loadContent = async () => {
      try {
        // First try to get content from Supabase
        const pagePath = getNormalizedPath();
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`Trying to load remote content for "${id}" on page "${pagePath}"`);
        }
        
        // Use Promise with a timeout to avoid blocking rendering
        const contentPromise = getPageContent(pagePath);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Content loading timed out')), 3000)
        );
        
        const supabaseContent = await Promise.race([contentPromise, timeoutPromise])
          .catch(err => {
            console.warn('Content loading issue:', err);
            return null;
          });
        
        if (supabaseContent && supabaseContent[id]) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`Found Supabase content for "${id}"`);
          }
          
          if (type === 'text' && contentRef.current) {
            contentRef.current.innerHTML = supabaseContent[id];
            if (process.env.NODE_ENV === 'development') {
              console.log(`Applied Supabase text content for "${id}"`);
            }
          } else if (type === 'image') {
            setImageSource(supabaseContent[id]);
            if (process.env.NODE_ENV === 'development') {
              console.log(`Applied Supabase image source for "${id}"`);
            }
          }
          setInitialContentSet(true);
          return;
        }
        
        // Fall back to localStorage if no Supabase content
        const savedContent = localStorage.getItem('page_content');
        if (process.env.NODE_ENV === 'development') {
          console.log(`Checking localStorage for "${id}" as fallback`);
        }
        
        if (savedContent) {
          const contentMap = JSON.parse(savedContent);
          
          if (contentMap[id]) {
            if (type === 'text' && contentRef.current) {
              contentRef.current.innerHTML = contentMap[id];
              if (process.env.NODE_ENV === 'development') {
                console.log(`Applied localStorage text content for "${id}"`);
              }
            } else if (type === 'image') {
              setImageSource(contentMap[id]);
              if (process.env.NODE_ENV === 'development') {
                console.log(`Applied localStorage image source for "${id}"`);
              }
            }
          }
        }
        
        setInitialContentSet(true);
      } catch (e) {
        console.error('Error loading content:', e);
        setInitialContentSet(true);
      }
    };
    
    // Use requestIdleCallback with proper fallback
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => loadContent());
    } else {
      // Fallback to setTimeout for browsers without requestIdleCallback
      setTimeout(loadContent, 100);
    }
  }, [id, initialContentSet, type, location.pathname]);

  // Create the element with the correct tag
  const TagName = tag as React.ElementType;

  // For image type, render an img with edit attributes
  if (type === 'image') {
    return (
      <img
        src={imageSource || imageSrc}
        alt={imageAlt}
        data-editable={id}
        data-editable-type="image"
        data-original-src={imageSrc}
        className={`editable-image ${className}`}
        loading="lazy"
      />
    );
  }

  // For text type, render the content with the specified tag
  return (
    <TagName
      ref={contentRef as React.RefObject<any>}
      data-editable={id}
      data-editable-type="text"
      className={`editable-text ${className}`}
      suppressContentEditableWarning={true}
    >
      {children}
    </TagName>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(EditableContent);
