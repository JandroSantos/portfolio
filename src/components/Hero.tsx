import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useCallback } from 'react';
import { ArrowDownRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWorld } from '@/hooks/useWorld';
import { useLanguage } from '@/hooks/useLanguage';
import { PROFILE } from '@/data/content';
import Magnet from './ui/Magnet';
import DecodeText from './ui/DecodeText';
import LanguageToggle from './ui/LanguageToggle';
import { scrollToId } from '@/lib/scroll';
import { emit } from '@/lib/bus';

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
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleLogoClick = useCallback(() => {
    scrollToId('hero');
    logoClickCount.current += 1;
    clearTimeout(logoClickTimer.current);
    if (logoClickCount.current >= 5) {
      logoClickCount.current = 0;
      emit('party');
    } else {
      logoClickTimer.current = setTimeout(() => { logoClickCount.current = 0; }, 1200);
    }
  }, []);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const figureY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const nameY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="grain relative flex h-[100svh] w-full flex-col overflow-hidden"
      style={{
        background: `radial-gradient(120% 80% at 50% 110%, ${character.world.deep}22 0%, transparent 60%), var(--color-ink)`,
      }}
    >
      {/* Animated backdrop */}
      <motion.div aria-hidden style={{ y: bgY }} className="pointer-events-none absolute inset-0 z-0">
        <motion.div
          className="absolute left-1/2 top-1/3 h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
          style={{
            background: `conic-gradient(from 0deg, ${character.world.deep}00, ${character.world.bg}44, ${character.world.deep}00)`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      {/* Top bar */}
      <header className="relative z-30 flex items-center justify-between px-5 pt-6 sm:px-10 sm:pt-8">
        <button
          onClick={handleLogoClick}
          data-cursor="hover"
          className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-bone"
        >
          JS<span style={{ color: character.world.bg }}>.</span>
        </button>

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

        <div className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="hidden items-center gap-2 rounded-full border border-ink-line px-3 py-1.5 sm:flex"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: character.world.bg }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: character.world.bg }} />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-bone-dim">{d.meta.available}</span>
          </motion.div>
          <LanguageToggle />
        </div>
      </header>

      {/* Name + figurine */}
      <div className="relative flex flex-1 flex-col items-center justify-center">

        {/* Name — massive display heading split into two rows */}
        <motion.div
          style={{ y: nameY }}
          className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col items-center justify-start pt-6"
          aria-hidden
        >
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="heading-kinetic block text-center text-[clamp(5rem,19vw,16rem)] leading-[0.82] text-bone"
          >
            JANDRO
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="heading-kinetic block text-center text-[clamp(5rem,19vw,16rem)] leading-[0.82]"
            style={{ color: character.world.bg }}
          >
            SANTOS
          </motion.span>
        </motion.div>

        {/* Figurine — rises from the bottom, overlaps the name */}
        <motion.div
          style={{ y: figureY }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center"
        >
          <Magnet padding={180} strength={4} className="pointer-events-auto h-[60vh] w-auto sm:h-[72vh]">
            <img
              src={character.image}
              alt={`${PROFILE.name} — ${d.characters[character.key].alias}`}
              draggable={false}
              className="h-full w-auto select-none object-contain object-bottom"
              style={{ filter: `drop-shadow(0 30px 80px ${character.world.deep}88)` }}
            />
          </Magnet>
        </motion.div>

        <h1 className="sr-only">{PROFILE.name}</h1>
      </div>

      {/* Bottom bar */}
      <motion.div
        style={{ opacity: cueOpacity }}
        className="relative z-30 flex items-end justify-between gap-4 px-5 pb-7 sm:px-10 sm:pb-10"
      >
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
      </motion.div>
    </section>
  );
}
