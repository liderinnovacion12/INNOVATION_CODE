import { createElement, type ReactNode } from 'react';
import { useInView } from '../../hooks/useInView';
import { vars } from '../../lib/css';

interface RevealProps {
  as?: 'div' | 'p' | 'li' | 'span' | 'header' | 'article';
  delay?: number;
  className?: string;
  children: ReactNode;
}

/** Revela su contenido al entrar en pantalla (desactivado con prefers-reduced-motion vía CSS). */
export function Reveal({ as = 'div', delay = 0, className = '', children }: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>({ once: true, rootMargin: '0px 0px -8% 0px' });
  return createElement(
    as,
    { ref, className: `reveal ${inView ? 'is-in' : ''} ${className}`, style: vars({ '--d': `${delay}ms` }) },
    children,
  );
}
