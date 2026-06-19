import { CHARACTERS } from '@/data/characters';
import { useLanguage } from '@/hooks/useLanguage';
import Section from './Section';
import FadeIn from '../ui/FadeIn';

const exec = CHARACTERS[2];

export default function ExperienceSection() {
  const { d } = useLanguage();
  const e = d.experience;

  return (
    <Section id="experience" character={exec} eyebrow={e.eyebrow} title={e.title}>
      <div className="mx-auto max-w-4xl">
        <ol className="relative border-l-2" style={{ borderColor: `${exec.world.bg}55` }}>
          {e.items.map((job, i) => (
            <li key={job.role} className="relative pb-14 pl-8 last:pb-0 sm:pl-12">
              {/* Node */}
              <span
                className="absolute -left-[9px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-[#0a0a0a]"
                style={{ background: exec.world.accent }}
              />
              <FadeIn delay={i * 0.08} y={28}>
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.25em]"
                  style={{ color: exec.world.accent }}
                >
                  {job.period}
                </span>
                <h3 className="mt-2 font-display text-[clamp(1.5rem,4.5vw,2.6rem)] uppercase leading-tight text-bone">
                  {job.role}
                </h3>
                <p className="mt-0.5 text-sm font-medium" style={{ color: exec.world.panel }}>
                  {job.org}
                </p>
                <p className="mt-4 max-w-2xl text-balance text-base leading-relaxed text-bone-dim sm:text-lg">
                  {job.summary}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {job.highlights.map((h) => (
                    <li
                      key={h}
                      className="rounded-full border px-3 py-1.5 text-xs text-bone-dim sm:text-sm"
                      style={{ borderColor: `${exec.world.bg}66` }}
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </FadeIn>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
