import { useEffect } from 'react';
import Lenis from 'lenis';
import { prefersReducedMotion } from '@/lib/utils';

/**
 * Lenis smooth scroll, driven by a single RAF loop.
 * Skipped entirely when the user prefers reduced motion.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Expose for anchor navigation.
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);
}
