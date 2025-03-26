
import * as React from "react"
import { cn } from "@/lib/utils"
import parse from 'html-react-parser'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  preview?: boolean;
  previewClassName?: string;
  fullPreview?: boolean;
  editMode?: 'code' | 'visual';
  onVisualEdit?: (newContent: string) => void;
  showRealPage?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, preview, previewClassName, fullPreview, editMode = 'code', onVisualEdit, value, showRealPage, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<string | undefined>(value as string);
    
    // Update internal value when external value changes
    React.useEffect(() => {
      setInternalValue(value as string);
    }, [value]);
    
    // Handle contentEditable changes
    const handleContentEditableChange = (e: React.FormEvent<HTMLDivElement>) => {
      const newContent = e.currentTarget.innerHTML;
      if (onVisualEdit) {
        onVisualEdit(newContent);
      }
    };
    
    if (preview) {
      return (
        <div className={fullPreview ? "w-full" : "flex flex-col md:flex-row gap-4 w-full"}>
          {!fullPreview && editMode === 'code' && (
            <div className="flex-1">
              <textarea
                className={cn(
                  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  className
                )}
                ref={ref}
                value={internalValue}
                onChange={(e) => {
                  setInternalValue(e.target.value);
                  if (props.onChange) {
                    props.onChange(e);
                  }
                }}
                {...props}
              />
            </div>
          )}
          <div className={cn(
            "flex-1 border rounded-md overflow-auto",
            fullPreview ? "min-h-[500px] bg-white p-6" : "p-4 bg-white", 
            showRealPage ? "real-page-preview" : "",
            previewClassName
          )}>
            {typeof internalValue === 'string' && internalValue ? (
              <div 
                className={cn("prose max-w-none", showRealPage ? "real-page-content" : "")}
                style={fullPreview ? { margin: '0 auto', maxWidth: '1200px' } : {}}
                contentEditable={editMode === 'visual'}
                onBlur={handleContentEditableChange}
                onInput={editMode === 'visual' ? handleContentEditableChange : undefined}
                dangerouslySetInnerHTML={{ __html: internalValue }}
                suppressContentEditableWarning
              />
            ) : (
              <div className="text-gray-400 italic">Preview will appear here</div>
            )}
          </div>
          {fullPreview && editMode === 'code' && (
            <div className="mt-4">
              <textarea
                className={cn(
                  "flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono",
                  className
                )}
                ref={ref}
                value={internalValue}
                onChange={(e) => {
                  setInternalValue(e.target.value);
                  if (props.onChange) {
                    props.onChange(e);
                  }
                }}
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
        value={value}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
