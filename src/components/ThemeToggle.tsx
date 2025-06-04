'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'p-2 rounded-full border transition-all duration-200 ease-out',
        'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500',
        'bg-gray-100 border-gray-300 hover:bg-gray-200',
        'dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700'
      )}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-blue-600" />
      )}
    </button>
  );
}
