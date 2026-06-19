import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { DICT, type Dict } from '@/i18n/dict';

export type Lang = 'es' | 'en';

interface LanguageContextValue {
  lang: Lang;
  /** Active dictionary. */
  d: Dict;
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** True briefly during a switch (drives the playful overlay). */
  switching: boolean;
  /** A line to show during the switch. */
  switchLine: string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'jandro-lang';

function detectInitial(): Lang {
  if (typeof window === 'undefined') return 'es';
  const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
  if (saved === 'es' || saved === 'en') return saved;
  return navigator.language.toLowerCase().startsWith('en') ? 'en' : 'es';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('es');
  const [switching, setSwitching] = useState(false);
  const [switchLine, setSwitchLine] = useState('');
  const timers = useRef<number[]>([]);

  // Initialise from storage / browser on mount (avoids SSR mismatch).
  useEffect(() => {
    setLangState(detectInitial());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = useCallback(
    (next: Lang) => {
      if (next === lang) return;
      // Pick a playful line from the *current* dict (it teases the target).
      const lines = DICT[lang].switchLines;
      setSwitchLine(lines[Math.floor(Math.random() * lines.length)]);
      setSwitching(true);

      timers.current.forEach(clearTimeout);
      timers.current = [];
      // Swap content mid-sweep so the overlay masks the change.
      timers.current.push(
        window.setTimeout(() => setLangState(next), 350),
        window.setTimeout(() => setSwitching(false), 1100),
      );
    },
    [lang],
  );

  const toggle = useCallback(() => setLang(lang === 'es' ? 'en' : 'es'), [lang, setLang]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <LanguageContext.Provider
      value={{ lang, d: DICT[lang], setLang, toggle, switching, switchLine }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
