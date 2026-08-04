# RAC Customer Desk (MVP)

Un dashboard de rendimiento corporativo y atención al cliente premium, diseñado para operadores de call center, administrativos y supervisores. Se centra en la velocidad operativa, la visualización de KPIs y la consistencia en el seguimiento de cuentas comerciales.

---

## 🚀 Arquitectura y Estructura de Carpetas

La aplicación está modularizada bajo buenas prácticas de diseño de software y tipado estricto de TypeScript:

```
/
├── index.html                  # Punto de entrada de renderizado HTML5
├── metadata.json               # Configuración del contenedor en la plataforma
├── package.json                # Dependencias, scripts de construcción y linter
├── README.md                   # Documentación funcional y técnica
├── tsconfig.json               # Configuración de tipado estricto TypeScript
├── src/
│   ├── App.tsx                 # Contenedor central (Estados reactivos globales y layouts)
│   ├── main.tsx                # Inicializador de la aplicación React 19
│   ├── index.css               # Importaciones de Tailwind CSS
│   ├── types.ts                # Interfaces de datos estrictamente tipadas (Customer, CallLog, Operator...)
│   ├── data/
│   │   └── mockData.ts         # Datos iniciales simulados (50 clientes, 100 llamadas, 10 agentes)
│   ├── components/
│   │   ├── Sidebar.tsx         # Barra de navegación lateral y selector de agente activo
│   │   ├── Topbar.tsx          # Cabecera global con widgets de estado de conexión del operador
│   │   ├── KPICard.tsx         # Tarjeta moderna con micro-animaciones para métricas
│   │   ├── StatsChart.tsx      # Gráficos interactivos SVG personalizados (Líneas y barras)
│   │   ├── StatusBadge.tsx     # Indicador visual para estados de atención
│   │   ├── CustomerTable.tsx   # Tabla con filtros complejos, búsqueda instantánea y paginación
│   │   ├── CustomerDetailDrawer.tsx # Panel lateral desplegable con notas y acciones directas
│   │   ├── CallForm.tsx        # Formulario avanzado para registrar llamadas con programador
│   │   └── AgendaCalendar.tsx  # Calendario mensual interactivo con alertas de prioridad
│   └── pages/
│       ├── DashboardView.tsx   # Panel de control global con KPIs y casos urgentes
│       ├── CustomersView.tsx   # Directorio centralizado de clientes corporativos
│       ├── CallRegisterView.tsx# Interfaz de registro de llamadas entrantes/salientes
│       ├── AgendaView.tsx      # Agenda con lista de tareas de seguimientos agendados
│       ├── HistoryView.tsx     # Línea de tiempo cronológica con filtros por categoría
│       └── InsightsView.tsx    # Analíticas de efectividad de SLAs y tablas de rendimiento
```

---

## 🛠️ Requisitos Técnicos & Configuración

El proyecto es totalmente compatible con React 19 y Tailwind CSS 4.

### Instalación de dependencias
```bash
npm install
```

### Ejecutar servidor de desarrollo local
```bash
npm run dev
```

### Compilar para producción (producción build)
```bash
npm run build
```

---

## 🎨 Decisiones de Diseño y UI/UX (Anti-Slop Guidelines)

1. **Gama de Colores Sofisticada**: Se ha prescindido por completo de degradados chillones (púrpura-azul/neón). El diseño utiliza una paleta de grises neutros cálidos (`#fafafa` y `#ffffff`) junto con acentos limpios de índigo y esmeralda de baja vibración para estados semánticos, garantizando la accesibilidad WCAG AA.
2. **Jerarquía Visual Clara**: Los tamaños tipográficos siguen una escala matemática rigurosa, eliminando duplicación de contenedores y cards anidadas.
3. **Optimización a 2 Clics**: El operador puede acceder a cualquier ficha de cliente, agendar un seguimiento o revisar el historial completo de llamadas en un máximo de dos clics desde cualquier punto de la aplicación.
4. **Cascada de Estado Reactiva**: Al guardar el registro de una llamada en la pestaña correspondiente:
   - Se actualiza la fecha de último contacto del cliente.
   - El operador que atendió la llamada queda asignado a la cuenta.
   - Se adjunta automáticamente la observación al perfil del cliente.
   - Se crea una alerta interactiva en la Agenda si se especificó seguimiento.
   - Se recalcula de inmediato el volumen de llamadas y la efectividad en el Dashboard y la página de Insights.
5. **Selector de Operador Activo**: Al pie de la barra lateral, el supervisor puede alternar entre los 10 operadores para auditar el desempeño individual de manera directa.
