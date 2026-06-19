import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/utils';

const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#%&/\\';
const randomChar = () => POOL[Math.floor(Math.random() * POOL.length)];

interface DecodeTextProps {
  text: string;
  /** Letters resolved per tick. */
  speed?: number;
  /** Delay before decoding starts, in ms. */
  delay?: number;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3';
  /** Re-run the decode every time `trigger` flips. */
  trigger?: unknown;
}

/**
 * Terminal-style decode reveal: characters scramble through random
 * glyphs before settling into the final string. A nod to the
 * developer underneath the design.
 */
export default function DecodeText({
  text,
  speed = 2,
  delay = 0,
  className,
  as: Tag = 'span',
  trigger,
}: DecodeTextProps) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(text);
      return;
    }

    let raf = 0;
    let settled = 0;
    let tick = 0;
    let started = false;
    const startAt = performance.now() + delay;

    const run = (now: number) => {
      if (now < startAt) {
        raf = requestAnimationFrame(run);
        return;
      }
      started = true;
      tick++;
      if (tick % 2 === 0) settled += speed;

      let out = '';
      for (let i = 0; i < text.length; i++) {
        if (i < settled) out += text[i];
        else if (text[i] === ' ') out += ' ';
        else out += randomChar();
      }
      setDisplay(out);
      frame.current = tick;

      if (settled < text.length) {
        raf = requestAnimationFrame(run);
      } else {
        setDisplay(text);
      }
    };

    // Seed with scramble so it never flashes the final text first.
    if (!started)
      setDisplay(
        text
          .split('')
          .map((c) => (c === ' ' ? ' ' : randomChar()))
          .join(''),
      );

    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, trigger]);

  return <Tag className={className}>{display}</Tag>;
}
