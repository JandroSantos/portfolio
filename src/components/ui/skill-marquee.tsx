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
      <img
        src={`https://cdn.simpleicons.org/${skill.icon}`}
        alt={skill.name}
        className="h-8 w-8 object-contain"
        style={{ filter: 'brightness(0) invert(1)', opacity: 0.85 }}
        onError={(e) => {
          const el = e.target as HTMLImageElement;
          el.style.display = 'none';
          const parent = el.parentElement;
          if (parent) {
            const span = document.createElement('span');
            span.style.cssText = 'font-size:11px;color:rgba(255,255,255,0.7);font-family:monospace;font-weight:700;text-align:center;line-height:1.2;';
            span.textContent = skill.name.slice(0, 3).toUpperCase();
            parent.appendChild(span);
          }
        }}
      />
      {/* Tooltip */}
      <div
        className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-mono text-white pointer-events-none"
        style={{
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
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
    <div className="relative overflow-hidden w-full">
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
