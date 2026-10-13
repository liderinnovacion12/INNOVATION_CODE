import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'quiet';

interface Common {
  variant?: Variant;
  size?: 'md' | 'sm';
  className?: string;
  children: ReactNode;
  /** Oculta la flecha decorativa. */
  plain?: boolean;
}

type AsLink = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type AsButton = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

function Arrow() {
  return (
    <svg className="btn__arrow" viewBox="0 0 20 12" aria-hidden="true">
      <path d="M0 6h17M12 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function Button(props: AsLink | AsButton) {
  const cls = `btn btn--${props.variant ?? 'primary'} ${props.size === 'sm' ? 'btn--sm' : ''} ${props.className ?? ''}`;
  const inner = (
    <>
      <span className="btn__label">{props.children}</span>
      {!props.plain && <Arrow />}
    </>
  );

  if (props.href !== undefined) {
    const { variant, size, className, children, plain, ...rest } = props;
    return (
      <a {...rest} className={cls}>
        {inner}
      </a>
    );
  }
  const { variant, size, className, children, plain, type = 'button', ...rest } = props;
  return (
    <button {...rest} type={type} className={cls}>
      {inner}
    </button>
  );
}
