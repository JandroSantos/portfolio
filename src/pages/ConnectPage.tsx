import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  AnimatePresence,
  type MotionValue,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ArrowDownRight, Mail, ExternalLink, Info, X, MapPin } from 'lucide-react';
import { CHARACTERS } from '@/data/characters';
import { SOCIALS } from '@/data/content';
import { useLanguage } from '@/hooks/useLanguage';
import PageShell from '@/components/layout/PageShell';
import { hexA, prefersReducedMotion, hasFinePointer } from '@/lib/utils';

const social = CHARACTERS[0];
const w = social.world;
const EASE = [0.16, 1, 0.3, 1] as const;

/* Placeholder assets live in public/. They may not exist yet — every
 * consumer below degrades gracefully when they 404. */
const VIDEO_SRC = '/train.mp4';
const CAT_BODY_SRC = '/cat-body.png';
const CAT_HEAD_SRC = '/cat-head.png';

export default function ConnectPage() {
  const { d, lang } = useLanguage();
  const c = d.connect;
  const reduced = prefersReducedMotion();

  return (
    <PageShell character={social} background="#0a0503">
      {!reduced ? (
        <ScrollVideo c={c} lang={lang} />
      ) : (
        <ReducedJourney c={c} />
      )}

      <StationSection c={c} lang={lang} />

      <ContactPoster c={c} />
    </PageShell>
  );
}

type Connect = ReturnType<typeof useLanguage>['d']['connect'];

/* ════════════════════════════════════════════════════════════════════
 * SCROLL-SCRUBBED VIDEO JOURNEY
 * ════════════════════════════════════════════════════════════════════ */

function ScrollVideo({ c, lang }: { c: Connect; lang: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // rAF-throttled scrub: scroll writes a target time, a rAF loop eases the
  // <video> toward it and only issues a seek when the delta is meaningful.
  // This mirrors the Mainframe mouse-scrub pattern but is scroll-driven.
  const targetTime = useRef(0);
  const lastSeek = useRef(-1);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const v = videoRef.current;
    if (!v) return;
    const dur = v.duration;
    if (!dur || Number.isNaN(dur) || !Number.isFinite(dur)) return;
    targetTime.current = Math.min(Math.max(p, 0), 1) * dur;
  });

  useEffect(() => {
    if (failed) return;
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const v = videoRef.current;
      if (!v) return;
      const dur = v.duration;
      if (!dur || Number.isNaN(dur) || !Number.isFinite(dur)) return;
      const want = targetTime.current;
      // Only seek when the change is perceptible — avoids seek-flooding.
      if (Math.abs(want - lastSeek.current) > 0.03) {
        try {
          v.currentTime = want;
          lastSeek.current = want;
        } catch {
          /* seek can throw before metadata is ready — ignore */
        }
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [failed]);

  const onLoaded = () => {
    const v = videoRef.current;
    if (v && v.duration && Number.isFinite(v.duration) && v.duration > 0) {
      setReady(true);
      v.pause();
    } else {
      setFailed(true);
    }
  };

  // Progress indicator fill.
  const fillScaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const cueOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0]);
  const vignetteO = useTransform(scrollYProgress, [0, 0.1, 0.85, 1], [0.55, 0.4, 0.4, 0.7]);

  const showFallback = failed || !ready;

  return (
    <div ref={containerRef} className="relative" style={{ height: '500vh' }}>
      <div className="sticky top-0 h-[100vh] w-full overflow-hidden">
        {/* The scrubbed video */}
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={onLoaded}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: showFallback ? 0 : 1, transition: 'opacity 0.6s ease' }}
        />

        {/* Tasteful coral fallback when the video is missing/undecodable */}
        <AnimatePresence>
          {showFallback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(120% 90% at 20% 110%, ${hexA(w.bg, 0.55)} 0%, transparent 55%),
                  radial-gradient(100% 80% at 85% -10%, ${hexA(w.deep, 0.5)} 0%, transparent 50%),
                  linear-gradient(180deg, #1a0c06 0%, #0a0503 55%, #060302 100%)`,
              }}
            >
              <FallbackHorizon />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legibility vignette */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: vignetteO,
            background:
              'radial-gradient(120% 100% at 50% 50%, transparent 30%, rgba(0,0,0,0.75) 100%), linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 25%, transparent 65%, rgba(0,0,0,0.7) 100%)',
          }}
        />

        {/* Text beats */}
        <div className="absolute inset-0">
          <Beat progress={scrollYProgress} range={[0.0, 0.04, 0.16, 0.21]} align="center">
            <BeatIntro c={c} />
          </Beat>

          <Beat progress={scrollYProgress} range={[0.24, 0.29, 0.4, 0.46]} align="left">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: w.bg }}>
              {lang === 'es' ? 'El origen' : 'The origin'}
            </p>
            <p className="mt-4 max-w-2xl font-display text-[clamp(1.8rem,5vw,4.4rem)] uppercase leading-[1.02] text-bone">
              {c.bio[0]}
            </p>
          </Beat>

          <Beat progress={scrollYProgress} range={[0.49, 0.54, 0.65, 0.71]} align="right">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: w.bg }}>
              {lang === 'es' ? 'El recorrido' : 'The journey'}
            </p>
            <p className="mt-4 max-w-2xl font-display text-[clamp(1.8rem,5vw,4.4rem)] uppercase leading-[1.02] text-bone">
              {c.bio[1] ?? c.bio[0]}
            </p>
          </Beat>

          <Beat progress={scrollYProgress} range={[0.74, 0.79, 0.88, 0.93]} align="left">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: w.bg }}>
              {lang === 'es' ? 'Ahora mismo' : 'Right now'}
            </p>
            <p className="mt-4 max-w-2xl font-display text-[clamp(1.8rem,5vw,4.4rem)] uppercase leading-[1.02] text-bone">
              {c.now}
            </p>
          </Beat>

          <Beat progress={scrollYProgress} range={[0.94, 0.97, 1.0, 1.0]} align="center">
            <p className="font-mono text-[11px] uppercase tracking-[0.4em]" style={{ color: w.bg }}>
              {lang === 'es' ? 'Última parada' : 'Last stop'}
            </p>
            <h2 className="mt-3 font-display text-[clamp(2.4rem,10vw,8rem)] uppercase leading-[0.85] text-bone">
              {lang === 'es' ? 'Estación' : 'Station'}
            </h2>
            <p className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-bone/60">
              {lang === 'es' ? 'sigue bajando' : 'keep scrolling'}
              <ArrowDownRight className="h-4 w-4" />
            </p>
          </Beat>
        </div>

        {/* Scroll cue at the very start */}
        <motion.div
          style={{ opacity: cueOpacity }}
          className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 text-center"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/70">
            {lang === 'es' ? 'desplaza' : 'scroll'}
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="mx-auto mt-2 h-7 w-px"
            style={{ background: `linear-gradient(${w.bg}, transparent)` }}
          />
        </motion.div>

        {/* Thin horizontal progress indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5">
          <motion.div
            className="h-full origin-left"
            style={{ scaleX: fillScaleX, background: w.bg }}
          />
        </div>
      </div>
    </div>
  );
}

/** Layered horizon used inside the fallback so the page never looks empty. */
function FallbackHorizon() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* sun */}
      <div
        className="absolute left-1/2 top-[52%] h-[34vmin] w-[34vmin] -translate-x-1/2 rounded-full blur-[2px]"
        style={{ background: `radial-gradient(circle, ${hexA(w.panel, 0.9)} 0%, ${hexA(w.bg, 0.4)} 45%, transparent 70%)` }}
      />
      {/* horizon line */}
      <div
        className="absolute left-0 right-0 top-[62%] h-px"
        style={{ background: hexA(w.bg, 0.4) }}
      />
      {/* passing rails — perspective streaks */}
      <div
        className="absolute inset-x-0 bottom-0 top-[62%]"
        style={{
          background: `repeating-linear-gradient(90deg, transparent 0 7%, ${hexA(w.deep, 0.18)} 7% 7.4%)`,
          maskImage: 'linear-gradient(180deg, transparent, black)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent, black)',
        }}
      />
    </div>
  );
}

function BeatIntro({ c }: { c: Connect }) {
  return (
    <div className="text-center">
      <motion.img
        layoutId="world-figurine"
        src={social.image}
        alt={social.alias}
        draggable={false}
        className="mx-auto mb-6 h-[26vh] w-auto select-none object-contain"
        style={{ filter: `drop-shadow(0 0 60px ${hexA(w.bg, 0.4)})` }}
        transition={{ duration: 0.5, ease: EASE }}
      />
      <p className="font-mono text-[11px] uppercase tracking-[0.5em]" style={{ color: w.bg }}>
        {c.eyebrow}
      </p>
      <h1 className="mt-3 font-display text-[clamp(3rem,14vw,11rem)] uppercase leading-[0.82] text-bone">
        {c.title}
      </h1>
      <p className="mx-auto mt-5 max-w-md text-balance text-sm leading-relaxed text-bone/70">
        {c.intro}
      </p>
    </div>
  );
}

/** A single scroll-windowed text beat that fades in then out. */
function Beat({
  progress,
  range,
  align,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number, number, number];
  align: 'left' | 'center' | 'right';
  children: React.ReactNode;
}) {
  const [inA, inB, outA, outB] = range;
  const opacity = useTransform(progress, [inA, inB, outA, outB], [0, 1, 1, 0]);
  const y = useTransform(progress, [inA, outB], [40, -40]);
  const drift = align === 'right' ? 28 : align === 'left' ? -28 : 0;
  const x = useTransform(progress, [inA, inB], [drift, 0]);

  const justify =
    align === 'left' ? 'justify-start text-left' : align === 'right' ? 'justify-end text-right' : 'justify-center text-center';

  return (
    <motion.div
      style={{ opacity, y, x }}
      className={`absolute inset-0 flex items-center px-6 sm:px-16 ${justify}`}
    >
      <div className="w-full max-w-4xl">{children}</div>
    </motion.div>
  );
}

/** Reduced-motion: no scrub. Static poster + all beats stacked normally. */
function ReducedJourney({ c }: { c: Connect }) {
  const beats = [c.intro, c.bio[0], c.bio[1], c.now].filter(Boolean) as string[];
  return (
    <section className="relative overflow-hidden px-6 py-28 sm:px-12 sm:py-36">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% at 20% 110%, ${hexA(w.bg, 0.4)} 0%, transparent 55%), linear-gradient(180deg, #1a0c06, #0a0503)`,
        }}
      />
      <div className="relative mx-auto max-w-4xl">
        <motion.img
          layoutId="world-figurine"
          src={social.image}
          alt={social.alias}
          draggable={false}
          className="mb-8 h-[28vh] w-auto select-none object-contain"
          style={{ filter: `drop-shadow(0 0 60px ${hexA(w.bg, 0.4)})` }}
        />
        <p className="font-mono text-[11px] uppercase tracking-[0.5em]" style={{ color: w.bg }}>
          {c.eyebrow}
        </p>
        <h1 className="mt-3 font-display text-[clamp(3rem,12vw,9rem)] uppercase leading-[0.85] text-bone">
          {c.title}
        </h1>
        <div className="mt-10 space-y-8">
          {beats.map((t, i) => (
            <p key={i} className="font-display text-[clamp(1.5rem,4vw,3rem)] uppercase leading-[1.05] text-bone/90">
              {t}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * THE STATION — cat follower + info booth
 * ════════════════════════════════════════════════════════════════════ */

function StationSection({ c, lang }: { c: Connect; lang: string }) {
  const [open, setOpen] = useState(false);

  return (
    <section
      className="relative overflow-hidden px-6 pb-28 pt-24 sm:px-12 sm:pt-32"
      style={{
        background: `radial-gradient(130% 90% at 50% 120%, ${hexA(w.bg, 0.22)} 0%, transparent 60%), linear-gradient(180deg, #060302 0%, #0d0705 100%)`,
      }}
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em]" style={{ color: w.bg }}>
          {lang === 'es' ? '— Estación final' : '— Final station'}
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-[clamp(2rem,7vw,5rem)] uppercase leading-[0.9] text-bone">
          {lang === 'es' ? 'Bienvenido a la parada' : 'Welcome to the platform'}
        </h2>

        {/* Platform: cat + info booth */}
        <div className="relative mt-16 grid items-end gap-10 md:grid-cols-2">
          <CatFollower />

          <InfoBooth lang={lang} onOpen={() => setOpen(true)} />
        </div>

        {/* Platform floor line */}
        <div
          className="mt-2 h-px w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${hexA(w.bg, 0.5)}, transparent)` }}
        />
      </div>

      {/* Info panel */}
      <AnimatePresence>
        {open && <InfoPanel c={c} lang={lang} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </section>
  );
}

function CatFollower() {
  const fine = hasFinePointer();
  const reduced = prefersReducedMotion();
  const headRef = useRef<HTMLDivElement>(null);
  const [imgOk, setImgOk] = useState({ body: true, head: true });

  // Spring-smoothed head rotation + tiny translate.
  const rot = useSpring(0, { stiffness: 120, damping: 14, mass: 0.5 });
  const tx = useSpring(0, { stiffness: 120, damping: 16 });
  const ty = useSpring(0, { stiffness: 120, damping: 16 });

  useEffect(() => {
    if (reduced) return;

    // Touch / coarse pointer: gentle auto-sway instead of mouse tracking.
    if (!fine) {
      let raf = 0;
      const start = performance.now();
      const loop = (t: number) => {
        raf = requestAnimationFrame(loop);
        const s = Math.sin((t - start) / 900);
        rot.set(s * 10);
        tx.set(s * 4);
      };
      raf = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(raf);
    }

    const onMove = (e: MouseEvent) => {
      const el = headRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      // Clamp the tilt to ±18deg around the cat's resting "up" pose.
      const clamped = Math.max(-18, Math.min(18, angle * 0.2));
      rot.set(clamped);
      tx.set(Math.max(-6, Math.min(6, dx * 0.01)));
      ty.set(Math.max(-4, Math.min(4, dy * 0.01)));
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [fine, reduced, rot, tx, ty]);

  return (
    <div className="relative flex h-64 items-end justify-center md:justify-start">
      {/* Platform pedestal */}
      <div
        className="absolute bottom-0 left-1/2 h-3 w-48 -translate-x-1/2 rounded-full blur-md md:left-24"
        style={{ background: hexA(w.bg, 0.3) }}
      />

      <div className="relative" style={{ width: 180, height: 200 }}>
        {/* Body */}
        {imgOk.body ? (
          <img
            src={CAT_BODY_SRC}
            alt=""
            draggable={false}
            onError={() => setImgOk((s) => ({ ...s, body: false }))}
            className="absolute bottom-0 left-1/2 w-32 -translate-x-1/2 select-none object-contain"
          />
        ) : (
          <SvgCatBody />
        )}

        {/* Head — rotates toward the cursor */}
        <motion.div
          ref={headRef}
          style={{ rotate: rot, x: tx, y: ty }}
          className="absolute left-1/2 top-4 z-10 -translate-x-1/2"
        >
          {imgOk.head ? (
            <img
              src={CAT_HEAD_SRC}
              alt="cat"
              draggable={false}
              onError={() => setImgOk((s) => ({ ...s, head: false }))}
              className="w-20 select-none object-contain"
            />
          ) : (
            <SvgCatHead />
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* Pure-SVG cat fallbacks so the scene works without any image assets. */
function SvgCatHead() {
  return (
    <svg width="80" height="72" viewBox="0 0 80 72" aria-label="cat" role="img">
      <polygon points="12,4 30,26 6,30" fill={w.deep} />
      <polygon points="68,4 50,26 74,30" fill={w.deep} />
      <ellipse cx="40" cy="42" rx="30" ry="26" fill={w.bg} />
      <circle cx="29" cy="40" r="4" fill={w.ink} />
      <circle cx="51" cy="40" r="4" fill={w.ink} />
      <path d="M36 50 q4 4 8 0" stroke={w.ink} strokeWidth="2" fill="none" strokeLinecap="round" />
      <line x1="8" y1="46" x2="24" y2="48" stroke={w.ink} strokeWidth="1.5" opacity="0.6" />
      <line x1="72" y1="46" x2="56" y2="48" stroke={w.ink} strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}

function SvgCatBody() {
  return (
    <svg
      width="128"
      height="150"
      viewBox="0 0 128 150"
      className="absolute bottom-0 left-1/2 -translate-x-1/2"
      aria-hidden
    >
      <ellipse cx="64" cy="120" rx="46" ry="30" fill={w.panel} />
      <path d="M64 60 C40 60 36 110 40 130 L88 130 C92 110 88 60 64 60 Z" fill={w.bg} />
      <path d="M104 128 q22 -6 14 -34" stroke={w.deep} strokeWidth="10" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function InfoBooth({ lang, onOpen }: { lang: string; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: EASE }}
      whileHover={{ y: -4 }}
      className="group relative w-full overflow-hidden rounded-2xl border p-7 text-left backdrop-blur-sm"
      style={{
        borderColor: hexA(w.bg, 0.4),
        background: `linear-gradient(160deg, ${hexA(w.bg, 0.16)}, ${hexA(w.deep, 0.1)})`,
        boxShadow: `0 0 60px ${hexA(w.bg, 0.18)}`,
      }}
      data-cursor="hover"
    >
      {/* glow pulse */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl transition-opacity group-hover:opacity-80"
        style={{ background: hexA(w.bg, 0.4), opacity: 0.5 }}
      />
      <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: w.bg }}>
        <MapPin className="h-3.5 w-3.5" />
        {lang === 'es' ? 'Punto de información' : 'Information booth'}
      </span>
      <h3 className="mt-3 font-display text-[clamp(1.6rem,4vw,2.6rem)] uppercase leading-none text-bone">
        {lang === 'es' ? '¿Quién es Jandro?' : 'Who is Jandro?'}
      </h3>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-bone/60">
        {lang === 'es'
          ? 'Pulsa para abrir la ficha: datos, valores y cómo trabajo.'
          : 'Tap to open the file: facts, values and how I work.'}
      </p>
      <span className="mt-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider" style={{ color: w.bg }}>
        <Info className="h-4 w-4" />
        {lang === 'es' ? 'Abrir ficha' : 'Open file'}
      </span>
    </motion.button>
  );
}

function InfoPanel({ c, lang, onClose }: { c: Connect; lang: string; onClose: () => void }) {
  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        aria-label="close"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border p-7 sm:p-9"
        style={{
          borderColor: hexA(w.bg, 0.4),
          background: 'linear-gradient(180deg, #140a06, #0a0503)',
          boxShadow: `0 30px 120px ${hexA(w.deep, 0.6)}`,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: w.bg }}>
              {lang === 'es' ? 'Ficha' : 'File'}
            </p>
            <h3 className="mt-2 font-display text-3xl uppercase leading-none text-bone">
              {social.alias}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="close"
            className="rounded-full border p-2 text-bone/70 transition-colors hover:text-bone"
            style={{ borderColor: hexA(w.bg, 0.3) }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Facts */}
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: w.bg }}>
          {lang === 'es' ? 'Datos' : 'Facts'}
        </p>
        <dl className="mt-3 divide-y" style={{ borderColor: hexA(w.bg, 0.15) }}>
          {c.facts.map((f) => (
            <div key={f.k} className="flex items-baseline justify-between gap-6 py-3" style={{ borderColor: hexA(w.bg, 0.15) }}>
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50">{f.k}</dt>
              <dd className="text-right text-sm font-medium text-bone">{f.v}</dd>
            </div>
          ))}
        </dl>

        {/* Values */}
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: w.bg }}>
          {lang === 'es' ? 'Cómo trabajo' : 'How I work'}
        </p>
        <div className="mt-3 space-y-3">
          {c.values.map((v) => (
            <div
              key={v.label}
              className="rounded-xl border p-4"
              style={{ borderColor: hexA(w.bg, 0.2), background: hexA(w.bg, 0.06) }}
            >
              <p className="font-display text-lg uppercase leading-none text-bone">{v.label}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-bone/60">{v.note}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * CONTACT POSTER
 * ════════════════════════════════════════════════════════════════════ */

function ContactPoster({ c }: { c: Connect }) {
  return (
    <section className="relative overflow-hidden py-36 sm:py-48" style={{ background: w.bg }}>
      <div className="mx-auto max-w-6xl px-6 sm:px-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.4em]" style={{ color: w.ink, opacity: 0.6 }}>
          {c.cta.lead}
        </p>
        <motion.a
          href={SOCIALS[0].href}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-4 block break-words font-display text-[clamp(1.8rem,9vw,7rem)] uppercase leading-[0.85] transition-opacity hover:opacity-70"
          style={{ color: w.ink }}
          data-cursor="hover"
          data-cursor-label={c.cta.button}
        >
          {SOCIALS[0].handle}
        </motion.a>

        <div className="mt-10 flex items-center gap-3" style={{ color: w.ink }}>
          <Mail className="h-5 w-5 opacity-70" />
          <span className="font-mono text-xs uppercase tracking-wider opacity-70">{c.cta.button}</span>
        </div>

        <div className="mt-16 flex flex-wrap gap-8">
          {SOCIALS.slice(1).map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-sm uppercase tracking-wider underline underline-offset-4 transition-opacity hover:opacity-70"
              style={{ color: w.ink, opacity: 0.8 }}
            >
              {s.label}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 select-none font-display text-[clamp(12rem,40vw,36rem)] leading-none opacity-10"
        style={{ color: w.ink }}
      >
        01
      </span>
    </section>
  );
}
