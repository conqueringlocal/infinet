
import * as React from "react"
import { cn } from "@/lib/utils"
import parse from 'html-react-parser'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  preview?: boolean;
  previewClassName?: string;
  fullPreview?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, preview, previewClassName, fullPreview, value, ...props }, ref) => {
    if (preview) {
      return (
        <div className={fullPreview ? "w-full" : "flex flex-col md:flex-row gap-4 w-full"}>
          {!fullPreview && (
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
          )}
          <div className={cn(
            "flex-1 border rounded-md overflow-auto",
            fullPreview ? "min-h-[500px] bg-white p-6" : "p-4 bg-white", 
            previewClassName
          )}>
            {typeof value === 'string' && value ? (
              <div 
                className="prose max-w-none"
                style={fullPreview ? { margin: '0 auto', maxWidth: '1200px' } : {}}
              >
                {parse(value)}
              </div>
            ) : (
              <div className="text-gray-400 italic">Preview will appear here</div>
            )}
          </div>
          {fullPreview && (
            <div className="mt-4">
              <textarea
                className={cn(
                  "flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono",
                  className
                )}
                ref={ref}
                value={value}
                {...props}
              />
            </div>
          )}
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
