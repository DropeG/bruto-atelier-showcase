# 🎨 BRUTO ATELIER SHOWCASE

**Aplicación web de catálogo y portafolio para estudio de diseño de muebles y arquitectura**

**URL en Vivo**: https://bruto-atelier-showcase.vercel.app/

---

## 📋 TABLA DE CONTENIDOS

1. [Descripción General](#descripción-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Configuración Inicial](#configuración-inicial)
5. [Scripts Disponibles](#scripts-disponibles)
6. [Funcionalidades Principales](#funcionalidades-principales)
7. [Contextos Globales](#contextos-globales)
8. [Rutas de la Aplicación](#rutas-de-la-aplicación)
9. [Componentes Principales](#componentes-principales)
10. [Data y Galería](#data-y-galería)
11. [Optimizaciones de Performance](#optimizaciones-de-performance)
12. [Guía de Desarrollo](#guía-de-desarrollo)
13. [Problemas Comunes](#problemas-comunes)

---

## 📍 DESCRIPCIÓN GENERAL

**BRUTO Atelier** es una plataforma showcase premium para un estudio de diseño especializado en:

- **Muebles bespoke** (hechos a medida)
- **Proyectos de arquitectura interior**
- **Proyectos de interiorismo**

### Características Clave

- 📱 **Responsive design** - Funciona perfectamente en desktop, tablet y móvil
- 🎨 **Galería interactiva** - Carrusel de imágenes con efectos visuales
- 💰 **Sistema multimoneda** - Soporte para 12 países (CL, AR, CO, MX, PE, CR, EC, UY, BO, PY, US, ES)
- 🔐 **Autenticación** - Sistema de login/signup para usuarios
- 📧 **Newsletter** - Modal de suscripción
- ⚡ **Performance optimizado** - Lazy loading, blur backgrounds, optimizaciones de imagen
- 🎬 **Animaciones fluidas** - Framer Motion para transiciones suaves
- 📱 **WhatsApp integration** - Botón directo para contacto

---

## 🛠 STACK TECNOLÓGICO

### Frontend Framework
- **React** 18.3.1 - UI library
- **React Router** 6.30.1 - Enrutamiento SPA
- **TypeScript** 5.8.3 - Type safety

### Build Tool
- **Vite** 5.4.19 - Build moderno y rápido

### Styling
- **Tailwind CSS** 3.4.17 - Utility-first CSS
- **PostCSS** 8.5.6 - CSS processing
- **Autoprefixer** 10.4.21 - Prefijos automáticos

### UI Components
- **shadcn/ui** - Componentes reutilizables
- **Radix UI** - 30+ componentes accesibles

### Animaciones
- **Framer Motion** 12.23.26 - Animaciones declarativas
- **tailwindcss-animate** 1.0.7 - Animaciones Tailwind

### Carruseles
- **Embla Carousel** 8.6.0 - Carruseles accesibles

### Estado Global
- **React Context API** - AuthContext, CurrencyContext, ScrollContext
- **TanStack React Query** 5.83.0 - Gestión de datos servidor

### Forms & Validación
- **React Hook Form** 7.61.1 - Manejo de formularios
- **Zod** 3.25.76 - Validación de esquemas
- **@hookform/resolvers** 3.10.0 - Integración validadores

### Utilidades
- **date-fns** 3.6.0 - Manipulación de fechas
- **clsx** 2.1.1 - Condicional className
- **tailwind-merge** 2.6.0 - Merge de clases Tailwind
- **sharp** 0.34.5 - Procesamiento de imágenes
- **Lucide React** 0.462.0 - Iconografía
- **Sonner** 1.7.4 - Toast notifications
- **next-themes** 0.3.0 - Temas (dark/light)

### Desarrollo
- **ESLint** 9.32.0 - Linting
- **Lovable Tagger** 1.1.13 - Herramienta de etiquetado

### Deploy
- **Vercel** - Hosting (vercel.json configurado)

---

## 📁 ESTRUCTURA DEL PROYECTO

```
bruto-atelier-showcase/
│
├── 📁 src/
│   ├── 📁 pages/                    # Páginas SPA
│   │   ├── Index.tsx               # Home - 10 imágenes + scroll snap
│   │   ├── Arquitectura.tsx         # Proyectos de arquitectura
│   │   ├── Interiorismo.tsx         # Proyectos de interiorismo
│   │   ├── Coleccion.tsx            # Catálogo de colecciones
│   │   ├── Serie.tsx                # Series de productos
│   │   ├── Piezas.tsx               # Piezas con carrusel automático
│   │   ├── Category.tsx             # Página dinámica /categoria/:cat/:col/:id
│   │   ├── Auth.tsx                 # Login/Signup
│   │   └── NotFound.tsx             # 404
│   │
│   ├── 📁 components/
│   │   ├── 📁 ui/                   # shadcn/ui components (30+)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── carousel.tsx
│   │   │   ├── accordion.tsx
│   │   │   └── ... (20+ más)
│   │   │
│   │   ├── Layout.tsx                # Componente wrapper
│   │   ├── Navigation.tsx             # Header con Framer Motion
│   │   ├── Footer.tsx                 # Pie de página
│   │   ├── HeroSection.tsx            # Sección hero con picture tag
│   │   ├── HoverableImage.tsx         # Imagen con hover + blur lazy loading
│   │   ├── ImageRow.tsx               # Dos imágenes lado a lado
│   │   ├── LazyImage.tsx              # NUEVO - Componente lazy loading
│   │   ├── VideoSection.tsx           # Sección de video
│   │   ├── ProductSection.tsx         # Sección de producto
│   │   ├── ContactSection.tsx         # Sección de contacto
│   │   ├── NewsletterModal.tsx        # Modal newsletter
│   │   ├── AuthModal.tsx              # Modal login/signup
│   │   ├── CurrencyDropdown.tsx       # Selector de moneda
│   │   ├── Price.tsx                  # Componente precio
│   │   ├── WhatsAppButton.tsx         # Botón WhatsApp flotante
│   │   ├── DiscountButton.tsx         # Botón descuento
│   │   └── index.ts                   # Barrel exports
│   │
│   ├── 📁 contexts/                   # Context API
│   │   ├── AuthContext.tsx            # user, login, logout, signup
│   │   ├── CurrencyContext.tsx        # Monedas (12 países)
│   │   └── ScrollContext.tsx          # Gestión de scroll
│   │
│   ├── 📁 hooks/                      # Custom hooks
│   │   ├── useNavigateBack.ts        # Navegación atrás
│   │   ├── use-toast.ts              # Toast hook
│   │   ├── use-mobile.tsx            # Detección mobile
│   │   └── index.ts
│   │
│   ├── 📁 lib/                        # Utilidades
│   │   ├── utils.ts                  # Funciones helper
│   │   └── blur-placeholders.ts      # NUEVO - Base64 mini-previews
│   │
│   ├── 📁 data/                       # Datos estáticos
│   │   └── Gallery.tsx               # 10 items con 2 imágenes c/u
│   │
│   ├── App.tsx                        # Componente raíz + rutas
│   ├── App.css                        # Estilos globales
│   ├── index.css                      # Estilos reset + globals
│   ├── main.tsx                       # Entry point
│   └── vite-env.d.ts                 # Types de Vite
│
├── 📁 public/
│   ├── 📁 images/                     # Assets de imágenes
│   │   ├── hero.webp                 # Hero desktop
│   │   ├── heroMobile.webp          # Hero mobile
│   │   ├── 📁 home/
│   │   │   ├── image1.webp - image10.webp
│   │   │
│   │   ├── 📁 nosotros/              # Fotos sección nosotros
│   │   ├── 📁 contacto/              # Fotos sección contacto
│   │   ├── 📁 newsLetterModal/       # Modal newsletter
│   │   ├── 📁 [20+ carpetas más]/    # Por colección/serie
│   │
│   ├── 📁 videos/                     # Assets de video
│   ├── bag.svg                        # SVG bolsa
│   ├── favicon.svg
│   ├── placeholder.svg
│   └── robots.txt                     # SEO
│
├── 📁 dist/                           # Build output
├── vercel.json                        # Config Vercel
├── vite.config.ts                     # Config Vite
├── tailwind.config.ts                 # Config Tailwind
├── postcss.config.js                  # Config PostCSS
├── tsconfig.json                      # Config TypeScript
├── eslint.config.js                   # Config ESLint
├── components.json                    # Config shadcn/ui
├── package.json                       # Dependencias
├── index.html                         # HTML principal
│
├── README.md                          # Este archivo
├── OPTIMIZACION_FASE1.md              # Optimizaciones implementadas
├── CURRENCY_SETUP.md                  # Guía de monedas
└── 22-12.md                          # Notas de cambios
```

---

## 🚀 CONFIGURACIÓN INICIAL

### Requisitos
- **Node.js** 18+ (recomendado usar nvm)
- **npm** o **bun**
- Git

### Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/DropeG/bruto-atelier-showcase.git

# 2. Entrar al directorio
cd bruto-atelier-showcase

# 3. Instalar dependencias
npm install

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Abrir en navegador
# http://localhost:8080
```

### Variables de Entorno (si aplican)

Actualmente no hay `.env` requerido. Pero si añades backend:

```bash
# Crear archivo .env.local
VITE_API_URL=http://localhost:3000
VITE_WA_NUMBER=56949569887
```

---

## 📜 SCRIPTS DISPONIBLES

```bash
# Iniciar servidor de desarrollo (hot reload)
npm run dev

# Build para producción
npm run build

# Build en modo desarrollo
npm run build:dev

# Lint de código
npm run lint

# Preview del build
npm run preview
```

### Configuración de Desarrollo

- **Puerto**: 8080
- **Host**: `[::]` (IPv6 compatible)
- **Mode**: development con hot reload

---

## ✨ FUNCIONALIDADES PRINCIPALES

### 1. **Galería de Proyectos**
- Home page con 10 imágenes en scroll snap
- Carrusel automático en Piezas (5s por item)
- Hover effects con blur background
- Lazy loading nativo

### 2. **Catálogo Multi-nivel**
```
Colecciones → Series → Piezas → Detalles
```

Ejemplo de ruta:
```
/categoria/morar/bespoke/1
        ↑     ↑      ↑   ↑
       cat   col    item id
```

### 3. **Sistema Multimoneda**
**12 países soportados:**
- Chile (CLP), Argentina (ARS), Colombia (COP), México (MXN)
- Perú (PEN), Costa Rica (CRC), Ecuador (USD), Uruguay (UYU)
- Bolivia (BOB), Paraguay (PYG), USA (USD), España (EUR)

Basado en tasas de conversión desde USD.

**Archivos:**
- `/src/contexts/CurrencyContext.tsx`
- `/CURRENCY_SETUP.md` (guía completa)

### 4. **Autenticación**
- Login/Signup modal
- Contexto global AuthContext
- Persistencia de usuario (session)

**Archivo:**
- `/src/contexts/AuthContext.tsx`

### 5. **Newsletter Modal**
- Modal flotante con opción de suscripción
- Se muestra al scroll inicial

### 6. **Contacto WhatsApp**
- Botón flotante que abre WhatsApp
- Número: +56 9 4956 9887

**Archivos:**
- `/src/components/WhatsAppButton.tsx`
- `/src/components/DiscountButton.tsx`

### 7. **Animaciones Modernas**
- Framer Motion en Navigation, HeroSection, Auth
- Transiciones CSS en componentes
- Scroll-driven animations

### 8. **Performance Optimizado**
- Lazy loading nativo (`loading="lazy"`)
- Blur backgrounds con CSS filter
- fetchPriority dinámico
- Image preloading estratégico
- Decoding async

**Ver:** `/OPTIMIZACION_FASE1.md`

---

## 🌐 CONTEXTOS GLOBALES

### AuthContext

```typescript
// Ubicación: src/contexts/AuthContext.tsx
{
  user: User | null,
  isAuthModalOpen: boolean,
  login: (email: string, password: string) => void,
  logout: () => void,
  signup: (email: string, password: string) => void,
  openAuthModal: () => void,
  closeAuthModal: () => void
}
```

**Uso:**
```tsx
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, login, logout } = useAuth()
}
```

### CurrencyContext

```typescript
// Ubicación: src/contexts/CurrencyContext.tsx
{
  selectedCountry: string,
  rate: number,
  convertPrice: (usdPrice: number) => number,
  formatPrice: (price: number) => string,
  setCountry: (country: string) => void
}
```

**Países disponibles:**
```typescript
const COUNTRIES = {
  'CL': { name: 'Chile', currency: 'CLP', rate: 970 },
  'AR': { name: 'Argentina', currency: 'ARS', rate: 950 },
  // ... 10 más
}
```

### ScrollContext

```typescript
// Ubicación: src/contexts/ScrollContext.tsx
{
  saveSectionId: (id: string) => void,
  getSectionId: () => string | null,
  scrollToSection: (id: string, container: HTMLElement) => void
}
```

**Uso:**
```tsx
const { saveSectionId, getSectionId, scrollToSection } = useScroll()

// Guardar sección al hacer click
saveSectionId('section-row-1')

// Restaurar scroll al volver
const sectionId = getSectionId()
if (sectionId) scrollToSection(sectionId, container)
```

---

## 🛣 RUTAS DE LA APLICACIÓN

```
/                                    → Home (Index.tsx)
/arquitectura                        → Proyectos arquitectura
/interiorismo                        → Proyectos interiorismo
/coleccion                           → Catálogo de colecciones
/serie                               → Series de productos
/piezas                              → Piezas individuales
/categoria/:category/:collection/:id → Página dinámica (Category.tsx)
/auth                                → Login/Signup (Auth.tsx)
/*                                   → 404 (NotFound.tsx)
```

### Ejemplo de Navegación Dinámica

```tsx
// URL: /categoria/morar/bespoke/1
// Parámetros:
// category = "morar"
// collection = "bespoke"
// id = "1"

// En Category.tsx:
const { category, collection, id } = useParams()
```

---

## 🧩 COMPONENTES PRINCIPALES

### HoverableImage
```tsx
<HoverableImage
  src="/images/home/image1.webp"
  alt="Cocina"
  href="/categoria/morar/bespoke/1"
  ipadPosition="0% center"
  blurDataUrl="data:image/webp;base64,..."
/>
```

**Props:**
- `src: string` - URL imagen
- `alt?: string` - Texto alternativo
- `href?: string` - Link destino
- `ipadPosition?: string` - CSS object-position para iPad
- `blurDataUrl?: string` - Base64 blur placeholder (NUEVO)

**Features:**
- Lazy loading automático
- Blur transition al cargar
- Hover effect con overlay "+"
- Compatible móvil/desktop

### ImageRow
```tsx
<ImageRow
  leftSrc={imageHome1}
  leftAlt="Cocina"
  leftHref="/categoria/morar/bespoke/1"
  rightSrc={imageHome2}
  rightAlt="Mueble"
  rightHref="/categoria/series/bespoke/2"
  leftBlurDataUrl={blurPlaceholders.imageHome1}
  rightBlurDataUrl={blurPlaceholders.imageHome2}
/>
```

**Props:**
- `leftSrc`, `rightSrc` - URLs
- `leftAlt`, `rightAlt` - Textos alt
- `leftHref`, `rightHref` - Links
- `leftBlurDataUrl`, `rightBlurDataUrl` - Blur previews
- `leftIpadPosition`, `rightIpadPosition` - iPad positions

### LazyImage (NUEVO)
```tsx
<LazyImage
  src="/images/home/image1.webp"
  alt="Descripción"
  blurDataUrl="data:image/webp;base64,..."
  className="w-full h-auto"
  onLoad={() => console.log('Loaded!')}
  fetchPriority="high"
/>
```

**Props:**
- `src: string` - URL imagen completa
- `alt?: string`
- `blurDataUrl?: string` - Blur placeholder (Base64)
- `className?: string` - Clases Tailwind
- `onLoad?: () => void` - Callback al cargar
- `fetchPriority?: 'high' | 'low' | 'auto'`

---

## 📊 DATA Y GALERÍA

### Estructura de Datos

**Ubicación:** `/src/data/Gallery.tsx`

```typescript
interface GalleryItem {
  id: number,
  title: string,
  thumbnail: string,      // Imagen pequeña
  detailImage: string     // Imagen grande
}

export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Cocina Bespoke",
    thumbnail: "/images/colecciones/cocina/thumb.webp",
    detailImage: "/images/colecciones/cocina/detail.webp"
  },
  // ... 9 items más
]
```

**Total:** 10 items × 2 imágenes = 20 referencias de imagen

### Agregar Nueva Pieza

```typescript
// En Gallery.tsx
{
  id: 11,
  title: "Nueva Pieza",
  thumbnail: "/images/nuevas/thumb.webp",
  detailImage: "/images/nuevas/detail.webp"
}
```

Luego en Piezas.tsx:
```typescript
const piezasIds = [7, 8, 11] // Agregar el nuevo ID
```

---

## ⚡ OPTIMIZACIONES DE PERFORMANCE

### Implementadas (FASE 1)

✅ **Lazy Loading Nativo**
```tsx
<img loading="lazy" decoding="async" fetchPriority="low" />
```

✅ **Blur Backgrounds**
```tsx
// Estado: loading
<img style={{ filter: 'blur(8px)' }} />

// Estado: loaded
<img style={{ filter: 'blur(0px)' }} />
```

✅ **Image Preloading Estratégico**
```typescript
const img = new Image()
img.src = imagePath
img.onload = () => setIsLoaded(true)
```

✅ **Caché en Vercel**
```json
{
  "headers": [{
    "source": "/images/(.*)",
    "headers": [{
      "key": "Cache-Control",
      "value": "public,max-age=31536000,immutable"
    }]
  }]
}
```

✅ **Formato WebP**
- Todas las imágenes en `.webp` (formato moderno)
- Fallback a `.jpeg` si es necesario

**Ver:** `/OPTIMIZACION_FASE1.md`

### Próximas Optimizaciones (FASE 2)

- [ ] Generar blur placeholders reales con plaiceholder.co
- [ ] Optimizar Framer Motion con hardware acceleration
- [ ] Throttle scroll listeners
- [ ] Servir WebP/AVIF con fallback
- [ ] Code splitting por ruta
- [ ] Service Worker + precaching

---

## 👨‍💻 GUÍA DE DESARROLLO

### Agregar Nueva Página

1. **Crear archivo en `/src/pages/NuevaPage.tsx`:**
```tsx
import React from 'react'

const NuevaPage = () => {
  return (
    <div>
      <h1>Nueva Página</h1>
    </div>
  )
}

export default NuevaPage
```

2. **Agregar ruta en `/src/App.tsx`:**
```tsx
import NuevaPage from '@/pages/NuevaPage'

// En Router:
<Route path="/nueva" element={<NuevaPage />} />
```

### Agregar Nuevo Componente

1. **Crear en `/src/components/MiComponente.tsx`:**
```tsx
interface Props {
  title: string
  onClick?: () => void
}

const MiComponente: React.FC<Props> = ({ title, onClick }) => {
  return <button onClick={onClick}>{title}</button>
}

export default MiComponente
```

2. **Exportar en `/src/components/index.ts`:**
```tsx
export { default as MiComponente } from './MiComponente'
```

3. **Usar en otro componente:**
```tsx
import { MiComponente } from '@/components'

<MiComponente title="Hola" onClick={() => {}} />
```

### Usar Context Global

```tsx
import { useAuth } from '@/contexts/AuthContext'

function LoginButton() {
  const { user, login, logout } = useAuth()
  
  return user ? (
    <button onClick={logout}>Logout</button>
  ) : (
    <button onClick={() => login('email', 'pass')}>Login</button>
  )
}
```

### Agregar Estilos

**Opción 1: Tailwind (recomendado)**
```tsx
<div className="flex items-center justify-center bg-white p-4 rounded-lg">
  Contenido
</div>
```

**Opción 2: CSS inline**
```tsx
<div style={{ display: 'flex', justifyContent: 'center' }}>
  Contenido
</div>
```

**Opción 3: CSS module (evitar si es posible)**
```tsx
import styles from './MiComponente.module.css'

<div className={styles.container}>
```

### Animaciones con Framer Motion

```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Contenido animado
</motion.div>
```

---

## 🐛 PROBLEMAS COMUNES

### Problema: Las imágenes cargan muy lento
**Solución:**
1. Verificar que estén en formato `.webp`
2. Verificar que el blur placeholder esté bien (ver `blur-placeholders.ts`)
3. Ejecutar `npm run build` para ver size gzip
4. Usar Chrome DevTools > Network para verificar tiempos

### Problema: Error "Module not found"
**Solución:**
```tsx
// Verificar que el alias @ esté bien en vite.config.ts:
// Debe tener: "@": path.resolve(__dirname, "./src")

// Verificar que tsconfig.json tenga:
// "paths": { "@/*": ["./src/*"] }
```

### Problema: Contexto no se actualiza
**Solución:**
1. Verificar que el componente está dentro del `Provider`
2. Verificar que se llama a la función de actualización
3. Abrir React DevTools y ver el contexto

### Problema: ESLint errors
```bash
# Ejecutar linter para ver errores
npm run lint

# Muchos errores se pueden auto-fix:
npx eslint . --fix
```

### Problema: Build falla
```bash
# Limpiar node_modules
rm -rf node_modules package-lock.json
npm install

# Limpiar cache de Vite
rm -rf dist .vite

# Intentar build de nuevo
npm run build
```

### Problema: Vercel deployment falla
1. Verificar `vercel.json` está bien formado
2. Verificar que no hay errores de tipo (`npm run build` localmente)
3. Ver logs en Vercel dashboard
4. Ejecutar `npm run build` localmente antes de pushear

---

## 📚 ARCHIVOS IMPORTANTES DE REFERENCIA

- **OPTIMIZACION_FASE1.md** - Optimizaciones implementadas
- **CURRENCY_SETUP.md** - Guía completa de monedas
- **vercel.json** - Configuración de Vercel
- **vite.config.ts** - Configuración de Vite
- **tailwind.config.ts** - Configuración de Tailwind
- **src/contexts/** - Lógica global
- **src/data/Gallery.tsx** - Datos principales

---

## 🔗 LINKS ÚTILES

- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repo**: https://github.com/DropeG/bruto-atelier-showcase
- **Tailwind Docs**: https://tailwindcss.com
- **React Router Docs**: https://reactrouter.com
- **Framer Motion**: https://www.framer.com/motion
- **shadcn/ui**: https://ui.shadcn.com
- **Vite**: https://vitejs.dev

---

## 👥 CONTRIBUIDORES

- **Designer/Developer**: Pedro Pegas

---

## 📝 LICENCIA

Todos los derechos reservados - BRUTO ATELIER 2024-2025

---

## 📞 SOPORTE

Para preguntas o issues:
1. Revisar este README
2. Revisar OPTIMIZACION_FASE1.md y CURRENCY_SETUP.md
3. Revisar logs en Vercel
4. Abrir issue en GitHub

---

**Última actualización**: Marzo 2026
**Versión**: 1.1.0 (Con optimizaciones FASE 1)
