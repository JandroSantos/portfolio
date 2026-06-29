import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, X } from 'lucide-react';
import type { Character } from '@/data/characters';
import { WORLD_ROUTES } from '@/data/routes';
import { useLanguage } from '@/hooks/useLanguage';
import { hexA, prefersReducedMotion } from '@/lib/utils';
import LanguageToggle from '../ui/LanguageToggle';

/**
 * Fixed glass top bar shown on every inner page. Holds a back-home
 * button, a world switcher (the four routes) and the language toggle.
 * The header height is locked so page content never shifts; on desktop
 * the switcher is a centered pill row, on mobile it collapses into a
 * compact dropdown menu that floats as an overlay (so it never grows
 * the bar or overlaps page content).
 */
export default function PageNav({ character }: { character: Character }) {
  const navigate = useNavigate();
  const { d } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const reduce = prefersReducedMotion();

  // Bright world tint reads cleanly on the dark glass.
  const tint = character.world.bg;
  const focusRing = { outlineColor: hexA(tint, 0.55) } as const;
  const activeRoute = WORLD_ROUTES.find((r) => r.key === character.key) ?? WORLD_ROUTES[0];
  const activeLabel = d.nav[activeRoute.path.slice(1) as keyof typeof d.nav];

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const go = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-[120] h-[56px] sm:h-[60px]"
      style={{
        background: 'rgba(6, 4, 2, 0.6)',
        backdropFilter: 'blur(32px) saturate(200%) brightness(1.08)',
        WebkitBackdropFilter: 'blur(32px) saturate(200%) brightness(1.08)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.25)',
      }}
    >
      <div className="relative mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-8">
        {/* Back home */}
        <button
          onClick={() => navigate('/')}
          data-cursor="hover"
          data-cursor-label={d.meta.backHome}
          aria-label={d.meta.backHome}
          className="group flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-4"
          style={{
            borderColor: hexA(tint, 0.26),
            color: tint,
            background: hexA(tint, 0.08),
            ...focusRing,
          }}
        >
          <ArrowLeft
            size={13}
            strokeWidth={2.5}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] sm:text-[11px]">
            {d.meta.back}
          </span>
        </button>

        {/* World switcher — centered pill row on desktop */}
        <nav
          aria-label={d.carousel.aria}
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 md:flex"
        >
          {WORLD_ROUTES.map((r) => {
            const isActive = r.key === character.key;
            const label = d.nav[r.path.slice(1) as keyof typeof d.nav];
            return (
              <button
                key={r.key}
                onClick={() => navigate(r.path)}
                data-cursor="hover"
                aria-current={isActive ? 'page' : undefined}
                className="relative cursor-pointer rounded-full px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-opacity duration-200 hover:opacity-90 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-xs"
                style={{ color: tint, opacity: isActive ? 1 : 0.5, ...focusRing }}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: hexA(tint, 0.1),
                      boxShadow: `inset 0 0 0 1px ${hexA(tint, 0.24)}`,
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {/* Mobile worlds trigger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            data-cursor="hover"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label={d.carousel.aria}
            className="flex h-9 cursor-pointer items-center gap-2 rounded-full border px-3.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 md:hidden"
            style={{
              borderColor: hexA(tint, 0.26),
              color: tint,
              background: hexA(tint, 0.08),
              ...focusRing,
            }}
          >
            <span className="relative grid h-3.5 w-3.5 place-items-center">
              <AnimatePresence initial={false} mode="wait">
                {menuOpen ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="absolute inset-0 grid place-items-center"
                  >
                    <X size={13} strokeWidth={2.5} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="dots"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="flex gap-[3px]"
                  >
                    {WORLD_ROUTES.map((r) => (
                      <span
                        key={r.key}
                        className="h-[3px] w-[3px] rounded-full"
                        style={{
                          background: tint,
                          opacity: r.key === character.key ? 1 : 0.4,
                        }}
                      />
                    ))}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            <span className="max-w-[7rem] truncate">{activeLabel}</span>
          </button>

          <LanguageToggle />
        </div>
      </div>

      {/* Mobile dropdown menu — floats over content, never grows the bar */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-hidden
              tabIndex={-1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-x-0 bottom-0 top-[56px] -z-10 cursor-default md:hidden"
              style={{ background: 'rgba(3,2,1,0.55)' }}
            />
            <motion.nav
              aria-label={d.carousel.aria}
              initial={{ opacity: 0, y: reduce ? 0 : -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-3 top-[calc(100%+8px)] overflow-hidden rounded-2xl border p-1.5 md:hidden"
              style={{
                background: 'rgba(6, 4, 2, 0.72)',
                backdropFilter: 'blur(32px) saturate(180%)',
                WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                borderColor: 'rgba(255,255,255,0.1)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              }}
            >
              {WORLD_ROUTES.map((r) => {
                const isActive = r.key === character.key;
                const label = d.nav[r.path.slice(1) as keyof typeof d.nav];
                return (
                  <button
                    key={r.key}
                    onClick={() => go(r.path)}
                    data-cursor="hover"
                    aria-current={isActive ? 'page' : undefined}
                    className="flex min-h-[48px] w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-4 font-mono text-[12px] uppercase tracking-[0.2em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{
                      color: tint,
                      opacity: isActive ? 1 : 0.62,
                      background: isActive ? hexA(tint, 0.1) : 'transparent',
                      ...focusRing,
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: tint, opacity: isActive ? 1 : 0.5 }}
                      />
                      {label}
                    </span>
                    {isActive && <Check size={14} strokeWidth={2.5} />}
                  </button>
                );
              })}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
