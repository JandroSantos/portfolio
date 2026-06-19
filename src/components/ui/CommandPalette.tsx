import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Globe,
  Terminal,
  Zap,
  User,
  Briefcase,
  BookOpen,
  Code2,
  Languages,
  ChevronRight,
} from 'lucide-react';
import { useWorld } from '@/hooks/useWorld';
import { useLanguage } from '@/hooks/useLanguage';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  group: string;
  keywords?: string[];
}

interface CommandPaletteProps {
  onOpenTerminal: () => void;
  onPartyMode: () => void;
}

export default function CommandPalette({ onOpenTerminal, onPartyMode }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { goTo } = useWorld();
  const { toggle: toggleLang, setLang, lang, d } = useLanguage();

  const commands: Command[] = [
    {
      id: 'connect',
      label: d.nav.connect,
      description: 'The Connector — networking & community',
      icon: <User size={16} />,
      action: () => { navigate('/connect'); goTo(0); },
      group: 'Navigate',
      keywords: ['social', 'connect', 'hola'],
    },
    {
      id: 'projects',
      label: d.nav.projects,
      description: 'The Builder — real shipped things',
      icon: <Code2 size={16} />,
      action: () => { navigate('/projects'); goTo(1); },
      group: 'Navigate',
      keywords: ['build', 'code', 'dev'],
    },
    {
      id: 'experience',
      label: d.nav.experience,
      description: 'The Executive — leadership & AI',
      icon: <Briefcase size={16} />,
      action: () => { navigate('/experience'); goTo(2); },
      group: 'Navigate',
      keywords: ['work', 'job', 'cv', 'career'],
    },
    {
      id: 'studies',
      label: d.nav.studies,
      description: 'The Student — always learning',
      icon: <BookOpen size={16} />,
      action: () => { navigate('/studies'); goTo(3); },
      group: 'Navigate',
      keywords: ['learn', 'education', 'nerd'],
    },
    {
      id: 'home',
      label: 'Home',
      description: 'Back to the landing carousel',
      icon: <Globe size={16} />,
      action: () => navigate('/'),
      group: 'Navigate',
      keywords: ['start', 'hero', 'main'],
    },
    {
      id: 'cv',
      label: 'CV / Résumé',
      description: 'Printable curriculum vitae',
      icon: <span className="text-xs font-bold">CV</span>,
      action: () => navigate('/cv'),
      group: 'Navigate',
      keywords: ['resume', 'curriculum', 'pdf', 'print', 'hire'],
    },
    {
      id: 'lang-toggle',
      label: lang === 'es' ? 'Switch to English' : 'Cambiar a Español',
      description: 'Toggle between ES / EN',
      icon: <Languages size={16} />,
      action: () => toggleLang(),
      group: 'Settings',
      keywords: ['language', 'idioma', 'english', 'español'],
    },
    {
      id: 'lang-es',
      label: 'Español',
      description: 'Cambiar idioma a español',
      icon: <span className="text-xs">🇪🇸</span>,
      action: () => setLang('es'),
      group: 'Settings',
      keywords: ['español', 'spanish', 'es'],
    },
    {
      id: 'lang-en',
      label: 'English',
      description: 'Switch language to English',
      icon: <span className="text-xs">🇬🇧</span>,
      action: () => setLang('en'),
      group: 'Settings',
      keywords: ['english', 'inglés', 'en'],
    },
    {
      id: 'terminal',
      label: 'Open Terminal',
      description: 'Hidden CLI with easter eggs — try "help"',
      icon: <Terminal size={16} />,
      action: () => onOpenTerminal(),
      group: 'Tools',
      keywords: ['sudo', 'cli', 'hack', 'bash', 'shell'],
    },
    {
      id: 'party',
      label: '🎉 Party Mode',
      description: 'You only live once',
      icon: <Zap size={16} />,
      action: () => onPartyMode(),
      group: 'Easter Eggs',
      keywords: ['party', 'disco', 'fiesta', 'confetti', 'fun'],
    },
  ];

  const filtered = query.trim()
    ? commands.filter((c) => {
        const q = query.toLowerCase();
        return (
          c.label.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.group.toLowerCase().includes(q) ||
          c.keywords?.some((k) => k.includes(q))
        );
      })
    : commands;

  const groups = Array.from(new Set(filtered.map((c) => c.group)));

  const run = useCallback(
    (cmd: Command) => {
      setOpen(false);
      setQuery('');
      setTimeout(() => cmd.action(), 50);
    },
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery('');
        setSelected(0);
      }
      if (!open) return;
      if (e.key === 'Escape') { setOpen(false); setQuery(''); }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
      if (e.key === 'Enter' && filtered[selected]) run(filtered[selected]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, filtered, selected, run]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else setSelected(0);
  }, [open]);

  useEffect(() => { setSelected(0); }, [query]);

  let flatIdx = 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="palette-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[9900] bg-black/60 backdrop-blur-sm"
            onClick={() => { setOpen(false); setQuery(''); }}
          />

          {/* Panel */}
          <motion.div
            key="palette-panel"
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-[18vh] z-[9950] w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-ink-line shadow-2xl"
            style={{
              background: 'rgba(10,10,10,0.95)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
            }}
          >
            {/* Search row */}
            <div className="flex items-center gap-3 border-b border-ink-line px-4 py-3">
              <Search size={16} className="shrink-0 text-bone-dim" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands…"
                className="w-full bg-transparent font-mono text-sm text-bone outline-none placeholder:text-bone-dim/50"
              />
              <kbd className="hidden rounded border border-ink-line px-1.5 py-0.5 font-mono text-[10px] text-bone-dim sm:block">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[360px] overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <p className="px-4 py-8 text-center font-mono text-sm text-bone-dim/60">
                  No commands match "{query}"
                </p>
              ) : (
                groups.map((group) => {
                  const groupCmds = filtered.filter((c) => c.group === group);
                  return (
                    <div key={group}>
                      <p className="px-4 pb-1 pt-3 font-mono text-[10px] uppercase tracking-widest text-bone-dim/50">
                        {group}
                      </p>
                      {groupCmds.map((cmd) => {
                        const idx = flatIdx++;
                        const isSelected = idx === selected;
                        return (
                          <button
                            key={cmd.id}
                            onMouseEnter={() => setSelected(idx)}
                            onClick={() => run(cmd)}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors"
                            style={{
                              background: isSelected ? 'rgba(255,255,255,0.06)' : 'transparent',
                            }}
                          >
                            <span
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-ink-line text-bone-dim"
                              style={isSelected ? { borderColor: 'rgba(255,255,255,0.2)', color: 'var(--color-bone)' } : {}}
                            >
                              {cmd.icon}
                            </span>
                            <span className="flex-1 overflow-hidden">
                              <span className="block truncate text-sm text-bone">{cmd.label}</span>
                              {cmd.description && (
                                <span className="block truncate font-mono text-[11px] text-bone-dim/60">
                                  {cmd.description}
                                </span>
                              )}
                            </span>
                            {isSelected && (
                              <ChevronRight size={14} className="shrink-0 text-bone-dim/60" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer hint */}
            <div className="flex items-center gap-4 border-t border-ink-line px-4 py-2">
              <span className="font-mono text-[10px] text-bone-dim/40">
                <kbd className="rounded border border-ink-line px-1">↑↓</kbd> navigate
              </span>
              <span className="font-mono text-[10px] text-bone-dim/40">
                <kbd className="rounded border border-ink-line px-1">↵</kbd> select
              </span>
              <span className="ml-auto font-mono text-[10px] text-bone-dim/40">⌘K</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
