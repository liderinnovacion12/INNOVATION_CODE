import { useCallback, useEffect, useState } from 'react';
import { getTheme, setTheme, type Theme } from '../lib/theme';

/** Tema actual sincronizado con el atributo data-theme de <html> (todas las instancias se actualizan). */
export function useTheme() {
  const [theme, setState] = useState<Theme>(getTheme);

  useEffect(() => {
    const mo = new MutationObserver(() => setState(getTheme()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);

  const toggle = useCallback(() => setTheme(getTheme() === 'dark' ? 'light' : 'dark'), []);
  return { theme, toggle };
}
