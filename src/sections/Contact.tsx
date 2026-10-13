import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { contact, contactCopy, legal, social } from '../config/site';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { PREFILL_EVENT, type PrefillDetail } from '../lib/events';

interface Fields {
  name: string;
  email: string;
  company: string;
  projectType: string;
  message: string;
  consent: boolean;
  /** Campo trampa anti-spam: invisible para personas. */
  website: string;
}
type FieldName = Exclude<keyof Fields, 'website' | 'company'>;
type Status = 'idle' | 'loading' | 'success' | 'error';

const EMPTY: Fields = { name: '', email: '', company: '', projectType: '', message: '', consent: false, website: '' };
const ORDER: FieldName[] = ['name', 'email', 'projectType', 'message', 'consent'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: Fields): Partial<Record<FieldName, string>> {
  const e: Partial<Record<FieldName, string>> = {};
  if (f.name.trim().length < 2) e.name = 'Escribe tu nombre (mínimo 2 caracteres).';
  if (!EMAIL_RE.test(f.email.trim())) e.email = 'Escribe un correo válido, por ejemplo nombre@empresa.com.';
  if (!f.projectType) e.projectType = 'Selecciona el tipo de proyecto.';
  if (f.message.trim().length < 20) e.message = 'Cuéntanos un poco más (mínimo 20 caracteres).';
  else if (f.message.length > 2000) e.message = 'El mensaje no puede superar 2000 caracteres.';
  if (!f.consent) e.consent = 'Necesitamos tu autorización para responderte.';
  return e;
}

export default function Contact() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [sentVia, setSentVia] = useState<'api' | 'mail'>('api');
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const errors = validate(fields);
  const show = (k: FieldName) => (touched[k] ? errors[k] : undefined);
  const visibleSocial = social.filter((s) => s.url);

  useEffect(() => {
    const onPrefill = (e: Event) => {
      const { projectType, message } = (e as CustomEvent<PrefillDetail>).detail;
      setStatus('idle');
      setFields((f) => ({
        ...f,
        projectType: projectType ?? f.projectType,
        message: message && !f.message.trim() ? message : f.message,
      }));
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  const update = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const v = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFields((f) => ({ ...f, [name]: v }));
    if (status === 'error') setStatus('idle');
  };
  const blur = (k: FieldName) => () => setTouched((t) => ({ ...t, [k]: true }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    setTouched({ name: true, email: true, projectType: true, message: true, consent: true });
    const first = ORDER.find((k) => errors[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (fields.website) {
      setStatus('success');
      return;
    }

    const payload = {
      nombre: fields.name.trim(),
      correo: fields.email.trim(),
      empresa: fields.company.trim(),
      tipo: fields.projectType,
      mensaje: fields.message.trim(),
    };

    if (!contact.formEndpoint) {
      const body = `Nombre: ${payload.nombre}\nEmpresa: ${payload.empresa || '—'}\nCorreo: ${payload.correo}\nTipo de proyecto: ${payload.tipo}\n\n${payload.mensaje}`;
      window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(`Proyecto: ${payload.tipo}`)}&body=${encodeURIComponent(body)}`;
      setSentVia('mail');
      setStatus('success');
      return;
    }

    setStatus('loading');
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    try {
      const res = await fetch(contact.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(String(res.status));
      setSentVia('api');
      setStatus('success');
      setFields(EMPTY);
      setTouched({});
    } catch {
      setStatus('error');
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* sin permiso de portapapeles: el enlace mailto sigue disponible */
    }
  };

  const describedBy = (k: FieldName) => (show(k) ? `${k}-error` : undefined);

  return (
    <section id="contacto" aria-labelledby="contacto-title" className="section relative overflow-hidden">
      <div className="contact-glow" aria-hidden="true" />
      <div className="shell relative grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <Reveal as="p" className="eyebrow">
            <span className="text-crimson-300">07</span>
            <span className="eyebrow__rule" aria-hidden="true" />
            Contacto
          </Reveal>
          <Reveal delay={80}>
            <h2 id="contacto-title" className="section-title mt-5">
              {contactCopy.title[0]} <span className="text-gradient">{contactCopy.title[1]}</span>
            </h2>
          </Reveal>
          <Reveal as="p" delay={140} className="mt-6 max-w-md leading-relaxed text-frost-200">
            {contactCopy.lead}
          </Reveal>

          <Reveal delay={200} className="mt-10 space-y-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-frost-400">Correo</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <a href={`mailto:${contact.email}`} className="link-underline break-all font-display text-xl sm:text-2xl">
                  {contact.email}
                </a>
                <button type="button" onClick={copyEmail} className="chip chip--sm">
                  {copied ? 'Copiado ✓' : 'Copiar'}
                </button>
              </div>
            </div>
            {contact.phone && (
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-frost-400">Teléfono</p>
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="link-underline mt-2 inline-block font-display text-xl">
                  {contact.phone}
                </a>
              </div>
            )}
            {contact.location && (
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-frost-400">Ubicación</p>
                <p className="mt-2 font-display text-xl">{contact.location}</p>
              </div>
            )}
            {visibleSocial.length > 0 && (
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-frost-400">Redes</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {visibleSocial.map((s) => (
                    <li key={s.label}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="chip">
                        {s.label} <span aria-hidden="true">↗</span>
                        <span className="sr-only"> (se abre en una pestaña nueva)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {import.meta.env.DEV && visibleSocial.length === 0 && (
              <p className="rounded-lg border border-dashed border-ink/20 p-3 font-mono text-xs text-frost-400">
                [dev] Agrega las URL de redes sociales en src/config/site.ts para mostrarlas aquí.
              </p>
            )}
          </Reveal>
        </div>

        <Reveal delay={120}>
          <form ref={formRef} onSubmit={onSubmit} noValidate className="contact-form" aria-describedby="form-note">
            {status === 'success' ? (
              <div className="py-10 text-center" role="status">
                <span className="success-ring mx-auto" aria-hidden="true" />
                <h3 className="mt-6 font-display text-2xl font-semibold">
                  {sentVia === 'api' ? 'Mensaje recibido. Señal enviada.' : 'Tu mensaje está listo para enviarse.'}
                </h3>
                <p className="mx-auto mt-3 max-w-sm text-frost-200">
                  {sentVia === 'api'
                    ? 'Te responderemos al correo que indicaste.'
                    : `Se abrió tu aplicación de correo con el mensaje prellenado. Si no se abrió, escríbenos a ${contact.email}.`}
                </p>
                <Button variant="ghost" size="sm" className="mt-8" onClick={() => setStatus('idle')}>
                  Enviar otro mensaje
                </Button>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="field">
                    <label htmlFor="name">
                      <span>01</span> Nombre *
                    </label>
                    <input id="name" name="name" autoComplete="name" value={fields.name} onChange={update} onBlur={blur('name')} aria-invalid={!!show('name')} aria-describedby={describedBy('name')} required />
                    {show('name') && <p id="name-error" className="field__error">{show('name')}</p>}
                  </div>
                  <div className="field">
                    <label htmlFor="email">
                      <span>02</span> Correo *
                    </label>
                    <input id="email" name="email" type="email" autoComplete="email" inputMode="email" value={fields.email} onChange={update} onBlur={blur('email')} aria-invalid={!!show('email')} aria-describedby={describedBy('email')} required />
                    {show('email') && <p id="email-error" className="field__error">{show('email')}</p>}
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="company">
                    <span>03</span> Empresa <em>(opcional)</em>
                  </label>
                  <input id="company" name="company" autoComplete="organization" value={fields.company} onChange={update} />
                </div>

                <fieldset className="field" aria-describedby={describedBy('projectType')} aria-invalid={!!show('projectType')}>
                  <legend>
                    <span>04</span> Tipo de proyecto *
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {contactCopy.projectTypes.map((t) => (
                      <label key={t} className="choice">
                        <input
                          type="radio"
                          name="projectType"
                          value={t}
                          checked={fields.projectType === t}
                          onChange={update}
                          onBlur={blur('projectType')}
                        />
                        <span>{t}</span>
                      </label>
                    ))}
                  </div>
                  {show('projectType') && <p id="projectType-error" className="field__error">{show('projectType')}</p>}
                </fieldset>

                <div className="field">
                  <label htmlFor="message">
                    <span>05</span> Cuéntanos tu idea *
                  </label>
                  <textarea id="message" name="message" rows={5} maxLength={2000} value={fields.message} onChange={update} onBlur={blur('message')} aria-invalid={!!show('message')} aria-describedby={`message-count${show('message') ? ' message-error' : ''}`} required />
                  <div className="flex justify-between gap-4">
                    {show('message') ? <p id="message-error" className="field__error">{show('message')}</p> : <span />}
                    <span id="message-count" className="mt-2 shrink-0 font-mono text-[11px] text-frost-600">
                      {fields.message.length}/2000
                    </span>
                  </div>
                </div>

                <div className="hp" aria-hidden="true">
                  <label htmlFor="website">Sitio web</label>
                  <input id="website" name="website" tabIndex={-1} autoComplete="off" value={fields.website} onChange={update} />
                </div>

                <div className="field">
                  <label className="consent">
                    <input type="checkbox" name="consent" checked={fields.consent} onChange={update} onBlur={blur('consent')} aria-invalid={!!show('consent')} aria-describedby={describedBy('consent')} />
                    <span>
                      Autorizo el tratamiento de mis datos para responder a esta solicitud, según la{' '}
                      <a href={legal[0].href} className="link-underline" target="_blank" rel="noopener noreferrer">
                        política de privacidad
                      </a>
                      . *
                    </span>
                  </label>
                  {show('consent') && <p id="consent-error" className="field__error">{show('consent')}</p>}
                </div>

                {status === 'error' && (
                  <p className="form-alert" role="alert">
                    No pudimos enviar el mensaje. Revisa tu conexión e inténtalo de nuevo, o escríbenos directamente a{' '}
                    <a href={`mailto:${contact.email}`} className="link-underline">
                      {contact.email}
                    </a>
                    .
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p id="form-note" className="font-mono text-[11px] text-frost-600">
                    * Campos obligatorios
                  </p>
                  <Button type="submit" disabled={status === 'loading'} aria-busy={status === 'loading'}>
                    {status === 'loading' ? (
                      <>
                        <span className="spinner" aria-hidden="true" /> Enviando…
                      </>
                    ) : (
                      'Enviar mensaje'
                    )}
                  </Button>
                </div>
              </>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
