import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CHARACTERS } from '@/data/characters';
import { useLanguage } from '@/hooks/useLanguage';
import { prefersReducedMotion } from '@/lib/utils';

/**
 * A brief, elegant entrance: a fast count to 100 while the four world
 * colors tick past, then the curtain lifts into the hero. Kept
 * deliberately quick — it calls onDone promptly and doubles as cover
 * for the font-loading flash.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const { d } = useLanguage();
  const [count, setCount] = useState(0);
  const [lifting, setLifting] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      onDone();
      return;
    }

    let raf = 0;
    let lift = 0;
    let done = 0;
    const start = performance.now();
    const DURATION = 1100;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      // Ease-out for a natural deceleration toward 100.
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        lift = window.setTimeout(() => setLifting(true), 120);
        done = window.setTimeout(onDone, 720);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(lift);
      clearTimeout(done);
    };
  }, [onDone]);

  // Which world color to show based on progress (0..3).
  const worldIdx = Math.min(
    CHARACTERS.length - 1,
    Math.max(0, Math.floor((count / 100) * CHARACTERS.length)),
  );
  const accent = (CHARACTERS[worldIdx] ?? CHARACTERS[0]).world.bg;

  return (
    <motion.div
      className="fixed inset-0 z-[10001] flex flex-col items-center justify-center overflow-hidden bg-ink px-6"
      animate={lifting ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Ambient accent glow that follows the active world */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[120px]"
        style={{ background: accent, transition: 'background 220ms linear' }}
      />

      {/* Name */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative text-center"
      >
        <span className="heading-kinetic block text-[13vw] leading-[0.85] text-bone sm:text-[8vw]">
          JANDRO
        </span>
        <span
          className="heading-kinetic block text-[13vw] leading-[0.85] text-outline sm:text-[8vw]"
          style={{ color: accent, transition: 'color 200ms linear' }}
        >
          SANTOS
        </span>
      </motion.div>

      {/* Progress line */}
      <div className="relative mt-10 h-px w-[min(60vw,28rem)] overflow-hidden bg-ink-line">
        <div
          className="h-full origin-left"
          style={{
            width: `${count}%`,
            background: accent,
            boxShadow: `0 0 12px ${accent}`,
            transition: 'width 80ms linear, background 200ms linear',
          }}
        />
      </div>

      {/* Counter */}
      <div className="relative mt-4 flex w-[min(60vw,28rem)] items-center justify-between font-mono text-[11px] uppercase tracking-[0.3em] text-bone-dim">
        <span>{d.meta.loading}</span>
        <span style={{ color: accent }}>{String(count).padStart(3, '0')}</span>
      </div>
    </motion.div>
  );
}
