import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CornerDownRight } from 'lucide-react';
import { CHARACTERS, CHARACTER_COUNT, getByIndex } from '@/data/characters';
import { SECTION_FOR } from '@/data/content';
import { useWorld } from '@/hooks/useWorld';
import { scrollToId } from '@/lib/scroll';

type Role = 'center' | 'left' | 'right' | 'back';

function roleFor(index: number, active: number): Role {
  const d = ((index - active) % CHARACTER_COUNT + CHARACTER_COUNT) % CHARACTER_COUNT;
  if (d === 0) return 'center';
  if (d === 1) return 'right';
  if (d === CHARACTER_COUNT - 1) return 'left';
  return 'back';
}

function roleStyle(role: Role, isMobile: boolean): React.CSSProperties {
  const base: React.CSSProperties = {
    position: 'absolute',
    transition:
      'transform 700ms cubic-bezier(0.4,0,0.2,1), filter 700ms cubic-bezier(0.4,0,0.2,1), opacity 700ms cubic-bezier(0.4,0,0.2,1), left 700ms cubic-bezier(0.4,0,0.2,1)',
    willChange: 'transform, filter, opacity, left',
  };
  switch (role) {
    case 'center':
      return {
        ...base,
        left: '50%',
        bottom: 0,
        height: isMobile ? '58%' : '90%',
        transform: `translateX(-50%) scale(${isMobile ? 1.15 : 1.5})`,
        filter: 'none',
        opacity: 1,
        zIndex: 20,
      };
    case 'left':
      return {
        ...base,
        left: isMobile ? '18%' : '28%',
        bottom: isMobile ? '30%' : '12%',
        height: isMobile ? '16%' : '30%',
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.8,
        zIndex: 10,
      };
    case 'right':
      return {
        ...base,
        left: isMobile ? '82%' : '72%',
        bottom: isMobile ? '30%' : '12%',
        height: isMobile ? '16%' : '30%',
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(2px)',
        opacity: 0.8,
        zIndex: 10,
      };
    case 'back':
      return {
        ...base,
        left: '50%',
        bottom: isMobile ? '32%' : '14%',
        height: isMobile ? '12%' : '22%',
        transform: 'translateX(-50%) scale(1)',
        filter: 'blur(4px)',
        opacity: 0.85,
        zIndex: 5,
      };
  }
}

/**
 * The Navigator — a figurine carousel where every rotation recolors
 * the whole world and points to one of the four sections.
 * Drag, arrows, dots and keyboard all drive it.
 */
export default function CharacterCarousel() {
  const { active, character, next, prev, goTo } = useWorld();
  const [isMobile, setIsMobile] = useState(false);
  const lockRef = useRef(false);
  const dragStart = useRef<number | null>(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Keyboard arrows when the section is in view.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') guardedNav(next);
      if (e.key === 'ArrowLeft') guardedNav(prev);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [next, prev]);

  const guardedNav = (fn: () => void) => {
    if (lockRef.current) return;
    lockRef.current = true;
    fn();
    setTimeout(() => (lockRef.current = false), 680);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const dx = e.clientX - dragStart.current;
    if (Math.abs(dx) > 60) guardedNav(dx < 0 ? next : prev);
    dragStart.current = null;
  };

  const enterSection = () => scrollToId(SECTION_FOR[character.key]);

  return (
    <section
      id="navigator"
      aria-label="Selector de secciones"
      className="grain relative h-[100svh] w-full select-none overflow-hidden transition-[background-color] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
      style={{ backgroundColor: character.world.bg }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {/* Brand label */}
      <div className="absolute left-5 top-6 z-[60] sm:left-8">
        <span
          className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em]"
          style={{ color: character.world.ink }}
        >
          Jandro·OS
        </span>
      </div>

      {/* Step counter */}
      <div className="absolute right-5 top-6 z-[60] sm:right-8">
        <span
          className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em]"
          style={{ color: character.world.ink }}
        >
          {String(active % CHARACTER_COUNT + 1).padStart(2, '0')} / {String(CHARACTER_COUNT).padStart(2, '0')}
        </span>
      </div>

      {/* Giant ghost word */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[14%] z-[2] flex justify-center"
        aria-hidden
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={character.ghost}
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -30, filter: 'blur(8px)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="heading-kinetic whitespace-nowrap"
            style={{
              color: character.world.accent,
              fontSize: 'clamp(90px, 26vw, 360px)',
              lineHeight: 1,
            }}
          >
            {character.ghost}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Figures */}
      <div className="absolute inset-0 z-[3]">
        {CHARACTERS.map((c) => {
          const role = roleFor(c.index, active % CHARACTER_COUNT);
          return (
            <div
              key={c.key}
              style={{ ...roleStyle(role, isMobile), aspectRatio: '0.62 / 1' }}
              onClick={() => {
                if (role === 'left') guardedNav(prev);
                else if (role === 'right') guardedNav(next);
                else if (role === 'center') enterSection();
              }}
              data-cursor={role === 'center' ? 'hover' : undefined}
              data-cursor-label={role === 'center' ? 'Entrar' : undefined}
            >
              <img
                src={c.image}
                alt={`${c.alias} — ${c.section}`}
                draggable={false}
                className="h-full w-full object-contain object-bottom"
              />
            </div>
          );
        })}
      </div>

      {/* Bottom-left: title + nav */}
      <div className="absolute bottom-6 left-5 z-[60] max-w-[340px] sm:bottom-16 sm:left-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={character.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <p
              className="font-mono text-[11px] uppercase tracking-[0.3em] opacity-80"
              style={{ color: character.world.ink }}
            >
              {character.alias}
            </p>
            <h2
              className="heading-kinetic mt-1 text-[clamp(2.2rem,6vw,4rem)]"
              style={{ color: character.world.accent }}
            >
              {character.section}
            </h2>
            <p
              className="mt-2 text-sm leading-relaxed sm:text-[15px]"
              style={{ color: character.world.ink, opacity: 0.85 }}
            >
              {character.tagline}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={() => guardedNav(prev)}
            aria-label="Anterior"
            data-cursor="hover"
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 transition-transform duration-150 hover:scale-110 sm:h-14 sm:w-14"
            style={{ borderColor: character.world.ink, color: character.world.ink }}
          >
            <ArrowLeft size={22} strokeWidth={2.25} />
          </button>
          <button
            onClick={() => guardedNav(next)}
            aria-label="Siguiente"
            data-cursor="hover"
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 transition-transform duration-150 hover:scale-110 sm:h-14 sm:w-14"
            style={{ borderColor: character.world.ink, color: character.world.ink }}
          >
            <ArrowRight size={22} strokeWidth={2.25} />
          </button>
        </div>
      </div>

      {/* Bottom-right: enter CTA */}
      <button
        onClick={enterSection}
        data-cursor="hover"
        data-cursor-label="Ir"
        className="group absolute bottom-6 right-5 z-[60] flex items-center gap-2 sm:bottom-16 sm:right-12"
        style={{ color: character.world.accent }}
      >
        <span
          className="heading-kinetic text-[clamp(1.4rem,4vw,3rem)] transition-opacity"
          style={{ opacity: 0.95 }}
        >
          Entrar
        </span>
        <CornerDownRight
          className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1 sm:h-9 sm:w-9"
          strokeWidth={2.25}
        />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 z-[60] flex -translate-x-1/2 gap-2 sm:bottom-6">
        {CHARACTERS.map((c, i) => {
          const isActive = i === active % CHARACTER_COUNT;
          return (
            <button
              key={c.key}
              onClick={() => guardedNav(() => goTo(i))}
              aria-label={`Ir a ${getByIndex(i).section}`}
              data-cursor="hover"
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: isActive ? 28 : 8,
                background: character.world.ink,
                opacity: isActive ? 1 : 0.4,
              }}
            />
          );
        })}
      </div>
    </section>
  );
}
