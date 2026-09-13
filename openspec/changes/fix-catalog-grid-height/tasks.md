## 1. Ajustes Estructurales

- [x] 1.1 Remover las clases `min-h-screen`, `min-h-[500px]` y `min-h-[350px]` del componente `DesktopCatalogGrid`.
- [x] 1.2 Asegurar que el contenedor principal del componente tenga `h-full` para absorber los 100vh heredados de su contenedor (el elemento con `lg:snap-start` en `Index.tsx` u originado internamente).
- [x] 1.3 Cambiar `h-[60vh]` por `h-[60%]` en la primera fila.
- [x] 1.4 Cambiar `h-[40vh]` por `h-[40%]` en la segunda fila.

## 2. Ajustes en Index.tsx

- [x] 2.1 Verificar que el contenedor envoltorio (`<div id="section-desktop-catalog-grid" ...>`) en `Index.tsx` posea `h-[100svh]` o `h-screen` explícitamente para que actúe como una "página" del carrusel, permitiendo al componente hijo usar `h-full`.
