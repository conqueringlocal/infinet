
import * as React from "react"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/Button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
}

const Sidebar = ({ className, children, ...props }: SidebarProps) => {
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white text-gray-800 shadow",
        className
      )}
      {...props}
    >
      <div className="flex h-full flex-1 flex-col">
        <ScrollArea className="flex-1">{children}</ScrollArea>
      </div>
    </div>
  )
}

const SidebarHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  )
}

const SidebarHeaderTitle = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      <div className="grid gap-0.5">
        <h1 className="text-2xl font-semibold tracking-tight">{children}</h1>
      </div>
    </div>
  )
}

const SidebarNav = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("grid gap-4 p-4", className)} {...props}>
      {children}
    </div>
  )
}

const SidebarNavHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("grid gap-1 px-3 py-2", className)}
      {...props}
    >
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1 text-sm font-medium text-gray-500">
          {children}
        </div>
      </div>
    </div>
  )
}

const SidebarNavTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h3
      className={cn(
        "text-sm font-medium tracking-tight text-gray-500",
        className
      )}
      {...props}
    />
  )
}

const SidebarNavItems = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) => {
  return (
    <ul className={cn("grid gap-1", className)} {...props}>
      {children}
    </ul>
  )
}

const SidebarNavItem = ({
  className,
  href,
  disabled,
  icon,
  title,
  label,
  active,
  external,
  ...props
}: React.LiHTMLAttributes<HTMLLIElement> & {
  href?: string
  disabled?: boolean
  icon?: React.ReactNode
  title?: string
  label?: string
  active?: boolean
  external?: boolean
}) => {
  return (
    <li className={cn("flex flex-col", className)} {...props}>
      <Button
        asChild
        variant="ghost"
        size="sm"
        className={cn(
          "w-full justify-start font-medium text-gray-700 hover:bg-infinet-50 hover:text-infinet-600",
          active && "bg-infinet-50 text-infinet-600",
          disabled && "pointer-events-none opacity-60"
        )}
      >
        {href ? (
          external ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center py-2">
              {icon && <span className="mr-3 text-infinet-500">{icon}</span>}
              {title}
            </a>
          ) : (
            <a href={href} className="flex items-center py-2">
              {icon && <span className="mr-3 text-infinet-500">{icon}</span>}
              {title}
            </a>
          )
        ) : (
          <div className="flex items-center py-2">
            {icon && <span className="mr-3 text-infinet-500">{icon}</span>}
            {title}
          </div>
        )}
      </Button>
      {label && <span className="text-xs pl-9 text-gray-500">{label}</span>}
    </li>
  )
}

const SidebarFooter = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("p-4 border-t border-gray-200", className)} {...props}>
      {children}
    </div>
  )
}

export {
  Sidebar,
  SidebarHeader,
  SidebarHeaderTitle,
  SidebarNav,
  SidebarNavHeader,
  SidebarNavTitle,
  SidebarNavItems,
  SidebarNavItem,
  SidebarFooter,
}
