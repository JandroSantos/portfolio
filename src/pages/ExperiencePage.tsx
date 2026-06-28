import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
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

// ─── Card ─────────────────────────────────────────────────────────────────────

function ExperienceCard({ item, index, ink }: {
  item: typeof ITEMS_ES[0]; index: number; ink: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-2xl p-5 sm:p-6"
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      {/* top shine line */}
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px rounded-full"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }} />

      {/* hover glow */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${ink}0e, transparent)` }} />

      <div className="relative space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full px-2.5 py-[3px] text-[10px] font-mono font-semibold uppercase tracking-[0.16em] border"
            style={{ color: ink, background: `${ink}12`, borderColor: `${ink}28` }}>
            {item.period}
          </span>
          {item.org && (item.link ? (
            <LinkPreview href={item.link} imageSrc={item.preview ?? undefined} imageAlt={item.org}
              className="text-[11px] font-mono text-white/32 hover:text-white/55 transition-colors no-underline">
              {item.org}
            </LinkPreview>
          ) : (
            <span className="text-[11px] font-mono text-white/30">{item.org}</span>
          ))}
        </div>
        <h3 className="text-[15px] font-semibold tracking-tight text-white/88 leading-snug">
          {item.role}
        </h3>
        <p className="text-[13px] leading-relaxed text-white/44">
          {item.segments.map((s, i) =>
            s.h ? <span key={i} className="font-semibold text-white/78">{s.text}</span>
                : <span key={i}>{s.text}</span>
          )}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

/* ── Cursor-following liquid-glass button ─────────────────────────────────
   Anchored bottom-center, drifts toward the pointer with a spring so it
   "follows the mouse" while never leaving the screen. */
function CursorGlassButton({ label, onClick }: { label: string; onClick: () => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 140, damping: 17, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 140, damping: 17, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;
    const onMove = (e: MouseEvent) => {
      const ax = window.innerWidth / 2;
      const ay = window.innerHeight - 80; // anchor near bottom-center
      const dx = e.clientX - ax;
      const dy = e.clientY - ay;
      const max = 130; // max drift radius from anchor
      const dist = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, max / dist) * 0.55;
      x.set(dx * k);
      y.set(dy * k);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [x, y]);

  return (
    <div
      className="-translate-x-1/2"
      style={{ position: 'fixed', bottom: '2.25rem', left: '50%', zIndex: 300 }}
    >
      <motion.div
        style={{ x: sx, y: sy }}
        initial={{ opacity: 0, y: 24, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      >
        <GlassButton size="lg" onClick={onClick}>
          {label}
        </GlassButton>
      </motion.div>
    </div>
  );
}

export default function ExperiencePage() {
  const { lang, d } = useLanguage();
  const ink = exec.world.ink;
  const items = lang === 'es' ? ITEMS_ES : ITEMS_EN;

  // Skills state — lifted here so FloatingCTA renders at page root (no transform parent)
  const skillsRef = useRef<HTMLDivElement>(null);
  const [skillsInView, setSkillsInView] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const el = skillsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setSkillsInView(e.isIntersecting),
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <PageShell character={exec}>

      {/* ── Cursor-following CTA — rendered at page root, truly fixed ──────── */}
      <AnimatePresence>
        {skillsInView && !unlocked && (
          <CursorGlassButton
            key="cursor-cta"
            label={lang === 'es' ? 'Descubre mi stack' : 'Discover my stack'}
            onClick={() => setUnlocked(true)}
          />
        )}
      </AnimatePresence>

      <div className="w-full">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="relative flex min-h-[58vh] flex-col items-center justify-center px-6 pt-24 pb-14 text-center">
          <div className="pointer-events-none absolute inset-0"
            style={{ background: `radial-gradient(ellipse 55% 45% at 50% 22%, ${ink}1c 0%, transparent 65%)` }} />

          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            className="mb-3 font-mono text-[10px] uppercase tracking-[0.32em]"
            style={{ color: `${ink}bb` }}>
            {d.experience.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(3.2rem,9vw,6.5rem)] font-bold leading-none tracking-tight"
            style={{
              background: `linear-gradient(145deg, #fff 25%, ${ink}99 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
            {d.experience.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, duration: 0.45 }}
            className="mt-5 max-w-sm text-[13px] leading-relaxed text-white/38 sm:text-sm">
            {d.experience.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.7 }}
            className="absolute bottom-5 flex flex-col items-center gap-1.5">
            <span className="font-mono text-[8px] uppercase tracking-[0.32em] text-white/18">{d.meta.scroll}</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="h-6 w-px"
              style={{ background: `linear-gradient(to bottom, ${ink}40, transparent)` }} />
          </motion.div>
        </section>

        {/* ── Experience cards ─────────────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-[560px] px-4 sm:px-0">
          {/* divider */}
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${ink}28)` }} />
            <div className="h-[5px] w-[5px] rounded-full" style={{ background: `${ink}70` }} />
            <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${ink}28)` }} />
          </div>

          <div className="flex flex-col gap-2.5">
            {items.map((item, i) => (
              <ExperienceCard key={item.role} item={item} index={i} ink={ink} />
            ))}
          </div>
        </section>

        {/* ── Skills section ───────────────────────────────────────────────── */}
        <section className="mx-auto mt-12 w-full max-w-4xl px-4 pb-36 sm:px-6">
          <div
            ref={skillsRef}
            className="relative w-full rounded-3xl"
            style={{ minHeight: 480 }}
          >
            {/* clipped backdrop layer (image + overlays) — kept separate so
                node tooltips in the content layer are never cut off */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <img src={SKILLS_BG} alt="" aria-hidden loading="lazy" decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-center select-none"
                style={{ filter: 'brightness(0.4) saturate(1.3)' }} />
              <div className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 55%, transparent 15%, rgba(3,3,8,0.78) 100%)' }} />
              <div className="absolute inset-x-0 top-0 h-20"
                style={{ background: 'linear-gradient(to bottom, rgba(3,3,8,0.88), transparent)' }} />
              <div className="absolute inset-x-0 bottom-0 h-20"
                style={{ background: 'linear-gradient(to top, rgba(3,3,8,0.88), transparent)' }} />
            </div>

            {/* content */}
            <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4">
              <AnimatePresence mode="wait">
                {!unlocked ? (
                  <motion.div key="teaser"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center gap-6 text-center">
                    {/* pulsing rings */}
                    <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
                      {[0, 1, 2].map((i) => (
                        <motion.div key={i}
                          className="absolute rounded-full"
                          style={{ width: 52 + i * 40, height: 52 + i * 40, border: `1px solid ${ink}`, opacity: 0.22 - i * 0.05 }}
                          animate={{ scale: [1, 1.08, 1], opacity: [0.22 - i * 0.05, 0.42 - i * 0.05, 0.22 - i * 0.05] }}
                          transition={{ duration: 2.5 + i * 0.5, delay: i * 0.35, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      ))}
                      <div className="relative flex items-center justify-center rounded-full select-none"
                        style={{ width: 52, height: 52, background: `${ink}16`, border: `1px solid ${ink}38`, boxShadow: `0 0 24px ${ink}28` }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden style={{ color: ink }}>
                          <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2z"
                            fill="currentColor" opacity="0.9" />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: `${ink}cc` }}>
                        {lang === 'es' ? 'Stack tecnológico' : 'Tech stack'}
                      </p>
                      <h2 className="text-xl font-semibold text-white/70 sm:text-2xl">
                        {lang === 'es' ? 'Herramientas que domino' : 'Tools I master'}
                      </h2>
                    </div>
                    {/* spacer so button doesn't overlap content */}
                    <div className="h-10" />
                  </motion.div>
                ) : (
                  <motion.div key="skills"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="flex w-full flex-col items-center gap-10">
                    {/* extra top padding so orbit top icons don't clip */}
                    <div className="flex w-full justify-center" style={{ paddingTop: 44 }}>
                      <SkillOrbit inner={ORBIT_INNER} middle={ORBIT_MIDDLE} outer={ORBIT_OUTER} />
                    </div>
                    <div className="w-full">
                      <SkillMarquee row1={MARQUEE_ROW1} row2={MARQUEE_ROW2} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

      </div>
    </PageShell>
  );
}
