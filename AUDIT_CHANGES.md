# Auditoría Frontend – Cambios realizados

Rama: `audit`  
Base: `main` (7 commits adicionales)

---

## 🔴 Críticos

### C1 — Dashboard admin con datos reales
**Archivo:** `src/components/admin/DashboardContent.jsx`
**Qué:** Se reemplazó `generateChartData()` (datos mock con `Math.random()`) por funciones `groupByDate()` y `countByStatus()` que agregan citas reales desde la API.
- Agrupación por fecha real usando `start_time`
- Ingresos calculados desde `service.price`
- Estado de citas con conteos reales por status

### A2 — Button `variant="filleable"` corregido a `variant="primary"` + forwardRef
**Archivos:** `src/components/Button.jsx`, `SelectService.jsx`, `SelectBarber.jsx`, `SelectDate.jsx`, `Checkout.jsx`
**Qué:**
- Se agregó la variante `"primary"` con fondo dorado sólido (sin efecto slide)
- Se reemplazaron todos los `variant="filleable"` por `variant="primary"` en los 4 steps del BookingWizard
- Se envolvió el componente con `forwardRef`

---

## 🔴🔵 Seguridad

### A1 — AdminGuard valida expiración JWT
**Archivo:** `src/components/admin/AdminGuard.jsx`
**Qué:** Se agregó función `isTokenExpired()` que decodifica el JWT y verifica `exp`. Si el token expiró, redirige a `/admin-login`.

### M4 — Eliminado `localStorage.removeItem("token")` inservible
**Archivos:** `src/pages/login.astro`, `src/pages/admin-login.astro`
**Qué:** Se eliminaron líneas que referenciaban `"token"`, una clave que nunca se almacena.

---

## 🟡 Funcionales

### M1 — Eliminada opción ONLINE no operativa
**Archivos:** `Checkout.jsx`, `BookingWizard.jsx`, `useBooking.js`
**Qué:** Se quitó el selector de pago online, su modal de "Próximamente" y toda la lógica asociada (`showOnlineModal`, `handleCloseOnlineModal`). Ahora solo existe pago LOCAL.

### M3 — DataTable `key={idx}` → `key={row.id}`
**Archivo:** `src/components/admin/DataTable.jsx`
**Qué:** Se reemplazó el índice como key de React por `row.id` para evitar problemas de reconciliación.

### M5 — `formatoHoraCita` con fallback Date
**Archivo:** `src/lib/date-utils.js`
**Qué:** Si el regex falla, intenta parsear con `new Date(isoString).toLocaleTimeString()` con timezone Lima.

### M6 — Días excluidos configurables
**Archivo:** `src/components/BookingWizard/steps/SelectDate.jsx`
**Qué:** Se extrajo el `if (dowIdx === 0) continue` duro a una constante `EXCLUDED_DAYS = [0]`.

### Disabled en slots pasados
**Archivo:** `src/components/BookingWizard/steps/SelectDate.jsx`
**Qué:** Se agregó función `isSlotPast()` que compara cada slot con la hora actual en Lima. Los slots vencidos se muestran con estilo gris tenue, `cursor-not-allowed` y no responden al click.

---

## 🟡 Visuales

### M8 — Admin panel unificado al tema oscuro/dorado
**Archivos:** `AdminLayout.astro`, `AdminGuard.jsx`, `AdminSidebar.jsx`, `AdminShell.jsx`, `DashboardContent.jsx`, `DataTable.jsx`, `Modal.jsx`, `FormInputs.jsx`, `BarbersContent.jsx`, `ServicesContent.jsx`, `SchedulesContent.jsx`, `AppointmentsContent.jsx`, `Charts.jsx`
**Qué:** Migración completa del panel admin de tema claro (bg-white/blue) a tema oscuro consistente con la marca (`#0a0f1a`, `#131b2d`, `#d4af37`). Se actualizaron:
- Layout y sidebar
- Tablas, modales, formularios
- Badges de estado (para contraste en fondo oscuro)
- Charts de Recharts (ejes, grid, tooltips con colores visibles)

---

## 🔵 Calidad

### B3 — Limpiar estilos inline residuales
**Archivo:** `src/pages/index.astro`
**Qué:** Se eliminó `style="translate: none; rotate: none; ..."` artefacto de editor visual.

### B4 — Accesibilidad
**Archivos:** `src/components/Header.astro`, `src/components/Icon.jsx`
**Qué:** Se agregó `aria-label="Abrir menú"` al botón hamburguesa y `aria-hidden="true"` a iconos decorativos.

---

## Resumen de commits

```
eacafe9 fix(booking): slots pasados se muestran disabled con cursor not-allowed
9329f16 fix(charts): colores de ejes, grid, tooltip y leyenda visibles en fondo oscuro
520c061 style(admin): unificar tema del panel admin con esquema oscuro/dorado de la marca
be67403 fix(ui): DataTable key por id, formatoHoraCita con fallback Date, dias excluidos configurables
19db766 fix(booking): eliminar opción de pago online no operativa y su modal
44be0be fix(auth): agregar validación de expiración JWT en AdminGuard
43ee090 fix(auth): eliminar localStorage.removeItem('token') inservible (nunca se almacena esa clave)
b0ffb37 fix(critical): reemplazar datos mock del dashboard por datos reales y corregir variant=filleable a primary en Button
```
