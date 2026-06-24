import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { CHARACTERS } from '@/data/characters';
import { useLanguage } from '@/hooks/useLanguage';
import PageShell from '@/components/layout/PageShell';

const builder = CHARACTERS[1];

/* ─── Film-strip perforation row ───────────────────────────────────── */
function FilmPerfs({ color }: { color: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none flex w-full items-center gap-[5px] overflow-hidden px-2 py-[5px]"
    >
      {Array.from({ length: 80 }).map((_, i) => (
        <span
          key={i}
          className="block h-[9px] w-[9px] shrink-0 rounded-[2px]"
          style={{ background: `${color}20`, border: `1px solid ${color}18` }}
        />
      ))}
    </div>
  );
}

/* ─── Single cinematic project panel ───────────────────────────────── */
type ProjectItem = {
  number: string;
  name: string;
  category: string;
  year: string;
  role: string;
  description: string;
  stack: string[];
};

function ProjectPanel({
  item,
  index,
  accent,
}: {
  item: ProjectItem;
  index: number;
  accent: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [90, -90]);
  const infoY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const panelOpacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);

  const isEven = index % 2 === 1;

  return (
    <div
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden border-t"
      style={{ borderColor: `${accent}18` }}
    >
      {/* Top film perforations */}
      <FilmPerfs color={accent} />

      {/* Frame counter */}
      <div
        className="absolute right-6 top-8 z-10 font-mono text-[11px] tracking-widest select-none"
        style={{ color: `${accent}45` }}
      >
        {String(index + 1).padStart(4, '0')}
      </div>

      {/* Ghost BUILD/CREO word */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none font-display font-black uppercase leading-none"
        style={{
          fontSize: 'clamp(8rem, 28vw, 22rem)',
          color: `${accent}05`,
        }}
      >
        {isEven ? 'BUILD' : 'CREO'}
      </span>

      {/* Main content */}
      <motion.div
        style={{ opacity: panelOpacity }}
        className={`relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-12 px-6 py-24 sm:px-16 lg:flex-row lg:items-center lg:justify-between lg:gap-20 ${
          isEven ? 'lg:flex-row-reverse' : ''
        }`}
      >
        {/* Giant title column */}
        <div className={`flex-1 ${isEven ? 'text-right' : 'text-left'}`}>
          <motion.p
            className="font-mono text-[11px] uppercase tracking-[0.4em]"
            style={{ y: infoY, color: `${accent}55` }}
          >
            {item.category} — {item.year}
          </motion.p>
          <motion.h2
            className="mt-2 font-display font-black uppercase leading-[0.82] text-bone"
            style={{ y: titleY, fontSize: 'clamp(3.5rem, 13vw, 11rem)' }}
          >
            {item.name}
          </motion.h2>
          {/* Stack as film credits */}
          <motion.p
            className="mt-6 font-mono text-sm italic tracking-wider"
            style={{ y: infoY, color: `${accent}70` }}
          >
            {'// ' + item.stack.map((s) => s.toUpperCase()).join(' · ')}
          </motion.p>
        </div>

        {/* Info column */}
        <motion.div
          style={{ y: infoY }}
          className={`w-full space-y-6 lg:max-w-sm ${isEven ? 'text-right lg:text-right' : 'text-left'}`}
        >
          <div>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.35em]"
              style={{ color: accent }}
            >
              {item.role}
            </p>
            <p className="mt-3 text-base leading-relaxed text-bone/55">
              {item.description}
            </p>
          </div>
          <div
            className={`flex flex-wrap gap-2 ${isEven ? 'justify-end' : 'justify-start'}`}
          >
            {item.stack.map((s) => (
              <span
                key={s}
                className="font-mono text-[10px] uppercase tracking-[0.3em]"
                style={{
                  color: accent,
                  border: `1px solid ${accent}35`,
                  padding: '3px 8px',
                  borderRadius: 2,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom film perforations */}
      <FilmPerfs color={accent} />
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */
export default function ProjectsPage() {
  const { d, lang } = useLanguage();
  const p = d.projects;
  const w = builder.world;

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroScroll, [0, 1], [0, -100]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7, 1], [1, 1, 0]);
  const figurineY = useTransform(heroScroll, [0, 1], [0, -60]);

  return (
    <PageShell character={builder} background="#050403">

      {/* ══ OPENING TITLE CARD ═══════════════════════════════════════ */}
      <div
        ref={heroRef}
        className="relative flex min-h-[100svh] flex-col overflow-hidden"
        style={{ background: '#050403' }}
      >
        {/* Grain texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '120px',
          }}
        />

        {/* Top perfs */}
        <FilmPerfs color={w.bg} />

        {/* Vertical "ALWAYS SHIPPING" */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute bottom-20 left-6 sm:left-10"
        >
          <p
            className="select-none font-mono text-[10px] uppercase tracking-[0.65em] text-bone/25"
            style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}
          >
            ALWAYS SHIPPING
          </p>
        </motion.div>

        {/* Center: heading left, figurine right */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 mx-auto flex flex-1 flex-col items-start justify-center px-10 sm:px-20 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="max-w-2xl">
            <p
              className="mb-4 font-mono text-[11px] uppercase tracking-[0.45em]"
              style={{ color: w.bg }}
            >
              {p.eyebrow}
            </p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black uppercase leading-[0.82] text-bone"
              style={{ fontSize: 'clamp(4.5rem, 18vw, 14rem)' }}
            >
              {p.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.9 }}
              className="mt-8 max-w-sm text-sm leading-relaxed text-bone/45"
            >
              {p.intro}
            </motion.p>
          </div>

          {/* Figurine */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ y: figurineY }}
            className="pointer-events-none mt-12 shrink-0 lg:mt-0"
          >
            <motion.img
              layoutId="world-figurine"
              src={builder.image}
              alt="The Builder"
              draggable={false}
              className="h-[48svh] w-auto select-none object-contain object-bottom lg:h-[66svh]"
              style={{ filter: `drop-shadow(0 0 100px ${w.bg}55)` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
        </motion.div>

        {/* Ghost page number */}
        <span
          aria-hidden
          className="pointer-events-none absolute -right-4 -top-4 select-none font-display font-black leading-none"
          style={{ fontSize: 'clamp(10rem, 35vw, 30rem)', color: `${w.bg}05` }}
        >
          02
        </span>

        {/* Bottom perfs */}
        <FilmPerfs color={w.bg} />
      </div>

      {/* ══ CINEMATIC PROJECT PANELS ════════════════════════════════ */}
      {p.items.map((item, i) => (
        <ProjectPanel key={item.number} item={item} index={i} accent={w.bg} />
      ))}

      {/* ══ CLOSING FIN PANEL ══════════════════════════════════════ */}
      <div
        className="relative flex min-h-[55svh] flex-col overflow-hidden border-t"
        style={{ background: '#030201', borderColor: `${w.bg}18` }}
      >
        <FilmPerfs color={w.bg} />
        <div className="flex flex-1 items-center justify-center py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              className="font-display font-black italic leading-none text-bone"
              style={{ fontSize: 'clamp(6rem, 24vw, 20rem)' }}
            >
              FIN.
            </h2>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.5em] text-bone/28">
              {lang === 'es' ? 'más proyectos en camino' : 'more coming soon'}
            </p>
          </motion.div>
        </div>
        <FilmPerfs color={w.bg} />
      </div>

    </PageShell>
  );
}
