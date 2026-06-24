import { motion } from 'framer-motion';

interface Skill {
  name: string;
  icon: string;
}

interface SkillOrbitProps {
  skills: Skill[];
}

const RING_COLORS = [
  // inner ring
  ['#f59e0b', '#ec4899', '#8b5cf6'],
  // middle ring
  ['#06b6d4', '#10b981', '#f97316'],
  // outer ring
  ['#e11d48', '#6366f1', '#14b8a6', '#facc15'],
];

const RING_RADII = [110, 180, 250];
const RING_SIZES = [52, 44, 38];

export function SkillOrbit({ skills }: SkillOrbitProps) {
  const rings: Skill[][] = [[], [], []];
  skills.forEach((s, i) => {
    const ring = Math.min(i < 3 ? 0 : i < 8 ? 1 : 2, 2);
    rings[ring].push(s);
  });

  return (
    <div className="relative flex items-end justify-center overflow-hidden select-none"
      style={{ height: RING_RADII[2] + 60, width: '100%' }}>
      {/* Semi-circle arcs */}
      {RING_RADII.map((r, ri) => (
        <svg
          key={ri}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
          width={r * 2 + 20}
          height={r + 20}
          style={{ overflow: 'visible' }}
        >
          <path
            d={`M ${10} ${r + 10} A ${r} ${r} 0 0 1 ${r * 2 + 10} ${r + 10}`}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={1}
            strokeDasharray="4 6"
          />
        </svg>
      ))}

      {/* Icons on each ring */}
      {rings.map((ring, ri) => {
        const r = RING_RADII[ri];
        const size = RING_SIZES[ri];
        const count = ring.length;
        return ring.map((skill, si) => {
          const angle = count === 1 ? Math.PI / 2 : (Math.PI / (count - 1)) * si;
          const x = Math.cos(Math.PI - angle) * r;
          const y = -Math.sin(angle) * r;
          const color = RING_COLORS[ri][si % RING_COLORS[ri].length];

          return (
            <motion.div
              key={skill.name}
              className="absolute flex flex-col items-center gap-1 group"
              style={{
                left: `calc(50% + ${x}px)`,
                bottom: `${-y}px`,
                transform: 'translate(-50%, 50%)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + ri * 0.15 + si * 0.07, type: 'spring', stiffness: 260, damping: 22 }}
            >
              <div
                className="rounded-xl flex items-center justify-center shadow-lg border transition-transform duration-200 group-hover:scale-110"
                style={{
                  width: size,
                  height: size,
                  background: `${color}18`,
                  borderColor: `${color}40`,
                  boxShadow: `0 0 18px ${color}30`,
                }}
              >
                <img
                  src={`https://cdn.simpleicons.org/${skill.icon}`}
                  alt={skill.name}
                  width={size * 0.5}
                  height={size * 0.5}
                  style={{ filter: 'brightness(0) invert(1)', opacity: 0.9 }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <span
                className="text-[9px] font-mono tracking-wide opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                style={{ color }}
              >
                {skill.name}
              </span>
            </motion.div>
          );
        });
      })}
    </div>
  );
}
