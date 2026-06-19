import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { CHARACTERS } from '@/data/characters';
import { SOCIALS } from '@/data/content';
import { useLanguage } from '@/hooks/useLanguage';
import PageShell from '@/components/layout/PageShell';
import FadeIn from '@/components/ui/FadeIn';
import Marquee from '@/components/ui/Marquee';
import Magnet from '@/components/ui/Magnet';
import MagneticButton from '@/components/ui/MagneticButton';
import DecodeText from '@/components/ui/DecodeText';
import NetworkConstellation from '@/components/effects/NetworkConstellation';

const social = CHARACTERS[0];

/**
 * The Connector — warm, editorial. Big friendly type, a greeting
 * marquee, the human facts and an open invitation to talk.
 */
export default function ConnectPage() {
  const { d, lang } = useLanguage();
  const c = d.connect;
  const w = social.world;

  return (
    <PageShell character={social}>
      {/* ---- Hero ---- */}
      <section className="relative mx-auto grid min-h-[100svh] max-w-6xl items-center gap-8 px-5 pt-28 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative z-10">
          <FadeIn>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: w.bg }}>
              {c.eyebrow}
            </span>
          </FadeIn>
          <h1 className="heading-kinetic mt-3 text-[clamp(3.5rem,15vw,11rem)] leading-[0.82] text-bone">
            <span className="block">{c.title}</span>
          </h1>
          <FadeIn delay={0.15} className="mt-6 max-w-md">
            <DecodeText
              text={c.intro}
              trigger={lang}
              className="text-balance text-lg leading-relaxed text-bone-dim sm:text-xl"
            />
          </FadeIn>

          {/* Now status */}
          <FadeIn delay={0.25} className="mt-8 inline-flex items-center gap-3 rounded-full border px-4 py-2.5"
            style={{ borderColor: `${w.bg}40`, background: `${w.bg}12` }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: w.bg }} />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: w.bg }} />
            </span>
            <span className="text-sm text-bone">{c.now}</span>
          </FadeIn>
        </div>

        {/* Figure */}
        <div className="relative flex h-[50vh] items-end justify-center lg:h-[80vh]">
          <div aria-hidden className="absolute bottom-0 h-[70%] w-[70%] rounded-full blur-[80px]" style={{ background: w.deep, opacity: 0.5 }} />
          <Magnet padding={220} strength={6} className="h-full">
            <motion.img
              src={social.image}
              alt={d.characters.social.alias}
              draggable={false}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="h-full w-auto select-none object-contain object-bottom"
              style={{ filter: `drop-shadow(0 40px 60px ${w.deep}88)` }}
            />
          </Magnet>
        </div>
      </section>

      {/* Greeting marquee */}
      <div className="border-y py-5" style={{ borderColor: `${w.bg}26`, background: `${w.bg}0a` }}>
        <Marquee duration={24}>
          {['HOLA', 'HELLO', 'CIAO', 'OLÁ', 'SALUT', 'こんにちは', '안녕'].map((g, i) => (
            <span key={i} className="heading-kinetic text-[clamp(1.5rem,5vw,3rem)]" style={{ color: i % 2 ? w.bg : 'var(--color-bone)' }}>
              {g} <span style={{ color: w.bg }}>·</span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* ---- Bio + facts ---- */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <div className="space-y-7 border-l-2 pl-6 sm:pl-8" style={{ borderColor: `${w.bg}55` }}>
            {c.bio.map((para, i) => (
              <FadeIn key={i} delay={i * 0.1} y={28}>
                <p className="text-balance text-[clamp(1.3rem,3.2vw,2.1rem)] font-medium leading-[1.32] text-bone">
                  {para}
                </p>
              </FadeIn>
            ))}
          </div>

          {/* Facts */}
          <div className="grid grid-cols-2 gap-3 self-start">
            {c.facts.map((f, i) => (
              <FadeIn
                key={f.k}
                delay={0.1 + i * 0.06}
                y={20}
                className="rounded-2xl border border-ink-line bg-ink-soft/50 p-5 backdrop-blur-sm"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: w.bg }}>{f.k}</p>
                <p className="mt-2 text-base font-semibold text-bone">{f.v}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Live network ---- */}
      <section className="relative mx-auto max-w-6xl px-5 pb-24 sm:px-8 sm:pb-28">
        <div
          className="relative overflow-hidden rounded-3xl border"
          style={{ borderColor: `${w.bg}33`, background: `${w.bg}0a` }}
        >
          <NetworkConstellation
            color={w.bg}
            labels={c.values.map((v) => v.label)}
            className="h-[340px] w-full sm:h-[440px]"
          />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-bone-dim">
              {lang === 'es' ? 'Mueve el cursor' : 'Move your cursor'}
            </span>
            <p className="mt-2 max-w-sm px-6 text-balance font-display text-2xl uppercase leading-tight text-bone sm:text-3xl">
              {lang === 'es' ? 'Todo es una red' : "It's all a network"}
            </p>
          </div>
        </div>
      </section>

      {/* ---- Values ---- */}
      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="grid gap-4 sm:grid-cols-3">
          {c.values.map((v, i) => (
            <FadeIn
              key={v.label}
              delay={i * 0.08}
              y={24}
              className="group rounded-2xl border border-ink-line bg-ink-soft/40 p-6 transition-colors"
            >
              <span className="font-mono text-sm" style={{ color: w.bg }}>0{i + 1}</span>
              <h3 className="mt-3 font-display text-2xl uppercase tracking-wide text-bone">{v.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-bone-dim">{v.note}</p>
              <div className="mt-4 h-0.5 w-0 transition-all duration-500 group-hover:w-full" style={{ background: w.bg }} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="mx-auto max-w-6xl px-5 pb-28 text-center sm:px-8">
        <FadeIn>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-bone-dim">{c.cta.lead}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <MagneticButton
              href={SOCIALS[0].href}
              className="flex items-center gap-2 rounded-full px-7 py-4 font-display text-xl uppercase"
              style={{ background: w.bg, color: w.ink }}
              cursorLabel="Email"
            >
              {c.cta.button}
              <ArrowUpRight size={20} />
            </MagneticButton>
          </div>
        </FadeIn>
      </section>
    </PageShell>
  );
}
