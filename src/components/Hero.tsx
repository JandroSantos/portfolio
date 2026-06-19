import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorld } from '@/hooks/useWorld';
import { useLanguage } from '@/hooks/useLanguage';
import { PROFILE } from '@/data/content';
import Magnet from './ui/Magnet';
import DecodeText from './ui/DecodeText';
import LanguageToggle from './ui/LanguageToggle';
import { scrollToId } from '@/lib/scroll';

const NAV_IDS = ['connect', 'projects', 'experience', 'studies'] as const;

export default function Hero() {
  const { character } = useWorld();
  const { d, lang } = useLanguage();
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  return (
    <section
      id="hero"
      className="grain relative flex h-[100svh] w-full flex-col overflow-hidden"
      style={{
        background: `radial-gradient(130% 90% at 50% 115%, ${character.world.deep}33 0%, ${character.world.bg}11 35%, transparent 70%), var(--color-ink)`,
        transition: 'background 700ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Top bar */}
      <header className="relative z-30 flex items-center justify-between px-5 pt-6 sm:px-10 sm:pt-8">
        <button
          onClick={() => scrollToId('hero')}
          data-cursor="hover"
          className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-bone"
        >
          JS<span style={{ color: character.world.bg }}>.</span>
        </button>

        {/* Desktop nav with sliding pill background */}
        <nav className="relative hidden items-center gap-1 md:flex rounded-full border border-ink-line bg-ink-soft/40 p-1 backdrop-blur-md">
          {NAV_IDS.map((id, i) => {
            const isHovered = hoveredNav === id;
            return (
              <motion.button
                key={id}
                onClick={() => scrollToId(id)}
                onMouseEnter={() => setHoveredNav(id)}
                onMouseLeave={() => setHoveredNav(null)}
                data-cursor="hover"
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative px-4 py-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-bone-dim transition-colors hover:text-bone"
              >
                <AnimatePresence>
                  {isHovered && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full"
                      style={{
                        background: `color-mix(in srgb, ${character.world.bg} 15%, rgba(255, 255, 255, 0.05))`
                      }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
                {d.nav[id]}
              </motion.button>
            );
          })}
        </nav>

        {/* Right cluster: status + language */}
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="hidden items-center gap-2 rounded-full border border-ink-line px-3 py-1.5 sm:flex"
          >
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                style={{ background: character.world.bg }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ background: character.world.bg }}
              />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-bone-dim">
              {d.meta.available}
            </span>
          </motion.div>
          <LanguageToggle />
        </div>
      </header>

      {/* Center: name + magnetic character */}
      <div className="relative flex flex-1 items-stretch justify-center">
        {/* Magnetic figure with glowing ambient halo */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center h-[42vh] sm:h-[50vh]">
          <Magnet
            padding={180}
            strength={4}
            className="pointer-events-auto relative flex items-end justify-center h-full w-auto"
          >
            {/* Ambient character color halo */}
            <div
              aria-hidden
              className="absolute bottom-12 left-1/2 -z-10 h-[65%] w-[130%] -translate-x-1/2 rounded-full blur-[80px] opacity-50 transition-all duration-700"
              style={{
                background: `radial-gradient(circle, ${character.world.bg} 0%, ${character.world.deep} 70%)`,
              }}
            />
            <img
              src={character.image}
              alt={`${PROFILE.name} — ${d.characters[character.key].alias}`}
              draggable={false}
              className="relative z-10 h-[92%] w-auto select-none object-contain object-bottom transition-all duration-700"
              style={{ filter: `drop-shadow(0 20px 40px ${character.world.deep}aa)` }}
            />
          </Magnet>
        </div>

        {/* The name, anchored to the upper third so both lines stay readable */}
        <div className="pointer-events-none absolute inset-x-0 top-[12%] z-20 px-3 text-center sm:top-[10%]">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="heading-kinetic text-bone"
          >
            <span className="block text-[13vw] leading-[0.8] sm:text-[9vw]">JANDRO</span>
            <span
              className="block text-[13vw] leading-[0.8] text-outline sm:text-[9vw] transition-colors duration-700"
              style={{ color: character.world.bg }}
            >
              SANTOS
            </span>
          </motion.h1>
        </div>
      </div>

      {/* Bottom: role + scroll cue */}
      <div className="relative z-30 flex items-end justify-between gap-4 px-5 pb-7 sm:px-10 sm:pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[200px] sm:max-w-xs"
        >
          <DecodeText
            text={d.hero.role}
            trigger={lang}
            delay={900}
            className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-bone-dim sm:text-xs"
          />
        </motion.div>

        {/* Custom mouse wheel scroll indicator */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => scrollToId('navigator')}
          data-cursor="hover"
          data-cursor-label={d.meta.scroll}
          className="group flex items-center gap-3 text-right"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone-dim sm:text-xs">
            {d.meta.explore}
          </span>
          <div className="flex h-8 w-5 items-center justify-center rounded-full border-2 border-bone-dim/30 p-1 transition-colors group-hover:border-bone">
            <motion.div
              animate={{
                y: [-3, 3, -3],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="h-1.5 w-1 rounded-full transition-colors duration-700"
              style={{ background: character.world.bg }}
            />
          </div>
        </motion.button>
      </div>
    </section>
  );
}

