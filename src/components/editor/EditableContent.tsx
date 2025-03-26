
import React, { useEffect, useRef, useState } from 'react';

interface EditableContentProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
}

const EditableContent: React.FC<EditableContentProps> = ({ 
  id, 
  children, 
  className = '', 
  tag = 'div' 
}) => {
  const contentRef = useRef<HTMLElement | null>(null);
  const [initialContentSet, setInitialContentSet] = useState(false);
  
  // Debug logging to help diagnose issues
  useEffect(() => {
    console.log(`EditableContent ${id} mounted`);
    
    return () => {
      console.log(`EditableContent ${id} unmounted`);
    };
  }, [id]);
  
  useEffect(() => {
    // Only run once to avoid overwriting user edits
    if (initialContentSet) return;
    
    // Load saved content from localStorage if available
    const savedContent = localStorage.getItem('page_content');
    
    if (savedContent) {
      try {
        const contentMap = JSON.parse(savedContent);
        if (contentMap[id] && contentRef.current) {
          contentRef.current.innerHTML = contentMap[id];
          console.log(`Loaded saved content for "${id}"`);
        }
      } catch (e) {
        console.error('Error parsing saved content', e);
      }
    }
    
    setInitialContentSet(true);
  }, [id, initialContentSet]);

  // Create the element with the correct tag
  const TagName = tag as React.ElementType;

  return (
    <TagName
      ref={contentRef as React.RefObject<any>}
      data-editable={id}
      className={className}
    >
      {children}
    </TagName>
  );
};

export default EditableContent;
