const MARK_SRC = `${import.meta.env.BASE_URL}brand/ics-mark.png`;

/** Símbolo «ICS» del logo oficial (PNG con transparencia, proporción ≈ 2,2 : 1). */
export function LogoMark({ className = '', title }: { className?: string; title?: string }) {
  return (
    <img
      src={MARK_SRC}
      alt={title ?? ''}
      aria-hidden={title ? undefined : true}
      width={373}
      height={169}
      decoding="async"
      className={`logo-mark ${className}`}
    />
  );
}

/** Logotipo en texto: «INNOVATION / CODE SERVICES» con la tipografía del logo. */
export function Wordmark({ className = '', sub = 'Code Services' }: { className?: string; sub?: string }) {
  return (
    <span className={`wordmark ${className}`}>
      <span className="wordmark__top">Innovation</span>
      <span className="wordmark__bottom">{sub}</span>
    </span>
  );
}
