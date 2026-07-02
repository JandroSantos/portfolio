import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from 'framer-motion';
import { useWorld } from '@/hooks/useWorld';
import { hexA, prefersReducedMotion } from '@/lib/utils';

/**
 * Two-part scroll indicator, both tinted to the active world:
 *  - a hairline gradient bar pinned to the very top with a soft accent glow;
 *  - a glass circular dial in the bottom-right corner that fills as you read
 *    and doubles as a "back to top" control (revealed only once you scroll).
 *
 * The dial hides itself on pages that aren't meaningfully scrollable, and the
 * whole thing degrades to a static, glow-free bar under reduced motion.
 */
export default function ScrollProgress() {
  const { character } = useWorld();
  const accent = character.world.bg;
  const reduced = prefersReducedMotion();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
    restDelta: 0.0005,
  });
  const value = reduced ? scrollYProgress : progress;

  // Reveal the corner dial only after the reader has moved past the fold, and
  // only when the page is actually long enough to be worth a progress dial.
  const [scrollable, setScrollable] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const check = () =>
      setScrollable(
        document.documentElement.scrollHeight - window.innerHeight > 480,
      );
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Update the % label imperatively — no per-frame React re-renders.
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (pctRef.current) pctRef.current.textContent = `${Math.round(v * 100)}`;
    setRevealed(v > 0.04);
  });

  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });

  const R = 15; // dial radius

  return (
    <>
      {/* Hairline top bar */}
      <motion.div
        aria-hidden
        className="fixed left-0 top-0 z-[9999] h-[3px] w-full origin-left"
        style={{
          scaleX: value,
          background: `linear-gradient(90deg, ${hexA(accent, 0.65)}, ${accent} 55%, ${hexA(accent, 0.95)})`,
          boxShadow: reduced ? 'none' : `0 0 12px ${hexA(accent, 0.7)}, 0 0 4px ${accent}`,
        }}
      />

      {/* Corner dial + back-to-top */}
      {scrollable && (
        <motion.button
          type="button"
          onClick={scrollTop}
          aria-label="Volver arriba"
          className="group fixed bottom-6 right-6 z-[9998] hidden h-11 w-11 items-center justify-center rounded-full sm:flex"
          initial={false}
          animate={{
            opacity: revealed ? 1 : 0,
            scale: revealed ? 1 : 0.6,
            y: revealed ? 0 : 12,
            pointerEvents: revealed ? 'auto' : 'none',
          }}
          transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 26 }}
          whileHover={reduced ? undefined : { scale: 1.08 }}
          whileTap={reduced ? undefined : { scale: 0.92 }}
          style={{
            background: hexA('#000000', 0.4),
            border: `1px solid ${hexA(accent, 0.35)}`,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            boxShadow: reduced ? 'none' : `0 8px 24px ${hexA('#000000', 0.35)}, 0 0 16px ${hexA(accent, 0.25)}`,
          }}
        >
          <svg
            className="absolute inset-0 h-full w-full -rotate-90"
            viewBox="0 0 44 44"
            fill="none"
          >
            <circle
              cx="22"
              cy="22"
              r={R}
              stroke={hexA(accent, 0.18)}
              strokeWidth="2.5"
            />
            <motion.circle
              cx="22"
              cy="22"
              r={R}
              stroke={accent}
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{
                pathLength: value,
                filter: reduced ? undefined : `drop-shadow(0 0 4px ${hexA(accent, 0.8)})`,
              }}
            />
          </svg>
          {/* Percent, swapped for an up-arrow on hover. */}
          <span className="relative font-mono text-[9px] font-semibold tracking-tight text-white transition-opacity duration-200 group-hover:opacity-0">
            <span ref={pctRef}>0</span>
            <span className="opacity-60">%</span>
          </span>
          <svg
            className="absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </>
  );
}
