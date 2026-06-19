import { motion, useSpring } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { hasFinePointer, prefersReducedMotion } from '@/lib/utils';

interface MagnetProps {
  children: ReactNode;
  /** Activation radius around the element's center, in px. */
  padding?: number;
  /** Higher = subtler pull (distance is divided by this). */
  strength?: number;
  className?: string;
}

/**
 * Pulls its children toward the cursor when the pointer enters
 * the activation radius. Spring-backed for a natural settle.
 * No-ops on touch devices and under reduced-motion.
 */
export default function Magnet({
  children,
  padding = 140,
  strength = 3,
  className,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.2 });
  const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.2 });

  const enabled = hasFinePointer() && !prefersReducedMotion();

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);

    if (dist < padding) {
      x.set(dx / strength);
      y.set(dy / strength);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={className}
      style={{ willChange: 'transform' }}
    >
      <motion.div style={{ x, y, willChange: 'transform' }}>{children}</motion.div>
    </div>
  );
}
