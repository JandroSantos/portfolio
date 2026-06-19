import { GraduationCap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { CHARACTERS } from '@/data/characters';
import { useLanguage } from '@/hooks/useLanguage';
import PageShell from '@/components/layout/PageShell';
import FadeIn from '@/components/ui/FadeIn';
import DecodeText from '@/components/ui/DecodeText';
import CodeWindow from '@/components/effects/CodeWindow';
import ContributionGraph from '@/components/effects/ContributionGraph';

const nerd = CHARACTERS[3];

/**
 * The Student — code / IDE aesthetic. Education as a changelog, skills
 * rendered like a file tree, and a "currently learning" tech tray.
 */
export default function StudiesPage() {
  const { d, lang } = useLanguage();
  const s = d.studies;
  const w = nerd.world;

  return (
    <PageShell
      character={nerd}
      background={`radial-gradient(130% 80% at 50% -10%, ${w.deep}40 0%, #060a05 55%)`}
    >
      {/* ---- Hero ---- */}
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-5 pb-12 pt-32 sm:px-8 sm:pt-40 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <FadeIn className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: w.bg }}>
            <span>$</span>
            <span>{s.eyebrow}</span>
          </FadeIn>
          <h1 className="heading-kinetic mt-4 text-[clamp(3.5rem,15vw,12rem)] leading-[0.8] text-bone">
            {s.title}
          </h1>
          <FadeIn delay={0.15} className="mt-6 max-w-xl">
            <DecodeText
              text={s.intro}
              trigger={lang}
              className="text-balance text-lg leading-relaxed text-bone-dim sm:text-xl"
            />
          </FadeIn>
        </div>

        {/* Figurine — layout-id matches the carousel for the "fly-in" transition */}
        <div className="relative hidden h-[55vh] items-end justify-center lg:flex">
          <div aria-hidden className="absolute bottom-0 h-[70%] w-[70%] rounded-full blur-[80px]" style={{ background: w.deep, opacity: 0.4 }} />
          <motion.img
            layoutId="world-figurine"
            src={nerd.image}
            alt="The Student"
            draggable={false}
            className="h-full w-auto select-none object-contain object-bottom"
            style={{ filter: `drop-shadow(0 40px 60px ${w.deep}aa)` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </section>

      {/* ---- Self-typing editor + contribution heatmap ---- */}
      <section className="mx-auto grid max-w-6xl gap-8 px-5 pb-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <FadeIn>
          <CodeWindow color={w.bg} />
        </FadeIn>
        <FadeIn delay={0.12} className="flex flex-col justify-center gap-8">
          <ContributionGraph
            color={w.bg}
            label={lang === 'es' ? 'actividad' : 'activity'}
          />
          <p className="text-balance text-lg leading-relaxed text-bone-dim">
            {lang === 'es'
              ? 'Cada día una línea más. El código es el cuaderno donde practico.'
              : 'One more line every day. Code is the notebook where I practice.'}
          </p>
        </FadeIn>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 pb-16 sm:px-8 lg:grid-cols-2 lg:gap-12">
        {/* ---- Education as changelog ---- */}
        <div className="space-y-4">
          {s.items.map((study, i) => (
            <FadeIn
              key={study.title}
              delay={i * 0.08}
              y={24}
              className="group rounded-2xl border border-ink-line bg-ink-soft/50 p-5 transition-colors hover:border-[color:var(--a)] sm:p-6"
              style={{ ['--a' as string]: w.bg }}
            >
              <div className="flex items-start gap-4">
                <GraduationCap className="mt-1 h-6 w-6 shrink-0" style={{ color: w.bg }} />
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold leading-snug text-bone sm:text-xl">{study.title}</h3>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-bone-dim">
                    {study.org} · {study.period}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-bone-dim">{study.note}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* ---- Skills as file tree ---- */}
        <FadeIn delay={0.15} className="self-start">
          <div className="overflow-hidden rounded-2xl border border-ink-line bg-[#070d07]">
            <div className="flex items-center gap-2 border-b border-ink-line px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-2 font-mono text-[11px] text-bone-dim">jandro@dev: ~/skills</span>
            </div>
            <div className="space-y-4 p-5 font-mono text-sm sm:p-6">
              {s.skills.map((group) => (
                <div key={group.label}>
                  <p className="text-bone-dim">
                    <span style={{ color: w.bg }}>›</span> {group.label.toLowerCase()}/
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1.5 border-l pl-4" style={{ borderColor: `${w.bg}33` }}>
                    {group.items.map((item) => (
                      <span key={item} className="text-bone">
                        <span style={{ color: w.panel }}>—</span> {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <p className="pt-1 text-bone-dim">
                <span style={{ color: w.bg }}>$</span>{' '}
                <span className="inline-block h-4 w-2 animate-pulse align-middle" style={{ background: w.bg }} />
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ---- Currently learning ---- */}
      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 sm:pb-32">
        <FadeIn className="flex items-center gap-2">
          <Sparkles size={16} style={{ color: w.bg }} />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-bone-dim">
            {lang === 'es' ? 'Ahora mismo aprendiendo' : 'Currently learning'}
          </span>
        </FadeIn>
        <div className="mt-5 flex flex-wrap gap-3">
          {s.learning.map((t, i) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-full border px-5 py-2.5 font-display text-lg uppercase tracking-wide"
              style={{ borderColor: `${w.bg}55`, color: w.bg }}
            >
              {t}
            </motion.span>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
