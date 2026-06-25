import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHARACTERS } from '@/data/characters';
import { useLanguage } from '@/hooks/useLanguage';
import PageShell from '@/components/layout/PageShell';
import { LinkPreview } from '@/components/ui/link-preview';
import { GlassButton } from '@/components/ui/glass-button';
import { SkillOrbit } from '@/components/ui/skill-orbit';
import { SkillMarquee } from '@/components/ui/skill-marquee';

const exec = CHARACTERS[2];

const SKILLS_BG =
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80';

// ─── Skill data ────────────────────────────────────────────────────────────────

const ORBIT_INNER = [
  { name: 'React', icon: 'react' },
  { name: 'Claude', icon: 'anthropic' },
  { name: 'Tailwind', icon: 'tailwindcss' },
  { name: 'Python', icon: 'python' },
  { name: 'Svelte', icon: 'svelte' },
  { name: 'Supabase', icon: 'supabase' },
];
const ORBIT_MIDDLE = [
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'n8n', icon: 'n8n' },
  { name: 'Vercel', icon: 'vercel' },
  { name: 'GitHub', icon: 'github' },
  { name: 'CSS', icon: 'css3' },
  { name: 'SQL', icon: 'mysql' },
  { name: 'PHP', icon: 'php' },
  { name: 'AWS', icon: 'amazonaws' },
];
const ORBIT_OUTER = [
  { name: 'HTML5', icon: 'html5' },
  { name: 'WordPress', icon: 'wordpress' },
  { name: 'VS Code', icon: 'visualstudiocode' },
  { name: 'ChatGPT', icon: 'openai' },
  { name: 'Gemini', icon: 'googlegemini' },
  { name: 'Claude Code', icon: 'anthropic' },
  { name: 'Cursor', icon: 'cursor' },
  { name: 'APIs', icon: 'fastapi' },
  { name: 'Frontend', icon: 'react' },
  { name: 'Backend', icon: 'nodedotjs' },
];
const MARQUEE_ROW1 = [
  { name: 'Antigravity', icon: 'vercel' },
  { name: 'Image AI', icon: 'openai' },
  { name: 'n8n', icon: 'n8n' },
  { name: 'Claude Code', icon: 'anthropic' },
  { name: 'AI', icon: 'openai' },
  { name: 'Backend', icon: 'nodedotjs' },
];
const MARQUEE_ROW2 = [
  { name: 'Frontend', icon: 'react' },
  { name: 'WordPress', icon: 'wordpress' },
  { name: 'APIs', icon: 'fastapi' },
  { name: 'Cursor', icon: 'cursor' },
  { name: 'Gemini', icon: 'googlegemini' },
  { name: 'AWS', icon: 'amazonaws' },
];

// ─── Experience items ──────────────────────────────────────────────────────────

const ITEMS_ES = [
  {
    role: 'Monitor y Organizador de Eventos',
    period: '+3 años',
    org: null as string | null,
    link: null as string | null,
    preview: null as string | null,
    segments: [
      { text: 'Más de ', h: false }, { text: '3 años', h: true },
      { text: ' organizando y coordinando ', h: false }, { text: 'eventos', h: true },
      { text: ' y actividades. Gestión de grupos, ', h: false }, { text: 'liderazgo', h: true },
      { text: ' bajo presión y comunicación efectiva con equipos.', h: false },
    ],
  },
  {
    role: 'Camarero',
    period: '2 años',
    org: null, link: null, preview: null,
    segments: [
      { text: 'Dos años en ', h: false }, { text: 'hostelería', h: true },
      { text: ': ', h: false }, { text: 'agilidad', h: true },
      { text: ', atención al ', h: false }, { text: 'cliente', h: true },
      { text: ' y trabajo bajo presión en entornos ', h: false }, { text: 'dinámicos', h: true },
      { text: '.', h: false },
    ],
  },
  {
    role: 'Grado Superior DAW',
    period: 'Finalizado',
    org: 'Formación Profesional', link: null, preview: null,
    segments: [
      { text: 'Desarrollo de Aplicaciones ', h: false }, { text: 'Web', h: true },
      { text: '. Fundamentos de ', h: false }, { text: 'frontend', h: true },
      { text: ', ', h: false }, { text: 'backend', h: true },
      { text: ', bases de datos y ', h: false }, { text: 'despliegue', h: true },
      { text: '.', h: false },
    ],
  },
  {
    role: 'Bachillerato',
    period: 'Finalizado',
    org: 'IES Jimena de Gijón',
    link: 'https://iesjimena.com',
    preview: 'https://www.iesjimena.es/wp-content/uploads/2021/09/jimena.jpg',
    segments: [
      { text: 'Bachillerato en ', h: false }, { text: 'IES Jimena', h: true },
      { text: '. Base ', h: false }, { text: 'académica', h: true },
      { text: ' previa a especializarme en ', h: false }, { text: 'desarrollo', h: true },
      { text: '.', h: false },
    ],
  },
];

const ITEMS_EN = [
  {
    role: 'Monitor & Event Organizer',
    period: '+3 years',
    org: null as string | null, link: null as string | null, preview: null as string | null,
    segments: [
      { text: 'Over ', h: false }, { text: '3 years', h: true },
      { text: ' organizing and coordinating ', h: false }, { text: 'events', h: true },
      { text: ' and activities. Group management, ', h: false }, { text: 'leadership', h: true },
      { text: ' under pressure and effective communication.', h: false },
    ],
  },
  {
    role: 'Waiter',
    period: '2 years',
    org: null, link: null, preview: null,
    segments: [
      { text: 'Two years in ', h: false }, { text: 'hospitality', h: true },
      { text: ': ', h: false }, { text: 'agility', h: true },
      { text: ', ', h: false }, { text: 'customer focus', h: true },
      { text: ' and performing under ', h: false }, { text: 'pressure', h: true },
      { text: '.', h: false },
    ],
  },
  {
    role: 'Higher Degree in Web App Dev (DAW)',
    period: 'Completed',
    org: 'Vocational Training', link: null, preview: null,
    segments: [
      { text: 'Web Application ', h: false }, { text: 'Development', h: true },
      { text: '. Solid grounding in ', h: false }, { text: 'frontend', h: true },
      { text: ', ', h: false }, { text: 'backend', h: true },
      { text: ', databases and ', h: false }, { text: 'deployment', h: true },
      { text: '.', h: false },
    ],
  },
  {
    role: 'Bachillerato',
    period: 'Completed',
    org: 'IES Jimena de Gijón',
    link: 'https://iesjimena.com',
    preview: 'https://www.iesjimena.es/wp-content/uploads/2021/09/jimena.jpg',
    segments: [
      { text: 'Bachillerato at ', h: false }, { text: 'IES Jimena', h: true },
      { text: '. Academic ', h: false }, { text: 'foundation', h: true },
      { text: ' before specialising in ', h: false }, { text: 'development', h: true },
      { text: '.', h: false },
    ],
  },
];

// ─── Experience card ───────────────────────────────────────────────────────────

function ExperienceCard({
  item, index, ink,
}: {
  item: typeof ITEMS_ES[0];
  index: number;
  ink: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-2xl p-5 sm:p-6 transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 3px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.25)',
      }}
    >
      {/* top-edge shine */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)` }}
      />
      {/* hover tint */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${ink}10, transparent)` }}
      />

      <div className="relative flex flex-col gap-2.5">
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold font-mono uppercase tracking-[0.18em] border"
            style={{
              color: ink,
              background: `${ink}14`,
              borderColor: `${ink}28`,
            }}
          >
            {item.period}
          </span>
          {item.org && (
            item.link ? (
              <LinkPreview
                href={item.link}
                imageSrc={item.preview ?? undefined}
                imageAlt={item.org}
                className="text-[11px] font-mono text-white/35 hover:text-white/55 transition-colors no-underline"
              >
                {item.org}
              </LinkPreview>
            ) : (
              <span className="text-[11px] font-mono text-white/30">{item.org}</span>
            )
          )}
        </div>

        {/* Role */}
        <h3 className="text-[15px] sm:text-base font-semibold tracking-tight text-white/88 leading-snug">
          {item.role}
        </h3>

        {/* Description */}
        <p className="text-[13px] sm:text-sm leading-relaxed text-white/45">
          {item.segments.map((seg, si) =>
            seg.h ? (
              <span key={si} className="font-semibold text-white/80">{seg.text}</span>
            ) : (
              <span key={si}>{seg.text}</span>
            )
          )}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Skills section ────────────────────────────────────────────────────────────

function SkillsSection({ ink }: { ink: string }) {
  const { lang } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* Fixed floating button — appears when section in view, disappears on unlock */}
      <AnimatePresence>
        {inView && !unlocked && (
          <motion.div
            key="cta"
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="fixed bottom-9 left-1/2 z-[150] -translate-x-1/2 pointer-events-auto"
          >
            <GlassButton size="lg" onClick={() => setUnlocked(true)}>
              {lang === 'es' ? '✦  Descubre mi stack' : '✦  Discover my stack'}
            </GlassButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section card */}
      <div
        ref={sectionRef}
        className="relative w-full rounded-3xl overflow-hidden"
        style={{ minHeight: '480px' }}
      >
        {/* Background image */}
        <img
          src={SKILLS_BG}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ filter: 'brightness(0.45) saturate(1.2)' }}
        />
        {/* Gradient overlay — stronger at edges */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 75% 65% at 50% 55%, transparent 20%, rgba(4,4,10,0.75) 100%)',
          }}
        />
        {/* Top / bottom fade to merge with page */}
        <div
          className="absolute inset-x-0 top-0 h-24"
          style={{ background: 'linear-gradient(to bottom, rgba(4,4,10,0.9), transparent)' }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-24"
          style={{ background: 'linear-gradient(to top, rgba(4,4,10,0.9), transparent)' }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center py-14 px-4">
          <AnimatePresence mode="wait">
            {!unlocked ? (
              /* Pre-unlock teaser */
              <motion.div
                key="teaser"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6, transition: { duration: 0.25 } }}
                transition={{ duration: 0.45 }}
                className="flex flex-col items-center gap-5 text-center"
              >
                {/* Concentric pulsing rings */}
                <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: 52 + i * 38,
                        height: 52 + i * 38,
                        border: `1px solid ${ink}`,
                        opacity: 0.25 - i * 0.06,
                      }}
                      animate={{ scale: [1, 1.07, 1], opacity: [0.25 - i * 0.06, 0.45 - i * 0.06, 0.25 - i * 0.06] }}
                      transition={{ duration: 2.6 + i * 0.4, delay: i * 0.35, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  ))}
                  {/* Center glyph */}
                  <div
                    className="relative flex items-center justify-center rounded-full text-lg font-bold select-none"
                    style={{
                      width: 52,
                      height: 52,
                      background: `${ink}18`,
                      border: `1px solid ${ink}40`,
                      boxShadow: `0 0 28px ${ink}35`,
                      color: ink,
                    }}
                  >
                    ✦
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: ink }}>
                    {lang === 'es' ? 'Stack tecnológico' : 'Tech stack'}
                  </p>
                  <h2 className="text-xl font-semibold text-white/75 sm:text-2xl">
                    {lang === 'es' ? 'Herramientas que domino' : 'Tools I master'}
                  </h2>
                </div>
              </motion.div>
            ) : (
              /* Post-unlock: orbit + marquee */
              <motion.div
                key="skills"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex w-full flex-col items-center gap-10"
              >
                {/* Orbit — extra top padding prevents icon overflow */}
                <div className="w-full flex justify-center" style={{ paddingTop: 40, paddingBottom: 8 }}>
                  <SkillOrbit inner={ORBIT_INNER} middle={ORBIT_MIDDLE} outer={ORBIT_OUTER} />
                </div>

                {/* Marquee */}
                <div className="w-full overflow-hidden">
                  <SkillMarquee row1={MARQUEE_ROW1} row2={MARQUEE_ROW2} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ExperiencePage() {
  const { lang, d } = useLanguage();
  const ink = exec.world.ink;
  const items = lang === 'es' ? ITEMS_ES : ITEMS_EN;

  return (
    <PageShell character={exec}>
      <div className="relative w-full">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16 text-center">
          {/* bloom */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 50% 25%, ${ink}1e 0%, transparent 65%)`,
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 font-mono text-[10px] uppercase tracking-[0.32em]"
            style={{ color: `${ink}cc` }}
          >
            {d.experience.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(3rem,10vw,7rem)] font-bold leading-[0.95] tracking-tight"
            style={{
              background: `linear-gradient(150deg, #fff 30%, ${ink}aa 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {d.experience.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 max-w-sm text-sm leading-relaxed text-white/38 sm:text-[15px]"
          >
            {d.experience.intro}
          </motion.p>

          {/* scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="absolute bottom-6 flex flex-col items-center gap-1.5"
          >
            <span className="font-mono text-[8px] uppercase tracking-[0.32em] text-white/18">
              {d.meta.scroll}
            </span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="h-7 w-px"
              style={{ background: `linear-gradient(to bottom, ${ink}44, transparent)` }}
            />
          </motion.div>
        </section>

        {/* ── Experience cards ───────────────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-xl px-5 sm:px-6">
          {/* thin rule */}
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${ink}30)` }} />
            <div className="h-1 w-1 rounded-full" style={{ background: `${ink}80` }} />
            <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${ink}30)` }} />
          </div>

          <div className="flex flex-col gap-2.5">
            {items.map((item, i) => (
              <ExperienceCard key={item.role} item={item} index={i} ink={ink} />
            ))}
          </div>
        </section>

        {/* ── Skills ────────────────────────────────────────────────────────── */}
        <section className="mx-auto mt-12 max-w-4xl px-4 pb-36 sm:px-6">
          <SkillsSection ink={ink} />
        </section>

      </div>
    </PageShell>
  );
}
