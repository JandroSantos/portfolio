import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  GraduationCap,
  Trophy,
  Sparkles,
  Network,
  Flame,
} from 'lucide-react';
import { CHARACTERS } from '@/data/characters';
import { useLanguage } from '@/hooks/useLanguage';
import PageShell from '@/components/layout/PageShell';
import { hexA, prefersReducedMotion } from '@/lib/utils';
import SkillTree from '@/components/studies/SkillTree';
import QuestPanel from '@/components/studies/QuestPanel';
import { catIcon } from '@/components/studies/skillIcons';

const nerd = CHARACTERS[3];
const GREEN = nerd.world.bg; // #7fae5f
const GREEN_DEEP = nerd.world.deep; // #547f38
const GREEN_LIGHT = nerd.world.panel; // #98c179
const BONE = '#e8ece4';
const BG = '#070b07';
const EASE = [0.16, 1, 0.3, 1] as const;

/* Tiny section header used between blocks. */
function SectionLabel({ icon: Icon, children }: { icon: typeof Trophy; children: string }) {
  return (
    <div className="mb-10 flex items-center gap-3">
      <Icon size={16} color={GREEN} strokeWidth={1.9} />
      <span className="font-mono text-[11px] uppercase tracking-[0.5em]" style={{ color: GREEN }}>
        {children}
      </span>
      <span
        className="h-px flex-1"
        style={{ background: `linear-gradient(90deg, ${hexA(GREEN, 0.4)}, transparent)` }}
      />
    </div>
  );
}

export default function StudiesPage() {
  const { d, lang } = useLanguage();
  const s = d.studies;
  const reduce = prefersReducedMotion();
  const isEs = lang === 'es';

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
            className="mt-6 max-w-xl text-[15px] leading-relaxed sm:text-lg"
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

      {/* ══ SKILL TREE — the core deliverable ════════════════════════ */}
      <section className="relative z-10 mx-auto mt-28 max-w-6xl px-4 sm:px-8">
        <SectionLabel icon={Network}>{isEs ? 'Árbol de talentos' : 'Talent Tree'}</SectionLabel>

        <div
          className="relative overflow-hidden rounded-[32px] px-3 py-10 sm:px-8 sm:py-14"
          style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), 0 30px 70px rgba(0,0,0,0.4)',
          }}
        >
          {/* soft inner glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-[80%] -translate-x-1/2 rounded-full"
            style={{ background: `radial-gradient(circle, ${hexA(GREEN, 0.16)} 0%, transparent 70%)`, filter: 'blur(40px)' }}
            aria-hidden
          />
          <SkillTree
            root="Jandro"
            groups={s.skills}
            milestones={s.items}
            green={GREEN}
            greenDeep={GREEN_DEEP}
            greenLight={GREEN_LIGHT}
            bone={BONE}
            reduce={reduce}
            isEs={isEs}
          />
          <p
            className="relative mt-6 text-center font-mono text-[10px] uppercase tracking-[0.3em]"
            style={{ color: hexA(BONE, 0.4) }}
          >
            {isEs ? 'Pasa el cursor sobre un nodo' : 'Hover a node to inspect'}
          </p>
        </div>
      </section>

      {/* ══ EDUCATION — achievement cards ════════════════════════════ */}
      <section className="relative z-10 mx-auto mt-28 max-w-6xl px-5 sm:px-8">
        <SectionLabel icon={Trophy}>{isEs ? 'Logros desbloqueados' : 'Unlocked Achievements'}</SectionLabel>

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
              <p className="relative mt-3.5 text-[13px] leading-relaxed" style={{ color: hexA(BONE, 0.58) }}>
                {it.note}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ══ CURRENTLY LEARNING — locked quests ═══════════════════════ */}
      <section className="relative z-10 mx-auto mb-36 mt-28 max-w-6xl px-5 sm:px-8">
        <SectionLabel icon={Flame}>{isEs ? 'Misiones activas' : 'Active Quests'}</SectionLabel>
        <QuestPanel
          items={s.learning}
          green={GREEN}
          greenDeep={GREEN_DEEP}
          greenLight={GREEN_LIGHT}
          bone={BONE}
          reduce={reduce}
          fallback={catIcon('frontend')}
        />
      </section>
    </PageShell>
  );
}
