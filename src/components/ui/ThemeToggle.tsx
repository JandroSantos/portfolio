import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  isDay: boolean;
  onToggle: () => void;
  lang: string;
}

export function ThemeToggle({ isDay, onToggle, lang }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute flex items-center h-8 w-16 rounded-full border p-1 cursor-pointer select-none backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-1 focus:ring-white/20"
      style={{
        right: '1.25rem',
        top: '68px',
        borderColor: isDay ? 'rgba(122, 64, 16, 0.4)' : 'rgba(255, 255, 255, 0.25)',
        background: isDay ? 'rgba(255, 240, 200, 0.25)' : 'rgba(0, 0, 0, 0.4)',
      }}
      aria-label={
        isDay
          ? (lang === 'es' ? 'Cambiar a noche' : 'Switch to night')
          : (lang === 'es' ? 'Cambiar a día' : 'Switch to day')
      }
    >
      <div className="relative w-full h-full flex items-center justify-between px-1 text-bone">
        {/* Background Icons */}
        <Sun className={cn("h-3 w-3 transition-opacity duration-300", isDay ? "opacity-90 text-amber-500" : "opacity-25")} />
        <Moon className={cn("h-3 w-3 transition-opacity duration-300", !isDay ? "opacity-90 text-indigo-200" : "opacity-25")} />

        {/* Sliding Thumb */}
        <motion.div
          className="absolute top-0 bottom-0 my-auto left-1 h-5.5 w-5.5 rounded-full flex items-center justify-center shadow-md"
          animate={{ x: isDay ? 30 : 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          style={{
            background: isDay ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)',
          }}
        >
          {isDay ? (
            <Sun className="h-2.5 w-2.5 text-white" strokeWidth={2.5} />
          ) : (
            <Moon className="h-2.5 w-2.5 text-amber-100" strokeWidth={2.5} />
          )}
        </motion.div>
      </div>
    </button>
  );
}
