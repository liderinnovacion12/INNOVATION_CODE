/**
 * CONTENIDO EDITABLE DEL SITIO
 * ---------------------------------------------------------------------------
 * Todos los textos, datos de contacto, enlaces y datos de secciones viven aquí.
 * Edita este archivo para actualizar el sitio sin tocar los componentes.
 * Los campos marcados con ⚠️ deben verificarse/reemplazarse antes de publicar.
 */

export const company = {
  legalName: 'INNOVATION CODE SERVICES SAS',
  brandTop: 'INNOVATION',
  brandBottom: 'CODE SERVICES SAS',
  tagline: 'Convertimos ideas en tecnología que transforma',
  summary:
    'Desarrollo de software a medida, automatización de procesos y soluciones robóticas que conectan lo digital con el mundo físico.',
};

export const contact = {
  // ⚠️ Reemplazar por el correo empresarial real.
  email: 'contacto@innovationcodeservices.com',
  // Opcionales: se ocultan automáticamente si quedan vacíos.
  phone: '', // ej. '+57 300 000 0000'
  location: '', // ej. 'Bogotá, Colombia'
  // Endpoint del formulario (Formspree, API propia…). Se define en .env → VITE_CONTACT_ENDPOINT.
  // Si está vacío, el formulario abre el cliente de correo con el mensaje prellenado.
  formEndpoint: import.meta.env.VITE_CONTACT_ENDPOINT ?? '',
};

/** ⚠️ Agrega las URL reales. Las redes con `url` vacía no se muestran en el sitio publicado. */
export const social: { label: string; url: string }[] = [
  { label: 'LinkedIn', url: '' },
  { label: 'GitHub', url: '' },
  { label: 'Instagram', url: '' },
  { label: 'YouTube', url: '' },
];

const base = import.meta.env.BASE_URL;
export const legal = [
  { label: 'Política de privacidad y tratamiento de datos', href: `${base}legal/privacidad.html` },
  { label: 'Términos de uso', href: `${base}legal/terminos.html` },
];

export const navSections = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'manifiesto', label: 'Manifiesto' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'laboratorio', label: 'Laboratorio' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'metodologia', label: 'Metodología' },
  { id: 'mundo-real', label: 'Código → Mundo real' },
  { id: 'contacto', label: 'Contacto' },
] as const;

export const headerNav = ['servicios', 'laboratorio', 'proyectos', 'metodologia', 'contacto'] as const;

/* ------------------------------------------------------------------ HERO */

export const hero = {
  eyebrow: 'Ingeniería de software · Automatización · Robótica',
  title: ['El futuro', 'no se espera.', 'Se programa.'],
  lead: 'Desarrollamos software, automatizamos procesos y construimos soluciones robóticas para transformar desafíos en posibilidades reales.',
  primaryCta: 'Explorar soluciones',
  secondaryCta: 'Hablemos de tu proyecto',
  hud: [
    { label: 'Núcleo', value: 'Software' },
    { label: 'Bus', value: 'Integración' },
    { label: 'Actuador', value: 'Robótica' },
  ],
  ticker: [
    'Software a medida',
    'Aplicaciones web',
    'Plataformas empresariales',
    'Automatización',
    'Inteligencia artificial aplicada',
    'Robótica',
    'Hardware + software',
    'Prototipado',
    'Consultoría tecnológica',
  ],
};

/* ------------------------------------------------------------ MANIFIESTO */

/** Las palabras entre *asteriscos* se resaltan con el gradiente de marca. */
export const manifesto = [
  'Pensamos *diferente.*',
  'Diseñamos el *mañana.*',
  'Escribimos código que *piensa*',
  'y construimos máquinas que *actúan.*',
  'Lo imposible es solo un requisito *sin resolver.*',
];

/* ------------------------------------------------------------- SERVICIOS */

export interface ServiceModule {
  id: string;
  code: string;
  name: string;
  short: string;
  description: string;
  capabilities: string[];
  note?: string;
  seed: number;
  /** Video opcional del módulo (archivos en public/videos). `start` salta segundos iniciales en cada vuelta. */
  video?: { src: string; poster: string; start?: number };
}

const media = (name: string, start?: number) => ({
  src: `${import.meta.env.BASE_URL}videos/${name}.mp4`,
  poster: `${import.meta.env.BASE_URL}videos/${name}.jpg`,
  start,
});

export const services: ServiceModule[] = [
  {
    id: 'software-a-medida',
    code: 'MOD-01',
    name: 'Software a medida',
    short: 'Sistemas diseñados para tu operación, no al revés.',
    description:
      'Analizamos tus procesos y construimos software que se adapta a ellos: arquitectura sólida, código mantenible y documentación para que la solución crezca contigo.',
    capabilities: ['Arquitectura y modelado de dominio', 'Backends y APIs', 'Aplicaciones de escritorio y móviles', 'Mantenimiento evolutivo'],
    seed: 11,
    video: media('software-a-medida'),
  },
  {
    id: 'aplicaciones-web',
    code: 'MOD-02',
    name: 'Aplicaciones web',
    short: 'Interfaces rápidas, accesibles y listas para escalar.',
    description:
      'Creamos aplicaciones web modernas con foco en rendimiento, accesibilidad y experiencia de usuario, desde portales de clientes hasta herramientas internas.',
    capabilities: ['Aplicaciones SPA y SSR', 'Diseño de interfaces y sistemas de diseño', 'Optimización de rendimiento y SEO', 'Integración con servicios externos'],
    seed: 27,
    video: media('aplicaciones-web', 1.2),
  },
  {
    id: 'plataformas-empresariales',
    code: 'MOD-03',
    name: 'Plataformas empresariales',
    short: 'Un sistema central para datos, equipos y decisiones.',
    description:
      'Diseñamos plataformas que unifican información y procesos: paneles de gestión, flujos de aprobación, roles, trazabilidad e integración con los sistemas que ya usas.',
    capabilities: ['Gestión de usuarios, roles y permisos', 'Paneles e informes', 'Integración con ERP/CRM', 'Infraestructura en la nube'],
    seed: 42,
  },
  {
    id: 'automatizacion',
    code: 'MOD-04',
    name: 'Automatización de procesos',
    short: 'Menos tareas repetitivas, más tiempo para lo importante.',
    description:
      'Identificamos tareas manuales y las convertimos en flujos automáticos y medibles: integración entre aplicaciones, procesamiento de documentos y orquestación de tareas.',
    capabilities: ['Mapeo y rediseño de procesos', 'Integraciones entre sistemas', 'Procesamiento de documentos', 'Alertas y monitoreo'],
    seed: 63,
  },
  {
    id: 'inteligencia-artificial',
    code: 'MOD-05',
    name: 'Inteligencia artificial aplicada',
    short: 'IA donde suma valor real, no como adorno.',
    description:
      'Evaluamos si la IA es la herramienta adecuada para tu reto y, cuando aplica, integramos modelos de lenguaje, visión artificial o analítica predictiva en tus productos.',
    capabilities: ['Evaluación de viabilidad', 'Asistentes y búsqueda sobre documentos', 'Visión artificial', 'Clasificación y predicción'],
    note: 'Solo proponemos IA cuando aporta un beneficio claro y medible para el proyecto.',
    seed: 77,
  },
  {
    id: 'robotica',
    code: 'MOD-06',
    name: 'Robótica',
    short: 'Máquinas que perciben, deciden y actúan.',
    description:
      'Desarrollamos soluciones robóticas: control de movimiento, lectura de sensores, lógica de decisión e interfaces para operar y supervisar los equipos.',
    capabilities: ['Control de actuadores y motores', 'Integración de sensores', 'Programación de rutinas', 'Supervisión remota'],
    seed: 91,
    video: media('robotica'),
  },
  {
    id: 'hardware-software',
    code: 'MOD-07',
    name: 'Integración hardware + software',
    short: 'El puente entre el dispositivo y la nube.',
    description:
      'Conectamos dispositivos físicos con plataformas digitales: firmware, comunicación con controladores, captura de datos y visualización en tiempo real.',
    capabilities: ['Firmware y microcontroladores', 'Protocolos de comunicación', 'Captura y envío de datos', 'Tableros en tiempo real'],
    seed: 105,
  },
  {
    id: 'prototipado',
    code: 'MOD-08',
    name: 'Prototipado',
    short: 'De la idea a algo que puedes tocar y probar.',
    description:
      'Validamos ideas rápido con prototipos funcionales —digitales o físicos— para reducir riesgo antes de invertir en la versión completa.',
    capabilities: ['Prototipos navegables', 'Pruebas de concepto técnicas', 'Prototipos electrónicos', 'Validación con usuarios'],
    seed: 128,
  },
  {
    id: 'consultoria',
    code: 'MOD-09',
    name: 'Consultoría tecnológica',
    short: 'Decisiones técnicas con criterio y sin humo.',
    description:
      'Te acompañamos a definir arquitectura, elegir tecnologías, priorizar un roadmap y evaluar el estado de sistemas existentes.',
    capabilities: ['Diagnóstico de sistemas', 'Definición de arquitectura', 'Hoja de ruta tecnológica', 'Acompañamiento a equipos'],
    seed: 144,
  },
];

/* ----------------------------------------------------------- LABORATORIO */

export type LabKind = 'físico' | 'digital' | 'inteligencia';

export interface LabNode {
  id: string;
  label: string;
  kind: LabKind;
  description: string;
  inputs: string[];
  outputs: string[];
  /** Posición en % — escritorio (x, y) y móvil (mx, my). */
  x: number;
  y: number;
  mx: number;
  my: number;
}

export const labNodes: LabNode[] = [
  { id: 'sensores', label: 'Sensores', kind: 'físico', description: 'Capturan el estado del mundo: temperatura, distancia, presión, posición.', inputs: ['Entorno físico'], outputs: ['Lecturas en bruto'], x: 9, y: 26, mx: 22, my: 8 },
  { id: 'vision', label: 'Visión', kind: 'físico', description: 'Cámaras que convierten la escena en datos para inspección y guiado.', inputs: ['Imagen'], outputs: ['Fotogramas', 'Detecciones'], x: 11, y: 74, mx: 78, my: 8 },
  { id: 'edge', label: 'Controlador edge', kind: 'físico', description: 'Procesa señales cerca del equipo y toma decisiones de baja latencia.', inputs: ['Lecturas', 'Comandos'], outputs: ['Eventos', 'Órdenes de movimiento'], x: 31, y: 50, mx: 50, my: 27 },
  { id: 'api', label: 'API e integraciones', kind: 'digital', description: 'Capa que conecta dispositivos, aplicaciones y sistemas empresariales.', inputs: ['Eventos', 'Peticiones'], outputs: ['Datos normalizados'], x: 52, y: 22, mx: 22, my: 46 },
  { id: 'datos', label: 'Datos', kind: 'digital', description: 'Almacenamiento histórico y trazabilidad de todo lo que ocurre.', inputs: ['Datos normalizados'], outputs: ['Consultas', 'Históricos'], x: 54, y: 76, mx: 78, my: 46 },
  { id: 'ia', label: 'Modelos IA', kind: 'inteligencia', description: 'Detectan patrones, clasifican y sugieren decisiones cuando el caso lo amerita.', inputs: ['Históricos', 'Detecciones'], outputs: ['Predicciones', 'Alertas'], x: 73, y: 50, mx: 50, my: 65 },
  { id: 'interfaz', label: 'Interfaces', kind: 'digital', description: 'Aplicaciones web y móviles para operar, supervisar y decidir.', inputs: ['Datos', 'Alertas'], outputs: ['Acciones del usuario'], x: 91, y: 24, mx: 22, my: 90 },
  { id: 'actuadores', label: 'Actuadores', kind: 'físico', description: 'Motores, brazos y mecanismos que llevan la decisión al mundo real.', inputs: ['Órdenes de movimiento'], outputs: ['Movimiento'], x: 91, y: 78, mx: 78, my: 90 },
];

export const labLinks: [string, string][] = [
  ['sensores', 'edge'],
  ['vision', 'edge'],
  ['edge', 'api'],
  ['edge', 'datos'],
  ['api', 'datos'],
  ['api', 'ia'],
  ['datos', 'ia'],
  ['api', 'interfaz'],
  ['ia', 'interfaz'],
  ['ia', 'actuadores'],
  ['edge', 'actuadores'],
];

/* ------------------------------------------------------------- PROYECTOS */

export type ProjectCategory = 'software' | 'web' | 'automatizacion' | 'robotica' | 'ia';
export type ProjectVisualKind = 'platform' | 'arm' | 'portal' | 'flow' | 'vision' | 'twin';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  categories: ProjectCategory[];
  visual: ProjectVisualKind;
  summary: string;
  challenge: string;
  approach: string[];
  stack: string[];
  /** true = concepto demostrativo; false = proyecto real entregado por la empresa. */
  isDemo: boolean;
}

export const projectFilters: { id: ProjectCategory | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'software', label: 'Software' },
  { id: 'web', label: 'Web' },
  { id: 'automatizacion', label: 'Automatización' },
  { id: 'robotica', label: 'Robótica' },
  { id: 'ia', label: 'IA' },
];

/**
 * ⚠️ Conceptos demostrativos. Reemplázalos por proyectos reales de la empresa
 * (y cambia `isDemo` a false) cuando estén disponibles.
 */
export const projects: Project[] = [
  {
    id: 'nexo-ops',
    title: 'Nexo Ops',
    subtitle: 'Plataforma de gestión operativa',
    categories: ['software', 'web'],
    visual: 'platform',
    summary: 'Un centro de control para órdenes, inventario y equipos de campo en una sola interfaz.',
    challenge: 'Información dispersa en hojas de cálculo y correos que impide ver el estado real de la operación.',
    approach: ['Modelo de datos único para órdenes e inventario', 'Panel con estados en tiempo real', 'Roles y trazabilidad de cada cambio'],
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    isDemo: true,
  },
  {
    id: 'pick-01',
    title: 'Pick-01',
    subtitle: 'Brazo robótico de clasificación',
    categories: ['robotica'],
    visual: 'arm',
    summary: 'Celda robótica que identifica piezas en una banda y las clasifica por tipo.',
    challenge: 'Clasificación manual lenta y propensa a errores en una línea con alta variedad de piezas.',
    approach: ['Control de trayectorias del brazo', 'Lectura de sensores de presencia', 'Interfaz de supervisión y paro seguro'],
    stack: ['Python', 'ROS 2', 'Microcontroladores', 'Visión artificial'],
    isDemo: true,
  },
  {
    id: 'portal-360',
    title: 'Portal 360',
    subtitle: 'Portal web de autoservicio',
    categories: ['web'],
    visual: 'portal',
    summary: 'Portal donde los clientes consultan, solicitan y hacen seguimiento sin depender de llamadas.',
    challenge: 'Alto volumen de solicitudes repetitivas atendidas manualmente por el equipo de soporte.',
    approach: ['Flujos de autoservicio guiados', 'Notificaciones de estado', 'Diseño accesible y responsive'],
    stack: ['React', 'TypeScript', 'API REST', 'Tailwind CSS'],
    isDemo: true,
  },
  {
    id: 'docflow',
    title: 'DocFlow',
    subtitle: 'Automatización documental',
    categories: ['automatizacion', 'ia'],
    visual: 'flow',
    summary: 'Flujo que recibe documentos, extrae los datos clave y los registra en los sistemas correctos.',
    challenge: 'Digitación manual de facturas y formularios con retrasos y errores de transcripción.',
    approach: ['Ingesta desde correo y carpetas', 'Extracción de campos con validación humana', 'Registro automático en el ERP'],
    stack: ['Python', 'Colas de tareas', 'OCR', 'Integraciones API'],
    isDemo: true,
  },
  {
    id: 'q-vision',
    title: 'Q-Vision',
    subtitle: 'Visión artificial para control de calidad',
    categories: ['ia', 'robotica'],
    visual: 'vision',
    summary: 'Estación de inspección que detecta defectos visuales y separa piezas no conformes.',
    challenge: 'Inspección visual manual inconsistente entre turnos.',
    approach: ['Captura con iluminación controlada', 'Modelo de detección de defectos', 'Actuador de descarte sincronizado'],
    stack: ['Python', 'OpenCV', 'Modelos de visión', 'Controlador industrial'],
    isDemo: true,
  },
  {
    id: 'twin-lab',
    title: 'Twin Lab',
    subtitle: 'Gemelo digital de una línea de producción',
    categories: ['software', 'automatizacion'],
    visual: 'twin',
    summary: 'Réplica digital de una línea para simular cambios antes de aplicarlos en planta.',
    challenge: 'Cambios de configuración que se prueban directamente en producción, con riesgo de paradas.',
    approach: ['Modelo de estaciones y tiempos de ciclo', 'Datos en vivo desde sensores', 'Simulación de escenarios'],
    stack: ['TypeScript', 'WebGL', 'MQTT', 'Series de tiempo'],
    isDemo: true,
  },
];

/* ----------------------------------------------------------- METODOLOGÍA */

export const methodology = [
  {
    id: 'descubrir',
    label: 'Descubrir',
    description: 'Entendemos el problema antes de proponer tecnología: objetivos, usuarios, procesos actuales y restricciones.',
    question: '¿Qué tiene que ser verdad para que este proyecto sea un éxito?',
    deliverables: ['Mapa del problema', 'Requisitos priorizados', 'Riesgos identificados'],
  },
  {
    id: 'disenar',
    label: 'Diseñar',
    description: 'Definimos arquitectura, experiencia de usuario y, si hay hardware, la integración física. Validamos con prototipos.',
    question: '¿Cuál es la solución más simple que resuelve el problema?',
    deliverables: ['Arquitectura técnica', 'Prototipo navegable', 'Plan de entregas'],
  },
  {
    id: 'construir',
    label: 'Construir',
    description: 'Desarrollamos en ciclos cortos con entregas funcionales que puedes revisar desde las primeras semanas.',
    question: '¿Qué podemos poner en tus manos en el próximo ciclo?',
    deliverables: ['Incrementos funcionales', 'Código versionado', 'Demostraciones periódicas'],
  },
  {
    id: 'probar',
    label: 'Probar',
    description: 'Pruebas automatizadas, revisión con usuarios reales y validación en el entorno físico cuando hay robótica.',
    question: '¿Funciona igual de bien fuera del laboratorio?',
    deliverables: ['Plan y reporte de pruebas', 'Ajustes de usabilidad', 'Validación en campo'],
  },
  {
    id: 'evolucionar',
    label: 'Evolucionar',
    description: 'Despliegue, acompañamiento y mejora continua a partir del uso real y de nuevas necesidades.',
    question: '¿Qué aprendimos y qué sigue?',
    deliverables: ['Despliegue y capacitación', 'Monitoreo', 'Hoja de ruta de mejoras'],
  },
];

/* ---------------------------------------------------- CÓDIGO → MUNDO REAL */

export interface ArmPose {
  shoulder: number;
  elbow: number;
  wrist: number;
  grip: 0 | 1;
  scan?: boolean;
}

export const realWorldProgram: { code: string; log: string; pose: ArmPose }[] = [
  { code: "const arm = await Robot.connect('ICS-ARM');", log: 'Enlace con el controlador', pose: { shoulder: 0, elbow: 0, wrist: 0, grip: 0 } },
  { code: 'await arm.calibrate();', log: 'Calibración de articulaciones', pose: { shoulder: -10, elbow: 12, wrist: -12, grip: 0 } },
  { code: 'const pieza = await vision.detect();', log: 'Sensor: objeto detectado', pose: { shoulder: 10, elbow: 30, wrist: 38, grip: 0, scan: true } },
  { code: 'await arm.moveTo(pieza.posicion);', log: 'Trayectoria calculada y ejecutada', pose: { shoulder: 16, elbow: 54, wrist: 62, grip: 0 } },
  { code: "await arm.grip('cerrar');", log: 'Pinza cerrada', pose: { shoulder: 16, elbow: 54, wrist: 62, grip: 1 } },
  { code: 'await arm.moveTo(BANDA_SALIDA);', log: 'Pieza trasladada', pose: { shoulder: -24, elbow: -4, wrist: 14, grip: 1 } },
  { code: "await arm.grip('abrir');", log: 'Ciclo completado', pose: { shoulder: -24, elbow: -4, wrist: 14, grip: 0 } },
];

export const realWorldPipeline = ['Código', 'Firmware', 'Controlador', 'Actuadores', 'Mundo físico'];

/* --------------------------------------------------------------- CONTACTO */

export const contactCopy = {
  title: ['¿Tienes una idea?', 'Programemos su futuro.'],
  lead: 'Cuéntanos qué quieres construir. Respondemos con preguntas concretas y una propuesta de siguientes pasos.',
  projectTypes: [...services.map((s) => s.name), 'Otro'],
};
