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
        'flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-500 ease-out',
        'shadow-lg backdrop-blur-md outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
        isDay
          ? 'bg-white/90 border border-zinc-200 focus-visible:ring-amber-400/60'
          : 'bg-zinc-950/80 border border-zinc-700 focus-visible:ring-zinc-400/50',
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
            'flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-500 ease-out',
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
            'flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-500 ease-out',
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
