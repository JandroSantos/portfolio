import { CHARACTERS } from '@/data/characters';
import { useLanguage } from '@/hooks/useLanguage';
import Section from './Section';
import FadeIn from '../ui/FadeIn';

const exec = CHARACTERS[2];

export default function ExperienceSection() {
  const { d } = useLanguage();
  const e = d.experience;

  return (
    <Section id="experience" character={exec} eyebrow={e.eyebrow} title={e.title} className="relative">
      {/* Background ambient light orb */}
      <div
        className="ambient-blur-orb -left-36 -top-36 h-96 w-96"
        style={{
          background: `radial-gradient(circle, ${exec.world.bg} 0%, transparent 70%)`,
          opacity: 0.15,
        }}
      />
      <div
        className="ambient-blur-orb -right-36 -bottom-36 h-96 w-96"
        style={{
          background: `radial-gradient(circle, ${exec.world.deep} 0%, transparent 70%)`,
          opacity: 0.1,
        }}
      />

      <div className="mx-auto max-w-4xl relative z-10">
        <ol className="relative border-l-2 ml-4 sm:ml-6" style={{ borderColor: `${exec.world.bg}33` }}>
          {e.items.map((job, i) => (
            <li key={job.role} className="relative pb-10 pl-8 last:pb-0 sm:pl-12 group cursor-default">
              
              {/* Glowing animated tech timeline node */}
              <div className="absolute -left-[13px] top-7 flex h-6 w-6 items-center justify-center">
                {/* Outer pulsing ping */}
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-25 transition-all duration-300 group-hover:scale-125"
                  style={{ background: exec.world.bg }}
                />
                {/* Ring border outline */}
                <span
                  className="absolute h-5 w-5 rounded-full border border-bone-dim/40 bg-ink transition-all duration-300 group-hover:border-[var(--accent)]"
                  style={{ ['--accent' as string]: exec.world.bg }}
                />
                {/* Center solid core dot */}
                <span
                  className="relative h-2.5 w-2.5 rounded-full transition-colors duration-700"
                  style={{ background: exec.world.bg }}
                />
              </div>

              {/* Glassmorphic timeline card */}
              <FadeIn delay={i * 0.08} y={28}>
                <div className="glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:translate-x-1.5">
                  {/* Subtle corner light reflection */}
                  <div
                    className="absolute top-0 right-0 w-[60px] h-[60px] rounded-full blur-[25px] opacity-15 pointer-events-none"
                    style={{ background: exec.world.bg }}
                  />
                  
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.25em]"
                    style={{ color: exec.world.accent }}
                  >
                    {job.period}
                  </span>
                  
                  <h3 className="mt-2 font-display text-[clamp(1.4rem,4vw,2.2rem)] uppercase leading-tight text-bone">
                    {job.role}
                  </h3>
                  
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-700" style={{ color: exec.world.panel }}>
                    {job.org}
                  </p>
                  
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-bone-dim">
                    {job.summary}
                  </p>
                  
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {job.highlights.map((h) => (
                      <li
                        key={h}
                        className="rounded-full border px-3 py-1 text-xs text-bone-dim transition-colors duration-300 hover:text-bone hover:border-bone-dim/40"
                        style={{ borderColor: `${exec.world.bg}33`, background: `${exec.world.bg}0a` }}
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>

            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

