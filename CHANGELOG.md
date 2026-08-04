# CHANGELOG — RAC Ingeniería ERP Técnico

Todos los cambios y progresos de refactorización de la plataforma para RAC Ingeniería se registrarán detalladamente en este archivo.

---

## [Fase 1: Auditoría y Definición de Dominio] — 2026-08-03

### Agregado
*   Creado el documento maestro de auditoría técnica `/docs/AUDIT.md` clasificando los componentes de la aplicación en categorías (reutilizable, eliminar, renombrar, refactorizar, reemplazar) e introduciendo el plan de migración por fases.
*   Creado el documento `/docs/DOMAIN_MODEL.md` detallando las entidades de negocio industriales de RAC Ingeniería: Cliente Industrial, Equipo Activo, Orden de Trabajo (OT), Diagnóstico de Laboratorio, Presupuesto Comercial, Reparación Ejecutada, Stock de Repuestos, Órdenes de Compra y Garantías.
*   Creado este archivo de auditoría e historial `CHANGELOG.md` para documentar paso a paso el progreso del ERP.

### Verificación
*   Verificado el correcto funcionamiento del linter (`npm run lint` / `tsc --noEmit`).
*   Verificada la compilación exitosa del proyecto actual (`npm run build`).

---

## [Fase 2: Limpieza y Re-Tipado de la Aplicación] — 2026-08-03

### Modificado
*   **`/src/types.ts`**: Re-tipado completo para el dominio de RAC Ingeniería. Añadidas interfaces para `Equipment`, `StockItem`, `PurchaseOrder`, y `WarrantyItem`. Redefinido `CallLog` para que funcione internamente como la Orden de Trabajo (OT) con soporte para repuestos, costes de potencia, horas de laboratorio, diagnóstico y garantías de reparación.
*   **`/src/data/mockData.ts`**: Reemplazado el set de datos simulados genéricos por datos realistas de plantas industriales de Argentina (Tenaris Siderca, Acindar, Aluar, YPF Química, Toyota, Loma Negra, Arauco) y técnicos altamente cualificados con sus especialidades técnicas respectivas (Variadores de Frecuencia, Servocontroladores, PLC & CNC, etc.).
*   **`/src/App.tsx`**: Adaptados los manejadores de estado central (`handleRegisterCall`, `handleAddAgendaItem`) para que admitan y tipen de forma segura los nuevos tipos industriales y campos del modelo de dominio.

### Verificación
*   Verificado que el linter (`npm run lint` / `tsc --noEmit`) no arroje ningún error.
*   Compilación del proyecto finalizada con éxito (`npm run build`).

---

## [Fase 3: Refactorización del Sidebar y Topbar (Navegación)] — 2026-08-03

### Modificado
*   **`/src/components/Sidebar.tsx`**: Refactorizado por completo con una paleta elegante y profesional oscura de alta gama (`bg-zinc-950`), iconografía industrial de precisión (`LayoutDashboard`, `Building2`, `Wrench`, `Calendar`, `History`, `BarChart2`), marcas corporativas oficiales de RAC Ingeniería con subtítulo "ERP de Laboratorio" y selectores de técnicos.
*   **`/src/components/Topbar.tsx`**: Actualizado con títulos de vistas técnicos e industriales ("Dashboard Operativo", "Clientes Industriales", "Recepción y Órdenes de Trabajo (OT)", "Agenda Técnica de Laboratorio", "Bitácora Operativa", "Reportes, KPIs y Estadísticas") y un estado del técnico activo adecuado ("Disponible", "En Laboratorio", "En Planta").

### Verificación
*   Linter superado exitosamente con cero advertencias y errores.
*   Compilación de Vite y TypeScript finalizada satisfactoriamente.

---

## [Fase 4: Módulo de Clientes Industriales & Equipos] — 2026-08-03

### Agregado
*   **Gestión Integral de Equipos**: Añadida la capacidad de registrar, editar y dar de baja equipos activos vinculados a plantas industriales de clientes.
*   **Pestañas Interactivas en la Ficha del Cliente (`CustomerDetailDrawer`)**: Convertida la vista lateral en una ficha técnica con tres pestañas:
    1.  **Equipos en Planta**: Listado con detalles técnicos (fabricante, modelo, número de serie, potencia, tensión, estado) y formularios integrales e inline para registrar nuevos activos y modificar los existentes.
    2.  **Historial OTs**: Panel de control con métricas rápidas (OTs Totales, En Taller, Finalizadas) y una bitácora detallada de cada orden de trabajo con descripciones técnicas detalladas, fallas diagnosticadas e interfaz de reproducción de notas de voz de laboratorio.
    3.  **Ficha & Notas**: Detalles de contacto industrial (CUIT, Planta, Rubro Industrial), selector de técnico responsable y bitácora interactiva de notas.

### Modificado
*   **`/src/pages/CustomersView.tsx`**: Actualizadas las tarjetas KPI con métricas industriales avanzadas: Clientes Industriales, Cuentas Activas, Cuentas Inactivas, y Equipos Totales Registrados en Base.
*   **`/src/components/CustomerTable.tsx`**: Añadidas columnas detalladas para Razón Social con CUIT, Ubicación de la Planta de Producción, y Rubro Industrial. Mejorado el buscador reactivo para filtrar de inmediato por CUIT, Planta, o Industria.
*   **`/src/components/StatusBadge.tsx`**: Ampliado para soportar todos los estados del ciclo de vida técnico de un equipo y OT (`Recepcionado`, `En diagnóstico`, `Esperando aprobación`, `En reparación`, `Esperando repuestos`, `En prueba`, `Finalizado`, `Entregado`) e industrial (`Activo`, `Inactivo`).
*   **`/src/App.tsx`**: Inicializado el estado mutable para `equipments` a partir de las semillas estables de `mockData` y programados los handlers para añadir, actualizar y borrar equipos de la base, con logueo dinámico en la bitácora operativa de la empresa.

### Verificación
*   Linter (`npm run lint` / `tsc --noEmit`) verificado con éxito, arrojando cero errores.
*   Compilación total de producción finalizada con éxito (`npm run build`).

---

## [Fase: Integración de Marca Corporativa y PWA] — 2026-08-03

### Agregado
*   **`/public/manifest.json`**: Creado el manifiesto de la aplicación web progresiva (PWA) optimizado para tablets de taller de RAC Ingeniería, especificando colores de marca, comportamiento standalone, categoría de productividad, y enlaces a los íconos adaptables de alta fidelidad.
*   **`/public/favicon.png`**, **`/public/icon-192.png`**, **`/public/icon-512.png`**: Agregados los íconos de marca generados por IA a partir de las pautas de color industriales del sistema de diseño (Navy profundo e instrumentación geométrica).

### Modificado
*   **`/index.html`**: Actualizado completamente el bloque `<head>` para admitir metadatos de optimización de motores de búsqueda (SEO) técnicos en español, etiquetas Open Graph para Facebook y Slack, Twitter Cards enriquecidas con la imagen de marca, soporte de PWA móvil, favicon local de alta resolución, y optimización de precarga de fuentes web (`IBM Plex Sans` y `Plus Jakarta Sans`).

### Verificación
*   Linter (`npm run lint` / `tsc --noEmit`) verificado con éxito, arrojando cero errores.
*   Compilación de producción finalizada exitosamente (`npm run build`).



