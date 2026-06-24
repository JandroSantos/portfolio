import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { prefersReducedMotion } from '@/lib/utils';

interface Token {
  t: string;
  c: 'kw' | 'fn' | 'str' | 'num' | 'com' | 'punc' | 'var' | 'plain';
}

interface CodeWindowProps {
  color: string;
  filename?: string;
  className?: string;
}

/** A tiny hand-tokenized snippet — typed out for the "developer" world. */
const LINES: Token[][] = [
  [{ t: 'const', c: 'kw' }, { t: ' jandro ', c: 'var' }, { t: '=', c: 'punc' }, { t: ' {', c: 'punc' }],
  [{ t: '  role', c: 'var' }, { t: ':', c: 'punc' }, { t: " 'developer'", c: 'str' }, { t: ',', c: 'punc' }],
  [{ t: '  stack', c: 'var' }, { t: ':', c: 'punc' }, { t: ' [', c: 'punc' }, { t: "'react'", c: 'str' }, { t: ', ', c: 'punc' }, { t: "'ts'", c: 'str' }, { t: ', ', c: 'punc' }, { t: "'python'", c: 'str' }, { t: '],', c: 'punc' }],
  [{ t: '  coffee', c: 'var' }, { t: ':', c: 'punc' }, { t: ' Infinity', c: 'num' }, { t: ',', c: 'punc' }],
  [{ t: '  learn', c: 'fn' }, { t: ': ', c: 'punc' }, { t: '()', c: 'punc' }, { t: ' => ', c: 'kw' }, { t: 'keepGoing', c: 'fn' }, { t: '(),', c: 'punc' }],
  [{ t: '}', c: 'punc' }],
  [],
  [{ t: '// always shipping, always studying', c: 'com' }],
  [{ t: 'while', c: 'kw' }, { t: ' (', c: 'punc' }, { t: 'alive', c: 'var' }, { t: ') ', c: 'punc' }, { t: 'jandro', c: 'var' }, { t: '.', c: 'punc' }, { t: 'learn', c: 'fn' }, { t: '();', c: 'punc' }],
];

const COLORS: Record<Token['c'], string> = {
  kw: '#c98bff',
  fn: '#7fd3ff',
  str: '#9ee37d',
  num: '#ffb86c',
  com: '#5b6b50',
  punc: '#9bb08c',
  var: '#e6f2dd',
  plain: '#cfe3c2',
};

/**
 * The Student's signature: an editor that types its own source. Line
 * numbers, syntax colors, a blinking caret. Starts when scrolled into view.
 */
export default function CodeWindow({ color, filename = 'jandro.ts', className }: CodeWindowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [count, setCount] = useState(0); // characters revealed
  const total = LINES.reduce((s, l) => s + l.reduce((a, t) => a + t.t.length, 0) + 1, 0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setCount(total);
      return;
    }
    let c = 0;
    const id = setInterval(() => {
      c += 1;
      setCount(c);
      if (c >= total) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, [inView, total]);

  // Walk tokens, revealing up to `count` characters.
  let remaining = count;
  const rendered = LINES.map((line) => {
    const out: { t: string; c: Token['c'] }[] = [];
    for (const tok of line) {
      if (remaining <= 0) break;
      const slice = tok.t.slice(0, remaining);
      out.push({ t: slice, c: tok.c });
      remaining -= tok.t.length;
    }
    remaining -= 1; // newline
    return out;
  });

  const done = count >= total;
  const caretLine = lastVisibleLine(rendered);

  return (
    <div
      ref={ref}
      className={`overflow-hidden rounded-2xl border border-ink-line bg-[#070d07] ${className ?? ''}`}
    >
      <div className="flex items-center gap-2 border-b border-ink-line px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-[11px] text-bone-dim">{filename}</span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-wider" style={{ color }}>
          {done ? 'saved' : 'typing…'}
        </span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed sm:text-sm">
        {rendered.map((line, i) => (
          <div key={i} className="flex">
            <span className="mr-4 inline-block w-5 shrink-0 select-none text-right text-bone-dim/40">
              {i + 1}
            </span>
            <code className="whitespace-pre">
              {line.map((tok, j) => (
                <span key={j} style={{ color: COLORS[tok.c] }}>
                  {tok.t}
                </span>
              ))}
              {!done && i === caretLine && (
                <span className="inline-block h-4 w-[7px] translate-y-[2px] animate-pulse" style={{ background: color }} />
              )}
            </code>
          </div>
        ))}
      </pre>
    </div>
  );
}

/** Index of the last line that currently has any revealed content. */
function lastVisibleLine(lines: { t: string }[][]): number {
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].length > 0) return i;
  }
  return 0;
}
