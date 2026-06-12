# Sistema de Administración - Panel Superusuario

## Estructura Modular

### Layouts

- **AdminLayout.astro** - Layout principal con sidebar y protección de rutas

### Componentes Admin (`src/components/admin/`)

#### UI Components

- **AdminSidebar.astro** - Barra lateral de navegación con menú
- **DataTable.jsx** - Tabla genérica reutilizable con ordenamiento
- **Modal.jsx** - Modal reutilizable para formularios
- **FormInputs.jsx** - Componentes de formulario (TextInput, SelectInput, NumberInput, TextArea)

#### Charts & Dashboard

- **Charts.jsx** - Componentes de gráficos (Recharts)
  - StatsOverview: Tarjetas de estadísticas
  - AppointmentsChart: Gráfico de barras de citas
  - RevenueChart: Gráfico de líneas de ingresos
  - AppointmentStatusChart: Gráfico de pastel de estados

#### Content Components (Páginas)

- **DashboardContent.jsx** - Dashboard principal con gráficos y estadísticas
- **BarbersContent.jsx** - CRUD de Barberos
- **ServicesContent.jsx** - CRUD de Servicios
- **SchedulesContent.jsx** - CRUD de Horarios

### Páginas Admin (`src/pages/admin/`)

- **dashboard.astro** - Página principal del panel
- **barbers.astro** - Gestión de barberos
- **services.astro** - Gestión de servicios
- **schedules.astro** - Gestión de horarios

### Utilidades

- **src/lib/api.js** - Funciones para consumir la API
- **src/lib/utils.js** - Funciones auxiliares (formatting, validación, etc.)

## Características

### 1. Dashboard

- Estadísticas de barberos, servicios y citas
- Gráficos de citas por día
- Gráfico de ingresos por día
- Gráfico de estado de citas (pastel)

### 2. Gestión de Barberos

- Tabla con búsqueda y ordenamiento
- Modal para crear/editar barberos
- Eliminación con confirmación
- Validación de email y teléfono

### 3. Gestión de Servicios

- Tabla con búsqueda y ordenamiento
- Modal para crear/editar servicios
- Validación de precio y duración
- Formato de moneda en tabla

### 4. Gestión de Horarios

- Tabla con búsqueda y ordenamiento
- Modal para crear/editar horarios
- Validación de horas y descansos
- Asociación a barberos

## Uso

### Acceso

1. Ir a `/admin-login`
2. Ingresar credenciales de superusuario
3. Acceso automático a `/admin/dashboard`

### Navegación

- Usar la barra lateral para navegar entre secciones
- Cada sección tiene su propia tabla CRUD
- Botón "Nuevo" para crear registros
- Iconos de editar/eliminar en cada fila

### Modals

- Se abren con los botones "Nuevo" o "Editar"
- Incluyen validación automática
- Feedback visual de errores
- Confirmación de acciones

## Validaciones

### Barberos

- Nombre (requerido)
- Email (requerido, formato válido)
- Teléfono (requerido, formato válido)
- Especialidad (requerido)
- Años de experiencia (requerido, >= 0)

### Servicios

- Nombre (requerido)
- Precio (requerido, > 0)
- Duración (requerido, > 0)

### Horarios

- Barbero (requerido)
- Día de la semana (requerido)
- Hora inicio (requerido)
- Hora fin (requerido, > hora inicio)
- Descanso (opcional)

## Seguridad

- Las rutas admin están protegidas
- Se requiere token JWT valido en localStorage
- Auto-logout si el token es inválido
- Redirección a login si no está autenticado

## Estilos

- Tailwind CSS para diseño
- Colores: Azul (#3b82f6) para tema principal
- Responsive design
- Transiciones suaves
- Iconos de Lucide React

## Librerías Utilizadas

- **Astro** - Framework SSG
- **React** - Componentes interactivos
- **Recharts** - Gráficos
- **Lucide React** - Iconos
- **Tailwind CSS** - Estilos
- **TypeScript** - Type safety

## Variables de Ambiente

```
PUBLIC_API_URL=http://localhost:3000
```

## Próximas Mejoras

- [ ] Exportar datos a CSV/PDF
- [ ] Filtros avanzados en tablas
- [ ] Paginación
- [ ] Búsqueda global
- [ ] Gráficos por período customizable
- [ ] Historial de cambios
- [ ] Notificaciones en tiempo real
