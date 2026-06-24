import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useCallback, useEffect } from 'react';
import { on } from '@/lib/bus';
import { ArrowDownRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWorld } from '@/hooks/useWorld';
import { useLanguage } from '@/hooks/useLanguage';
import { PROFILE } from '@/data/content';
import Magnet from './ui/Magnet';
import DecodeText from './ui/DecodeText';
import LanguageToggle from './ui/LanguageToggle';
import ParticleName from './effects/ParticleName';
import { scrollToId } from '@/lib/scroll';
import { emit } from '@/lib/bus';

const NAV_IDS = ['connect', 'projects', 'experience', 'studies'] as const;
const PATH_BY_NAV: Record<(typeof NAV_IDS)[number], string> = {
  connect: '/connect',
  projects: '/projects',
  experience: '/experience',
  studies: '/studies',
};

const MATERIALS = ['gold', 'code', 'filings', 'blueprint'] as const;

export default function Hero() {
  const { character } = useWorld();
  const { d, lang } = useLanguage();
  const navigate = useNavigate();
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [materialIdx, setMaterialIdx] = useState(0);

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

  const cycleMaterial = useCallback(() => {
    setMaterialIdx((i) => (i + 1) % MATERIALS.length);
  }, []);

  useEffect(() => {
    return on('particle-material', (mat) => {
      const idx = MATERIALS.indexOf(mat as typeof MATERIALS[number]);
      if (idx !== -1) setMaterialIdx(idx);
    });
  }, []);

  // Scroll-linked parallax — layers drift at different rates as the
  // hero hands off to the carousel below.
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const nameY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const figureY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="grain relative flex h-[100svh] w-full flex-col overflow-hidden"
      style={{
        background: `radial-gradient(130% 90% at 50% 115%, ${character.world.deep}33 0%, ${character.world.bg}11 35%, transparent 70%), var(--color-ink)`,
        transition: 'background 700ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* ── BACKDROP / VIDEO SLOT ─────────────────────────────────────
          Drop a full-bleed loop here for the cinematic version:
          <video className="h-full w-full object-cover opacity-40"
                 autoPlay muted loop playsInline src="/hero.mp4" />
          The animated gradient below is the fallback. */}
      <motion.div
        aria-hidden
        style={{ y: bgY }}
        className="pointer-events-none absolute inset-0 z-0"
      >
        <motion.div
          className="absolute left-1/2 top-1/3 h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
          style={{
            background: `conic-gradient(from 0deg, ${character.world.deep}00, ${character.world.bg}33, ${character.world.deep}00)`,
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
          data-cursor-label="×5 🎉"
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

      {/* Center: particle name + magnetic character */}
      <div className="relative flex flex-1 items-stretch justify-center">
        {/* Magnetic figure, rising from the bottom — the head reaches the name */}
        <motion.div
          style={{ y: figureY }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center"
        >
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
        </motion.div>

        {/* The name — click to cycle particle materials (gold→code→filings→blueprint) */}
        <motion.div
          style={{ y: nameY }}
          onClick={cycleMaterial}
          className="absolute inset-x-0 top-0 z-20 h-[64%] cursor-pointer"
          aria-hidden
          title="Click to change material"
        >
          <ParticleName
            lines={['JANDRO', 'SANTOS']}
            material={MATERIALS[materialIdx]}
            className="h-full w-full"
          />
        </motion.div>
        <h1 className="sr-only">{PROFILE.name}</h1>
      </div>

      {/* Bottom: role + scroll cue — fades as the hero parallaxes away */}
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
      </motion.div>
    </section>
  );
}

