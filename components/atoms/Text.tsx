import React from 'react';

interface TextProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Text: React.FC<TextProps> = ({ 
  children, 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <p className={`${sizeClasses[size]} ${className}`}>
      {children}
    </p>
  );
};
