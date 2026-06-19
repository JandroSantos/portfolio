/**
 * Tiny global event bus over window CustomEvents. Lets the terminal
 * and hotkeys trigger page-wide easter eggs without prop drilling.
 */
export type BusEvent = 'drive' | 'matrix' | 'konami' | 'confetti';

export function emit(event: BusEvent, detail?: unknown) {
  window.dispatchEvent(new CustomEvent(`jandro:${event}`, { detail }));
}

export function on(event: BusEvent, handler: (detail: unknown) => void) {
  const wrapped = (e: Event) => handler((e as CustomEvent).detail);
  window.addEventListener(`jandro:${event}`, wrapped);
  return () => window.removeEventListener(`jandro:${event}`, wrapped);
}
