import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface WorldSectionProps {
  children: ReactNode;
  className?: string;
  /** Add a top border tinted to the world color. */
  border?: string;
  /** Subtle background tint — pass a CSS color or leave undefined. */
  bg?: string;
}

/**
 * Standard section wrapper: max-w-6xl centered, consistent padding.
 * Cuts the repeated `mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-28`
 * boilerplate across all four world pages.
 */
export default function WorldSection({ children, className, border, bg }: WorldSectionProps) {
  return (
    <section
      className={cn('py-20 sm:py-28', className)}
      style={{
        ...(border ? { borderTop: `1px solid ${border}` } : {}),
        ...(bg ? { background: bg } : {}),
      }}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
}
