# 🚀 Propuestas de Mejora: Bruto Atelier Showcase

Este documento detalla una serie de mejoras recomendadas para la aplicación web de **Bruto Atelier Showcase** para optimizar el rendimiento, perfeccionar la experiencia de usuario (UX/UI) y preparar la plataforma para futuras integraciones.

---

## ⚡ 1. Rendimiento y Carga (Core Web Vitals - Performance)

### 🖼️ Imágenes Responsivas con `srcset` y `<picture>`
*   **Problema:** Se cargan las mismas imágenes de alta resolución en pantallas Retina y en teléfonos móviles con conexiones lentas.
*   **Mejora:** Generar versiones optimizadas (ej. resoluciones de 640px, 1024px, 1920px) e implementarlas usando `srcset` o elementos `<picture>`.
*   **Impacto esperado:** Reducción de un **50% a 70%** en el peso de transferencia de datos en dispositivos móviles y una mejora drástica en el **LCP (Largest Contentful Paint)**.

### 📦 Code Splitting (División de Código)
*   **Problema:** Todas las páginas se importan de manera estática al cargar la aplicación, lo que incrementa el peso del JS inicial.
*   **Mejora:** Implementar `React.lazy()` y `Suspense` en [App.tsx](file:///Users/pedro/Documents/Pegas/bruto-atelier-showcase/src/App.tsx) para cargar los componentes de las páginas bajo demanda.
*   **Impacto esperado:** Mayor velocidad en la primera interacción interactiva (TBT / FID).

### 🎬 Optimización de Framer Motion
*   **Problema:** Las animaciones complejas pueden causar tirones o *jank* en dispositivos móviles de gama media/baja.
*   **Mejora:** Utilizar propiedades CSS que gatillen la aceleración por hardware (como `will-change: transform` o la propiedad `translate3d`).

---

## 🎨 2. Experiencia de Usuario y Diseño Premium (UX/UI)

### 📍 Indicador Visual de Secciones (Scroll Dots)
*   **Problema:** Al usar *Scroll Snapping* en la página de inicio, el usuario puede desorientarse sobre cuántas secciones quedan por ver.
*   **Mejora:** Diseñar una barra lateral flotante con puntos interactivos discretos. Estos puntos cambiarán de estado según la sección activa y permitirán hacer clic para navegar suavemente entre ellas.

### 🛒 Simulación Interactiva de E-commerce (Cart Drawer)
*   **Problema:** El icono de la bolsa de compra (`bag.svg`) en la barra de navegación no tiene comportamiento.
*   **Mejora:** Desarrollar un panel lateral deslizable (Cart Drawer) interactivo con estado mock. Los usuarios podrán simular añadir mobiliario al carrito de compra, lo que elevará la experiencia premium de la demo y pavimentará el camino a la integración con Shopify (Volumen 2).

### 💱 Conversión de Moneda en Tiempo Real
*   **Problema:** Las tasas de conversión en `CurrencyContext` son estáticas.
*   **Mejora:** Consumir una API de tipo de cambio gratuita con una estrategia de caché (ej. persistencia por 24 horas en `localStorage`) para mantener los valores actualizados.

---

## 🔍 3. SEO y Metadatos Dinámicos

### 🏷️ SEO Dinámico por Ruta
*   **Problema:** Por ser una SPA (Single Page Application), el título de la pestaña y los metadatos de red social se mantienen estáticos.
*   **Mejora:** Integrar un gestor de metadatos dinámico (como un hook customizado `useSEO` o `react-helmet-async`) para que el título de la página cambie a `"Nombre del Proyecto | Disciplina | Bruto Atelier"` al entrar al detalle de un ítem.

---

## 🛠️ 4. Calidad de Código y Robustez

### 🚫 Pantallas de Categoría Vacías Premium
*   **Problema:** Enlaces como *"Iluminación"*, *"Esenciales"* o *"Accesorios"* no tienen datos asociados y muestran un mensaje rudimentario de "No encontrado".
*   **Mejora:** Diseñar una vista minimalista que informe que la colección está "Próximamente" o "En desarrollo", con un botón de retorno elegante o caja de registro para el newsletter.

### ⏱️ Throttle/IntersectionObserver en Listeners
*   **Problema:** El listener de scroll en [Index.tsx](file:///Users/pedro/Documents/Pegas/bruto-atelier-showcase/src/pages/Index.tsx) se dispara en cada píxel recorrido.
*   **Mejora:** Throttlear el listener de scroll o sustituir la lógica mediante un `IntersectionObserver` para reducir los re-renders innecesarios.
