## Context

Actualmente `Navigation.tsx` maneja el estado `activePanel` para `"mobiliario" | "nosotros" | "contacto" | "vestuario"`.
Extendiendo esta lógica a todas las claves de `comingSoonCategories` (`iluminacion`, `esenciales`, `joyeria`, `vestuario`, `accesorios`), permitiremos que cualquier categoría inactiva comparta la misma estructura de panel lateral y móvil.

## Goals / Non-Goals

**Goals:**
- Extender el tipo de `activePanel` para incluir todas las categorías inactivas (`"iluminacion" | "esenciales" | "joyeria" | "vestuario" | "accesorios"`).
- Renderizar un componente dinámico de panel Coming Soon en `Navigation.tsx` que lea directamente la categoría correspondiente de `comingSoonCategories[activePanel]`.
- Limpiar datos redundantes de imágenes secundarias en `ComingSoon.ts`.

**Non-Goals:**
- No alterar las categorías activas con catálogo real (Arquitectura, Interiorismo, Mobiliario).

## Decisions

### 1. Detección Dinámica de Categorías Inactivas en Navegación
- En lugar de repetir bloques JSX duplicados para cada categoría inactiva, `Navigation.tsx` detectará si `activePanel` existe en `comingSoonCategories`.
- Si existe, renderizará automáticamente la tarjeta normalizada `COMING SOON • BRUTO ATELIER` con `title`, `bgImage` y `Disponible Próximamente · 2026`.

## Risks / Trade-offs

- [Escalabilidad de Navegación] → Este enfoque genérico permite que si en el futuro se agregan nuevas categorías inactivas a `ComingSoon.ts`, la navegación las admita de forma automática sin duplicar código.
