import { useEffect, useRef, useState } from 'react';
import { company, headerNav, navSections } from '../../config/site';
import { LogoMark } from '../ui/LogoMark';
import { ThemeToggle } from '../ui/ThemeToggle';

const links = headerNav.map((id) => navSections.find((s) => s.id === id)!);

export function Header({ active }: { active: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add('menu-lock');
    menuRef.current?.querySelector('a')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.documentElement.classList.remove('menu-lock');
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return (
    <header className={`site-header ${scrolled || open ? 'is-solid' : ''}`}>
      <div className="shell flex h-16 items-center justify-between gap-6 lg:h-20">
        <a href="#inicio" className="flex items-center gap-3" aria-label={`${company.legalName} — ir al inicio`}>
          <LogoMark className="h-9 w-9 shrink-0" />
          <span className="font-display text-[12px] font-semibold uppercase leading-[1.15] tracking-[0.2em]" aria-hidden="true">
            Innovation
            <br />
            <span className="text-frost-400">Code Services</span>
          </span>
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className={`nav-link ${active === l.id ? 'is-active' : ''}`} aria-current={active === l.id ? 'location' : undefined}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <a href="#contacto" className="btn btn--ghost btn--sm hidden sm:inline-flex">
            <span className="btn__label">Hablemos</span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen((o) => !o)}
          >
            <span className={open ? 'is-open' : ''} />
          </button>
        </div>
      </div>

      <div id="mobile-menu" ref={menuRef} className={`mobile-menu lg:hidden ${open ? 'is-open' : ''}`} hidden={!open}>
        <nav aria-label="Menú móvil" className="shell">
          <ol className="flex flex-col">
            {navSections.slice(1).map((s, i) => (
              <li key={s.id} style={{ transitionDelay: `${i * 40}ms` }}>
                <a href={`#${s.id}`} onClick={() => setOpen(false)} className="mobile-menu__link">
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </header>
  );
}
