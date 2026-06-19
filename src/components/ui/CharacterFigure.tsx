import { motion } from 'framer-motion';
import type { Character } from '@/data/characters';
import { cn } from '@/lib/utils';

interface CharacterFigureProps {
  character: Character;
  className?: string;
  /** Soft colored halo behind the figure. */
  glow?: boolean;
  /** Gentle idle float. */
  float?: boolean;
  priority?: boolean;
}

/**
 * Renders a character figurine PNG with a colored halo and a slow
 * idle float. Drop the real 3D render at the matching path in
 * `src/assets/characters/` and it appears here automatically.
 */
export default function CharacterFigure({
  character,
  className,
  glow = true,
  float = true,
  priority = false,
}: CharacterFigureProps) {
  return (
    <div className={cn('relative flex items-end justify-center', className)}>
      {glow && (
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -z-10 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px]"
          style={{ background: character.world.deep, opacity: 0.55 }}
        />
      )}
      <motion.img
        src={character.image}
        alt={`${character.alias} — ${character.section}`}
        draggable={false}
        loading={priority ? 'eager' : 'lazy'}
        className="h-full w-full select-none object-contain object-bottom drop-shadow-2xl"
        animate={float ? { y: [0, -14, 0] } : undefined}
        transition={
          float
            ? { duration: 6, repeat: Infinity, ease: 'easeInOut' }
            : undefined
        }
      />
    </div>
  );
}
