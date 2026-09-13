## 1. Setup y Componentes Base

- [x] 1.1 Crear el archivo `src/components/DesktopCatalogGrid.tsx`.
- [x] 1.2 Definir la interfaz de datos temporales (mock data) en el componente o usar un archivo existente para poblar la grilla con 3 productos.

## 2. Implementación de Layout (Hero)

- [x] 2.1 Implementar la estructura CSS Grid/Flexbox para la fila superior (60% imagen, 40% bloque de color).
- [x] 2.2 Estilizar el bloque de texto con fondo color cálido, título serif, detalles, precio y enlace.
- [x] 2.3 Asegurar que la imagen principal utilice `object-cover` y alturas proporcionales.

## 3. Implementación de Layout (Fila Inferior)

- [x] 3.1 Implementar la estructura CSS Grid para la fila inferior (dos columnas 50/50).
- [x] 3.2 Estilizar las imágenes full-bleed de la fila inferior usando `object-cover`.
- [x] 3.3 Añadir superposición de texto (título de producto) en la esquina inferior izquierda de cada imagen con tipografía serif.

## 4. Integración y Pruebas

- [x] 4.1 Inyectar temporalmente `<DesktopCatalogGrid />` en la página principal o en la vista de catálogo actual solo para resoluciones Desktop (`hidden lg:block`).
- [x] 4.2 Probar la responsividad y ajustar las variables de altura/ancho de las imágenes para que se vea como la maqueta.
