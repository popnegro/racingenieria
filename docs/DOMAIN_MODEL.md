# MODELO DE DOMINIO — RAC Ingeniería ERP Técnico

Este documento define las entidades principales, atributos, tipos y relaciones comerciales que sustentan la plataforma de gestión técnica de **RAC Ingeniería**.

---

## 1. Relaciones de Entidades (Diagrama Conceptual)

```
 [Cliente Industrial] 
         │
         ├──(1:N)──► [Equipo Activo]
         │                 │
         │               (1:N)
         │                 │
         │                 ▼
         └──(1:N)──► [Orden de Trabajo (OT)]
                           │
                           ├──(1:1)──► [Diagnóstico del Laboratorio]
                           │
                           ├──(1:1)──► [Presupuesto Comercial]
                           │
                           ├──(1:1)──► [Reparación (Ficha Técnica)] ◄───(N:M)───► [Stock / Repuestos]
                           │
                           └──(1:1)──► [Garantía Emitida]
```

---

## 2. Definición Detallada de Entidades

### A. Cliente Industrial
Representa a las plantas, fábricas y empresas industriales que contratan servicios de mantenimiento correctivo y preventivo.

*   `id`: `string` (Identificador único, ej. `CLI-001`)
*   `razonSocial`: `string` (ej. *Tenaris Siderca S.A.*)
*   `cuit`: `string` (ej. *30-12345678-9*)
*   `contactoNombre`: `string` (ej. *Ing. Gustavo Peralta*)
*   `contactoEmail`: `string` (ej. *gperalta@tenaris.com*)
*   `contactoTelefono`: `string` (ej. *+54 11 4893-1200*)
*   `planta`: `string` (Ubicación física o parque industrial, ej. *Planta Campana, Sector Laminados*)
*   `industria`: `string` (Siderúrgica, Alimenticia, Automotriz, Química, Cemento, etc.)
*   `status`: `'Activo' | 'Inactivo'`

---

### B. Equipo
Los activos de alta complejidad electrónica que ingresan al laboratorio para servicio.

*   `id`: `string` (Código interno único, ej. `EQ-5023`)
*   `clientId`: `string` (ID del cliente propietario)
*   `fabricante`: `string` (ej. *Siemens, Schneider Electric, Yaskawa, Fanuc*)
*   `modelo`: `string` (ej. *Sinamics S120, Altivar Process ATV930*)
*   `nroSerie`: `string` (ej. *SN-983421-A*)
*   `categoria`: `'Variador de Frecuencia' | 'Servocontrolador' | 'PLC' | 'HMI' | 'Fuente Industrial' | 'Control Numérico (CNC)'`
*   `potencia`: `string` (ej. *45 kW, 15 HP*)
*   `tension`: `string` (ej. *380V Trifásico, 24VCC*)
*   `observaciones`: `string` (Detalles físicos del equipo al ingresar)

---

### C. Orden de Trabajo (OT)
El documento maestro que rige el estado y progreso del servicio de reparación de un equipo.

*   `id`: `string` (Número de Orden único, ej. `OT-2026-104`)
*   `clientId`: `string` (Relación al Cliente)
*   `equipmentId`: `string` (Relación al Equipo)
*   `tecnicoAsignadoId`: `string` (Relación al Técnico en Laboratorio)
*   `fechaIngreso`: `string` (Fecha de recepción en taller YYYY-MM-DD)
*   `prioridad`: `'Baja' | 'Media' | 'Alta' | 'Crítica'`
*   `estado`: `OTEstado`

#### Flujo de Estados (`OTEstado`):
1.  `Recepcionado`: El equipo ingresó y se encuentra en el sector de logística del taller.
2.  `En diagnóstico`: Un técnico especializado evalúa el equipo en mesa de ensayo con osciloscopio y analizadores.
3.  `Esperando aprobación`: El diagnóstico está listo y se envió el presupuesto al cliente para su firma.
4.  `En reparación`: El cliente aprobó el trabajo y el técnico está interviniendo la electrónica.
5.  `Esperando repuestos`: El laboratorio necesita repuestos importados o especiales de stock para avanzar.
6.  `En prueba`: El equipo fue reparado y está en el banco de ensayo dinámico con carga real durante 24hs.
7.  `Finalizado`: Reparación y control de calidad concluidos satisfactoriamente. Listo para despacho.
8.  `Entregado`: Equipo retirado por el cliente o despachado con remito firmado.

---

### D. Diagnóstico del Laboratorio
Detalle técnico redactado por el instrumentista tras analizar el comportamiento físico y lógico del equipo.

*   `otId`: `string` (ID de la OT asociada)
*   `tecnicoId`: `string` (Técnico que realiza la prueba)
*   `fecha`: `string` (YYYY-MM-DD)
*   `fallaEncontrada`: `string` (Falla técnica detectada, ej. *Módulo IGBT quemado en fase U, capacitores electrolíticos desvalorizados*)
*   `checklist`: `string[]` (Lista de verificaciones de control interno)
*   `observaciones`: `string`
*   `fotos`: `string[]` (URLs de capturas térmicas u oscilograma de laboratorio)

---

### E. Presupuesto Comercial
Propuesta de costos formal que se envía al área de compras del cliente industrial.

*   `id`: `string` (ej. `PRE-4523`)
*   `otId`: `string` (OT asociada)
*   `costoMateriales`: `number` (Valor de componentes electrónicos importados)
*   `costoManoObra`: `number` (Costo por horas de laboratorio)
*   `plazoEntregaDias`: `number` (Plazo de entrega estimado en días hábiles)
*   `estado`: `'Pendiente Aprobación' | 'Aprobado' | 'Rechazado'`
*   `fechaEmision`: `string`
*   `ivaAplicable`: `boolean`

---

### F. Reparación (Detalle de Ejecución)
Registro formal de las operaciones electrónicas aplicadas sobre la placa de circuito impreso (PCB).

*   `otId`: `string`
*   `tecnicoAsignadoId`: `string`
*   `horasReales`: `number` (Tiempo de banco invertido)
*   `tareasRealizadas`: `string[]` (ej. *Reemplazo de módulo IGBT, limpieza por ultrasonido, recubrimiento de barniz dieléctrico*)
*   `repuestosUtilizados`: `Array<{ repuestoId: string, cantidad: number }>`
*   `pruebasRealizadas`: `string` (ej. *Ensayo dinámico con motor asincrónico a 1500 RPM con carga resistiva*)

---

### G. Stock (Componentes y Repuestos)
Inventario de semiconductores, transistores, microcontroladores y componentes necesarios para el laboratorio.

*   `id`: `string` (ej. `REP-3012`)
*   `codigo`: `string` (ej. *IGBT-600V-100A-7PIN*)
*   `descripcion`: `string` (ej. *Módulo de potencia IGBT Infineon FP100R12KT4*)
*   `cantidad`: `number`
*   `stockMinimo`: `number` (Alerta automática de stock crítico)
*   `ubicación`: `string` (Gabinete físico en el taller, ej. *Estantería B, Cajonera 4*)
*   `proveedor`: `string` (ej. *Mouser Electronics, DigiKey*)

---

### H. Compras y Ordenes de Compra (OC)
Gestión de aprovisionamiento de repuestos críticos específicos de importación.

*   `id`: `string` (Código de OC, ej. `OC-2026-942`)
*   `proveedor`: `string`
*   `repuestos`: `Array<{ codigo: string, cantidad: number }>`
*   `fechaPedido`: `string`
*   `fechaRecepcionEstimada`: `string`
*   `estado`: `'Enviado' | 'En Aduana' | 'Recibido'`

---

### I. Garantía
Seguimiento temporal del seguro técnico post-reparación obligatorio para RAC Ingeniería (usualmente 6 meses).

*   `id`: `string`
*   `otId`: `string`
*   `fechaInicio`: `string` (Generalmente fecha de entrega del equipo)
*   `fechaVencimiento`: `string` (6 meses posteriores)
*   `estado`: `'Vigente' | 'Vencida' | 'Reclamada'`
*   `observaciones`: `string`
