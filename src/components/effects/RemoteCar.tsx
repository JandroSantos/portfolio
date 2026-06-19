import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Gauge, X } from 'lucide-react';
import { useWorld } from '@/hooks/useWorld';
import { useLanguage } from '@/hooks/useLanguage';
import { on } from '@/lib/bus';

interface Mark {
  id: number;
  x: number;
  y: number;
  a: number;
}

/**
 * The hidden RC car. Summoned with the terminal `drive` command (or
 * the Shift+D hotkey). A top-down arcade car you steer around the whole
 * page with WASD / arrows — complete with headlights, exhaust puffs and
 * skid marks that bleed onto the screen. ESC parks it.
 */
export default function RemoteCar() {
  const { character } = useWorld();
  const { d } = useLanguage();
  const [active, setActive] = useState(false);
  const carRef = useRef<HTMLDivElement>(null);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [speedHud, setSpeedHud] = useState(0);

  // Physics state lives in a ref so the rAF loop never re-renders React.
  const phys = useRef({
    x: 0,
    y: 0,
    angle: -Math.PI / 2, // pointing up
    speed: 0,
  });
  const keys = useRef<Record<string, boolean>>({});
  const markId = useRef(0);

  // Summon via bus or Shift+D.
  useEffect(() => {
    const offBus = on('drive', () => setActive(true));
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t?.tagName === 'INPUT' || t?.tagName === 'TEXTAREA') return;
      if (e.shiftKey && e.key.toLowerCase() === 'd') setActive(true);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      offBus();
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  // Drive loop.
  useEffect(() => {
    if (!active) return;

    // Spawn from bottom-center.
    phys.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight - 120,
      angle: -Math.PI / 2,
      speed: 0,
    };

    const down = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActive(false);
        return;
      }
      keys.current[e.key.toLowerCase()] = true;
      // Prevent the page from scrolling while driving.
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase()))
        e.preventDefault();
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', down, { passive: false });
    window.addEventListener('keyup', up);

    const ACCEL = 0.45;
    const MAX = 13;
    const FRICTION = 0.94;
    const STEER = 0.055;
    let raf = 0;
    let frame = 0;

    const loop = () => {
      const p = phys.current;
      const k = keys.current;
      const fwd = k['w'] || k['arrowup'];
      const back = k['s'] || k['arrowdown'];
      const left = k['a'] || k['arrowleft'];
      const right = k['d'] || k['arrowright'];
      const brake = k[' '];

      if (fwd) p.speed += ACCEL;
      if (back) p.speed -= ACCEL * 0.8;
      p.speed *= brake ? 0.82 : FRICTION;
      p.speed = Math.max(-MAX * 0.5, Math.min(MAX, p.speed));

      const steerInput = (left ? -1 : 0) + (right ? 1 : 0);
      // Steering scales with speed and reverses when going backwards.
      const grip = Math.min(1, Math.abs(p.speed) / 3);
      p.angle += steerInput * STEER * grip * Math.sign(p.speed || 1);

      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;

      // Keep the car on screen with a soft bounce.
      const pad = 30;
      if (p.x < pad) { p.x = pad; p.speed *= 0.5; }
      if (p.x > window.innerWidth - pad) { p.x = window.innerWidth - pad; p.speed *= 0.5; }
      if (p.y < pad + 40) { p.y = pad + 40; p.speed *= 0.5; }
      if (p.y > window.innerHeight - pad) { p.y = window.innerHeight - pad; p.speed *= 0.5; }

      if (carRef.current) {
        carRef.current.style.transform = `translate(-50%, -50%) translate(${p.x}px, ${p.y}px) rotate(${p.angle + Math.PI / 2}rad)`;
      }

      // Skid marks while cornering hard or braking at speed.
      const cornering = Math.abs(steerInput) > 0 && Math.abs(p.speed) > 6;
      if ((cornering || (brake && Math.abs(p.speed) > 4)) && frame % 2 === 0) {
        setMarks((prev) => {
          const nm = [...prev, { id: markId.current++, x: p.x, y: p.y, a: p.angle }];
          return nm.length > 70 ? nm.slice(nm.length - 70) : nm;
        });
      }

      if (frame % 6 === 0) setSpeedHud(Math.round(Math.abs(p.speed) * 14));
      frame++;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      keys.current = {};
    };
  }, [active]);

  // Clear marks shortly after exiting.
  useEffect(() => {
    if (!active && marks.length) {
      const t = setTimeout(() => setMarks([]), 600);
      return () => clearTimeout(t);
    }
  }, [active, marks.length]);

  const accent = character.world.bg;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-[9500]"
        >
          {/* Skid marks */}
          {marks.map((m) => (
            <span
              key={m.id}
              className="absolute h-1.5 w-5 rounded-full"
              style={{
                left: m.x,
                top: m.y,
                background: '#0a0a0a',
                opacity: 0.28,
                transform: `translate(-50%, -50%) rotate(${m.a + Math.PI / 2}rad)`,
              }}
            />
          ))}

          {/* The car */}
          <div
            ref={carRef}
            className="absolute left-0 top-0 h-[58px] w-[34px]"
            style={{ willChange: 'transform' }}
          >
            {/* Headlight beam */}
            <div
              className="absolute -top-9 left-1/2 h-12 w-16 -translate-x-1/2 rounded-[50%]"
              style={{
                background: `radial-gradient(50% 70% at 50% 100%, ${accent}aa, transparent 72%)`,
                filter: 'blur(2px)',
              }}
            />
            {/* Body */}
            <div
              className="absolute inset-0 rounded-[10px] shadow-lg"
              style={{
                background: `linear-gradient(180deg, ${accent}, ${character.world.deep})`,
                boxShadow: `0 6px 18px ${character.world.deep}aa, inset 0 2px 2px rgba(255,255,255,0.25)`,
              }}
            >
              {/* Windshield */}
              <div className="absolute left-1/2 top-2 h-3 w-5 -translate-x-1/2 rounded-sm bg-black/40" />
              {/* Roof */}
              <div className="absolute left-1/2 top-6 h-4 w-6 -translate-x-1/2 rounded-sm" style={{ background: `${character.world.deep}` }} />
              {/* Rear window */}
              <div className="absolute bottom-2 left-1/2 h-2.5 w-5 -translate-x-1/2 rounded-sm bg-black/30" />
              {/* Headlights */}
              <div className="absolute left-1 top-0.5 h-1.5 w-1.5 rounded-full bg-amber-200" />
              <div className="absolute right-1 top-0.5 h-1.5 w-1.5 rounded-full bg-amber-200" />
              {/* Tail lights */}
              <div className="absolute bottom-0.5 left-1 h-1 w-1.5 rounded-full bg-red-500" />
              <div className="absolute bottom-0.5 right-1 h-1 w-1.5 rounded-full bg-red-500" />
            </div>
            {/* Wheels */}
            <div className="absolute -left-1 top-3 h-3 w-1.5 rounded bg-black" />
            <div className="absolute -right-1 top-3 h-3 w-1.5 rounded bg-black" />
            <div className="absolute -left-1 bottom-3 h-3 w-1.5 rounded bg-black" />
            <div className="absolute -right-1 bottom-3 h-3 w-1.5 rounded bg-black" />
          </div>

          {/* HUD */}
          <div className="pointer-events-auto fixed bottom-5 left-1/2 z-[9600] -translate-x-1/2">
            <div
              className="flex items-center gap-3 rounded-full border px-4 py-2.5 backdrop-blur-md"
              style={{ borderColor: `${accent}55`, background: '#0b0b0bcc' }}
            >
              <Gauge size={16} style={{ color: accent }} />
              <span className="font-mono text-xs tabular-nums text-bone">
                {String(speedHud).padStart(3, '0')} <span className="text-bone-dim">km/h</span>
              </span>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-bone-dim sm:inline">
                {d.eggs.carHint}
              </span>
              <button
                onClick={() => setActive(false)}
                data-cursor="hover"
                className="flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-bone"
                style={{ background: `${accent}26` }}
              >
                <X size={12} /> {d.eggs.carExit}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
