import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { prefersReducedMotion } from '@/lib/utils';

interface AnimatedNumberProps {
  /** A value like "10+", "2+", "1", "98%". Digits animate; suffix stays. */
  value: string;
  className?: string;
  duration?: number;
}

/**
 * Counts up to the numeric part of `value` when scrolled into view,
 * preserving any non-numeric prefix/suffix (e.g. "+", "%").
 */
export default function AnimatedNumber({ value, className, duration = 1200 }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const target = parseInt(value.replace(/\D/g, ''), 10) || 0;
  const suffix = value.replace(/[0-9]/g, '');
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setN(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return (
    <span ref={ref} className={className}>
      {n}
      {suffix}
    </span>
  );
}
