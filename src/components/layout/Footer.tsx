import { company, contact, legal, services, social } from '../../config/site';
import { LogoMark, Wordmark } from '../ui/LogoMark';

export function Footer() {
  const year = new Date().getFullYear();
  const visibleSocial = social.filter((s) => s.url);

  return (
    <footer className="relative border-t border-line pt-20">
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <LogoMark className="h-11 w-auto" />
              <Wordmark sub="Code Services SAS" />
              <span className="sr-only">{company.legalName}</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-frost-400">{company.summary}</p>
          </div>

          <nav aria-label="Servicios" className="md:col-span-4">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-frost-600">Servicios</h2>
            <ul className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {services.map((s) => (
                <li key={s.id}>
                  <a href="#servicios" className="footer-link">
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-frost-600">Contacto</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={`mailto:${contact.email}`} className="footer-link">
                  {contact.email.split('@')[0]}@<wbr />
                  {contact.email.split('@')[1]}
                </a>
              </li>
              {contact.phone && (
                <li>
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="footer-link">
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.location && <li className="text-frost-400">{contact.location}</li>}
              {visibleSocial.map((s) => (
                <li key={s.label}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="footer-link">
                    {s.label} ↗<span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="footer-wordmark" aria-hidden="true">
          INNOVATION <span className="text-gradient">CODE</span>
        </p>

        <div className="flex flex-col gap-4 border-t border-line py-6 text-xs text-frost-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.legalName}. Todos los derechos reservados.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legal.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="footer-link">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#inicio" className="footer-link">
                Volver arriba ↑
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
