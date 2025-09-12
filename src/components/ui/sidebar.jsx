import React, { createContext, useContext, useState } from "react";
import { cn } from "@/utils";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function Sidebar({ children, className, ...props }) {
  const { isOpen } = useSidebar();
  
  return (
    <aside
      className={cn(
        "flex h-screen w-64 flex-col bg-gray-900 transition-all duration-300",
        !isOpen && "w-0 overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({ children, className, ...props }) {
  return (
    <div className={cn("px-4 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarContent({ children, className, ...props }) {
  return (
    <div className={cn("flex-1 overflow-y-auto", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarFooter({ children, className, ...props }) {
  return (
    <div className={cn("mt-auto", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarGroup({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function SidebarGroupLabel({ children, className, ...props }) {
  return (
    <div className={cn("px-4 py-2 text-sm font-medium", className)} {...props}>
      {children}
    </div>
  );
}

export function SidebarGroupContent({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function SidebarMenu({ children, className, ...props }) {
  return (
    <nav className={cn("space-y-1 px-2", className)} {...props}>
      {children}
    </nav>
  );
}

export function SidebarMenuItem({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export function SidebarMenuButton({ children, className, asChild = false, ...props }) {
  const Comp = asChild ? "div" : "button";
  
  return (
    <Comp
      className={cn(
        "flex w-full items-center rounded-lg px-2 py-2 text-sm hover:bg-gray-800",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function SidebarTrigger({ className, ...props }) {
  const { isOpen, setIsOpen } = useSidebar();
  
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={cn("p-2", className)}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  );
}