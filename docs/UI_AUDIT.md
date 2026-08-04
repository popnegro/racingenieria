# AUDITORÍA INTEGRAL DE EXPERIENCIA DE USUARIO (UX/UI), ACCESIBILIDAD Y RENDIMIENTO
**Proyecto:** RAC Customer Desk — Consola Técnica de Laboratorio  
**Marca:** RAC Ingeniería  
**Rol Auditor:** Staff Product Designer, UX Architect & Systems Design Specialist  
**Versión de Auditoría:** 1.0.0 (Fase 1: Diagnóstico de Producto)

---

## INTRODUCCIÓN Y CONTEXTO DE MARCA

Para posicionar la consola **RAC Customer Desk** como un referente operativo dentro del sector de mantenimiento y calibración electrónica industrial compleja en Argentina, es mandatorio que el sistema refleje la precisión técnica, robustez y sobriedad que caracterizan a **RAC Ingeniería**. 

Esta auditoría técnica desglosa de manera exhaustiva el estado actual del producto, detectando oportunidades de optimización en base a estándares **SaaS Enterprise** (como los de *Stripe*, *Linear* y *Vercel*) y directrices normativas como **WCAG 2.2 AA**.

---

## 1. BRANDING & IDENTIDAD DE MARCA
### [CRÍTICO] Ausencia de Marca Oficial y Consistencia de Logotipo
*   **Problema:** La aplicación carece de la marca gráfica oficial de RAC Ingeniería. Hay textos planos y logos provisionales de baja resolución o genéricos en el encabezado y en el pie de página. El favicon actual de la aplicación sigue siendo el logotipo por defecto de Vite/React.
*   **Impacto:** Pérdida de credibilidad institucional para clientes corporativos (p. ej., Acindar, YPF, Loma Negra) e ingenieros de planta que auditan reportes de calibración descargados desde el portal. Desconexión visual absoluta con el sitio web oficial (https://racingenieria.com.ar/).
*   **Recomendación:** 
    1. Reemplazar todos los elementos marcarios genéricos por el logotipo oficial de alta fidelidad: `https://racingenieria.com.ar/inicio/wp-content/uploads/2026/05/marca_racTM2.jpg`.
    2. Diseñar un contenedor responsivo para el sidebar con el logotipo en formato isotipo/imagotipo según el estado expandido/colapsado (56px de ancho colapsado / 240px expandido).
    3. Definir un área de protección igual a $1.5 \times$ la altura de la letra principal del logotipo y generar un set completo de recursos estáticos:
        *   `favicon.ico` y `favicon-32x32.png`
        *   `apple-touch-icon.png` (180x180px para iOS)
        *   `og-image.png` (1200x630px para vistas de soporte o links externos)
        *   `manifest.webmanifest` para soporte de PWA nativa en dispositivos de técnicos de campo.
*   **Prioridad:** CRÍTICO

---

## 2. SISTEMA TIPOGRÁFICO
### [ALTO] Inconsistencia en Escala, Pesos e Interlineados
*   **Problema:** Se mezclan múltiples tamaños y pesos tipográficos sin una escala predecible. Algunos textos pequeños sufren de truncamiento ("Real-... / ...time") o interlineados ajustados por defecto, lo que dificulta la lectura rápida de códigos de falla y números de serie en entornos ruidosos o de taller.
*   **Impacto:** Incremento de la fatiga visual de los técnicos de laboratorio que operan la consola durante jornadas de 8 horas, traduciéndose en errores de transcripción en OTs.
*   **Recomendación:** 
    1. Adoptar **Plus Jakarta Sans** (visualización) y **IBM Plex Sans** o **Geist** (para densidades de datos de tabla y consola) como tipografía unificada para todo el sistema, importada de manera local o con pre-carga optimizada.
    2. Implementar una escala tipográfica matemática estricta basada en un multiplicador menor para interfaces densas (Major Second: `1.125` o Minor Third: `1.200`):
        *   `Display XL` (Display): `36px` / `line-height: 1.2` / `font-weight: 800`
        *   `H1`: `24px` / `line-height: 1.3` / `font-weight: 700`
        *   `H2`: `20px` / `line-height: 1.4` / `font-weight: 700`
        *   `H3`: `16px` / `line-height: 1.5` / `font-weight: 600`
        *   `Body`: `14px` (Tamaño base para optimizar densidad de OTs) / `line-height: 1.6` / `font-weight: 400`
        *   `Small/Caption`: `12px` / `line-height: 1.5` / `font-weight: 500` (ideal para badges y etiquetas secundarias).
*   **Prioridad:** ALTO

---

## 3. SISTEMA DE ESPACIADO Y LAYOUT
### [ALTO] Falta de Ritmo Vertical y Cohesión de Bordes Redondeados
*   **Problema:** Existen paddings arbitrarios en las tarjetas de KPIs del Dashboard en comparación con los márgenes del menú lateral. Los contenedores no respetan la regla matemática de anidación de radios (`Radio Interno = Radio Externo - Padding`), lo que provoca que las esquinas se solapen visualmente y luzcan poco profesionales.
*   **Impacto:** El diseño se percibe desorganizado y "barato" (AI Slop), perdiendo el carácter de herramienta industrial de precisión.
*   **Recomendación:**
    1. Configurar una escala estricta de espaciado en múltiplos de 4px: `4px` (xxs), `8px` (xs), `12px` (sm), `16px` (md), `24px` (lg), `32px` (xl).
    2. Asegurar que el relleno interior (padding) de un contenedor sea siempre menor o igual al margen exterior que lo separa de los bordes del layout.
    3. Para tarjetas anidadas con bordes redondeados, forzar el uso de `rounded-2xl` (16px) en el contenedor principal, y `rounded-xl` (12px) o `rounded-lg` (8px) en las tarjetas internas.
*   **Prioridad:** ALTO

---

## 4. PALETA DE COLORES Y CONTRASTE
### [CRÍTICO] Bajo Contraste en Indicadores de Estado y Modos de Color
*   **Problema:** Algunos estados críticos de las OTs o alertas (ej. rojo de alta prioridad o naranja de advertencia) utilizan textos blancos sobre fondos claros con una relación de contraste inferior a `3:1`. El modo oscuro propuesto presenta grises con saturación azulada excesiva que fatiga la vista en condiciones de taller con poca luz natural.
*   **Impacto:** Incumplimiento directo de la pauta WCAG AA (mínimo `4.5:1` para texto normal) y exclusión de operadores con daltonismo, protanopía o fatiga ocular.
*   **Recomendación:**
    1. Reestructurar la paleta de colores utilizando tonos neutros sofisticados con base de pizarra templada (Slate/Zinc) y baja saturación:
        *   `Primary (Azul Técnico)`: `#1e3a8a` (Blue-900 para claro) / `#60a5fa` (Blue-400 para modo oscuro).
        *   `Success (Verde Operativo)`: Textos oscuros sobre badges de fondo verde claro con contraste contrastante (`text-emerald-800` en `bg-emerald-50`).
        *   `Warning (Naranja Taller)`: `#d97706` (Amber-600) / fondos claros contrastados.
        *   `Danger (Rojo Crítico)`: `#dc2626` (Red-600) para bloqueos o fallas de alta criticidad.
    2. No utilizar NUNCA el color de forma exclusiva para codificar un estado. Cada badge o alerta de estado debe acompañarse de un ícono identificador único (ej: check para listo, alerta para peligro, reloj para pendiente).
*   **Prioridad:** CRÍTICO

---

## 5. ICONOGRAFÍA UNIFICADA
### [BAJO] Mezcla de Estilos Visuales de Íconos
*   **Problema:** Se combinan ocasionalmente trazos de diferentes grosores de Lucide con otras librerías de vectores que rompen la homogeneidad visual.
*   **Impacto:** Inconsistencia de diseño sutil pero perceptible por el usuario.
*   **Recomendación:**
    1. Forzar de forma rígida el uso de **Lucide React** como única biblioteca de íconos en el proyecto.
    2. Normalizar los tamaños de íconos en la interfaz técnica:
        *   `14px / 16px`: Íconos de soporte dentro de botones de acción o etiquetas.
        *   `20px`: Íconos en navegación de sidebar o menú superior.
        *   `24px`: Encabezados de módulo o widgets principales.
*   **Prioridad:** BAJO

---

## 6. DASHBOARD TÉCNICO Y KPIS
### [MEDIO] Falta de Datos en Gráficos y Densidad Ineficiente
*   **Problema:** Los gráficos de Recharts actuales en la vista de reportes/analíticas consumen espacio masivo sin aportar desglose técnico aplicable. Hay métricas de conversión comercial genérica en lugar de métricas de taller (ej. tiempo medio de reparación, marcas más reparadas, retrabajo).
*   **Impacto:** El supervisor técnico del laboratorio no logra tomar decisiones rápidas al no tener visibilidad sobre el estado de la cola de calibración de variadores de velocidad y motores.
*   **Recomendación:**
    1. Reemplazar los KPI SaaS genéricos por métricas de taller: "OTs en Espera de Repuestos", "Calibraciones del Día", "Tasa de Retrabajo (Garantías)", "MTTR (Tiempo Medio de Reparación)".
    2. Convertir los gráficos masivos en micro-visualizaciones compactas integradas o bento grids, dejando mayor espacio para el panel de actividad y el listado de reparaciones urgentes.
*   **Prioridad:** MEDIO

---

## 7. SIDEBAR (MENÚ LATERAL)
### [MEDIO] Ineficiencia de Espacio y Comportamiento Responsivo
*   **Problema:** El sidebar ocupa 240px fijos incluso en pantallas pequeñas, reduciendo drásticamente el espacio de trabajo disponible para las tablas y el tablero Kanban de OTs. En vistas móviles colapsa de forma abrupta tapando la barra de navegación.
*   **Impacto:** Reducción de la productividad de los técnicos que operan tablets de taller de 10 pulgadas.
*   **Recomendación:**
    1. Implementar un comportamiento de colapso inteligente suave por hardware (utilizando `translate-x` en lugar de alterar anchos con CSS), reduciéndose de `240px` a `64px` con una transición de `150ms cubic-bezier(0.16, 1, 0.3, 1)`.
    2. Añadir soporte nativo de navegación por teclado en el sidebar: el enfoque secuencial (tecla TAB) debe respetar el orden lógico de arriba a abajo, permitiendo alternar vistas mediante flechas o accesos directos numéricos.
*   **Prioridad:** MEDIO

---

## 8. HEADER & TOPBAR (BARRA SUPERIOR)
### [MEDIO] Indicador de Estado y Perfil Desaprovechados
*   **Problema:** El selector de disponibilidad del técnico ("Disponible", "En Laboratorio", "En Planta") está aislado en un dropdown simple en lugar de estar integrado en el motor de asignación logística de la consola. El buscador global superior no realiza búsquedas reales en el módulo de clientes o marcas de forma unificada.
*   **Impacto:** Carga cognitiva al obligar al técnico a ir de vista en vista para buscar un activo industrial específico o una orden de calibración.
*   **Recomendación:**
    1. Integrar el estado técnico con colores de alta visibilidad (Verde, Amarillo, Azul industrial) reflejando de inmediato la actividad del operador con un indicador de pulso dinámico discreto.
    2. Dotar al buscador global de la funcionalidad "Command Palette" interactiva (activable por teclado mediante `Ctrl+K` o `Cmd+K`), permitiendo buscar clientes, ingresar códigos de OTs y ejecutar acciones rápidas del sistema desde cualquier vista de forma instantánea.
*   **Prioridad:** MEDIO

---

## 9. TABLAS DE CLIENTES Y ACTIVOS
### [MEDIO] Falta de Interactividad y Filtros Rápidos
*   **Problema:** La visualización de activos industriales y clientes se presenta en una tabla con columnas estáticas sin ordenamiento dinámico ni exportación de datos. No hay estados vacíos (*Empty States*) optimizados que indiquen al operador qué hacer si no hay registros activos.
*   **Impacto:** Retrasos en el flujo de trabajo de facturación o entrega de equipos reparados.
*   **Recomendación:**
    1. Implementar ordenamiento por columnas en la tabla de clientes (clic en encabezados de columna) y añadir un filtro instantáneo por fabricante (Siemens, ABB, Schneider) de forma visual.
    2. Diseñar un estado vacío descriptivo con un botón de llamada a la acción ("Crear primer activo") en lugar de mostrar filas vacías o un lienzo en blanco.
*   **Prioridad:** MEDIO

---

## 10. FORMULARIOS Y REGISTRO DE EQUIPOS (OT)
### [ALTO] Validación Débil y Falta de Feedback en Tiempo Real
*   **Problema:** El formulario de ingreso de equipos en `WorkOrderForm` permite enviar campos incompletos o incorrectos (como números de serie vacíos o marcas no registradas) sin feedback explícito en pantalla, lo que genera registros inválidos en el histórico.
*   **Impacto:** Datos erróneos que dañan la integridad de las bases de datos de auditorías de calidad ISO de RAC Ingeniería.
*   **Recomendación:**
    1. Agregar validación visual en tiempo real en cada input: el borde del campo debe tornarse rojo suave (`border-red-400`) y mostrar un micro-texto explicativo de error bajo el campo en caso de falla.
    2. Deshabilitar el botón de envío principal (`disabled={!isValid}`) hasta que todos los campos requeridos estén correctamente diligenciados.
    3. Añadir una barra de progreso visual de completado del formulario para guiar al operador en reparaciones complejas paso a paso.
*   **Prioridad:** ALTO

---

## 11. ACCESIBILIDAD (WCAG 2.2 AA)
### [CRÍTICO] Ausencia de Navegación por Teclado y Focus Trap en Modales
*   **Problema:** Los diálogos flotantes, paneles interactivos y los tooltips del tour del producto no atrapan el foco del teclado (*Focus Trap*). Si un usuario utiliza la tecla `TAB`, el foco navega de manera descontrolada por detrás del modal activo en el fondo de la pantalla.
*   **Impacto:** Barrera infranqueable de accesibilidad que inhabilita el uso del sistema a operadores con limitaciones motrices o de visión.
*   **Recomendación:**
    1. Implementar un envoltorio de accesibilidad o hook de captura de foco (`useFocusTrap`) en todos los diálogos abiertos (WelcomeModal, CompletionScreen, ShortcutsDialog).
    2. Marcar adecuadamente los elementos interactivos con roles semánticos HTML5 (`<main>`, `<nav>`, `<header>`, `<section>`, `aria-expanded`, `aria-selected`, `aria-live="polite"`).
    3. Asegurar que cada elemento interactivo cuente con un anillo de enfoque perfectamente visible en estado hover/focus (`focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none`).
*   **Prioridad:** CRÍTICO

---

## 12. PERFORMANCE Y RENDIMIENTO SENSORIAL
### [MEDIO] Retrasos en Renderizado y Re-renders Innecesarios
*   **Problema:** El orquestador central de la aplicación en `App.tsx` actualiza el estado global de forma masiva en cada pulsación de teclado del buscador global, provocando re-renders continuos de todos los módulos del dashboard, gráficos y calendario.
*   **Impacto:** Micro-tirones y ralentización de respuesta sensorial de la interfaz en terminales de bajo rendimiento del taller.
*   **Recomendación:**
    1. Debouncear las entradas de teclado del buscador global (retardo de `150ms` antes de disparar la búsqueda en el estado).
    2. Memoizar componentes pesados que no necesitan actualizarse ante el cambio de disponibilidad del técnico (como el calendario o los históricos) utilizando `React.memo` o encapsulando su estado local.
*   **Prioridad:** MEDIO

---

## 13. RESPONSIVE Y MULTIPLATAFORMA
### [MEDIO] Desbordamiento de Tablas y Tarjetas en Mobile
*   **Problema:** La tabla de clientes e histórico desborda horizontalmente en anchos de pantalla menores a 768px, forzando un scroll horizontal de toda la ventana en lugar de un comportamiento fluido con scroll local o colapso de columnas.
*   **Impacto:** Inutilidad del sistema en teléfonos móviles de supervisores o técnicos fuera de planta.
*   **Recomendación:**
    1. Aplicar la propiedad `overflow-x-auto` específicamente al contenedor contenedor de la tabla y no al body completo.
    2. En pantallas pequeñas (menores a 640px), colapsar las columnas secundarias de la tabla de OTs y mostrarlas agrupadas en un listado vertical compacto tipo tarjeta (*card stack*).
*   **Prioridad:** MEDIO

---

## 14. COMPROMISO OPERATIVO DE CONVERSION - PRÓXIMAS ACCIONES
Esta auditoría sienta las bases funcionales y visuales para el desarrollo incremental de las siguientes etapas. No se requiere escribir código de lógica de negocio en la etapa actual. El próximo paso consiste en consolidar la especificación técnica en el manual de estilos de sistema de diseño en `/docs/DESIGN_SYSTEM.md`.
