import { GraduationCap } from 'lucide-react';
import { CHARACTERS } from '@/data/characters';
import { STUDIES, SKILLS } from '@/data/content';
import Section from './Section';
import FadeIn from '../ui/FadeIn';

const nerd = CHARACTERS[3];

export default function StudiesSection() {
  return (
    <Section id="studies" character={nerd} eyebrow="04 — Cómo aprendí" title="Studies">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Education list */}
        <div className="space-y-5">
          {STUDIES.map((study, i) => (
            <FadeIn
              key={study.title}
              delay={i * 0.08}
              y={24}
              className="rounded-2xl border border-ink-line bg-ink-soft/50 p-5 transition-colors hover:border-[var(--accent)] sm:p-6"
              style={{ ['--accent' as string]: nerd.world.bg }}
            >
              <div className="flex items-start gap-4">
                <GraduationCap
                  className="mt-1 h-6 w-6 shrink-0"
                  style={{ color: nerd.world.bg }}
                />
                <div>
                  <h3 className="text-lg font-semibold leading-snug text-bone sm:text-xl">
                    {study.title}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-bone-dim">
                    {study.org} · {study.period}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-bone-dim">{study.note}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Skills "terminal" */}
        <FadeIn delay={0.15} className="self-start">
          <div className="overflow-hidden rounded-2xl border border-ink-line bg-[#08110a]">
            {/* Terminal chrome */}
            <div className="flex items-center gap-2 border-b border-ink-line px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-2 font-mono text-[11px] text-bone-dim">jandro@dev: ~/skills</span>
            </div>
            {/* Skills as command output */}
            <div className="space-y-4 p-5 font-mono text-sm sm:p-6">
              {SKILLS.map((group) => (
                <div key={group.label}>
                  <p className="text-bone-dim">
                    <span style={{ color: nerd.world.bg }}>$</span> ls {group.label.toLowerCase()}/
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1.5 pl-4">
                    {group.items.map((item) => (
                      <span key={item} className="text-bone">
                        <span style={{ color: nerd.world.panel }}>›</span> {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <p className="pt-1 text-bone-dim">
                <span style={{ color: nerd.world.bg }}>$</span>{' '}
                <span className="inline-block h-4 w-2 animate-pulse align-middle" style={{ background: nerd.world.bg }} />
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}
