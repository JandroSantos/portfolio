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
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-[120] flex h-[52px] items-center justify-between px-4 sm:h-[60px] sm:px-8"
      style={{
        background: 'rgba(6, 4, 2, 0.6)',
        backdropFilter: 'blur(32px) saturate(200%) brightness(1.08)',
        WebkitBackdropFilter: 'blur(32px) saturate(200%) brightness(1.08)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.25)',
      }}
    >
      {/* Back home */}
      <button
        onClick={() => navigate('/')}
        data-cursor="hover"
        data-cursor-label={d.meta.backHome}
        className="group flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all duration-200 hover:opacity-75 sm:px-4 sm:py-2"
        style={{
          borderColor: `${ink}2e`,
          color: ink,
          background: `${ink}0c`,
        }}
      >
        <ArrowLeft size={13} strokeWidth={2.5} className="transition-transform group-hover:-translate-x-0.5" />
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] sm:text-[11px]">
          {d.meta.back}
        </span>
      </button>

      {/* World switcher */}
      <nav className="hidden items-center gap-0.5 md:flex">
        {WORLD_ROUTES.map((r) => {
          const isActive = r.key === character.key;
          return (
            <button
              key={r.key}
              onClick={() => navigate(r.path)}
              data-cursor="hover"
              className="relative rounded-full px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-opacity duration-200 hover:opacity-100 sm:text-xs"
              style={{ color: ink, opacity: isActive ? 1 : 0.42 }}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `${ink}18`,
                    boxShadow: `inset 0 0 0 1px ${ink}26`,
                  }}
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
