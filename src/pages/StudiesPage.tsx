import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  GraduationCap,
  Trophy,
  Sparkles,
  Languages,
  Server,
  Cpu,
  Layers,
  Webhook,
  Plug,
  Bot,
  BrainCircuit,
  MessageSquareCode,
  Globe2,
  Code2,
  Flame,
  type LucideIcon,
} from 'lucide-react';
import { CHARACTERS } from '@/data/characters';
import { useLanguage } from '@/hooks/useLanguage';
import PageShell from '@/components/layout/PageShell';
import { hexA, prefersReducedMotion } from '@/lib/utils';

const nerd = CHARACTERS[3];
const GREEN = nerd.world.bg; // #7fae5f
const GREEN_DEEP = nerd.world.deep; // #547f38
const GREEN_LIGHT = nerd.world.panel; // #98c179
const BONE = '#e8ece4';
const BG = '#070b07';
const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Icon resolution ───────────────────────────────────────────────────
   Brand logos come from the Simple Icons CDN (colorful, crisp, zero-bundle);
   non-brand concepts fall back to a matching lucide glyph. Anything broken
   degrades gracefully to a category glyph. */
const SIMPLE: Record<string, { slug: string; color: string }> = {
  react: { slug: 'react', color: '61DAFB' },
  svelte: { slug: 'svelte', color: 'FF3E00' },
  typescript: { slug: 'typescript', color: '3178C6' },
  html: { slug: 'html5', color: 'E34F26' },
  css: { slug: 'css3', color: '1572B6' },
  tailwind: { slug: 'tailwindcss', color: '06B6D4' },
  python: { slug: 'python', color: 'FFD43B' },
  node: { slug: 'nodedotjs', color: '5FA04E' },
  rust: { slug: 'rust', color: 'F74C00' },
  webgpu: { slug: 'webgpu', color: '005A9C' },
};

const LUCIDE: Record<string, LucideIcon> = {
  apis: Webhook,
  mcp: Plug,
  prompting: MessageSquareCode,
  llms: BrainCircuit,
  agentes: Bot,
  agents: Bot,
  español: Globe2,
  spanish: Globe2,
  'inglés b2': Languages,
  'english b2': Languages,
  'arquitectura de agentes': Bot,
  'agent architecture': Bot,
  'diseño de sistemas': Layers,
  'system design': Layers,
};

const CAT_ICON: Record<string, LucideIcon> = {
  frontend: Layers,
  backend: Server,
  ia: Cpu,
  ai: Cpu,
  idiomas: Languages,
  languages: Languages,
};

function catIcon(label: string): LucideIcon {
  return CAT_ICON[label.toLowerCase()] ?? Code2;
}

/* ─── Skill tile (loadout slot) ─────────────────────────────────────────── */
function SkillTile({ name, fallback }: { name: string; fallback: LucideIcon }) {
  const key = name.toLowerCase();
  const simple = SIMPLE[key];
  const [imgFailed, setImgFailed] = useState(false);
  const Fallback = LUCIDE[key] ?? fallback;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      className="group/tile flex min-w-[88px] flex-col items-center gap-2.5 rounded-2xl px-4 py-3.5"
      style={{
        background: 'rgba(255,255,255,0.035)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)',
      }}
    >
      <span
        className="relative flex h-11 w-11 items-center justify-center rounded-xl"
        style={{
          background: hexA(GREEN_DEEP, 0.18),
          border: `1px solid ${hexA(GREEN, 0.22)}`,
        }}
      >
        <span
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100"
          style={{ boxShadow: `0 0 22px ${hexA(GREEN, 0.5)}` }}
        />
        {simple && !imgFailed ? (
          <img
            src={`https://cdn.simpleicons.org/${simple.slug}/${simple.color}`}
            alt={name}
            width={24}
            height={24}
            loading="lazy"
            draggable={false}
            onError={() => setImgFailed(true)}
            className="h-6 w-6 select-none transition-transform duration-300 group-hover/tile:scale-110"
          />
        ) : (
          <Fallback
            size={22}
            color={GREEN_LIGHT}
            strokeWidth={1.7}
            className="transition-transform duration-300 group-hover/tile:scale-110"
          />
        )}
      </span>
      <span
        className="font-mono text-[10px] uppercase tracking-wider"
        style={{ color: hexA(BONE, 0.72) }}
      >
        {name}
      </span>
    </motion.div>
  );
}

export default function StudiesPage() {
  const { d, lang } = useLanguage();
  const s = d.studies;
  const reduce = prefersReducedMotion();
  const isEs = lang === 'es';

  // Faux skill totals for the hero "loadout" stats — derived from real data.
  const stats = useMemo(() => {
    const skillCount = s.skills.reduce((acc, g) => acc + g.items.length, 0);
    return {
      tracks: s.skills.length,
      skills: skillCount,
      learning: s.learning.length,
    };
  }, [s.skills, s.learning]);

  return (
    <PageShell character={nerd} background={BG}>
      {/* ══ AMBIENT BACKDROP — auroras + soft grid ═══════════════════ */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <motion.div
          className="absolute -left-[10%] top-[-15%] h-[55vh] w-[55vh] rounded-full"
          style={{ background: `radial-gradient(circle, ${hexA(GREEN, 0.22)} 0%, transparent 70%)`, filter: 'blur(60px)' }}
          animate={reduce ? undefined : { x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-[-12%] top-[30%] h-[60vh] w-[60vh] rounded-full"
          style={{ background: `radial-gradient(circle, ${hexA(GREEN_DEEP, 0.28)} 0%, transparent 70%)`, filter: 'blur(70px)' }}
          animate={reduce ? undefined : { x: [0, -50, 0], y: [0, 40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: `linear-gradient(${hexA(GREEN, 0.5)} 1px, transparent 1px), linear-gradient(90deg, ${hexA(GREEN, 0.5)} 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(circle at 50% 30%, black 0%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 30%, black 0%, transparent 75%)',
          }}
        />
      </div>

      <style>{`
        @keyframes xpshimmer {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(220%); }
        }
      `}</style>

      {/* ══ HERO ═════════════════════════════════════════════════════ */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pt-32 sm:px-8 sm:pt-40">
        <div className="relative">
          {/* Figurine — desktop only, preserves shared layout transition */}
          <div className="pointer-events-none absolute -right-4 top-0 hidden lg:block" aria-hidden>
            <div className="relative">
              <div
                className="absolute left-1/2 top-1/2 h-[44vh] w-[44vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: `radial-gradient(circle, ${hexA(GREEN, 0.3)} 0%, transparent 65%)`, filter: 'blur(40px)' }}
              />
              <motion.img
                layoutId="world-figurine"
                src={nerd.image}
                alt={nerd.alias}
                draggable={false}
                animate={reduce ? undefined : { y: [0, -14, 0] }}
                transition={reduce ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative h-[46vh] w-auto select-none object-contain"
                style={{ filter: `drop-shadow(0 18px 44px ${hexA(GREEN_DEEP, 0.55)})` }}
              />
            </div>
          </div>

          {/* Eyebrow chip */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.35em]"
            style={{
              color: GREEN_LIGHT,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)',
            }}
          >
            <Sparkles size={13} strokeWidth={2} />
            {s.eyebrow}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
            className="heading-kinetic mt-5 leading-[0.82] tracking-tight"
            style={{
              fontSize: 'clamp(3.5rem, 15vw, 12rem)',
              color: BONE,
              textShadow: `0 0 70px ${hexA(GREEN, 0.32)}`,
            }}
          >
            {s.title}
          </motion.h1>

          {/* Intro */}
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: EASE }}
            className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
            style={{ color: hexA(BONE, 0.64) }}
          >
            {s.intro}
          </motion.p>

          {/* Loadout stat strip */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.26, ease: EASE }}
            className="mt-9 inline-flex flex-wrap items-stretch gap-2 rounded-2xl p-2"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)',
            }}
          >
            {[
              { v: stats.tracks, l: isEs ? 'Ramas' : 'Tracks' },
              { v: stats.skills, l: isEs ? 'Skills' : 'Skills' },
              { v: stats.learning, l: isEs ? 'En curso' : 'Learning' },
            ].map((st, i) => (
              <div key={st.l} className="flex items-center">
                {i > 0 && <span className="mx-1 h-8 w-px" style={{ background: hexA(BONE, 0.12) }} />}
                <div className="flex flex-col items-center px-5 py-1.5">
                  <span className="font-display text-2xl leading-none" style={{ color: GREEN_LIGHT }}>
                    {st.v}
                  </span>
                  <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: hexA(BONE, 0.5) }}>
                    {st.l}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ TECH STACK — glass loadout panels ════════════════════════ */}
      <section className="relative z-10 mx-auto mt-28 max-w-6xl px-5 sm:px-8">
        <div className="mb-10 flex items-center gap-3">
          <Code2 size={16} color={GREEN} strokeWidth={1.9} />
          <span className="font-mono text-[11px] uppercase tracking-[0.5em]" style={{ color: GREEN }}>
            {isEs ? 'Stack & habilidades' : 'Stack & Skills'}
          </span>
          <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${hexA(GREEN, 0.4)}, transparent)` }} />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {s.skills.map((group, gi) => {
            const Cat = catIcon(group.label);
            return (
              <motion.div
                key={group.label}
                initial={reduce ? false : { opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.7, delay: gi * 0.08, ease: EASE }}
                className="relative overflow-hidden rounded-[28px] p-6 sm:p-7"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(22px) saturate(140%)',
                  WebkitBackdropFilter: 'blur(22px) saturate(140%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 24px 50px rgba(0,0,0,0.35)',
                }}
              >
                {/* corner glow */}
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full"
                  style={{ background: `radial-gradient(circle, ${hexA(GREEN, 0.22)} 0%, transparent 70%)`, filter: 'blur(10px)' }}
                />

                <div className="relative mb-6 flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: hexA(GREEN_DEEP, 0.22), border: `1px solid ${hexA(GREEN, 0.3)}` }}
                  >
                    <Cat size={19} color={GREEN_LIGHT} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="font-display text-lg uppercase tracking-wide" style={{ color: BONE }}>
                      {group.label}
                    </h3>
                    <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: hexA(GREEN_LIGHT, 0.7) }}>
                      {group.items.length} {group.items.length === 1 ? (isEs ? 'skill' : 'skill') : (isEs ? 'skills' : 'skills')}
                    </p>
                  </div>
                </div>

                <div className="relative flex flex-wrap gap-2.5">
                  {group.items.map((item) => (
                    <SkillTile key={item} name={item} fallback={Cat} />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ══ EDUCATION — achievement cards ════════════════════════════ */}
      <section className="relative z-10 mx-auto mt-28 max-w-6xl px-5 sm:px-8">
        <div className="mb-10 flex items-center gap-3">
          <Trophy size={16} color={GREEN} strokeWidth={1.9} />
          <span className="font-mono text-[11px] uppercase tracking-[0.5em]" style={{ color: GREEN }}>
            {isEs ? 'Logros desbloqueados' : 'Unlocked Achievements'}
          </span>
          <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${hexA(GREEN, 0.4)}, transparent)` }} />
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {s.items.map((it, i) => (
            <motion.article
              key={it.title}
              initial={reduce ? false : { opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-12%' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-[26px] p-6"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(22px) saturate(140%)',
                WebkitBackdropFilter: 'blur(22px) saturate(140%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 24px 50px rgba(0,0,0,0.35)',
              }}
            >
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: `radial-gradient(circle, ${hexA(GREEN, 0.25)} 0%, transparent 70%)`, filter: 'blur(10px)' }}
              />
              <div className="relative flex items-center justify-between">
                <motion.span
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ background: hexA(GREEN, 0.14), border: `1px solid ${hexA(GREEN, 0.45)}` }}
                  whileHover={reduce ? undefined : { rotate: [0, -12, 12, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Check size={17} color={GREEN_LIGHT} strokeWidth={2.6} />
                </motion.span>
                <span
                  className="rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest"
                  style={{ color: GREEN_LIGHT, background: hexA(GREEN_DEEP, 0.25), border: `1px solid ${hexA(GREEN, 0.25)}` }}
                >
                  {it.period}
                </span>
              </div>
              <h3 className="relative mt-5 text-sm font-semibold leading-snug" style={{ color: BONE }}>
                {it.title}
              </h3>
              <p className="relative mt-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider" style={{ color: hexA(GREEN_LIGHT, 0.8) }}>
                <GraduationCap size={12} strokeWidth={1.8} />
                {it.org}
              </p>
              <p className="relative mt-3.5 text-xs leading-relaxed" style={{ color: hexA(BONE, 0.58) }}>
                {it.note}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ══ CURRENTLY LEARNING — quest progress ══════════════════════ */}
      <section className="relative z-10 mx-auto mb-36 mt-28 max-w-6xl px-5 sm:px-8">
        <div className="mb-10 flex items-center gap-3">
          <Flame size={16} color={GREEN} strokeWidth={1.9} />
          <span className="font-mono text-[11px] uppercase tracking-[0.5em]" style={{ color: GREEN }}>
            {isEs ? 'Misiones activas' : 'Active Quests'}
          </span>
          <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${hexA(GREEN, 0.4)}, transparent)` }} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {s.learning.map((item, i) => {
            const pct = 35 + ((i * 17) % 45); // deterministic faux-progress
            return (
              <motion.div
                key={item}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                className="overflow-hidden rounded-[22px] px-5 py-4"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(18px)',
                  WebkitBackdropFilter: 'blur(18px)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)',
                }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: BONE }}>
                    <SkillTileDot />
                    {item}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest" style={{ color: hexA(GREEN_LIGHT, 0.8) }}>
                    {pct}%
                  </span>
                </div>
                {/* XP bar */}
                <div
                  className="relative h-2 overflow-hidden rounded-full"
                  style={{ background: hexA(BONE, 0.08) }}
                >
                  <motion.div
                    className="relative h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${GREEN_DEEP}, ${GREEN_LIGHT})` }}
                    initial={reduce ? false : { width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.1 + i * 0.08, ease: EASE }}
                  >
                    {!reduce && (
                      <span
                        className="absolute inset-y-0 left-0 w-1/3"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)',
                          animation: 'xpshimmer 2.4s ease-in-out infinite',
                        }}
                      />
                    )}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}

/* small pulsing status dot for quest rows */
function SkillTileDot() {
  return (
    <span
      className="inline-block h-2 w-2 rounded-full"
      style={{ background: GREEN, boxShadow: `0 0 8px ${GREEN}` }}
    />
  );
}
