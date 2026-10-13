import type { CSSProperties } from 'react';

/** Permite pasar variables CSS (--x) en `style` con tipado correcto. */
export const vars = (v: Record<string, string | number>) => v as CSSProperties;
