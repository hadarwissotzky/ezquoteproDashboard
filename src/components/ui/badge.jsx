import React from "react";
import { cn } from "@/utils";

const badgeVariants = {
  default: "border-transparent bg-gray-900 text-white hover:bg-gray-900/80",
  secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80",
  destructive: "border-transparent bg-red-500 text-white hover:bg-red-500/80",
  outline: "text-gray-950",
  success: "border-transparent bg-green-500 text-white",
  warning: "border-transparent bg-yellow-500 text-white",
};

export function Badge({ className, variant = "default", ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}