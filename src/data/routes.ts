import type { CharacterKey } from './characters';

/** The four world routes, in carousel order. */
export interface WorldRoute {
  key: CharacterKey;
  /** URL path. */
  path: string;
  /** Carousel / character index. */
  index: number;
}

export const WORLD_ROUTES: WorldRoute[] = [
  { key: 'social', path: '/connect', index: 0 },
  { key: 'builder', path: '/projects', index: 1 },
  { key: 'exec', path: '/experience', index: 2 },
  { key: 'nerd', path: '/studies', index: 3 },
];

export const PATH_FOR: Record<CharacterKey, string> = {
  social: '/connect',
  builder: '/projects',
  exec: '/experience',
  nerd: '/studies',
};
