/**
 * Bilingual content. `es` is the source of truth for the shape;
 * `en` mirrors it. Components read the active language via useLanguage().
 * Character colors / order / images stay language-neutral in characters.ts.
 */

import type { CharacterKey } from '@/data/characters';

type CharStrings = { alias: string; section: string; ghost: string; tagline: string };

export interface Dict {
  meta: {
    available: string;
    explore: string;
    loading: string;
    scroll: string;
  };
  nav: Record<'connect' | 'projects' | 'experience' | 'studies', string>;
  hero: { role: string };
  characters: Record<CharacterKey, CharStrings>;
  carousel: { enter: string; go: string; brand: string; swipe: string; aria: string };
  connect: {
    eyebrow: string;
    title: string;
    bio: string[];
    values: { label: string; note: string }[];
  };
  projects: {
    eyebrow: string;
    title: string;
    items: { number: string; name: string; category: string; description: string; stack: string[] }[];
    view: string;
  };
  experience: {
    eyebrow: string;
    title: string;
    items: { role: string; org: string; period: string; summary: string; highlights: string[] }[];
  };
  studies: {
    eyebrow: string;
    title: string;
    items: { title: string; org: string; period: string; note: string }[];
    skills: { label: string; items: string[] }[];
  };
  footer: {
    talkEyebrow: string;
    credits: string;
    eggHint: { lead: string; or: string; type: string };
    backToTop: string;
  };
  terminal: {
    bootHint: string;
    helpTitle: string;
    help: string[];
    labels: {
      projects: string;
      experience: string;
      studies: string;
      stack: string;
      contact: string;
    };
    notFound: string;
    navigating: string;
    world: string;
    sections: string;
    themes: string;
    sudoOk: string;
    sudoMsg: string;
    sudoHint: string;
    coffee: string;
  };
  switchLines: string[];
}

export const DICT: Record<'es' | 'en', Dict> = {
  es: {
    meta: {
      available: 'Disponible',
      explore: 'Explora',
      loading: 'Cargando experiencia',
      scroll: 'Scroll',
    },
    nav: {
      connect: 'Conecta',
      projects: 'Proyectos',
      experience: 'Experiencia',
      studies: 'Estudios',
    },
    hero: { role: 'Full-Stack Developer & AI Engineer' },
    characters: {
      social: {
        alias: 'El Conector',
        section: 'Conecta',
        ghost: 'HOLA',
        tagline: 'Networking, comunidad y las soft skills que hacen que un equipo funcione.',
      },
      builder: {
        alias: 'El Constructor',
        section: 'Proyectos',
        ghost: 'CREO',
        tagline: 'Proyectos reales: arquitectura técnica, interfaces y cosas que se envían.',
      },
      exec: {
        alias: 'El Ejecutivo',
        section: 'Experiencia',
        ghost: 'TRABAJO',
        tagline: 'Responsable de IA, liderazgo técnico y la profesionalidad que respalda un CV.',
      },
      nerd: {
        alias: 'El Estudiante',
        section: 'Estudios',
        ghost: 'APRENDO',
        tagline: 'Formación, lenguajes de programación y la curiosidad que nunca se apaga.',
      },
    },
    carousel: { enter: 'Entrar', go: 'Ir', brand: 'Jandro·OS', swipe: 'Desliza', aria: 'Selector de secciones' },
    connect: {
      eyebrow: '01 — Quién soy',
      title: 'Conecta',
      bio: [
        'Tengo 21 años y llevo el desarrollo en la sangre desde que entendí que una pantalla en blanco es la mejor invitación que existe.',
        'Fui responsable del departamento de IA en mi empresa. Vivo en el frontend pero me muevo con soltura por el backend, MCP, APIs y todo lo que conecte una idea con algo que funciona.',
      ],
      values: [
        { label: 'Comunicación', note: 'Explico lo técnico sin que duela.' },
        { label: 'Curiosidad', note: 'Si no lo sé, lo sabré mañana.' },
        { label: 'Criterio', note: 'Sé cuándo una idea merece código.' },
      ],
    },
    projects: {
      eyebrow: '02 — Lo que construyo',
      title: 'Proyectos',
      view: 'Ver',
      items: [
        {
          number: '01',
          name: 'Servidor MCP a Medida',
          category: 'IA · Backend',
          description:
            'Un servidor Model Context Protocol que conecta herramientas internas con agentes de IA, exponiendo acciones seguras y tipadas.',
          stack: ['Python', 'MCP', 'APIs'],
        },
        {
          number: '02',
          name: 'Panel de Agentes IA',
          category: 'Frontend · IA',
          description:
            'Interfaz en tiempo real para orquestar agentes: streaming de respuestas, control de herramientas y trazas de ejecución.',
          stack: ['React', 'TypeScript', 'Tailwind'],
        },
        {
          number: '03',
          name: 'Experiencia Web Interactiva',
          category: 'Frontend · Motion',
          description:
            'Una pieza de portfolio con animación dirigida por scroll, física magnética y un sistema de diseño propio.',
          stack: ['Svelte', 'GSAP', 'CSS'],
        },
      ],
    },
    experience: {
      eyebrow: '03 — Mi trayectoria',
      title: 'Experiencia',
      items: [
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
      ],
    },
    studies: {
      eyebrow: '04 — Cómo aprendí',
      title: 'Estudios',
      items: [
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
      ],
      skills: [
        { label: 'Frontend', items: ['React', 'Svelte', 'TypeScript', 'HTML', 'CSS', 'Tailwind'] },
        { label: 'Backend', items: ['Python', 'APIs', 'Node'] },
        { label: 'IA', items: ['MCP', 'Prompting', 'LLMs', 'Agentes'] },
        { label: 'Idiomas', items: ['Español', 'Inglés B2'] },
      ],
    },
    footer: {
      talkEyebrow: '¿Hablamos?',
      credits: 'Hecho con obsesión por el detalle',
      eggHint: { lead: 'psst — pulsa', or: 'o escribe', type: 'sudo' },
      backToTop: '↑ Volver arriba',
    },
    terminal: {
      bootHint: "Escribe 'help' para ver los comandos. 'exit' para salir.",
      helpTitle: 'Comandos disponibles:',
      help: [
        '  whoami        quién soy',
        '  about         sobre mí',
        '  projects      proyectos destacados',
        '  experience    trayectoria profesional',
        '  studies       formación',
        '  skills        stack técnico',
        '  contact       cómo encontrarme',
        '  goto <sec>    ir a una sección (connect/projects/experience/studies)',
        '  theme <id>    cambiar de mundo (social/builder/exec/nerd)',
        '  sudo hire-me  ;)',
        '  clear         limpiar  ·  exit  cerrar',
      ],
      labels: {
        projects: 'Proyectos:',
        experience: 'Experiencia:',
        studies: 'Formación:',
        stack: 'Stack:',
        contact: 'Contacto:',
      },
      notFound: 'comando no encontrado',
      navigating: 'navegando a',
      world: 'mundo',
      sections: 'secciones',
      themes: 'temas',
      sudoOk: '[sudo] permiso concedido ✔',
      sudoMsg: 'Excelente decisión. Hablemos:',
      sudoHint: 'sudo: prueba con "sudo hire-me"',
      coffee: '☕ Combustible aceptado. +10 a la productividad.',
    },
    switchLines: [
      'Switching to English… mind the accent 🇬🇧',
      'Tea time ☕ — translating…',
      'Now in Shakespeare mode 🎩',
    ],
  },

  en: {
    meta: {
      available: 'Available',
      explore: 'Explore',
      loading: 'Loading experience',
      scroll: 'Scroll',
    },
    nav: {
      connect: 'Connect',
      projects: 'Projects',
      experience: 'Experience',
      studies: 'Studies',
    },
    hero: { role: 'Full-Stack Developer & AI Engineer' },
    characters: {
      social: {
        alias: 'The Connector',
        section: 'Connect',
        ghost: 'HELLO',
        tagline: 'Networking, community and the soft skills that make a team click.',
      },
      builder: {
        alias: 'The Builder',
        section: 'Projects',
        ghost: 'BUILD',
        tagline: 'Real projects: technical architecture, interfaces and things that ship.',
      },
      exec: {
        alias: 'The Executive',
        section: 'Experience',
        ghost: 'WORK',
        tagline: 'AI lead, technical leadership and the professionalism a CV is built on.',
      },
      nerd: {
        alias: 'The Student',
        section: 'Studies',
        ghost: 'LEARN',
        tagline: 'Education, programming languages and curiosity that never switches off.',
      },
    },
    carousel: { enter: 'Enter', go: 'Go', brand: 'Jandro·OS', swipe: 'Swipe', aria: 'Section selector' },
    connect: {
      eyebrow: '01 — Who I am',
      title: 'Connect',
      bio: [
        "I'm 21 and I've had development in my veins since I realised a blank screen is the best invitation there is.",
        'I led the AI department at my company. I live in the frontend but move comfortably through the backend, MCP, APIs and anything that turns an idea into something that works.',
      ],
      values: [
        { label: 'Communication', note: 'I explain the technical without the pain.' },
        { label: 'Curiosity', note: "If I don't know it, I will by tomorrow." },
        { label: 'Judgement', note: 'I know when an idea deserves code.' },
      ],
    },
    projects: {
      eyebrow: '02 — What I build',
      title: 'Projects',
      view: 'View',
      items: [
        {
          number: '01',
          name: 'Custom MCP Server',
          category: 'AI · Backend',
          description:
            'A Model Context Protocol server connecting internal tools with AI agents, exposing safe, typed actions.',
          stack: ['Python', 'MCP', 'APIs'],
        },
        {
          number: '02',
          name: 'AI Agents Dashboard',
          category: 'Frontend · AI',
          description:
            'A real-time interface to orchestrate agents: response streaming, tool control and execution traces.',
          stack: ['React', 'TypeScript', 'Tailwind'],
        },
        {
          number: '03',
          name: 'Interactive Web Experience',
          category: 'Frontend · Motion',
          description:
            'A portfolio piece with scroll-driven animation, magnetic physics and a bespoke design system.',
          stack: ['Svelte', 'GSAP', 'CSS'],
        },
      ],
    },
    experience: {
      eyebrow: '03 — My track record',
      title: 'Experience',
      items: [
        {
          role: 'Head of AI Department',
          org: 'Company',
          period: '2024 — 2025',
          summary:
            'Led the technical direction of AI: from LLM prototypes to production integrations with MCP and APIs.',
          highlights: [
            'Designing custom agents and MCP servers',
            'Production prompting and model evaluation',
            'Bridging business and technical implementation',
          ],
        },
        {
          role: 'Frontend Developer',
          org: 'Projects & Freelance',
          period: '2023 — Present',
          summary:
            'Interfaces people remember. React, Svelte and Tailwind with an obsession for detail and performance.',
          highlights: [
            'Accessible, animated components',
            'API integration and complex state',
            'Experience-led design, never templated',
          ],
        },
      ],
    },
    studies: {
      eyebrow: '04 — How I learned',
      title: 'Studies',
      items: [
        {
          title: 'Higher Diploma in Web Application Development (DAW)',
          org: 'Vocational Training',
          period: 'Completed',
          note: 'Solid fundamentals in frontend, backend, databases and deployment.',
        },
        {
          title: 'Baccalaureate',
          org: 'Secondary Education',
          period: 'Completed',
          note: 'Academic base before specialising in development.',
        },
        {
          title: 'English B2',
          org: 'Certification',
          period: 'Accredited',
          note: 'Documentation, community and technical work with no language barrier.',
        },
      ],
      skills: [
        { label: 'Frontend', items: ['React', 'Svelte', 'TypeScript', 'HTML', 'CSS', 'Tailwind'] },
        { label: 'Backend', items: ['Python', 'APIs', 'Node'] },
        { label: 'AI', items: ['MCP', 'Prompting', 'LLMs', 'Agents'] },
        { label: 'Languages', items: ['Spanish', 'English B2'] },
      ],
    },
    footer: {
      talkEyebrow: "Let's talk?",
      credits: 'Made with an obsession for detail',
      eggHint: { lead: 'psst — press', or: 'or type', type: 'sudo' },
      backToTop: '↑ Back to top',
    },
    terminal: {
      bootHint: "Type 'help' to see the commands. 'exit' to leave.",
      helpTitle: 'Available commands:',
      help: [
        '  whoami        who I am',
        '  about         about me',
        '  projects      featured projects',
        '  experience    professional track record',
        '  studies       education',
        '  skills        tech stack',
        '  contact       how to reach me',
        '  goto <sec>    jump to a section (connect/projects/experience/studies)',
        '  theme <id>    switch world (social/builder/exec/nerd)',
        '  sudo hire-me  ;)',
        '  clear         clear  ·  exit  close',
      ],
      labels: {
        projects: 'Projects:',
        experience: 'Experience:',
        studies: 'Education:',
        stack: 'Stack:',
        contact: 'Contact:',
      },
      notFound: 'command not found',
      navigating: 'navigating to',
      world: 'world',
      sections: 'sections',
      themes: 'themes',
      sudoOk: '[sudo] access granted ✔',
      sudoMsg: 'Excellent decision. Let’s talk:',
      sudoHint: 'sudo: try "sudo hire-me"',
      coffee: '☕ Fuel accepted. +10 to productivity.',
    },
    switchLines: [
      'Cambiando a español… dale 🇪🇸',
      'Modo siesta activado 😎',
      'Ahora con más salero 💃',
    ],
  },
};
