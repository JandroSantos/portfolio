/**
 * Language-neutral data. Translatable copy lives in src/i18n/dict.ts.
 */

import type { CharacterKey } from './characters';

export const PROFILE = {
  name: 'Jandro Santos',
  age: 21,
  location: 'España',
};

export const SOCIALS: { label: string; handle: string; href: string }[] = [
  { label: 'Email', handle: 'jandrosantosvillabona@gmail.com', href: 'mailto:jandrosantosvillabona@gmail.com' },
  { label: 'GitHub', handle: '@JandroSantos', href: 'https://github.com/JandroSantos' },
  { label: 'LinkedIn', handle: 'Jandro Santos', href: '#' },
];

/** Which DOM section each character's world points to. */
export const SECTION_FOR: Record<CharacterKey, string> = {
  social: 'connect',
  builder: 'projects',
  exec: 'experience',
  nerd: 'studies',
};
