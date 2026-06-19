import { motion } from 'framer-motion';
import { ArrowUpRight, Hammer } from 'lucide-react';
import { CHARACTERS } from '@/data/characters';
import { useLanguage } from '@/hooks/useLanguage';
import PageShell from '@/components/layout/PageShell';
import FadeIn from '@/components/ui/FadeIn';
import TiltCard from '@/components/ui/TiltCard';
import DecodeText from '@/components/ui/DecodeText';
import BlueprintSchematic from '@/components/effects/BlueprintSchematic';

const builder = CHARACTERS[1];

/**
 * The Builder — industrial / blueprint. A technical-drawing grid,
 * construction tape and project cards that read like spec sheets.
 */
export default function ProjectsPage() {
  const { d, lang } = useLanguage();
  const p = d.projects;
  const w = builder.world;

  return (
    <PageShell
      character={builder}
      background={`radial-gradient(130% 80% at 50% -10%, ${w.deep}40 0%, #080604 55%)`}
    >
      {/* Blueprint grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(${w.bg} 1px, transparent 1px), linear-gradient(90deg, ${w.bg} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* ---- Hero ---- */}
      <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-8 px-5 pb-10 pt-32 sm:px-8 sm:pt-40 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <FadeIn className="flex items-center gap-3">
            <Hammer size={18} style={{ color: w.bg }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: w.bg }}>
              {p.eyebrow}
            </span>
          </FadeIn>
          <h1 className="heading-kinetic mt-4 text-[clamp(3.5rem,16vw,12rem)] leading-[0.8] text-bone">
            {p.title}
          </h1>
          <FadeIn delay={0.15} className="mt-6 max-w-xl">
            <DecodeText
              text={p.intro}
              trigger={lang}
              className="text-balance text-lg leading-relaxed text-bone-dim sm:text-xl"
            />
          </FadeIn>
        </div>

        {/* Self-drawing blueprint + builder figurine overlay */}
        <FadeIn delay={0.2} className="relative hidden lg:block">
          <BlueprintSchematic color={w.bg} className="h-auto w-full" />
          <motion.img
            layoutId="world-figurine"
            src={builder.image}
            alt="The Builder"
            draggable={false}
            className="pointer-events-none absolute -bottom-8 right-4 h-48 w-auto select-none object-contain object-bottom"
            style={{ filter: `drop-shadow(0 20px 40px ${w.deep}99)` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </FadeIn>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">

        {/* Construction tape */}
        <div className="mt-10 overflow-hidden rounded-sm">
          <div
            className="flex items-center gap-6 py-2"
            style={{
              background: `repeating-linear-gradient(45deg, ${w.bg}, ${w.bg} 16px, #1a1206 16px, #1a1206 32px)`,
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="whitespace-nowrap font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-black/70">
                Always shipping ·
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Project spec cards ---- */}
      <section className="relative z-10 mx-auto max-w-6xl space-y-8 px-5 pb-24 sm:px-8 sm:pb-32">
        {p.items.map((proj, i) => (
          <FadeIn key={proj.number} y={40} delay={i * 0.05}>
            <TiltCard max={6} className="rounded-3xl">
              <article
                className="relative overflow-hidden rounded-3xl border p-6 sm:p-9"
                style={{ borderColor: `${w.bg}40`, background: `color-mix(in srgb, ${w.bg} 9%, #0c0a07)` }}
              >
                {/* Corner index */}
                <span
                  className="pointer-events-none absolute -right-3 -top-8 font-display text-[clamp(6rem,18vw,14rem)] leading-none opacity-[0.12]"
                  style={{ color: w.bg }}
                >
                  {proj.number}
                </span>

                <div className="relative grid gap-6 sm:grid-cols-[1.5fr_1fr]">
                  <div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em] text-bone-dim">
                      <span style={{ color: w.bg }}>{proj.category}</span>
                      <span>·</span>
                      <span>{proj.year}</span>
                      <span>·</span>
                      <span>{proj.role}</span>
                    </div>
                    <h3 className="mt-2 font-display text-[clamp(1.6rem,5vw,3rem)] uppercase leading-tight text-bone">
                      {proj.name}
                    </h3>
                    <p className="mt-4 max-w-md text-balance text-base leading-relaxed text-bone-dim sm:text-lg">
                      {proj.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-start justify-between gap-6 sm:items-end">
                    <a
                      href="#"
                      data-cursor="hover"
                      data-cursor-label={p.view}
                      className="group flex h-14 w-14 items-center justify-center rounded-full border transition-colors"
                      style={{ borderColor: w.bg, color: w.bg }}
                    >
                      <ArrowUpRight size={24} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      {proj.stack.map((t) => (
                        <span
                          key={t}
                          className="rounded-full px-3 py-1.5 font-mono text-xs uppercase tracking-wider"
                          style={{ background: `${w.bg}1f`, color: w.panel }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Spec footer line */}
                <div className="mt-6 flex items-center gap-3 border-t pt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-bone-dim" style={{ borderColor: `${w.bg}26` }}>
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: w.bg }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  spec · {proj.number} / {String(p.items.length).padStart(2, '0')}
                </div>
              </article>
            </TiltCard>
          </FadeIn>
        ))}
      </section>
    </PageShell>
  );
}
