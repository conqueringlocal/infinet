
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  interactive?: boolean;
  hoverEffect?: 'raise' | 'glow' | 'border' | 'none';
  animation?: 'fadeIn' | 'slideUp' | 'none';
  variant?: 'default' | 'glass';
}

const InteractiveCard = React.forwardRef<HTMLDivElement, InteractiveCardProps>(
  ({
    className,
    title,
    description,
    footer,
    children,
    headerClassName,
    contentClassName,
    footerClassName,
    interactive = true,
    hoverEffect = 'raise',
    animation = 'none',
    variant = 'default',
    ...props
  }, ref) => {
    const hoverClasses = interactive ? {
      raise: 'transition-all duration-300 hover:-translate-y-2 hover:shadow-lg',
      glow: 'transition-all duration-300 hover:shadow-[0_0_15px_rgba(14,165,233,0.3)]',
      border: 'transition-all duration-300 hover:border-infinet-400',
      none: ''
    }[hoverEffect] : '';
    
    const animationClasses = {
      fadeIn: 'animate-fade-in',
      slideUp: 'animate-fade-in-right',
      none: ''
    }[animation];
    
    const variantClasses = {
      default: 'bg-card',
      glass: 'glass-panel backdrop-blur-md bg-white/80 border border-white/20'
    }[variant];
    
    return (
      <Card 
        ref={ref}
        className={cn(
          'overflow-hidden',
          hoverClasses,
          animationClasses,
          variantClasses,
          className
        )}
        {...props}
      >
        {title || description ? (
          <CardHeader className={headerClassName}>
            {title && typeof title === 'string' ? (
              <CardTitle>{title}</CardTitle>
            ) : (
              title
            )}
            {description && typeof description === 'string' ? (
              <CardDescription>{description}</CardDescription>
            ) : (
              description
            )}
          </CardHeader>
        ) : null}
        
        {children && (
          <CardContent className={cn('', contentClassName)}>
            {children}
          </CardContent>
        )}
        
        {footer && (
          <CardFooter className={cn('flex justify-between', footerClassName)}>
            {footer}
          </CardFooter>
        )}
      </Card>
    );
  }
);

InteractiveCard.displayName = 'InteractiveCard';

export { InteractiveCard };
