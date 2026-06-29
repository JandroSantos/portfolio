/**
 * Local brand-icon registry (Simple Icons, bundled — no CDN dependency).
 * Returns the raw SVG path for a slug, or null to fall back to a monogram.
 * Only the icons actually used by the skills orbit/marquee are imported,
 * so tree-shaking keeps this tiny.
 */
import {
  siReact, siAnthropic, siTailwindcss, siPython, siSvelte, siSupabase,
  siTypescript, siN8n, siVercel, siGithub, siCss, siMysql, siPhp,
  siHtml5, siWordpress, siGooglegemini, siCursor, siFastapi, siNodedotjs,
  siVscodium,
} from 'simple-icons';

const MAP: Record<string, { path: string }> = {
  react: siReact,
  anthropic: siAnthropic,
  tailwindcss: siTailwindcss,
  python: siPython,
  svelte: siSvelte,
  supabase: siSupabase,
  typescript: siTypescript,
  n8n: siN8n,
  vercel: siVercel,
  github: siGithub,
  css3: siCss,
  mysql: siMysql,
  php: siPhp,
  html5: siHtml5,
  wordpress: siWordpress,
  googlegemini: siGooglegemini,
  cursor: siCursor,
  fastapi: siFastapi,
  nodedotjs: siNodedotjs,
  // visual stand-in: VSCodium shares the Visual Studio Code mark
  visualstudiocode: siVscodium,
  // openai / amazonaws are absent from Simple Icons → monogram fallback
};

export function skillIconPath(slug: string): string | null {
  return MAP[slug]?.path ?? null;
}
