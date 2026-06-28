import { useState } from 'react';
import {
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
  Cpu as CpuChip,
  type LucideIcon,
} from 'lucide-react';

/* ─── Icon resolution ───────────────────────────────────────────────────
   Brand logos come from the Simple Icons CDN (colorful, crisp, zero-bundle);
   non-brand concepts fall back to a matching lucide glyph. Anything broken
   degrades gracefully to a category glyph. */
export const SIMPLE: Record<string, { slug: string; color: string }> = {
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

export const LUCIDE: Record<string, LucideIcon> = {
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

export const CAT_ICON: Record<string, LucideIcon> = {
  frontend: Layers,
  backend: Server,
  ia: Cpu,
  ai: Cpu,
  idiomas: Languages,
  languages: Languages,
};

export function catIcon(label: string): LucideIcon {
  return CAT_ICON[label.toLowerCase()] ?? Code2;
}

export const RootGlyph = CpuChip;

/**
 * Renders the best icon for a skill name:
 * - colourful Simple Icons CDN logo when the slug is known,
 * - else a matching lucide glyph,
 * - else a passed-in fallback glyph,
 * with graceful onError → lucide swap.
 */
export function SkillGlyph({
  name,
  size = 22,
  fallback,
  color,
}: {
  name: string;
  size?: number;
  fallback: LucideIcon;
  color: string;
}) {
  const key = name.toLowerCase();
  const simple = SIMPLE[key];
  const [imgFailed, setImgFailed] = useState(false);
  const Fallback = LUCIDE[key] ?? fallback;

  if (simple && !imgFailed) {
    return (
      <img
        src={`https://cdn.simpleicons.org/${simple.slug}/${simple.color}`}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        draggable={false}
        onError={() => setImgFailed(true)}
        className="select-none"
        style={{ width: size, height: size }}
      />
    );
  }
  return <Fallback size={size} color={color} strokeWidth={1.7} aria-label={name} />;
}
