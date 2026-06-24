import { motion } from 'framer-motion';

interface Point {
  label: string;
  value: number; // 0..100
}

interface GrowthChartProps {
  /** Accent (gold) for the line + dots. */
  color: string;
  points: Point[];
  className?: string;
}

const W = 640;
const H = 280;
const PAD = { l: 28, r: 28, t: 28, b: 40 };

/**
 * The Executive's signature: an annual-report growth chart that draws
 * its own line and fills its area, with animated nodes per milestone.
 * Reads like the back page of a premium investor deck.
 */
export default function GrowthChart({ color, points, className }: GrowthChartProps) {
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const n = points.length;

  const xy = points.map((p, i) => ({
    x: PAD.l + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW),
    y: PAD.t + innerH - (p.value / 100) * innerH,
    ...p,
  }));

  const line = xy.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const area = `${line} L${xy[n - 1].x},${PAD.t + innerH} L${xy[0].x},${PAD.t + innerH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden>
      <defs>
        <linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = PAD.t + innerH - t * innerH;
        return (
          <line
            key={t}
            x1={PAD.l}
            y1={y}
            x2={W - PAD.r}
            y2={y}
            stroke={color}
            strokeOpacity={0.12}
            strokeWidth={1}
            strokeDasharray="2 5"
          />
        );
      })}

      {/* Area fill */}
      <motion.path
        d={area}
        fill="url(#growth-fill)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.4, duration: 1 }}
      />

      {/* Line */}
      <motion.path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Nodes + labels */}
      {xy.map((p, i) => (
        <g key={p.label}>
          <motion.circle
            cx={p.x}
            cy={p.y}
            r={5}
            fill="#06080f"
            stroke={color}
            strokeWidth={2.5}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 + i * 0.22, type: 'spring', stiffness: 360, damping: 18 }}
          />
          <motion.text
            x={p.x}
            y={H - 14}
            textAnchor="middle"
            fill={color}
            fillOpacity={0.7}
            fontSize="11"
            fontFamily="ui-monospace, monospace"
            letterSpacing="1"
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 0.7, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 + i * 0.22, duration: 0.5 }}
          >
            {p.label}
          </motion.text>
        </g>
      ))}
    </svg>
  );
}
