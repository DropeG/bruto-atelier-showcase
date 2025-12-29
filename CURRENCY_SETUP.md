# Sistema de Currency Multi-País

## ✅ Implementación Completa

### Archivos creados:
1. **`src/contexts/CurrencyContext.tsx`** - Context global con países y tasas
2. **`src/components/CurrencyDropdown.tsx`** - Dropdown funcional con búsqueda
3. **`src/components/Price.tsx`** - Componente para mostrar precios convertidos
4. **`src/main.tsx`** - Actualizado con CurrencyProvider

### Países incluidos:
- Chile, Argentina, Colombia, México, Perú, Costa Rica
- Ecuador, Uruguay, Bolivia, Paraguay
- Estados Unidos, España

## 🎯 Cómo usar

### 1. El dropdown ya está funcionando en el header
Haz clic en "Chile | CLP $" para cambiar el país/moneda.

### 2. Para mostrar precios en cualquier parte de tu app:

```tsx
import Price from "@/components/Price";

// Precio base en USD
<Price basePrice={500} />
// Resultado: $475,000 CLP (si está en Chile)
// Resultado: $8,500 MXN (si está en México)

// Sin código de moneda
<Price basePrice={500} showCurrency={false} />
// Resultado: $475,000

// Con clases personalizadas
<Price 
  basePrice={500} 
  className="text-2xl font-bold"
/>
```

### 3. Ejemplo en ProductSection:

```tsx
import Price from "@/components/Price";

const ProductSection = () => {
  return (
    <div>
      <h3>Silla Wachi</h3>
      <p className="text-lg">
        <Price basePrice={500} /> {/* 500 USD base */}
      </p>
    </div>
  );
};
```

## 💡 Notas importantes:

- **Todos los precios base deben estar en USD**
- Las tasas de conversión son fijas (puedes actualizarlas en `CurrencyContext.tsx`)
- El cambio de moneda es global e inmediato en toda la app
- El país seleccionado persiste mientras no se recargue la página

## 🔧 Para ajustar tasas de cambio:

Edita `src/contexts/CurrencyContext.tsx`:
```tsx
{ code: "CL", name: "Chile", currency: "CLP", symbol: "$", rate: 950 }
//                                                             ^^^ cambiar aquí
```

## 🚀 Próximos pasos opcionales:

- Persistir selección en localStorage
- Conectar API de tasas de cambio en tiempo real
- Agregar más países según necesidad
