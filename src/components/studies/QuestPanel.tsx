import { motion } from 'framer-motion';
import { Lock, type LucideIcon } from 'lucide-react';
import { hexA } from '@/lib/utils';
import { SkillGlyph } from './skillIcons';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Outermost "locked" talents — the things still being trained.
 * Each row is a quest with a deterministic XP bar.
 */
export default function QuestPanel({
  items,
  green,
  greenDeep,
  greenLight,
  bone,
  reduce,
  fallback,
}: {
  items: string[];
  green: string;
  greenDeep: string;
  greenLight: string;
  bone: string;
  reduce: boolean;
  fallback: LucideIcon;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item, i) => {
        const pct = 38 + ((i * 19) % 42); // deterministic faux-progress
        return (
          <motion.div
            key={item}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            className="group relative overflow-hidden rounded-[22px] px-5 py-4"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)',
            }}
          >
            <div className="mb-3 flex items-center gap-3">
              <span
                className="relative grid h-11 w-11 flex-none place-items-center rounded-xl"
                style={{
                  background: hexA(greenDeep, 0.18),
                  border: `1px solid ${hexA(green, 0.22)}`,
                }}
              >
                <SkillGlyph name={item} size={20} fallback={fallback} color={greenLight} />
                <span
                  className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full"
                  style={{ background: 'rgba(8,12,8,0.95)', border: `1px solid ${hexA(green, 0.35)}` }}
                >
                  <Lock size={9} color={hexA(bone, 0.7)} strokeWidth={2.2} aria-hidden />
                </span>
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[15px] font-semibold" style={{ color: bone }}>
                    {item}
                  </span>
                  <span
                    className="flex-none font-mono text-[10px] tracking-widest"
                    style={{ color: hexA(greenLight, 0.85) }}
                  >
                    {pct}%
                  </span>
                </div>
                <span
                  className="font-mono text-[9px] uppercase tracking-[0.25em]"
                  style={{ color: hexA(bone, 0.45) }}
                >
                  XP
                </span>
              </div>
            </div>

            {/* XP bar */}
            <div
              className="relative h-2 overflow-hidden rounded-full"
              style={{ background: hexA(bone, 0.08) }}
            >
              <motion.div
                className="relative h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${greenDeep}, ${greenLight})` }}
                initial={reduce ? false : { width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: 0.1 + i * 0.08, ease: EASE }}
              >
                {!reduce && (
                  <span
                    className="absolute inset-y-0 left-0 w-1/3"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)',
                      animation: 'xpshimmer 2.4s ease-in-out infinite',
                    }}
                  />
                )}
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
