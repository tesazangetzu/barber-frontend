# Panel de Administración Superusuario - Documentación Completa

## 🎯 Resumen General

Se ha implementado un sistema completo de administración para superusuarios con:

- **Barra lateral de navegación** modular y responsive
- **Dashboard principal** con gráficos y estadísticas
- **CRUD completo** para Barberos, Servicios y Horarios
- **Validaciones** en formularios y datos
- **Modals reutilizables** para operaciones
- **Tablas interactivas** con ordenamiento

## 📁 Estructura de Archivos

```
src/
├── layouts/
│   ├── AdminLayout.astro          # Layout principal con sidebar y protección
│   └── Layout.astro                # Layout público existente
├── components/
│   └── admin/
│       ├── AdminSidebar.astro      # Barra lateral de navegación
│       ├── AdminGuard.jsx          # Protección de rutas (cliente)
│       ├── DataTable.jsx           # Tabla genérica reutilizable
│       ├── Modal.jsx               # Modal reutilizable
│       ├── FormInputs.jsx          # Componentes de formulario
│       ├── Charts.jsx              # Componentes de gráficos
│       ├── DashboardContent.jsx    # Dashboard principal
│       ├── BarbersContent.jsx      # CRUD Barberos
│       ├── ServicesContent.jsx     # CRUD Servicios
│       ├── SchedulesContent.jsx    # CRUD Horarios
│       └── README.md               # Documentación del sistema
├── pages/
│   └── admin/
│       ├── dashboard.astro         # Página dashboard
│       ├── barbers.astro           # Página gestión barberos
│       ├── services.astro          # Página gestión servicios
│       └── schedules.astro         # Página gestión horarios
├── lib/
│   ├── api.js                      # Funciones API
│   └── utils.js                    # Utilidades helpers
└── styles/
    └── global.css                  # Estilos globales (existente)
```

## 🎨 Componentes Implementados

### 1. **AdminLayout.astro**

Layout principal que:

- Renderiza Header y AdminSidebar
- Protege rutas con AdminGuard (verificación cliente)
- Proporciona área de contenido principal con margen para sidebar
- Reutilizable para todas las páginas admin

### 2. **AdminSidebar.astro**

Barra lateral con:

- Logo y título "Panel Admin"
- Navegación a Dashboard, Barberos, Servicios, Horarios
- Estado activo de ruta actual
- Botón de logout con localStorage
- Estilos gradient azul

### 3. **DataTable.jsx**

Tabla genérica con:

- Columnas configurables
- Ordenamiento por columna
- Botones Nuevo/Editar/Eliminar
- Estados de carga
- Mensaje cuando no hay datos
- Renderización personalizable de celdas

### 4. **Modal.jsx**

Modal reutilizable:

- Títulos configurables
- Tamaños (sm, md, lg, xl)
- Textos de botones personalizables
- Callback de confirmación
- Botón de cierre (X)

### 5. **FormInputs.jsx**

Componentes de formulario:

- `TextInput` - Campo de texto con validación
- `SelectInput` - Dropdown con opciones
- `NumberInput` - Campo numérico con límites
- `TextArea` - Área de texto multilínea
- `FormGroup` - Contenedor con label y errores

### 6. **Charts.jsx**

Componentes de gráficos (Recharts):

- `StatsOverview` - Tarjetas de estadísticas
- `AppointmentsChart` - Gráfico de barras (citas/día)
- `RevenueChart` - Gráfico de líneas (ingresos/día)
- `AppointmentStatusChart` - Gráfico pastel (estados)

### 7. **Contenedores de Página**

#### DashboardContent.jsx

```
- Carga datos de API (barberos, servicios, citas)
- Calcula estadísticas
- Genera datos de gráficos
- Renderiza StatsOverview + Charts
```

#### BarbersContent.jsx

```
- CRUD Barberos
- Validación: nombre, email, teléfono, especialidad, años experiencia
- Modal para crear/editar
- Tabla con ordenamiento
```

#### ServicesContent.jsx

```
- CRUD Servicios
- Validación: nombre, precio > 0, duración > 0
- Formato moneda en tabla ($)
- Modal con campo descripción
```

#### SchedulesContent.jsx

```
- CRUD Horarios
- Vinculación con barberos
- Validación de horas (inicio < fin)
- Descansos opcionales
- Conversión de día número a nombre
```

## 🔌 Funcionalidades API

### api.js - Funciones de consumo:

```javascript
// Barbers
getBarbers();
createBarber(data);
updateBarber(id, data);
deleteBarber(id);

// Services
getServices();
createService(data);
updateService(id, data);
deleteService(id);

// Schedules
getSchedules();
createSchedule(data);
updateSchedule(id, data);
deleteSchedule(id);

// Appointments
getAppointments();
```

Todas incluyen:

- Autenticación con JWT token de localStorage
- Manejo de errores
- Fallbacks predeterminados

## 🛡️ Validaciones

### Barberos

- ✓ Nombre (requerido)
- ✓ Email (requerido, formato válido)
- ✓ Teléfono (requerido, formato +X XXXXXXX)
- ✓ Especialidad (requerido)
- ✓ Años experiencia (requerido, >= 0)

### Servicios

- ✓ Nombre (requerido)
- ✓ Precio (requerido, > 0)
- ✓ Duración (requerido, > 0 minutos)

### Horarios

- ✓ Barbero (requerido)
- ✓ Día semana (requerido, 0-6)
- ✓ Hora inicio (requerido, formato HH:mm:ss)
- ✓ Hora fin (requerido, > hora inicio)
- ✓ Descansos (opcional)

## 🎯 Rutas de Administración

| Ruta               | Descripción                      | Protegida |
| ------------------ | -------------------------------- | --------- |
| `/admin/dashboard` | Dashboard principal con gráficos | ✓         |
| `/admin/barbers`   | Gestión de barberos              | ✓         |
| `/admin/services`  | Gestión de servicios             | ✓         |
| `/admin/schedules` | Gestión de horarios              | ✓         |
| `/admin-login`     | Login para superusuario          | ✗         |

## 🔐 Autenticación y Protección

### AdminGuard.jsx

- Verifica `localStorage.admin`
- Valida token y rol === 'admin'
- Redirige a `/admin-login` si no está autorizado
- Muestra spinner durante verificación

### Flujo:

1. Usuario visita `/admin/*`
2. AdminGuard verifica localStorage.admin
3. Si no existe o inválido → Redirige a `/admin-login`
4. Si válido → Renderiza contenido admin

## 📊 Dashboard - Características

### Estadísticas (StatsOverview)

- Total de barberos
- Total de servicios
- Total de citas
- Ingresos totales

### Gráficos

- **Citas por Día** (últimos 7 días) - Gráfico de barras
- **Ingresos por Día** (últimos 7 días) - Gráfico de líneas
- **Estado de Citas** - Gráfico pastel (completadas/pendientes/canceladas)

_Nota: Los datos se generan con números aleatorios. En producción, consumirían API endpoints específicos._

## 💻 Tecnologías Utilizadas

### Frontend

- **Astro 6.x** - Framework SSG/SSR
- **React 19.x** - Componentes interactivos
- **Tailwind CSS 4.x** - Styling
- **Recharts** - Visualización de datos
- **Lucide React** - Iconografía

### Estructura

- TypeScript para type safety
- Client-side rendering donde es necesario
- SSG para páginas estáticas
- localStorage para persistencia de sesión

## 🚀 Uso Local

### Instalación

```bash
cd frontend
npm install
```

### Desarrollo

```bash
npm run dev
# Abre http://localhost:3000
```

### Build

```bash
npm run build
# Genera dist/
```

### Variables de Ambiente

```
PUBLIC_API_URL=http://localhost:3000
```

## 📱 Responsividad

- **Sidebar** - Ancho fijo 256px (ml-64 en main)
- **Tablas** - Scroll horizontal en móvil
- **Modals** - Responsivos (max-h: 90vh, overflow-y: auto)
- **Gráficos** - ResponsiveContainer (responsive width)
- **Grid** - `grid-cols-1 md:grid-cols-4` para tarjetas

## 🎨 Paleta de Colores

| Elemento    | Color          | Tailwind                    |
| ----------- | -------------- | --------------------------- |
| Sidebar     | Azul degradado | `from-blue-900 to-blue-800` |
| Acciones    | Azul           | `bg-blue-600`               |
| Éxito       | Verde          | `text-green-500`            |
| Peligro     | Rojo           | `text-red-600`              |
| Advertencia | Naranja        | `text-orange-500`           |
| Fondo       | Gris claro     | `bg-gray-50`                |

## 📈 Mejoras Futuras

- [ ] Exportar datos a CSV/PDF
- [ ] Filtros avanzados en tablas
- [ ] Paginación (actualmente 100 registros)
- [ ] Búsqueda global en tablas
- [ ] Rango de fechas en gráficos
- [ ] Historial de cambios (audit log)
- [ ] Notificaciones en tiempo real
- [ ] Caché con SWR/React Query
- [ ] Dark mode
- [ ] Multi-idioma

## 🐛 Consideraciones

1. **Build limpio** - Sin warnings de Astro
2. **Performance** - Componentes optimizados con useMemo
3. **Error handling** - Manejo de errores en API calls
4. **UX** - Confirmaciones antes de eliminar
5. **Type safety** - Props interfaces en componentes Astro

## 📝 Notas Técnicas

- Los gráficos usan `generateChartData()` con datos aleatorios (mock)
- El ordenamiento de tablas es client-side
- Las validaciones ocurren antes de enviar al servidor
- Los modals se cierran al guardar exitosamente
- Se usa `localStorage` para persistencia de token

---

**Creado:** 2026-06-07
**Versión:** 1.0.0
**Estado:** Producción Lista
