# Alineación Validada: Simplificación del Formulario de Solicitud WACHI

- **Fecha:** 2026-11-18
- **Estado:** Aprobado por el usuario (Listo para Etapa de Propuesta / Implementación)

## 1. Intención y Objetivo (El Qué y el Porqué)
Simplificar al máximo el formulario preliminar de solicitud de compra WACHI para eliminar fricción innecesaria. Como Bruto Atelier coordina primero los detalles con el comprador y luego envía un link de pago (`invoiceUrl`) de Shopify donde el cliente completa su entrega, no corresponde pedir perfil comercial ni dirección de despacho en esta etapa inicial.

## 2. Contexto del Proyecto
- **Componente principal:** `src/components/WachiRequestDrawer.tsx`
- **Estilos:** `src/styles/wachi-collection.css` (`.wachi-checkout*`)
- **Backend / API:** `api/wachi-draft-order.ts` (mutación `draftOrderCreate` en Shopify Admin API)
- **Tests:** `src/components/WachiRequestDrawer.test.tsx`

## 3. Alcance Validado
### ✅ Entra (Goals / In-Scope)
- Eliminar por completo la sección **PERFIL DEL SOLICITANTE** (`PARTICULAR`, `ARQUITECTO / DISEÑADOR`, `PROYECTO COMERCIAL`).
- Eliminar por completo la sección **DIRECCIÓN DE DESPACHO** (`Dirección`, `Departamento/Casa`, `Ciudad/Comuna`, `País`).
- Dejar **INFORMACIÓN DE CONTACTO** únicamente con **Nombre**, **Apellido**, **Correo electrónico** y **Teléfono**.
- Rediseñar la distribución y uso del espacio para que el formulario simplificado quede equilibrado y se vea bien en **Desktop**, **iPad (tablet)** y **Celular (mobile)**.
- Actualizar validaciones de frontend y tests unitarios de `WachiRequestDrawer.test.tsx`.

### ❌ No Entra (Non-Goals / Anti-Goals)
- Modificar `CartDrawer` (bolsa de compra estándar).
- Modificar el flujo de checkout posterior en Shopify ni agregar integraciones de envío.
- Romper la tolerancia del endpoint `api/wachi-draft-order.ts` si no recibe campos de dirección o perfil.

## 4. Decisiones y Supuestos Aprobados
- La dirección de despacho completa se solicitará recién en la pantalla de pago de Shopify cuando Bruto Atelier envíe el `invoiceUrl` de la Draft Order.
- El formulario preliminar se enfoca exclusivamente en capturar los datos mínimos de contacto humano (Nombre, Apellido, Correo, Teléfono) junto con el resumen de la pieza WACHI seleccionada.

## 5. Notas para la Etapa de Propuesta
- Con solo 4 campos, la columna izquierda del grid actual queda muy liviana respecto a la derecha; se debe proponer una proporción, centrado vertical y orden responsivo (Desktop, iPad y Celular) que mantenga el balance visual minimalista de Bruto Atelier.
- Confirmar si el campo opcional de comentarios/medidas exactas se mantiene o también se omite para dejar estrictamente los 4 campos.
