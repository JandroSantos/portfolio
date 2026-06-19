/**
 * All editable content lives here. Swap the copy, keep the structure.
 * Written from Jandro's profile — adjust freely.
 */

import type { CharacterKey } from './characters';

/* ---------------------------------- CONNECT --------------------------------- */

export const PROFILE = {
  name: 'Jandro Santos',
  age: 21,
  role: 'Full-Stack Developer & AI Engineer',
  location: 'España',
  // Short, first-person, no corporate filler.
  bio: [
    'Tengo 21 años y llevo el desarrollo en la sangre desde que entendí que una pantalla en blanco es la mejor invitación que existe.',
    'Fui responsable del departamento de IA en mi empresa. Vivo en el frontend pero me muevo con soltura por el backend, MCP, APIs y todo lo que conecte una idea con algo que funciona.',
  ],
  values: [
    { label: 'Comunicación', note: 'Explico lo técnico sin que duela.' },
    { label: 'Curiosidad', note: 'Si no lo sé, lo sabré mañana.' },
    { label: 'Criterio', note: 'Sé cuándo una idea merece código.' },
  ],
};

export const SOCIALS: { label: string; handle: string; href: string }[] = [
  { label: 'Email', handle: 'jandrosantosvillabona@gmail.com', href: 'mailto:jandrosantosvillabona@gmail.com' },
  { label: 'GitHub', handle: '@JandroSantos', href: 'https://github.com/JandroSantos' },
  { label: 'LinkedIn', handle: 'Jandro Santos', href: '#' },
];

/* -------------------------------- EXPERIENCE -------------------------------- */

export interface Experience {
  role: string;
  org: string;
  period: string;
  summary: string;
  highlights: string[];
}

export const EXPERIENCE: Experience[] = [
  {
    role: 'Responsable de Departamento de IA',
    org: 'Empresa',
    period: '2024 — 2025',
    summary:
      'Lideré la dirección técnica de IA: desde prototipos con LLMs hasta integraciones en producción con MCP y APIs.',
    highlights: [
      'Diseño de agentes y servidores MCP a medida',
      'Prompting de producción y evaluación de modelos',
      'Puente entre negocio y la implementación técnica',
    ],
  },
  {
    role: 'Frontend Developer',
    org: 'Proyectos & Freelance',
    period: '2023 — Presente',
    summary:
      'Interfaces que la gente recuerda. React, Svelte y Tailwind con obsesión por el detalle y el rendimiento.',
    highlights: [
      'Componentes accesibles y animados',
      'Integración de APIs y estados complejos',
      'Diseño guiado por la experiencia, no por la plantilla',
    ],
  },
];

/* --------------------------------- PROJECTS --------------------------------- */

export interface Project {
  number: string;
  name: string;
  category: string;
  description: string;
  stack: string[];
  href: string;
}

export const PROJECTS: Project[] = [
  {
    number: '01',
    name: 'Servidor MCP a Medida',
    category: 'IA · Backend',
    description:
      'Un servidor Model Context Protocol que conecta herramientas internas con agentes de IA, exponiendo acciones seguras y tipadas.',
    stack: ['Python', 'MCP', 'APIs'],
    href: '#',
  },
  {
    number: '02',
    name: 'Panel de Agentes IA',
    category: 'Frontend · IA',
    description:
      'Interfaz en tiempo real para orquestar agentes: streaming de respuestas, control de herramientas y trazas de ejecución.',
    stack: ['React', 'TypeScript', 'Tailwind'],
    href: '#',
  },
  {
    number: '03',
    name: 'Experiencia Web Interactiva',
    category: 'Frontend · Motion',
    description:
      'Una pieza de portfolio con animación dirigida por scroll, física magnética y un sistema de diseño propio.',
    stack: ['Svelte', 'GSAP', 'CSS'],
    href: '#',
  },
];

/* --------------------------------- STUDIES ---------------------------------- */

export interface Study {
  title: string;
  org: string;
  period: string;
  note: string;
}

export const STUDIES: Study[] = [
  {
    title: 'Grado Superior en Desarrollo de Aplicaciones Web (DAW)',
    org: 'Formación Profesional',
    period: 'Finalizado',
    note: 'Fundamentos sólidos de frontend, backend, bases de datos y despliegue.',
  },
  {
    title: 'Bachillerato',
    org: 'Educación Secundaria',
    period: 'Finalizado',
    note: 'Base académica antes de especializarme en desarrollo.',
  },
  {
    title: 'Inglés B2',
    org: 'Certificación',
    period: 'Acreditado',
    note: 'Documentación, comunidad y trabajo técnico sin barrera de idioma.',
  },
];

export interface SkillGroup {
  label: string;
  items: string[];
}

export const SKILLS: SkillGroup[] = [
  { label: 'Frontend', items: ['React', 'Svelte', 'TypeScript', 'HTML', 'CSS', 'Tailwind'] },
  { label: 'Backend & Data', items: ['Python', 'APIs', 'Node'] },
  { label: 'IA', items: ['MCP', 'Prompting', 'LLMs', 'Agentes'] },
  { label: 'Idiomas', items: ['Español', 'Inglés B2'] },
];

/* ------------------------------ SECTION LOOKUP ------------------------------ */

export const SECTION_FOR: Record<CharacterKey, string> = {
  social: 'connect',
  builder: 'projects',
  exec: 'experience',
  nerd: 'studies',
};
