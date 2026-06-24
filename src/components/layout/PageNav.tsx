import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import type { Character } from '@/data/characters';
import { WORLD_ROUTES } from '@/data/routes';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageToggle from '../ui/LanguageToggle';

export default function PageNav({ character }: { character: Character }) {
  const navigate = useNavigate();
  const { d } = useLanguage();
  const ink = character.world.ink;

  return (
    <motion.header
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-[120] flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5"
    >
      {/* Back home */}
      <button
        onClick={() => navigate('/')}
        data-cursor="hover"
        data-cursor-label={d.meta.backHome}
        className="group flex items-center gap-2.5 rounded-full border px-4 py-2.5 backdrop-blur-md transition-colors sm:px-5 sm:py-3"
        style={{ borderColor: `${ink}44`, color: ink, background: `${ink}12` }}
      >
        <ArrowLeft size={18} strokeWidth={2.5} className="transition-transform group-hover:-translate-x-0.5" />
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] sm:text-[13px]">
          {d.meta.back}
        </span>
      </button>

      {/* World switcher (desktop) */}
      <nav
        className="hidden items-center gap-1 rounded-full border px-2 py-2 backdrop-blur-md md:flex"
        style={{ borderColor: `${ink}33`, background: `${ink}0d` }}
      >
        {WORLD_ROUTES.map((r) => {
          const isActive = r.key === character.key;
          return (
            <button
              key={r.key}
              onClick={() => navigate(r.path)}
              data-cursor="hover"
              className="relative rounded-full px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] transition-colors sm:text-[13px]"
              style={{ color: ink, opacity: isActive ? 1 : 0.55 }}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: `${ink}22` }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {d.nav[r.path.slice(1) as keyof typeof d.nav]}
              </span>
            </button>
          );
        })}
      </nav>

      <LanguageToggle />
    </motion.header>
  );
}
