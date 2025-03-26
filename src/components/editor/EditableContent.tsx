
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
  tag: Tag = 'div' 
}) => {
  const contentRef = useRef<HTMLElement>(null);
  const [initialContentSet, setInitialContentSet] = useState(false);
  
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
          setInitialContentSet(true);
        } else {
          // If we don't have saved content for this ID, mark as initialized
          setInitialContentSet(true);
        }
      } catch (e) {
        console.error('Error parsing saved content', e);
        setInitialContentSet(true);
      }
    } else {
      // No saved content at all, mark as initialized
      setInitialContentSet(true);
    }
  }, [id, initialContentSet]);

  // Create the element with appropriate props
  return React.createElement(
    Tag,
    {
      'data-editable': id,
      className,
      ref: contentRef as any,
      // Always render children initially, don't use dangerouslySetInnerHTML for initial render
    },
    children
  );
};

export default EditableContent;
