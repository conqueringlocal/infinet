
import React, { useEffect, useRef } from 'react';

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
  
  useEffect(() => {
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
  }, [id]);

  // Cast the ref to any as a workaround for TypeScript with dynamic elements
  return React.createElement(
    Tag,
    {
      'data-editable': id,
      className,
      ref: contentRef as any
    },
    children
  );
};

export default EditableContent;
