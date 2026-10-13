import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

/** Encabezado de sección: índice técnico + título + bajada opcional. */
export function SectionHeading({
  index,
  label,
  title,
  lead,
  id,
  className = '',
}: {
  index: string;
  label: string;
  title: ReactNode;
  lead?: ReactNode;
  id: string;
  className?: string;
}) {
  return (
    <header className={`max-w-4xl ${className}`}>
      <Reveal as="p" className="eyebrow">
        <span className="text-crimson-300">{index}</span>
        <span className="eyebrow__rule" aria-hidden="true" />
        {label}
      </Reveal>
      <Reveal delay={80}>
        <h2 id={id} className="section-title mt-5">
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal as="p" delay={160} className="mt-6 max-w-2xl text-base leading-relaxed text-frost-200 sm:text-lg">
          {lead}
        </Reveal>
      )}
    </header>
  );
}
