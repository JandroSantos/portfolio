import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CHARACTERS } from '@/data/characters';
import { useLanguage } from '@/hooks/useLanguage';
import { prefersReducedMotion } from '@/lib/utils';

/**
 * A brief, elegant entrance: a count to 100 while the four world
 * colors tick past, then the curtain lifts into the hero.
 * Doubles as cover for font-loading flash.
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
    const start = performance.now();
    const DURATION = 1500;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      // Ease-out for a natural deceleration toward 100.
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setLifting(true);
        setTimeout(onDone, 800);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  // Which world color to show based on progress (0..3).
  const worldIdx = Math.min(
    CHARACTERS.length - 1,
    Math.max(0, Math.floor((count / 100) * CHARACTERS.length)),
  );
  const accent = (CHARACTERS[worldIdx] ?? CHARACTERS[0]).world.bg;

  return (
    <motion.div
      className="fixed inset-0 z-[10001] flex flex-col items-center justify-center bg-ink"
      animate={lifting ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Name */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
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
      <div className="mt-10 h-px w-[60vw] max-w-md overflow-hidden bg-ink-line">
        <div
          className="h-full origin-left"
          style={{
            width: `${count}%`,
            background: accent,
            transition: 'width 80ms linear, background 200ms linear',
          }}
        />
      </div>

      {/* Counter */}
      <div className="mt-4 flex w-[60vw] max-w-md items-center justify-between font-mono text-[11px] uppercase tracking-[0.3em] text-bone-dim">
        <span>{d.meta.loading}</span>
        <span style={{ color: accent }}>{String(count).padStart(3, '0')}</span>
      </div>
    </motion.div>
  );
}
