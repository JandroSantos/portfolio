import { skillIconPath } from '@/lib/skill-icons';

interface Skill {
  name: string;
  icon: string;
}

interface SkillMarqueeProps {
  row1: Skill[];
  row2: Skill[];
}

const repeat = (skills: Skill[], times = 4): Skill[] =>
  Array.from({ length: times }).flatMap(() => skills);

function SkillBall({ skill }: { skill: Skill }) {
  return (
    <div
      className="h-16 w-16 flex-shrink-0 rounded-full flex items-center justify-center shadow-lg border group relative"
      style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(255,255,255,0.10)',
      }}
    >
      {skillIconPath(skill.icon) ? (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#ffffff" style={{ opacity: 0.85 }} aria-hidden>
          <path d={skillIconPath(skill.icon) as string} />
        </svg>
      ) : (
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace', fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>
          {skill.name.slice(0, 3).toUpperCase()}
        </span>
      )}
      {/* Tooltip */}
      <div
        className="absolute bottom-[calc(100%+8px)] left-1/2 z-30 -translate-x-1/2 hidden group-hover:block whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-mono text-white pointer-events-none border"
        style={{
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          borderColor: 'rgba(255,255,255,0.12)',
        }}
      >
        {skill.name}
      </div>
    </div>
  );
}

export function SkillMarquee({ row1, row2 }: SkillMarqueeProps) {
  const r1 = repeat(row1, 4);
  const r2 = repeat(row2, 4);

  return (
    <div className="relative overflow-hidden w-full pt-12 pb-2">
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-left {
          animation: scroll-left 32s linear infinite;
          will-change: transform;
        }
        .marquee-right {
          animation: scroll-right 28s linear infinite;
          will-change: transform;
        }
      `}</style>

      {/* Row 1 — left */}
      <div className="flex gap-4 whitespace-nowrap marquee-left">
        {r1.map((skill, i) => (
          <SkillBall key={`r1-${i}`} skill={skill} />
        ))}
      </div>

      {/* Row 2 — right */}
      <div className="mt-4 flex gap-4 whitespace-nowrap marquee-right">
        {r2.map((skill, i) => (
          <SkillBall key={`r2-${i}`} skill={skill} />
        ))}
      </div>

      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-black/80 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-black/80 to-transparent" />
    </div>
  );
}
