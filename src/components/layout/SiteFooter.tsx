import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import type { Character } from '@/data/characters';
import { CHARACTERS, getByIndex } from '@/data/characters';
import { SOCIALS } from '@/data/content';
import { PATH_FOR } from '@/data/routes';
import { useLanguage } from '@/hooks/useLanguage';
import MagneticButton from '../ui/MagneticButton';

/**
 * Shared page footer. Surfaces the contact links and a big magnetic
 * CTA to the *next* world, so the four pages chain into a loop.
 */
export default function SiteFooter({ character }: { character: Character }) {
  const navigate = useNavigate();
  const { d } = useLanguage();
  const next = getByIndex(character.index + 1);
  const nextStrings = d.characters[next.key];
  const ink = character.world.ink;

  return (
    <footer
      className="relative overflow-hidden px-5 pb-12 pt-24 sm:px-10 sm:pt-32"
      style={{ background: `color-mix(in srgb, ${character.world.deep} 24%, #070707)` }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Next world */}
        <p className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: ink, opacity: 0.7 }}>
          {String(next.index + 1).padStart(2, '0')} — {nextStrings.alias}
        </p>
        <button
          onClick={() => navigate(PATH_FOR[next.key])}
          data-cursor="hover"
          data-cursor-label={d.meta.enter}
          className="group mt-3 flex items-center gap-4"
        >
          <span
            className="heading-kinetic text-[clamp(2.6rem,12vw,9rem)] leading-[0.8] text-bone transition-colors"
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
        <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4 border-t pt-8" style={{ borderColor: `${ink}1f` }}>
          {SOCIALS.map((s) => (
            <MagneticButton
              key={s.label}
              href={s.href}
              className="group flex items-center gap-1.5 font-mono text-sm uppercase tracking-wider"
              style={{ color: ink }}
              cursorLabel={s.label}
            >
              {s.label}
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticButton>
          ))}
        </div>

        {/* Dots to the other worlds */}
        <div className="mt-10 flex items-center justify-between">
          <p className="font-mono text-[11px]" style={{ color: ink, opacity: 0.6 }}>
            © {new Date().getFullYear()} Jandro Santos
          </p>
          <div className="flex gap-2">
            {CHARACTERS.map((c) => (
              <button
                key={c.key}
                onClick={() => navigate(PATH_FOR[c.key])}
                aria-label={c.alias}
                data-cursor="hover"
                className="h-2.5 w-2.5 rounded-full transition-transform hover:scale-125"
                style={{
                  background: c.world.bg,
                  opacity: c.key === character.key ? 1 : 0.4,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
