import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useWorld } from '@/hooks/useWorld';
import { prefersReducedMotion } from '@/lib/utils';

/**
 * A signature route-change flourish: on navigation, three staggered
 * accent panels sweep up across the screen and lift away, briefly
 * masking the swap. Purely decorative (pointer-events: none) and
 * additive — it never touches the router. Skipped for reduced motion
 * and on the very first paint.
 */
export default function RouteTransition() {
  const { pathname } = useLocation();
  const { character } = useWorld();
  const [active, setActive] = useState(false);
  const first = useRef(true);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduced) return;
    setActive(true);
    const t = setTimeout(() => setActive(false), 820);
    return () => clearTimeout(t);
  }, [pathname, reduced]);

  const accent = character.world.bg;
  const deep = character.world.deep;

  return (
    <AnimatePresence>
      {active && (
        <div
          className="pointer-events-none fixed inset-0 z-[9500] flex"
          aria-hidden
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-full flex-1"
              style={{
                background: `linear-gradient(180deg, ${accent} 0%, ${deep} 100%)`,
                transformOrigin: 'bottom',
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: [0, 1, 1, 0] }}
              transition={{
                duration: 0.8,
                times: [0, 0.4, 0.55, 1],
                ease: [0.76, 0, 0.24, 1],
                delay: i * 0.06,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
