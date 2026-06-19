import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/utils';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  label?: string;
}

interface NetworkConstellationProps {
  /** Accent color for nodes + links (world.bg). */
  color: string;
  /** Words floating on the larger hub nodes. */
  labels?: string[];
  className?: string;
}

/**
 * The Connector's signature: a living network graph on canvas. Nodes
 * drift, link to nearby neighbours, and lean toward the cursor — a
 * literal visualization of "networking." Pure canvas, no re-renders.
 */
export default function NetworkConstellation({
  color,
  labels = [],
  className,
}: NetworkConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const ctx = canvas.getContext('2d')!;
    const reduced = prefersReducedMotion();
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    let w = 0;
    let h = 0;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // Seed nodes — a handful of labelled "hubs" plus ambient dots.
    const hubCount = Math.min(labels.length, 6);
    const ambient = Math.max(14, Math.round((w * h) / 26000));
    const nodes: Node[] = [];
    for (let i = 0; i < hubCount; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 4.5,
        label: labels[i],
      });
    }
    for (let i = 0; i < ambient; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.6 + 0.8,
      });
    }

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);

    const LINK = 150;
    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Move
      for (const n of nodes) {
        if (!reduced) {
          n.x += n.vx;
          n.y += n.vy;
          // gentle pull toward cursor
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 200 * 200) {
            const f = (1 - Math.sqrt(d2) / 200) * 0.04;
            n.vx += dx * f * 0.02;
            n.vy += dy * f * 0.02;
          }
          n.vx *= 0.99;
          n.vy *= 0.99;
        }
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        n.x = Math.max(0, Math.min(w, n.x));
        n.y = Math.max(0, Math.min(h, n.y));
      }

      // Links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK) {
            const alpha = (1 - dist / LINK) * 0.5;
            ctx.strokeStyle = hexA(color, alpha);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Links to cursor
      for (const n of nodes) {
        const d = Math.hypot(mouse.x - n.x, mouse.y - n.y);
        if (d < LINK) {
          ctx.strokeStyle = hexA(color, (1 - d / LINK) * 0.7);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // Nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.label ? color : hexA(color, 0.7);
        ctx.fill();
        if (n.label) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 5, 0, Math.PI * 2);
          ctx.strokeStyle = hexA(color, 0.4);
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = hexA(color, 0.92);
          ctx.font = '600 11px ui-monospace, monospace';
          ctx.fillText(n.label.toUpperCase(), n.x + 12, n.y + 4);
        }
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  }, [color, labels]);

  return (
    <div ref={wrapRef} className={className}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

/** Turn a #rrggbb into rgba() with the given alpha. */
function hexA(hex: string, a: number): string {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
