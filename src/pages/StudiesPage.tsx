import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, Check, GraduationCap, Trophy } from 'lucide-react';
import { CHARACTERS } from '@/data/characters';
import { useLanguage } from '@/hooks/useLanguage';
import PageShell from '@/components/layout/PageShell';
import { hexA, prefersReducedMotion } from '@/lib/utils';

const nerd = CHARACTERS[3];
const GREEN = nerd.world.bg; // #7fae5f
const GREEN_DEEP = nerd.world.deep; // #547f38
const GREEN_LIGHT = nerd.world.panel; // #98c179
const BONE = '#e8ece4';
const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Seeded pseudo-random (deterministic) ──────────────────────────── */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Star {
  x: number;
  y: number;
  r: number;
  o: number;
  glow: boolean;
  delay: number;
}

/* ─── Node model ────────────────────────────────────────────────────── */
type Tier = 'root' | 'group' | 'leaf' | 'locked';

interface TreeNode {
  id: string;
  label: string;
  x: number; // percent
  y: number; // percent
  tier: Tier;
  parent: string | null;
  locked: boolean;
  detail: string;
}

/* ─── Tooltip / detail card ─────────────────────────────────────────── */
function NodeCard({ title, detail, below }: { title: string; detail: string; below?: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute left-1/2 z-30 w-max max-w-[180px] -translate-x-1/2 ${
        below ? 'top-[calc(100%+10px)]' : 'bottom-[calc(100%+10px)]'
      } opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
    >
      <div
        className="rounded-md px-3 py-2 backdrop-blur-sm"
        style={{
          background: 'rgba(5,8,10,0.92)',
          border: `1px solid ${hexA(GREEN, 0.4)}`,
          boxShadow: `0 0 24px ${hexA(GREEN, 0.25)}`,
        }}
      >
        <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: GREEN_LIGHT }}>
          {title}
        </p>
        <p className="mt-1 text-[11px] leading-snug" style={{ color: hexA(BONE, 0.7) }}>
          {detail}
        </p>
      </div>
    </div>
  );
}

export default function StudiesPage() {
  const { d, lang } = useLanguage();
  const s = d.studies;
  const reduce = prefersReducedMotion();

  /* ── Starfield (computed once) ─────────────────────────────────────── */
  const stars = useMemo<Star[]>(() => {
    const rng = mulberry32(20240622);
    return Array.from({ length: 44 }, () => ({
      x: rng() * 100,
      y: rng() * 100,
      r: 0.5 + rng() * 1.3,
      o: 0.1 + rng() * 0.3,
      glow: rng() > 0.84,
      delay: rng() * 6,
    }));
  }, []);

  /* ── Tree layout (computed once) ───────────────────────────────────── */
  const { nodes, edges } = useMemo(() => {
    const list: TreeNode[] = [];

    // ROOT
    list.push({
      id: 'root',
      label: 'JANDRO',
      x: 50,
      y: 6,
      tier: 'root',
      parent: null,
      locked: false,
      detail: 'dev.core — the source node',
    });

    // GROUP nodes — spread across the width
    const groups = s.skills;
    const gCount = groups.length;
    // give margins so leaves fan within bounds
    const gMargin = 13;
    const gSpan = 100 - gMargin * 2;
    groups.forEach((g, gi) => {
      const gx = gCount === 1 ? 50 : gMargin + (gSpan * gi) / (gCount - 1);
      const gid = `g-${gi}`;
      list.push({
        id: gid,
        label: g.label,
        x: gx,
        y: 28,
        tier: 'group',
        parent: 'root',
        locked: false,
        detail: `${g.items.length} ${g.items.length === 1 ? 'skill' : 'skills'} unlocked`,
      });

      // LEAF nodes — fan out below the group
      const leaves = g.items;
      const lCount = leaves.length;
      leaves.forEach((leaf, li) => {
        // local horizontal fan around the group x
        const fanWidth = Math.min(8 + lCount * 2.2, 20);
        const lx =
          lCount === 1
            ? gx
            : gx - fanWidth / 2 + (fanWidth * li) / (lCount - 1);
        // stagger vertical so labels don't collide
        const ly = 48 + (li % 2) * 7 + (lCount > 4 ? (li > lCount / 2 ? 6 : 0) : 0);
        list.push({
          id: `${gid}-l-${li}`,
          label: leaf,
          x: Math.max(4, Math.min(96, lx)),
          y: ly,
          tier: 'leaf',
          parent: gid,
          locked: false,
          detail: g.label,
        });
      });
    });

    // LOCKED nodes (currently learning) — bottom band, child of root
    const learning = s.learning;
    const lkMargin = 18;
    const lkSpan = 100 - lkMargin * 2;
    learning.forEach((item, i) => {
      const lx =
        learning.length === 1 ? 50 : lkMargin + (lkSpan * i) / (learning.length - 1);
      list.push({
        id: `lk-${i}`,
        label: item,
        x: lx,
        y: 90,
        tier: 'locked',
        parent: 'root',
        locked: true,
        detail: 'in progress',
      });
    });

    // EDGES from each node to its parent
    const map = new Map(list.map((n) => [n.id, n]));
    const e = list
      .filter((n) => n.parent)
      .map((n) => {
        const p = map.get(n.parent!)!;
        return { id: `${p.id}->${n.id}`, from: p, to: n, locked: n.locked };
      });

    return { nodes: list, edges: e };
  }, [s.skills, s.learning]);

  return (
    <PageShell character={nerd} background="#05080a">
      {/* ══ STARFIELD ════════════════════════════════════════════════ */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          {stars.map((st, i) => (
            <circle
              key={i}
              cx={st.x}
              cy={st.y}
              r={st.r * 0.16}
              fill={st.glow ? GREEN_LIGHT : '#ffffff'}
              style={{
                opacity: st.o,
                filter: st.glow ? `drop-shadow(0 0 1px ${GREEN})` : undefined,
                animation: reduce ? undefined : `twinkle ${4 + (i % 5)}s ease-in-out ${st.delay}s infinite`,
              }}
            />
          ))}
        </svg>
        {/* deep green nebula glow */}
        <div
          className="absolute left-1/2 top-[40%] h-[60vh] w-[60vw] -translate-x-1/2 rounded-full"
          style={{ background: `radial-gradient(circle, ${hexA(GREEN_DEEP, 0.14)} 0%, transparent 70%)`, filter: 'blur(40px)' }}
        />
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: var(--o, 0.2); }
          50% { opacity: 0.05; }
        }
      `}</style>

      {/* ══ HERO ═════════════════════════════════════════════════════ */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pt-32 sm:px-8 sm:pt-40">
        <div className="relative">
          {/* Figurine — desktop only */}
          <div className="pointer-events-none absolute -right-4 top-0 hidden lg:block" aria-hidden>
            <div className="relative">
              <div
                className="absolute left-1/2 top-1/2 h-[44vh] w-[44vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: `radial-gradient(circle, ${hexA(GREEN, 0.32)} 0%, transparent 65%)`, filter: 'blur(36px)' }}
              />
              <motion.img
                layoutId="world-figurine"
                src={nerd.image}
                alt={nerd.alias}
                draggable={false}
                animate={reduce ? undefined : { y: [0, -14, 0] }}
                transition={reduce ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative h-[46vh] w-auto select-none object-contain"
                style={{ filter: `drop-shadow(0 18px 40px ${hexA(GREEN_DEEP, 0.5)})` }}
              />
            </div>
          </div>

          {/* Eyebrow */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.4em]"
            style={{ color: GREEN }}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: GREEN, boxShadow: `0 0 10px ${GREEN}` }}
            />
            <span>$ {s.eyebrow}</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: EASE }}
            className="heading-kinetic mt-4 leading-[0.82] tracking-tight"
            style={{
              fontSize: 'clamp(3.5rem, 15vw, 12rem)',
              color: BONE,
              textShadow: `0 0 60px ${hexA(GREEN, 0.3)}`,
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
            style={{ color: hexA(BONE, 0.62) }}
          >
            {s.intro}
          </motion.p>

          {/* Legend */}
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-widest"
          >
            <span className="flex items-center gap-2" style={{ color: hexA(BONE, 0.7) }}>
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: GREEN, boxShadow: `0 0 8px ${GREEN}` }} />
              {lang === 'es' ? 'desbloqueado' : 'unlocked'}
            </span>
            <span className="flex items-center gap-2" style={{ color: hexA(BONE, 0.4) }}>
              <span className="inline-block h-2.5 w-2.5 rounded-full border" style={{ borderColor: hexA(GREEN, 0.5) }} />
              {lang === 'es' ? 'aprendiendo' : 'learning'}
            </span>
          </motion.div>
        </div>
      </section>

      {/* ══ SKILL TREE ═══════════════════════════════════════════════ */}
      <section className="relative z-10 mx-auto mt-20 max-w-6xl px-2 sm:mt-28 sm:px-6">
        <div className="mb-6 flex items-center justify-center gap-3 px-4">
          <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${hexA(GREEN, 0.4)})` }} />
          <span className="font-mono text-[11px] uppercase tracking-[0.5em]" style={{ color: GREEN }}>
            {lang === 'es' ? 'Árbol de habilidades' : 'Skill Tree'}
          </span>
          <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${hexA(GREEN, 0.4)}, transparent)` }} />
        </div>

        <div
          className="relative w-full overflow-hidden rounded-xl"
          style={{
            // taller on mobile so nodes breathe
            aspectRatio: '4 / 5',
            maxHeight: '1100px',
            minHeight: '560px',
            border: `1px solid ${hexA(GREEN, 0.16)}`,
            background: `radial-gradient(120% 80% at 50% 0%, ${hexA(GREEN_DEEP, 0.12)} 0%, transparent 55%)`,
          }}
        >
          {/* SVG connection layer */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="0.6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {edges.map((e, i) => {
              // quadratic bezier with a vertical control point
              const midY = (e.from.y + e.to.y) / 2;
              const path = `M ${e.from.x} ${e.from.y} C ${e.from.x} ${midY}, ${e.to.x} ${midY}, ${e.to.x} ${e.to.y}`;
              return (
                <motion.path
                  key={e.id}
                  d={path}
                  fill="none"
                  stroke={e.locked ? hexA(GREEN, 0.22) : hexA(GREEN, 0.55)}
                  strokeWidth={e.locked ? 0.22 : 0.32}
                  strokeDasharray={e.locked ? '1 1' : undefined}
                  strokeLinecap="round"
                  filter={e.locked ? undefined : 'url(#lineGlow)'}
                  vectorEffect="non-scaling-stroke"
                  initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 1.1, delay: 0.1 + i * 0.04, ease: EASE }}
                />
              );
            })}
          </svg>

          {/* Node layer */}
          {nodes.map((n, i) => {
            const isRoot = n.tier === 'root';
            const isGroup = n.tier === 'group';
            const isLeaf = n.tier === 'leaf';
            const isLocked = n.tier === 'locked';

            const size = isRoot ? 64 : isGroup ? 46 : 22;
            const ringColor = isLocked ? hexA(GREEN, 0.4) : GREEN;
            const labelBelow = n.y < 14; // root label below

            return (
              <motion.div
                key={n.id}
                className="group absolute z-20"
                style={{ left: `${n.x}%`, top: `${n.y}%`, transform: 'translate(-50%,-50%)' }}
                initial={reduce ? false : { opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ type: 'spring', stiffness: 320, damping: 22, delay: reduce ? 0 : 0.15 + i * 0.025 }}
              >
                <motion.div
                  className="relative flex cursor-default items-center justify-center rounded-full"
                  whileHover={reduce ? undefined : { scale: 1.15 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  style={{
                    width: size,
                    height: size,
                    background: isRoot
                      ? `radial-gradient(circle, ${hexA(GREEN_LIGHT, 0.35)} 0%, #05080a 70%)`
                      : '#05080a',
                    border: `${isRoot ? 2 : 1.5}px ${isLocked ? 'dashed' : 'solid'} ${ringColor}`,
                    boxShadow: isLocked
                      ? `inset 0 0 12px ${hexA(GREEN, 0.1)}`
                      : `0 0 ${isRoot ? 36 : isGroup ? 22 : 12}px ${hexA(GREEN, isRoot ? 0.55 : 0.35)}, inset 0 0 ${isRoot ? 20 : 10}px ${hexA(GREEN, 0.18)}`,
                    filter: isLocked ? 'saturate(0.5)' : undefined,
                  }}
                >
                  {/* group hover glow boost via class */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ boxShadow: `0 0 30px ${GREEN}` }}
                  />

                  {isRoot && <GraduationCap size={26} color={GREEN_LIGHT} strokeWidth={1.6} />}
                  {isGroup && (
                    <Sparkles size={18} color={GREEN_LIGHT} strokeWidth={1.6} className="opacity-90" />
                  )}
                  {isLeaf && (
                    <span
                      className="block rounded-full"
                      style={{ width: 6, height: 6, background: GREEN, boxShadow: `0 0 6px ${GREEN}` }}
                    />
                  )}
                  {isLocked && (
                    <motion.span
                      animate={reduce ? undefined : { opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="flex items-center justify-center"
                    >
                      <Lock size={11} color={GREEN_LIGHT} strokeWidth={1.8} />
                    </motion.span>
                  )}
                </motion.div>

                {/* Label */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center ${
                    labelBelow ? 'top-[calc(100%+6px)]' : isLeaf || isLocked ? 'top-[calc(100%+5px)]' : 'top-[calc(100%+7px)]'
                  }`}
                >
                  <span
                    className={`font-mono ${isRoot || isGroup ? 'text-[11px] font-semibold uppercase tracking-[0.25em]' : 'text-[9px] uppercase tracking-widest'}`}
                    style={{
                      color: isLocked
                        ? hexA(BONE, 0.45)
                        : isRoot
                          ? GREEN_LIGHT
                          : isGroup
                            ? GREEN
                            : hexA(BONE, 0.62),
                    }}
                  >
                    {n.label}
                  </span>
                </div>

                {/* Hover detail card */}
                <NodeCard title={n.label} detail={n.detail} below={labelBelow} />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ══ EDUCATION — unlocked achievements ════════════════════════ */}
      <section className="relative z-10 mx-auto mt-24 max-w-5xl px-5 sm:px-8">
        <div className="mb-8 flex items-center gap-3">
          <Trophy size={16} color={GREEN} strokeWidth={1.8} />
          <span className="font-mono text-[11px] uppercase tracking-[0.5em]" style={{ color: GREEN }}>
            {lang === 'es' ? 'Logros desbloqueados' : 'Unlocked Achievements'}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {s.items.map((it, i) => (
            <motion.article
              key={it.title}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-12%' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              className="group relative overflow-hidden rounded-xl p-5"
              style={{
                background: `linear-gradient(160deg, ${hexA(GREEN_DEEP, 0.14)} 0%, rgba(5,8,10,0.6) 60%)`,
                border: `1px solid ${hexA(GREEN, 0.2)}`,
              }}
            >
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: `radial-gradient(circle, ${hexA(GREEN, 0.22)} 0%, transparent 70%)`, filter: 'blur(8px)' }}
              />
              <div className="flex items-center justify-between">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: hexA(GREEN, 0.12), border: `1px solid ${hexA(GREEN, 0.4)}` }}
                >
                  <Check size={15} color={GREEN_LIGHT} strokeWidth={2.4} />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: GREEN }}>
                  {it.period}
                </span>
              </div>
              <h3 className="mt-4 text-sm font-semibold leading-snug" style={{ color: BONE }}>
                {it.title}
              </h3>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider" style={{ color: hexA(GREEN_LIGHT, 0.8) }}>
                {it.org}
              </p>
              <p className="mt-3 text-xs leading-relaxed" style={{ color: hexA(BONE, 0.55) }}>
                {it.note}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ══ CURRENTLY LEARNING — mono ticker ═════════════════════════ */}
      <section className="relative z-10 mx-auto mb-32 mt-20 max-w-5xl px-5 sm:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg px-5 py-4"
          style={{ border: `1px dashed ${hexA(GREEN, 0.25)}`, background: hexA(GREEN_DEEP, 0.06) }}
        >
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest" style={{ color: GREEN }}>
            <Lock size={12} strokeWidth={2} />
            {lang === 'es' ? 'Aprendiendo ahora' : 'Now learning'}
          </span>
          {s.learning.map((l, i) => (
            <span key={l} className="flex items-center gap-3 font-mono text-[11px]" style={{ color: hexA(BONE, 0.55) }}>
              <span style={{ color: hexA(GREEN, 0.4) }}>{i === 0 ? '' : '·'}</span>
              {l}
            </span>
          ))}
        </motion.div>
      </section>
    </PageShell>
  );
}
