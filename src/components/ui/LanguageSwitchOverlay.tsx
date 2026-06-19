import { AnimatePresence, motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useWorld } from '@/hooks/useWorld';

/**
 * The playful half of the language switch: a colored panel sweeps
 * across the screen, masking the content swap and flashing a cheeky
 * line, then wipes away to reveal the new language.
 */
export default function LanguageSwitchOverlay() {
  const { switching, switchLine } = useLanguage();
  const { character } = useWorld();

  return (
    <AnimatePresence>
      {switching && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[10002] flex items-center justify-center"
          initial={{ x: '-100%' }}
          animate={{ x: ['-100%', '0%', '0%', '100%'] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.05, times: [0, 0.32, 0.55, 1], ease: [0.76, 0, 0.24, 1] }}
          style={{ background: character.world.bg }}
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 px-6 text-center"
            style={{ color: character.world.ink }}
          >
            <Languages className="h-6 w-6 shrink-0 sm:h-8 sm:w-8" strokeWidth={2.25} />
            <span className="font-display text-[clamp(1.2rem,4vw,2.4rem)] uppercase leading-tight">
              {switchLine}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
