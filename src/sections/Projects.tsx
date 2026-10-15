import { useEffect, useRef, useState } from 'react';
import { projectFilters, projects, type Project, type ProjectCategory } from '../config/site';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ProjectVisual } from '../components/ui/ProjectVisual';
import { Button } from '../components/ui/Button';
import { requestContact } from '../lib/events';

/** Patrón asimétrico de columnas para que la cuadrícula no parezca una plantilla repetida. */
const SPANS = ['md:col-span-4 md:row-span-2', 'md:col-span-2', 'md:col-span-2', 'md:col-span-3', 'md:col-span-3', 'md:col-span-6'];

const categoryLabel = (c: ProjectCategory) => projectFilters.find((f) => f.id === c)?.label ?? c;

export default function Projects() {
  const [filter, setFilter] = useState<ProjectCategory | 'todos'>('todos');
  const [open, setOpen] = useState<Project | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const visible = projects.filter((p) => filter === 'todos' || p.categories.includes(filter));
  const hasDemos = projects.some((p) => p.isDemo);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const close = () => {
    setOpen(null);
    triggerRef.current?.focus();
  };

  return (
    <section id="proyectos" aria-labelledby="proyectos-title" className="section relative">
      <div className="shell">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="proyectos-title"
            index="04"
            label="Proyectos y casos de uso"
            title={
              <>
                Ideas que ya <span className="text-gradient">tienen forma.</span>
              </>
            }
            lead={
              hasDemos
                ? 'Conceptos demostrativos que ilustran el tipo de soluciones que diseñamos. No corresponden a clientes reales; los casos publicados se identifican aparte.'
                : undefined
            }
          />
          <div role="group" aria-label="Filtrar proyectos" className="flex flex-wrap gap-2">
            {projectFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className="chip"
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {visible.length} proyectos mostrados
        </p>

        <ul className="mt-12 grid auto-rows-[minmax(260px,auto)] gap-4 md:grid-cols-6">
          {visible.map((p, i) => (
            <li key={`${filter}-${p.id}`} className={`project-enter ${SPANS[i % SPANS.length]}`} style={{ animationDelay: `${i * 60}ms` }}>
              <button
                type="button"
                className="project-card force-dark group"
                onClick={(e) => {
                  triggerRef.current = e.currentTarget;
                  setOpen(p);
                }}
                aria-haspopup="dialog"
              >
                <ProjectVisual kind={p.visual} />
                <span className="project-card__shade" aria-hidden="true" />
                <span className="project-card__body">
                  <span className="flex flex-wrap items-center gap-2">
                    {p.isDemo && <span className="tag tag--demo">Concepto demostrativo</span>}
                    {p.categories.map((c) => (
                      <span key={c} className="tag">
                        {categoryLabel(c)}
                      </span>
                    ))}
                  </span>
                  <span className="mt-4 block font-display text-2xl font-semibold tracking-tight sm:text-3xl">{p.title}</span>
                  <span className="mt-1 block text-sm text-frost-200">{p.subtitle}</span>
                  <span className="project-card__more" aria-hidden="true">
                    Ver detalle <span>+</span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialogRef}
        className="project-dialog"
        aria-labelledby="project-dialog-title"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {open && (
          <div className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
            <div className="force-dark relative min-h-[200px] border-b border-line md:border-b-0 md:border-r">
              <ProjectVisual kind={open.visual} />
            </div>
            <div className="max-h-[80vh] overflow-y-auto p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                {open.isDemo ? <span className="tag tag--demo">Concepto demostrativo</span> : <span className="tag">Proyecto</span>}
                <button type="button" onClick={close} className="icon-btn" aria-label="Cerrar detalle">
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M3 3l10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
              </div>
              <h3 id="project-dialog-title" className="mt-4 font-display text-3xl font-semibold tracking-tight">
                {open.title}
              </h3>
              <p className="text-brand-300">{open.subtitle}</p>
              <p className="mt-5 leading-relaxed text-frost-200">{open.summary}</p>
              <h4 className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-frost-400">Desafío</h4>
              <p className="mt-2 text-sm leading-relaxed text-frost-200">{open.challenge}</p>
              <h4 className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-frost-400">Enfoque</h4>
              <ul className="mt-2 space-y-1.5 text-sm text-frost-200">
                {open.approach.map((a) => (
                  <li key={a} className="flex gap-3">
                    <span className="text-accent-300" aria-hidden="true">▹</span>
                    {a}
                  </li>
                ))}
              </ul>
              <h4 className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-frost-400">
                {open.isDemo ? 'Stack propuesto' : 'Stack'}
              </h4>
              <p className="mt-2 flex flex-wrap gap-2">
                {open.stack.map((s) => (
                  <span key={s} className="tag">
                    {s}
                  </span>
                ))}
              </p>
              <div className="mt-8">
                <Button
                  size="sm"
                  onClick={() => {
                    const title = open.title;
                    dialogRef.current?.close();
                    setOpen(null);
                    requestContact({ projectType: 'Otro', message: `Me interesa una solución similar a «${title}». ` });
                  }}
                >
                  Quiero algo similar
                </Button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
