
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  preview?: boolean;
  previewClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, preview, previewClassName, value, ...props }, ref) => {
    if (preview) {
      return (
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1">
            <textarea
              className={cn(
                "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
              )}
              ref={ref}
              value={value}
              {...props}
            />
          </div>
          <div className={cn("flex-1 border rounded-md p-4 overflow-auto bg-white", previewClassName)}>
            <div 
              className="prose max-w-none" 
              dangerouslySetInnerHTML={{ __html: typeof value === 'string' ? value : '' }}
            />
          </div>
        </div>
      )
    }

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
