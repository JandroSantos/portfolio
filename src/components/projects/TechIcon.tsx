import { useState } from 'react';

/**
 * Maps a human stack label to a Simple Icons CDN slug.
 * Unknown / non-iconable labels resolve to null (rendered as a text-only chip).
 */
const SLUGS: Record<string, string> = {
  python: 'python',
  mcp: 'openai',
  apis: 'fastapi',
  react: 'react',
  typescript: 'typescript',
  tailwind: 'tailwindcss',
  svelte: 'svelte',
  gsap: 'greensock',
  css: 'css',
};

export function iconSlug(label: string): string | null {
  return SLUGS[label.trim().toLowerCase()] ?? null;
}

/**
 * A polished glass chip for a single technology.
 * Renders the Simple Icons mark when available; gracefully hides the image
 * (keeping the text) if the CDN request fails.
 */
export default function TechChip({
  label,
  accent,
}: {
  label: string;
  accent: string;
}) {
  const slug = iconSlug(label);
  const [broken, setBroken] = useState(false);
  const showImg = slug && !broken;

  return (
    <span
      className="group/chip inline-flex min-h-[34px] items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[11px] font-medium tracking-wide text-bone/80 backdrop-blur-md transition-colors duration-300"
      style={{
        background: `linear-gradient(135deg, ${accent}1f, ${accent}0a)`,
        border: `1px solid ${accent}33`,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
      }}
    >
      {showImg && (
        <img
          src={`https://cdn.simpleicons.org/${slug}`}
          alt=""
          aria-hidden
          width={14}
          height={14}
          loading="lazy"
          onError={() => setBroken(true)}
          className="h-3.5 w-3.5 shrink-0 opacity-90"
        />
      )}
      {label}
    </span>
  );
}
