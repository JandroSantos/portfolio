import { motion } from 'framer-motion';
import { useLanguage, type Lang } from '@/hooks/useLanguage';
import { useWorld } from '@/hooks/useWorld';

const LANGS: Lang[] = ['es', 'en'];

/**
 * A compact ES/EN pill with a sliding indicator tinted by the active
 * world. The actual switch fires a playful full-screen sweep
 * (see LanguageSwitchOverlay).
 */
export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const { character } = useWorld();

  return (
    <div
      className="relative flex items-center rounded-full border border-ink-line bg-ink-soft/70 p-1 backdrop-blur-md"
      role="group"
      aria-label="Idioma / Language"
    >
      {LANGS.map((l) => {
        const isActive = l === lang;
        return (
          <button
            key={l}
            onClick={() => setLang(l)}
            data-cursor="hover"
            aria-pressed={isActive}
            className="relative z-10 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest transition-colors duration-300"
            style={{ color: isActive ? character.world.ink : '#b8b2a8' }}
          >
            {isActive && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 -z-10 rounded-full"
                style={{ background: character.world.bg }}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            {l}
          </button>
        );
      })}
    </div>
  );
}
