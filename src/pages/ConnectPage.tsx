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
import { ArrowDownRight, Mail, ExternalLink, Info, X, MapPin, Sun, Moon } from 'lucide-react';
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
  const [isDay, setIsDay] = useState(false);

  if (reduced) {
    return (
      <PageShell character={social} background="#0a0503">
        <ReducedJourney c={c} />
        <StationSection c={c} lang={lang} />
        <ContactPoster c={c} />
      </PageShell>
    );
  }

  return (
    <PageShell character={social} background={isDay ? '#eef2f7' : '#0a0503'}>
      <ScrollVideo c={c} lang={lang} isDay={isDay} setIsDay={setIsDay} />
    </PageShell>
  );
}

type Connect = ReturnType<typeof useLanguage>['d']['connect'];

/* ════════════════════════════════════════════════════════════════════
 * SCROLL-SCRUBBED VIDEO JOURNEY
 * ════════════════════════════════════════════════════════════════════ */

// Helper to limit concurrency of async tasks
async function limitConcurrency<T>(
  concurrency: number,
  items: T[],
  fn: (item: T, index: number) => Promise<void>
) {
  const promises: Promise<void>[] = [];
  const active = new Set<Promise<void>>();
  for (let i = 0; i < items.length; i++) {
    const p = fn(items[i], i).then(() => {
      active.delete(p);
    });
    promises.push(p);
    active.add(p);
    if (active.size >= concurrency) {
      await Promise.race(active);
    }
  }
  await Promise.all(promises);
}

function ScrollVideo({
  c,
  lang,
  isDay,
  setIsDay,
}: {
  c: Connect;
  lang: string;
  isDay: boolean;
  setIsDay: (v: boolean) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [showOverlays, setShowOverlays] = useState(false);

  const frameCount = 660;
  const lastDrawnIndex = useRef(-1);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 1 });

  // Progress indicators and vignettes scaled to the smooth scroll progress
  const cueOpacity = useTransform(smoothProgress, [0, 0.04], [1, 0]);
  const vignetteO = useTransform(smoothProgress, [0, 0.1, 0.85, 1], [0.55, 0.4, 0.4, 0.7]);
  
  // Fade in the static train end image (night) at the end of the journey (progress 0.95 to 0.98)
  const staticImageOpacity = useTransform(smoothProgress, [0.95, 0.98], [0, 1]);
  const overlaysOpacity = useTransform(smoothProgress, [0.95, 0.98], [0, 1]);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img) return;

    if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    lastDrawnIndex.current = index;
  };

  useEffect(() => {
    let active = true;
    let loadedCount = 0;
    const indices = Array.from({ length: frameCount }, (_, i) => i + 1);

    const loadFrame = (i: number, index: number): Promise<void> => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = `/frames/frame_${String(i).padStart(4, '0')}.jpg`;
        img.onload = () => {
          if (active) {
            imagesRef.current[index] = img;
            loadedCount++;
            setImagesLoaded(loadedCount);
            if (index === 0) {
              drawFrame(0);
            }
          }
          resolve();
        };
        img.onerror = () => {
          if (active) {
            loadedCount++;
            setImagesLoaded(loadedCount);
          }
          resolve();
        };
      });
    };

    const startPreload = async () => {
      await Promise.all([loadFrame(1, 0), loadFrame(660, 659)]);
      if (active) {
        drawFrame(0);
      }

      const remainingIndices = indices.filter((i) => i !== 1 && i !== 660);
      await limitConcurrency(16, remainingIndices, async (i) => {
        await loadFrame(i, i - 1);
      });

      if (active) {
        setIsReady(true);
      }
    };

    startPreload();

    return () => {
      active = false;
    };
  }, []);

  useMotionValueEvent(smoothProgress, 'change', (p) => {
    const index = Math.max(0, Math.min(frameCount - 1, Math.floor(p * frameCount)));
    if (index !== lastDrawnIndex.current) {
      drawFrame(index);
    }
  });

  useEffect(() => {
    if (isReady) {
      const p = smoothProgress.get();
      const index = Math.max(0, Math.min(frameCount - 1, Math.floor(p * frameCount)));
      drawFrame(index);
    }
  }, [isReady]);

  useMotionValueEvent(smoothProgress, 'change', (p) => {
    if (p >= 0.95 && !showOverlays) {
      setShowOverlays(true);
    } else if (p < 0.95 && showOverlays) {
      setShowOverlays(false);
    }
  });

  return (
    <div ref={containerRef} className="relative" style={{ height: '1000vh' }}>
      {/* Fixed background for the entire page scroll (remains behind StationSection and ContactPoster) */}
      <div className="fixed inset-0 w-full h-[100vh] overflow-hidden bg-[#0a0503] z-0 pointer-events-none">
        {/* Canvas container representing the journey */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-contain"
          style={{ opacity: isReady ? 1 : 0, transition: 'opacity 0.5s ease' }}
        />

        {/* High-res static image overlay (Night) that covers the canvas when the train stops */}
        {isReady && (
          <motion.img
            src="/station_end.jpg"
            alt="Estación"
            className="absolute inset-0 h-full w-full object-contain"
            style={{ opacity: staticImageOpacity, pointerEvents: 'none' }}
          />
        )}

        {/* High-res static image overlay (Day) that crossfades over the night background */}
        {isReady && (
          <motion.img
            src="/station_day.jpg"
            alt="Estación de Día"
            className="absolute inset-0 h-full w-full object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: isDay ? 1 : 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            style={{ pointerEvents: 'none' }}
          />
        )}
      </div>

      <div className="sticky top-0 h-[100vh] w-full overflow-hidden z-10 pointer-events-none">
        {/* Loading Overlay */}
        <AnimatePresence>
          {!isReady && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0503] z-50 pointer-events-auto"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.5em] mb-4 text-[#f26d4b]">
                  {lang === 'es' ? 'Cargando viaje...' : 'Loading journey...'}
                </p>
                <div className="h-1 w-48 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#f26d4b]"
                    style={{ width: `${(imagesLoaded / frameCount) * 100}%` }}
                  />
                </div>
              </motion.div>
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

        {/* Text beats — using the full scroll progress ranges */}
        <div className="absolute inset-0 pointer-events-none">
          <Beat progress={smoothProgress} range={[0.0, 0.04, 0.16, 0.21]} align="center">
            <BeatIntro c={c} />
          </Beat>

          <Beat progress={smoothProgress} range={[0.24, 0.29, 0.4, 0.46]} align="left">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: isDay ? '#d04f2f' : w.bg }}>
              {lang === 'es' ? 'El origen' : 'The origin'}
            </p>
            <p className={`mt-4 max-w-2xl font-display text-[clamp(1.8rem,5vw,4.4rem)] uppercase leading-[1.02] ${isDay ? 'text-slate-900' : 'text-bone'}`}>
              {c.bio[0]}
            </p>
          </Beat>

          <Beat progress={smoothProgress} range={[0.49, 0.54, 0.65, 0.71]} align="right">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: isDay ? '#d04f2f' : w.bg }}>
              {lang === 'es' ? 'El recorrido' : 'The journey'}
            </p>
            <p className={`mt-4 max-w-2xl font-display text-[clamp(1.8rem,5vw,4.4rem)] uppercase leading-[1.02] ${isDay ? 'text-slate-900' : 'text-bone'}`}>
              {c.bio[1] ?? c.bio[0]}
            </p>
          </Beat>

          <Beat progress={smoothProgress} range={[0.74, 0.79, 0.88, 0.93]} align="left">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: isDay ? '#d04f2f' : w.bg }}>
              {lang === 'es' ? 'Ahora mismo' : 'Right now'}
            </p>
            <p className={`mt-4 max-w-2xl font-display text-[clamp(1.8rem,5vw,4.4rem)] uppercase leading-[1.02] ${isDay ? 'text-slate-900' : 'text-bone'}`}>
              {c.now}
            </p>
          </Beat>

          <Beat progress={smoothProgress} range={[0.91, 0.93, 0.95, 0.97]} align="center">
            <p className="font-mono text-[11px] uppercase tracking-[0.4em]" style={{ color: isDay ? '#d04f2f' : w.bg }}>
              {lang === 'es' ? 'Última parada' : 'Last stop'}
            </p>
            <h2 className={`mt-3 font-display text-[clamp(2.4rem,10vw,8rem)] uppercase leading-[0.85] ${isDay ? 'text-slate-900' : 'text-bone'}`}>
              {lang === 'es' ? 'Estación' : 'Station'}
            </h2>
            <p className={`mt-4 inline-flex items-center gap-2 font-mono text-xs ${isDay ? 'text-slate-500' : 'text-bone/60'}`}>
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
            style={{ scaleX: smoothProgress, background: w.bg }}
          />
        </div>
      </div>

      {/* Floating Day/Night Toggle (visible when overlays are active) */}
      {showOverlays && (
        <div className="fixed top-6 right-6 z-30 pointer-events-auto">
          <DayNightToggle isDay={isDay} setIsDay={setIsDay} lang={lang} />
        </div>
      )}

      {/* Interactive overlays at the end of the journey */}
      <motion.div
        style={{ opacity: overlaysOpacity }}
        className={`absolute inset-0 z-20 ${showOverlays ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        {showOverlays && (
          <InteractiveStation
            isDay={isDay}
            setIsDay={setIsDay}
            lang={lang}
            onOpenInfo={() => setOpenInfo(true)}
          />
        )}
      </motion.div>

      {/* Info panel popup */}
      <AnimatePresence>
        {openInfo && (
          <InfoPanel
            c={c}
            lang={lang}
            onClose={() => setOpenInfo(false)}
            isDay={isDay}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/** Layered horizon used inside the fallback so the page never looks empty. */
function FallbackHorizon() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute left-1/2 top-[52%] h-[34vmin] w-[34vmin] -translate-x-1/2 rounded-full blur-[2px]"
        style={{ background: `radial-gradient(circle, ${hexA(w.panel, 0.9)} 0%, ${hexA(w.bg, 0.4)} 45%, transparent 70%)` }}
      />
      <div
        className="absolute left-0 right-0 top-[62%] h-px"
        style={{ background: hexA(w.bg, 0.4) }}
      />
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

function DayNightToggle({
  isDay,
  setIsDay,
  lang,
}: {
  isDay: boolean;
  setIsDay: (v: boolean) => void;
  lang: string;
}) {
  return (
    <button
      type="button"
      onClick={() => setIsDay(!isDay)}
      className="group relative flex h-10 w-20 cursor-pointer items-center rounded-full p-1 transition-colors duration-500 ease-in-out focus:outline-none"
      style={{
        background: isDay ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.08)',
        border: isDay ? '1px solid rgba(15, 23, 42, 0.15)' : '1px solid rgba(242, 109, 75, 0.3)',
        boxShadow: isDay ? 'none' : `0 0 15px ${hexA(w.bg, 0.2)}`,
      }}
      aria-label={lang === 'es' ? 'Cambiar modo de día/noche' : 'Toggle day/night mode'}
    >
      <motion.div
        className="z-10 flex h-8 w-8 items-center justify-center rounded-full shadow-md"
        animate={{ x: isDay ? 40 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          background: isDay ? '#f26d4b' : '#1e1b4b',
        }}
      >
        {isDay ? (
          <Sun className="h-4 w-4 text-white" />
        ) : (
          <Moon className="h-4 w-4 text-amber-300" />
        )}
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none text-slate-400">
        <Moon className={`h-4 w-4 transition-opacity duration-300 ${isDay ? 'opacity-40 text-slate-600' : 'opacity-0'}`} />
        <Sun className={`h-4 w-4 transition-opacity duration-300 ${isDay ? 'opacity-0' : 'opacity-40 text-amber-500/50'}`} />
      </div>
    </button>
  );
}

function CatVideoFollower({ mouseX, isDay }: { mouseX: number; isDay: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const fine = hasFinePointer();
  const reduced = prefersReducedMotion();
  const fallbackRef = useRef<HTMLDivElement>(null);
  
  const rot = useSpring(0, { stiffness: 120, damping: 14, mass: 0.5 });
  const tx = useSpring(0, { stiffness: 120, damping: 16 });
  const ty = useSpring(0, { stiffness: 120, damping: 16 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoError || !videoLoaded) return;
    
    const duration = video.duration || 1;
    const targetTime = mouseX * duration;
    video.currentTime = targetTime;
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
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const clamped = Math.max(-18, Math.min(18, angle * 0.2));
      rot.set(clamped);
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
        style={{
          rotate: rot,
          x: tx,
          y: ty,
          mixBlendMode: 'multiply',
          filter: isDay ? 'none' : 'brightness(1.1) contrast(1.1)',
        }}
        className="w-full h-full select-none"
      >
        <img
          src="/cat_fallback.jpg"
          alt="Gato de fieltro"
          draggable={false}
          className="w-full h-full object-contain"
        />
      </motion.div>
    );
  }

  return (
    <div className="w-full h-full">
      <video
        ref={videoRef}
        src="/cat.mp4"
        playsInline
        muted
        preload="auto"
        onLoadedMetadata={() => setVideoLoaded(true)}
        onError={() => setVideoError(true)}
        className="w-full h-full object-contain"
        style={{ display: videoLoaded ? 'block' : 'none' }}
      />
      {!videoLoaded && (
        <div className="w-full h-full bg-transparent flex items-center justify-center">
          <div className="h-4 w-4 rounded-full border-2 border-[#f26d4b] border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  );
}

function InteractiveStation({
  isDay,
  setIsDay,
  lang,
  onOpenInfo,
}: {
  isDay: boolean;
  setIsDay: (v: boolean) => void;
  lang: string;
  onOpenInfo: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(0.5);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    setMouseX(Math.max(0, Math.min(1, x)));
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <div className="relative aspect-video w-full h-full max-w-[177.78vh] max-h-[56.25vw] pointer-events-auto overflow-hidden">
        <button
          type="button"
          onClick={onOpenInfo}
          className="absolute cursor-pointer border border-dashed border-transparent hover:border-white/40 rounded-lg transition-colors group z-10"
          style={{
            left: '54%',
            top: '36%',
            width: '18%',
            height: '35%',
          }}
          aria-label={lang === 'es' ? 'Abrir información de Jandro' : 'Open Jandro info'}
          data-cursor="hover"
        >
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/85 text-white font-mono text-[10px] uppercase tracking-wider py-1.5 px-3 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20">
            {lang === 'es' ? 'Ficha de Información (Pulsar)' : 'Information File (Click)'}
          </div>
        </button>

        <div
          className="absolute"
          style={{
            left: '46%',
            top: '64%',
            width: '8%',
            height: '14%',
          }}
        >
          <CatVideoFollower mouseX={mouseX} isDay={isDay} />
        </div>

        <a
          href="/projects"
          className="absolute flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 group z-10 select-none"
          style={{
            left: '76%',
            top: '45%',
            width: '16%',
            height: '18%',
            border: isDay ? '2px solid #475569' : '2px solid #f26d4b',
            background: isDay 
              ? 'linear-gradient(135deg, #ffffff, #f1f5f9)' 
              : 'rgba(242, 109, 75, 0.05)',
            boxShadow: isDay
              ? '0 6px 12px -2px rgba(15, 23, 42, 0.12), 0 3px 6px -3px rgba(15, 23, 42, 0.08)'
              : '0 0 20px rgba(242, 109, 75, 0.25), inset 0 0 10px rgba(242, 109, 75, 0.15)',
          }}
          data-cursor="hover"
        >
          {/* Hanging Chains */}
          <div 
            className="absolute top-0 left-[20%] w-[2px] h-[30px] -translate-y-full transition-colors duration-300"
            style={{ backgroundColor: isDay ? '#475569' : '#f26d4b' }}
          />
          <div 
            className="absolute top-0 right-[20%] w-[2px] h-[30px] -translate-y-full transition-colors duration-300"
            style={{ backgroundColor: isDay ? '#475569' : '#f26d4b' }}
          />
          
          <span 
            className={`font-mono text-[9px] uppercase tracking-[0.2em] font-semibold ${isDay ? 'text-slate-500' : 'text-[#f26d4b]'}`}
            style={{
              textShadow: isDay ? 'none' : '0 0 8px rgba(242, 109, 75, 0.6)',
            }}
          >
            {lang === 'es' ? 'Siguiente Parada' : 'Next Stop'}
          </span>
          <span className={`font-display text-sm md:text-base uppercase tracking-wider font-bold group-hover:scale-105 transition-transform mt-1.5 ${isDay ? 'text-slate-800 group-hover:text-[#d04f2f]' : 'text-bone group-hover:text-[#ff8d6f]'}`}>
            {lang === 'es' ? 'Proyectos ➔' : 'Projects ➔'}
          </span>
        </a>
      </div>
    </div>
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

        <div className="relative mt-16 grid items-end gap-10 md:grid-cols-2">
          <CatFollower />

          <InfoBooth lang={lang} onOpen={() => setOpen(true)} />
        </div>

        <div
          className="mt-2 h-px w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${hexA(w.bg, 0.5)}, transparent)` }}
        />
      </div>
    </section>
  );
}

function CatFollower() {
  const fine = hasFinePointer();
  const reduced = prefersReducedMotion();
  const headRef = useRef<HTMLDivElement>(null);
  const [imgOk, setImgOk] = useState({ body: true, head: true });

  const rot = useSpring(0, { stiffness: 120, damping: 14, mass: 0.5 });
  const tx = useSpring(0, { stiffness: 120, damping: 16 });
  const ty = useSpring(0, { stiffness: 120, damping: 16 });

  useEffect(() => {
    if (reduced) return;

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
      <div
        className="absolute bottom-0 left-1/2 h-3 w-48 -translate-x-1/2 rounded-full blur-md md:left-24"
        style={{ background: hexA(w.bg, 0.3) }}
      />

      <div className="relative" style={{ width: 180, height: 200 }}>
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

function InfoPanel({ c, lang, onClose, isDay }: { c: Connect; lang: string; onClose: () => void; isDay: boolean }) {
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

        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: isDay ? '#d04f2f' : w.bg }}>
          {lang === 'es' ? 'Datos' : 'Facts'}
        </p>
        <dl className="mt-3 divide-y" style={{ borderColor: isDay ? 'rgba(15, 23, 42, 0.08)' : hexA(w.bg, 0.15) }}>
          {c.facts.map((f) => (
            <div key={f.k} className="flex items-baseline justify-between gap-6 py-3" style={{ borderColor: isDay ? 'rgba(15, 23, 42, 0.08)' : hexA(w.bg, 0.15) }}>
              <dt className={`font-mono text-[11px] uppercase tracking-[0.2em] ${isDay ? 'text-slate-500' : 'text-bone/50'}`}>{f.k}</dt>
              <dd className={`text-right text-sm font-medium ${isDay ? 'text-slate-900' : 'text-bone'}`}>{f.v}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: isDay ? '#d04f2f' : w.bg }}>
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
