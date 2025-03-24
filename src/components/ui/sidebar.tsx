
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
        "fixed inset-y-0 left-0 z-50 w-64 border-r border-sidebar-border bg-sidebar-background text-sidebar-foreground shadow",
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
    <div className={cn("p-4", className)} {...props}>
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
        <h1 className="text-xl font-semibold">{children}</h1>
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
        <div className="flex items-center gap-1 text-xs font-medium text-sidebar-foreground/80">
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
        "text-xs font-medium tracking-tight text-sidebar-foreground/80",
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
    <ul className={cn("grid gap-2", className)} {...props}>
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
    <li className={cn("flex flex-col items-center space-y-1", className)} {...props}>
      <Button
        asChild
        variant="ghost"
        size="sm"
        className={cn(
          "w-full justify-start font-normal",
          active && "bg-sidebar-accent text-sidebar-accent-foreground",
          disabled && "pointer-events-none opacity-60"
        )}
      >
        {href ? (
          external ? (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {icon && <span className="mr-2">{icon}</span>}
              {title}
            </a>
          ) : (
            <a href={href}>
              {icon && <span className="mr-2">{icon}</span>}
              {title}
            </a>
          )
        ) : (
          <div>
            {icon && <span className="mr-2">{icon}</span>}
            {title}
          </div>
        )}
      </Button>
      {label && <span className="text-xs">{label}</span>}
    </li>
  )
}

const SidebarFooter = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("p-4", className)} {...props}>
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
