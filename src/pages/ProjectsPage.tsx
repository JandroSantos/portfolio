import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import { CHARACTERS } from '@/data/characters';
import { useLanguage } from '@/hooks/useLanguage';
import { hexA } from '@/lib/utils';
import PageShell from '@/components/layout/PageShell';
import ProjectCard from '@/components/projects/ProjectCard';

const builder = CHARACTERS[1];

export default function ProjectsPage() {
  const { d, lang } = useLanguage();
  const p = d.projects;
  const w = builder.world;

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroContentY = useTransform(heroScroll, [0, 1], [0, -80]);
  const figurineY = useTransform(heroScroll, [0, 1], [0, -50]);
  const heroFade = useTransform(heroScroll, [0, 0.8], [1, 0]);

  return (
    <PageShell character={builder} background="#050403">
      {/* Ambient amber aurora field, fixed behind everything */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-1/4 left-1/2 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ background: hexA(w.bg, 0.16) }}
        />
        <div
          className="absolute bottom-0 right-[-10%] h-[60vh] w-[60vh] rounded-full blur-[140px]"
          style={{ background: hexA(w.deep, 0.18) }}
        />
      </div>

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pb-20 pt-32 sm:px-10 lg:px-16"
      >
        {/* Ghost word */}
        <span
          aria-hidden
          className="pointer-events-none absolute -left-2 top-1/2 -translate-y-1/2 select-none font-display uppercase leading-none"
          style={{ fontSize: 'clamp(9rem, 30vw, 26rem)', color: hexA(w.bg, 0.04) }}
        >
          {builder.ghost}
        </span>

        <motion.div
          style={{ y: heroContentY, opacity: heroFade }}
          className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start gap-12 lg:flex-row lg:items-center lg:justify-between"
        >
          {/* Copy */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 backdrop-blur-xl"
              style={{
                background: `linear-gradient(135deg, ${hexA(w.panel, 0.18)}, ${hexA(w.deep, 0.1)})`,
                border: `1px solid ${hexA(w.bg, 0.3)}`,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
              }}
            >
              <Sparkles className="h-3.5 w-3.5" style={{ color: w.accent }} aria-hidden />
              <span
                className="font-mono text-[10px] uppercase tracking-[0.35em]"
                style={{ color: hexA(w.accent, 0.9) }}
              >
                {p.eyebrow}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 font-display uppercase leading-[0.85] text-bone"
              style={{ fontSize: 'clamp(3.75rem, 14vw, 11rem)' }}
            >
              {p.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.9 }}
              className="mt-8 max-w-md text-base leading-relaxed text-bone/55"
            >
              {p.intro}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.9 }}
              className="mt-10 flex items-center gap-3 text-bone/40"
            >
              <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden />
              <span className="font-mono text-[10px] uppercase tracking-[0.4em]">
                {lang === 'es' ? 'Desliza' : 'Scroll'}
              </span>
            </motion.div>
          </div>

          {/* Figurine on a glass pedestal */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ y: figurineY }}
            className="pointer-events-none relative mx-auto hidden shrink-0 md:block"
          >
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
              style={{ background: hexA(w.bg, 0.35) }}
            />
            <motion.img
              layoutId="world-figurine"
              src={builder.image}
              alt="The Builder figurine"
              draggable={false}
              className="relative h-[42svh] w-auto select-none object-contain object-bottom lg:h-[60svh]"
              style={{ filter: `drop-shadow(0 30px 60px ${hexA(w.deep, 0.5)})` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ══ PROJECT SHOWCASE GRID ════════════════════════════════════ */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-28 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
          {p.items.map((item, i) => (
            <ProjectCard
              key={item.number}
              item={item}
              index={i}
              world={w}
              viewLabel={p.view}
              featured={i === 0}
            />
          ))}
        </div>
      </section>

      {/* ══ CLOSING CTA ══════════════════════════════════════════════ */}
      <section className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-32 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[32px] px-8 py-16 text-center backdrop-blur-2xl sm:px-16 sm:py-20"
          style={{
            background: `linear-gradient(160deg, ${hexA(w.panel, 0.16)}, ${hexA(w.deep, 0.1)} 70%, ${hexA('#000', 0.2)})`,
            border: `1px solid ${hexA(w.bg, 0.28)}`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 40px 90px -40px ${hexA(w.deep, 0.6)}`,
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${hexA(w.accent, 0.6)}, transparent)` }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
            style={{ background: hexA(w.bg, 0.25) }}
          />

          <p
            className="font-mono text-[11px] uppercase tracking-[0.4em]"
            style={{ color: hexA(w.accent, 0.85) }}
          >
            {lang === 'es' ? '¿Construimos algo?' : "Let's build something"}
          </p>
          <h2
            className="mx-auto mt-4 max-w-3xl font-display uppercase leading-[0.9] text-bone"
            style={{ fontSize: 'clamp(2.5rem, 9vw, 6rem)' }}
          >
            {lang === 'es' ? 'Más proyectos en camino' : 'More projects coming'}
          </h2>
          <a
            href="#contact"
            className="mt-10 inline-flex min-h-[52px] cursor-pointer items-center gap-2.5 rounded-full px-7 font-mono text-[12px] font-semibold uppercase tracking-[0.25em] text-bone transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2"
            style={{
              background: `linear-gradient(135deg, ${hexA(w.bg, 0.4)}, ${hexA(w.deep, 0.3)})`,
              border: `1px solid ${hexA(w.bg, 0.5)}`,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.16), 0 14px 36px -12px ${hexA(w.bg, 0.5)}`,
            }}
          >
            <Sparkles className="h-4 w-4" style={{ color: w.accent }} aria-hidden />
            {lang === 'es' ? 'Hablemos' : "Let's talk"}
          </a>
        </motion.div>
      </section>
    </PageShell>
  );
}
