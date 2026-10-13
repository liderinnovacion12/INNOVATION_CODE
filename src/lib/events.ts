export const PREFILL_EVENT = 'ics:prefill';

export interface PrefillDetail {
  projectType?: string;
  message?: string;
}

/** Lleva al visitante al formulario con datos prellenados desde cualquier sección. */
export function requestContact(detail: PrefillDetail) {
  window.dispatchEvent(new CustomEvent<PrefillDetail>(PREFILL_EVENT, { detail }));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('contacto')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}
