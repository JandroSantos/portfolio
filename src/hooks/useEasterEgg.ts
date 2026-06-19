import { useEffect, useState, useCallback } from 'react';

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

const SECRET_WORD = 'sudo';

/**
 * Opens the hidden terminal when the visitor enters the Konami code
 * or simply types "sudo". A wink to anyone curious enough to poke.
 */
export function useEasterEgg() {
  const [open, setOpen] = useState(false);
  const [discovered, setDiscovered] = useState(false);

  const toggle = useCallback(() => setOpen((o) => !o), []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    let konamiIdx = 0;
    let typed = '';

    const onKey = (e: KeyboardEvent) => {
      // Ignore while typing inside an input (the terminal itself).
      const target = e.target as HTMLElement;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return;

      // Konami sequence
      const expected = KONAMI[konamiIdx];
      if (e.key === expected || e.key.toLowerCase() === expected) {
        konamiIdx++;
        if (konamiIdx === KONAMI.length) {
          konamiIdx = 0;
          setDiscovered(true);
          setOpen(true);
        }
      } else {
        konamiIdx = e.key === KONAMI[0] ? 1 : 0;
      }

      // Typed secret word
      if (/^[a-z]$/i.test(e.key)) {
        typed = (typed + e.key.toLowerCase()).slice(-SECRET_WORD.length);
        if (typed === SECRET_WORD) {
          setDiscovered(true);
          setOpen(true);
        }
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return { open, discovered, toggle, close, setOpen };
}
