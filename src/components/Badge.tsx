'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: 'bg-blue-600 text-blue-100',
      secondary: 'bg-gray-600 text-gray-100',
      success: 'bg-green-600 text-green-100',
      warning: 'bg-yellow-600 text-yellow-100',
      danger: 'bg-red-600 text-red-100',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
export default Badge;
