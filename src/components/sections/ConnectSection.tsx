import { ArrowUpRight } from 'lucide-react';
import { CHARACTERS } from '@/data/characters';
import { SOCIALS } from '@/data/content';
import { useLanguage } from '@/hooks/useLanguage';
import Section from './Section';
import FadeIn from '../ui/FadeIn';

const social = CHARACTERS[0];

export default function ConnectSection() {
  const { d } = useLanguage();
  const c = d.connect;

  return (
    <Section id="connect" character={social} eyebrow={c.eyebrow} title={c.title}>
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        {/* Big bio statement */}
        <div className="space-y-6">
          {c.bio.map((para, i) => (
            <FadeIn key={i} delay={i * 0.1} y={28}>
              <p className="text-balance text-[clamp(1.25rem,3.2vw,2rem)] font-medium leading-[1.3] text-bone">
                {para}
              </p>
            </FadeIn>
          ))}

          {/* Socials */}
          <FadeIn delay={0.2} className="pt-4">
            <ul className="divide-y divide-ink-line border-y border-ink-line">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    data-cursor="hover"
                    className="group flex items-center justify-between gap-4 py-4 transition-colors"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-bone-dim">
                      {s.label}
                    </span>
                    <span
                      className="flex items-center gap-2 text-sm text-bone transition-colors group-hover:text-[var(--accent)] sm:text-base"
                      style={{ ['--accent' as string]: social.world.bg }}
                    >
                      {s.handle}
                      <ArrowUpRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>

        {/* Values cards */}
        <div className="grid gap-4 self-start">
          {c.values.map((v, i) => (
            <FadeIn
              key={v.label}
              delay={0.1 + i * 0.08}
              y={24}
              className="rounded-2xl border border-ink-line bg-ink-soft/60 p-5 backdrop-blur-sm transition-colors hover:border-[var(--accent)]"
              style={{ ['--accent' as string]: social.world.bg }}
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs" style={{ color: social.world.bg }}>
                  0{i + 1}
                </span>
                <h3 className="font-display text-xl uppercase tracking-wide text-bone">
                  {v.label}
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-bone-dim">{v.note}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  );
}
