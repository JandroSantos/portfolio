import { motion } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWorld } from '@/hooks/useWorld';
import { useLanguage } from '@/hooks/useLanguage';
import { PROFILE } from '@/data/content';
import Magnet from './ui/Magnet';
import DecodeText from './ui/DecodeText';
import LanguageToggle from './ui/LanguageToggle';
import { scrollToId } from '@/lib/scroll';

const NAV_IDS = ['connect', 'projects', 'experience', 'studies'] as const;
const PATH_BY_NAV: Record<(typeof NAV_IDS)[number], string> = {
  connect: '/connect',
  projects: '/projects',
  experience: '/experience',
  studies: '/studies',
};

export default function Hero() {
  const { character } = useWorld();
  const { d, lang } = useLanguage();
  const navigate = useNavigate();

  return (
    <section
      id="hero"
      className="grain relative flex h-[100svh] w-full flex-col overflow-hidden"
      style={{
        background: `radial-gradient(120% 80% at 50% 110%, ${character.world.deep}22 0%, transparent 60%), var(--color-ink)`,
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

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_IDS.map((id, i) => (
            <motion.button
              key={id}
              onClick={() => navigate(PATH_BY_NAV[id])}
              data-cursor="hover"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-sm uppercase tracking-[0.2em] text-bone-dim transition-colors hover:text-bone"
            >
              {d.nav[id]}
            </motion.button>
          ))}
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
        {/* Magnetic figure, rising from the bottom — the head reaches the name */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center">
          <Magnet
            padding={180}
            strength={4}
            className="pointer-events-auto h-[52vh] w-auto sm:h-[66vh]"
          >
            <img
              src={character.image}
              alt={`${PROFILE.name} — ${d.characters[character.key].alias}`}
              draggable={false}
              className="h-full w-auto select-none object-contain object-bottom"
              style={{ filter: `drop-shadow(0 30px 60px ${character.world.deep}66)` }}
            />
          </Magnet>
        </div>

        {/* The name, anchored to the upper third so both lines stay readable */}
        <div className="pointer-events-none absolute inset-x-0 top-[7%] z-20 px-3 text-center sm:top-[6%]">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="heading-kinetic text-bone"
          >
            <span className="block text-[20vw] leading-[0.78] sm:text-[16vw]">JANDRO</span>
            <span
              className="block text-[20vw] leading-[0.78] text-outline sm:text-[16vw]"
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

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => scrollToId('navigator')}
          data-cursor="hover"
          data-cursor-label={d.meta.scroll}
          className="group flex items-center gap-2 text-right"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone-dim sm:text-xs">
            {d.meta.explore}
          </span>
          <ArrowDownRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1 sm:h-5 sm:w-5"
            style={{ color: character.world.bg }}
          />
        </motion.button>
      </div>
    </section>
  );
}
