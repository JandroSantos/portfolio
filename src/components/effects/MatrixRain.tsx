import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWorld } from '@/hooks/useWorld';
import { on } from '@/lib/bus';

/**
 * The `matrix` command's payload: a falling-glyph canvas rain tinted
 * to the active world. Any key or click dismisses it.
 */
export default function MatrixRain() {
  const { character } = useWorld();
  const [active, setActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => on('matrix', () => setActive(true)), []);

  useEffect(() => {
    if (!active) return;
    const dismiss = () => setActive(false);
    window.addEventListener('keydown', dismiss);
    window.addEventListener('pointerdown', dismiss);

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    const glyphs = 'アイウエオカキクケコサシスセソタチツ01ジャンドロJANDRO{}[]()<>=/$#'.split('');
    const fontSize = 16 * dpr;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array.from({ length: cols }, () => Math.random() * -100);
    const color = character.world.bg;

    let raf = 0;
    const draw = () => {
      ctx.fillStyle = 'rgba(5,7,5,0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', dismiss);
      window.removeEventListener('pointerdown', dismiss);
      window.removeEventListener('resize', resize);
    };
  }, [active, character.world.bg]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9700] bg-black"
        >
          <canvas ref={canvasRef} className="h-full w-full" style={{ width: '100%', height: '100%' }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
