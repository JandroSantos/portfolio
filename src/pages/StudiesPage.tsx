import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { CHARACTERS } from '@/data/characters';
import { useLanguage } from '@/hooks/useLanguage';
import PageShell from '@/components/layout/PageShell';

const nerd = CHARACTERS[3];

const GREEN = '#7fae5f';

/* ─── Boot sequence lines ─────────────────────────────────────────── */
const BOOT_LINES = [
  'BIOS v2.4.1  [OK]',
  'Loading kernel modules...  [OK]',
  'Mounting filesystems...  [OK]',
  'Starting jandro.dev...  [OK]',
];

/* ─── Terminal line component ─────────────────────────────────────── */
function TermLine({
  children,
  delay,
  className = '',
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.01 }}
      className={`font-mono ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ─── Prompt line ─────────────────────────────────────────────────── */
function Prompt({ cmd, delay }: { cmd: string; delay: number }) {
  return (
    <TermLine delay={delay} className="mt-5 flex items-center gap-0 text-sm leading-tight">
      <span style={{ color: `${GREEN}90` }}>jandro</span>
      <span style={{ color: '#ffffff30' }}>@</span>
      <span style={{ color: `${GREEN}70` }}>dev</span>
      <span style={{ color: '#ffffff30' }}>:~$</span>
      <span className="ml-2 text-bone/80">{cmd}</span>
    </TermLine>
  );
}

/* ─── Output block ────────────────────────────────────────────────── */
function Output({
  lines,
  delay,
  color = GREEN,
}: {
  lines: string[];
  delay: number;
  color?: string;
}) {
  return (
    <div className="mt-1 space-y-[2px] pl-2">
      {lines.map((line, i) => (
        <TermLine
          key={i}
          delay={delay + i * 0.04}
          className="text-sm leading-snug"
          style={{ color: `${color}cc` } as React.CSSProperties}
        >
          {line}
        </TermLine>
      ))}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */
export default function StudiesPage() {
  const { d, lang } = useLanguage();
  const s = d.studies;
  const w = nerd.world;

  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  /* timing offsets (seconds) */
  const T_BOOT_START = 0.1;
  const T_BOOT_END = T_BOOT_START + BOOT_LINES.length * 0.18 + 0.4;
  const T_CMD1 = T_BOOT_END + 0.3;
  const T_CMD1_OUT = T_CMD1 + 0.25;
  const T_CMD2 = T_CMD1_OUT + 0.5;
  const T_CMD2_OUT = T_CMD2 + 0.25;
  const T_CMD3 = T_CMD2_OUT + s.items.length * 0.1 + 0.5;
  const T_CMD3_OUT = T_CMD3 + 0.25;
  const T_CMD4 = T_CMD3_OUT + s.skills.length * 0.1 + 0.5;
  const T_CMD4_OUT = T_CMD4 + 0.25;
  const T_CMD5 = T_CMD4_OUT + s.skills.flatMap((g) => g.items).length * 0.05 + 0.5;
  const T_CMD5_OUT = T_CMD5 + 0.25;
  const T_CMD6 = T_CMD5_OUT + s.learning.length * 0.1 + 0.5;
  const T_CMD6_OUT = T_CMD6 + 0.25;
  const T_CURSOR = T_CMD6_OUT + 0.6;

  const studyLines = s.items.map(
    (it) =>
      `  ${it.org.padEnd(28)} ${it.title.slice(0, 40)}${it.title.length > 40 ? '…' : ''}   [${it.period.toUpperCase()}]`,
  );

  const lsLines = [
    'total 4',
    ...s.skills.map(
      (g) =>
        `  drwxr-xr-x  ${g.items.length.toString().padEnd(3)} jandro  dev   ${g.label.toLowerCase()}/`,
    ),
  ];

  const frontendLines = s.skills
    .find((g) => g.label.toLowerCase().includes(lang === 'es' ? 'frontend' : 'frontend'))
    ?.items.map((i) => `  > ${i}`) ?? [];

  const allSkillLines = s.skills.flatMap((g) => [
    `  # ${g.label.toUpperCase()}`,
    ...g.items.map((i) => `    > ${i}`),
  ]);

  const learningLines = s.learning.map((l, i) => {
    const tags = ['[installed]', '[installing...]', '[queued]', '[queued]'];
    return `  ${l.padEnd(32)} ${tags[i] ?? '[queued]'}`;
  });

  const whoamiOut =
    lang === 'es'
      ? ['  > Jandro Santos — Developer & AI Engineer', '  > España · 21 años · remoto']
      : ['  > Jandro Santos — Developer & AI Engineer', '  > Spain · 21 y/o · remote'];

  return (
    <PageShell character={nerd} background="#020a02">

      {/* CRT scanlines overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60]"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.13) 2px, rgba(0,0,0,0.13) 4px)',
        }}
      />

      {/* CRT vignette */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[59]"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.72) 100%)',
        }}
      />

      {/* ══ MAIN TERMINAL CONTAINER ═════════════════════════════════ */}
      <div className="relative mx-auto min-h-screen max-w-5xl px-4 pb-32 pt-28 sm:px-8 sm:pt-36">

        {/* Figurine — floating right with phosphor glow */}
        <div className="pointer-events-none absolute right-4 top-32 hidden xl:block" aria-hidden>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: T_CURSOR, duration: 0.5 }}
            style={{ filter: `drop-shadow(0 0 30px ${GREEN}55)` }}
          >
            <motion.img
              layoutId="world-figurine"
              src={nerd.image}
              alt="The Student"
              draggable={false}
              className="h-[55vh] w-auto select-none object-contain object-bottom"
              style={{ filter: `drop-shadow(0 0 60px ${GREEN}44) sepia(0.4) hue-rotate(60deg) saturate(0.6) brightness(0.9)` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
        </div>

        {/* Terminal box */}
        <div
          className="relative min-h-[70vh] rounded-sm p-6 sm:p-10"
          style={{
            background: '#010801',
            boxShadow: `0 0 120px ${GREEN}22, inset 0 0 60px rgba(0,0,0,0.4)`,
            border: `1px solid ${GREEN}22`,
          }}
        >
          {/* Terminal title bar */}
          <div
            className="absolute left-0 right-0 top-0 flex items-center gap-3 rounded-t-sm border-b px-4 py-2"
            style={{ borderColor: `${GREEN}20`, background: `${GREEN}08` }}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#ff5f57' }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#febc2e' }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#28c840' }} />
            <span
              className="ml-3 font-mono text-[10px] uppercase tracking-[0.3em]"
              style={{ color: `${GREEN}50` }}
            >
              jandro@dev — {s.eyebrow}
            </span>
          </div>

          <div className="mt-8 space-y-0">

            {/* ── BOOT SEQUENCE ─────────────────────────────────────── */}
            <div className="space-y-[3px]">
              {BOOT_LINES.map((line, i) => (
                <TermLine
                  key={i}
                  delay={T_BOOT_START + i * 0.18}
                  className="text-xs leading-relaxed"
                  style={{ color: `${GREEN}55` } as React.CSSProperties}
                >
                  {line}
                </TermLine>
              ))}
            </div>

            <div className="mt-4 border-b" style={{ borderColor: `${GREEN}20` }} />

            {/* ── whoami ───────────────────────────────────────────── */}
            <Prompt cmd="whoami" delay={T_CMD1} />
            <Output lines={whoamiOut} delay={T_CMD1_OUT} />

            {/* ── cat studies.txt ───────────────────────────────────── */}
            <Prompt
              cmd={lang === 'es' ? 'cat estudios.txt' : 'cat studies.txt'}
              delay={T_CMD2}
            />
            <div className="mt-1 pl-2">
              <TermLine delay={T_CMD2_OUT} className="mb-1 text-xs" style={{ color: `${GREEN}45` } as React.CSSProperties}>
                {lang === 'es' ? '  # formación académica' : '  # academic background'}
              </TermLine>
              {s.items.map((it, i) => (
                <TermLine
                  key={it.title}
                  delay={T_CMD2_OUT + 0.1 + i * 0.1}
                  className="text-sm leading-snug"
                  style={{ color: `${GREEN}cc` } as React.CSSProperties}
                >
                  <span style={{ color: `${GREEN}55` }}>  {'>'} </span>
                  <span className="text-bone/70">{it.org}</span>
                  <span style={{ color: `${GREEN}40` }}> · </span>
                  <span>{it.title}</span>
                  <span className="ml-2 text-xs" style={{ color: `${GREEN}50` }}>
                    [{it.period.toUpperCase()}]
                  </span>
                </TermLine>
              ))}
            </div>

            {/* ── ls -la skills/ ───────────────────────────────────── */}
            <Prompt
              cmd={lang === 'es' ? 'ls -la habilidades/' : 'ls -la skills/'}
              delay={T_CMD3}
            />
            <div className="mt-1 pl-2">
              {lsLines.map((line, i) => (
                <TermLine
                  key={i}
                  delay={T_CMD3_OUT + i * 0.08}
                  className="text-sm leading-snug"
                  style={{ color: i === 0 ? `${GREEN}45` : `${GREEN}cc` } as React.CSSProperties}
                >
                  {i === 0 ? (
                    <span style={{ color: `${GREEN}45` }}>{line}</span>
                  ) : (
                    <span>
                      <span style={{ color: `${GREEN}50` }}>  drwxr-xr-x </span>
                      <span style={{ color: `${GREEN}70` }}>
                        {s.skills[i - 1]?.items.length ?? 0}
                      </span>
                      <span style={{ color: `${GREEN}45` }}> jandro dev </span>
                      <span style={{ color: GREEN }}>
                        {s.skills[i - 1]?.label.toLowerCase()}/
                      </span>
                    </span>
                  )}
                </TermLine>
              ))}
            </div>

            {/* ── cat skills/*.txt (all skills) ────────────────────── */}
            <Prompt
              cmd={lang === 'es' ? 'cat habilidades/*.txt' : 'cat skills/*.txt'}
              delay={T_CMD4}
            />
            <div className="mt-1 pl-2 space-y-[2px]">
              {s.skills.map((group, gi) => (
                <div key={group.label} className="mt-2">
                  <TermLine
                    delay={T_CMD4_OUT + gi * 0.15}
                    className="text-xs"
                    style={{ color: `${GREEN}55` } as React.CSSProperties}
                  >
                    {`  # ${group.label.toUpperCase()}`}
                  </TermLine>
                  <TermLine
                    delay={T_CMD4_OUT + gi * 0.15 + 0.08}
                    className="text-sm leading-snug"
                    style={{ color: `${GREEN}cc` } as React.CSSProperties}
                  >
                    {'  > '}{group.items.join('  ·  ')}
                  </TermLine>
                </div>
              ))}
            </div>

            {/* ── apt list learning ────────────────────────────────── */}
            <Prompt
              cmd={
                lang === 'es'
                  ? 'apt list --installed 2>/dev/null | grep aprendiendo'
                  : 'apt list --installed 2>/dev/null | grep learning'
              }
              delay={T_CMD5}
            />
            <div className="mt-1 pl-2">
              <TermLine delay={T_CMD5_OUT} className="mb-1 text-xs" style={{ color: `${GREEN}40` } as React.CSSProperties}>
                {lang === 'es' ? '  # en progreso ahora mismo:' : '  # currently in progress:'}
              </TermLine>
              {s.learning.map((l, i) => {
                const statuses = ['[installed]', '[installing...]', '[queued]', '[queued]'];
                const statusColors = [`${GREEN}cc`, `${GREEN}80`, `${GREEN}50`, `${GREEN}50`];
                return (
                  <TermLine
                    key={l}
                    delay={T_CMD5_OUT + 0.1 + i * 0.12}
                    className="flex items-baseline gap-3 text-sm leading-snug"
                    style={{ color: `${GREEN}cc` } as React.CSSProperties}
                  >
                    <span style={{ color: `${GREEN}50` }}>  {'>'}</span>
                    <span className="w-52">{l}</span>
                    <span className="font-mono text-xs" style={{ color: statusColors[i] ?? `${GREEN}40` }}>
                      {statuses[i] ?? '[queued]'}
                    </span>
                  </TermLine>
                );
              })}
            </div>

            {/* ── portrait (mobile figurine fallback) ─────────────── */}
            <div className="xl:hidden">
              <Prompt cmd="cat portrait.ascii" delay={T_CMD6} />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: T_CMD6_OUT, duration: 0.5 }}
                className="mt-4 pl-4"
              >
                <motion.img
                  layoutId="world-figurine"
                  src={nerd.image}
                  alt="The Student"
                  draggable={false}
                  className="h-48 w-auto select-none object-contain object-bottom"
                  style={{
                    filter: `drop-shadow(0 0 30px ${GREEN}44) sepia(0.4) hue-rotate(60deg) saturate(0.6) brightness(0.9)`,
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.div>
            </div>

            {/* ── Blinking cursor ──────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: T_CURSOR, duration: 0.01 }}
              className="mt-5 flex items-center gap-0 font-mono text-sm"
            >
              <span style={{ color: `${GREEN}90` }}>jandro</span>
              <span style={{ color: '#ffffff30' }}>@</span>
              <span style={{ color: `${GREEN}70` }}>dev</span>
              <span style={{ color: '#ffffff30' }}>:~$</span>
              <motion.span
                className="ml-2 inline-block h-[1.1em] w-2 align-bottom"
                style={{ background: GREEN }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'steps(1)' }}
              />
            </motion.div>

          </div>
        </div>
      </div>

    </PageShell>
  );
}
