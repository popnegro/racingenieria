# SISTEMA DE DISEÑO INDUSTRIAL "RAC PRISMA"
**Cliente:** RAC Ingeniería  
**Estilo:** Consola Técnica de Laboratorio & ERP Enterprise  
**Versión:** 1.0.0 (Fase 1: Especificación de Tokens)

---

## FILOSOFÍA DE DISEÑO
El Sistema de Diseño **RAC PRISMA** está estructurado bajo principios de precisión, sobriedad y ergonomía industrial. Evita los degradados vistosos o las curvas exageradas típicas del software comercial SaaS convencional, priorizando la densidad de información, el contraste WCAG AA/AAA y la velocidad de operación táctil y por teclado en laboratorios y plantas de producción de alta demanda.

---

## 1. DESIGN TOKENS (SISTEMA DE TOKENS)

Los tokens de diseño son los átomos de nuestra interfaz. Se especifican a continuación para garantizar la consistencia visual total en toda la aplicación.

### A. Escala de Espaciado (Spacing Scale)
Basada en un sistema modular rítmico de múltiplos de **4px** para mantener la consistencia vertical y horizontal:

| Token | Valor CSS | Uso Recomendado |
| :--- | :--- | :--- |
| `spacing-xxs` | `4px` (`0.25rem`) | Micro-márgenes entre ícono y texto. |
| `spacing-xs` | `8px` (`0.5rem`) | Relleno interior de inputs, botones, celdas de tabla. |
| `spacing-sm` | `12px` (`0.75rem`) | Distancia entre elementos relacionados dentro de una tarjeta. |
| `spacing-md` | `16px` (`1rem`) | Margen estándar entre tarjetas, relleno de contenedores. |
| `spacing-lg` | `24px` (`1.5rem`) | Relleno exterior de módulos y bento-grids principales. |
| `spacing-xl` | `32px` (`2rem`) | Margen de secciones complejas o pantallas en blanco. |
| `spacing-xxl` | `48px` (`3rem`) | Espaciado entre bloques mayores de la página. |

*Fórmula de Relleno:* El padding horizontal de botones de acción y controles interactivos debe ser exactamente el **doble ($2\times$)** del padding vertical para balancear el centro óptico de la tipografía.

---

### B. Sistema Tipográfico (Typography & Scale)
Se adopta **Plus Jakarta Sans** para cabeceras y display de datos estéticos, y **IBM Plex Sans** / **Geist** para celdas, formularios, y bloques de código de falla debido a sus excelentes características de legibilidad en pantallas industriales.

*Escala de Visualización Técnica:*
*   **Display XL (KPI de Taller):** `36px` | `leading-tight` (1.2) | `font-bold` (700) | `letter-spacing: -0.02em`
*   **H1 (Títulos de Módulo):** `24px` | `leading-normal` (1.3) | `font-bold` (700) | `letter-spacing: -0.015em`
*   **H2 (Títulos de Sección):** `20px` | `leading-normal` (1.4) | `font-semibold` (600) | `letter-spacing: -0.01em`
*   **H3 (Títulos de Tarjeta):** `16px` | `leading-relaxed` (1.5) | `font-semibold` (600) | `letter-spacing: -0.01em`
*   **Body (Texto Principal/Inputs):** `14px` | `leading-relaxed` (1.6) | `font-medium/normal` (500/400) | `letter-spacing: 0`
*   **Small (Tablas/Etiquetas):** `12px` | `leading-normal` (1.5) | `font-semibold/medium` (600/500) | `letter-spacing: 0.01em`
*   **Caption (Microdatos/Fechas):** `11px` | `leading-none` (1.3) | `font-bold` (700) | `letter-spacing: 0.02em` (en mayúsculas)

---

### C. Paleta de Colores Corporativa (Color Tokens)
Inspirada en el sector industrial de instrumentación electrónica de alta tensión. Todos los colores garantizan el cumplimiento de contraste de legibilidad WCAG AA.

#### 1. Colores de Identidad (Brand Colors)
*   **Primary (Azul RAC):** `#0f2b5c` (`bg-blue-900`/`text-blue-900`) — Representa precisión técnica, calibración y herencia de ingeniería de RAC.
*   **Secondary (Azul Técnico Claro):** `#1d4ed8` (`bg-blue-700`) — Para estados activos de botones y enlaces destacados.
*   **Brand Accent:** `#e0e7ff` (`bg-indigo-50`) — Fondos de tarjetas seleccionadas.

#### 2. Colores Neutros (Industrial Neutrals)
*   **Neutral Background:** `#f8fafc` (Slate-50) — Fondo general de la consola para evitar el cansancio visual del blanco puro.
*   **Neutral Surface (Tarjetas):** `#ffffff` (White) — Lienzo limpio para módulos de datos.
*   **Neutral Text (Principal):** `#0f172a` (Slate-900) — Máximo contraste para textos informativos.
*   **Neutral Text Muted:** `#475569` (Slate-600) — Etiquetas secundarias, fechas, descripciones secundarias.
*   **Neutral Border:** `#cbd5e1` (Slate-300) — Líneas de separación de tablas y contenedores.

#### 3. Colores Operativos de Estado (Semantic States)
*   **Success (Equipamiento Listo / Entregado):** Background `#f0fdf4` (Emerald-50) | Borde `#bbf7d0` (Emerald-200) | Texto `#166534` (Emerald-800).
*   **Warning (En Diagnóstico / Espera Repuestos):** Background `#fffbeb` (Amber-50) | Borde `#fde68a` (Amber-200) | Texto `#92400e` (Amber-800).
*   **Danger (OT Crítica / Retrabajo / Garantía):** Background `#fef2f2` (Red-50) | Borde `#fecaca` (Red-200) | Texto `#991b1b` (Red-800).
*   **Info (Asignado / En Espera):** Background `#eff6ff` (Blue-50) | Borde `#bfdbfe` (Blue-200) | Texto `#1e40af` (Blue-800).

---

### D. Bordes y Radios (Border Radius & Shadows)
El software industrial demanda estructuras sólidas. Los radios de borde se mantienen sutiles y limpios:

*   **Borde Pequeño (`radius-sm`):** `6px` (`0.375rem`) — Para inputs de formularios, checkboxes y pequeños botones de acción.
*   **Borde Estándar (`radius-md`):** `10px` (`0.625rem`) — Para botones principales, dropdowns y selectores de barra superior.
*   **Borde de Tarjeta (`radius-lg`):** `14px` (`0.875rem`) — Para tarjetas de KPI, módulos del Dashboard y tablas de control.
*   **Borde Mayor (`radius-xl`):** `18px` (`1.125rem`) — Reservado exclusivamente para modales de bienvenida y finalización.

*Regla de Anidación de Radios:* Para evitar la colisión óptica, si un contenedor interno con un padding $P$ de `16px` está anidado dentro de un contenedor externo con un radio de borde de `24px`, el radio del contenedor interno se ajusta exactamente mediante:
$$\text{Radio Interno} = \text{Radio Externo} - P = 24\text{px} - 16\text{px} = 8\text{px}$$

#### Elevación y Sombras (Shadows)
*   `shadow-flat`: `none` / borde de `1px` color Slate-200 (Recomendado para inputs y celdas).
*   `shadow-subtle`: `0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)` (Tarjetas de KPI estándar).
*   `shadow-overlay`: `0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.1)` (Dropdowns y menús de barra superior).
*   `shadow-dialog`: `0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.15)` (Modales centados y tour interactivo).

---

### E. Movimiento y Micro-interacciones (Motion & Transitions)
Las animaciones en el entorno RAC son altamente discretas para optimizar el rendimiento sensorial y el foco operativo:

*   **Transiciones de Cambio de Estado (Hover/Focus):** `duration: 100ms` | `transition-property: color, background-color, border-color` | `ease-out`.
*   **Desplazamiento del Menú Lateral (Sidebar Collapse):** `duration: 150ms` | `cubic-bezier(0.16, 1, 0.3, 1)` (Desaceleración rápida sin rebote).
*   **Modales y Cuadros de Diálogo (Scale In):** `duration: 200ms` | `cubic-bezier(0.34, 1.56, 0.64, 1)` (Pequeño efecto elástico sutil para dar feedback táctil).

*Accesibilidad de Movimiento:* El sistema se acopla al selector de accesibilidad de preferencias locales. En caso de activarse la preferencia de **Movimiento Reducido**, todas las transiciones complejas se deshabilitan instantáneamente (`transition: none`, `transform: none`), limitándose a desvanecimientos simples (*fade*).

---

## 2. ESPECIFICACIÓN DE COMPONENTES BASE

### A. Botones Técnicos (Buttons)
*   **Estructura:** Relleno horizontal $2\times$ el relleno vertical (ej. `py-2 px-4`). El texto sitúa sobre una única línea sin truncamiento.
*   **Hover:** Un paso más oscuro que el color base (ej. `bg-blue-900` pasa a `hover:bg-blue-950`).
*   **Focus:** Anillo exterior bien definido (`focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2`).

### B. Campos de Formulario (Inputs)
*   **Estructura:** Borde completo Slate-200 en estado neutro. Altura del control normalizada a `40px` para facilitar el click con puntero y dedos en pantallas de taller.
*   **Interactividad:** Borde cambia a `border-blue-600` en foco con un sutil anillo de sombra exterior.
*   **Error:** Borde rojo suave `border-red-400` acompañado de un ícono de advertencia de error a la derecha y un texto descriptivo abajo de `11px`.

### C. Tablas de Control Operativo
*   **Estructura:** Encabezado con fondo gris técnico de bajo contraste `#f1f5f9` (Slate-100) y texto seminegrita de 12px.
*   **Filas:** Separadas por un borde Slate-100 con relleno óptimo de `py-3 px-4`. Un efecto hover (`hover:bg-slate-50`) proporciona retroalimentación inmediata sobre qué fila está seleccionando el cursor.
*   **Scroll:** El cuerpo de la tabla soporta scroll horizontal local suave mediante `overflow-x-auto shadow-inner` para que el ancho de la página principal permanezca siempre libre de desbordamientos.

---

## 3. COMPROMISO OPERATIVO DE CALIDAD (FASES DE DESARROLLO)
El sistema de diseño **RAC PRISMA** se implementará de manera secuencial siguiendo un riguroso esquema de control técnico en el que cada etapa se somete a validación de compilación, linter de código, y auditoría de accesibilidad en el portal. No se realizan cambios en la lógica de negocio técnica para asegurar la perfecta continuidad operativa del ERP/CRM.
