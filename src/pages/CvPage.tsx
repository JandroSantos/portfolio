import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Download,
  ArrowLeft,
  Mail,
  Code2,
  Link2,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { PROFILE, SOCIALS } from '@/data/content';
import { CHARACTERS } from '@/data/characters';
import { useLanguage } from '@/hooks/useLanguage';
import { hexA, prefersReducedMotion } from '@/lib/utils';
import { GlassCard } from '@/components/cv/GlassCard';

const EASE = [0.16, 1, 0.3, 1] as const;

// Executive world — navy canvas, gold accent. A natural fit for a résumé.
const exec = CHARACTERS[2];
const ACCENT = exec.world.accent; // #d2ab5b (gold)

// Icons keyed off the social label so we stay data-driven.
const SOCIAL_ICON: Record<string, typeof Mail> = {
  Email: Mail,
  GitHub: Code2,
  LinkedIn: Link2,
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="font-mono text-[10px] uppercase tracking-[0.28em]"
      style={{ color: hexA(ACCENT, 0.85) }}
    >
      {children}
    </span>
  );
}

function SectionHeading({
  icon: Icon,
  children,
}: {
  icon: typeof Briefcase;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl print:border print:border-gray-300"
        style={{
          background: hexA(ACCENT, 0.1),
          border: `1px solid ${hexA(ACCENT, 0.28)}`,
          color: ACCENT,
        }}
      >
        <Icon size={16} strokeWidth={1.75} aria-hidden />
      </span>
      <h2
        className="font-display text-2xl uppercase leading-none tracking-tight text-bone print:text-black"
        style={{ letterSpacing: '0.01em' }}
      >
        {children}
      </h2>
    </div>
  );
}

export default function CvPage() {
  const navigate = useNavigate();
  const { lang, d } = useLanguage();
  const reduce = prefersReducedMotion();

  useEffect(() => {
    document.title = `CV — ${PROFILE.name}`;
    return () => {
      document.title = 'Jandro Santos';
    };
  }, []);

  const t = (es: string, en: string) => (lang === 'es' ? es : en);

  // Reused bilingual data sources.
  const summary = d.connect.bio.join(' ');
  const experience = d.experience.items;
  const stats = d.experience.stats;
  const education = d.studies.items;
  const skills = d.studies.skills;
  const learning = d.studies.learning;

  return (
    <div
      className="cv-root relative min-h-screen overflow-x-hidden text-bone print:bg-white print:text-black"
      style={{ background: '#070707' }}
    >
      {/* Print rules — clean black-on-white, no glass, no chrome. */}
      <style>{`
        @media print {
          .cv-no-print { display: none !important; }
          .cv-root { background: #fff !important; }
          .cv-glass {
            background: #fff !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            border: 1px solid #e5e5e5 !important;
            box-shadow: none !important;
            break-inside: avoid;
          }
          .cv-accent-text { color: #8a6d2b !important; }
          .cv-aurora { display: none !important; }
        }
      `}</style>

      {/* Ambient aurora — navy + gold wash behind the glass. */}
      <div className="cv-aurora pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div
          className="absolute -left-32 -top-32 h-[42rem] w-[42rem] rounded-full opacity-60 blur-[120px]"
          style={{ background: hexA(exec.world.bg, 0.5) }}
        />
        <div
          className="absolute -right-40 top-1/3 h-[36rem] w-[36rem] rounded-full opacity-40 blur-[130px]"
          style={{ background: hexA(ACCENT, 0.18) }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-[30rem] w-[30rem] rounded-full opacity-30 blur-[120px]"
          style={{ background: hexA(exec.world.deep, 0.6) }}
        />
      </div>

      {/* Floating chrome — back + print. Hidden on print. */}
      <div className="cv-no-print fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 sm:px-6">
        <motion.button
          initial={reduce ? false : { opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          onClick={() => navigate(-1)}
          className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm text-bone/80 outline-none transition-colors hover:text-bone focus-visible:ring-2"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.10)',
            backdropFilter: 'blur(16px) saturate(160%)',
            WebkitBackdropFilter: 'blur(16px) saturate(160%)',
          }}
        >
          <ArrowLeft size={15} aria-hidden />
          {d.meta.back}
        </motion.button>

        <motion.button
          initial={reduce ? false : { opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          onClick={() => window.print()}
          className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium outline-none transition-transform hover:scale-[1.03] focus-visible:ring-2"
          style={{
            background: hexA(ACCENT, 0.16),
            border: `1px solid ${hexA(ACCENT, 0.4)}`,
            color: ACCENT,
            backdropFilter: 'blur(16px) saturate(160%)',
            WebkitBackdropFilter: 'blur(16px) saturate(160%)',
          }}
        >
          <Download size={15} aria-hidden />
          {t('Descargar PDF', 'Download PDF')}
        </motion.button>
      </div>

      {/* Content column. */}
      <main className="relative z-10 mx-auto max-w-3xl px-5 pb-24 pt-24 sm:px-8 print:max-w-none print:px-0 print:pt-0">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <motion.header
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-12 print:mb-6"
        >
          <div className="mb-4">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 print:border print:border-gray-300"
              style={{
                background: hexA(ACCENT, 0.1),
                border: `1px solid ${hexA(ACCENT, 0.26)}`,
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: ACCENT }}
              />
              <span
                className="cv-accent-text font-mono text-[10px] uppercase tracking-[0.26em]"
                style={{ color: ACCENT }}
              >
                {d.meta.available}
              </span>
            </span>
          </div>

          <h1
            className="font-display text-[clamp(3rem,12vw,5.5rem)] uppercase leading-[0.88] tracking-tight text-bone print:text-black"
            style={{
              background: `linear-gradient(160deg, #ffffff 30%, ${hexA(ACCENT, 0.7)} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {PROFILE.name}
          </h1>

          <p className="mt-3 text-base text-bone/70 sm:text-lg print:text-gray-700">
            {d.hero.role}
          </p>

          {/* Contact row. */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-sm text-bone/60 print:text-gray-700">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} aria-hidden style={{ color: ACCENT }} />
              {PROFILE.location} · {t('remoto', 'remote')}
            </span>
            {SOCIALS.map((s) => {
              const Icon = SOCIAL_ICON[s.label] ?? Mail;
              const isLink = s.href !== '#';
              return (
                <a
                  key={s.label}
                  href={s.href}
                  {...(s.label !== 'Email'
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="inline-flex min-h-[24px] cursor-pointer items-center gap-1.5 outline-none transition-colors hover:text-bone focus-visible:underline print:text-gray-700"
                  style={isLink ? undefined : { pointerEvents: 'none' }}
                >
                  <Icon size={14} aria-hidden style={{ color: ACCENT }} />
                  {s.handle}
                </a>
              );
            })}
          </div>
        </motion.header>

        {/* ── Summary ──────────────────────────────────────────────── */}
        <GlassCard className="mb-6 p-6 sm:p-8" delay={0.05}>
          <Label>{d.connect.eyebrow.replace(/^\d+\s*—\s*/, '')}</Label>
          <p className="mt-3 text-[15px] leading-relaxed text-bone/75 print:text-gray-800">
            {summary}
          </p>

          {/* Stats strip. */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {stats.map((st) => (
              <div
                key={st.label}
                className="rounded-2xl px-3 py-3 text-center print:border print:border-gray-200"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div
                  className="cv-accent-text font-display text-2xl leading-none sm:text-3xl"
                  style={{ color: ACCENT }}
                >
                  {st.value}
                </div>
                <div className="mt-1.5 text-[11px] leading-tight text-bone/50 print:text-gray-600">
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* ── Experience ───────────────────────────────────────────── */}
        <GlassCard as="section" className="mb-6 p-6 sm:p-8" delay={0.1}>
          <SectionHeading icon={Briefcase}>{d.experience.title}</SectionHeading>
          <div className="space-y-7">
            {experience.map((ex, i) => (
              <div key={ex.role} className="relative">
                {i > 0 && (
                  <div
                    className="mb-7 h-px w-full print:hidden"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)',
                    }}
                  />
                )}
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-[17px] font-semibold tracking-tight text-bone print:text-black">
                    {ex.role}
                  </h3>
                  <span
                    className="cv-accent-text shrink-0 font-mono text-xs"
                    style={{ color: hexA(ACCENT, 0.85) }}
                  >
                    {ex.period}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-bone/55 print:text-gray-600">
                  {ex.org}
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-bone/70 print:text-gray-800">
                  {ex.summary}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {ex.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2.5 text-sm text-bone/65 print:text-gray-700"
                    >
                      <span
                        className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: hexA(ACCENT, 0.7) }}
                      />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* ── Skills ───────────────────────────────────────────────── */}
        <GlassCard as="section" className="mb-6 p-6 sm:p-8" delay={0.12}>
          <SectionHeading icon={Wrench}>{t('Stack', 'Skills')}</SectionHeading>
          <div className="grid gap-5 sm:grid-cols-2">
            {skills.map((g) => (
              <div key={g.label}>
                <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-bone/45 print:text-gray-500">
                  {g.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full px-3 py-1 text-xs text-bone/75 print:border print:border-gray-300 print:text-gray-800"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Currently learning. */}
          <div className="mt-7 border-t border-white/8 pt-5 print:border-gray-200">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={13} aria-hidden style={{ color: ACCENT }} />
              <Label>{t('Aprendiendo ahora', 'Currently learning')}</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {learning.map((item) => (
                <span
                  key={item}
                  className="rounded-full px-3 py-1 text-xs print:border print:border-gray-300 print:text-gray-800"
                  style={{
                    background: hexA(ACCENT, 0.08),
                    border: `1px solid ${hexA(ACCENT, 0.22)}`,
                    color: hexA(ACCENT, 0.95),
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* ── Education ────────────────────────────────────────────── */}
        <GlassCard as="section" className="mb-6 p-6 sm:p-8" delay={0.14}>
          <SectionHeading icon={GraduationCap}>{d.studies.title}</SectionHeading>
          <div className="space-y-5">
            {education.map((ed, i) => (
              <div key={ed.title}>
                {i > 0 && (
                  <div
                    className="mb-5 h-px w-full print:hidden"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)',
                    }}
                  />
                )}
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-[15px] font-semibold tracking-tight text-bone print:text-black">
                    {ed.title}
                  </h3>
                  <span
                    className="cv-accent-text shrink-0 font-mono text-xs"
                    style={{ color: hexA(ACCENT, 0.85) }}
                  >
                    {ed.period}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-bone/55 print:text-gray-600">
                  {ed.org}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-bone/65 print:text-gray-700">
                  {ed.note}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <footer className="mt-10 text-center print:mt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/35 print:text-gray-500">
            {SOCIALS[0].handle} · {SOCIALS[1].handle}
          </p>
        </footer>
      </main>
    </div>
  );
}
