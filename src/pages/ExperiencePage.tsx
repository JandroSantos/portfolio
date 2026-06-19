import { motion } from 'framer-motion';
import { CHARACTERS } from '@/data/characters';
import { useLanguage } from '@/hooks/useLanguage';
import PageShell from '@/components/layout/PageShell';
import FadeIn from '@/components/ui/FadeIn';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import DecodeText from '@/components/ui/DecodeText';
import GrowthChart from '@/components/effects/GrowthChart';

const exec = CHARACTERS[2];

/** Career trajectory feeding the annual-report chart. */
const GROWTH = [
  { label: '2021', value: 18 },
  { label: '2022', value: 34 },
  { label: '2023', value: 52 },
  { label: '2024', value: 71 },
  { label: '2025', value: 88 },
  { label: 'now', value: 100 },
];

/**
 * The Executive — refined, premium. Navy + gold, animated stats and
 * an elegant vertical timeline. The "boardroom" world.
 */
export default function ExperiencePage() {
  const { d, lang } = useLanguage();
  const e = d.experience;
  const w = exec.world; // bg navy, accent gold
  const gold = w.accent;

  return (
    <PageShell
      character={exec}
      background={`radial-gradient(130% 80% at 50% -10%, ${w.deep}66 0%, #06080f 55%)`}
    >
      {/* ---- Hero ---- */}
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-5 pb-12 pt-32 sm:px-8 sm:pt-40 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <FadeIn>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: gold }}>
              {e.eyebrow}
            </span>
          </FadeIn>
          <h1 className="heading-kinetic mt-4 text-[clamp(3.2rem,14vw,11rem)] leading-[0.82] text-bone">
            {e.title}
          </h1>
          {/* Gold rule */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 h-px w-40 origin-left"
            style={{ background: `linear-gradient(90deg, ${gold}, transparent)` }}
          />
          <FadeIn delay={0.15} className="mt-6 max-w-xl">
            <DecodeText
              text={e.intro}
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
            src={exec.image}
            alt="The Executive"
            draggable={false}
            className="h-full w-auto select-none object-contain object-bottom"
            style={{ filter: `drop-shadow(0 40px 60px ${w.deep}aa)` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </section>

      {/* ---- Stats ---- */}
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="grid grid-cols-3 divide-x rounded-2xl border" style={{ borderColor: `${gold}33`, ['--tw-divide-opacity' as string]: '1', background: `${w.bg}1a` }}>
          {e.stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.1} className="px-4 py-8 text-center sm:py-10" style={{ borderColor: `${gold}26` }}>
              <AnimatedNumber
                value={s.value}
                className="font-display text-[clamp(2.5rem,8vw,5rem)] leading-none"
              />
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-dim sm:text-xs">
                {s.label}
              </p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ---- Growth chart ---- */}
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <FadeIn>
          <div
            className="rounded-3xl border p-5 sm:p-8"
            style={{ borderColor: `${gold}26`, background: `${w.bg}14` }}
          >
            <div className="mb-4 flex items-baseline justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: gold }}>
                {lang === 'es' ? 'Trayectoria' : 'Trajectory'}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone-dim">
                {lang === 'es' ? 'crecimiento compuesto' : 'compounding growth'}
              </span>
            </div>
            <GrowthChart color={gold} points={GROWTH} className="h-auto w-full" />
          </div>
        </FadeIn>
      </section>

      {/* ---- Timeline ---- */}
      <section className="mx-auto max-w-4xl px-5 pb-24 sm:px-8 sm:pb-32">
        <ol className="relative ml-2 border-l" style={{ borderColor: `${gold}44` }}>
          {e.items.map((job, i) => (
            <li key={job.role} className="relative pb-16 pl-8 last:pb-0 sm:pl-12">
              {/* Gold node */}
              <span
                className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full ring-4"
                style={{ background: gold, boxShadow: `0 0 16px ${gold}99`, ['--tw-ring-color' as string]: '#06080f' }}
              />
              <FadeIn delay={i * 0.08} y={28}>
                <span className="font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: gold }}>
                  {job.period}
                </span>
                <h3 className="mt-2 font-display text-[clamp(1.6rem,5vw,2.8rem)] uppercase leading-tight text-bone">
                  {job.role}
                </h3>
                <p className="mt-1 text-sm font-medium" style={{ color: w.panel }}>{job.org}</p>
                <p className="mt-4 max-w-2xl text-balance text-base leading-relaxed text-bone-dim sm:text-lg">
                  {job.summary}
                </p>
                <ul className="mt-5 space-y-2">
                  {job.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-sm text-bone-dim sm:text-base">
                      <span className="mt-2 h-1 w-3 shrink-0" style={{ background: gold }} />
                      {h}
                    </li>
                  ))}
                </ul>
              </FadeIn>
            </li>
          ))}
        </ol>
      </section>
    </PageShell>
  );
}
