import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { CHARACTERS } from '@/data/characters';
import { useLanguage } from '@/hooks/useLanguage';
import PageShell from '@/components/layout/PageShell';
import { LinkPreview } from '@/components/ui/link-preview';
import { GlassButton } from '@/components/ui/glass-button';
import { SkillOrbit } from '@/components/ui/skill-orbit';
import { SkillMarquee } from '@/components/ui/skill-marquee';

const exec = CHARACTERS[2];

// ─── Skill data ────────────────────────────────────────────────────────────────

// Inner ring — 6 most highlighted
const ORBIT_INNER = [
  { name: 'React', icon: 'react' },
  { name: 'Svelte', icon: 'svelte' },
  { name: 'Tailwind', icon: 'tailwindcss' },
  { name: 'Python', icon: 'python' },
  { name: 'CSS', icon: 'css3' },
  { name: 'Claude', icon: 'anthropic' },
];

// Middle ring — 8 items
const ORBIT_MIDDLE = [
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'Supabase', icon: 'supabase' },
  { name: 'n8n', icon: 'n8n' },
  { name: 'HTML5', icon: 'html5' },
  { name: 'Vercel', icon: 'vercel' },
  { name: 'GitHub', icon: 'github' },
  { name: 'VS Code', icon: 'visualstudiocode' },
  { name: 'APIs', icon: 'fastapi' },
];

// Outer ring — 10 items
const ORBIT_OUTER = [
  { name: 'PHP', icon: 'php' },
  { name: 'SQL', icon: 'mysql' },
  { name: 'ChatGPT', icon: 'openai' },
  { name: 'Gemini', icon: 'googlegemini' },
  { name: 'Claude Code', icon: 'anthropic' },
  { name: 'Cursor', icon: 'cursor' },
  { name: 'WordPress', icon: 'wordpress' },
  { name: 'AWS', icon: 'amazonaws' },
  { name: 'Frontend', icon: 'react' },
  { name: 'Backend', icon: 'nodedotjs' },
];

// Marquee rows — remaining / broader skills
const MARQUEE_ROW1 = [
  { name: 'AI', icon: 'openai' },
  { name: 'React', icon: 'react' },
  { name: 'Svelte', icon: 'svelte' },
  { name: 'Tailwind', icon: 'tailwindcss' },
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'Python', icon: 'python' },
  { name: 'Supabase', icon: 'supabase' },
];

const MARQUEE_ROW2 = [
  { name: 'n8n', icon: 'n8n' },
  { name: 'GitHub', icon: 'github' },
  { name: 'VS Code', icon: 'visualstudiocode' },
  { name: 'Vercel', icon: 'vercel' },
  { name: 'AWS', icon: 'amazonaws' },
  { name: 'WordPress', icon: 'wordpress' },
  { name: 'Cursor', icon: 'cursor' },
];

// ─── Experience items ──────────────────────────────────────────────────────────

const ITEMS_ES = [
  {
    role: 'Monitor y Organizador de Eventos',
    period: '+3 años',
    org: null,
    link: null,
    preview: null,
    segments: [
      { text: 'Más de ', highlight: false },
      { text: '3 años', highlight: true },
      { text: ' organizando y coordinando ', highlight: false },
      { text: 'eventos', highlight: true },
      { text: ' y actividades. Gestión de grupos, ', highlight: false },
      { text: 'liderazgo', highlight: true },
      { text: ' en situaciones de presión y comunicación efectiva con equipos de trabajo.', highlight: false },
    ],
  },
  {
    role: 'Camarero',
    period: '2 años',
    org: null,
    link: null,
    preview: null,
    segments: [
      { text: 'Dos años en ', highlight: false },
      { text: 'hostelería', highlight: true },
      { text: ' desarrollando ', highlight: false },
      { text: 'agilidad', highlight: true },
      { text: ', atención al ', highlight: false },
      { text: 'cliente', highlight: true },
      { text: ' y trabajo bajo presión en entornos ', highlight: false },
      { text: 'dinámicos', highlight: true },
      { text: '.', highlight: false },
    ],
  },
  {
    role: 'Grado Superior DAW',
    period: 'Finalizado',
    org: 'Formación Profesional',
    link: null,
    preview: null,
    segments: [
      { text: 'Desarrollo de Aplicaciones ', highlight: false },
      { text: 'Web', highlight: true },
      { text: '. Fundamentos sólidos de ', highlight: false },
      { text: 'frontend', highlight: true },
      { text: ', ', highlight: false },
      { text: 'backend', highlight: true },
      { text: ', bases de datos y ', highlight: false },
      { text: 'despliegue', highlight: true },
      { text: '.', highlight: false },
    ],
  },
  {
    role: 'Bachillerato',
    period: 'Finalizado',
    org: 'IES Jimena de Gijón',
    link: 'https://iesjimena.com',
    preview: 'https://www.iesjimena.es/wp-content/uploads/2021/09/jimena.jpg',
    segments: [
      { text: 'Bachillerato en ', highlight: false },
      { text: 'IES Jimena de Gijón', highlight: true },
      { text: '. Base ', highlight: false },
      { text: 'académica', highlight: true },
      { text: ' y formación previa a la especialización en ', highlight: false },
      { text: 'desarrollo', highlight: true },
      { text: '.', highlight: false },
    ],
  },
];

const ITEMS_EN = [
  {
    role: 'Monitor & Event Organizer',
    period: '+3 years',
    org: null,
    link: null,
    preview: null,
    segments: [
      { text: 'Over ', highlight: false },
      { text: '3 years', highlight: true },
      { text: ' organizing and coordinating ', highlight: false },
      { text: 'events', highlight: true },
      { text: ' and activities. Group management, ', highlight: false },
      { text: 'leadership', highlight: true },
      { text: ' under pressure and effective team communication.', highlight: false },
    ],
  },
  {
    role: 'Waiter',
    period: '2 years',
    org: null,
    link: null,
    preview: null,
    segments: [
      { text: 'Two years in ', highlight: false },
      { text: 'hospitality', highlight: true },
      { text: ' building ', highlight: false },
      { text: 'agility', highlight: true },
      { text: ', ', highlight: false },
      { text: 'customer focus', highlight: true },
      { text: ' and the ability to perform under ', highlight: false },
      { text: 'pressure', highlight: true },
      { text: '.', highlight: false },
    ],
  },
  {
    role: 'Higher Degree in Web App Dev (DAW)',
    period: 'Completed',
    org: 'Vocational Training',
    link: null,
    preview: null,
    segments: [
      { text: 'Web Application ', highlight: false },
      { text: 'Development', highlight: true },
      { text: '. Solid grounding in ', highlight: false },
      { text: 'frontend', highlight: true },
      { text: ', ', highlight: false },
      { text: 'backend', highlight: true },
      { text: ', databases and ', highlight: false },
      { text: 'deployment', highlight: true },
      { text: '.', highlight: false },
    ],
  },
  {
    role: 'Bachillerato',
    period: 'Completed',
    org: 'IES Jimena de Gijón',
    link: 'https://iesjimena.com',
    preview: 'https://www.iesjimena.es/wp-content/uploads/2021/09/jimena.jpg',
    segments: [
      { text: 'Completed Bachillerato at ', highlight: false },
      { text: 'IES Jimena de Gijón', highlight: true },
      { text: '. Academic ', highlight: false },
      { text: 'foundation', highlight: true },
      { text: ' before specialising in ', highlight: false },
      { text: 'development', highlight: true },
      { text: '.', highlight: false },
    ],
  },
];

// ─── Experience card ───────────────────────────────────────────────────────────

function ExperienceCard({
  item,
  index,
  ink,
}: {
  item: typeof ITEMS_ES[0];
  index: number;
  ink: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col gap-3 rounded-2xl border p-6 sm:p-7 transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(255,255,255,0.07)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {/* hover glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${ink}10 0%, transparent 70%)`,
        }}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="w-full">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-mono uppercase tracking-[0.22em] px-2 py-0.5 rounded-full border"
              style={{ color: ink, borderColor: `${ink}30`, background: `${ink}10` }}
            >
              {item.period}
            </span>
            {item.org && (
              <span className="text-[10px] font-mono text-white/35 tracking-wide">
                {item.link ? (
                  <LinkPreview
                    href={item.link}
                    imageSrc={item.preview ?? undefined}
                    imageAlt={item.org}
                    className="text-white/40 hover:text-white/70 transition-colors no-underline"
                  >
                    {item.org}
                  </LinkPreview>
                ) : (
                  item.org
                )}
              </span>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-white/90 leading-tight">
            {item.role}
          </h3>
        </div>
      </div>

      <p className="text-sm text-white/55 leading-relaxed">
        {item.segments.map((seg, si) =>
          seg.highlight ? (
            <span key={si} className="font-semibold text-white/90">
              {seg.text}
            </span>
          ) : (
            <span key={si}>{seg.text}</span>
          )
        )}
      </p>
    </motion.div>
  );
}

// ─── Fullscreen skills lock overlay ───────────────────────────────────────────

function SkillsLockOverlay({
  onUnlock,
  lang,
}: {
  onUnlock: () => void;
  lang: string;
}) {
  return (
    <motion.div
      key="lock-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{
        background: 'rgba(4, 3, 2, 0.72)',
        backdropFilter: 'blur(28px) saturate(160%)',
        WebkitBackdropFilter: 'blur(28px) saturate(160%)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-6 text-center px-6"
      >
        {/* padlock */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <rect
              x="10" y="24" width="32" height="22" rx="6"
              fill="rgba(255,255,255,0.06)"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1.5"
            />
            <path
              d="M17 24V17a9 9 0 0118 0v7"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="26" cy="35" r="3.5" fill="rgba(255,255,255,0.5)" />
          </svg>
        </motion.div>

        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/35">
          {lang === 'es' ? 'Habilidades bloqueadas' : 'Skills locked'}
        </p>

        <GlassButton onClick={onUnlock}>
          {lang === 'es' ? 'Desbloquear stack' : 'Unlock stack'}
        </GlassButton>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ExperiencePage() {
  const { lang, d } = useLanguage();
  const ink = exec.world.ink;
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // scroll lock state
  const [locked, setLocked] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const lockedRef = useRef(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  const items = lang === 'es' ? ITEMS_ES : ITEMS_EN;

  // ── Scroll lock logic ────────────────────────────────────────────────────────

  const preventScroll = useCallback((e: Event) => {
    if (lockedRef.current) e.preventDefault();
  }, []);

  const lockScroll = useCallback(() => {
    lockedRef.current = true;
    setLocked(true);
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
  }, [preventScroll]);

  const unlockScroll = useCallback(() => {
    lockedRef.current = false;
    setLocked(false);
    window.removeEventListener('wheel', preventScroll);
    window.removeEventListener('touchmove', preventScroll);
  }, [preventScroll]);

  // Watch sentinel entering the viewport
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || unlocked) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !lockedRef.current && !unlocked) {
          lockScroll();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [unlocked, lockScroll]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      lockedRef.current = false;
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, [preventScroll]);

  const handleUnlock = () => {
    unlockScroll();
    setUnlocked(true);
  };

  return (
    <>
      {/* Fullscreen lock overlay — rendered at root level via AnimatePresence */}
      <AnimatePresence>
        {locked && !unlocked && (
          <SkillsLockOverlay onUnlock={handleUnlock} lang={lang} />
        )}
      </AnimatePresence>

      <PageShell character={exec}>
        <div ref={containerRef} className="relative w-full">
          {/* ── Hero ────────────────────────────────────────────────────────── */}
          <motion.section
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-16 text-center"
          >
            {/* background bloom */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 70% 55% at 50% 30%, ${ink}22 0%, transparent 65%)`,
              }}
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em]"
              style={{ color: ink }}
            >
              {d.experience.eyebrow}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="relative text-5xl font-bold leading-none tracking-tight sm:text-7xl lg:text-8xl"
              style={{
                background: `linear-gradient(135deg, #ffffff 0%, ${ink}cc 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {d.experience.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-md text-sm leading-relaxed text-white/45 sm:text-base"
            >
              {d.experience.intro}
            </motion.p>

            {/* scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute bottom-8 flex flex-col items-center gap-2"
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
                {d.meta.scroll}
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="h-8 w-px rounded-full"
                style={{ background: `linear-gradient(to bottom, ${ink}60, transparent)` }}
              />
            </motion.div>
          </motion.section>

          {/* ── Content ──────────────────────────────────────────────────────── */}
          <section className="relative mx-auto max-w-2xl px-4 pb-32 sm:px-6">
            {/* separator */}
            <div className="mb-12 flex items-center gap-4">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${ink}40)` }} />
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: ink, boxShadow: `0 0 8px ${ink}` }}
              />
              <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${ink}40)` }} />
            </div>

            {/* experience cards */}
            <div className="flex flex-col gap-4">
              {items.map((item, i) => (
                <ExperienceCard key={item.role} item={item} index={i} ink={ink} />
              ))}
            </div>

            {/* ── Sentinel — triggers scroll lock when half-visible ── */}
            <div ref={sentinelRef} className="mt-24 h-1 w-full" aria-hidden />

            {/* ── Skills revealed after unlock ── */}
            <AnimatePresence>
              {unlocked && (
                <motion.div
                  key="skills"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center gap-16 pt-8 pb-8"
                >
                  <SkillOrbit inner={ORBIT_INNER} middle={ORBIT_MIDDLE} outer={ORBIT_OUTER} />
                  <div className="w-full overflow-hidden">
                    <SkillMarquee row1={MARQUEE_ROW1} row2={MARQUEE_ROW2} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </PageShell>
    </>
  );
}
