import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, type LucideIcon } from 'lucide-react';
import { hexA, cn } from '@/lib/utils';
import { catIcon, RootGlyph, SkillGlyph } from './skillIcons';

/* ─────────────────────────────────────────────────────────────────────────
   A genuine RPG talent tree.
   Everything is laid out in a normalised 0..100 × 0..H coordinate space and
   rendered into a CSS box via percentages, so it scales fluidly and never
   overflows horizontally on mobile. Connectors are SVG beziers that draw in
   on mount; nodes are glass orbs that spring-pop with a stagger.
─────────────────────────────────────────────────────────────────────────── */

interface Group {
  label: string;
  items: string[];
}

interface TreeProps {
  root: string;
  groups: Group[];
  milestones: { title: string; org: string; period: string }[];
  green: string;
  greenDeep: string;
  greenLight: string;
  bone: string;
  reduce: boolean;
  isEs: boolean;
}

interface PlacedNode {
  id: string;
  x: number; // 0..100
  y: number; // 0..H
  label: string;
  tip: string;
  kind: 'root' | 'category' | 'skill' | 'milestone';
  icon: LucideIcon;
  parent?: string;
  depth: number;
}

const H = 100; // virtual vertical units (we set a real aspect ratio in CSS)

/** Smooth vertical-ish cubic bezier between two normalised points. */
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const my = (y1 + y2) / 2;
  return `M ${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}`;
}

export default function SkillTree({
  root,
  groups,
  milestones,
  green,
  greenDeep,
  greenLight,
  bone,
  reduce,
  isEs,
}: TreeProps) {
  const [active, setActive] = useState<string | null>(null);

  const { nodes, links } = useMemo(() => {
    const placed: PlacedNode[] = [];
    const edges: { id: string; from: PlacedNode; to: PlacedNode }[] = [];

    const ROOT_Y = 26;
    const CAT_Y = 52;
    const SKILL_Y = 82;

    // Milestones: small badges riding the trunk above the root.
    const mY = 8;
    const mCount = milestones.length || 1;
    milestones.forEach((m, i) => {
      const x = mCount === 1 ? 50 : 22 + (i * 56) / (mCount - 1);
      placed.push({
        id: `m-${i}`,
        x,
        y: mY,
        label: m.title,
        tip: `${m.org} · ${m.period}`,
        kind: 'milestone',
        icon: GraduationCap,
        depth: -1,
      });
    });

    // Root.
    const rootNode: PlacedNode = {
      id: 'root',
      x: 50,
      y: ROOT_Y,
      label: root,
      tip: isEs ? 'Núcleo' : 'Core',
      kind: 'root',
      icon: RootGlyph,
      depth: 0,
    };
    placed.push(rootNode);

    // Categories spread evenly across the width.
    const gCount = groups.length || 1;
    const catNodes: PlacedNode[] = groups.map((g, i) => {
      const x = gCount === 1 ? 50 : 10 + (i * 80) / (gCount - 1);
      const node: PlacedNode = {
        id: `cat-${i}`,
        x,
        y: CAT_Y,
        label: g.label,
        tip: `${g.items.length} ${isEs ? 'habilidades' : 'skills'}`,
        kind: 'category',
        icon: catIcon(g.label),
        parent: 'root',
        depth: 1,
      };
      placed.push(node);
      edges.push({ id: `e-root-${i}`, from: rootNode, to: node });
      return node;
    });

    // Skills fan out below each category.
    groups.forEach((g, gi) => {
      const cat = catNodes[gi];
      const n = g.items.length;
      // local horizontal span scaled by how many skills (keeps tight on edges)
      const span = Math.min(26, 6 + n * 3.2);
      g.items.forEach((item, si) => {
        const t = n === 1 ? 0.5 : si / (n - 1);
        let x = cat.x - span / 2 + t * span;
        // keep inside the field with a small margin
        x = Math.max(6, Math.min(94, x));
        // stagger two rows so dense categories don't crowd
        const row = n > 3 ? si % 2 : 0;
        const y = SKILL_Y + row * 11;
        const node: PlacedNode = {
          id: `s-${gi}-${si}`,
          x,
          y,
          label: item,
          tip: item,
          kind: 'skill',
          icon: cat.icon,
          parent: cat.id,
          depth: 2,
        };
        placed.push(node);
        edges.push({ id: `e-${gi}-${si}`, from: cat, to: node });
      });
    });

    // Milestones link down to the root trunk.
    milestones.forEach((_, i) => {
      const mNode = placed.find((p) => p.id === `m-${i}`)!;
      edges.push({ id: `e-m-${i}`, from: mNode, to: rootNode });
    });

    return { nodes: placed, links: edges };
  }, [root, groups, milestones, isEs]);

  // total order index for spring stagger (by depth then position)
  const order = useMemo(() => {
    const sorted = [...nodes].sort((a, b) => a.depth - b.depth || a.x - b.x);
    const map = new Map<string, number>();
    sorted.forEach((n, i) => map.set(n.id, i));
    return map;
  }, [nodes]);

  return (
    <div
      className="relative mx-auto w-full"
      style={{ maxWidth: 1080 }}
      role="group"
      aria-label={isEs ? 'Árbol de habilidades' : 'Skill tree'}
    >
      {/* The box keeps a fixed aspect ratio so % positions translate to a
          balanced, centered tree that scales on every breakpoint. */}
      <div className="relative aspect-[5/6] w-full sm:aspect-[16/11]">
        {/* ── SVG connectors ── */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 100 ${H}`}
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="linkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={hexA(greenLight, 0.7)} />
              <stop offset="100%" stopColor={hexA(greenDeep, 0.35)} />
            </linearGradient>
            <filter id="linkGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="0.6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {links.map((l, i) => {
            const isHot =
              active != null && (active === l.from.id || active === l.to.id);
            return (
              <motion.path
                key={l.id}
                d={bezier(l.from.x, l.from.y, l.to.x, l.to.y)}
                fill="none"
                stroke={isHot ? hexA(greenLight, 0.95) : 'url(#linkGrad)'}
                strokeWidth={isHot ? 0.7 : 0.45}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                filter="url(#linkGlow)"
                initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-12%' }}
                transition={{
                  duration: reduce ? 0 : 0.9,
                  delay: reduce ? 0 : 0.2 + i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            );
          })}
        </svg>

        {/* ── Nodes ── */}
        {nodes.map((n) => (
          <TreeNode
            key={n.id}
            node={n}
            index={order.get(n.id) ?? 0}
            active={active}
            setActive={setActive}
            green={green}
            greenDeep={greenDeep}
            greenLight={greenLight}
            bone={bone}
            reduce={reduce}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── A single talent node ──────────────────────────────────────────────── */
function TreeNode({
  node,
  index,
  active,
  setActive,
  green,
  greenDeep,
  greenLight,
  bone,
  reduce,
}: {
  node: PlacedNode;
  index: number;
  active: string | null;
  setActive: (id: string | null) => void;
  green: string;
  greenDeep: string;
  greenLight: string;
  bone: string;
  reduce: boolean;
}) {
  const isActive = active === node.id;
  const size =
    node.kind === 'root'
      ? 'h-[74px] w-[74px] sm:h-[88px] sm:w-[88px]'
      : node.kind === 'category'
        ? 'h-[58px] w-[58px] sm:h-[68px] sm:w-[68px]'
        : node.kind === 'milestone'
          ? 'h-[46px] w-[46px] sm:h-[52px] sm:w-[52px]'
          : 'h-[48px] w-[48px] sm:h-[56px] sm:w-[56px]';

  const isRoot = node.kind === 'root';
  const isCat = node.kind === 'category';

  const ring =
    isRoot || isCat ? hexA(green, 0.55) : hexA(green, 0.3);
  const fill = isRoot
    ? `radial-gradient(circle at 30% 25%, ${hexA(greenLight, 0.4)}, ${hexA(greenDeep, 0.32)})`
    : isCat
      ? `radial-gradient(circle at 30% 25%, ${hexA(greenLight, 0.26)}, rgba(255,255,255,0.04))`
      : 'rgba(255,255,255,0.045)';

  const iconColor = isRoot ? bone : greenLight;
  const iconSize =
    node.kind === 'root' ? 30 : node.kind === 'category' ? 24 : 20;

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${node.x}%`, top: `${node.y}%`, zIndex: isActive ? 30 : isRoot ? 20 : 10 }}
    >
      <motion.button
        type="button"
        onMouseEnter={() => setActive(node.id)}
        onMouseLeave={() => setActive(null)}
        onFocus={() => setActive(node.id)}
        onBlur={() => setActive(null)}
        aria-label={`${node.label}${node.tip && node.tip !== node.label ? ` — ${node.tip}` : ''}`}
        className={cn(
          'group relative grid cursor-pointer place-items-center rounded-full outline-none',
          'transition-shadow duration-300',
          size,
        )}
        style={{
          background: fill,
          border: `1.5px solid ${ring}`,
          backdropFilter: 'blur(14px) saturate(140%)',
          WebkitBackdropFilter: 'blur(14px) saturate(140%)',
          boxShadow: isActive
            ? `0 0 0 4px ${hexA(green, 0.18)}, 0 0 32px ${hexA(green, 0.55)}, inset 0 1px 0 rgba(255,255,255,0.22)`
            : `0 10px 26px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.18)`,
        }}
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        whileHover={reduce ? undefined : { scale: 1.1 }}
        whileFocus={reduce ? undefined : { scale: 1.1 }}
        transition={{
          type: 'spring',
          stiffness: 320,
          damping: 20,
          delay: reduce ? 0 : 0.3 + index * 0.04,
        }}
      >
        {/* breathing aura for root + categories */}
        {(isRoot || isCat) && !reduce && (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{ boxShadow: `0 0 24px ${hexA(green, 0.45)}` }}
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
          />
        )}

        {isRoot ? (
          <node.icon size={iconSize} color={iconColor} strokeWidth={1.8} aria-hidden />
        ) : node.kind === 'skill' || node.kind === 'category' ? (
          <SkillGlyph name={node.label} size={iconSize} fallback={node.icon} color={iconColor} />
        ) : (
          <node.icon size={iconSize} color={iconColor} strokeWidth={1.8} aria-hidden />
        )}

        {/* tooltip */}
        <span
          className={cn(
            'pointer-events-none absolute left-1/2 top-full z-40 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-center font-mono text-[10px] uppercase tracking-wider opacity-0 transition-opacity duration-200',
            'group-hover:opacity-100 group-focus-visible:opacity-100',
          )}
          style={{
            color: bone,
            background: 'rgba(8,12,8,0.92)',
            border: `1px solid ${hexA(green, 0.3)}`,
            boxShadow: `0 8px 22px rgba(0,0,0,0.5)`,
          }}
        >
          {node.label}
          {node.tip && node.tip !== node.label && (
            <span className="mt-0.5 block text-[9px] normal-case tracking-normal" style={{ color: hexA(bone, 0.6) }}>
              {node.tip}
            </span>
          )}
        </span>
      </motion.button>
    </div>
  );
}
