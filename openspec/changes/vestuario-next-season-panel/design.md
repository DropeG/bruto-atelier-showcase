## Context

El componente de navegación `Navigation.tsx` actualmente maneja estados de paneles activos para `"mobiliario"`, `"nosotros"` y `"contacto"` a través del estado `activePanel`.
Por su parte, la categoría "Vestuario" en `navLinks` redirigía a `/showcase/vestuario`, abriendo `ComingSoonView.tsx` que ejecutaba una precarga en bucle JS de 4 imágenes pesadas y presentaba un layout colapsado en dispositivos móviles.

## Goals / Non-Goals

**Goals:**
- Integrar `"vestuario"` como una opción de `activePanel` en `Navigation.tsx` tanto para Desktop como para Mobile.
- Mostrar una pestaña o panel "Next Season" con estética ultra-premium en tono café/tierra `#9C7B66` y tipografía minimalista de Bruto Atelier.
- Optimizar `ComingSoonView.tsx` reduciendo sus datos a una sola imagen estática ligera, sin bucles de precarga ni carrusel de miniaturas en el pie de página.

**Non-Goals:**
- No implementar el e-commerce de vestuario en esta fase (permanece en estado "Próximamente / Next Season").
- No modificar el comportamiento de navegación de "Mobiliario", "Arquitectura" o "Interiorismo".

## Decisions

### 1. Extensión del estado `activePanel` en `Navigation.tsx`
- **Decisión**: Expandir el tipo `activePanel` a `"mobiliario" | "nosotros" | "contacto" | "vestuario" | null`.
- **Alternativas consideradas**:
  - *Crear un modal independiente*: Rechazado por agregar complejidad innecesaria a la interfaz cuando la estructura de subpaneles de la barra de navegación ya existe y es sumamente limpia.

### 2. Diseño del Panel Desktop y Móvil "Next Season"
- **Desktop**: Renders de `activePanel === "vestuario"` como un contenedor sutil `w-[320px] bg-[#9C7B66] text-white p-6 font-serif` con tag uppercase `NEXT SEASON • BRUTO ATELIER`, título `VESTUARIO`, y bajada *"Textiles atemporales & arquitectura corporal en lino y fibras naturales. Disponible Próximamente."*
- **Móvil**: Render como acordeón desplegable directo debajo del ítem "Vestuario" en el menú responsive, sin redirecciones de pantalla completa.

### 3. Refactor de `ComingSoonView.tsx`
- **Decisión**: Eliminar el bucle `new Image().src` del `useEffect` de `ComingSoonView.tsx` y dejar únicamente una sola imagen de fondo optimizada en `ComingSoon.ts`.
- **Razón**: Mejora inmediata en métricas de rendimiento (LCP / FCP) y elimina lag en conexiones móviles o procesadores modestos.

## Risks / Trade-offs

- [Acceso por URL directa] → Si un usuario ingresa directamente a `/showcase/vestuario`, se desplegará la versión simplificada y ligera de `ComingSoonView.tsx` en lugar de romper el layout.
