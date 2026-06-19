import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { CHARACTERS, getByIndex, type Character } from '@/data/characters';

interface WorldContextValue {
  /** Index of the active character in the carousel. */
  active: number;
  /** The active character object. */
  character: Character;
  /** Move to a specific index (wraps). */
  goTo: (i: number) => void;
  /** Step forward / backward. */
  next: () => void;
  prev: () => void;
  /** Lock the world to an index without a directional sweep (used by pages). */
  lockTo: (i: number) => void;
  /** Direction of the last navigation (1 = next, -1 = prev). */
  direction: number;
}

const WorldContext = createContext<WorldContextValue | null>(null);

/**
 * Owns the active character and paints the page to match.
 * Setting CSS custom properties on :root lets the *entire* site
 * (selection color, panels, accents) recolor with one source of truth.
 */
export function WorldProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const character = getByIndex(active);

  const goTo = useCallback(
    (i: number) => {
      setDirection(i > active ? 1 : -1);
      setActive(((i % CHARACTERS.length) + CHARACTERS.length) % CHARACTERS.length);
    },
    [active],
  );

  const next = useCallback(() => {
    setDirection(1);
    setActive((a) => a + 1);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setActive((a) => a - 1);
  }, []);

  const lockTo = useCallback((i: number) => {
    setActive(((i % CHARACTERS.length) + CHARACTERS.length) % CHARACTERS.length);
  }, []);

  // Repaint the world whenever the active character changes.
  useEffect(() => {
    const { world } = character;
    const root = document.documentElement.style;
    root.setProperty('--world-bg', world.bg);
    root.setProperty('--world-panel', world.panel);
    root.setProperty('--world-deep', world.deep);
    root.setProperty('--world-ink', world.ink);
    root.setProperty('--world-accent', world.accent);
    document.documentElement.dataset.world = character.key;
  }, [character]);

  return (
    <WorldContext.Provider value={{ active, character, goTo, next, prev, lockTo, direction }}>
      {children}
    </WorldContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWorld() {
  const ctx = useContext(WorldContext);
  if (!ctx) throw new Error('useWorld must be used within WorldProvider');
  return ctx;
}
