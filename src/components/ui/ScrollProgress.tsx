import { motion, useScroll, useSpring } from 'framer-motion';
import { useWorld } from '@/hooks/useWorld';

/**
 * A hairline progress bar pinned to the top of the viewport, tinted to
 * the active world. Springs as you scroll — a small premium signal.
 */
export default function ScrollProgress() {
  const { character } = useWorld();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  return (
    <motion.div
      aria-hidden
      className="fixed left-0 top-0 z-[9999] h-[3px] w-full origin-left"
      style={{
        scaleX,
        background: character.world.bg,
        boxShadow: `0 0 12px ${character.world.bg}`,
      }}
    />
  );
}
