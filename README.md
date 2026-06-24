# Jandro Santos — Portfolio

Portfolio interactivo personal. Cuatro personajes 3D, cuatro "mundos", un
developer. Cada personaje recolorea la página entera y abre una sección:
**Conecta**, **Proyectos**, **Experiencia** y **Estudios**.

Construido con **React + Vite + TypeScript + Tailwind v4 + Framer Motion**.

## Características

- 🎭 **Carrusel de personajes** que recolorea todo el sitio y navega entre secciones
- 🧲 **Hero magnético** con tipografía cinética gigante
- 🌗 **Bilingüe ES/EN** con un cambio de idioma premium y con guasa
- 🃏 **Easter egg**: una terminal interactiva real (código Konami `↑↑↓↓←→←→ B A` o escribe `sudo`)
- ✨ Cursor personalizado, scroll suave (Lenis), efectos de "decode", cards apiladas
- ♿ Accesible: respeta `prefers-reduced-motion`, navegación por teclado, áreas táctiles ≥44px
- 📱 Responsive de verdad — pensado para que en móvil quede igual de guapo

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run preview  # previsualizar el build
```

## ⚠️ Imágenes de los personajes (IMPORTANTE)

Las 4 figuras 3D viven en `src/assets/characters/` con estos nombres exactos:

| Personaje      | Archivo       | Mundo / Sección       |
| -------------- | ------------- | --------------------- |
| El Conector    | `social.png`  | Conecta (coral)       |
| El Constructor | `builder.png` | Proyectos (naranja)   |
| El Ejecutivo   | `exec.png`    | Experiencia (azul)    |
| El Estudiante  | `nerd.png`    | Estudios (verde)      |

Ahora mismo hay **placeholders** generados automáticamente. Para poner tus
imágenes reales, **sustituye esos 4 archivos** manteniendo el nombre (PNG con
fondo transparente, formato vertical). No hay que tocar nada de código: encajan
solas.

## Editar el contenido

Casi todo el texto está en un único sitio, en español e inglés:

- **`src/i18n/dict.ts`** — bio, proyectos, experiencia, estudios, skills,
  microcopy y los textos del cambio de idioma. Edita `es` y `en`.
- **`src/data/content.ts`** — datos neutros (nombre, redes sociales, email).
- **`src/data/characters.ts`** — colores de cada mundo y orden del carrusel.

## Estructura

```
src/
├── components/
│   ├── carousel/   # el navegador de personajes
│   ├── sections/   # Conecta · Proyectos · Experiencia · Estudios
│   ├── terminal/   # el easter egg
│   └── ui/         # Magnet, Cursor, DecodeText, toggles…
├── data/           # datos neutros y configuración de personajes
├── hooks/          # mundo activo, idioma, scroll, easter egg
├── i18n/           # diccionario ES/EN
└── lib/            # utilidades
```
cuando el video del scroll termine, debes dejar el video que te añado como fondo, manten la idea de la casa de información y eso, lo de la imagen no lo habias conseguido bien ya que no era pantalla completa, pero ahora en cuanto acabe pones ese video siguiendo esto: on the attached design and mouse-scRUB controlled background video. The background is a video that is muted, dosent autoplay, and is controlled by horizontal mouse movement -- mouse on the left = start of the video, mouse on the right = end Movement should feel smooth and buttery.         -----------------              the cat turns head to the right and then to left at a steady, natural pace. Its eyes follow the movement naturally. The body stays still, no hears. keep the station, lighting, composition, and character design unchanged. No camera movement, no zoom, no cuts, no scene change
