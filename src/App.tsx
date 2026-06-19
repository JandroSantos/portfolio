import { useState } from 'react';
import { TerminalSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import { WorldProvider } from './hooks/useWorld';
import { LanguageProvider } from './hooks/useLanguage';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { useEasterEgg } from './hooks/useEasterEgg';
import Cursor from './components/ui/Cursor';
import Preloader from './components/Preloader';
import LanguageSwitchOverlay from './components/ui/LanguageSwitchOverlay';
import Terminal from './components/terminal/Terminal';
import RemoteCar from './components/effects/RemoteCar';
import MatrixRain from './components/effects/MatrixRain';
import LandingPage from './pages/LandingPage';
import ConnectPage from './pages/ConnectPage';
import ProjectsPage from './pages/ProjectsPage';
import ExperiencePage from './pages/ExperiencePage';
import StudiesPage from './pages/StudiesPage';

function Shell() {
  useSmoothScroll();
  const { open, setOpen, close } = useEasterEgg();
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();

  return (
    <>
      {!loaded && <Preloader onDone={() => setLoaded(true)} />}

      <Cursor />
      <LanguageSwitchOverlay />
      <RemoteCar />
      <MatrixRain />

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
