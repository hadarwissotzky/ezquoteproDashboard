import React, { useState, createContext, useContext } from "react";
import { cn } from "@/utils";
import { ChevronDown } from "lucide-react";

const SelectContext = createContext();

export function Select({ children, onValueChange, defaultValue, value: controlledValue }) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(defaultValue || "");
  
  const actualValue = controlledValue !== undefined ? controlledValue : value;
  
  const handleValueChange = (newValue) => {
    if (controlledValue === undefined) {
      setValue(newValue);
    }
    onValueChange?.(newValue);
    setIsOpen(false);
  };
  
  return (
    <SelectContext.Provider value={{ isOpen, setIsOpen, value: actualValue, onValueChange: handleValueChange }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ children, className, ...props }) {
  const { isOpen, setIsOpen, value } = useContext(SelectContext);
  
  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      aria-expanded={isOpen}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
}

export function SelectValue({ placeholder }) {
  const { value } = useContext(SelectContext);
  return <span>{value || placeholder}</span>;
}

export function SelectContent({ children, className, ...props }) {
  const { isOpen, setIsOpen } = useContext(SelectContext);
  
  if (!isOpen) return null;
  
  return (
    <>
      <div
        className="fixed inset-0 z-10"
        onClick={() => setIsOpen(false)}
      />
      <div
        className={cn(
          "absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>
  );
}

export function SelectItem({ children, value, className, ...props }) {
  const { onValueChange, value: selectedValue } = useContext(SelectContext);
  const isSelected = selectedValue === value;
  
  return (
    <div
      className={cn(
        "relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-gray-100",
        isSelected && "bg-gray-100 text-gray-900",
        className
      )}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </div>
  );
}

// Legacy exports for backward compatibility
export const SelectOption = SelectItem;