import { ArrowUpRight, TerminalSquare } from 'lucide-react';
import { CHARACTERS } from '@/data/characters';
import { SOCIALS } from '@/data/content';
import { useLanguage } from '@/hooks/useLanguage';
import { scrollToId } from '@/lib/scroll';

const social = CHARACTERS[0];

export default function Footer({ onOpenTerminal }: { onOpenTerminal: () => void }) {
  const { d } = useLanguage();
  const f = d.footer;

  return (
    <footer
      id="contact"
      className="grain relative overflow-hidden px-5 pb-10 pt-24 sm:px-10 sm:pt-32"
      style={{ background: `color-mix(in srgb, ${social.world.bg} 14%, #080808)` }}
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-bone-dim">
          {f.talkEyebrow}
        </p>

        <a
          href={SOCIALS[0].href}
          data-cursor="hover"
          data-cursor-label="Email"
          className="group mt-4 inline-flex items-start gap-3"
        >
          <h2
            className="heading-kinetic text-[clamp(3rem,16vw,12rem)] leading-[0.8] text-bone transition-colors group-hover:text-[var(--accent)]"
            style={{ ['--accent' as string]: social.world.bg }}
          >
            LET&apos;S<br />TALK
          </h2>
          <ArrowUpRight
            className="mt-2 h-8 w-8 shrink-0 transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-2 sm:h-14 sm:w-14"
            style={{ color: social.world.bg }}
          />
        </a>

        {/* Links row */}
        <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink-line pt-8">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              data-cursor="hover"
              className="font-mono text-sm uppercase tracking-wider text-bone-dim transition-colors hover:text-bone"
            >
              {s.label}
            </a>
          ))}
        </div>

        {/* Bottom row */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] text-bone-dim">
            © {new Date().getFullYear()} Jandro Santos · {f.credits}
          </p>
          <button
            onClick={onOpenTerminal}
            data-cursor="hover"
            data-cursor-label="Run"
            className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-bone-dim transition-colors hover:text-bone"
          >
            <TerminalSquare size={14} />
            <span>
              {f.eggHint.lead}{' '}
              <kbd className="rounded bg-ink-line px-1.5 py-0.5 text-bone">↑↑↓↓←→←→ B A</kbd>{' '}
              {f.eggHint.or} <span className="text-bone">{f.eggHint.type}</span>
            </span>
          </button>
        </div>

        {/* Back to top */}
        <button
          onClick={() => scrollToId('hero')}
          data-cursor="hover"
          className="mt-8 font-mono text-[11px] uppercase tracking-widest text-bone-dim transition-colors hover:text-bone"
        >
          {f.backToTop}
        </button>
      </div>
    </footer>
  );
}
