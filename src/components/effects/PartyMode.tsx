import { useEffect, useRef, useCallback } from 'react';

const COLORS = ['#f4845f', '#e8902b', '#34467e', '#d2ab5b', '#7fae5f', '#fff', '#f9f9f9'];
const PARTY_DURATION = 6000;

interface Piece {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  color: string;
  angle: number;
  spin: number;
  alpha: number;
}

export function usePartyMode() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const piecesRef = useRef<Piece[]>([]);
  const startRef = useRef<number>(0);

  const spawn = useCallback(() => {
    const count = 200;
    const pieces: Piece[] = [];
    for (let i = 0; i < count; i++) {
      pieces.push({
        x: Math.random() * window.innerWidth,
        y: -10,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 4 + 2,
        size: Math.random() * 10 + 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.3,
        alpha: 1,
      });
    }
    piecesRef.current = pieces;
  }, []);

  const tick = useCallback((now: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const elapsed = now - startRef.current;
    const progress = elapsed / PARTY_DURATION;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const pieces = piecesRef.current;
    let alive = false;

    for (const p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15; // gravity
      p.angle += p.spin;
      p.alpha = Math.max(0, 1 - Math.max(0, progress - 0.6) / 0.4);

      if (p.y < canvas.height + 20) alive = true;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.4);
      ctx.restore();
    }

    if (alive && elapsed < PARTY_DURATION) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      canvasRef.current = null;
    }
  }, []);

  const party = useCallback(() => {
    // Remove any existing canvas
    if (canvasRef.current?.parentNode) {
      canvasRef.current.parentNode.removeChild(canvasRef.current);
      cancelAnimationFrame(rafRef.current);
    }

    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText =
      'position:fixed;inset:0;z-index:99999;pointer-events:none;';
    document.body.appendChild(canvas);
    canvasRef.current = canvas;
    startRef.current = performance.now();

    spawn();
    // Fire 3 bursts
    rafRef.current = requestAnimationFrame(tick);
    setTimeout(() => { spawn(); }, 600);
    setTimeout(() => { spawn(); }, 1200);
  }, [spawn, tick]);

  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current);
    canvasRef.current?.parentNode?.removeChild(canvasRef.current);
  }, []);

  return party;
}
