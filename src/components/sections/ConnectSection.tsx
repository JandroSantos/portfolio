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
    <Section id="connect" character={social} eyebrow={c.eyebrow} title={c.title} className="relative">
      {/* Background ambient light orb */}
      <div
        className="ambient-blur-orb -left-36 -top-36 h-96 w-96"
        style={{
          background: `radial-gradient(circle, ${social.world.bg} 0%, transparent 70%)`,
          opacity: 0.18,
        }}
      />
      <div
        className="ambient-blur-orb -right-36 -bottom-36 h-96 w-96"
        style={{
          background: `radial-gradient(circle, ${social.world.deep} 0%, transparent 70%)`,
          opacity: 0.12,
        }}
      />

      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16 relative z-10">
        {/* Big bio statement */}
        <div className="space-y-8">
          {c.bio.map((para, i) => (
            <FadeIn key={i} delay={i * 0.1} y={28}>
              <p className="text-balance text-[clamp(1.25rem,3.2vw,2rem)] font-medium leading-[1.35] text-bone">
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
                    className="group flex items-center justify-between gap-4 py-5 px-2 transition-all duration-300 hover:bg-white/[0.015] rounded-lg"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-bone-dim transition-colors group-hover:text-bone">
                      {s.label}
                    </span>
                    <span
                      className="flex items-center gap-2 text-sm text-bone transition-all duration-300 group-hover:translate-x-[-4px] sm:text-base font-semibold"
                    >
                      <span className="transition-colors duration-300 group-hover:text-[var(--accent)]" style={{ ['--accent' as string]: social.world.bg }}>
                        {s.handle}
                      </span>
                      <ArrowUpRight
                        size={17}
                        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                        style={{ color: social.world.bg }}
                      />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>

        {/* Values cards */}
        <div className="grid gap-5 self-start">
          {c.values.map((v, i) => (
            <FadeIn
              key={v.label}
              delay={0.1 + i * 0.08}
              y={24}
              className="glass-panel rounded-2xl p-6 relative overflow-hidden"
            >
              {/* Subtle inner corner glow highlight */}
              <div
                className="absolute top-0 left-0 w-[40px] h-[40px] rounded-full blur-[15px] opacity-20 pointer-events-none"
                style={{ background: social.world.bg }}
              />
              <div className="flex items-baseline gap-3 relative z-10">
                <span className="font-mono text-xs font-bold" style={{ color: social.world.bg }}>
                  0{i + 1}
                </span>
                <h3 className="font-display text-xl uppercase tracking-wider text-bone">
                  {v.label}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-bone-dim relative z-10">{v.note}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  );
}

