import React from "react";
import { cn } from "@/utils";

const alertVariants = {
  default: "bg-white text-gray-950 border-gray-200",
  destructive: "border-red-500/50 text-red-600 bg-red-50",
  warning: "border-yellow-500/50 text-yellow-600 bg-yellow-50",
  success: "border-green-500/50 text-green-600 bg-green-50",
};

export const Alert = React.forwardRef(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(
      "relative w-full rounded-lg border p-4",
      alertVariants[variant],
      className
    )}
    {...props}
  />
));
Alert.displayName = "Alert";

export const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";