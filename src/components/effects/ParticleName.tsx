import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/utils';

export type ParticleMaterial = 'code' | 'filings' | 'gold' | 'blueprint';

interface Style {
  bg: string;
  grid: string | null;
  color: string;
  hot: string;
  gap: number;
  force: number;
  spring: number;
  glyphs?: string;
}

const STYLES: Record<ParticleMaterial, Style> = {
  code: {
    bg: '#070709', grid: null, color: '#ff9d3c', hot: '#fff0d8',
    gap: 13, force: 2.2, spring: 0.06, glyphs: '01{}<>/[]=+*#%$&·:;|01',
  },
  filings: {
    bg: '#0a0a0d', grid: '#16171c', color: '#c6cfde', hot: '#ffffff',
    gap: 11, force: 1.0, spring: 0.12,
  },
  gold: {
    bg: '#0c0a06', grid: '#1a1610', color: '#e8b95a', hot: '#fff2cf',
    gap: 9, force: 2.7, spring: 0.05,
  },
  blueprint: {
    bg: '#05080e', grid: '#0e1726', color: '#36b6c9', hot: '#c9f6ff',
    gap: 11, force: 1.6, spring: 0.08,
  },
};

interface ParticleNameProps {
  /** One entry per line. */
  lines?: string[];
  material?: ParticleMaterial;
  className?: string;
  /** 3D tilt, degrees. */
  rotY?: number;
  rotX?: number;
  /** Fraction of width the name fills. */
  fit?: number;
  /** Render the ambient dotted grid behind the letters. */
  showGrid?: boolean;
}

interface Pt {
  ox: number; oy: number;
  ch: string;
  baseAng: number; ang: number; lit: number;
  x3: number; y3: number; scale: number;
  hx: number; hy: number; r: number;
  px: number; py: number; vx: number; vy: number;
}

const FOCAL = 1600;
const REPEL_RADIUS = 125;
const rad = (d: number) => (d * Math.PI) / 180;

function hex(h: string): [number, number, number] {
  const c = h.replace('#', '');
  return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
}
function mix(a: number[], b: number[], t: number, alpha: number) {
  return `rgba(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)},${alpha})`;
}

/**
 * Jandro's signature: a name forged from a tilted 3D particle grid that
 * scatters away from the cursor and springs back. Four "materials"
 * (code / filings / gold / blueprint). Ported from the standalone canvas
 * sketch — pure rAF, zero React re-renders during animation.
 */
export default function ParticleName({
  lines = ['JANDRO', 'SANTOS'],
  material = 'gold',
  className,
  rotY = -26,
  rotX = -13,
  fit = 0.84,
  showGrid = false,
}: ParticleNameProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const reduced = prefersReducedMotion();
    const S = STYLES[material];
    const C_BASE = hex(S.color);
    const C_HOT = hex(S.hot);

    let W = 0, H = 0, dpr = 1;
    let pts: Pt[] = [];
    let avgScale = 1, fitK = 1, spacingPx = 6;
    let bgCanvas: HTMLCanvasElement | null = null;
    let goldSprite: HTMLCanvasElement | null = null;
    const mouse = { x: -9999, y: -9999 };

    const project = (ox: number, oy: number) => {
      const ay = rad(rotY), ax = rad(rotX);
      const x1 = ox * Math.cos(ay), z1 = ox * Math.sin(ay);
      const y2 = oy * Math.cos(ax) - z1 * Math.sin(ax);
      const z2 = oy * Math.sin(ax) + z1 * Math.cos(ax);
      const s = FOCAL / (FOCAL - z2);
      return { x: x1 * s, y: y2 * s, scale: s };
    };

    const buildPoints = () => {
      const OW = 1000;
      const off = document.createElement('canvas');
      const o = off.getContext('2d')!;
      let fs = 400;
      o.font = `900 ${fs}px 'Arial Black','Impact',system-ui,sans-serif`;
      const widest = Math.max(...lines.map((l) => o.measureText(l).width));
      fs *= (OW * 0.92) / widest;
      const lineH = fs;
      off.width = OW;
      off.height = Math.ceil(lineH * lines.length + fs * 0.3);
      o.font = `900 ${fs}px 'Arial Black','Impact',system-ui,sans-serif`;
      o.fillStyle = '#000';
      o.textAlign = 'center';
      o.textBaseline = 'middle';
      const sy = off.height / 2 - (lineH * (lines.length - 1)) / 2;
      lines.forEach((l, i) => o.fillText(l, OW / 2, sy + i * lineH));

      const data = o.getImageData(0, 0, off.width, off.height).data;
      const g = S.gap;
      pts = [];
      for (let y = 0; y < off.height; y += g)
        for (let x = 0; x < off.width; x += g)
          if (data[(y * off.width + x) * 4 + 3] > 128) {
            pts.push({
              ox: x - off.width / 2, oy: y - off.height / 2,
              ch: S.glyphs ? S.glyphs[(Math.random() * S.glyphs.length) | 0] : '',
              baseAng: rad(-20) + (Math.random() - 0.5) * 0.4, ang: rad(-20), lit: 0,
              x3: 0, y3: 0, scale: 1, hx: 0, hy: 0, r: 1, px: 0, py: 0, vx: 0, vy: 0,
            });
          }
    };

    const buildBg = () => {
      bgCanvas = document.createElement('canvas');
      bgCanvas.width = W * dpr;
      bgCanvas.height = H * dpr;
      const b = bgCanvas.getContext('2d')!;
      b.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!showGrid || !S.grid) return;
      b.fillStyle = S.grid;
      const step = 28;
      for (let y = step; y < H; y += step)
        for (let x = step; x < W; x += step) {
          b.beginPath();
          b.arc(x, y, 1, 0, 6.283);
          b.fill();
        }
    };

    const makeGoldSprite = () => {
      const s = 64;
      const sp = document.createElement('canvas');
      sp.width = sp.height = s;
      const g = sp.getContext('2d')!;
      const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      grd.addColorStop(0, '#fff4d6');
      grd.addColorStop(0.35, S.color);
      grd.addColorStop(0.6, 'rgba(180,130,40,.45)');
      grd.addColorStop(1, 'rgba(180,130,40,0)');
      g.fillStyle = grd;
      g.fillRect(0, 0, s, s);
      goldSprite = sp;
    };

    const layout = () => {
      let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9, sumS = 0;
      for (const p of pts) {
        const pr = project(p.ox, p.oy);
        p.x3 = pr.x; p.y3 = pr.y; p.scale = pr.scale; sumS += pr.scale;
        if (pr.x < minX) minX = pr.x;
        if (pr.x > maxX) maxX = pr.x;
        if (pr.y < minY) minY = pr.y;
        if (pr.y > maxY) maxY = pr.y;
      }
      avgScale = sumS / pts.length;
      const bw = maxX - minX, bh = maxY - minY;
      fitK = Math.min((W * fit) / bw, (H * 0.7) / bh);
      const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
      spacingPx = S.gap * avgScale * fitK;
      const baseR = spacingPx * 0.5 * 0.62;
      for (const p of pts) {
        p.hx = (p.x3 - cx) * fitK + W / 2;
        p.hy = (p.y3 - cy) * fitK + H / 2;
        p.r = baseR * (p.scale / avgScale);
        const a = Math.random() * 6.283, dd = Math.random() * Math.hypot(W, H) * 0.35;
        p.px = p.hx + Math.cos(a) * dd;
        p.py = p.hy + Math.sin(a) * dd;
        p.vx = 0; p.vy = 0;
      }
      buildBg();
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      if (W === 0 || H === 0) return;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layout();
    };

    const physics = () => {
      const R = REPEL_RADIUS, R2 = R * R;
      for (const p of pts) {
        if (reduced) { p.px = p.hx; p.py = p.hy; p.lit = 0; continue; }
        const dx = p.px - mouse.x, dy = p.py - mouse.y, d2 = dx * dx + dy * dy;
        let lit = 0;
        if (d2 < R2 && d2 > 0.01) {
          const d = Math.sqrt(d2), f = (1 - d / R) * S.force;
          p.vx += (dx / d) * f; p.vy += (dy / d) * f; lit = 1 - d / R;
        }
        p.lit = Math.max(p.lit * 0.9, lit);
        p.vx += (p.hx - p.px) * S.spring; p.vy += (p.hy - p.py) * S.spring;
        p.vx *= 0.86; p.vy *= 0.86; p.px += p.vx; p.py += p.vy;
      }
    };

    const lerpAng = (a: number, b: number, t: number) => {
      const d = ((b - a + Math.PI) % (2 * Math.PI)) - Math.PI;
      return a + d * t;
    };

    const drawCode = () => {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${spacingPx * 1.05}px ui-monospace,'Cascadia Code',Menlo,Consolas,monospace`;
      for (const p of pts) {
        if (p.lit > 0.05 && Math.random() < 0.2 * p.lit) p.ch = S.glyphs![(Math.random() * S.glyphs!.length) | 0];
        ctx.fillStyle = mix(C_BASE, C_HOT, p.lit, 0.45 + 0.55 * p.lit);
        ctx.fillText(p.ch, p.px, p.py);
      }
    };
    const drawFilings = () => {
      for (const pass of [0, 1]) {
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineWidth = Math.max(1, spacingPx * 0.13);
        for (const p of pts) {
          const on = p.lit > 0.12;
          if (pass === 0 && on) continue;
          if (pass === 1 && !on) continue;
          const target = on ? Math.atan2(p.py - mouse.y, p.px - mouse.x) : p.baseAng;
          p.ang = lerpAng(p.ang, target, 0.3);
          const len = spacingPx * 0.72 * (1 + p.lit * 0.5);
          const c = Math.cos(p.ang) * len / 2, s = Math.sin(p.ang) * len / 2;
          ctx.moveTo(p.px - c, p.py - s);
          ctx.lineTo(p.px + c, p.py + s);
        }
        ctx.strokeStyle = pass ? mix(C_HOT, C_HOT, 0, 0.95) : mix(C_BASE, C_BASE, 0, 0.5);
        ctx.stroke();
      }
    };
    const drawGold = () => {
      for (const p of pts) {
        const w = p.r * 2.8 * (1 + p.lit * 0.6);
        ctx.globalAlpha = 0.55 + 0.45 * p.lit;
        ctx.drawImage(goldSprite!, p.px - w / 2, p.py - w / 2, w, w);
      }
      ctx.globalAlpha = 1;
    };
    const drawBlueprint = () => {
      for (const pass of [0, 1]) {
        ctx.beginPath();
        ctx.lineWidth = Math.max(0.8, spacingPx * 0.1);
        const a = spacingPx * 0.34;
        for (const p of pts) {
          const on = p.lit > 0.12;
          if (pass === 0 && on) continue;
          if (pass === 1 && !on) continue;
          ctx.moveTo(p.px - a, p.py);
          ctx.lineTo(p.px + a, p.py);
          ctx.moveTo(p.px, p.py - a);
          ctx.lineTo(p.px, p.py + a);
        }
        ctx.strokeStyle = pass ? mix(C_HOT, C_HOT, 0, 0.95) : mix(C_BASE, C_BASE, 0, 0.42);
        ctx.stroke();
      }
    };
    const RENDER = { code: drawCode, filings: drawFilings, gold: drawGold, blueprint: drawBlueprint };

    if (material === 'gold') makeGoldSprite();
    buildPoints();
    resize();

    let raf = 0;
    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      if (bgCanvas) ctx.drawImage(bgCanvas, 0, 0, W, H);
      physics();
      RENDER[material]();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onOut = () => { mouse.x = -9999; mouse.y = -9999; };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerout', onOut);
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerout', onOut);
      ro.disconnect();
    };
  }, [lines, material, rotY, rotX, fit, showGrid]);

  return (
    <div ref={wrapRef} className={className}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
