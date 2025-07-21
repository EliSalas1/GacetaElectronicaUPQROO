# Supervisor Components

Este directorio contiene los componentes refactorizados del panel de supervisor, siguiendo estrictamente los principios SOLID, con funcionalidades de filtrado avanzado y **diseño completamente responsivo**.

## 📱 Diseño Responsivo Implementado

### **🎯 Breakpoints Utilizados:**

- **xs**: 475px (móviles pequeños)
- **sm**: 640px (móviles grandes)
- **md**: 768px (tablets)
- **lg**: 1024px (laptops)
- **xl**: 1280px (desktop)

### **📐 Adaptaciones por Dispositivo:**

#### **📱 Móviles (320px - 640px):**

- Pestañas apiladas verticalmente
- Cards de resumen en 1 columna
- Filtros apilados verticalmente
- Tablas con información condensada
- Información adicional mostrada bajo el título principal
- Textos más pequeños y espaciado optimizado

#### **📱 Móviles Grandes (640px - 768px):**

- Cards de resumen en 2 columnas
- Filtros en una fila con selectores más compactos
- Mostrar autor en tablas
- Pestañas horizontales

#### **💻 Tablets (768px - 1024px):**

- Cards mantienen 2 columnas
- Mostrar categoría en tablas
- Filtros completamente horizontales
- Mejor espaciado

#### **🖥️ Desktop (1024px+):**

- Cards en 4 columnas (xl)
- Todas las columnas de tabla visibles
- Máximo espacio aprovechado
- Experiencia completa

## Arquitectura SOLID Implementada

### **Principios SOLID Aplicados:**

#### **1. Single Responsibility Principle (SRP)**

- **`container.tsx`**: Solo maneja la orquestación de pestañas y la lógica de filtrado
- **`PendientesTab.tsx`**: Solo renderiza la tabla de pendientes y recibe datos via props
- **`HistorialTab.tsx`**: Solo renderiza la tabla de historial y recibe datos via props
- **`FilterControls.tsx`**: Solo renderiza los controles de filtrado UI
- **`useTableFilter.ts`**: Solo maneja la lógica de filtrado

#### **2. Dependency Inversion Principle (DIP)**

- Los componentes hijos **NO dependen** de implementaciones concretas de filtrado
- Los componentes reciben **abstracciones** (props con estado de filtrado)
- La lógica de negocio está **centralizada** en el container

#### **3. Interface Segregation Principle (ISP)**

- Cada componente recibe **solo las props que necesita**
- No hay dependencias innecesarias entre componentes

## Estructura de Componentes

### `container.tsx` (Orquestador Principal) ⭐

- **Responsabilidad**:
  - Orquestar las pestañas
  - Manejar TODA la lógica de filtrado
  - Configurar filtros para cada pestaña
  - Pasar estado procesado a componentes hijos
- **Principio**: **Dependency Inversion** - Los hijos dependen de abstracciones

### `PendientesTab.tsx` (Componente de Presentación)

- **Responsabilidad**: Solo renderizar la tabla de artículos pendientes
- **Props recibidas**:
  - `filterState`: Estado completo de filtrado procesado
  - `filterConfig`: Configuración de campos de filtrado
  - `onViewArticle`: Callback para navegación
- **Principio**: **Single Responsibility** - Solo presentación

### `HistorialTab.tsx` (Componente de Presentación)

- **Responsabilidad**: Solo renderizar la tabla de historial
- **Props recibidas**:
  - `filterState`: Estado completo de filtrado procesado
  - `filterConfig`: Configuración de campos de filtrado
- **Principio**: **Single Responsibility** - Solo presentación

### `ResumenTab.tsx` (Componente de Presentación)

- **Responsabilidad**: Mostrar cards de resumen con estadísticas
- **Datos**: Muestra 4 cards con iconos y métricas principales
- **Componentes hijos**: `ResumenCard.tsx`

### `FilterControls.tsx` (Componente UI Puro)

- **Responsabilidad**: Solo renderizar controles de filtrado
- **Props**: Estado y callbacks de filtrado
- **Principio**: **Single Responsibility** - Solo UI

### `ResumenCard.tsx` (Componente Reutilizable)

- **Responsabilidad**: Componente reutilizable para cards de métricas
- **Props**: título, valor, descripción, icono y color del icono

### `data/dummyData.ts` (Capa de Datos)

- **Responsabilidad**: Contener todos los datos dummy estructurados
- **Interfaces**: Define los tipos TypeScript para cada conjunto de datos

## Flujo de Datos (Dependency Inversion)

```
┌─────────────────────────────────────────┐
│           container.tsx                 │ ← Lógica de negocio
│  ┌─────────────────────────────────┐   │
│  │ useTableFilter(pendientesData)  │   │
│  │ useTableFilter(historialData)   │   │
│  └─────────────────────────────────┘   │
└─────────────┬───────────────────────────┘
              │ Props (abstracciones)
              ▼
┌─────────────────────────────────────────┐
│     PendientesTab / HistorialTab        │ ← Solo presentación
│  ┌─────────────────────────────────┐   │
│  │     FilterControls              │   │ ← Solo UI
│  │     Table + TableBody           │   │ ← Solo UI
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## Nuevas Funcionalidades de Filtrado

### Hook `useTableFilter` (Lógica Centralizada)

- **Ubicación**: `/src/hooks/useTableFilter.ts`
- **Usado en**: `container.tsx` (centralizado)
- **Funcionalidades**:
  - Búsqueda por múltiples campos
  - Filtrado por campo específico
  - Conteo de resultados filtrados
  - Reset de filtros
  - Generación automática de opciones de filtro

### Configuración Centralizada en Container:

```typescript
// En container.tsx - TODA la lógica aquí
const pendientesFilterConfig = {
  searchFields: ['titulo', 'autor'] as (keyof ArticuloPendiente)[],
  filterFields: {
    categoria: { label: 'Categoría', key: 'categoria' },
    autor: { label: 'Autor', key: 'autor' },
    fechaEnvio: { label: 'Fecha de Envío', key: 'fechaEnvio' }
  }
}

// Hook ejecutado en container
const pendientesFilter = useTableFilter(articulosPendientesDummyData, pendientesFilterConfig)

// Estado pasado como props (abstracciones)
<PendientesTab
  filterState={pendientesFilter}
  filterConfig={pendientesFilterConfig}
/>
```

## Preparación para API

```typescript
// En container.tsx - Fácil integración de API
const { data: pendientesData } = useQuery("/api/pendientes");
const { data: historialData } = useQuery("/api/historial");

const pendientesFilter = useTableFilter(
  pendientesData || [],
  pendientesFilterConfig
);
const historialFilter = useTableFilter(
  historialData || [],
  historialFilterConfig
);
```

Los componentes hijos **NO NECESITAN CAMBIOS** cuando integres las APIs.

## Uso

```tsx
import { SupervisorContainer } from "./components/container";

export default function SupervisorPage() {
  return <SupervisorContainer />;
}
```

### ⚠️ **Importante**:

La lógica de filtrado **DEBE permanecer en el container**. Los componentes hijos son **puros** y **solo reciben props**. Esto garantiza el cumplimiento de los principios SOLID.
