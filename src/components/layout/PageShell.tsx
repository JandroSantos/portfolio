import { useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { Character } from '@/data/characters';
import { useWorld } from '@/hooks/useWorld';
import PageNav from './PageNav';
import SiteFooter from './SiteFooter';

interface PageShellProps {
  character: Character;
  children: ReactNode;
  /** Override the page background (defaults to a deep tint of the world). */
  background?: string;
}

/**
 * Wraps a world page: locks the global world to this character, resets
 * scroll, paints a themed backdrop, and frames the content with the
 * shared nav + footer. Each page owns its own interior layout.
 */
export default function PageShell({ character, children, background }: PageShellProps) {
  const { lockTo } = useWorld();

  useEffect(() => {
    lockTo(character.index);
    window.scrollTo({ top: 0, behavior: 'auto' });
    const lenis = (window as unknown as { lenis?: { scrollTo: (n: number, o?: object) => void } }).lenis;
    lenis?.scrollTo(0, { immediate: true });
  }, [character.index, lockTo]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="grain relative min-h-[100svh] w-full"
      style={{
        background:
          background ?? `radial-gradient(130% 80% at 50% -10%, ${character.world.deep}38 0%, #070707 55%)`,
      }}
    >
      <PageNav character={character} />
      <main>{children}</main>
      <SiteFooter character={character} />
    </motion.div>
  );
}
