import { useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  type MotionValue,
} from 'framer-motion';
import { hasFinePointer, hexA, prefersReducedMotion } from '@/lib/utils';
import { useWorld } from '@/hooks/useWorld';

type CursorState = 'default' | 'hover' | 'drag';

/**
 * Signature custom cursor: a pixel-precise dot (mix-blend-difference so it
 * reads on any imagery) chased by a trailing glass ring tinted to the active
 * world. The ring swells on hoverable targets and floats an elegant label.
 *
 * Driven entirely by Framer motion values + springs — no React state changes
 * on mousemove — so it stays buttery at 60fps. Decorative and click-through.
 * Hidden on touch devices; falls back to a static ring under reduced motion.
 */
export default function Cursor() {
  const { character } = useWorld();
  const accent = character.world.bg;

  const [enabled, setEnabled] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [state, setState] = useState<CursorState>('default');
  const [label, setLabel] = useState('');
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  // Raw pointer position — updated imperatively, never triggers re-render.
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // The dot rides just behind the pointer; the ring lags further for trail.
  const dotX = useSpring(rawX, { stiffness: 1400, damping: 64, mass: 0.35 });
  const dotY = useSpring(rawY, { stiffness: 1400, damping: 64, mass: 0.35 });
  const ringX = useSpring(rawX, { stiffness: 260, damping: 26, mass: 0.55 });
  const ringY = useSpring(rawY, { stiffness: 260, damping: 26, mass: 0.55 });

  useEffect(() => {
    if (!hasFinePointer()) return;
    const rm = prefersReducedMotion();
    setEnabled(true);
    setReduced(rm);
    document.body.classList.add('has-custom-cursor');

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

    let lastState: CursorState = 'default';
    let lastLabel = '';

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      setVisible(true);
      const r = resolve(e.target as Element);
      // Only touch React state when the resolved target actually changes.
      if (r.state !== lastState) {
        lastState = r.state;
        setState(r.state);
      }
      if (r.label !== lastLabel) {
        lastLabel = r.label;
        setLabel(r.label);
      }
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
      document.body.classList.remove('has-custom-cursor');
    };
    // rawX/rawY are stable motion values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!enabled) return null;

  // Under reduced motion the ring follows the pointer 1:1 (no trailing lag).
  const dx: MotionValue<number> = reduced ? rawX : dotX;
  const dy: MotionValue<number> = reduced ? rawY : dotY;
  const rx: MotionValue<number> = reduced ? rawX : ringX;
  const ry: MotionValue<number> = reduced ? rawY : ringY;

  const RING = 34; // base ring diameter (px)
  const scale =
    (state === 'hover' ? 1.85 : state === 'drag' ? 2.7 : 1) *
    (pressed ? 0.82 : 1);

  const spring = reduced
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 500, damping: 30, mass: 0.6 };

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      {/* Trailing glass ring — tinted to the world accent with a soft glow. */}
      <motion.div
        className="absolute left-0 top-0 rounded-full"
        style={{
          x: rx,
          y: ry,
          width: RING,
          height: RING,
          marginLeft: -RING / 2,
          marginTop: -RING / 2,
        }}
      >
        <motion.div
          className="h-full w-full rounded-full border backdrop-blur-[1px]"
          animate={{
            scale,
            opacity: visible ? 1 : 0,
            borderColor: hexA(accent, state === 'default' ? 0.55 : 0.9),
            backgroundColor: hexA(accent, state === 'default' ? 0.04 : 0.16),
            boxShadow: `0 0 ${state === 'default' ? 12 : 22}px ${hexA(
              accent,
              state === 'default' ? 0.25 : 0.5,
            )}`,
          }}
          transition={spring}
        />
      </motion.div>

      {/* Pixel-precise dot — white + difference blend so it reads everywhere. */}
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white mix-blend-difference"
        style={{ x: dx, y: dy, marginLeft: -3, marginTop: -3 }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: state === 'default' ? 1 : 0.6,
        }}
        transition={spring}
      />

      {/* Elegant floating label, offset just under the ring. */}
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: rx, y: ry }}
      >
        <AnimatePresence>
          {label && visible && (
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.9 }}
              transition={reduced ? { duration: 0 } : { duration: 0.22, ease: [0.34, 1.56, 0.64, 1] }}
              className="absolute left-1/2 top-full mt-4 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-white shadow-lg backdrop-blur-md"
              style={{
                backgroundColor: hexA('#000000', 0.55),
                border: `1px solid ${hexA(accent, 0.5)}`,
                boxShadow: `0 6px 20px ${hexA('#000000', 0.35)}, 0 0 14px ${hexA(accent, 0.35)}`,
              }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
