import { useEffect, useRef, type ReactNode } from 'react';
import type { Character } from '@/data/characters';
import { useWorld } from '@/hooks/useWorld';
import CharacterFigure from '../ui/CharacterFigure';
import { cn } from '@/lib/utils';

interface SectionProps {
  id: string;
  character: Character;
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * Themed section shell. Bathes itself in a dark tint of the
 * character's color and, while in view, syncs the global world
 * so the cursor / selection / carousel all follow the reader.
 */
export default function Section({
  id,
  character,
  eyebrow,
  title,
  children,
  className,
}: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { goTo, active } = useWorld();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && active !== character.index) {
          goTo(character.index);
        }
      },
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character.index, active]);

  return (
    <section
      ref={ref}
      id={id}
      className={cn('relative w-full overflow-hidden px-5 py-24 sm:px-8 sm:py-32', className)}
      style={{
        background: `color-mix(in srgb, ${character.world.bg} 12%, #0a0a0a)`,
      }}
    >
      {/* Section header */}
      <div className="relative z-10 mx-auto mb-12 flex max-w-6xl flex-col gap-4 sm:mb-20">
        <div className="flex items-center gap-3">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: character.world.bg }}
          />
          <span
            className="font-mono text-[11px] uppercase tracking-[0.3em]"
            style={{ color: character.world.bg }}
          >
            {eyebrow}
          </span>
        </div>
        <h2
          className="heading-kinetic text-[clamp(2.8rem,12vw,9rem)] leading-[0.82] text-bone"
        >
          {title}
        </h2>
      </div>

      {/* Floating character, large but subtle, behind content */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 top-1/2 z-0 hidden h-[80%] w-[34%] -translate-y-1/2 opacity-[0.13] lg:block"
      >
        <CharacterFigure character={character} glow={false} float className="h-full w-full" />
      </div>

      <div className="relative z-10">{children}</div>
    </section>
  );
}
