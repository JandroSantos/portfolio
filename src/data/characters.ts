/**
 * The four worlds, one developer.
 * Each character is both a navigation destination and a color theme.
 * The carousel rotates through them; the whole page recolors to match.
 */

import socialImg from '@/assets/characters/social.webp';
import builderImg from '@/assets/characters/builder.webp';
import execImg from '@/assets/characters/exec.webp';
import nerdImg from '@/assets/characters/nerd.webp';

export type CharacterKey = 'social' | 'builder' | 'exec' | 'nerd';

export interface World {
  /** Surface the page paints itself with. */
  bg: string;
  /** Slightly lighter plate color for cards/panels. */
  panel: string;
  /** Deepest shade for shadows / depth. */
  deep: string;
  /** Text/icon color that sits on top of `bg`. */
  ink: string;
  /** High-contrast accent (usually white or gold). */
  accent: string;
}

export interface Character {
  key: CharacterKey;
  /** The persona shown on the figurine. */
  alias: string;
  /** The section this world unlocks. */
  section: string;
  /** Verb that captures the section, used in big kinetic type. */
  ghost: string;
  /** One-line pitch shown under the title. */
  tagline: string;
  /** Index in the carousel order. */
  index: number;
  /** Real PNG of the 3D figurine (drop-in). */
  image: string;
  world: World;
}

export const CHARACTERS: Character[] = [
  {
    key: 'social',
    alias: 'The Connector',
    section: 'Connect',
    ghost: 'HELLO',
    tagline:
      'Networking, comunidad y las soft skills que hacen que un equipo funcione.',
    index: 0,
    image: socialImg,
    world: {
      bg: '#f4845f',
      panel: '#f79b7f',
      deep: '#c5543a',
      ink: '#3a1409',
      accent: '#fff7f2',
    },
  },
  {
    key: 'builder',
    alias: 'The Builder',
    section: 'Projects',
    ghost: 'BUILD',
    tagline:
      'Proyectos reales: arquitectura técnica, interfaces y cosas que se envían.',
    index: 1,
    image: builderImg,
    world: {
      bg: '#e8902b',
      panel: '#f3a948',
      deep: '#b3680f',
      ink: '#3d2305',
      accent: '#fff8ee',
    },
  },
  {
    key: 'exec',
    alias: 'The Executive',
    section: 'Experience',
    ghost: 'WORK',
    tagline:
      'Responsable de IA, liderazgo técnico y la profesionalidad que respalda un CV.',
    index: 2,
    image: execImg,
    world: {
      bg: '#34467e',
      panel: '#46598f',
      deep: '#1d2950',
      ink: '#eef1fb',
      accent: '#d2ab5b',
    },
  },
  {
    key: 'nerd',
    alias: 'The Student',
    section: 'Studies',
    ghost: 'LEARN',
    tagline:
      'Formación, lenguajes de programación y la curiosidad que nunca se apaga.',
    index: 3,
    image: nerdImg,
    world: {
      bg: '#7fae5f',
      panel: '#98c179',
      deep: '#547f38',
      ink: '#1f2e12',
      accent: '#f6fbef',
    },
  },
];

export const CHARACTER_COUNT = CHARACTERS.length;

export const getByIndex = (i: number): Character =>
  CHARACTERS[((i % CHARACTER_COUNT) + CHARACTER_COUNT) % CHARACTER_COUNT];
