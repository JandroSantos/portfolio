import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { CHARACTERS } from '@/data/characters';
import { useLanguage } from '@/hooks/useLanguage';
import PageShell from '@/components/layout/PageShell';

const exec = CHARACTERS[2];

/* ─── Gold horizontal rule ─────────────────────────────────────────── */
function GoldRule({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className="h-px w-full origin-left"
      style={{ background: 'linear-gradient(90deg, #d2ab5b, #d2ab5b60, transparent)' }}
    />
  );
}

/* ─── Stat block ───────────────────────────────────────────────────── */
function StatBlock({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-1 flex-col items-center gap-3 px-4 py-10 text-center"
    >
      <span
        className="font-display font-black leading-none text-bone"
        style={{ fontSize: 'clamp(3.5rem, 9vw, 7rem)' }}
      >
        {value}
      </span>
      <div className="h-px w-12" style={{ background: '#d2ab5b' }} />
      <p className="font-mono text-[10px] uppercase tracking-[0.35em]" style={{ color: '#d2ab5b80' }}>
        {label}
      </p>
    </motion.div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */
export default function ExperiencePage() {
  const { d, lang } = useLanguage();
  const e = d.experience;
  const w = exec.world;
  const gold = w.accent; // #d2ab5b

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const figurineY = useTransform(heroScroll, [0, 1], [0, -80]);
  const textY = useTransform(heroScroll, [0, 1], [0, -40]);
  const heroOpacity = useTransform(heroScroll, [0, 0.75, 1], [1, 1, 0]);

  return (
    <PageShell character={exec} background="#06080f">

      {/* ══ COVER ════════════════════════════════════════════════════ */}
      <div
        ref={heroRef}
        className="relative flex min-h-[100svh] flex-col overflow-hidden"
        style={{ background: '#06080f' }}
      >
        {/* Ghost REPORT word */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-end pr-8 select-none font-display font-black uppercase leading-none text-bone"
          style={{ fontSize: 'clamp(6rem, 22vw, 18rem)', opacity: 0.03 }}
        >
          REPORT
        </span>

        {/* Main cover layout */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 mx-auto flex flex-1 w-full max-w-7xl flex-col items-start justify-center gap-0 px-8 py-32 sm:px-16 lg:flex-row lg:items-stretch lg:gap-0 lg:py-0"
        >
          {/* LEFT — figurine */}
          <motion.div
            style={{ y: figurineY }}
            className="flex shrink-0 items-end justify-start lg:h-full lg:w-[40%] lg:items-end"
          >
            <motion.img
              layoutId="world-figurine"
              src={exec.image}
              alt="The Executive"
              draggable={false}
              className="pointer-events-none h-[52svh] w-auto select-none object-contain object-bottom lg:h-[78svh]"
              style={{ filter: `drop-shadow(0 0 80px ${w.deep}aa)` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>

          {/* RIGHT — heading + vertical text */}
          <motion.div
            style={{ y: textY }}
            className="flex flex-1 flex-col justify-center gap-6 lg:justify-center lg:pl-16"
          >
            <p
              className="font-mono text-[11px] uppercase tracking-[0.45em]"
              style={{ color: `${gold}70` }}
            >
              {e.eyebrow}
            </p>
            <motion.h1
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black uppercase leading-[0.85] text-bone"
              style={{ fontSize: 'clamp(4rem, 13vw, 10rem)' }}
            >
              {e.title}
            </motion.h1>
            <GoldRule delay={0.5} />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.9 }}
              className="max-w-sm text-sm leading-relaxed text-bone/50"
            >
              {e.intro}
            </motion.p>
          </motion.div>

          {/* Far right: vertical "EXPERIENCE" text */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:block" aria-hidden>
            <p
              className="select-none font-display font-black uppercase text-bone/[0.04]"
              style={{
                writingMode: 'vertical-lr',
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                letterSpacing: '0.15em',
              }}
            >
              {lang === 'es' ? 'EXPERIENCIA' : 'EXPERIENCE'}
            </p>
          </div>
        </motion.div>

        {/* Bottom gold rule */}
        <div className="relative z-10 px-8 pb-8 sm:px-16">
          <GoldRule delay={0.3} />
        </div>
      </div>

      {/* ══ STATS ROW ═══════════════════════════════════════════════ */}
      <section
        className="border-y"
        style={{ borderColor: `${gold}20`, background: `${w.bg}08` }}
      >
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col divide-y sm:flex-row sm:divide-x sm:divide-y-0" style={{ ['--tw-divide-opacity' as string]: '0.12' }}>
            {e.stats.map((s, i) => (
              <StatBlock key={s.label} value={s.value} label={s.label} delay={i * 0.12} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ PULL QUOTE / TRACK RECORD SECTION ══════════════════════ */}
      <section className="relative overflow-hidden py-28 sm:py-40">
        {/* Ghost word */}
        <span
          aria-hidden
          className="pointer-events-none absolute -left-8 top-1/2 -translate-y-1/2 select-none font-display font-black uppercase leading-none text-bone/[0.025]"
          style={{ fontSize: 'clamp(6rem, 20vw, 16rem)' }}
        >
          {lang === 'es' ? 'TRABAJO' : 'WORK'}
        </span>

        <div className="relative z-10 mx-auto max-w-4xl px-8 sm:px-16">
          <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.45em]" style={{ color: gold }}>
            {lang === 'es' ? '— HISTORIAL' : '— TRACK RECORD'}
          </p>
          <GoldRule />
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 font-display font-black italic leading-[1.05] text-bone"
            style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)' }}
          >
            {lang === 'es'
              ? '"De prototipo a producción. Liderazgo técnico que conecta la estrategia con el código."'
              : '"From prototype to production. Technical leadership that connects strategy with code."'}
          </motion.blockquote>
          <div className="mt-10">
            <GoldRule delay={0.2} />
          </div>
        </div>
      </section>

      {/* ══ TIMELINE ════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-5xl px-8 pb-32 sm:px-16 sm:pb-40">
        <p className="mb-16 font-mono text-[11px] uppercase tracking-[0.45em]" style={{ color: gold }}>
          {lang === 'es' ? '— Posiciones' : '— Positions'}
        </p>

        <ol className="relative space-y-0">
          {e.items.map((job, i) => (
            <li
              key={job.role}
              className="relative flex gap-8 pb-24 last:pb-0 sm:gap-16"
            >
              {/* Gold vertical line + node */}
              <div className="relative flex flex-col items-center">
                <div
                  className="h-3 w-3 shrink-0 rounded-full ring-4"
                  style={{
                    background: gold,
                    boxShadow: `0 0 20px ${gold}88`,
                    ['--tw-ring-color' as string]: '#06080f',
                    marginTop: '1.1rem',
                  }}
                />
                {i < e.items.length - 1 && (
                  <div
                    className="mt-3 w-px flex-1"
                    style={{ background: `linear-gradient(to bottom, ${gold}50, transparent)` }}
                  />
                )}
              </div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 pb-4"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.35em]" style={{ color: `${gold}80` }}>
                  {job.period}
                </p>
                <h3
                  className="mt-2 font-display font-black uppercase leading-[0.88] text-bone"
                  style={{ fontSize: 'clamp(2rem, 6vw, 5rem)' }}
                >
                  {job.role}
                </h3>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: `${gold}60` }}>
                  {job.org}
                </p>

                <div className="mt-6 h-px w-24" style={{ background: `${gold}30` }} />

                <p className="mt-6 max-w-xl text-sm leading-relaxed text-bone/55">
                  {job.summary}
                </p>

                <ul className="mt-6 space-y-3">
                  {job.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-4 font-mono text-[12px] text-bone/45"
                    >
                      <span
                        className="mt-[0.4em] h-[1px] w-6 shrink-0"
                        style={{ background: gold }}
                      />
                      {h}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </li>
          ))}
        </ol>
      </section>

    </PageShell>
  );
}
