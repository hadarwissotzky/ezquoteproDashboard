import React, { useState } from "react";
import { cn } from "@/utils";

const DropdownMenuContext = React.createContext();

export function DropdownMenu({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ children, className, asChild, ...props }) {
  const { isOpen, setIsOpen } = React.useContext(DropdownMenuContext);
  
  // Filter out asChild prop before spreading to DOM element
  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuContent({ children, className, align = "right", ...props }) {
  const { isOpen, setIsOpen } = React.useContext(DropdownMenuContext);
  
  if (!isOpen) return null;
  
  return (
    <>
      <div
        className="fixed inset-0 z-10"
        onClick={() => setIsOpen(false)}
      />
      <div
        className={cn(
          "absolute z-20 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-gray-950 shadow-md",
          align === "right" ? "right-0" : "left-0",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  );
}

export function DropdownMenuItem({ children, className, onClick, ...props }) {
  const { setIsOpen } = React.useContext(DropdownMenuContext);
  
  const handleClick = (e) => {
    onClick?.(e);
    setIsOpen(false);
  };
  
  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({ className, ...props }) {
  return (
    <div
      className={cn("-mx-1 my-1 h-px bg-gray-100", className)}
      {...props}
    />
  );
}

export function DropdownMenuLabel({ children, className, ...props }) {
  return (
    <div
      className={cn("px-2 py-1.5 text-sm font-semibold", className)}
      {...props}
    >
      {children}
    </div>
  );
}