import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, ArrowLeft, Mail, ExternalLink } from 'lucide-react';
import { PROFILE, SOCIALS } from '@/data/content';
import { useLanguage } from '@/hooks/useLanguage';

const EXPERIENCE = [
  {
    role: 'Responsable de Departamento de IA',
    org: 'Empresa',
    period: '2024 — 2025',
    highlights: [
      'Diseño de agentes y servidores MCP a medida',
      'Prompting de producción y evaluación de modelos',
      'Puente entre negocio e implementación técnica',
    ],
  },
  {
    role: 'Frontend Developer',
    org: 'Proyectos & Freelance',
    period: '2023 — Presente',
    highlights: [
      'Interfaces con React, Svelte y Tailwind',
      'Integración de APIs y estados complejos',
      'Diseño guiado por experiencia y rendimiento',
    ],
  },
];

const EDUCATION = [
  { title: 'Grado Superior en DAW', org: 'Formación Profesional', period: 'Finalizado' },
  { title: 'Bachillerato', org: 'Enseñanza Secundaria', period: 'Completado' },
];

const SKILLS = [
  { label: 'Frontend', items: ['React', 'Svelte', 'TypeScript', 'Tailwind', 'Framer Motion'] },
  { label: 'Backend', items: ['Python', 'Node.js', 'REST APIs'] },
  { label: 'AI / ML', items: ['MCP', 'LLM Agents', 'Prompting', 'Evaluation'] },
  { label: 'Tools', items: ['Vite', 'Git', 'Vercel', 'Figma'] },
  { label: 'Languages', items: ['Spanish (native)', 'English B2'] },
];

export default function CvPage() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  // Print-friendly: remove everything except content on print
  useEffect(() => {
    document.title = `CV — ${PROFILE.name}`;
    return () => { document.title = 'Jandro Santos'; };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 print:bg-white">
      {/* Back button — hidden on print */}
      <div className="print:hidden">
        <motion.button
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="fixed left-6 top-6 z-50 flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm transition-colors hover:bg-gray-50"
        >
          <ArrowLeft size={14} />
          Back
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => window.print()}
          className="fixed right-6 top-6 z-50 flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm text-white shadow-sm transition-colors hover:bg-gray-800"
        >
          <Download size={14} />
          Print / PDF
        </motion.button>
      </div>

      {/* CV Content */}
      <div className="mx-auto max-w-[720px] px-8 py-16 print:py-8">
        {/* Header */}
        <header className="mb-8 border-b border-gray-200 pb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">{PROFILE.name}</h1>
          <p className="mt-1 text-lg text-gray-500">
            Full-Stack Developer & AI Engineer · {PROFILE.location}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <a href={SOCIALS[0].href} className="flex items-center gap-1.5 hover:text-gray-900">
              <Mail size={13} />
              {SOCIALS[0].handle}
            </a>
            <a href={SOCIALS[1].href} className="flex items-center gap-1.5 hover:text-gray-900" target="_blank" rel="noopener noreferrer">
              <ExternalLink size={13} />
              {SOCIALS[1].handle}
            </a>
          </div>
        </header>

        {/* Summary */}
        <section className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            {lang === 'es' ? 'Sobre mí' : 'About'}
          </h2>
          <p className="text-sm leading-relaxed text-gray-700">
            {lang === 'es'
              ? `Desarrollador full-stack de ${PROFILE.age} años especializado en interfaces de alto rendimiento e integración de IA. Lideré el departamento de IA en una empresa, construyendo agentes MCP y llevando LLMs a producción. Apasionado por el detalle, la velocidad y la experiencia de usuario que la gente recuerda.`
              : `${PROFILE.age}-year-old full-stack developer specialised in high-performance interfaces and AI integration. Led the AI department at a company, building custom MCP agents and taking LLMs to production. Passionate about detail, speed, and user experiences people remember.`}
          </p>
        </section>

        {/* Experience */}
        <section className="mb-8">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
            {lang === 'es' ? 'Experiencia' : 'Experience'}
          </h2>
          <div className="space-y-6">
            {EXPERIENCE.map((ex) => (
              <div key={ex.role}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{ex.role}</h3>
                    <p className="text-sm text-gray-500">{ex.org}</p>
                  </div>
                  <span className="shrink-0 text-sm text-gray-400">{ex.period}</span>
                </div>
                <ul className="mt-2 space-y-1">
                  {ex.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mb-8">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
            {lang === 'es' ? 'Stack técnico' : 'Skills'}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {SKILLS.map((g) => (
              <div key={g.label}>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  {g.label}
                </p>
                <p className="text-sm text-gray-700">{g.items.join(', ')}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-8">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
            {lang === 'es' ? 'Formación' : 'Education'}
          </h2>
          <div className="space-y-3">
            {EDUCATION.map((ed) => (
              <div key={ed.title} className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{ed.title}</h3>
                  <p className="text-sm text-gray-500">{ed.org}</p>
                </div>
                <span className="shrink-0 text-sm text-gray-400">{ed.period}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          jandrosantosvillabona@gmail.com · github.com/JandroSantos
        </footer>
      </div>
    </div>
  );
}
