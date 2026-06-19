import { useState } from 'react';
import { TerminalSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { WorldProvider } from './hooks/useWorld';
import { LanguageProvider } from './hooks/useLanguage';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { useEasterEgg } from './hooks/useEasterEgg';
import Cursor from './components/ui/Cursor';
import Preloader from './components/Preloader';
import LanguageSwitchOverlay from './components/ui/LanguageSwitchOverlay';
import Hero from './components/Hero';
import CharacterCarousel from './components/carousel/CharacterCarousel';
import ConnectSection from './components/sections/ConnectSection';
import ProjectsSection from './components/sections/ProjectsSection';
import ExperienceSection from './components/sections/ExperienceSection';
import StudiesSection from './components/sections/StudiesSection';
import Footer from './components/Footer';
import Terminal from './components/terminal/Terminal';

function Page() {
  useSmoothScroll();
  const { open, setOpen, close } = useEasterEgg();
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Preloader onDone={() => setLoaded(true)} />}

      <Cursor />
      <LanguageSwitchOverlay />

      <main>
        <Hero />
        <CharacterCarousel />
        <ConnectSection />
        <ProjectsSection />
        <ExperienceSection />
        <StudiesSection />
        <Footer onOpenTerminal={() => setOpen(true)} />
      </main>

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
        <Page />
      </WorldProvider>
    </LanguageProvider>
  );
}
