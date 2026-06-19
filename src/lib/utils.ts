import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes without conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Linear interpolation. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Clamp a value between min and max. */
export const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

/** Map a value from one range to another. */
export const mapRange = (
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) => outMin + ((v - inMin) * (outMax - outMin)) / (inMax - inMin);

/** True when the user prefers reduced motion. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True on devices with a precise pointer (mouse). */
export const hasFinePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/**
 * Append an alpha byte to a 6-digit hex color.
 * hexA('#f4845f', 0.2) → '#f4845f33'
 */
export const hexA = (hex: string, alpha: number): string => {
  const a = Math.round(clamp(alpha, 0, 1) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
};
