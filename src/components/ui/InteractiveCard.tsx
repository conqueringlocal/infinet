
import React from 'react';
import { cn } from '@/lib/utils';

interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'default' | 'accent' | 'outline' | 'ghost';
  hoverEffect?: 'lift' | 'glow' | 'border' | 'none';
  className?: string;
}

const InteractiveCard = React.forwardRef<HTMLDivElement, InteractiveCardProps>(
  ({ title, description, icon, variant = 'default', hoverEffect = 'lift', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg p-5 transition-all duration-300',
          // Variants
          variant === 'default' && 'bg-white shadow-md',
          variant === 'accent' && 'bg-infinet-50 border border-infinet-200',
          variant === 'outline' && 'border border-gray-200',
          variant === 'ghost' && 'bg-transparent',
          // Hover effects
          hoverEffect === 'lift' && 'hover:-translate-y-1 hover:shadow-lg',
          hoverEffect === 'glow' && 'hover:shadow-[0_0_15px_rgba(21,202,219,0.3)]',
          hoverEffect === 'border' && 'hover:border-infinet-400',
          className
        )}
        {...props}
      >
        {icon && (
          <div className="mb-3 inline-flex items-center justify-center rounded-md bg-infinet-100 p-2 text-infinet-700">
            {icon}
          </div>
        )}
        {title && (
          <h3 className="mb-2 font-semibold text-gray-900">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-gray-600">
            {description}
          </p>
        )}
        {children}
      </div>
    );
  }
);

InteractiveCard.displayName = 'InteractiveCard';

export { InteractiveCard };
