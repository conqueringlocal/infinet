
import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-infinet-600 text-white hover:bg-infinet-700 shadow-sm",
        outline: "border border-infinet-200 bg-transparent hover:bg-infinet-50 text-infinet-800",
        ghost: "hover:bg-infinet-50 text-infinet-800",
        link: "text-infinet-600 underline-offset-4 hover:underline",
        secondary: "bg-infinet-100 text-infinet-900 hover:bg-infinet-200",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        accent: "bg-infinetYellow-400 text-gray-900 hover:bg-infinetYellow-500 shadow-sm",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 py-1 text-xs",
        lg: "h-12 px-8 py-3 text-base",
        icon: "h-10 w-10",
      },
      animation: {
        none: "",
        subtle: "transition-all duration-300 hover:shadow-md hover:-translate-y-1",
        glow: "animate-pulse",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "subtle",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, animation, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, animation, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
