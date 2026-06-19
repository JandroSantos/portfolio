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
    enter: string;
    back: string;
    backHome: string;
  };
  nav: Record<'connect' | 'projects' | 'experience' | 'studies', string>;
  hero: { role: string; lead: string };
  characters: Record<CharacterKey, CharStrings>;
  carousel: { enter: string; go: string; brand: string; swipe: string; aria: string };
  connect: {
    eyebrow: string;
    title: string;
    intro: string;
    bio: string[];
    now: string;
    facts: { k: string; v: string }[];
    values: { label: string; note: string }[];
    cta: { lead: string; button: string };
  };
  projects: {
    eyebrow: string;
    title: string;
    intro: string;
    view: string;
    items: {
      number: string;
      name: string;
      category: string;
      year: string;
      role: string;
      description: string;
      stack: string[];
    }[];
  };
  experience: {
    eyebrow: string;
    title: string;
    intro: string;
    stats: { value: string; label: string }[];
    items: { role: string; org: string; period: string; summary: string; highlights: string[] }[];
  };
  studies: {
    eyebrow: string;
    title: string;
    intro: string;
    items: { title: string; org: string; period: string; note: string }[];
    skills: { label: string; items: string[] }[];
    learning: string[];
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
    drive: string;
    matrixOn: string;
  };
  eggs: {
    carHint: string;
    carHud: string;
    carExit: string;
    found: string;
    konamiToast: string;
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
      enter: 'Entrar',
      back: 'Volver',
      backHome: 'Inicio',
    },
    nav: {
      connect: 'Conecta',
      projects: 'Proyectos',
      experience: 'Experiencia',
      studies: 'Estudios',
    },
    hero: {
      role: 'Full-Stack Developer & AI Engineer',
      lead: 'Cuatro personajes, cuatro mundos, un developer. Elige uno y entra.',
    },
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
      intro: 'El lado humano del código. Aquí va quién soy cuando cierro el portátil… y cuando lo abro.',
      bio: [
        'Tengo 21 años y llevo el desarrollo en la sangre desde que entendí que una pantalla en blanco es la mejor invitación que existe.',
        'Fui responsable del departamento de IA en mi empresa. Vivo en el frontend pero me muevo con soltura por el backend, MCP, APIs y todo lo que conecte una idea con algo que funciona.',
      ],
      now: 'Construyendo agentes de IA, puliendo interfaces y buscando el próximo reto que merezca la pena.',
      facts: [
        { k: 'Base', v: 'España · remoto' },
        { k: 'Edad', v: '21 años' },
        { k: 'Idiomas', v: 'Español · Inglés B2' },
        { k: 'Café', v: 'Combustible principal' },
      ],
      values: [
        { label: 'Comunicación', note: 'Explico lo técnico sin que duela.' },
        { label: 'Curiosidad', note: 'Si no lo sé, lo sabré mañana.' },
        { label: 'Criterio', note: 'Sé cuándo una idea merece código.' },
      ],
      cta: { lead: '¿Tienes algo entre manos?', button: 'Escríbeme' },
    },
    projects: {
      eyebrow: '02 — Lo que construyo',
      title: 'Proyectos',
      intro: 'Cosas que pasaron de una idea a algo que se ejecuta. Cada una con su porqué técnico.',
      view: 'Ver',
      items: [
        {
          number: '01',
          name: 'Servidor MCP a Medida',
          category: 'IA · Backend',
          year: '2025',
          role: 'Arquitectura & desarrollo',
          description:
            'Un servidor Model Context Protocol que conecta herramientas internas con agentes de IA, exponiendo acciones seguras y tipadas.',
          stack: ['Python', 'MCP', 'APIs'],
        },
        {
          number: '02',
          name: 'Panel de Agentes IA',
          category: 'Frontend · IA',
          year: '2025',
          role: 'Frontend lead',
          description:
            'Interfaz en tiempo real para orquestar agentes: streaming de respuestas, control de herramientas y trazas de ejecución.',
          stack: ['React', 'TypeScript', 'Tailwind'],
        },
        {
          number: '03',
          name: 'Experiencia Web Interactiva',
          category: 'Frontend · Motion',
          year: '2024',
          role: 'Diseño & desarrollo',
          description:
            'Una pieza de portfolio con animación dirigida por scroll, física magnética y un sistema de diseño propio.',
          stack: ['Svelte', 'GSAP', 'CSS'],
        },
      ],
    },
    experience: {
      eyebrow: '03 — Mi trayectoria',
      title: 'Experiencia',
      intro: 'De prototipo a producción. Liderazgo técnico, IA y la profesionalidad que respalda un CV.',
      stats: [
        { value: '2+', label: 'Años construyendo' },
        { value: '10+', label: 'Proyectos enviados' },
        { value: '1', label: 'Departamento liderado' },
      ],
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
      intro: 'La base y la curiosidad. Lo que estudié y lo que sigo aprendiendo cada día.',
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
      learning: ['Rust', 'Arquitectura de agentes', 'Diseño de sistemas', 'WebGPU'],
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
        '  goto <sec>    ir a una página (connect/projects/experience/studies)',
        '  theme <id>    cambiar de mundo (social/builder/exec/nerd)',
        '  drive         🏎️  saca el coche teledirigido',
        '  matrix        entra en la madriguera',
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
      drive: '🏎️  Coche desplegado. Conduce con WASD o las flechas. ESC para guardarlo.',
      matrixOn: '🟢 Sígueme al conejo blanco… (pulsa cualquier tecla para salir)',
    },
    eggs: {
      carHint: 'WASD / flechas para conducir · ESPACIO freno · ESC salir',
      carHud: 'MODO CONDUCCIÓN',
      carExit: 'Salir',
      found: 'Easter egg encontrado',
      konamiToast: '↑↑↓↓←→←→ B A — modo dios activado 🕹️',
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
      enter: 'Enter',
      back: 'Back',
      backHome: 'Home',
    },
    nav: {
      connect: 'Connect',
      projects: 'Projects',
      experience: 'Experience',
      studies: 'Studies',
    },
    hero: {
      role: 'Full-Stack Developer & AI Engineer',
      lead: 'Four characters, four worlds, one developer. Pick one and step in.',
    },
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
      intro: 'The human side of the code. Who I am when I close the laptop… and when I open it.',
      bio: [
        "I'm 21 and I've had development in my veins since I realised a blank screen is the best invitation there is.",
        'I led the AI department at my company. I live in the frontend but move comfortably through the backend, MCP, APIs and anything that turns an idea into something that works.',
      ],
      now: 'Building AI agents, polishing interfaces and hunting for the next challenge worth the effort.',
      facts: [
        { k: 'Based', v: 'Spain · remote' },
        { k: 'Age', v: '21 years' },
        { k: 'Languages', v: 'Spanish · English B2' },
        { k: 'Coffee', v: 'Primary fuel' },
      ],
      values: [
        { label: 'Communication', note: 'I explain the technical without the pain.' },
        { label: 'Curiosity', note: "If I don't know it, I will by tomorrow." },
        { label: 'Judgement', note: 'I know when an idea deserves code.' },
      ],
      cta: { lead: 'Got something brewing?', button: 'Drop me a line' },
    },
    projects: {
      eyebrow: '02 — What I build',
      title: 'Projects',
      intro: 'Things that went from an idea to something that runs. Each with its technical why.',
      view: 'View',
      items: [
        {
          number: '01',
          name: 'Custom MCP Server',
          category: 'AI · Backend',
          year: '2025',
          role: 'Architecture & build',
          description:
            'A Model Context Protocol server connecting internal tools with AI agents, exposing safe, typed actions.',
          stack: ['Python', 'MCP', 'APIs'],
        },
        {
          number: '02',
          name: 'AI Agents Dashboard',
          category: 'Frontend · AI',
          year: '2025',
          role: 'Frontend lead',
          description:
            'A real-time interface to orchestrate agents: response streaming, tool control and execution traces.',
          stack: ['React', 'TypeScript', 'Tailwind'],
        },
        {
          number: '03',
          name: 'Interactive Web Experience',
          category: 'Frontend · Motion',
          year: '2024',
          role: 'Design & build',
          description:
            'A portfolio piece with scroll-driven animation, magnetic physics and a bespoke design system.',
          stack: ['Svelte', 'GSAP', 'CSS'],
        },
      ],
    },
    experience: {
      eyebrow: '03 — My track record',
      title: 'Experience',
      intro: 'From prototype to production. Technical leadership, AI and the professionalism a CV is built on.',
      stats: [
        { value: '2+', label: 'Years building' },
        { value: '10+', label: 'Projects shipped' },
        { value: '1', label: 'Department led' },
      ],
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
      intro: 'The foundation and the curiosity. What I studied and what I keep learning every day.',
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
      learning: ['Rust', 'Agent architecture', 'Systems design', 'WebGPU'],
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
        '  goto <sec>    jump to a page (connect/projects/experience/studies)',
        '  theme <id>    switch world (social/builder/exec/nerd)',
        '  drive         🏎️  bring out the RC car',
        '  matrix        enter the rabbit hole',
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
      sudoMsg: 'Excellent decision. Let us talk:',
      sudoHint: 'sudo: try "sudo hire-me"',
      coffee: '☕ Fuel accepted. +10 to productivity.',
      drive: '🏎️  Car deployed. Drive with WASD or arrows. ESC to put it away.',
      matrixOn: '🟢 Follow the white rabbit… (press any key to exit)',
    },
    eggs: {
      carHint: 'WASD / arrows to drive · SPACE brake · ESC exit',
      carHud: 'DRIVE MODE',
      carExit: 'Exit',
      found: 'Easter egg found',
      konamiToast: '↑↑↓↓←→←→ B A — god mode on 🕹️',
    },
    switchLines: [
      'Cambiando a español… dale 🇪🇸',
      'Modo siesta activado 😎',
      'Ahora con más salero 💃',
    ],
  },
};
