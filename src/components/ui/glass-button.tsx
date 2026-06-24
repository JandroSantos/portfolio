import { motion } from 'framer-motion';

interface GlassButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export function GlassButton({ onClick, children, className = '' }: GlassButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden rounded-full px-8 py-4 font-mono text-sm uppercase tracking-[0.2em] text-white/90 cursor-pointer select-none ${className}`}
      style={{
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.18)',
        boxShadow:
          '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.2)',
      }}
    >
      {/* inner shine */}
      <span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,255,255,0.13) 0%, transparent 70%)',
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
