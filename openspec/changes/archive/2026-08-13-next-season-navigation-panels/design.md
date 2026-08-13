## Context

El cliente (Mladen) especificó que la navegación para las categorías en desarrollo no debe ser estática ni decir "Coming Soon", sino que debe llamarse **Next Season**, ser clickeable y desplegar una pestaña lateral con la misma elegancia y contenedor que el panel "Nosotros" (`bg-[#9C7B66] text-white p-6 font-serif`), mostrando 1 única imagen de preview limpia por categoría.

## Goals / Non-Goals

**Goals:**
- Actualizar la insignia del menú a `Next Season`.
- Habilitar el handler `onClick` para que al seleccionar una categoría inactiva se active su clave en `activePanel`.
- Implementar el renderizado dinámico del panel "Next Season" en `Navigation.tsx` con el mismo estilo del panel de "Nosotros".

**Non-Goals:**
- No alterar las categorías activas con catálogo real (Arquitectura, Interiorismo, Mobiliario).

## Decisions

### 1. Renderizado Dinámico de Pestaña Desplegable "Next Season"
- Detectar dinámicamente si `activePanel` coincide con una clave en `comingSoonCategories`.
- Renderizar la pestaña in-situ con encabezado `NEXT SEASON • BRUTO ATELIER` en desktop y kicker `BRUTO ATELIER` en móvil (evitando duplicar `NEXT SEASON` en la barra superior móvil).
- Alinear a la izquierda (borde limpio flush-left) la imagen de preview y el texto de estado en la vista móvil de `Navigation.tsx`.
- Escalar la jerarquía tipográfica móvil: kicker `text-[11px] tracking-[0.25em]`, título `text-2xl font-serif`, foto `w-[210px]` y pie `text-[11px]`.
- Aumentar el tamaño del icono de volver en la cabecera móvil a 20px (`w-5 h-5`) con padding `p-1.5 -ml-1.5` para garantizar una zona táctil cómoda (44px) y escalar el texto superior a `text-sm font-medium tracking-[0.15em]`.
