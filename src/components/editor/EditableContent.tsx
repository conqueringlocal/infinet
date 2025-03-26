
import React, { useEffect, useRef, useState } from 'react';
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
}

const EditableContent: React.FC<EditableContentProps> = ({ 
  id, 
  children, 
  className = '', 
  tag = 'div',
  type = 'text',
  imageSrc,
  imageAlt = ''
}) => {
  const contentRef = useRef<HTMLElement | null>(null);
  const [initialContentSet, setInitialContentSet] = useState(false);
  const [imageSource, setImageSource] = useState(imageSrc);
  const location = useLocation();
  
  // Debug logging
  useEffect(() => {
    console.log(`EditableContent "${id}" mounted with tag: ${tag}, type: ${type}`);
    
    return () => {
      console.log(`EditableContent "${id}" unmounted`);
    };
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
        console.log(`Trying to load remote content for "${id}" on page "${pagePath}"`);
        
        const supabaseContent = await getPageContent(pagePath);
        
        if (supabaseContent && supabaseContent[id]) {
          console.log(`Found Supabase content for "${id}"`);
          if (type === 'text' && contentRef.current) {
            contentRef.current.innerHTML = supabaseContent[id];
            console.log(`Applied Supabase text content for "${id}"`);
          } else if (type === 'image') {
            setImageSource(supabaseContent[id]);
            console.log(`Applied Supabase image source for "${id}"`);
          }
          setInitialContentSet(true);
          return;
        }
        
        // Fall back to localStorage if no Supabase content
        const savedContent = localStorage.getItem('page_content');
        console.log(`Checking localStorage for "${id}" as fallback`);
        
        if (savedContent) {
          const contentMap = JSON.parse(savedContent);
          
          if (contentMap[id]) {
            if (type === 'text' && contentRef.current) {
              contentRef.current.innerHTML = contentMap[id];
              console.log(`Applied localStorage text content for "${id}"`);
            } else if (type === 'image') {
              setImageSource(contentMap[id]);
              console.log(`Applied localStorage image source for "${id}"`);
            }
          } else {
            console.log(`No saved content for "${id}" in localStorage`);
          }
        } else {
          console.log('No saved content found in localStorage');
        }
        
        setInitialContentSet(true);
      } catch (e) {
        console.error('Error loading content:', e);
        setInitialContentSet(true);
      }
    };
    
    loadContent();
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

export default EditableContent;
