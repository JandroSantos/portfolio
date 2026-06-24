import { motion } from 'framer-motion';
import Hero from '@/components/Hero';
import CharacterCarousel from '@/components/carousel/CharacterCarousel';

/**
 * The landing experience: the kinetic hero and the character
 * navigator. Picking a character routes into its dedicated world.
 */
export default function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Hero />
      <CharacterCarousel />
    </motion.div>
  );
}
