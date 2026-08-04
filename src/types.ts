export type CustomerStatus = 'Abierto' | 'Resuelto' | 'Pendiente' | 'Activo' | 'Inactivo';

export interface Customer {
  id: string;
  name: string; // Razón Social (compatibility name)
  razonSocial: string; // Official industrial name
  company: string; // Company name for backward compatibility
  cuit: string; // Unique tax code (Argentina)
  email: string;
  phone: string;
  planta: string; // Industrial plant location (e.g. Planta Campana, Planta San Nicolás)
  industria: 'Siderúrgica' | 'Alimenticia' | 'Automotriz' | 'Química' | 'Cemento' | 'Energía' | 'Metalúrgica' | 'Papelera';
  status: CustomerStatus;
  lastContact: string; // ISO date format YYYY-MM-DD
  avatar: string;
  assignedTo: string; // Supervising Technician name
  notes: string[];
}

export interface Operator {
  id: string;
  name: string; // Technician name
  role: string; // Technician specialty/position
  avatar: string;
  callsCount: number; // Active OTs assigned
  resolvedCases: number; // Resolved OTs historically
  specialty: 'Servomotores' | 'Variadores de Frecuencia' | 'PLC & CNC' | 'Fuentes & HMIs' | 'Instrumentación';
  availability: 'Disponible' | 'En Laboratorio' | 'En Planta' | 'No Disponible';
}

export type OTEstado = 
  | 'Recepcionado' 
  | 'En diagnóstico' 
  | 'Esperando aprobación' 
  | 'En reparación' 
  | 'Esperando repuestos' 
  | 'En prueba' 
  | 'Finalizado' 
  | 'Entregado';

export interface CallLog {
  id: string; // Work Order ID (OT-XXXX)
  customerId: string;
  customerName: string;
  operatorId: string; // Assigned Technician ID
  operatorName: string; // Assigned Technician Name
  date: string; // YYYY-MM-DD (Reception date)
  time: string; // HH:MM
  motive: string; // Equipment Type / Primary symptom
  outcome: OTEstado; // Work Order State
  observations: string; // Reception observations and details
  followUpDate?: string; // YYYY-MM-DD (Scheduled/target completion date)
  audioUrl?: string; // Object URL or Base64 of diagnostic voice note
  
  // Industrial Repair ERP details
  equipmentId?: string; // Associated equipment ID
  equipmentName?: string; // e.g. "Siemens Sinamics S120"
  prioridad?: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  fallaEncontrada?: string; // Root cause diagnosed
  costoMateriales?: number; // Cost of semiconductor parts
  costoManoObra?: number; // Cost of bench labor
  plazoEntregaDias?: number; // Promised turnaround in business days
  horasTrabajadas?: number; // Actual hours on the bench
  repuestosUtilizados?: Array<{ id: string; codigo: string; descripcion: string; cantidad: number }>;
  tareasRealizadas?: string[]; // Log of lab steps
  fechaEntrega?: string; // Dispatch/delivery date
  garantiaMeses?: number; // Technical warranty period (e.g., 6)
  nroRemito?: string; // Shipping slip number
}

export interface Equipment {
  id: string; // Internal serial ID (e.g., EQ-104)
  clientId: string;
  clientName: string;
  fabricante: string; // e.g. Siemens, ABB, Fanuc, Yaskawa
  modelo: string; // e.g. Sinamics S120, PowerFlex 755
  nroSerie: string; // Original manufacturer serial number
  categoria: 'Variador de Frecuencia' | 'Servocontrolador' | 'PLC' | 'HMI' | 'Fuente Industrial' | 'Control Numérico (CNC)';
  potencia: string; // e.g. 45 kW, 15 HP
  tension: string; // e.g. 380V Trifásico, 24VCC
  status: 'Operativo' | 'En Laboratorio' | 'Falla Reportada';
  observaciones: string;
}

export interface AgendaItem {
  id: string;
  title: string;
  customerName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  completed: boolean;
  priority: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  otId?: string; // Associated OT-ID
  tecnicoName?: string; // Assigned technician name
  type: 'Diagnóstico' | 'Reparación' | 'Prueba Dinámica' | 'Calibración' | 'Logística' | 'Visita de Planta';
}

export interface TimelineEvent {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  customerName: string;
  operatorName: string;
  type: 'call' | 'note' | 'status_change' | 'diagnostic' | 'budget' | 'repair' | 'stock' | 'warranty';
  message: string;
  description: string;
}

export interface StockItem {
  id: string;
  codigo: string; // e.g. IGBT-600V-100A
  descripcion: string;
  fabricante: string;
  cantidad: number;
  stockMinimo: number;
  ubicacion: string; // Drawer/Shelf location
  proveedor: string; // e.g. Mouser, DigiKey
  precioUnitario: number; // in USD or ARS
}

export interface PurchaseOrder {
  id: string; // OC-XXXX
  proveedor: string;
  fechaPedido: string;
  fechaRecepcionEstimada: string;
  estado: 'Enviado' | 'En Aduana' | 'Recibido';
  items: Array<{ codigo: string; descripcion: string; cantidad: number; precioUnitario: number }>;
}

export interface WarrantyItem {
  id: string; // GAR-XXXX
  otId: string;
  clientName: string;
  equipmentName: string;
  fechaInicio: string;
  fechaVencimiento: string;
  estado: 'Vigente' | 'Vencida' | 'Reclamada';
  observaciones: string;
}
