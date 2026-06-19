import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowLeft, ArrowRight, CornerDownRight } from 'lucide-react';
import { CHARACTERS, CHARACTER_COUNT, getByIndex, type Character } from '@/data/characters';
import { SECTION_FOR } from '@/data/content';
import { useWorld } from '@/hooks/useWorld';
import { useLanguage } from '@/hooks/useLanguage';
import { scrollToId } from '@/lib/scroll';
import { hasFinePointer, prefersReducedMotion } from '@/lib/utils';

type Role = 'center' | 'left' | 'right' | 'back';

/** The 700ms world morph — the only "slow" easing in the component. */
const MORPH = '700ms cubic-bezier(0.4,0,0.2,1)';
/** Emil-standard out-easing for entrances; never ease-in. */
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

function roleFor(index: number, active: number): Role {
  const d = ((index - active) % CHARACTER_COUNT + CHARACTER_COUNT) % CHARACTER_COUNT;
  if (d === 0) return 'center';
  if (d === 1) return 'right';
  if (d === CHARACTER_COUNT - 1) return 'left';
  return 'back';
}

/**
 * Positioning for the *outer* slot (left/bottom/size). The morph transition
 * lives here so figures glide between slots. The inner element owns the
 * role transform (scale) so parallax can compose on top without conflict.
 */
function slotStyle(role: Role, isMobile: boolean): React.CSSProperties {
  const base: React.CSSProperties = {
    position: 'absolute',
    transition: `left ${MORPH}, bottom ${MORPH}, height ${MORPH}, opacity ${MORPH}, filter ${MORPH}`,
    willChange: 'left, bottom, height, opacity, filter',
  };
  switch (role) {
    case 'center':
      return {
        ...base,
        left: '50%',
        bottom: 0,
        height: isMobile ? '46%' : '66%',
        filter: 'none',
        opacity: 1,
        zIndex: 20,
      };
    case 'left':
      return {
        ...base,
        left: isMobile ? '18%' : '28%',
        bottom: isMobile ? '28%' : '14%',
        height: isMobile ? '13%' : '22%',
        filter: 'blur(2px)',
        opacity: 0.8,
        zIndex: 10,
      };
    case 'right':
      return {
        ...base,
        left: isMobile ? '82%' : '72%',
        bottom: isMobile ? '28%' : '14%',
        height: isMobile ? '13%' : '22%',
        filter: 'blur(2px)',
        opacity: 0.8,
        zIndex: 10,
      };
    case 'back':
      return {
        ...base,
        left: '50%',
        bottom: isMobile ? '30%' : '16%',
        height: isMobile ? '10%' : '15%',
        filter: 'blur(4px)',
        opacity: 0.85,
        zIndex: 5,
      };
  }
}

/** Role transform (scale + centering) for the inner figure layer. */
function innerTransform(role: Role, isMobile: boolean): string {
  if (role === 'center') return `translateX(-50%) scale(${isMobile ? 1.05 : 1.25})`;
  return 'translateX(-50%) scale(1)';
}

/** How far (px) each role drifts with the pointer. Center barely moves; depth moves more. */
const PARALLAX_RANGE: Record<Role, { x: number; y: number }> = {
  center: { x: 8, y: 6 },
  left: { x: 26, y: 16 },
  right: { x: 26, y: 16 },
  back: { x: 40, y: 22 },
};

/** One figure. Subscribes to smoothed pointer values and drifts for parallax depth. */
function Figure({
  role,
  isMobile,
  px,
  py,
  src,
  alt,
  onClick,
  isCenter,
  character,
}: {
  role: Role;
  isMobile: boolean;
  px: MotionValue<number>;
  py: MotionValue<number>;
  src: string;
  alt: string;
  onClick: () => void;
  isCenter: boolean;
  character: Character;
}) {
  const range = PARALLAX_RANGE[role];
  // back/center drift *with* the pointer, sides drift slightly against it for a diorama feel.
  const dir = role === 'left' ? -1 : 1;
  const x = useTransform(px, [-1, 1], [-range.x * dir, range.x * dir]);
  const y = useTransform(py, [-1, 1], [-range.y, range.y]);

  return (
    <div
      style={{ ...slotStyle(role, isMobile), aspectRatio: '0.62 / 1' }}
      onClick={onClick}
      data-cursor={isCenter ? 'hover' : undefined}
      data-cursor-label={isCenter ? 'Entrar' : undefined}
      className="relative"
    >
      {/* Dynamic soft ambient halo behind center figure */}
      {isCenter && (
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -z-10 h-[65%] w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] opacity-65 transition-all duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${character.world.accent}55 0%, ${character.world.deep} 100%)`,
          }}
        />
      )}
      {/* Outer layer: pointer parallax (x/y motion values only). */}
      <motion.div className="h-full w-full" style={{ x, y, willChange: 'transform' }}>
        {/* Inner layer: role transform (scale + centering) morphing over 700ms. */}
        <div
          className="h-full w-full"
          style={{
            transform: innerTransform(role, isMobile),
            transition: `transform ${MORPH}`,
            willChange: 'transform',
          }}
        >
          <img
            src={src}
            alt={alt}
            draggable={false}
            className="h-full w-full object-contain object-bottom"
          />
        </div>
      </motion.div>
    </div>
  );
}

/** Circular nav arrow with a fill-sweep on hover and a crisp press. */
function NavArrow({
  dir,
  onClick,
  ink,
  bg,
  reduced,
}: {
  dir: 'prev' | 'next';
  onClick: () => void;
  ink: string;
  bg: string;
  reduced: boolean;
}) {
  const Icon = dir === 'prev' ? ArrowLeft : ArrowRight;
  return (
    <motion.button
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Anterior' : 'Siguiente'}
      data-cursor="hover"
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={{
        rest: { scale: 1 },
        hover: { scale: reduced ? 1 : 1.06 },
        tap: { scale: reduced ? 1 : 0.92 },
      }}
      transition={{ type: 'spring', stiffness: 520, damping: 30 }}
      className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 sm:h-14 sm:w-14"
      style={{ borderColor: ink, color: ink }}
    >
      {/* Fill that wipes up from the bottom on hover. */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{ background: ink, originY: 1 }}
        variants={{
          rest: { scaleY: 0, opacity: 0 },
          hover: { scaleY: reduced ? 0 : 1, opacity: reduced ? 0 : 1 },
          tap: { scaleY: reduced ? 0 : 1, opacity: reduced ? 0 : 1 },
        }}
        transition={{ duration: 0.28, ease: EASE_OUT }}
      />
      <motion.span
        className="relative z-10 flex items-center justify-center"
        variants={{
          rest: { color: ink, x: 0 },
          hover: { color: bg, x: reduced ? 0 : dir === 'next' ? 2 : -2 },
          tap: { color: bg, x: 0 },
        }}
        transition={{ duration: 0.2, ease: EASE_OUT }}
      >
        <Icon size={22} strokeWidth={2.25} />
      </motion.span>
    </motion.button>
  );
}

/**
 * The Navigator — a figurine carousel where every rotation recolors
 * the whole world and points to one of the four sections.
 * Drag, arrows, dots and keyboard all drive it.
 */
export default function CharacterCarousel() {
  const { active, character, next, prev, goTo, direction } = useWorld();
  const { d } = useLanguage();
  const cc = d.characters[character.key];
  const [isMobile, setIsMobile] = useState(false);
  const [hinted, setHinted] = useState(false);
  const lockRef = useRef(false);
  const dragStart = useRef<number | null>(null);

  // Capabilities resolve client-side; default to the calm path during SSR/first paint.
  const [reduced, setReduced] = useState(true);
  const [fine, setFine] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    setFine(hasFinePointer());
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const parallaxOn = fine && !reduced && !isMobile;

  // Normalised pointer position (-1..1) smoothed by a spring; drives figure parallax.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spring = useMemo(() => ({ stiffness: 90, damping: 22, mass: 0.5 }), []);
  const px = useSpring(rawX, spring);
  const py = useSpring(rawY, spring);

  // Keyboard arrows when the section is in view.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') guardedNav(next);
      if (e.key === 'ArrowLeft') guardedNav(prev);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [next, prev]);

  const guardedNav = (fn: () => void) => {
    if (lockRef.current) return;
    lockRef.current = true;
    setHinted(true);
    fn();
    setTimeout(() => (lockRef.current = false), 680);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!parallaxOn) return;
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set(((e.clientX - r.left) / r.width) * 2 - 1);
    rawY.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onPointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };
  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const dx = e.clientX - dragStart.current;
    if (Math.abs(dx) > 60) guardedNav(dx < 0 ? next : prev);
    dragStart.current = null;
  };

  const enterSection = () => scrollToId(SECTION_FOR[character.key]);

  return (
    <section
      id="navigator"
      aria-label={d.carousel.aria}
      className="grain relative h-[100svh] w-full select-none overflow-hidden transition-[background-color] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
      style={{ backgroundColor: character.world.bg }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {/* Soft radial vignette — frames the scene, deepens toward the edges. */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden
        style={{
          background: `radial-gradient(120% 90% at 50% 38%, transparent 52%, ${character.world.deep}22 100%)`,
          transition: `background ${MORPH}`,
        }}
      />

      {/* Brand label */}
      <div className="absolute left-5 top-6 z-[60] sm:left-8">
        <span
          className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em]"
          style={{ color: character.world.ink }}
        >
          {d.carousel.brand}
        </span>
      </div>

      {/* Step counter */}
      <div className="absolute right-5 top-6 z-[60] sm:right-8">
        <span
          className="font-mono text-[11px] font-semibold uppercase tracking-[0.3em]"
          style={{ color: character.world.ink }}
        >
          {String(active % CHARACTER_COUNT + 1).padStart(2, '0')} / {String(CHARACTER_COUNT).padStart(2, '0')}
        </span>
      </div>

      {/* Giant ghost word */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[14%] z-[2] flex justify-center"
        aria-hidden
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={cc.ghost}
            initial={{
              opacity: 0,
              y: 34,
              x: reduced ? 0 : direction * 40,
              scale: 0.96,
              filter: 'blur(10px)',
            }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{
              opacity: 0,
              y: -34,
              x: reduced ? 0 : direction * -40,
              scale: 0.96,
              filter: 'blur(10px)',
            }}
            transition={{ duration: 0.65, ease: EASE_OUT }}
            className="heading-kinetic whitespace-nowrap"
            style={{
              color: character.world.accent,
              fontSize: 'clamp(90px, 26vw, 360px)',
              lineHeight: 1,
            }}
          >
            {cc.ghost}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Floor shadow grounding the center figure. Keyed so it fades in with each world. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] flex justify-center" aria-hidden>
        <motion.div
          key={character.key}
          initial={{ opacity: 0, scaleX: 0.7 }}
          animate={{ opacity: reduced ? 0.45 : 0.55, scaleX: 1 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          style={{
            width: isMobile ? '62%' : '46%',
            height: isMobile ? 70 : 130,
            marginBottom: isMobile ? '24%' : '4%',
            background: `radial-gradient(closest-side, ${character.world.deep} 0%, ${character.world.deep}00 72%)`,
            filter: 'blur(6px)',
          }}
        />
      </div>

      {/* Figures */}
      <div className="absolute inset-0 z-[4]">
        {CHARACTERS.map((c) => {
          const role = roleFor(c.index, active % CHARACTER_COUNT);
          return (
            <Figure
              key={c.key}
              role={role}
              isMobile={isMobile}
              px={px}
              py={py}
              src={c.image}
              alt={`${d.characters[c.key].alias} — ${d.characters[c.key].section}`}
              isCenter={role === 'center'}
              character={c}
              onClick={() => {
                if (role === 'left') guardedNav(prev);
                else if (role === 'right') guardedNav(next);
                else if (role === 'center') enterSection();
              }}
            />
          );
        })}
      </div>

      {/* Mobile swipe affordance — fades for good after the first navigation. */}
      <AnimatePresence>
        {isMobile && !hinted && (
          <motion.div
            key="swipe-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="pointer-events-none absolute left-1/2 top-[52%] z-[55] -translate-x-1/2"
            aria-hidden
          >
            <motion.div
              className="flex items-center gap-2 rounded-full px-3 py-1.5"
              style={{
                background: `${character.world.ink}14`,
                color: character.world.ink,
              }}
              animate={reduced ? undefined : { x: [-5, 5, -5] }}
              transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
            >
              <ArrowLeft size={14} strokeWidth={2.5} style={{ opacity: 0.55 }} />
              <span className="font-mono text-[10px] uppercase tracking-[0.25em]">
                {d.carousel.swipe}
              </span>
              <ArrowRight size={14} strokeWidth={2.5} style={{ opacity: 0.55 }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom-left: title + nav */}
      <div className="absolute bottom-6 left-5 z-[60] max-w-[340px] sm:bottom-16 sm:left-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={character.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          >
            <p
              className="font-mono text-[11px] uppercase tracking-[0.3em] opacity-80"
              style={{ color: character.world.ink }}
            >
              {cc.alias}
            </p>
            <h2
              className="heading-kinetic mt-1 text-[clamp(2.2rem,6vw,4rem)]"
              style={{ color: character.world.accent }}
            >
              {cc.section}
            </h2>
            <p
              className="mt-2 text-sm leading-relaxed sm:text-[15px]"
              style={{ color: character.world.ink, opacity: 0.85 }}
            >
              {cc.tagline}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-5 flex items-center gap-3">
          <NavArrow
            dir="prev"
            onClick={() => guardedNav(prev)}
            ink={character.world.ink}
            bg={character.world.bg}
            reduced={reduced}
          />
          <NavArrow
            dir="next"
            onClick={() => guardedNav(next)}
            ink={character.world.ink}
            bg={character.world.bg}
            reduced={reduced}
          />
          {/* Mobile-only inline Enter — keeps the corner clear for the terminal button. */}
          <button
            onClick={enterSection}
            data-cursor="hover"
            className="ml-1 flex items-center gap-1.5 rounded-full border-2 px-4 py-2.5 font-display text-base uppercase sm:hidden"
            style={{ borderColor: character.world.ink, color: character.world.ink }}
          >
            {d.carousel.enter}
            <CornerDownRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Bottom-right: enter CTA (desktop) */}
      <motion.button
        onClick={enterSection}
        data-cursor="hover"
        data-cursor-label={d.carousel.go}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        className="group absolute bottom-16 right-12 z-[60] hidden items-center gap-2 sm:flex"
        style={{ color: character.world.accent }}
      >
        <motion.span
          className="heading-kinetic text-[clamp(1.4rem,4vw,3rem)]"
          variants={{
            rest: { opacity: 0.95 },
            hover: { opacity: 1 },
            tap: { opacity: 1 },
          }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
        >
          {d.carousel.enter}
        </motion.span>
        <motion.span
          variants={{
            rest: { x: 0, y: 0 },
            hover: reduced ? { x: 0, y: 0 } : { x: 4, y: 4 },
            tap: reduced ? { x: 0, y: 0 } : { x: 2, y: 2 },
          }}
          transition={{ type: 'spring', stiffness: 420, damping: 24 }}
        >
          <CornerDownRight className="h-6 w-6 sm:h-9 sm:w-9" strokeWidth={2.25} />
        </motion.span>
      </motion.button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 z-[60] flex -translate-x-1/2 gap-2 sm:bottom-6">
        {CHARACTERS.map((c, i) => {
          const isActive = i === active % CHARACTER_COUNT;
          return (
            <motion.button
              key={c.key}
              onClick={() => guardedNav(() => goTo(i))}
              aria-label={`${d.carousel.go} — ${d.characters[getByIndex(i).key].section}`}
              data-cursor="hover"
              whileTap={reduced ? undefined : { scale: 0.85 }}
              className="h-2 rounded-full"
              style={{ background: character.world.ink }}
              animate={{
                width: isActive ? 28 : 8,
                opacity: isActive ? 1 : 0.4,
              }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            />
          );
        })}
      </div>
    </section>
  );
}
