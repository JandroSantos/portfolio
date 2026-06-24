import Marquee from './Marquee';

interface Skill {
  name: string;
  icon: string;
}

interface SkillMarqueeProps {
  skills: Skill[];
}

const PILL_COLORS = [
  '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981',
  '#f97316', '#e11d48', '#6366f1', '#14b8a6', '#facc15',
];

function SkillPill({ skill, colorIndex }: { skill: Skill; colorIndex: number }) {
  const color = PILL_COLORS[colorIndex % PILL_COLORS.length];
  return (
    <div
      className="flex items-center gap-2 rounded-full px-4 py-2 border shrink-0 select-none"
      style={{
        background: `${color}12`,
        borderColor: `${color}30`,
      }}
    >
      <img
        src={`https://cdn.simpleicons.org/${skill.icon}`}
        alt={skill.name}
        width={16}
        height={16}
        style={{ filter: 'brightness(0) invert(1)', opacity: 0.85 }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
      <span className="text-xs font-mono tracking-wide text-white/70 whitespace-nowrap">
        {skill.name}
      </span>
    </div>
  );
}

export function SkillMarquee({ skills }: SkillMarqueeProps) {
  const half = Math.ceil(skills.length / 2);
  const row1 = skills.slice(0, half);
  const row2 = skills.slice(half);

  return (
    <div className="flex flex-col gap-3 w-full overflow-hidden">
      <Marquee duration={28}>
        {row1.map((s, i) => <SkillPill key={s.name} skill={s} colorIndex={i} />)}
      </Marquee>
      <Marquee duration={32} reverse>
        {row2.map((s, i) => <SkillPill key={s.name} skill={s} colorIndex={i + half} />)}
      </Marquee>
    </div>
  );
}
