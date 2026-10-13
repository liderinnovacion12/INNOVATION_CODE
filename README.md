# INNOVATION CODE SERVICES SAS · Sitio web

React 18 + TypeScript + Vite + Tailwind CSS. Sin librerías 3D: la intro y el núcleo del hero son Canvas 2D con proyección 3D propia.

## Comandos

```bash
npm install
npm run dev       # desarrollo en http://localhost:5173
npm run build     # verificación de tipos + build de producción en dist/
npm run preview   # sirve dist/ localmente
```

`dist/` es estático: se puede publicar en cualquier hosting (Netlify, Vercel, S3, cPanel…).

## Editar contenido

Todo el contenido está en **`src/config/site.ts`**: textos, servicios, nodos del laboratorio, proyectos, metodología, programa del brazo robótico, correo, redes y enlaces legales.

Antes de publicar, revisa lo marcado con ⚠️:

- `contact.email`: correo empresarial real.
- `social`: URLs de redes (las que estén vacías no se muestran).
- `projects`: son **conceptos demostrativos** (`isDemo: true`). Reemplázalos por proyectos reales y cambia `isDemo` a `false`.
- `public/legal/*.html`: plantillas de política de privacidad y términos que la empresa debe completar.

## Formulario de contacto

Copia `.env.example` a `.env` y define `VITE_CONTACT_ENDPOINT` (Formspree, API propia…). El formulario envía un POST JSON con `nombre`, `correo`, `empresa`, `tipo` y `mensaje`.
Si no hay endpoint, abre el cliente de correo del visitante con el mensaje prellenado.

## Videos de servicios

Los videos viven en `public/videos/` (MP4 + imagen `.jpg` del mismo nombre como portada). Para añadir uno a un módulo,
agrega en `src/config/site.ts` la línea `video: media('nombre-del-archivo')` al servicio (o `media('nombre', 1.2)`
para saltar los primeros 1,2 s en cada vuelta). Se reproducen silenciados, en bucle y solo mientras están en pantalla;
los módulos sin video muestran su firma visual.

## Tema claro / oscuro

El botón de la cabecera alterna entre vista oscura (por defecto, identidad de marca) y clara; la elección se guarda en `localStorage` (`ics:theme`).
Los colores son tokens RGB definidos en `src/styles/index.css` (`:root` y `:root[data-theme='light']`) y expuestos a Tailwind en `tailwind.config.js`
(`void` = superficies, `frost` = texto, `ink` = líneas). La intro y el editor de código usan la clase `.force-dark` y siempre se ven oscuros.

## Intro

Se reproduce en cada carga o recarga de la página. Se puede omitir con el botón o con `Esc`, y con `prefers-reduced-motion` se muestra en versión estática.
Si la URL lleva un ancla (`/#contacto`), al terminar la intro la página queda en esa sección.
