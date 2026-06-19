import { useState, useEffect, useCallback } from 'react';
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
import Terminal from './components/terminal/Terminal';
import RemoteCar from './components/effects/RemoteCar';
import MatrixRain from './components/effects/MatrixRain';
import CommandPalette from './components/ui/CommandPalette';
import { usePartyMode } from './components/effects/PartyMode';
import LandingPage from './pages/LandingPage';
import ConnectPage from './pages/ConnectPage';
import ProjectsPage from './pages/ProjectsPage';
import ExperiencePage from './pages/ExperiencePage';
import StudiesPage from './pages/StudiesPage';

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

  useEffect(() => on('party', stableParty), [stableParty]);

  return (
    <>
      {!loaded && <Preloader onDone={() => setLoaded(true)} />}

      <Cursor />
      <ScrollProgress />
      <LanguageSwitchOverlay />
      <RemoteCar />
      <MatrixRain />

      <CommandPalette
        onOpenTerminal={() => setOpen(true)}
        onPartyMode={party}
      />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/connect" element={<ConnectPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/studies" element={<StudiesPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </AnimatePresence>

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

      <Terminal open={open} onClose={close} />
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
