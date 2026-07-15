# 🏛️ Memoria de Proyecto: Bruto Atelier Showcase

Este archivo contiene la memoria constante y las directrices de diseño del proyecto **Bruto Atelier Showcase** para el agente Antigravity. Debe ser consultado antes de realizar cualquier cambio estético, estructural o funcional.

---

## 🎨 Esencia del Proyecto y Marca
*   **Nombre:** Bruto Atelier
*   **Sitio Web Oficial:** [bruto-atelier.com](https://bruto-atelier.com)
*   **Propósito:** Showcase premium y catálogo interactivo de diseño de muebles a medida (bespoke), arquitectura e interiorismo.
*   **Enfoque de Diseño:** Ultra-premium, minimalista, limpio, con gran énfasis en fotografía de alta calidad, transiciones fluidas y micro-interacciones.

---

## 🧭 Referencias e Inspiración Visual

El diseño y comportamiento visual del proyecto se inspiran en las siguientes plataformas de alta gama:

1.  **Zara Home** ([zarahome.com/cl](https://www.zarahome.com/cl)) - *Tono Preferido*
    *   **Estética:** Tonos neutros, cálidos y orgánicos.
    *   **Diseño:** Retículas (grids) limpias y espaciosas. Enfoque fotográfico ambiental y tipografía sofisticada.
2.  **Audo Copenhagen** ([audocph.com](https://audocph.com/)) - *Tono Preferido*
    *   **Estética:** Minimalismo escandinavo clásico y arquitectura suave.
    *   **Diseño:** Paletas de colores sobrias (beiges, grises cálidos, blanco roto), líneas finas y una sensación táctil y premium en cada interacción.
3.  **Oblist** ([oblist.com](https://oblist.com/))
    *   **Estética:** Diseño editorial curado de lujo (tipo revista de arte).
    *   **Diseño:** Mezcla sofisticada de tipografías y ordenamiento visual asimétrico de productos.
4.  **The Future Perfect** ([thefutureperfect.com](https://www.thefutureperfect.com/))
    *   **Estética:** Galería de diseño contemporáneo y vanguardista.

---

## 📐 Decisiones de Diseño y Arquitectura (Alineación / Grill-me)

1.  **Enfoque Estético:**
    *   Se opta por un **minimalismo cálido y orgánico** como línea conductora (inspirado en la paleta de Zara Home y Audo Copenhagen).
2.  **Tipografías:**
    *   Por definir formalmente. Actualmente se utilizan tipografías dinámicas variadas de transición.
3.  **Comportamiento de Scroll (Home):**
    *   Se mantiene el **Scroll Snapping** (pantalla completa fija) por ahora. Se evaluará migrar a scroll continuo cuando se integre el catálogo de productos real.
4.  **Detalle del Catálogo:**
    *   Sin alta complejidad ni fichas técnicas hiper-detalladas por el momento (desarrollo pausado en esta fase).
5.  **Categorías Inactivas (Menú):**
    *   *Categorías:* Iluminación, Esenciales, Joyería, Vestuario, Accesorios.
    *   *Directriz:* Al no estar activas, deben redirigir o mostrar un estado elegante de **"Coming Soon" (Próximamente)** en lugar de un error 404 clásico o una pantalla de "No encontrado" genérica.

---

## 🛠️ Reglas y Decisiones Técnicas Internas

1.  **El Invariante de Disciplina:** Todo proyecto en la galería debe pertenecer a una disciplina definida (`arquitectura`, `interiorismo`, `mobiliario`, `independent`).
2.  **Localidad del Enrutamiento:** Las rutas semánticas se calculan dinámicamente mediante el servicio (`/showcase/:discipline/:type?/:id`).
3.  **Selector de Visor (Viewer):**
    *   Las subcategorías de `mobiliario` usan una vista de carrusel interactivo (`CarouselView`).
    *   Cualquier otra disciplina utiliza una vista en aislamiento de imagen única (`SingleView`).
4.  **Optimización Estricta:** Todas las imágenes deben implementarse con lazy loading nativo y blur backgrounds usando miniaturas Base64 precargadas en `blur-placeholders.ts`.

---

## 🔧 Control de Versiones (Jujutsu - `jj`)
*   **Herramienta:** El usuario prefiere usar **Jujutsu (`jj`)** para el control de versiones local (compatible con Git).
*   **Enfoque de Aprendizaje:** El agente debe asistir al usuario guiándolo en el uso de `jj`. En lugar de asumir o proponer comandos Git clásicos, el agente explicará las equivalencias en `jj` (ej. `jj status`, `jj log`, `jj diff`, `jj new`) y reforzará conceptos clave de Jujutsu (como el commit de trabajo implícito y el historial libre de conflictos antes de sincronizar).
*   **Restricción de automatización:** Ningún comando de control de versiones (`git` o `jj`) se ejecutará o sugerirá en un flujo automático sin aprobación explícita y directa, respetando la regla global del usuario.

