import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn, prefersReducedMotion } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Liquid-glass surface used across the CV.
 * Dark, blurred, with an inner top highlight and a soft drop shadow.
 * Reveals on scroll (respecting reduced-motion) and prints flat/white.
 */
export function GlassCard({
  children,
  className,
  delay = 0,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section';
}) {
  const reduce = prefersReducedMotion();
  const Comp = motion[as];

  return (
    <Comp
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay, duration: 0.6, ease: EASE }}
      className={cn('cv-glass relative rounded-3xl', className)}
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(22px) saturate(170%)',
        WebkitBackdropFilter: 'blur(22px) saturate(170%)',
        border: '1px solid rgba(255,255,255,0.09)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.10), 0 18px 50px -20px rgba(0,0,0,0.65)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-8 top-0 h-px rounded-full print:hidden"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
        }}
      />
      {children}
    </Comp>
  );
}
