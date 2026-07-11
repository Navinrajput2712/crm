import React from 'react';
import { Loader2 } from 'lucide-react';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  children: React.ReactNode;
}

export function AnimatedButton({ 
  variant = 'primary', 
  loading = false, 
  className = '', 
  children, 
  disabled,
  ...props 
}: AnimatedButtonProps) {
  
  const baseClasses = "inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:transform-none disabled:border-transparent cursor-pointer disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover active:bg-primary-active hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-sm focus:ring-primary shadow-sm",
    secondary: "bg-white text-primary border border-primary hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-lg active:bg-gray-100 active:translate-y-0 active:shadow-sm focus:ring-primary shadow-sm"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}
