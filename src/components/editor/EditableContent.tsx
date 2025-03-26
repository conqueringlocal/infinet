
import React, { useEffect, useRef, useState } from 'react';

interface EditableContentProps {
  id: string;
  children: React.ReactNode;
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
  
  // Debug logging
  useEffect(() => {
    console.log(`EditableContent "${id}" mounted with tag: ${tag}, type: ${type}`);
    
    return () => {
      console.log(`EditableContent "${id}" unmounted`);
    };
  }, [id, tag, type]);
  
  // Load saved content from localStorage
  useEffect(() => {
    // Only run once to avoid overwriting user edits
    if (initialContentSet) return;
    
    try {
      // Get stored content from localStorage
      const savedContent = localStorage.getItem('page_content');
      console.log(`Checking for saved content for "${id}"`);
      
      if (savedContent) {
        const contentMap = JSON.parse(savedContent);
        
        if (contentMap[id]) {
          if (type === 'text' && contentRef.current) {
            contentRef.current.innerHTML = contentMap[id];
            console.log(`Loaded saved text content for "${id}"`);
          } else if (type === 'image' && contentMap[id].startsWith('http')) {
            setImageSource(contentMap[id]);
            console.log(`Loaded saved image source for "${id}"`);
          }
        } else {
          console.log(`No saved content for "${id}"`);
        }
      } else {
        console.log('No saved content found in localStorage');
      }
    } catch (e) {
      console.error('Error parsing saved content', e);
    }
    
    setInitialContentSet(true);
  }, [id, initialContentSet, type]);

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
        className={className}
      />
    );
  }

  // For text type, render the content with the specified tag
  return (
    <TagName
      ref={contentRef as React.RefObject<any>}
      data-editable={id}
      data-editable-type="text"
      className={className}
      suppressContentEditableWarning={true}
    >
      {children}
    </TagName>
  );
};

export default EditableContent;
