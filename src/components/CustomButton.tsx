import React from 'react';
import { useAppearance } from '../contexts/appearance-context';

interface CustomButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) => {
  const { accentColor } = useAppearance(); // Now used for dynamic classes

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Color classes based on accentColor
  const colorClasses = {
    blue: {
      bg: 'bg-blue-600',
      text: 'text-white',
      hover: 'hover:bg-blue-700',
      focus: 'focus:ring-blue-500',
      border: 'border-blue-600'
    },
    green: {
      bg: 'bg-green-600',
      text: 'text-white',
      hover: 'hover:bg-green-700',
      focus: 'focus:ring-green-500',
      border: 'border-green-600'
    },
    purple: {
      bg: 'bg-purple-600',
      text: 'text-white',
      hover: 'hover:bg-purple-700',
      focus: 'focus:ring-purple-500',
      border: 'border-purple-600'
    },
    red: {
      bg: 'bg-red-600',
      text: 'text-white',
      hover: 'hover:bg-red-700',
      focus: 'focus:ring-red-500',
      border: 'border-red-600'
    },
    orange: {
      bg: 'bg-orange-600',
      text: 'text-white',
      hover: 'hover:bg-orange-700',
      focus: 'focus:ring-orange-500',
      border: 'border-orange-600'
    }
  };

  const colors = colorClasses[accentColor] || colorClasses.blue;

  // Base button classes
  const baseClasses = `
    inline-flex items-center justify-center
    rounded-lg font-medium
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200
  `;

  // Variant classes
  const variantClasses = {
    primary: `
      ${colors.bg} ${colors.text}
      ${colors.hover} active:scale-95
      shadow-sm hover:shadow-md
      ${colors.focus}
    `,
    secondary: `
      bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white 
      hover:bg-gray-200 dark:hover:bg-gray-700 
      active:bg-gray-300 dark:active:bg-gray-600
      disabled:bg-gray-100 dark:disabled:bg-gray-800 
      disabled:text-gray-500 dark:disabled:text-gray-400
      focus:ring-gray-500/20
    `,
    outline: `
      ${colors.border} ${colors.text}
      hover:bg-${accentColor}-50 dark:hover:bg-${accentColor}-900/20
      active:bg-${accentColor}-100 dark:active:bg-${accentColor}-800/30
      disabled:border-gray-300 dark:disabled:border-gray-500 
      disabled:text-gray-500 dark:disabled:text-gray-400
      ${colors.focus}
    `,
    ghost: `
      ${colors.text}
      hover:bg-${accentColor}-50 dark:hover:bg-${accentColor}-900/20
      active:bg-${accentColor}-100 dark:active:bg-${accentColor}-800/30
      disabled:text-gray-500 dark:disabled:text-gray-400
      ${colors.focus}
    `
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};