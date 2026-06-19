import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface FadeInProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  children: ReactNode;
  delay?: number;
  /** Vertical offset to travel from, in px. */
  y?: number;
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'nav' | 'section' | 'li';
  /** Animate once on scroll-into-view (default) vs. on mount. */
  onMount?: boolean;
}

/**
 * The workhorse reveal: fade + rise with an expo ease.
 * Enters from a real offset (never scale(0)) and only animates
 * transform + opacity.
 */
export default function FadeIn({
  children,
  delay = 0,
  y = 24,
  as = 'div',
  onMount = false,
  className,
  ...rest
}: FadeInProps) {
  const Comp = motion[as] as typeof motion.div;
  const animateProps = onMount
    ? { animate: { opacity: 1, y: 0 } }
    : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-10%' } };

  return (
    <Comp
      initial={{ opacity: 0, y }}
      {...animateProps}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </Comp>
  );
}
