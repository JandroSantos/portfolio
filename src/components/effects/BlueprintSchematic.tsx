import { motion } from 'framer-motion';

interface BlueprintSchematicProps {
  color: string;
  className?: string;
}

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: i * 0.12, duration: 1.1, ease: [0.16, 1, 0.3, 1] as const },
      opacity: { delay: i * 0.12, duration: 0.3 },
    },
  }),
};

/**
 * The Builder's signature: a self-drawing architectural schematic.
 * Lines ink themselves in on scroll like a draughtsman at a table —
 * structure, dimension lines and annotations. Pure SVG.
 */
export default function BlueprintSchematic({ color, className }: BlueprintSchematicProps) {
  const common = {
    variants: draw,
    initial: 'hidden' as const,
    whileInView: 'show' as const,
    viewport: { once: true, margin: '-80px' },
    stroke: color,
    strokeWidth: 1.5,
    fill: 'none',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <svg
      viewBox="0 0 400 260"
      className={className}
      aria-hidden
      style={{ overflow: 'visible' }}
    >
      {/* Tower outline */}
      <motion.rect {...common} custom={0} x="70" y="40" width="120" height="180" />
      {/* Floors */}
      {[70, 100, 130, 160, 190].map((y, i) => (
        <motion.line key={y} {...common} custom={1 + i * 0.3} x1="70" y1={y} x2="190" y2={y} strokeWidth={1} opacity={0.6} />
      ))}
      {/* Windows grid */}
      {[0, 1, 2].map((cx) =>
        [0, 1, 2, 3, 4].map((cy) => (
          <motion.rect
            key={`${cx}-${cy}`}
            {...common}
            custom={2 + cx * 0.1 + cy * 0.05}
            x={84 + cx * 36}
            y={48 + cy * 30}
            width="22"
            height="16"
            strokeWidth={0.8}
            opacity={0.5}
          />
        )),
      )}
      {/* Crane arm */}
      <motion.line {...common} custom={1} x1="190" y1="40" x2="330" y2="40" />
      <motion.line {...common} custom={1.2} x1="240" y1="40" x2="240" y2="14" />
      <motion.line {...common} custom={1.4} x1="240" y1="14" x2="330" y2="40" />
      <motion.line {...common} custom={1.6} x1="300" y1="40" x2="300" y2="90" strokeDasharray="3 4" />
      <motion.rect {...common} custom={2} x="290" y="90" width="20" height="14" />

      {/* Dimension line bottom */}
      <motion.line {...common} custom={3} x1="70" y1="240" x2="190" y2="240" strokeWidth={1} opacity={0.7} />
      <motion.line {...common} custom={3} x1="70" y1="234" x2="70" y2="246" strokeWidth={1} opacity={0.7} />
      <motion.line {...common} custom={3.2} x1="190" y1="234" x2="190" y2="246" strokeWidth={1} opacity={0.7} />

      {/* Dimension line right */}
      <motion.line {...common} custom={3.4} x1="210" y1="40" x2="210" y2="220" strokeWidth={1} opacity={0.7} />
      <motion.line {...common} custom={3.4} x1="204" y1="40" x2="216" y2="40" strokeWidth={1} opacity={0.7} />
      <motion.line {...common} custom={3.6} x1="204" y1="220" x2="216" y2="220" strokeWidth={1} opacity={0.7} />

      {/* Annotations */}
      <motion.text
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.85 }}
        viewport={{ once: true }}
        transition={{ delay: 1.4, duration: 0.5 }}
        x="130"
        y="256"
        textAnchor="middle"
        fill={color}
        fontSize="9"
        fontFamily="ui-monospace, monospace"
        letterSpacing="1"
      >
        SCALE 1:100
      </motion.text>
      <motion.text
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.85 }}
        viewport={{ once: true }}
        transition={{ delay: 1.5, duration: 0.5 }}
        x="224"
        y="134"
        fill={color}
        fontSize="9"
        fontFamily="ui-monospace, monospace"
        letterSpacing="1"
      >
        h=18.0m
      </motion.text>
    </svg>
  );
}
