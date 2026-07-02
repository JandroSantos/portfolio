import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { hexA, hasFinePointer, prefersReducedMotion } from '@/lib/utils';
import type { World } from '@/data/characters';
import TechChip from './TechIcon';

export type ProjectItem = {
  number: string;
  name: string;
  category: string;
  year: string;
  role: string;
  description: string;
  stack: string[];
};

/**
 * A single premium "liquid glass" project card.
 * Translucent surface, inner top highlight, an accent glow that follows the
 * pointer, and a subtle magnetic 3D tilt on capable devices.
 */
export default function ProjectCard({
  item,
  index,
  world,
  viewLabel,
  featured = false,
}: {
  item: ProjectItem;
  index: number;
  world: World;
  viewLabel: string;
  featured?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const accent = world.bg;

  // Pointer position (0..1) for the glow.
  const [glow, setGlow] = useState({ x: 50, y: 50, on: false });

  // Magnetic tilt.
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });
  const rotateX = useTransform(srx, (v) => `${v}deg`);
  const rotateY = useTransform(sry, (v) => `${v}deg`);

  const interactive = hasFinePointer() && !prefersReducedMotion();

  function handleMove(e: React.MouseEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setGlow({ x: px * 100, y: py * 100, on: true });
    if (interactive) {
      rx.set((0.5 - py) * 6);
      ry.set((px - 0.5) * 6);
    }
  }

  function handleLeave() {
    setGlow((g) => ({ ...g, on: false }));
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.article
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.06 }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
        background: `linear-gradient(160deg, ${hexA(world.panel, 0.14)} 0%, ${hexA(
          world.deep,
          0.1,
        )} 60%, ${hexA('#000000', 0.22)} 100%)`,
        border: `1px solid ${accent}26`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 30px 70px -30px ${hexA(
          world.deep,
          0.6,
        )}, 0 2px 12px rgba(0,0,0,0.4)`,
      }}
      className={`group relative flex flex-col overflow-hidden rounded-[26px] p-6 backdrop-blur-2xl transition-shadow duration-500 sm:p-8 ${
        featured ? 'lg:col-span-2' : ''
      }`}
    >
      {/* Pointer-tracking accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: glow.on ? 1 : 0,
          background: `radial-gradient(420px circle at ${glow.x}% ${glow.y}%, ${hexA(
            accent,
            0.18,
          )}, transparent 60%)`,
        }}
      />
      {/* Iridescent top edge sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${hexA(world.accent, 0.6)}, transparent)`,
        }}
      />
      {/* Diagonal sheen sweep — a light streak that crosses the glass on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[26px]"
      >
        <div
          className="absolute -inset-y-8 -left-1/3 w-1/3 -translate-x-[220%] skew-x-[-18deg] opacity-0 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[420%] group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, transparent, ${hexA('#ffffff', 0.1)} 45%, ${hexA(
              world.accent,
              0.14,
            )} 55%, transparent)`,
          }}
        />
      </div>

      {/* Header: index + meta */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <span
          className="font-display text-[2.75rem] leading-none tracking-tight sm:text-6xl"
          style={{
            color: 'transparent',
            backgroundImage: `linear-gradient(180deg, ${world.accent}, ${accent})`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
          }}
        >
          {item.number}
        </span>
        <div className="text-right">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.3em]"
            style={{ color: hexA(world.accent, 0.85) }}
          >
            {item.category}
          </p>
          <p className="mt-1 font-mono text-[10px] tracking-[0.3em] text-bone/40">
            {item.year}
          </p>
        </div>
      </div>

      {/* Title + role */}
      <div className="relative z-10 mt-6">
        <h3
          className={`font-display uppercase leading-[0.92] text-bone ${
            featured ? 'text-[2.4rem] sm:text-5xl lg:text-6xl' : 'text-[2rem] sm:text-4xl'
          }`}
        >
          {item.name}
        </h3>
        <p
          className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em]"
          style={{ color: hexA(accent, 0.8) }}
        >
          {item.role}
        </p>
      </div>

      {/* Description */}
      <p
        className={`relative z-10 mt-4 max-w-prose text-[15px] leading-relaxed text-bone/65 ${
          featured ? 'sm:text-base' : ''
        }`}
      >
        {item.description}
      </p>

      {/* Stack chips */}
      <div className="relative z-10 mt-6 flex flex-wrap gap-2">
        {item.stack.map((s, i) => (
          <TechChip key={s} label={s} accent={accent} index={i} />
        ))}
      </div>

      {/* CTA row pinned to bottom */}
      <div className="relative z-10 mt-auto flex items-center justify-between pt-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/35">
          {String(index + 1).padStart(2, '0')} / 03
        </span>
        <span
          className="group/cta inline-flex min-h-[44px] cursor-pointer items-center gap-2 overflow-hidden rounded-full px-4 font-mono text-[12px] font-medium uppercase tracking-[0.2em] text-bone outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent group-hover:px-5"
          tabIndex={0}
          role="link"
          aria-label={viewLabel}
          style={{
            background: `linear-gradient(135deg, ${accent}33, ${accent}14)`,
            border: `1px solid ${accent}40`,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14)',
          }}
        >
          {viewLabel}
          <span className="relative h-4 w-4 overflow-hidden">
            <ArrowUpRight
              className="absolute inset-0 h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4 group-hover:-translate-y-4"
              style={{ color: world.accent }}
              aria-hidden
            />
            <ArrowUpRight
              className="absolute inset-0 h-4 w-4 -translate-x-4 translate-y-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:translate-y-0"
              style={{ color: world.accent }}
              aria-hidden
            />
          </span>
        </span>
      </div>
    </motion.article>
  );
}
