import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface ContributionGraphProps {
  color: string;
  /** Number of week-columns to render. */
  weeks?: number;
  label?: string;
  className?: string;
}

/**
 * The Student's secondary signature: a GitHub-style contribution heatmap.
 * Deterministic-ish pseudo-random levels animate in cell by cell — the
 * universal "I write code every day" badge.
 */
export default function ContributionGraph({
  color,
  weeks = 26,
  label = 'commits',
  className,
}: ContributionGraphProps) {
  const cells = useMemo(() => {
    // Seeded pseudo-random so it's stable across renders.
    let seed = 1337;
    const rnd = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    return Array.from({ length: weeks }, () =>
      Array.from({ length: 7 }, () => {
        const r = rnd();
        return r > 0.78 ? 4 : r > 0.6 ? 3 : r > 0.4 ? 2 : r > 0.22 ? 1 : 0;
      }),
    );
  }, [weeks]);

  const levelColor = (lvl: number) =>
    lvl === 0 ? 'rgba(255,255,255,0.05)' : hexA(color, 0.25 + lvl * 0.18);

  return (
    <div className={className}>
      <div className="flex items-end justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-bone-dim">
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] text-bone-dim">less</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className="h-2.5 w-2.5 rounded-[2px]" style={{ background: levelColor(l) }} />
          ))}
          <span className="font-mono text-[10px] text-bone-dim">more</span>
        </div>
      </div>
      <div className="mt-3 flex gap-[3px] overflow-hidden">
        {cells.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((lvl, di) => (
              <motion.span
                key={di}
                className="h-2.5 w-2.5 rounded-[2px] sm:h-3 sm:w-3"
                style={{ background: levelColor(lvl) }}
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (wi * 7 + di) * 0.004, duration: 0.3 }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function hexA(hex: string, a: number): string {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
