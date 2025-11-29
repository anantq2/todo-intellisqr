import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className, 
  disabled, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 disabled:opacity-50 disabled:pointer-events-none ring-offset-zinc-950";
  
  const variants = {
    // High contrast: White background, Black text. Very modern/clean.
    primary: "bg-zinc-100 text-zinc-950 hover:bg-white border border-transparent shadow-sm",
    // Subtle secondary
    secondary: "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700",
    // Orange/Red for danger to pop against the monochrome
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-900/50",
    ghost: "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200",
  };

  const sizes = "h-10 py-2 px-4";

  return (
    <button
      className={twMerge(baseStyles, variants[variant], sizes, className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};