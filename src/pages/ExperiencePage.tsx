import { useRef, useState, useEffect } from 'react';
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
      { text: 'Más de ', h: false },
      { text: '3 años', h: true },
      { text: ' organizando y coordinando ', h: false },
      { text: 'eventos', h: true },
      { text: ' y actividades. Gestión de grupos, ', h: false },
      { text: 'liderazgo', h: true },
      { text: ' bajo presión y comunicación efectiva con equipos de trabajo.', h: false },
    ],
  },
  {
    role: 'Camarero',
    period: '2 años',
    org: null,
    link: null,
    preview: null,
    segments: [
      { text: 'Dos años en ', h: false },
      { text: 'hostelería', h: true },
      { text: ' desarrollando ', h: false },
      { text: 'agilidad', h: true },
      { text: ', atención al ', h: false },
      { text: 'cliente', h: true },
      { text: ' y trabajo bajo presión en entornos ', h: false },
      { text: 'dinámicos', h: true },
      { text: '.', h: false },
    ],
  },
  {
    role: 'Grado Superior DAW',
    period: 'Finalizado',
    org: 'Formación Profesional',
    link: null,
    preview: null,
    segments: [
      { text: 'Desarrollo de Aplicaciones ', h: false },
      { text: 'Web', h: true },
      { text: '. Fundamentos de ', h: false },
      { text: 'frontend', h: true },
      { text: ', ', h: false },
      { text: 'backend', h: true },
      { text: ', bases de datos y ', h: false },
      { text: 'despliegue', h: true },
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
      { text: 'Bachillerato en ', h: false },
      { text: 'IES Jimena', h: true },
      { text: '. Base ', h: false },
      { text: 'académica', h: true },
      { text: ' previa a especializarme en ', h: false },
      { text: 'desarrollo', h: true },
      { text: '.', h: false },
    ],
  },
];

const ITEMS_EN = [
  {
    role: 'Monitor & Event Organizer',
    period: '+3 years',
    org: null as string | null,
    link: null as string | null,
    preview: null as string | null,
    segments: [
      { text: 'Over ', h: false },
      { text: '3 years', h: true },
      { text: ' organizing and coordinating ', h: false },
      { text: 'events', h: true },
      { text: ' and activities. Group management, ', h: false },
      { text: 'leadership', h: true },
      { text: ' under pressure and effective team communication.', h: false },
    ],
  },
  {
    role: 'Waiter',
    period: '2 years',
    org: null,
    link: null,
    preview: null,
    segments: [
      { text: 'Two years in ', h: false },
      { text: 'hospitality', h: true },
      { text: ' building ', h: false },
      { text: 'agility', h: true },
      { text: ', ', h: false },
      { text: 'customer focus', h: true },
      { text: ' and the ability to perform under ', h: false },
      { text: 'pressure', h: true },
      { text: '.', h: false },
    ],
  },
  {
    role: 'Higher Degree in Web App Dev (DAW)',
    period: 'Completed',
    org: 'Vocational Training',
    link: null,
    preview: null,
    segments: [
      { text: 'Web Application ', h: false },
      { text: 'Development', h: true },
      { text: '. Solid grounding in ', h: false },
      { text: 'frontend', h: true },
      { text: ', ', h: false },
      { text: 'backend', h: true },
      { text: ', databases and ', h: false },
      { text: 'deployment', h: true },
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
      { text: 'Bachillerato at ', h: false },
      { text: 'IES Jimena', h: true },
      { text: '. Academic ', h: false },
      { text: 'foundation', h: true },
      { text: ' before specialising in ', h: false },
      { text: 'development', h: true },
      { text: '.', h: false },
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
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${ink}10 0%, transparent 70%)`,
        }}
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
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
          seg.h ? (
            <span key={si} className="font-semibold text-white/90">{seg.text}</span>
          ) : (
            <span key={si}>{seg.text}</span>
          )
        )}
      </p>
    </motion.div>
  );
}

// ─── Skills section with scroll latch ─────────────────────────────────────────

function SkillsSection(_props: { ink: string }) {
  const { lang } = useLanguage();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [latched, setLatched] = useState(false);   // scroll is locked, overlay visible
  const [unlocked, setUnlocked] = useState(false);  // button clicked, skills revealed
  const latchedRef = useRef(false);

  // Observe sentinel entering viewport → latch
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !latchedRef.current) {
          latchedRef.current = true;
          setLatched(true);
          // Snap scroll so the sentinel is flush with the viewport top
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // While latched (and not yet unlocked), block scroll
  useEffect(() => {
    if (!latched || unlocked) return;
    const block = (e: Event) => e.preventDefault();
    window.addEventListener('wheel', block, { passive: false });
    window.addEventListener('touchmove', block, { passive: false });
    return () => {
      window.removeEventListener('wheel', block);
      window.removeEventListener('touchmove', block);
    };
  }, [latched, unlocked]);

  const handleUnlock = () => {
    setUnlocked(true);
  };

  return (
    <>
      {/* Sentinel — intersection triggers latch */}
      <div ref={sentinelRef} className="w-full" style={{ height: 1 }} />

      {/* Lock overlay — fixed, covers full screen */}
      <AnimatePresence>
        {latched && !unlocked && (
          <motion.div
            key="lock-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6"
            style={{
              background: 'rgba(4,3,2,0.72)',
              backdropFilter: 'blur(18px) saturate(160%)',
              WebkitBackdropFilter: 'blur(18px) saturate(160%)',
            }}
          >
            {/* Floating lock icon */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <rect x="9" y="20" width="26" height="17" rx="5"
                  fill="rgba(255,255,255,0.07)"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="1.5"
                />
                <path
                  d="M14 20V15a8 8 0 0116 0v5"
                  stroke="rgba(255,255,255,0.30)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="22" cy="29" r="3" fill="rgba(255,255,255,0.45)" />
              </svg>
            </motion.div>

            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/35">
              {lang === 'es' ? 'Stack bloqueado' : 'Stack locked'}
            </p>

            <GlassButton size="lg" onClick={handleUnlock}>
              {lang === 'es' ? 'Desbloquear stack' : 'Unlock stack'}
            </GlassButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skills — revealed after unlock */}
      <AnimatePresence>
        {unlocked && (
          <motion.div
            key="skills-content"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-12 py-10 w-full"
          >
            {/* Orbit */}
            <div className="w-full flex justify-center overflow-hidden">
              <SkillOrbit inner={ORBIT_INNER} middle={ORBIT_MIDDLE} outer={ORBIT_OUTER} />
            </div>

            {/* Marquee */}
            <div className="w-full overflow-hidden">
              <SkillMarquee row1={MARQUEE_ROW1} row2={MARQUEE_ROW2} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Placeholder height so page doesn't collapse while skills aren't shown */}
      {!unlocked && <div className="h-20" />}
    </>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ExperiencePage() {
  const { lang, d } = useLanguage();
  const ink = exec.world.ink;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  const items = lang === 'es' ? ITEMS_ES : ITEMS_EN;

  return (
    <PageShell character={exec}>
      <div ref={containerRef} className="relative w-full">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <motion.section
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative flex min-h-[72vh] flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-20 text-center"
        >
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
            className="text-5xl font-bold leading-none tracking-tight sm:text-7xl lg:text-8xl"
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

        {/* ── Content ────────────────────────────────────────────────────────── */}
        <section className="relative mx-auto max-w-2xl px-4 pb-40 sm:px-6">

          <div className="mb-12 flex items-center gap-4">
            <div className="h-px flex-1"
              style={{ background: `linear-gradient(to right, transparent, ${ink}40)` }} />
            <div className="h-1.5 w-1.5 rounded-full"
              style={{ background: ink, boxShadow: `0 0 8px ${ink}` }} />
            <div className="h-px flex-1"
              style={{ background: `linear-gradient(to left, transparent, ${ink}40)` }} />
          </div>

          {/* Experience cards */}
          <div className="flex flex-col gap-4">
            {items.map((item, i) => (
              <ExperienceCard key={item.role} item={item} index={i} ink={ink} />
            ))}
          </div>

          {/* Skills with scroll latch */}
          <div className="mt-16">
            <SkillsSection ink={ink} />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
