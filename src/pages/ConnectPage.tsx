import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useSpring,
  AnimatePresence,
  type MotionValue,
} from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Info, Mail, ExternalLink, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CHARACTERS } from '@/data/characters';
import { SOCIALS } from '@/data/content';
import { useLanguage } from '@/hooks/useLanguage';
import PageShell from '@/components/layout/PageShell';
import { hexA, prefersReducedMotion, hasFinePointer } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const social = CHARACTERS[0];
const w = social.world;
const EASE = [0.16, 1, 0.3, 1] as const;

// ── Frame sequence ────────────────────────────────────────────────────────────
// Frames live in /public/frames/frame_0001.jpg … frame_0660.jpg
// (export from video: ffmpeg -i train.mp4 -vf fps=24 frames/frame_%04d.jpg)
const FRAME_COUNT: number = 660;
const FRAME_SRC = (i: number) =>
  `/frames/frame_${String(i + 1).padStart(4, '0')}.jpg`;

// Station scene backgrounds — served via Supabase CDN.
// Night version appears when the scroll locks; day swaps in via the toggle.
const NIGHT_BG = 'https://ttbejmwipmulrygesdgg.supabase.co/storage/v1/object/public/Photos/tren/estacion_noche.png';
const DAY_BG = 'https://ttbejmwipmulrygesdgg.supabase.co/storage/v1/object/public/Photos/tren/estacion_dia.png';

// ── Scroll latch ──────────────────────────────────────────────────────────────
// Accumulated upward scroll (px) required to release the lock.
const LATCH_THRESHOLD = 180;

// ── Interactive hotspot layout ────────────────────────────────────────────────
// Percentage positions relative to the fullscreen viewport.
// Tune to match your station image composition.
const BOOTH_STYLE  = { left: '51%', top: '28%', width: '17%', height: '50%' };
const SIGN_STYLE   = { left: '70%', top: '38%', width: '16%', height: '26%' };
const TOGGLE_STYLE = { right: '1.25rem', top: '68px' };

// ─────────────────────────────────────────────────────────────────────────────

type Connect = ReturnType<typeof useLanguage>['d']['connect'];

export default function ConnectPage() {
  const { d, lang } = useLanguage();
  const c = d.connect;
  const reduced = prefersReducedMotion();

  return (
    <PageShell character={social} background="#0a0503">
      {!reduced ? (
        <CanvasJourney c={c} lang={lang} />
      ) : (
        <ReducedJourney c={c} lang={lang} />
      )}
      <ContactPoster c={c} />
    </PageShell>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CANVAS JOURNEY — frame sequence + latch + interactive station overlay
// ════════════════════════════════════════════════════════════════════════════

function CanvasJourney({ c, lang }: { c: Connect; lang: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const lockedRef = useRef(false);
  const latchAccum = useRef(0);
  const curFrameRef = useRef(0);

  const [loadPct, setLoadPct] = useState(0);
  const [framesReady, setFramesReady] = useState(false);
  const [framesFailed, setFramesFailed] = useState(false);
  const [locked, setLocked] = useState(false);
  const [isDay, setIsDay] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [mouseX, setMouseX] = useState(0.5);

  // ── Scroll progress ────────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // ── Preload frames with concurrency limit of 16 ───────────────────────────
  useEffect(() => {
    if (FRAME_COUNT === 0) { setFramesFailed(true); return; }

    const imgs: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null);
    let settled = 0;
    let anyOk   = false;
    const CONCURRENCY = 16;
    let active = 0;
    let next   = 0;

    const done = () => {
      settled++;
      active--;
      setLoadPct(settled / FRAME_COUNT);
      if (settled === FRAME_COUNT) {
        framesRef.current = imgs;
        anyOk ? setFramesReady(true) : setFramesFailed(true);
      }
      pump();
    };

    const pump = () => {
      while (active < CONCURRENCY && next < FRAME_COUNT) {
        const idx = next++;
        active++;
        const img = new window.Image();
        img.onload  = () => { imgs[idx] = img; anyOk = true; done(); };
        img.onerror = () => done();
        img.src     = FRAME_SRC(idx);
      }
    };

    pump();
  }, []);

  // ── Canvas draw — object-fit: cover math ──────────────────────────────────
  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[idx];
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cw = canvas.width, ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const sw = img.naturalWidth * scale, sh = img.naturalHeight * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
  }, []);

  // ── Resize canvas to fill viewport (DPR-aware) ────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      if (framesReady) drawFrame(curFrameRef.current);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [framesReady, drawFrame]);

  // ── Scroll → frame + lock detection ──────────────────────────────────────
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (framesReady) {
      const idx = Math.min(Math.floor(p * FRAME_COUNT), FRAME_COUNT - 1);
      if (idx !== curFrameRef.current) {
        curFrameRef.current = idx;
        drawFrame(idx);
      }
    }
    if (p >= 0.999 && !lockedRef.current) {
      lockedRef.current = true;
      setLocked(true);
      latchAccum.current = 0;
    } else if (p < 0.995 && lockedRef.current) {
      lockedRef.current = false;
      setLocked(false);
      latchAccum.current = 0;
    }
  });

  // ── Wheel latch (must be non-passive to call preventDefault) ─────────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!lockedRef.current) return;
      e.preventDefault();
      if (e.deltaY < 0) {
        latchAccum.current += Math.abs(e.deltaY);
        if (latchAccum.current >= LATCH_THRESHOLD) {
          lockedRef.current = false;
          setLocked(false);
          latchAccum.current = 0;
        }
      } else {
        latchAccum.current = Math.max(0, latchAccum.current - e.deltaY * 0.5);
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  // ── Touch latch ───────────────────────────────────────────────────────────
  useEffect(() => {
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      if (!lockedRef.current) return;
      const dy = e.touches[0].clientY - startY;
      startY = e.touches[0].clientY;
      if (dy > 0) {
        latchAccum.current += dy;
        if (latchAccum.current >= LATCH_THRESHOLD) {
          lockedRef.current = false;
          setLocked(false);
          latchAccum.current = 0;
        }
      } else {
        e.preventDefault();
      }
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  // ── Derived motion values ──────────────────────────────────────────────────
  const cueOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0]);
  const vignetteO = useTransform(scrollYProgress, [0, 0.1, 0.85, 1], [0.55, 0.4, 0.4, 0.6]);
  const overlayOpacity = useTransform(scrollYProgress, [0.97, 1.0], [0, 1]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative" style={{ height: '1000vh' }}>
      <div className="sticky top-0 h-[100vh] w-full overflow-hidden">

        {/* Dark fallback — visible until frames load or on failure */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(120% 90% at 20% 110%, ${hexA(w.bg, 0.55)} 0%, transparent 55%),
              radial-gradient(100% 80% at 85% -10%, ${hexA(w.deep, 0.5)} 0%, transparent 50%),
              linear-gradient(180deg, #1a0c06 0%, #0a0503 55%, #060302 100%)`,
          }}
        >
          {framesFailed && <FallbackHorizon />}
        </div>

        {/* Canvas frame player */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{
            width: '100vw',
            height: '100vh',
            opacity: framesReady ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* Night station — fixed fullscreen, fades in as journey ends */}
        <motion.img
          src={NIGHT_BG}
          alt=""
          aria-hidden
          draggable={false}
          className="pointer-events-none select-none object-cover"
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 45,
            opacity: overlayOpacity,
          }}
        />

        {/* Day station — fixed, cross-fades on top when toggle is active */}
        <img
          src={DAY_BG}
          alt=""
          aria-hidden
          draggable={false}
          className="pointer-events-none select-none object-cover"
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 46,
            opacity: locked && isDay ? 1 : 0,
            transition: 'opacity 1.5s ease',
          }}
        />

        {/* Loading screen */}
        <AnimatePresence>
          {!framesReady && !framesFailed && (
            <motion.div
              key="loader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4"
              style={{ background: 'rgba(10,5,3,0.92)' }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: w.bg }}>
                {lang === 'es' ? 'Cargando trayecto' : 'Loading journey'}
              </p>
              <div className="h-px w-48 overflow-hidden bg-white/10">
                <div
                  className="h-full origin-left"
                  style={{
                    transform: `scaleX(${loadPct})`,
                    background: w.bg,
                    transition: 'transform 0.12s ease',
                  }}
                />
              </div>
              <p className="font-mono text-[10px] text-bone/30">
                {Math.round(loadPct * 100)} %
              </p>
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
        <div className="pointer-events-none absolute inset-0">
          <Beat progress={scrollYProgress} range={[0.0, 0.04, 0.16, 0.21]} align="center">
            <BeatIntro c={c} />
          </Beat>

          <Beat progress={scrollYProgress} range={[0.24, 0.29, 0.4, 0.46]} align="left">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: isDay ? '#d04f2f' : w.bg }}>
              {lang === 'es' ? 'El origen' : 'The origin'}
            </p>
            <p className={`mt-4 max-w-2xl font-display text-[clamp(1.8rem,5vw,4.4rem)] uppercase leading-[1.02] ${isDay ? 'text-slate-900' : 'text-bone'}`}>
              {c.bio[0]}
            </p>
          </Beat>

          <Beat progress={scrollYProgress} range={[0.49, 0.54, 0.65, 0.71]} align="right">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: isDay ? '#d04f2f' : w.bg }}>
              {lang === 'es' ? 'El recorrido' : 'The journey'}
            </p>
            <p className={`mt-4 max-w-2xl font-display text-[clamp(1.8rem,5vw,4.4rem)] uppercase leading-[1.02] ${isDay ? 'text-slate-900' : 'text-bone'}`}>
              {c.bio[1] ?? c.bio[0]}
            </p>
          </Beat>

          <Beat progress={scrollYProgress} range={[0.74, 0.79, 0.88, 0.93]} align="left">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: isDay ? '#d04f2f' : w.bg }}>
              {lang === 'es' ? 'Ahora mismo' : 'Right now'}
            </p>
            <p className={`mt-4 max-w-2xl font-display text-[clamp(1.8rem,5vw,4.4rem)] uppercase leading-[1.02] ${isDay ? 'text-slate-900' : 'text-bone'}`}>
              {c.now}
            </p>
          </Beat>

          <Beat progress={scrollYProgress} range={[0.87, 0.92, 0.97, 0.99]} align="center">
            <p className="font-mono text-[11px] uppercase tracking-[0.4em]" style={{ color: w.bg }}>
              {lang === 'es' ? 'Última parada' : 'Last stop'}
            </p>
            <h2 className={`mt-3 font-display text-[clamp(2.4rem,10vw,8rem)] uppercase leading-[0.85] ${isDay ? 'text-slate-900' : 'text-bone'}`}>
              {lang === 'es' ? 'Estación' : 'Station'}
            </h2>
          </Beat>
        </div>

        {/* Interactive station overlay — fixed fullscreen above station images */}
        <motion.div
          aria-hidden={!locked}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMouseX(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 47,
            opacity: overlayOpacity,
            pointerEvents: locked ? 'auto' : 'none',
          }}
        >
          {/* Info booth hotspot */}
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="group absolute"
            style={BOOTH_STYLE}
            aria-label={lang === 'es' ? 'Caseta de información' : 'Information booth'}
          >
            <span
              aria-hidden
              className="absolute inset-0 rounded-xl opacity-0 transition-all duration-300 group-hover:opacity-100"
              style={{
                background: hexA(w.bg, 0.1),
                boxShadow: `inset 0 0 0 1px ${hexA(w.bg, 0.5)}, 0 0 40px ${hexA(w.bg, 0.2)}`,
              }}
            />
            <span
              aria-hidden
              className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-1 font-mono text-[8px] uppercase tracking-[0.3em] opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
              style={{
                borderColor: hexA(w.bg, 0.5),
                background: 'rgba(0,0,0,0.55)',
                color: w.bg,
              }}
            >
              <Info className="h-2.5 w-2.5" />
              {lang === 'es' ? 'Información' : 'Info'}
            </span>
          </button>

          {/* Day / Night toggle */}
          <ThemeToggle
            isDay={isDay}
            onToggle={() => setIsDay((v) => !v)}
            lang={lang}
          />

        {/* Project sign — wooden plaque with hanging rope */}
        <Link
          to="/projects"
          className="group absolute flex flex-col items-center"
          style={SIGN_STYLE}
          aria-label={lang === 'es' ? 'Ir a proyectos' : 'Go to projects'}
        >
          <div
            aria-hidden
            className="mx-auto opacity-60"
            style={{
              width: 2,
              height: '12%',
              minHeight: 12,
              background: isDay ? '#8B6914' : '#b89442',
            }}
          />
          <div
            className="w-full rounded px-3 py-2 text-center transition-transform duration-300 group-hover:rotate-1 group-hover:scale-105"
            style={{
              background: isDay
                ? 'linear-gradient(160deg, #d4a843 0%, #a07830 100%)'
                : 'linear-gradient(160deg, #4a3010 0%, #2e1c08 100%)',
              boxShadow: `0 4px 20px rgba(0,0,0,0.6), inset 0 1px 0 ${isDay ? 'rgba(255,255,255,0.25)' : 'rgba(255,200,100,0.08)'}`,
              border: `2px solid ${isDay ? '#8B6914' : '#6b4820'}`,
            }}
          >
            <p
              className="font-mono leading-none"
              style={{
                fontSize: 'clamp(0.45rem, 0.7vw, 0.6rem)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: isDay ? '#3a1409' : '#c4a44e',
              }}
            >
              {lang === 'es' ? 'Siguiente parada' : 'Next stop'}
            </p>
            <p
              className="mt-1 font-display uppercase leading-none"
              style={{
                fontSize: 'clamp(0.65rem, 1.2vw, 0.9rem)',
                color: isDay ? '#5a2010' : '#e8d5a0',
              }}
            >
              /projects
            </p>
            <ArrowRight
              className="mx-auto mt-1"
              style={{
                width: 'clamp(0.55rem, 0.9vw, 0.75rem)',
                height: 'clamp(0.55rem, 0.9vw, 0.75rem)',
                color: isDay ? '#7a3010' : '#c4a44e',
              }}
            />
          </div>
        </Link>

        {/* Cat video — scrubbed by horizontal mouse position */}
        <div
          className="pointer-events-none absolute"
          style={{ left: '46%', top: '64%', width: '8%', height: '14%' }}
        >
          <CatVideoFollower mouseX={mouseX} isDay={isDay} />
        </div>

        {/* Latch release hint */}
        <AnimatePresence>
          {locked && (
            <motion.p
              key="latch-hint"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.35em] text-bone/35"
            >
              ↑ {lang === 'es' ? 'sube para desandar el camino' : 'scroll up to retrace'}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Scroll cue */}
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

      {/* Thin progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5">
        <motion.div
          className="h-full origin-left"
          style={{ scaleX: scrollYProgress, background: w.bg }}
        />
      </div>
    </div>

      {/* Info panel modal — lives outside the sticky div so z-index works */ }
  <AnimatePresence>
    {panelOpen && (
      <InfoPanel c={c} lang={lang} isDay={isDay} onClose={() => setPanelOpen(false)} />
    )}
  </AnimatePresence>
    </div >
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CAT VIDEO FOLLOWER — video scrubbed by horizontal mouse position
// ════════════════════════════════════════════════════════════════════════════

function CatVideoFollower({ mouseX, isDay }: { mouseX: number; isDay: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const fine = hasFinePointer();
  const reduced = prefersReducedMotion();

  const rot = useSpring(0, { stiffness: 120, damping: 14, mass: 0.5 });
  const tx = useSpring(0, { stiffness: 120, damping: 16 });
  const ty = useSpring(0, { stiffness: 120, damping: 16 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoError || !videoLoaded) return;
    const duration = video.duration || 1;
    video.currentTime = mouseX * duration;
  }, [mouseX, videoError, videoLoaded]);

  useEffect(() => {
    if (reduced || !videoError) return;
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
      const el = fallbackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      rot.set(Math.max(-18, Math.min(18, angle * 0.2)));
      tx.set(Math.max(-6, Math.min(6, dx * 0.01)));
      ty.set(Math.max(-4, Math.min(4, dy * 0.01)));
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [fine, reduced, videoError, rot, tx, ty]);

  if (videoError) {
    return (
      <motion.div
        ref={fallbackRef}
        style={{ rotate: rot, x: tx, y: ty }}
        className="flex h-full w-full select-none items-center justify-center"
      >
        {/* Inline SVG cat — shown when /cat.mp4 is unavailable */}
        <svg viewBox="0 0 80 72" width="100%" height="100%" aria-label="cat" role="img"
          style={{ filter: isDay ? 'none' : 'brightness(1.15)' }}>
          <path d="M8 36 L8 12 L22 24 L40 18 L58 24 L72 12 L72 36 Q72 60 40 66 Q8 60 8 36Z"
            fill={isDay ? '#c8a87a' : '#8b6f47'} />
          <ellipse cx="28" cy="34" rx="6" ry="7" fill={isDay ? '#3a2010' : '#1a0c06'} />
          <ellipse cx="52" cy="34" rx="6" ry="7" fill={isDay ? '#3a2010' : '#1a0c06'} />
          <ellipse cx="28" cy="34" rx="2.5" ry="4" fill={isDay ? '#7a5c2e' : '#c8a020'} />
          <ellipse cx="52" cy="34" rx="2.5" ry="4" fill={isDay ? '#7a5c2e' : '#c8a020'} />
          <path d="M34 44 Q40 48 46 44" stroke={isDay ? '#5a3010' : '#c8a87a'} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <circle cx="40" cy="43" r="2" fill={isDay ? '#e0a0a0' : '#f0b0b0'} />
          <path d="M22 42 L14 40 M22 44 L13 44 M22 46 L14 48" stroke={isDay ? '#8b6f47' : '#c8a87a'} strokeWidth="1" strokeLinecap="round" />
          <path d="M58 42 L66 40 M58 44 L67 44 M58 46 L66 48" stroke={isDay ? '#8b6f47' : '#c8a87a'} strokeWidth="1" strokeLinecap="round" />
        </svg>
      </motion.div>
    );
  }

  return (
    <div className="h-full w-full">
      <video
        ref={videoRef}
        src="/cat.mp4"
        playsInline
        muted
        preload="auto"
        onLoadedMetadata={() => setVideoLoaded(true)}
        onError={() => setVideoError(true)}
        className="h-full w-full object-contain"
        style={{ display: videoLoaded ? 'block' : 'none' }}
      />
      {!videoLoaded && !videoError && (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: `${w.bg}88`, borderTopColor: 'transparent' }} />
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// FALLBACK HORIZON — shown when frame sequence is missing / undecodable
// ════════════════════════════════════════════════════════════════════════════

function FallbackHorizon() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute left-1/2 top-[52%] h-[34vmin] w-[34vmin] -translate-x-1/2 rounded-full blur-[2px]"
        style={{
          background: `radial-gradient(circle, ${hexA(w.panel, 0.9)} 0%, ${hexA(w.bg, 0.4)} 45%, transparent 70%)`,
        }}
      />
      <div className="absolute left-0 right-0 top-[62%] h-px" style={{ background: hexA(w.bg, 0.4) }} />
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

// ════════════════════════════════════════════════════════════════════════════
// BEAT INTRO — first text overlay
// ════════════════════════════════════════════════════════════════════════════

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

// ════════════════════════════════════════════════════════════════════════════
// BEAT — scroll-windowed text that fades in then out
// ════════════════════════════════════════════════════════════════════════════

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
    align === 'left' ? 'justify-start text-left' :
      align === 'right' ? 'justify-end text-right' :
        'justify-center text-center';

  return (
    <motion.div
      style={{ opacity, y, x }}
      className={`absolute inset-0 flex items-center px-6 sm:px-16 ${justify}`}
    >
      <div className="w-full max-w-4xl">{children}</div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// REDUCED JOURNEY — static layout for prefers-reduced-motion
// ════════════════════════════════════════════════════════════════════════════

function ReducedJourney({ c, lang }: { c: Connect; lang: string }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const beats = [c.bio[0], c.bio[1], c.now].filter(Boolean) as string[];

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

        <div className="mt-16 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 font-mono text-xs uppercase tracking-wider transition-opacity hover:opacity-80"
            style={{ borderColor: hexA(w.bg, 0.4), color: w.bg, background: hexA(w.bg, 0.08) }}
          >
            <Info className="h-3.5 w-3.5" />
            {lang === 'es' ? 'Abrir ficha' : 'Open file'}
          </button>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 font-mono text-xs uppercase tracking-wider text-bone/70 transition-opacity hover:opacity-80"
            style={{ borderColor: hexA(w.bg, 0.25), background: hexA(w.bg, 0.04) }}
          >
            <ArrowRight className="h-3.5 w-3.5" />
            /projects
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {panelOpen && <InfoPanel c={c} lang={lang} isDay={false} onClose={() => setPanelOpen(false)} />}
      </AnimatePresence>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// INFO PANEL MODAL
// ════════════════════════════════════════════════════════════════════════════

function InfoPanel({ c, lang, isDay, onClose }: { c: Connect; lang: string; isDay: boolean; onClose: () => void }) {
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
        className={`absolute inset-0 backdrop-blur-sm transition-colors duration-300 ${isDay ? 'bg-slate-900/40' : 'bg-black/70'}`}
      />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border p-7 sm:p-9 transition-all duration-300"
        style={{
          borderColor: isDay ? 'rgba(15, 23, 42, 0.15)' : hexA(w.bg, 0.4),
          background: isDay ? 'linear-gradient(180deg, #ffffff, #f8fafc)' : 'linear-gradient(180deg, #140a06, #0a0503)',
          boxShadow: isDay
            ? '0 30px 60px -15px rgba(15, 23, 42, 0.15)'
            : `0 30px 120px ${hexA(w.deep, 0.6)}`,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: isDay ? '#d04f2f' : w.bg }}>
              {lang === 'es' ? 'Ficha' : 'File'}
            </p>
            <h3 className={`mt-2 font-display text-3xl uppercase leading-none ${isDay ? 'text-slate-900' : 'text-bone'}`}>
              {social.alias}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="close"
            className={`rounded-full border p-2 transition-colors ${isDay ? 'text-slate-500 hover:text-slate-900' : 'text-bone/70 hover:text-bone'}`}
            style={{ borderColor: isDay ? 'rgba(15, 23, 42, 0.15)' : hexA(w.bg, 0.3) }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: w.bg }}>
          {lang === 'es' ? 'Datos' : 'Facts'}
        </p>
        <dl className="mt-3 divide-y" style={{ borderColor: isDay ? 'rgba(15, 23, 42, 0.08)' : hexA(w.bg, 0.15) }}>
          {c.facts.map((f) => (
            <div
              key={f.k}
              className="flex items-baseline justify-between gap-6 py-3"
              style={{ borderColor: hexA(w.bg, 0.15) }}
            >
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-bone/50">{f.k}</dt>
              <dd className="text-right text-sm font-medium text-bone">{f.v}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: w.bg }}>
          {lang === 'es' ? 'Cómo trabajo' : 'How I work'}
        </p>
        <div className="mt-3 space-y-3">
          {c.values.map((v) => (
            <div
              key={v.label}
              className="rounded-xl border p-4"
              style={{
                borderColor: isDay ? 'rgba(15, 23, 42, 0.08)' : hexA(w.bg, 0.2),
                background: isDay ? 'rgba(15, 23, 42, 0.02)' : hexA(w.bg, 0.06),
              }}
            >
              <p className={`font-display text-lg uppercase leading-none ${isDay ? 'text-slate-900' : 'text-bone'}`}>{v.label}</p>
              <p className={`mt-1.5 text-sm leading-relaxed ${isDay ? 'text-slate-600' : 'text-bone/60'}`}>{v.note}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: isDay ? '#d04f2f' : w.bg }}>
          {lang === 'es' ? 'Contacto' : 'Contact'}
        </p>
        <div className="mt-3 space-y-4">
          <div
            className="rounded-xl border p-5 transition-colors duration-300"
            style={{
              borderColor: isDay ? 'rgba(15, 23, 42, 0.08)' : hexA(w.bg, 0.25),
              background: isDay ? 'rgba(15, 23, 42, 0.02)' : hexA(w.bg, 0.06),
            }}
          >
            <p className={`font-mono text-[10px] uppercase tracking-wider ${isDay ? 'text-slate-500' : 'text-bone/50'}`}>
              {c.cta.lead}
            </p>
            <a
              href={SOCIALS[0].href}
              className={`mt-2 block break-words font-display text-2xl uppercase hover:opacity-85 transition-opacity ${isDay ? 'text-slate-900' : 'text-bone'}`}
            >
              {SOCIALS[0].handle}
            </a>
            <div className={`mt-4 flex items-center gap-2 font-mono text-xs ${isDay ? 'text-slate-600' : 'text-bone/70'}`}>
              <Mail className="h-4 w-4 text-[#f26d4b]" />
              <span>{c.cta.button}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            {SOCIALS.slice(1).map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider underline underline-offset-4 hover:opacity-75 transition-opacity ${isDay ? 'text-slate-700' : 'text-bone/80'}`}
              >
                {s.label}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CONTACT POSTER — below the canvas section, accessible after unlatch
// ════════════════════════════════════════════════════════════════════════════

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
