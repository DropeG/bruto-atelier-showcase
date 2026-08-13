## 1. Actualización de Etiqueta e Interactividad en Menú

- [x] 1.1 Cambiar insignias en la lista de menú en desktop y móvil a `Next Season`.
- [x] 1.2 Habilitar evento `onClick` en ítems `comingSoonCategories` para activar su clave en `activePanel`.

## 2. Implementación de Pestaña Desplegable "Next Season" (Estilo Nosotros)

- [x] 2.1 Configurar el contenedor in-situ en `Navigation.tsx` con dimensiones y estilos idénticos al panel de "Nosotros" (`bg-[#9C7B66] text-white p-6 font-serif`).
- [x] 2.2 Renderizar la tarjeta minimalista con `NEXT SEASON • BRUTO ATELIER`, título (sin subtítulo), 1 imagen de preview limpia (aspect 4:5) y estado `Disponible Próximamente · 2026`.
- [x] 2.3 Corregir la alineación de la imagen (removiendo `mx-auto`) y el pie de estado (`text-left`) en el panel móvil de `Navigation.tsx` para asegurar un eje izquierdo unificado.
- [x] 2.4 Eliminar la redundancia del kicker en el panel móvil (cambiando a `BRUTO ATELIER`) y escalar las fuentes del título (`text-2xl`), kicker (`11px`), pie (`11px`) y ancho de la foto (`w-[210px]`).
- [x] 2.5 Aumentar el tamaño del icono de volver (`w-5 h-5`) con touch target cómodo de 44px y escalar el texto del encabezado superior a `text-sm font-medium tracking-[0.15em]`.
