/**
 * La intro se reproduce en cada carga o recarga de la página.
 * Siempre puede omitirse con el botón «Omitir intro» o con Escape.
 */
export function shouldPlayIntro(): boolean {
  return typeof window !== 'undefined';
}
