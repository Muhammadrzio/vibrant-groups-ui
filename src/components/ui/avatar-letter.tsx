
import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarLetterProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const getInitial = (name: string): string => {
  return name.charAt(0).toUpperCase();
};

const getColor = (name: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-red-500',
    'bg-green-500', 
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
  ];
  
  // Simple hash function for name
  const hash = name.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  return colors[hash % colors.length];
};

export function AvatarLetter({ name, size = 'md', className, ...props }: AvatarLetterProps) {
  const initial = getInitial(name);
  const bgColor = getColor(name);
  
  const sizeStyles = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-16 h-16 text-2xl',
  };

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full text-white font-medium',
        bgColor,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {initial}
    </div>
  );
}

export default AvatarLetter;
