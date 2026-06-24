import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { prefersReducedMotion } from '@/lib/utils';

interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full loop. */
  duration?: number;
  reverse?: boolean;
  className?: string;
}

/**
 * An infinite horizontal marquee. Renders the content twice and
 * translates -50% so the loop is seamless. Pauses for reduced-motion.
 */
export default function Marquee({
  children,
  duration = 22,
  reverse = false,
  className,
}: MarqueeProps) {
  const reduced = prefersReducedMotion();

  return (
    <div className={`flex overflow-hidden ${className ?? ''}`}>
      <motion.div
        className="flex shrink-0 items-center gap-8 pr-8"
        animate={reduced ? undefined : { x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        <div className="flex shrink-0 items-center gap-8 pr-8">{children}</div>
        <div className="flex shrink-0 items-center gap-8 pr-8" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
