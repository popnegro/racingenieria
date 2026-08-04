# AUDIT DE ARQUITECTURA — RAC Ingeniería ERP Técnico

Este documento presenta una auditoría detallada de la arquitectura actual de la aplicación **RAC Desk / Customer Care MVP** para transformarla en un **ERP/CRM Técnico interno para RAC Ingeniería**, especializado en la reparación de electrónica industrial de alta complejidad.

---

## 1. Análisis de la Estructura Actual

El proyecto es una aplicación de página única (**SPA**) estructurada sobre **React 19**, **Vite**, y **TypeScript**. La arquitectura actual está dividida en las siguientes carpetas principales:

*   `/src/main.tsx` y `/src/index.css`: Punto de entrada y estilos globales de Tailwind.
*   `/src/App.tsx`: Orquestador de navegación, ruteo por estados (`activeView`) y almacenamiento del estado global mutable en memoria.
*   `/src/types.ts`: Definición de modelos de datos e interfaces tipadas de negocio.
*   `/src/data/mockData.ts`: Semillas estables y determinísticas de datos simulados de clientes, llamadas, agenda e historial técnico.
*   `/src/components/`: Componentes modulares reutilizables y drawers dinámicos.
*   `/src/pages/`: Vistas de nivel superior cargadas dinámicamente mediante el orquestador en `App.tsx`.

---

## 2. Clasificación de Componentes Actuales

Evaluamos cada archivo y componente existente para adaptarlo a la nueva lógica industrial de RAC Ingeniería, clasificándolo en las siguientes categorías:

### A. Reutilizables (con cambios estéticos o mínimos)
*   **`src/components/Topbar.tsx`**: Excelente control de barra superior. Se mantendrá el avatar de operador/técnico activo y el indicador de estado. Se adaptará para mostrar el rol del técnico o supervisor industrial en su lugar.
*   **`src/components/StatusBadge.tsx`**: Reutilizable para los estados de las Órdenes de Trabajo (OTs). Se ampliará para soportar el flujo técnico completo (Recepcionado, En diagnóstico, Esperando aprobación, En reparación, Esperando repuestos, En prueba, Finalizado, Entregado).
*   **`src/components/KPICard.tsx`**: Tarjetas de métricas perfectamente diseñadas con soporte de íconos y variación de porcentaje. Se reutilizará en el Dashboard Técnico Principal.

### B. Para Eliminar / Reemplazar por Completo
*   **Métricas SaaS genéricas**: Toda referencia a suscripciones mensuales, conversión de leads comerciales clásicos, embudo de ventas clásico o "Revenue".
*   **`src/pages/InsightsView.tsx`**: Contiene gráficos circulares y barras simplistas adaptados a volumen de llamadas. Se reemplazará por un panel de **Reportes Operativos de Laboratorio** (Tiempos medios de reparación, marcas más reparadas, rentabilidad por OT, tasa de retrabajo y control de garantías).

### C. Para Renombrar y Refactorizar
*   **`src/pages/CallRegisterView.tsx`** $\rightarrow$ **`src/pages/WorkOrderRegisterView.tsx`**: Renombrar para ser el módulo de **Recepción e Ingreso de Equipos (Generación de OT)**.
*   **`src/components/CallForm.tsx`** $\rightarrow$ **`src/components/WorkOrderForm.tsx`**: Adaptar el formulario de llamadas activas para ser un panel interactivo de ingreso de equipos, donde se asiente el fabricante, modelo, número de serie, tipo de falla reportada, observaciones iniciales y criticidad.
*   **`src/pages/AgendaView.tsx`** $\rightarrow$ **`src/pages/TechnicalAgendaView.tsx`**: Adaptar la agenda técnica de seguimiento para vincular tareas específicas a técnicos asignados a laboratorios u OTs.
*   **`src/components/AgendaCalendar.tsx`**: Ampliar para que las tareas en el calendario muestren prioridades de reparación y visitas a plantas industriales.
*   **`src/pages/HistoryView.tsx`** $\rightarrow$ **`src/pages/TechnicalHistoryView.tsx`**: El historial de eventos mutará para ser una bitácora de auditoría técnica global (ej: "OT-104 cambió de 'En diagnóstico' a 'Esperando repuestos' por Técnico Lucas").

### D. Para Refactorizar Profundamente (Cambio de Dominio)
*   **`src/pages/CustomersView.tsx`** y **`src/components/CustomerTable.tsx`**: Se rediseñará para gestionar **Clientes Industriales**. Se incorporarán campos clave como Razón Social, CUIT, Planta/Ubicación Física, Industria, Equipos Asociados y OTs Históricas.
*   **`src/components/CustomerDetailDrawer.tsx`**: Se transformará en la **Ficha Técnica e Historial del Cliente**. En lugar de notas genéricas y llamadas, mostrará pestañas interactivas de:
    1.  Equipos en Planta de ese cliente.
    2.  Historial de Órdenes de Trabajo con su respectivo estado.
    3.  Reportes de diagnóstico firmados y presupuestos vigentes.

---

## 3. Plan de Migración de Fases Propuesto

Alineado con el flujo de PRs incrementales y seguros, definimos la siguiente ruta crítica:

```
┌───────────────────────────────────────────────────────────┐
│ FASE 1: Auditoría y Definición de Dominio                 │◄── [ESTADO: ACTUAL]
│ (Generar AUDIT.md y DOMAIN_MODEL.md)                      │
└─────────────────────────────┬─────────────────────────────┘
                              ▼
┌───────────────────────────────────────────────────────────┐
│ FASE 2: Limpieza y Re-Tipado de la Aplicación             │
│ (Refactorizar types.ts, mockData.ts y core states)        │
└─────────────────────────────┬─────────────────────────────┘
                              ▼
┌───────────────────────────────────────────────────────────┐
│ FASE 3: Refactorización del Sidebar y Topbar (Navegación)  │
│ (Establecer menús industriales, marcas técnicas)          │
└─────────────────────────────┬─────────────────────────────┘
                              ▼
┌───────────────────────────────────────────────────────────┐
│ FASE 4: Módulo de Clientes Industriales & Equipos         │
│ (Vistas optimizadas, tablas de activos, CUIT, plantas)    │
└─────────────────────────────┬─────────────────────────────┘
                              ▼
┌───────────────────────────────────────────────────────────┐
│ FASE 5: Laboratorio Kanban & Órdenes de Trabajo (OT)      │
│ (Gestión técnica interactiva, drag-and-drop simulado)     │
└─────────────────────────────┬─────────────────────────────┘
                              ▼
┌───────────────────────────────────────────────────────────┐
│ FASE 6: Diagnósticos, Presupuestos y Reparaciones         │
│ (Formularios de diagnóstico técnico, notas de voz, PDFs)  │
└─────────────────────────────┬─────────────────────────────┘
                              ▼
┌───────────────────────────────────────────────────────────┐
│ FASE 7: Control de Stock, Repuestos y Compras             │
│ (Administración de componentes electrónicos críticos)     │
└─────────────────────────────┬─────────────────────────────┘
                              ▼
┌───────────────────────────────────────────────────────────┐
│ FASE 8: Reportes Técnicos y Garantías                     │
│ (KPIs de eficiencia, marcas frecuentes, rentabilidad)     │
└─────────────────────────────┬─────────────────────────────┘
                              ▼
┌───────────────────────────────────────────────────────────┐
│ FASE 9: Optimización Final y Verificación de Compilación  │
│ (Build de producción, linter limpio y accesibilidad)      │
└───────────────────────────────────────────────────────────┘
```

---

## 4. Clasificación de Datos para RAC Ingeniería

Nuestros datos falsos en `mockData.ts` dejarán de reflejar empresas genéricas de software o inmobiliarias. En su lugar, incorporaremos realismo técnico argentino e industrial:

*   **Clientes**: Acindar, Tenaris, Aluar, YPF Química, Cervecería Quilmes, Toyota Argentina, Loma Negra.
*   **Fabricantes / Marcas de Electrónica**: Siemens (Somatic S7, Sinamics), ABB, Schneider Electric (Altivar), Rockwell Automation (Allen-Bradley PowerFlex), Fanuc, Yaskawa.
*   **Técnicos especialistas (en lugar de operadores comerciales)**: Técnicos en Electrónica Industrial, Especialistas en Servomotores, Ingenieros Instrumentistas de Laboratorio.
