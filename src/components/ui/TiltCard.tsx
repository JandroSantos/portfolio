import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { hasFinePointer, prefersReducedMotion } from '@/lib/utils';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Max tilt in degrees. */
  max?: number;
  /** Show a soft moving glare highlight. */
  glare?: boolean;
}

/**
 * A 3D tilt card that follows the pointer and adds an optional glare.
 * Flat fallback on touch / reduced-motion.
 */
export default function TiltCard({
  children,
  className,
  style,
  max = 10,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = hasFinePointer() && !prefersReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 200, damping: 20 });
  const gx = useTransform(px, [0, 1], ['0%', '100%']);
  const gy = useTransform(py, [0, 1], ['0%', '100%']);

  const move = (e: React.MouseEvent) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={move}
      onMouseLeave={reset}
      style={{
        rotateX: enabled ? rx : 0,
        rotateY: enabled ? ry : 0,
        transformPerspective: 900,
        transformStyle: 'preserve-3d',
        ...style,
      }}
      className={`relative ${className ?? ''}`}
    >
      {children}
      {glare && enabled && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40 mix-blend-soft-light"
          style={{
            background: useTransform(
              [gx, gy],
              ([x, y]) =>
                `radial-gradient(50% 50% at ${x} ${y}, rgba(255,255,255,0.55), transparent 70%)`,
            ),
          }}
        />
      )}
    </motion.div>
  );
}
