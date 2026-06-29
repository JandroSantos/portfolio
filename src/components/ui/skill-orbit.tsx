import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { skillIconPath } from '@/lib/skill-icons';

interface Skill {
  name: string;
  icon: string;
}

interface SkillOrbitProps {
  inner: Skill[];   // 6 items
  middle: Skill[];  // 8 items
  outer: Skill[];   // 10 items
}

const RING_COLORS = [
  '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f97316',
  '#e11d48', '#6366f1', '#14b8a6', '#facc15', '#a855f7', '#22d3ee',
  '#fb923c', '#4ade80', '#f472b6', '#60a5fa', '#34d399', '#fbbf24',
  '#c084fc', '#38bdf8', '#fb7185', '#a3e635', '#fdba74', '#86efac',
];

function OrbitRing({
  skills,
  radius,
  centerX,
  centerY,
  iconSize,
  colorOffset = 0,
}: {
  skills: Skill[];
  radius: number;
  centerX: number;
  centerY: number;
  iconSize: number;
  colorOffset?: number;
}) {
  const count = skills.length;
  return (
    <>
      {skills.map((skill, index) => {
        const angle = count === 1 ? 90 : (index / (count - 1)) * 180;
        const rad = (angle * Math.PI) / 180;
        const x = centerX + radius * Math.cos(Math.PI - rad);
        const y = centerY - radius * Math.sin(rad);
        const color = RING_COLORS[(index + colorOffset) % RING_COLORS.length];
        const tooltipAbove = angle > 90;

        return (
          <motion.div
            key={skill.name}
            className="absolute flex flex-col items-center group"
            style={{
              left: x - iconSize / 2,
              top: y - iconSize / 2,
              zIndex: 5,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.1 + index * 0.06,
              type: 'spring',
              stiffness: 240,
              damping: 20,
            }}
          >
            <div
              className="rounded-xl flex items-center justify-center cursor-pointer transition-transform duration-200 group-hover:scale-115 shadow-lg border"
              style={{
                width: iconSize,
                height: iconSize,
                background: `${color}18`,
                borderColor: `${color}40`,
                boxShadow: `0 0 16px ${color}35`,
              }}
            >
              {skillIconPath(skill.icon) ? (
                <svg
                  viewBox="0 0 24 24"
                  width={iconSize * 0.52}
                  height={iconSize * 0.52}
                  fill="#ffffff"
                  style={{ opacity: 0.9 }}
                  aria-hidden
                >
                  <path d={skillIconPath(skill.icon) as string} />
                </svg>
              ) : (
                <span
                  style={{
                    fontSize: iconSize * 0.28,
                    color,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                  }}
                >
                  {skill.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            {/* Tooltip */}
            <div
              className={`absolute ${
                tooltipAbove ? 'bottom-[calc(100%+8px)]' : 'top-[calc(100%+8px)]'
              } hidden group-hover:block whitespace-nowrap rounded-lg px-2 py-1 text-[10px] font-mono text-white shadow-lg text-center pointer-events-none`}
              style={{
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${color}40`,
              }}
            >
              {skill.name}
            </div>
          </motion.div>
        );
      })}
    </>
  );
}

export function SkillOrbit({ inner, middle, outer }: SkillOrbitProps) {
  const [containerWidth, setContainerWidth] = useState(520);

  useEffect(() => {
    const update = () => {
      const w = Math.min(window.innerWidth * 0.85, 680);
      setContainerWidth(w);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const bw = containerWidth;
  const centerX = bw / 2;
  const centerY = bw * 0.5;

  const iconSize =
    bw < 400
      ? Math.max(28, bw * 0.07)
      : bw < 600
      ? Math.max(32, bw * 0.068)
      : Math.max(36, bw * 0.065);

  const r1 = bw * 0.22;
  const r2 = bw * 0.36;
  const r3 = bw * 0.50;

  const arcRadius = (r: number) => r;

  return (
    <div className="relative" style={{ width: bw, height: bw * 0.58 }}>
      {/* Glow background */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
        style={{
          width: bw * 1.1,
          height: bw * 1.1,
          top: -bw * 0.2,
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.04) 0%, transparent 65%)',
          filter: 'blur(24px)',
        }}
      />

      {/* Arc lines */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={bw}
        height={bw * 0.58}
        style={{ overflow: 'visible' }}
      >
        {[r1, r2, r3].map((r, i) => (
          <path
            key={i}
            d={`M ${centerX - r} ${centerY} A ${r} ${r} 0 0 1 ${centerX + r} ${centerY}`}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={1}
            strokeDasharray="3 6"
          />
        ))}
      </svg>

      {/* Rings */}
      <OrbitRing skills={inner} radius={arcRadius(r1)} centerX={centerX} centerY={centerY} iconSize={iconSize} colorOffset={0} />
      <OrbitRing skills={middle} radius={arcRadius(r2)} centerX={centerX} centerY={centerY} iconSize={Math.round(iconSize * 0.88)} colorOffset={6} />
      <OrbitRing skills={outer} radius={arcRadius(r3)} centerX={centerX} centerY={centerY} iconSize={Math.round(iconSize * 0.76)} colorOffset={14} />
    </div>
  );
}
