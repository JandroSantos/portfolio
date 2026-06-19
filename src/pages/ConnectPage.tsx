import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { CHARACTERS } from '@/data/characters';
import { SOCIALS } from '@/data/content';
import { useLanguage } from '@/hooks/useLanguage';
import PageShell from '@/components/layout/PageShell';
import Magnet from '@/components/ui/Magnet';

const social = CHARACTERS[0];

export default function ConnectPage() {
  const { d, lang } = useLanguage();
  const c = d.connect;
  const w = social.world;

  const coverRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: coverScroll } = useScroll({
    target: coverRef,
    offset: ['start start', 'end start'],
  });
  const coverY = useTransform(coverScroll, [0, 1], [0, -120]);
  const coverScale = useTransform(coverScroll, [0, 1], [1, 1.08]);
  const coverOpacity = useTransform(coverScroll, [0.6, 1], [1, 0]);

  return (
    <PageShell character={social} background="#0a0503">

      {/* ══ COVER — magazine poster ══════════════════════════════════ */}
      <div ref={coverRef} className="relative h-[100svh] overflow-hidden">
        {/* Full-bleed coral wash */}
        <motion.div
          style={{ scale: coverScale, background: `linear-gradient(160deg, ${w.bg}22 0%, transparent 60%), #0a0503` }}
          className="absolute inset-0"
        />

        {/* Giant rotated "HOLA." bleeds off screen */}
        <motion.div
          style={{ y: coverY, opacity: coverOpacity }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <span
            className="heading-kinetic select-none text-[clamp(8rem,32vw,28rem)] leading-none"
            style={{ color: `${w.bg}18`, rotate: '-8deg', display: 'block', transform: 'rotate(-8deg)' }}
          >
            HOLA.
          </span>
        </motion.div>

        {/* Figurine — left-weighted */}
        <motion.div
          style={{ y: coverY, opacity: coverOpacity }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 lg:left-[15%] lg:translate-x-0"
        >
          <Magnet padding={160} strength={5} className="h-[70svh]">
            <motion.img
              layoutId="world-figurine"
              src={social.image}
              alt="The Connector"
              draggable={false}
              className="h-full w-auto select-none object-contain object-bottom"
              style={{ filter: `drop-shadow(0 0 80px ${w.bg}44)` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </Magnet>
        </motion.div>

        {/* Editorial top-right copy */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-6 top-32 max-w-[260px] text-right sm:right-12 sm:top-40"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.4em]" style={{ color: w.bg }}>
            {c.eyebrow}
          </p>
          <h1 className="mt-2 font-display text-6xl uppercase leading-[0.85] text-bone sm:text-8xl">
            {c.title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-bone/60">
            {c.intro}
          </p>
        </motion.div>

        {/* Bottom strip: NOW status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="absolute bottom-0 left-0 right-0 flex items-center gap-4 border-t px-6 py-4 sm:px-12"
          style={{ borderColor: `${w.bg}30`, background: `${w.bg}0c` }}
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute h-full w-full animate-ping rounded-full" style={{ background: w.bg, opacity: 0.6 }} />
            <span className="relative h-2 w-2 rounded-full" style={{ background: w.bg }} />
          </span>
          <p className="font-mono text-[11px] leading-snug text-bone/70">{c.now}</p>
        </motion.div>
      </div>

      {/* ══ PULL QUOTES — editorial spreads ═════════════════════════ */}
      {c.bio.map((para, i) => (
        <PullQuote key={i} text={para} index={i} color={w.bg} reverse={i % 2 === 1} />
      ))}

      {/* ══ FACTS — scattered stickers ═══════════════════════════════ */}
      <section className="relative overflow-hidden py-24 sm:py-36" style={{ background: `${w.bg}08` }}>
        <div className="mx-auto max-w-6xl px-6 sm:px-12">
          <p className="mb-16 font-mono text-[11px] uppercase tracking-[0.4em]" style={{ color: w.bg }}>
            {lang === 'es' ? '— Datos' : '— Facts'}
          </p>
          <div className="flex flex-wrap gap-4">
            {c.facts.map((f, i) => {
              const rotations = [-3, 2, -1, 4];
              return (
                <motion.div
                  key={f.k}
                  initial={{ opacity: 0, y: 40, rotate: rotations[i] - 4 }}
                  whileInView={{ opacity: 1, y: 0, rotate: rotations[i] }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.06, rotate: rotations[i] + 2, zIndex: 10 }}
                  className="relative cursor-default rounded-xl border p-5 backdrop-blur-sm"
                  style={{
                    background: `${w.bg}15`,
                    borderColor: `${w.bg}40`,
                    minWidth: 140,
                  }}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: w.bg }}>{f.k}</p>
                  <p className="mt-1 text-xl font-bold text-bone">{f.v}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ VALUES — horizontal ticker cards ═════════════════════════ */}
      <section className="py-24 sm:py-36">
        <div className="mx-auto max-w-6xl px-6 sm:px-12">
          <p className="mb-12 font-mono text-[11px] uppercase tracking-[0.4em]" style={{ color: w.bg }}>
            {lang === 'es' ? '— Cómo trabajo' : '— How I work'}
          </p>
          <div className="space-y-px">
            {c.values.map((v, i) => (
              <motion.div
                key={v.label}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-center justify-between gap-8 border-t py-8 transition-colors"
                style={{ borderColor: `${w.bg}25` }}
              >
                <div className="flex items-center gap-6">
                  <span className="font-mono text-[11px] text-bone/30">0{i + 1}</span>
                  <h3
                    className="font-display text-[clamp(2rem,8vw,6rem)] uppercase leading-none text-bone transition-colors duration-300 group-hover:text-[color:var(--c)]"
                    style={{ ['--c' as string]: w.bg }}
                  >
                    {v.label}
                  </h3>
                </div>
                <p className="hidden max-w-xs text-sm leading-relaxed text-bone/50 sm:block">{v.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT — big CTA poster ══════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-36 sm:py-48"
        style={{ background: w.bg }}
      >
        <div className="mx-auto max-w-6xl px-6 sm:px-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em]" style={{ color: w.ink, opacity: 0.6 }}>
            {c.cta.lead}
          </p>
          <motion.a
            href={SOCIALS[0].href}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 block font-display text-[clamp(2rem,11vw,9rem)] uppercase leading-[0.85] transition-opacity hover:opacity-70"
            style={{ color: w.ink }}
            data-cursor="hover"
            data-cursor-label={c.cta.button}
          >
            {SOCIALS[0].handle}
          </motion.a>
          <div className="mt-16 flex flex-wrap gap-8">
            {SOCIALS.slice(1).map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm uppercase tracking-wider underline underline-offset-4 transition-opacity hover:opacity-70"
                style={{ color: w.ink, opacity: 0.7 }}
              >
                {s.label} ↗
              </a>
            ))}
          </div>
        </div>

        {/* Decorative giant number */}
        <span
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-8 font-display text-[clamp(12rem,40vw,36rem)] leading-none opacity-10 select-none"
          style={{ color: w.ink }}
        >
          01
        </span>
      </section>
    </PageShell>
  );
}

function PullQuote({ text, index, color, reverse }: { text: string; index: number; color: string; reverse: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], reverse ? [60, -60] : [-60, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-12">
        <motion.p
          style={{ x, opacity }}
          className={`text-balance font-display text-[clamp(1.6rem,4.5vw,3.8rem)] uppercase leading-[1.1] text-bone ${reverse ? 'text-right' : 'text-left'}`}
        >
          "{text}"
        </motion.p>
        <motion.span
          style={{ opacity, color }}
          className={`mt-4 block font-mono text-[11px] uppercase tracking-[0.3em] ${reverse ? 'text-right' : 'text-left'}`}
        >
          — {index === 0 ? (text.includes('Tengo') ? 'Sobre mí' : 'About me') : (text.includes('Fui') ? 'Experiencia' : 'Experience')}
        </motion.span>
      </div>
    </div>
  );
}
