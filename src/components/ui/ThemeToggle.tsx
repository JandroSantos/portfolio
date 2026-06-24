import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  isDay: boolean;
  onToggle: () => void;
  lang: string;
  className?: string;
}

export function ThemeToggle({ isDay, onToggle, className }: ThemeToggleProps) {
  return (
    <div
      className={cn(
        'flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300',
        isDay
          ? 'bg-white border border-zinc-200'
          : 'bg-zinc-950 border border-zinc-800',
        className
      )}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? onToggle() : undefined}
      aria-label={isDay ? 'Switch to night' : 'Switch to day'}
    >
      <div className="flex justify-between items-center w-full">
        {/* Left thumb */}
        <div
          className={cn(
            'flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300',
            isDay
              ? 'transform translate-x-8 bg-gray-200'
              : 'transform translate-x-0 bg-zinc-800'
          )}
        >
          {isDay ? (
            <Sun className="w-4 h-4 text-gray-700" strokeWidth={1.5} />
          ) : (
            <Moon className="w-4 h-4 text-white" strokeWidth={1.5} />
          )}
        </div>

        {/* Right icon */}
        <div
          className={cn(
            'flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300',
            isDay
              ? 'transform -translate-x-8'
              : 'bg-transparent'
          )}
        >
          {isDay ? (
            <Moon className="w-4 h-4 text-black" strokeWidth={1.5} />
          ) : (
            <Sun className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
          )}
        </div>
      </div>
    </div>
  );
}
