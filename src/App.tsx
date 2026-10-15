import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { navSections } from './config/site';
import { Header } from './components/layout/Header';
import { ScrollRail } from './components/layout/ScrollRail';
import { Footer } from './components/layout/Footer';
import { TechBackground } from './components/background/TechBackground';
import Hero from './sections/Hero';
import Manifesto from './sections/Manifesto';
import { useScrollSpy } from './hooks/useScrollSpy';
import { shouldPlayIntro } from './lib/intro';

// La intro y las secciones bajo el pliegue se cargan como fragmentos separados.
const Intro = lazy(() => import('./components/intro/Intro'));
const Services = lazy(() => import('./sections/Services'));
const Lab = lazy(() => import('./sections/Lab'));
const Projects = lazy(() => import('./sections/Projects'));
const Methodology = lazy(() => import('./sections/Methodology'));
const RealWorld = lazy(() => import('./sections/RealWorld'));
const Contact = lazy(() => import('./sections/Contact'));

const SECTION_IDS = navSections.map((s) => s.id);

/** Reserva el espacio (y el ancla) de una sección mientras se descarga su código. */
function Placeholder({ id }: { id: string }) {
  return <div id={id} className="min-h-screen" aria-busy="true" />;
}

export default function App() {
  const [introOpen, setIntroOpen] = useState(shouldPlayIntro);
  const pageRef = useRef<HTMLDivElement>(null);
  const active = useScrollSpy(SECTION_IDS);

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    // Mientras la intro está activa, el resto de la página queda fuera del foco del teclado.
    el.toggleAttribute('inert', introOpen);
    document.documentElement.classList.toggle('intro-lock', introOpen);
  }, [introOpen]);

  // Enlaces profundos (/#contacto): esperar a que la sección diferida exista antes de desplazar.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    let tries = 0;
    const timer = window.setInterval(() => {
      const el = document.getElementById(id);
      if (el && !el.hasAttribute('aria-busy')) {
        el.scrollIntoView();
        window.clearInterval(timer);
      } else if (++tries > 50) {
        window.clearInterval(timer);
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, []);

  const finishIntro = useCallback(() => {
    setIntroOpen(false);
    requestAnimationFrame(() => document.getElementById('main')?.focus({ preventScroll: true }));
  }, []);

  return (
    <>
      {introOpen && (
        <Suspense fallback={<div className="intro" aria-hidden="true" />}>
          <Intro onDone={finishIntro} />
        </Suspense>
      )}

      <div ref={pageRef}>
        <TechBackground />
        <a href="#main" className="skip-link">
          Saltar al contenido
        </a>
        <ScrollRail active={active} />
        <Header active={active} />
        <main id="main" tabIndex={-1} className="outline-none">
          <Hero ready={!introOpen} />
          <Manifesto />
          <Suspense fallback={<Placeholder id="servicios" />}>
            <Services />
          </Suspense>
          <Suspense fallback={<Placeholder id="laboratorio" />}>
            <Lab />
          </Suspense>
          <Suspense fallback={<Placeholder id="proyectos" />}>
            <Projects />
          </Suspense>
          <Suspense fallback={<Placeholder id="metodologia" />}>
            <Methodology />
          </Suspense>
          <Suspense fallback={<Placeholder id="mundo-real" />}>
            <RealWorld />
          </Suspense>
          <Suspense fallback={<Placeholder id="contacto" />}>
            <Contact />
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
}
