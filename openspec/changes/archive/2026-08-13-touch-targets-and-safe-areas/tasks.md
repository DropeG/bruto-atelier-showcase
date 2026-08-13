## 1. Menú Lateral Táctil (Navigation.tsx)

- [x] 1.1 Incrementar el padding vertical y área táctil de los enlaces principales del menú lateral a `py-3 px-4` (altura mínima 44px) y reducir la brecha entre ítems (`gap-1`).
- [x] 1.2 Actualizar los botones de subcategorías (Mobiliario: Colección, Serie, Piezas) con padding vertical `py-2.5 px-3` para garantizar áreas táctiles cómodas de 44px.
- [x] 1.3 Verificar la navegabilidad en dispositivos móviles y asegurar que el panel contenedor no desborde verticalmente la pantalla.

## 2. Safe Areas y Hit Targets en Visor (ShowcaseViewer.tsx)

- [x] 2.1 Aplicar cálculo dinámico con Safe Area Top (`top: max(2rem, calc(1rem + env(safe-area-inset-top)))`) al botón de volver y al contenedor de indicadores del carrusel.
- [x] 2.2 Ampliar el hit area invisible de los dots del carrusel envolviéndolos en un botón contenedor de `min-w-[32px] min-h-[44px]`.
- [x] 2.3 Verificar la alineación visual y táctil en pantallas simuladas de iPadOS / notch de iOS.
