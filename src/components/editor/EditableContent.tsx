
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
  
  // Debug logging
  useEffect(() => {
    console.log(`EditableContent "${id}" mounted with tag: ${tag}`);
    
    return () => {
      console.log(`EditableContent "${id}" unmounted`);
    };
  }, [id, tag]);
  
  // Load saved content from localStorage
  useEffect(() => {
    // Only run once to avoid overwriting user edits
    if (initialContentSet) return;
    
    const savedContent = localStorage.getItem('page_content');
    console.log(`Checking for saved content for "${id}"`);
    
    if (savedContent) {
      try {
        const contentMap = JSON.parse(savedContent);
        if (contentMap[id] && contentRef.current) {
          contentRef.current.innerHTML = contentMap[id];
          console.log(`Loaded saved content for "${id}"`);
        } else {
          console.log(`No saved content for "${id}" or ref not ready`);
        }
      } catch (e) {
        console.error('Error parsing saved content', e);
      }
    } else {
      console.log('No saved content found in localStorage');
    }
    
    setInitialContentSet(true);
  }, [id, initialContentSet]);

  // Create the element with the correct tag
  const TagName = tag as React.ElementType;

  // The data-editable attribute is what the InPlaceEditor looks for
  return (
    <TagName
      ref={contentRef as React.RefObject<any>}
      data-editable={id}
      className={className}
      suppressContentEditableWarning={true}
    >
      {children}
    </TagName>
  );
};

export default EditableContent;
