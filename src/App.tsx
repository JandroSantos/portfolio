import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { TerminalSquare } from 'lucide-react';
import { on } from './lib/bus';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import { WorldProvider } from './hooks/useWorld';
import { LanguageProvider } from './hooks/useLanguage';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { useEasterEgg } from './hooks/useEasterEgg';
import Cursor from './components/ui/Cursor';
import ScrollProgress from './components/ui/ScrollProgress';
import Preloader from './components/Preloader';
import LanguageSwitchOverlay from './components/ui/LanguageSwitchOverlay';
import CommandPalette from './components/ui/CommandPalette';
import RouteTransition from './components/ui/RouteTransition';
import { usePartyMode } from './components/effects/PartyMode';

/* Route-level code splitting — each page ships its own chunk, so the initial
   load only pays for the landing page + shared shell. */
const LandingPage = lazy(() => import('./pages/LandingPage'));
const ConnectPage = lazy(() => import('./pages/ConnectPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'));
const StudiesPage = lazy(() => import('./pages/StudiesPage'));
const CvPage = lazy(() => import('./pages/CvPage'));

/* Heavy / easter-egg extras — deferred so they never block first paint. */
const Terminal = lazy(() => import('./components/terminal/Terminal'));
const RemoteCar = lazy(() => import('./components/effects/RemoteCar'));
const MatrixRain = lazy(() => import('./components/effects/MatrixRain'));

// Recruitment message visible in DevTools → Console
const ASCII =
  '\n' +
  ' ██╗ █████╗ ███╗   ██╗██████╗ ██████╗  ██████╗ \n' +
  ' ██║██╔══██╗████╗  ██║██╔══██╗██╔══██╗██╔═══██╗\n' +
  ' ██║███████║██╔██╗ ██║██║  ██║██████╔╝██║   ██║\n' +
  '██╔╝██╔══██║██║╚██╗██║██║  ██║██╔══██╗██║   ██║\n' +
  '╚═╝ ██║  ██║██║ ╚████║██████╔╝██║  ██║╚██████╔╝\n' +
  '    ╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝ \n' +
  '\n' +
  '👋 Hey, you found the source. I like you already.\n' +
  '   I\'m Jandro — AI lead, builder, and yes, I hand-coded this.\n' +
  '   If you\'re reading this, you\'re exactly the kind of curious person\n' +
  '   I want to work with.\n\n' +
  '   📧  jandrosantosvillabona@gmail.com\n' +
  '   🐙  github.com/JandroSantos\n\n' +
  '   P.S. Try typing "sudo" or ⌘K for hidden features 🤫\n';

function Shell() {
  useSmoothScroll();
  const { open, setOpen, close } = useEasterEgg();
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();
  const party = usePartyMode();
  const stableParty = useCallback(party, [party]);

  useEffect(() => {
    console.log('%c' + ASCII, 'color:#d2ab5b;font-family:monospace;font-size:11px;');
  }, []);

  // Dynamic, per-route document title — nice tab affordance + SEO.
  useEffect(() => {
    const SECTION: Record<string, string> = {
      '/': 'Full-Stack Developer & AI Engineer',
      '/connect': 'Connect',
      '/projects': 'Projects',
      '/experience': 'Experience',
      '/studies': 'Studies',
      '/cv': 'CV',
    };
    const label = SECTION[location.pathname];
    document.title = label ? `Jandro Santos — ${label}` : 'Jandro Santos';
  }, [location.pathname]);

  useEffect(() => on('party', stableParty), [stableParty]);

  return (
    <>
      {!loaded && <Preloader onDone={() => setLoaded(true)} />}

      <Cursor />
      <ScrollProgress />
      <RouteTransition />
      <LanguageSwitchOverlay />
      <Suspense fallback={null}>
        <RemoteCar />
        <MatrixRain />
      </Suspense>

      <CommandPalette
        onOpenTerminal={() => setOpen(true)}
        onPartyMode={party}
      />

      <Suspense fallback={null}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/connect" element={<ConnectPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/studies" element={<StudiesPage />} />
            <Route path="/cv" element={<CvPage />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </AnimatePresence>
      </Suspense>

      {/* Floating terminal trigger — keeps the easter egg reachable on touch */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        onClick={() => setOpen(true)}
        aria-label="Abrir terminal"
        data-cursor="hover"
        data-cursor-label="Terminal"
        className="fixed bottom-5 right-5 z-[9000] flex h-12 w-12 items-center justify-center rounded-full border border-ink-line bg-ink-soft/80 text-bone-dim backdrop-blur-md transition-colors hover:text-bone sm:bottom-6 sm:right-6"
        style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}
      >
        <TerminalSquare size={20} />
      </motion.button>

      <Suspense fallback={null}>
        {open && <Terminal open={open} onClose={close} />}
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <WorldProvider>
        <Shell />
      </WorldProvider>
    </LanguageProvider>
  );
}
