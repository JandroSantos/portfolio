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

// Background image for the skills section
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
      { text: 'Más de ', h: false },
      { text: '3 años', h: true },
      { text: ' organizando y coordinando ', h: false },
      { text: 'eventos', h: true },
      { text: ' y actividades. Gestión de grupos, ', h: false },
      { text: 'liderazgo', h: true },
      { text: ' bajo presión y comunicación efectiva con equipos.', h: false },
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
      { text: ': ', h: false },
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
      { text: ' under pressure and effective communication.', h: false },
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
      { text: ': ', h: false },
      { text: 'agility', h: true },
      { text: ', ', h: false },
      { text: 'customer focus', h: true },
      { text: ' and performing under ', h: false },
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
        backdropFilter: 'blur(16px) saturate(160%)',
        WebkitBackdropFilter: 'blur(16px) saturate(160%)',
        borderColor: 'rgba(255,255,255,0.08)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.2)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${ink}12 0%, transparent 70%)`,
        }}
      />

      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span
            className="text-[10px] font-mono uppercase tracking-[0.22em] px-2.5 py-0.5 rounded-full border"
            style={{ color: ink, borderColor: `${ink}35`, background: `${ink}12` }}
          >
            {item.period}
          </span>
          {item.org && (
            <span className="text-[10px] font-mono text-white/30 tracking-wide">
              {item.link ? (
                <LinkPreview
                  href={item.link}
                  imageSrc={item.preview ?? undefined}
                  imageAlt={item.org}
                  className="text-white/40 hover:text-white/65 transition-colors no-underline"
                >
                  {item.org}
                </LinkPreview>
              ) : (
                item.org
              )}
            </span>
          )}
        </div>
        <h3 className="text-base sm:text-[17px] font-semibold text-white/90 leading-snug">
          {item.role}
        </h3>
      </div>

      <p className="text-sm text-white/50 leading-relaxed">
        {item.segments.map((seg, si) =>
          seg.h ? (
            <span key={si} className="font-semibold text-white/85">{seg.text}</span>
          ) : (
            <span key={si}>{seg.text}</span>
          )
        )}
      </p>
    </motion.div>
  );
}

// ─── Floating CTA button (fixed, appears when skills section is in view) ───────

function FloatingCTA({
  visible,
  unlocked,
  onUnlock,
  lang,
}: {
  visible: boolean;
  unlocked: boolean;
  onUnlock: () => void;
  lang: string;
}) {
  return (
    <AnimatePresence>
      {visible && !unlocked && (
        <motion.div
          key="floating-cta"
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed bottom-10 left-1/2 z-[150] -translate-x-1/2"
        >
          <GlassButton size="lg" onClick={onUnlock}>
            {lang === 'es' ? '✦ Descubre mi stack' : '✦ Discover my stack'}
          </GlassButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Skills section ────────────────────────────────────────────────────────────

function SkillsSection({ ink }: { ink: string }) {
  const { lang } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* Floating button — fixed, follows viewport */}
      <FloatingCTA
        visible={visible}
        unlocked={unlocked}
        onUnlock={() => setUnlocked(true)}
        lang={lang}
      />

      {/* Skills section with image background */}
      <div
        ref={sectionRef}
        className="relative w-full overflow-hidden rounded-3xl"
        style={{ minHeight: unlocked ? 'auto' : '60vh' }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 -z-0"
          style={{
            backgroundImage: `url(${SKILLS_BG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Frosted glass overlay over image */}
        <div
          className="absolute inset-0 -z-0"
          style={{
            background: 'rgba(4,4,8,0.55)',
            backdropFilter: 'blur(2px)',
          }}
        />
        {/* Gradient vignette */}
        <div
          className="absolute inset-0 -z-0"
          style={{
            background: `radial-gradient(ellipse 90% 70% at 50% 50%, transparent 30%, rgba(4,4,8,0.7) 100%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 py-16 sm:py-20">
          <AnimatePresence mode="wait">
            {!unlocked ? (
              /* Pre-unlock: teaser text */
              <motion.div
                key="teaser"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-4 text-center pb-6"
              >
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: ink }}
                >
                  {lang === 'es' ? 'Mi stack tecnológico' : 'My tech stack'}
                </p>
                <h2 className="text-2xl font-bold text-white/80 sm:text-3xl">
                  {lang === 'es' ? 'Herramientas que domino' : 'Tools I master'}
                </h2>
                <p className="text-sm text-white/40 max-w-xs">
                  {lang === 'es'
                    ? 'Pulsa el botón para explorar mis habilidades'
                    : 'Tap the button to explore my skills'}
                </p>
                {/* decorative shimmer rings */}
                <div className="relative mt-2 flex items-center justify-center" style={{ width: 140, height: 140 }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full border"
                      style={{
                        width: 60 + i * 32,
                        height: 60 + i * 32,
                        borderColor: `${ink}${['40', '28', '14'][i]}`,
                      }}
                      animate={{ scale: [1, 1.06, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{
                        duration: 2.4,
                        delay: i * 0.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                  <div
                    className="rounded-full flex items-center justify-center text-xl"
                    style={{
                      width: 56,
                      height: 56,
                      background: `${ink}18`,
                      border: `1px solid ${ink}40`,
                      boxShadow: `0 0 24px ${ink}30`,
                    }}
                  >
                    ✦
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Post-unlock: orbit + marquee */
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex w-full flex-col items-center gap-12"
              >
                <div className="w-full flex justify-center">
                  <SkillOrbit inner={ORBIT_INNER} middle={ORBIT_MIDDLE} outer={ORBIT_OUTER} />
                </div>
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
              background: `radial-gradient(ellipse 70% 55% at 50% 30%, ${ink}20 0%, transparent 65%)`,
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
              background: `linear-gradient(150deg, #ffffff 0%, ${ink}bb 100%)`,
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
            className="mt-6 max-w-md text-sm leading-relaxed text-white/40 sm:text-base"
          >
            {d.experience.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="absolute bottom-8 flex flex-col items-center gap-2"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/20">
              {d.meta.scroll}
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="h-8 w-px rounded-full"
              style={{ background: `linear-gradient(to bottom, ${ink}50, transparent)` }}
            />
          </motion.div>
        </motion.section>

        {/* ── Experience cards ───────────────────────────────────────────────── */}
        <section className="relative mx-auto max-w-2xl px-4 sm:px-6">

          {/* Divider */}
          <div className="mb-10 flex items-center gap-4">
            <div className="h-px flex-1"
              style={{ background: `linear-gradient(to right, transparent, ${ink}35)` }} />
            <div className="h-1.5 w-1.5 rounded-full"
              style={{ background: ink, boxShadow: `0 0 8px ${ink}90` }} />
            <div className="h-px flex-1"
              style={{ background: `linear-gradient(to left, transparent, ${ink}35)` }} />
          </div>

          <div className="flex flex-col gap-3">
            {items.map((item, i) => (
              <ExperienceCard key={item.role} item={item} index={i} ink={ink} />
            ))}
          </div>
        </section>

        {/* ── Skills section ─────────────────────────────────────────────────── */}
        <section className="mx-auto mt-16 max-w-4xl px-4 pb-40 sm:px-6">
          <SkillsSection ink={ink} />
        </section>
      </div>
    </PageShell>
  );
}
