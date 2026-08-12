# 📅 Semana 1 (29 Jul - 4 Ago) | Conexión & Estructura

## 🎯 Objetivo & Entregable
* **Objetivo:** Creación de la tienda en Shopify Admin y conexión técnica de la Storefront API a la aplicación web (**Bruto Atelier Showcase**).
* 👉 **Entregable:** Base de la tienda conectada y verificada mediante queries de prueba en la aplicación web.

---

## 🏗️ Arquitectura de Conexión (Headless Shopify + Vite React)

En lugar de utilizar un tema prediseñado de Shopify, la aplicación web consume los datos mediante la **Storefront API (GraphQL)** manteniéndose fluida, rápida y fiel al diseño minimalista y ultra-premium de **Bruto Atelier**.

```
┌─────────────────────────────────────────────────────────────┐
│                 BRUTO ATELIER FRONTEND                      │
│             (Vite + React + Tailwind + TS)                  │
├─────────────────────────────────────────────────────────────┤
│  [ Componentes UI ]                                         │
│       │                                                     │
│  [ Custom Hooks ] ──▶  [ Shopify Client Service ]           │
└────────┬──────────────────────────┬─────────────────────────┘
         │                          │
         │ (Storefront API GraphQL) │ (Checkout Redirect / Permalinks)
         ▼                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   SHOPIFY BACKEND                           │
│  - Catálogo (Productos & Variantes: Madera, Acabados)       │
│  - Inventario, Precios & Pasarela de Pago (Webpay / Stripe) │
└─────────────────────────────────────────────────────────────┘
```

---

## 📅 Plan Operativo Día a Día

### **Día 1 (Miércoles 29 Jul) – Configuración Inicial en Shopify Admin**
* **Objetivo:** Tener la aplicación Headless activa en Shopify y extraer las llaves de acceso (Tokens).

#### 📍 **Fase 1: Preparación del Entorno Shopify**
1. Entrar a [Shopify Admin](https://admin.shopify.com/) o crear una tienda de desarrollo en [Shopify Partners](https://partners.shopify.com/).
2. Verificar la moneda base (ej. CLP / USD) e información general del negocio.

#### 📍 **Fase 2: Creación de la Aplicación Headless**
1. En Shopify Admin, ir al menú lateral: `Configuración > Aplicaciones y canales de venta`.
2. Hacer clic en **"Desarrollar aplicaciones"** (App Development).
3. Hacer clic en **"Crear una aplicación"** y nombrarla: `Bruto Atelier Web`.

#### 📍 **Fase 3: Configuración de Scopes de la Storefront API**
1. Dentro de la app `Bruto Atelier Web`, ir a la pestaña **Configuración** y seleccionar **Configuración de Storefront API**.
2. Marcar los permisos (Scopes) necesarios:
   - ✅ **Productos & Colecciones:** `unauthenticated_read_product_listings`, `read_products`
   - ✅ **Inventario:** `unauthenticated_read_product_inventory`
   - ✅ **Carrito & Checkout:** `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`, `unauthenticated_read_selling_plans`
3. Guardar cambios y hacer clic en **"Instalar aplicación"**.

#### 📍 **Fase 4: Extracción de Credenciales & Setup Local**
1. Copiar los valores del panel:
   - **Dominio:** `bruto-atelier.myshopify.com`
   - **Storefront Access Token:** (Generado en la sección de credenciales de API).
2. Crear tu archivo `.env.local` en la raíz del proyecto basándote en [.env.example](file:///Users/pedro/Documents/Pegas/bruto-atelier-showcase/.env.example).

---

### **Día 2 (Jueves 30 Jul) – Configuración de Entorno & Cliente API en la Web**
* **Tarea:** Preparar las variables de entorno y el cliente de comunicación en el código.
* **Acciones:**
  1. Configurar archivo `.env.local`:
     ```env
     VITE_SHOPIFY_STORE_DOMAIN=bruto-atelier.myshopify.com
     VITE_SHOPIFY_STOREFRONT_TOKEN=tu_storefront_access_token_aqui
     VITE_SHOPIFY_API_VERSION=2024-07
     ```
  2. Diseñar el cliente GraphQL / Fetcher nativo o ligero (`src/lib/shopify/client.ts`) para consultas a Shopify.
  3. Definir la tipografía de TypeScript (`src/types/shopify.ts`) para productos, imágenes, precios y variantes.

---

### **Día 3 (Viernes 31 Jul) – Test de Conexión & Queries Base**
* **Tarea:** Validar que la web pueda comunicarse correctamente con Shopify.
* **Acciones:**
  1. Crear una función de consulta básica `getShopInfo()` y `getProducts()` que traiga los primeros productos de prueba.
  2. Implementar un indicador/hook de estado de conexión (`useShopifyStatus`).
  3. Manejar fallbacks elegantes (si no hay credenciales o la tienda está en mantenimiento, mostrar mock/placeholders sin romper la interfaz).

---

### **Día 4 (Sábado 1 Ago) – Estructuración de la Capa de Estado & Mocking**
* **Tarea:** Diseñar la arquitectura de estado de tienda en React.
* **Acciones:**
  1. Crear el `ShopifyContext` o `CartProvider` base que encapsulará el ID del carrito (`checkoutId` / `cartId`).
  2. Asegurar la persistencia local en `localStorage` del token de sesión/carrito.

---

### **Días 5 y 6 (Domingo 2 y Lunes 3 Ago) – Pruebas de Estrés & Ajustes de Tipos**
* **Tarea:** Probar rendimiento y refinamiento visual.
* **Acciones:**
  1. Validar la velocidad de respuesta de la Storefront API.
  2. Asegurar que las imágenes provenientes del CDN de Shopify mantengan el soporte de lazy loading y blur placeholders con el estilo visual de Bruto Atelier (estética Zara Home / Audo Cph).

---

### **Día 7 (Martes 4 Ago) – Entregable & Revisión de la Semana 1**
* **Entregable:** Base de la tienda conectada y verificada.
* **Acciones:**
  1. Verificar que el comando de build (`npm run build`) pase sin errores de TypeScript ni de variables de entorno.
  2. Revisión de estado local con Jujutsu (`jj status`).

---

## ❓ Preguntas de Alineación para Iniciar
1. **¿Ya tienes creada la tienda en Shopify Admin / Shopify Partners, o necesitas ayuda para crear la app headless desde cero?**
2. **¿Prefieres que usemos `fetch` nativo con GraphQL para mantener el paquete ligero, o quieres integrar el SDK oficial `@shopify/storefront-api-client`?**
