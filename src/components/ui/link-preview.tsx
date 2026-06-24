import { useState } from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';
import { motion, AnimatePresence } from 'framer-motion';

interface LinkPreviewProps {
  href: string;
  children: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
  width?: number;
  height?: number;
}

export function LinkPreview({
  href,
  children,
  imageSrc,
  imageAlt = 'Preview',
  className = '',
  width = 200,
  height = 120,
}: LinkPreviewProps) {
  const [open, setOpen] = useState(false);

  return (
    <HoverCard.Root openDelay={80} closeDelay={100} onOpenChange={setOpen}>
      <HoverCard.Trigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`relative inline-block underline-offset-4 decoration-white/30 underline cursor-pointer ${className}`}
        >
          {children}
        </a>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content side="top" align="center" sideOffset={10}>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 6 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden rounded-xl shadow-2xl border"
                style={{
                  width,
                  height,
                  background: 'rgba(10,10,14,0.85)',
                  backdropFilter: 'blur(24px) saturate(180%)',
                  borderColor: 'rgba(255,255,255,0.1)',
                }}
              >
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={imageAlt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-white/40 text-xs font-mono">{href}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
