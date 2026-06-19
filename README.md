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
