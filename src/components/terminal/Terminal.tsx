import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useWorld } from '@/hooks/useWorld';
import { CHARACTERS, type CharacterKey } from '@/data/characters';
import {
  PROFILE,
  PROJECTS,
  EXPERIENCE,
  STUDIES,
  SKILLS,
  SOCIALS,
  SECTION_FOR,
} from '@/data/content';
import { scrollToId } from '@/lib/scroll';

interface Line {
  type: 'in' | 'out' | 'accent' | 'dim' | 'art';
  text: string;
}

const BANNER: Line[] = [
  { type: 'art', text: '     ___  ___' },
  { type: 'art', text: " |  | |__ '   jandro@portfolio" },
  { type: 'art', text: ' |__| ___|    v1.0 — shell interactivo' },
  { type: 'dim', text: "Escribe 'help' para ver los comandos. 'exit' para salir." },
];

interface TerminalProps {
  open: boolean;
  onClose: () => void;
}

export default function Terminal({ open, onClose }: TerminalProps) {
  const { goTo } = useWorld();
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Autofocus + scroll to bottom.
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const print = (newLines: Line[]) => setLines((prev) => [...prev, ...newLines]);

  function run(raw: string) {
    const cmd = raw.trim().toLowerCase();
    const [base, ...args] = cmd.split(/\s+/);
    print([{ type: 'in', text: `jandro@portfolio:~$ ${raw}` }]);

    switch (base) {
      case '':
        break;
      case 'help':
        print([
          { type: 'accent', text: 'Comandos disponibles:' },
          { type: 'out', text: '  whoami        quién soy' },
          { type: 'out', text: '  about         sobre mí' },
          { type: 'out', text: '  projects      proyectos destacados' },
          { type: 'out', text: '  experience    trayectoria profesional' },
          { type: 'out', text: '  studies       formación' },
          { type: 'out', text: '  skills        stack técnico' },
          { type: 'out', text: '  contact       cómo encontrarme' },
          { type: 'out', text: '  goto <sec>    ir a una sección (connect/projects/experience/studies)' },
          { type: 'out', text: '  theme <id>    cambiar de mundo (social/builder/exec/nerd)' },
          { type: 'out', text: '  sudo hire-me  ;)' },
          { type: 'out', text: '  clear         limpiar  ·  exit  cerrar' },
        ]);
        break;
      case 'whoami':
        print([
          { type: 'accent', text: PROFILE.name },
          { type: 'out', text: `${PROFILE.role} · ${PROFILE.age} años · ${PROFILE.location}` },
        ]);
        break;
      case 'about':
      case 'cat':
        print(PROFILE.bio.map((b) => ({ type: 'out' as const, text: b })));
        break;
      case 'projects':
      case 'ls':
        print([
          { type: 'accent', text: 'Proyectos:' },
          ...PROJECTS.flatMap((p) => [
            { type: 'out' as const, text: `  ${p.number}  ${p.name}  ${'·'} ${p.category}` },
            { type: 'dim' as const, text: `      ${p.stack.join(' / ')}` },
          ]),
        ]);
        break;
      case 'experience':
      case 'work':
        print([
          { type: 'accent', text: 'Experiencia:' },
          ...EXPERIENCE.flatMap((e) => [
            { type: 'out' as const, text: `  ${e.role} — ${e.org}` },
            { type: 'dim' as const, text: `      ${e.period}` },
          ]),
        ]);
        break;
      case 'studies':
      case 'edu':
        print([
          { type: 'accent', text: 'Formación:' },
          ...STUDIES.map((s) => ({ type: 'out' as const, text: `  • ${s.title}` })),
        ]);
        break;
      case 'skills':
        print([
          { type: 'accent', text: 'Stack:' },
          ...SKILLS.map((g) => ({
            type: 'out' as const,
            text: `  ${g.label.padEnd(14)} ${g.items.join(', ')}`,
          })),
        ]);
        break;
      case 'contact':
        print([
          { type: 'accent', text: 'Contacto:' },
          ...SOCIALS.map((s) => ({ type: 'out' as const, text: `  ${s.label.padEnd(10)} ${s.handle}` })),
        ]);
        break;
      case 'goto': {
        const sec = args[0];
        const valid = ['connect', 'projects', 'experience', 'studies'];
        if (valid.includes(sec)) {
          print([{ type: 'dim', text: `→ navegando a /${sec}` }]);
          onClose();
          setTimeout(() => scrollToId(sec), 200);
        } else {
          print([{ type: 'dim', text: `secciones: ${valid.join(', ')}` }]);
        }
        break;
      }
      case 'theme': {
        const id = args[0] as CharacterKey;
        const found = CHARACTERS.find((c) => c.key === id);
        if (found) {
          goTo(found.index);
          print([{ type: 'dim', text: `mundo → ${found.alias}` }]);
        } else {
          print([{ type: 'dim', text: 'temas: social, builder, exec, nerd' }]);
        }
        break;
      }
      case 'sudo':
        if (args[0] === 'hire-me') {
          print([
            { type: 'accent', text: '[sudo] permiso concedido ✔' },
            { type: 'out', text: 'Excelente decisión. Hablemos:' },
            { type: 'out', text: `  ${SOCIALS[0].handle}` },
          ]);
          setTimeout(() => scrollToId(SECTION_FOR.social), 400);
        } else {
          print([{ type: 'dim', text: 'sudo: prueba con "sudo hire-me"' }]);
        }
        break;
      case 'coffee':
        print([{ type: 'out', text: '☕ Combustible aceptado. +10 a la productividad.' }]);
        break;
      case 'clear':
        setLines([]);
        return;
      case 'exit':
      case 'q':
        onClose();
        return;
      default:
        print([{ type: 'dim', text: `comando no encontrado: ${base}. Escribe 'help'.` }]);
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setHistory((h) => [...h, input]);
      setHistIdx(-1);
    }
    run(input);
    setInput('');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
      if (history[idx] !== undefined) {
        setHistIdx(idx);
        setInput(history[idx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = histIdx + 1;
      if (idx >= history.length) {
        setHistIdx(-1);
        setInput('');
      } else {
        setHistIdx(idx);
        setInput(history[idx]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const colorFor = (t: Line['type']) =>
    t === 'in'
      ? '#7fae5f'
      : t === 'accent'
        ? '#98c179'
        : t === 'dim'
          ? '#6b7d5e'
          : t === 'art'
            ? '#557f38'
            : '#cfe3c2';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-0 backdrop-blur-sm sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-2xl flex-col overflow-hidden border border-[#1c2a16] bg-[#070d05] font-mono shadow-2xl sm:h-[70vh] sm:rounded-xl"
            style={{ boxShadow: '0 0 80px rgba(127,174,95,0.15)' }}
          >
            {/* Chrome */}
            <div className="flex items-center justify-between border-b border-[#1c2a16] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <span className="ml-2 text-[11px] text-[#6b7d5e]">jandro — zsh — 80×24</span>
              </div>
              <button onClick={onClose} aria-label="Cerrar terminal" data-cursor="hover" className="text-[#6b7d5e] hover:text-[#cfe3c2]">
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div ref={bodyRef} className="no-scrollbar flex-1 overflow-y-auto p-4 text-[13px] leading-relaxed sm:text-sm">
              {lines.map((l, i) => (
                <pre
                  key={i}
                  className="whitespace-pre-wrap break-words"
                  style={{ color: colorFor(l.type) }}
                >
                  {l.text}
                </pre>
              ))}
              <form onSubmit={onSubmit} className="mt-1 flex items-center gap-2">
                <span className="text-[#7fae5f]">jandro@portfolio:~$</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                  className="flex-1 bg-transparent text-[#cfe3c2] caret-[#7fae5f] outline-none"
                  aria-label="Entrada de terminal"
                />
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
