import { motion, useSpring } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { hasFinePointer, prefersReducedMotion } from '@/lib/utils';

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  strength?: number;
  /** Inline style passthrough for theming. */
  style?: React.CSSProperties;
  cursorLabel?: string;
  ariaLabel?: string;
}

/**
 * A button (or link) whose label drifts toward the cursor and snaps
 * back with a spring. The inner span counter-shifts for a subtle
 * depth pop. No-ops on touch / reduced-motion.
 */
export default function MagneticButton({
  children,
  onClick,
  href,
  className,
  strength = 0.4,
  style,
  cursorLabel,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 14, mass: 0.3 });
  const y = useSpring(0, { stiffness: 200, damping: 14, mass: 0.3 });

  const enabled = hasFinePointer() && !prefersReducedMotion();

  const move = (e: React.MouseEvent) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const common = {
    onMouseMove: move,
    onMouseLeave: reset,
    'data-cursor': 'hover',
    'data-cursor-label': cursorLabel,
    'aria-label': ariaLabel,
    style: { x, y, ...style },
    className,
  };

  if (href) {
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noreferrer' : undefined}
        {...common}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button ref={ref as React.Ref<HTMLButtonElement>} onClick={onClick} {...common}>
      {children}
    </motion.button>
  );
}
