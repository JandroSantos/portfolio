import type { ReactNode } from 'react';
import type { World } from '@/data/characters';
import FadeIn from '@/components/ui/FadeIn';
import DecodeText from '@/components/ui/DecodeText';
import Magnet from '@/components/ui/Magnet';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';

interface WorldHeroProps {
  world: World;
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  /** Slot for content below the intro (status pill, CTAs, etc.) */
  children?: ReactNode;
}

/**
 * The two-column hero shared by all four world pages.
 * Left: eyebrow + kinetic title + intro + slot.
 * Right: magnetic figurine on a glowing pedestal.
 */
export default function WorldHero({
  world: w,
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  children,
}: WorldHeroProps) {
  const { lang } = useLanguage();

  return (
    <section className="relative mx-auto grid min-h-[100svh] max-w-6xl items-center gap-8 px-5 pt-28 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Left: copy */}
      <div className="relative z-10">
        <FadeIn>
          <span
            className="font-mono text-[11px] uppercase tracking-[0.3em]"
            style={{ color: w.bg }}
          >
            {eyebrow}
          </span>
        </FadeIn>

        <h1 className="heading-kinetic mt-3 text-[clamp(3.5rem,15vw,11rem)] leading-[0.82] text-bone">
          <span className="block">{title}</span>
        </h1>

        <FadeIn delay={0.15} className="mt-6 max-w-md">
          <DecodeText
            text={intro}
            trigger={lang}
            className="text-balance text-lg leading-relaxed text-bone-dim sm:text-xl"
          />
        </FadeIn>

        {children && <FadeIn delay={0.25}>{children}</FadeIn>}
      </div>

      {/* Right: figurine */}
      <div className="relative flex h-[50vh] items-end justify-center lg:h-[80vh]">
        <div
          aria-hidden
          className="absolute bottom-0 h-[70%] w-[70%] rounded-full blur-[80px]"
          style={{ background: w.deep, opacity: 0.5 }}
        />
        <Magnet padding={220} strength={6} className="h-full">
          <motion.img
            layoutId="world-figurine"
            src={image}
            alt={imageAlt}
            draggable={false}
            className="h-full w-auto select-none object-contain object-bottom"
            style={{ filter: `drop-shadow(0 40px 60px ${w.deep}88)` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </Magnet>
      </div>
    </section>
  );
}
