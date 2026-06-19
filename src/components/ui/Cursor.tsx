import { useEffect, useRef, useState } from 'react';
import { lerp, hasFinePointer } from '@/lib/utils';

type CursorState = 'default' | 'hover' | 'drag';

/**
 * A single lerped dot that trails the real cursor, swelling and
 * morphing based on a `data-cursor` attribute walked up from the
 * hovered element. Renders only on fine-pointer devices.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  const [state, setState] = useState<CursorState>('default');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!hasFinePointer()) return;
    setEnabled(true);
    document.body.classList.add('has-custom-cursor');

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: mouse.x, y: mouse.y };
    let raf = 0;

    const resolve = (el: Element | null): { state: CursorState; label: string } => {
      let node: Element | null = el;
      while (node) {
        if (node instanceof HTMLElement && node.dataset.cursor) {
          return {
            state: (node.dataset.cursor as CursorState) || 'hover',
            label: node.dataset.cursorLabel ?? '',
          };
        }
        node = node.parentElement;
      }
      return { state: 'default', label: '' };
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const r = resolve(e.target as Element);
      setState(r.state);
      setLabel(r.label);
    };

    const tick = () => {
      ring.x = lerp(ring.x, mouse.x, 0.18);
      ring.y = lerp(ring.y, mouse.y, 0.18);
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%, -50%)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  if (!enabled) return null;

  const ringSize = state === 'hover' ? 64 : state === 'drag' ? 84 : 36;

  return (
    <>
      {/* Precise dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full mix-blend-difference"
        style={{ background: '#fff' }}
      />
      {/* Trailing ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center rounded-full border mix-blend-difference transition-[width,height] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{
          width: ringSize,
          height: ringSize,
          borderColor: '#fff',
        }}
      >
        {label && (
          <span className="font-mono text-[9px] uppercase tracking-widest text-white">
            {label}
          </span>
        )}
      </div>
    </>
  );
}
