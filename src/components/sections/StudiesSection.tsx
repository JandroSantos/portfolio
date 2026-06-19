import { GraduationCap } from 'lucide-react';
import { CHARACTERS } from '@/data/characters';
import { useLanguage } from '@/hooks/useLanguage';
import Section from './Section';
import FadeIn from '../ui/FadeIn';

const nerd = CHARACTERS[3];

export default function StudiesSection() {
  const { d } = useLanguage();
  const s = d.studies;

  return (
    <Section id="studies" character={nerd} eyebrow={s.eyebrow} title={s.title} className="relative">
      {/* Background ambient light orb */}
      <div
        className="ambient-blur-orb -right-36 -top-36 h-96 w-96"
        style={{
          background: `radial-gradient(circle, ${nerd.world.bg} 0%, transparent 70%)`,
          opacity: 0.15,
        }}
      />
      <div
        className="ambient-blur-orb -left-36 -bottom-36 h-96 w-96"
        style={{
          background: `radial-gradient(circle, ${nerd.world.deep} 0%, transparent 70%)`,
          opacity: 0.1,
        }}
      />

      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16 relative z-10">
        {/* Education list */}
        <div className="space-y-6">
          {s.items.map((study, i) => (
            <FadeIn
              key={study.title}
              delay={i * 0.08}
              y={24}
              className="glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:translate-x-1"
            >
              {/* Corner accent glow */}
              <div
                className="absolute top-0 right-0 w-[50px] h-[50px] rounded-full blur-[20px] opacity-10 pointer-events-none"
                style={{ background: nerd.world.bg }}
              />

              <div className="flex items-start gap-4">
                <GraduationCap className="mt-1 h-6 w-6 shrink-0 transition-colors duration-700" style={{ color: nerd.world.bg }} />
                <div>
                  <h3 className="text-lg font-semibold leading-snug text-bone sm:text-xl">
                    {study.title}
                  </h3>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-bone-dim">
                    {study.org} · {study.period}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-bone-dim">{study.note}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* High-fidelity retro-styled Skills Terminal */}
        <FadeIn delay={0.15} className="self-start">
          <div className="terminal-window rounded-2xl">
            {/* Terminal chrome header */}
            <div className="flex items-center gap-2 border-b border-white/5 bg-[#050706]/75 px-4 py-3 relative z-20">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#ff5f56] border border-[#e0443e] shadow-[0_1px_1px_rgba(0,0,0,0.2)]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e] border border-[#dfa224] shadow-[0_1px_1px_rgba(0,0,0,0.2)]" />
                <span className="h-3 w-3 rounded-full bg-[#27c93f] border border-[#1a9c2b] shadow-[0_1px_1px_rgba(0,0,0,0.2)]" />
              </div>
              <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-bone-dim/70">
                jandro@dev: ~/skills
              </span>
            </div>

            {/* Skills as command output with CRT Text glow */}
            <div className="space-y-5 p-5 font-mono text-xs sm:p-6 terminal-text-glow leading-relaxed text-bone/90 relative z-20">
              {s.skills.map((group) => (
                <div key={group.label}>
                  <p className="text-bone-dim/75 font-semibold">
                    <span className="transition-colors duration-700" style={{ color: nerd.world.bg }}>$</span> ls {group.label.toLowerCase()}/
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 pl-4">
                    {group.items.map((item) => (
                      <span key={item} className="text-bone transition-all duration-300 hover:translate-x-0.5 inline-block">
                        <span className="transition-colors duration-700" style={{ color: nerd.world.panel }}>›</span> {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <p className="pt-2 text-bone-dim/75">
                <span className="transition-colors duration-700" style={{ color: nerd.world.bg }}>$</span>{' '}
                <span
                  className="inline-block h-3.5 w-2 animate-pulse align-middle transition-colors duration-700"
                  style={{ background: nerd.world.bg }}
                />
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}

