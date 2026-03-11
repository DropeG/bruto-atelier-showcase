# 🤖 CONTEXTO TÉCNICO PARA IA

Este documento proporciona contexto para que cualquier IA (Claude, ChatGPT, Copilot, etc.) entienda completamente la arquitectura y structure de la aplicación.

## 📌 INFORMACIÓN CRÍTICA

### Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui + Radix UI
- **Animaciones**: Framer Motion
- **Deploy**: Vercel (SPA estática)
- **Base de datos**: Ninguna (datos estáticos en /src/data)

### Propósito
Showcase web de catálogo/portafolio para estudio de diseño de muebles y proyectos de arquitectura/interiorismo.

### URL en Vivo
https://bruto-atelier-showcase.vercel.app

---

## 🎯 PUNTOS CLAVE PARA IA

### 1. NO es un Backend completo
- No hay base de datos
- No hay API endpoints (excepto si se agrega)
- Todo es contenido estático renderizado
- Autenticación es fake (context + localStorage simulado)
- Monedas son conversiones estáticas (no rates reales en tiempo real)

### 2. Enrutamiento SPA
```
React Router v6 (NOT Next.js)
- Single Page Application
- Client-side routing
- No hay SSR/SSG
```

### 3. Data Flow
```
User Input → Components → Context/State → Re-render
```

No hay fetch a API. Los datos vienen de:
- `/src/data/Gallery.tsx` (galería principal)
- Props pasadas entre componentes
- Context global (Auth, Currency, Scroll)

### 4. Imágenes
- **Ubicación**: `/public/images/` (20+ carpetas)
- **Formato**: `.webp` (con fallback `.jpeg`)
- **Estrategia**: Lazy loading nativo + blur backgrounds
- **Optimización**: fetchPriority dinámico, decoding async

### 5. Estilos
```
Tailwind CSS (utility-first)
- NO hay CSS modules
- NO hay styled-components
- TODO es clases Tailwind + inline styles si es necesario
```

### 6. Componentes UI
```
shadcn/ui + Radix UI
- 30+ componentes Radix listos para usar
- Todos están en /src/components/ui/
- Importar según necesidad (tree-shake automático)
```

---

## 🔍 ESTRUCTURA MENTAL

### Flujo de una página típica

```
App.tsx (rutas)
  ↓
Page (ej: Index.tsx)
  ├─ Layout wrapper
  ├─ Navigation (header)
  ├─ Main content
  │   ├─ HeroSection
  │   ├─ ImageRow (×5)
  │   ├─ VideoSection
  │   ├─ ContactSection
  │   └─ Footer
  └─ WhatsAppButton (overlay)

Contextos globales disponibles:
- AuthContext (user, login, logout)
- CurrencyContext (monedas, conversión)
- ScrollContext (guardar posición al navegar)
```

### Página dinámica `/categoria/:cat/:col/:id`

```
Category.tsx recibe params:
- category: string (ej: "morar")
- collection: string (ej: "bespoke")
- id: string (ej: "1")

Luego busca el item en Gallery.tsx y renderiza
```

### Componentes que cargan imágenes

```
ImageRow
  ├─ HoverableImage (izq)
  └─ HoverableImage (der)

HoverableImage
  ├─ Lazy loading nativo
  ├─ Blur placeholder (si existe blurDataUrl)
  └─ Transición suave blur → nítida

Piezas.tsx
  ├─ Carrusel automático (5s)
  ├─ Background blur dinámico
  └─ Detail image en centro
```

---

## ⚙️ CONFIGURACIÓN IMPORTANTE

### Vite
```typescript
// vite.config.ts
{
  server: { host: "::", port: 8080 },
  plugins: [react()],
  resolve: { 
    alias: { "@": "./src" } 
  }
}
```

### TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### Tailwind
```typescript
// tailwind.config.ts
{
  theme: {
    fontFamily: {
      serif: ["Playfair Display"],
      sans: ["Inter"]
    }
  }
}
```

### Vercel
```json
// vercel.json
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

---

## 🎨 PATRONES DE CÓDIGO

### Contexto
```typescript
// Crear contexto
const MyContext = createContext<MyContextType | undefined>(undefined)

export function MyProvider({ children }) {
  const [state, setState] = useState()
  return <MyContext.Provider value={{ state, setState }}>...</MyContext.Provider>
}

// Usar hook
export function useMyContext() {
  const context = useContext(MyContext)
  if (!context) throw new Error("debe estar dentro del provider")
  return context
}

// Uso
function MyComponent() {
  const { state, setState } = useMyContext()
}
```

### Componente con Tailwind
```typescript
interface Props {
  title: string
  onClick?: () => void
}

const MyButton: React.FC<Props> = ({ title, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
    >
      {title}
    </button>
  )
}
```

### Lazy Loading Imagen
```typescript
const [imageSrc, setImageSrc] = useState(blurDataUrl || "")
const [isLoaded, setIsLoaded] = useState(false)

useEffect(() => {
  if (!blurDataUrl) {
    setImageSrc(src)
    setIsLoaded(true)
    return
  }

  const img = new Image()
  img.onload = () => {
    setImageSrc(src)
    setIsLoaded(true)
  }
  img.src = src
}, [src, blurDataUrl])

return (
  <img
    src={imageSrc}
    style={{ filter: isLoaded ? "blur(0px)" : "blur(8px)" }}
    loading="lazy"
    decoding="async"
  />
)
```

### Animación Framer Motion
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.1 }}
>
  Contenido
</motion.div>
```

---

## 🚨 REGLAS DE DESARROLLO

### ✅ HACER

1. **Usar Tailwind** para estilos
2. **Usar Context API** para estado global
3. **Usar React Router** para navegación
4. **Usar `<img>` nativo** con lazy loading
5. **Usar TypeScript** tipado fuerte
6. **Usar componentes shadcn/ui** existentes

### ❌ NO HACER

1. ❌ No agregar nuevo CSS externo (evitar .css files)
2. ❌ No usar styled-components o emotion
3. ❌ No usar Redux (Context API suficiente)
4. ❌ No agregar Next.js (es Vite + React Router)
5. ❌ No usar `<img src={require()}>` (imports directos)
6. ❌ No agregar base de datos local (JSON files ok, DB no)
7. ❌ No hacer requests a API sin contexto

---

## 📊 MEDIDAS DE PERFORMANCE ACTUAL

### Build Output
```
dist/index.html                   1.53 kB │ gzip:  0.64 kB
dist/assets/index-CvgYvf6T.css   68.94 kB │ gzip: 12.33 kB
dist/assets/index-WGD9EYZp.js   481.07 kB │ gzip: 147.52 kB
```

### Optimizaciones Actuales
- ✅ Lazy loading nativo
- ✅ Blur backgrounds
- ✅ Async decoding
- ✅ Vercel cache headers
- ✅ WebP format

### Próximas Optimizaciones
- [ ] Blur placeholders reales (plaiceholder)
- [ ] Hardware acceleration (Framer Motion)
- [ ] Scroll throttle
- [ ] Code splitting por ruta
- [ ] Service Worker

---

## 🔗 BÚSQUEDA RÁPIDA

### "¿Dónde está...?"

| Pregunta | Respuesta |
|----------|-----------|
| ¿Datos de galería? | `/src/data/Gallery.tsx` |
| ¿Autenticación? | `/src/contexts/AuthContext.tsx` |
| ¿Monedas? | `/src/contexts/CurrencyContext.tsx` |
| ¿Scroll? | `/src/contexts/ScrollContext.tsx` |
| ¿Componentes UI? | `/src/components/ui/` |
| ¿Imágenes? | `/public/images/` |
| ¿Rutas? | `/src/App.tsx` |
| ¿Tailwind config? | `/tailwind.config.ts` |
| ¿Blur placeholders? | `/src/lib/blur-placeholders.ts` |
| ¿Home page? | `/src/pages/Index.tsx` |
| ¿Página dinámica? | `/src/pages/Category.tsx` |
| ¿Newsletter? | `/src/components/NewsletterModal.tsx` |
| ¿WhatsApp? | `/src/components/WhatsAppButton.tsx` |

---

## 🧪 TESTING CHECKLIST

Cuando IA haga cambios, verificar:

```
[ ] npm run build - Sin errores
[ ] npm run lint - Sin errores de ESLint
[ ] npm run dev - Inicia sin errores
[ ] http://localhost:8080 - Carga sin errores
[ ] Imágenes cargan correctamente
[ ] Animaciones son fluidas
[ ] Responsive en móvil/tablet/desktop
[ ] Links funcionan
[ ] Contextos actualizan bien
[ ] No hay console.errors
```

---

## 🤔 CUÁNDO ESCALAR

### Agregar Backend
Si necesitas:
- Base de datos de productos real
- Autenticación real (no fake)
- Administración de contenido
- Rates de moneda en tiempo real

Considerar:
- Agregar API (Node.js + Express, Python + FastAPI, etc.)
- Usar TanStack React Query ya incluido
- Variables de env (.env.local)

### Agregar CMS
Si necesitas:
- Editar productos sin re-deployar
- Cargar imágenes dinámicamente
- Administrador visual

Considerar:
- Sanity.io, Strapi, Contentful
- Headless CMS

### Agregar SSR
Si necesitas:
- SEO perfecto (actualmente no está optimizado)
- Contenido dinámico sin JavaScript

Considerar:
- Migrar a Next.js (complicado)
- O agregar pre-rendering estático

---

## 📝 NOTAS FINALES PARA IA

1. **Lee primero el README.md** - Tiene la estructura general
2. **Lee el OPTIMIZACION_FASE1.md** - Entiende qué se optimizó
3. **Verifica src/App.tsx** - Entender todas las rutas
4. **Busca Gallery.tsx** - Principal source de data
5. **No hagas cambios sin verificar** - npm run build && npm run dev
6. **Git workflow**: branch → changes → commit → push
7. **Los tests no existen** - Testing manual en localhost/Vercel

---

## 🎓 COMANDOS BÁSICOS PARA IA

```bash
# Instalar
npm install

# Desarrollo
npm run dev                 # http://localhost:8080

# Producción
npm run build              # Crear dist/
npm run preview            # Preview del build

# Calidad código
npm run lint               # ESLint check
npm run lint -- --fix      # Auto-fix ESLint

# Verificar todo está bien antes de pushear
npm run build && npm run lint

# Git
git add .
git commit -m "descripción clara del cambio"
git push origin main
```

---

## 🏗️ ARQUITECTURA RESUMIDA

```
┌─────────────────────────────────────┐
│         App.tsx (Router)            │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┬──────────┬───────────┐
        │             │          │           │
    Pages         Contexts    Components   Data
    ├─Index        ├─Auth       ├─UI       └─Gallery
    ├─Arquitectura ├─Currency   ├─Navigation
    ├─Piezas       └─Scroll     ├─HeroSection
    ├─Category               ├─HoverableImage
    └─Auth                   ├─LazyImage
                             └─...

Styles: Tailwind CSS (no CSS files)
Build: Vite
Deploy: Vercel
```

---

## 📚 REFERENCIA RÁPIDA

**Importar componente de galería**
```typescript
import { galleryItems } from '@/data/Gallery'
```

**Importar contexto**
```typescript
import { useAuth } from '@/contexts/AuthContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import { useScroll } from '@/contexts/ScrollContext'
```

**Usar componente UI shadcn**
```typescript
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
```

**Tipado de componentes**
```typescript
interface MyProps {
  title: string
  onClick?: () => void
  children?: React.ReactNode
}

const MyComponent: React.FC<MyProps> = ({ title, onClick, children }) => {
  return <div>...</div>
}
```

**Rutas dinámicas**
```typescript
const { category, collection, id } = useParams<{ 
  category: string
  collection: string
  id: string 
}>()
```

---

**Documento actualizado**: Marzo 2026
**Versión aplicación**: 1.1.0
