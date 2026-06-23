import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ContributionGraph from '@/components/effects/ContributionGraph';

const GOLD = '#d2ab5b';
const NAVY = '#34467e';
const DEEP = '#1d2950';

interface GHUser {
  public_repos: number;
  followers: number;
  following: number;
  public_gists: number;
}

interface GHRepo {
  stargazers_count: number;
  fork: boolean;
  language: string | null;
}

function hexA(hex: string, a: number) {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function StatPill({
  value,
  label,
  delay,
}: {
  value: string | number;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-1 px-6 py-4 text-center"
      style={{
        border: `1px solid ${hexA(GOLD, 0.15)}`,
        background: hexA(DEEP, 0.6),
        borderRadius: 8,
      }}
    >
      <span
        className="font-display font-black leading-none"
        style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: GOLD }}
      >
        {value}
      </span>
      <span
        className="font-mono text-[10px] uppercase tracking-[0.3em]"
        style={{ color: hexA(GOLD, 0.45) }}
      >
        {label}
      </span>
    </motion.div>
  );
}

export default function GitHubActivity({ lang }: { lang: string }) {
  const [user, setUser] = useState<GHUser | null>(null);
  const [stars, setStars] = useState<number | null>(null);
  const [topLangs, setTopLangs] = useState<string[]>([]);

  useEffect(() => {
    const handle = 'JandroSantos';

    fetch(`https://api.github.com/users/${handle}`)
      .then((r) => r.json())
      .then((data: GHUser) => setUser(data))
      .catch(() => null);

    fetch(`https://api.github.com/users/${handle}/repos?per_page=100`)
      .then((r) => r.json())
      .then((repos: GHRepo[]) => {
        const owned = repos.filter((r) => !r.fork);
        const totalStars = owned.reduce((acc, r) => acc + r.stargazers_count, 0);
        setStars(totalStars);

        const langCount: Record<string, number> = {};
        for (const repo of owned) {
          if (repo.language) langCount[repo.language] = (langCount[repo.language] ?? 0) + 1;
        }
        const sorted = Object.entries(langCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([l]) => l);
        setTopLangs(sorted);
      })
      .catch(() => null);
  }, []);

  const isEs = lang === 'es';

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(60% 50% at 50% 50%, ${hexA(NAVY, 0.18)}, transparent 70%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-8 sm:px-16">
        {/* Label */}
        <p
          className="mb-8 font-mono text-[11px] uppercase tracking-[0.45em]"
          style={{ color: GOLD }}
        >
          {isEs ? '— ACTIVIDAD EN GITHUB' : '— GITHUB ACTIVITY'}
        </p>

        {/* Gold rule */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 h-px w-full origin-left"
          style={{ background: `linear-gradient(90deg, ${GOLD}, ${hexA(GOLD, 0.3)}, transparent)` }}
        />

        {/* GitHub stats pills */}
        <div className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatPill
            value={user ? user.public_repos : '—'}
            label={isEs ? 'Repositorios' : 'Repos'}
            delay={0}
          />
          <StatPill
            value={stars !== null ? stars : '—'}
            label={isEs ? 'Estrellas' : 'Stars'}
            delay={0.08}
          />
          <StatPill
            value={user ? user.followers : '—'}
            label={isEs ? 'Seguidores' : 'Followers'}
            delay={0.16}
          />
          <StatPill
            value={topLangs.length > 0 ? topLangs[0] : '—'}
            label={isEs ? 'Top lenguaje' : 'Top language'}
            delay={0.24}
          />
        </div>

        {/* Contribution graph */}
        <ContributionGraph
          color={GOLD}
          weeks={32}
          label={isEs ? 'contribuciones · último año' : 'contributions · last year'}
          className="rounded-lg p-6"
          style={{ background: hexA(DEEP, 0.55), border: `1px solid ${hexA(GOLD, 0.12)}` }}
        />

        {/* Top languages bar */}
        {topLangs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.9 }}
            className="mt-8 flex flex-wrap gap-2"
          >
            {topLangs.map((lang, i) => (
              <span
                key={lang}
                className="font-mono text-[11px] uppercase tracking-[0.3em]"
                style={{
                  padding: '6px 14px',
                  border: `1px solid ${hexA(GOLD, 0.25 - i * 0.04)}`,
                  color: hexA(GOLD, 0.8 - i * 0.12),
                  borderRadius: 4,
                  background: hexA(NAVY, 0.3),
                }}
              >
                {lang}
              </span>
            ))}
          </motion.div>
        )}

        {/* CTA */}
        <motion.a
          href="https://github.com/JandroSantos"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-10 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.4em] transition-opacity hover:opacity-70"
          style={{ color: GOLD }}
        >
          <span
            className="h-px w-8"
            style={{ background: GOLD }}
          />
          {isEs ? 'Ver perfil completo' : 'View full profile'}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.a>
      </div>
    </section>
  );
}
