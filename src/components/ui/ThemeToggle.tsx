import { useTheme } from '../../hooks/useTheme';

/** Conmutador de tema: un disco dividido rojo/azul que gira 180° entre vista oscura y clara. */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const next = theme === 'dark' ? 'claro' : 'oscuro';
  return (
    <button
      type="button"
      onClick={toggle}
      className={`theme-toggle ${className}`}
      aria-label={`Activar tema ${next}`}
      title={`Activar tema ${next}`}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className={theme === 'light' ? 'is-light' : ''}>
        <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M12 3.5a8.5 8.5 0 0 0 0 17Z" fill="url(#theme-toggle-grad)" />
        <defs>
          <linearGradient id="theme-toggle-grad" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#FF2638" />
            <stop offset="1" stopColor="#1769FF" />
          </linearGradient>
        </defs>
      </svg>
      <span className="theme-toggle__label" aria-hidden="true">
        {theme === 'dark' ? 'Oscuro' : 'Claro'}
      </span>
    </button>
  );
}
