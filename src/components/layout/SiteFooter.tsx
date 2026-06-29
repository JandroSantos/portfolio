import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, ArrowUp } from 'lucide-react';
import type { Character } from '@/data/characters';
import { CHARACTERS, getByIndex } from '@/data/characters';
import { SOCIALS } from '@/data/content';
import { PATH_FOR } from '@/data/routes';
import { useLanguage } from '@/hooks/useLanguage';
import { hexA } from '@/lib/utils';
import MagneticButton from '../ui/MagneticButton';

/**
 * Shared page footer — the premium closing of every world. A big
 * magnetic CTA chains to the *next* world (so the four pages loop),
 * then a balanced strip of socials, a back-to-top, world dots and
 * the credit line.
 */
export default function SiteFooter({ character }: { character: Character }) {
  const navigate = useNavigate();
  const { d } = useLanguage();
  const next = getByIndex(character.index + 1);
  const nextStrings = d.characters[next.key];
  const ink = character.world.bg;

  const scrollTop = () => {
    const lenis = (window as unknown as { lenis?: { scrollTo: (n: number, o?: object) => void } }).lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="relative overflow-hidden px-5 pb-10 pt-24 sm:px-10 sm:pb-12 sm:pt-32"
      style={{ background: `color-mix(in srgb, ${character.world.deep} 24%, #070707)` }}
    >
      {/* Soft top hairline + ambient glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${hexA(ink, 0.3)}, transparent)` }}
      />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[120%] -translate-x-1/2 rounded-[100%] opacity-[0.18] blur-[120px]"
        style={{ background: ink }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Eyebrow */}
        <p
          className="font-mono text-[11px] uppercase tracking-[0.3em]"
          style={{ color: ink, opacity: 0.7 }}
        >
          {d.footer.talkEyebrow}
        </p>

        {/* Next world CTA */}
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: ink, opacity: 0.55 }}>
          {String(next.index + 1).padStart(2, '0')} — {nextStrings.alias}
        </p>
        <button
          onClick={() => navigate(PATH_FOR[next.key])}
          data-cursor="hover"
          data-cursor-label={d.meta.enter}
          aria-label={`${d.meta.enter} — ${nextStrings.section}`}
          className="group mt-2 flex cursor-pointer items-center gap-4 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4"
          style={{ outlineColor: hexA(ink, 0.5) }}
        >
          <span
            className="heading-kinetic text-[clamp(2.6rem,12vw,9rem)] leading-[0.8] text-bone transition-colors duration-300"
            style={{ ['--h' as string]: next.world.bg }}
            onMouseEnter={(e) => (e.currentTarget.style.color = next.world.bg)}
            onMouseLeave={(e) => (e.currentTarget.style.color = '')}
          >
            {nextStrings.section}
          </span>
          <ArrowRight
            className="h-8 w-8 shrink-0 transition-transform duration-300 group-hover:translate-x-2 sm:h-16 sm:w-16"
            style={{ color: next.world.bg }}
          />
        </button>

        {/* Contact strip */}
        <div
          className="mt-16 flex flex-col gap-y-5 border-t pt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-10"
          style={{ borderColor: hexA(ink, 0.14) }}
        >
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
            {SOCIALS.map((s) => (
              <MagneticButton
                key={s.label}
                href={s.href}
                className="group flex cursor-pointer items-center gap-1.5 font-mono text-sm uppercase tracking-[0.18em]"
                style={{ color: ink }}
                cursorLabel={s.handle}
                ariaLabel={`${s.label} — ${s.handle}`}
              >
                {s.label}
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </MagneticButton>
            ))}
          </div>

          {/* Back to top */}
          <button
            onClick={scrollTop}
            data-cursor="hover"
            aria-label={d.footer.backToTop}
            className="group inline-flex cursor-pointer items-center gap-2 self-start rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 sm:self-auto"
            style={{
              color: ink,
              borderColor: hexA(ink, 0.24),
              background: hexA(ink, 0.06),
              outlineColor: hexA(ink, 0.5),
            }}
          >
            <ArrowUp size={13} strokeWidth={2.5} className="transition-transform duration-200 group-hover:-translate-y-0.5" />
            {d.footer.backToTop.replace(/^[↑\s]+/, '')}
          </button>
        </div>

        {/* Baseline: credits · egg hint · world dots */}
        <div className="mt-12 flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="font-mono text-[11px]" style={{ color: ink, opacity: 0.6 }}>
            © {new Date().getFullYear()} Jandro Santos · {d.footer.credits}
          </p>

          <p className="order-last font-mono text-[10px] opacity-40 sm:order-none" style={{ color: ink }}>
            {d.footer.eggHint.lead}{' '}
            <kbd className="rounded border px-1 py-0.5 text-[9px]" style={{ borderColor: hexA(ink, 0.4) }}>
              ⌘K
            </kbd>{' '}
            {d.footer.eggHint.or}{' '}
            <span className="opacity-70">{d.footer.eggHint.type}</span>
          </p>

          <div className="flex items-center gap-2.5">
            {CHARACTERS.map((c) => {
              const isActive = c.key === character.key;
              return (
                <button
                  key={c.key}
                  onClick={() => navigate(PATH_FOR[c.key])}
                  aria-label={c.alias}
                  aria-current={isActive ? 'page' : undefined}
                  data-cursor="hover"
                  className="group grid h-6 w-6 cursor-pointer place-items-center rounded-full transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ outlineColor: hexA(c.world.bg, 0.6) }}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full transition-transform duration-200 group-hover:scale-125"
                    style={{
                      background: c.world.bg,
                      opacity: isActive ? 1 : 0.4,
                      boxShadow: isActive ? `0 0 0 3px ${hexA(c.world.bg, 0.22)}` : 'none',
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
