import { Customer, CustomerStatus, Operator, CallLog, Equipment, AgendaItem, TimelineEvent, StockItem, PurchaseOrder, WarrantyItem } from '../types';

// Deterministic seed generator to keep data consistent across renders
function seededRandom(seed: number) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

const random = seededRandom(55); // Stable seed

const INDUSTRIAL_CLIENT_DATA = [
  {
    razonSocial: 'Tenaris Siderca S.A.',
    cuit: '30-50269382-9',
    planta: 'Planta Campana, Sector Laminación',
    industria: 'Siderúrgica' as const,
    contactoNombre: 'Ing. Gustavo Peralta',
    email: 'gperalta@tenaris.com',
    phone: '+54 3489 49-1200',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    notes: [
      'Prioridad Crítica en paradas de línea del tren de laminación.',
      'Requiere informes en PDF de ensayos térmicos y curvas de corriente.'
    ]
  },
  {
    razonSocial: 'Aluar S.A.I.C.',
    cuit: '30-50034291-5',
    planta: 'Planta Puerto Madryn, Sector Electrólisis',
    industria: 'Metalúrgica' as const,
    contactoNombre: 'Ing. Alejandro Soria',
    email: 'asoria@aluar.com.ar',
    phone: '+54 280 445-9000',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120',
    notes: [
      'Equipos expuestos a campos magnéticos extremos e inducidos.',
      'Control riguroso de capacitores por altas temperaturas ambiente.'
    ]
  },
  {
    razonSocial: 'Acindar Industria Argentina',
    cuit: '30-50012845-2',
    planta: 'Planta Villa Constitución, Sector Trefilado',
    industria: 'Siderúrgica' as const,
    contactoNombre: 'Téc. Fernando Ruiz',
    email: 'fruiz@acindar.com.ar',
    phone: '+54 3400 47-8100',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    notes: [
      'Mantenimiento programado anual en la parada de Julio-Agosto.',
      'Enviar presupuestos con copia a compras.mantenimiento@acindar.com'
    ]
  },
  {
    razonSocial: 'YPF Química',
    cuit: '30-54668924-3',
    planta: 'Complejo Industrial Ensenada',
    industria: 'Química' as const,
    contactoNombre: 'Ing. Carlos Maldonado',
    email: 'cmaldonado@ypf.com',
    phone: '+54 221 429-8000',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
    notes: [
      'Protocolos ATEX (atmósferas explosivas) obligatorios para técnicos.',
      'Variadores de frecuencia con barniz dieléctrico extra contra vapores ácidos.'
    ]
  },
  {
    razonSocial: 'Cervecería y Maltería Quilmes',
    cuit: '30-45238914-1',
    planta: 'Planta Quilmes, Sector Embotellado',
    industria: 'Alimenticia' as const,
    contactoNombre: 'Dra. María Laura Vega',
    email: 'mlvega@quilmes.com.ar',
    phone: '+54 11 4349-1500',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    notes: [
      'Equipos de lavado de botellas con alta exposición a humedad.',
      'El laboratorio debe certificar sellado IP65 tras el reensamblaje.'
    ]
  },
  {
    razonSocial: 'Toyota Argentina S.A.',
    cuit: '30-68932456-8',
    planta: 'Planta Zárate, Sector Soldadura Robotizada',
    industria: 'Automotriz' as const,
    contactoNombre: 'Ing. Kenji Takahashi',
    email: 'ktakahashi@toyota.com.ar',
    phone: '+54 3487 48-2000',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
    notes: [
      'Servocontroles de precisión Fanuc y Yaskawa dominan el sector.',
      'Plazos de reparación sumamente estrictos (Just-in-Time).'
    ]
  },
  {
    razonSocial: 'Loma Negra S.A.',
    cuit: '30-50014798-2',
    planta: 'Planta L\'Amalí, Olavarría',
    industria: 'Cemento' as const,
    contactoNombre: 'Téc. Hugo Peralta',
    email: 'hperalta@lomanegra.com.ar',
    phone: '+54 2284 49-3000',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120',
    notes: [
      'Polvillo abrasivo extremo en gabinete. Limpieza neumática profunda mandatoria.',
      'Revisar rodamientos de coolers y forzadores de variadores.'
    ]
  },
  {
    razonSocial: 'Arauco Argentina',
    cuit: '30-60458921-1',
    planta: 'Planta Celulosa Puerto Esperanza',
    industria: 'Papelera' as const,
    contactoNombre: 'Ing. Valeria Ortiz',
    email: 'vortiz@arauco.com',
    phone: '+54 3757 48-0200',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    notes: [
      'Monitoreo remoto de horas de uso de equipos reparados.',
      'Hacer hincapié en el recubrimiento de laca tropicalizada en PCBs.'
    ]
  }
];

// 1. Generate Operators (Industrial Lab Technicians)
export const OPERATORS: Operator[] = [
  { id: 'O-1', name: 'Ing. Lucas Peralta', role: 'Supervisor de Laboratorio', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120', callsCount: 6, resolvedCases: 145, specialty: 'PLC & CNC', availability: 'En Laboratorio' },
  { id: 'O-2', name: 'Téc. Marina Soria', role: 'Especialista en Potencia', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120', callsCount: 5, resolvedCases: 121, specialty: 'Variadores de Frecuencia', availability: 'En Laboratorio' },
  { id: 'O-3', name: 'Téc. Nicolás Gómez', role: 'Especialista en Servos', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120', callsCount: 4, resolvedCases: 198, specialty: 'Servomotores', availability: 'En Laboratorio' },
  { id: 'O-4', name: 'Ing. Damián Rosales', role: 'Control Numérico Senior', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120', callsCount: 3, resolvedCases: 74, specialty: 'PLC & CNC', availability: 'En Planta' },
  { id: 'O-5', name: 'Téc. Ariel Fernández', role: 'Electrónico de Laboratorio', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120', callsCount: 2, resolvedCases: 160, specialty: 'Fuentes & HMIs', availability: 'Disponible' },
  { id: 'O-6', name: 'Téc. Valeria Ortiz', role: 'Calibración & Ensayos', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120', callsCount: 1, resolvedCases: 215, specialty: 'Instrumentación', availability: 'Disponible' }
];

// Helper to get random item
function getRandomItem<T>(list: T[]): T {
  const index = Math.floor(random() * list.length);
  return list[index];
}

// 2. Generate 15 Industrial Customers (Expanding the dataset logically)
export const CUSTOMERS: Customer[] = Array.from({ length: 15 }).map((_, idx) => {
  const id = `C-${idx + 1}`;
  const baseClient = INDUSTRIAL_CLIENT_DATA[idx % INDUSTRIAL_CLIENT_DATA.length];
  
  // Create deterministic variations
  const postfixes = ['', ' S.A.', ' de Argentina', ' Group', ' SRL', ' Industrial', ' S.A.C.I.'];
  const pStr = postfixes[idx % postfixes.length];
  const rSocial = idx < INDUSTRIAL_CLIENT_DATA.length 
    ? baseClient.razonSocial 
    : `${baseClient.razonSocial.split(' ')[0]}${pStr}`;
  
  // Deterministic CUIT
  const cuitStart = 30;
  const cuitMid = Math.floor(50000000 + (idx * 133719) % 40000000);
  const cuitEnd = idx % 10;
  const cuit = `${cuitStart}-${cuitMid}-${cuitEnd}`;

  // Unique email and contacts
  const emailUser = rSocial.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10);
  const email = `mantenimiento@${emailUser}.com.ar`;

  const assignedOperator = OPERATORS[idx % OPERATORS.length];

  return {
    id,
    name: rSocial,
    razonSocial: rSocial,
    company: rSocial,
    cuit,
    email,
    phone: baseClient.phone,
    planta: baseClient.planta.replace('Sector', `Módulo ${idx + 1} - Sector`),
    industria: baseClient.industria,
    status: (idx % 8 === 0 ? 'Inactivo' : 'Activo') as CustomerStatus,
    lastContact: '2026-08-03',
    avatar: baseClient.avatar,
    assignedTo: assignedOperator.name,
    notes: [
      ...baseClient.notes,
      `Recepción de equipos asignada prioritariamente a ${assignedOperator.name}`
    ]
  };
});

// 3. Generate Industrial Equipments
export const EQUIPMENTS: Equipment[] = [
  { id: 'EQ-1001', clientId: 'C-1', clientName: 'Tenaris Siderca S.A.', fabricante: 'Siemens', modelo: 'Sinamics S120 Power Module', nroSerie: 'SN-6SL3120-1TE21-0AA4', categoria: 'Variador de Frecuencia', potencia: '45 kW', tension: '380V Trifásico', status: 'En Laboratorio', observaciones: 'Ingresó con falla F030025 (Cortocircuito en IGBT de fase U).' },
  { id: 'EQ-1002', clientId: 'C-1', clientName: 'Tenaris Siderca S.A.', fabricante: 'Fanuc', modelo: 'Servo Amplifier Module Unit', nroSerie: 'SN-A06B-6117-H105', categoria: 'Servocontrolador', potencia: '15 HP', tension: '220V Trifásico', status: 'Operativo', observaciones: 'Filtros y relé de bypass de precarga reemplazados satisfactoriamente.' },
  { id: 'EQ-1003', clientId: 'C-2', clientName: 'Aluar S.A.I.C.', fabricante: 'ABB', modelo: 'ACS880 Industrial Drive', nroSerie: 'SN-3AXD5000001', categoria: 'Variador de Frecuencia', potencia: '110 kW', tension: '500V Trifásico', status: 'En Laboratorio', observaciones: 'Alarma de sobretemperatura recurrente. Suciedad crítica por electrólisis.' },
  { id: 'EQ-1004', clientId: 'C-3', clientName: 'Acindar Industria Argentina', fabricante: 'Schneider Electric', modelo: 'Altivar Process ATV930', nroSerie: 'SN-ATV930D30N4', categoria: 'Variador de Frecuencia', potencia: '30 kW', tension: '380V Trifásico', status: 'Falla Reportada', observaciones: 'Error de bus de continua bajo carga extrema. Sospecha de tiristor dañado.' },
  { id: 'EQ-1005', clientId: 'C-4', clientName: 'YPF Química', fabricante: 'Siemens', modelo: 'Simatic S7-1500 CPU 1516-3', nroSerie: 'SN-6ES7516-3AN01-0AB0', categoria: 'PLC', potencia: '24VCC', tension: '24VCC', status: 'Operativo', observaciones: 'Falla de firmware y puerto Ethernet quemado. Se reemplazó transceptor.' },
  { id: 'EQ-1006', clientId: 'C-6', clientName: 'Toyota Argentina S.A.', fabricante: 'Yaskawa', modelo: 'Servopack Sigma-7', nroSerie: 'SN-SGD7S-100A00A', categoria: 'Servocontrolador', potencia: '1.5 kW', tension: '220V Trifásico', status: 'En Laboratorio', observaciones: 'Error de feedback del encoder (A.C90). El controlador no lee pulso.' },
  { id: 'EQ-1007', clientId: 'C-6', clientName: 'Toyota Argentina S.A.', fabricante: 'Fanuc', modelo: 'CNC Series 21i-MB Panel', nroSerie: 'SN-A02B-0283-B502', categoria: 'Control Numérico (CNC)', potencia: '24VCC', tension: '24VCC', status: 'En Laboratorio', observaciones: 'Pantalla retroiluminada muerta y teclado de membrana no responde.' },
  { id: 'EQ-1008', clientId: 'C-7', clientName: 'Loma Negra S.A.', fabricante: 'Kepco', modelo: 'Linear Industrial Power Supply', nroSerie: 'SN-ATE55-10M', categoria: 'Fuente Industrial', potencia: '500W', tension: '220V Monofásico', status: 'Operativo', observaciones: 'Se reemplazó electrolíticos de filtrado primario y diodo zener.' }
];

// Helper to find equipment details
export function getEquipmentById(id: string): Equipment | undefined {
  return EQUIPMENTS.find(e => e.id === id);
}

// 4. Generate Work Orders / CallLogs (OTs)
export const CALL_LOGS: CallLog[] = [
  {
    id: 'OT-2026-101',
    customerId: 'C-1',
    customerName: 'Tenaris Siderca S.A.',
    operatorId: 'O-2',
    operatorName: 'Téc. Marina Soria',
    date: '2026-08-01',
    time: '09:30',
    motive: 'Variador de Frecuencia',
    outcome: 'En reparación',
    observations: 'El cliente reporta que el variador Siemens de 45kW detuvo el motor con alarma de sobrecorriente. Ingresa desarmado para diagnóstico electrónico de potencia.',
    followUpDate: '2026-08-07',
    equipmentId: 'EQ-1001',
    equipmentName: 'Siemens Sinamics S120 Power Module',
    prioridad: 'Crítica',
    fallaEncontrada: 'Módulo de potencia IGBT quemado en fase U (Infineon FP100R12). Secciones del circuito driver de compuerta (gate driver resistors y diodos de protección) destruidos.',
    costoMateriales: 450,
    costoManoObra: 600,
    plazoEntregaDias: 5,
    horasTrabajadas: 8,
    repuestosUtilizados: [
      { id: 'R-1', codigo: 'IGBT-FP100R12', descripcion: 'Módulo IGBT Infineon 1200V 100A', cantidad: 1 },
      { id: 'R-3', codigo: 'RES-COMP-GATE', descripcion: 'Conjunto resistencias metalfilm gate', cantidad: 4 }
    ],
    tareasRealizadas: [
      'Desmontaje de placa controladora principal.',
      'Desoldadura del módulo IGBT quemado usando estación infrarroja.',
      'Limpieza química por ultrasonido de la placa controladora y zona de potencia.',
      'Reemplazo de resistencias de gate desvalorizadas.'
    ]
  },
  {
    id: 'OT-2026-102',
    customerId: 'C-1',
    customerName: 'Tenaris Siderca S.A.',
    operatorId: 'O-3',
    operatorName: 'Téc. Nicolás Gómez',
    date: '2026-08-02',
    time: '11:15',
    motive: 'Servocontrolador',
    outcome: 'Finalizado',
    observations: 'Controlador de servomotor Fanuc ingresa con falla de cortocircuito a tierra intermitente.',
    followUpDate: '2026-08-05',
    equipmentId: 'EQ-1002',
    equipmentName: 'Fanuc Servo Amplifier Module Unit',
    prioridad: 'Alta',
    fallaEncontrada: 'Fuga dieléctrica en los varistores de entrada por transitorio de red. Condensadores desvalorizados en el circuito de control.',
    costoMateriales: 120,
    costoManoObra: 400,
    plazoEntregaDias: 3,
    horasTrabajadas: 6,
    repuestosUtilizados: [
      { id: 'R-2', codigo: 'CAP-EPCOS-470', descripcion: 'Capacitores electrolíticos Epcos 470uF', cantidad: 3 },
      { id: 'R-4', codigo: 'VAR-MOV-275', descripcion: 'Varistor Epcos 275V AC', cantidad: 3 }
    ],
    tareasRealizadas: [
      'Reemplazo de varistores de entrada de red.',
      'Recambio de capacitores electrolíticos de etapa de bypass.',
      'Pruebas estáticas con multímetro de aislamiento.',
      'Ensayo dinámico sin carga en motor patrón de laboratorio.'
    ],
    fechaEntrega: '2026-08-03',
    garantiaMeses: 6,
    nroRemito: 'R-0004-9231'
  },
  {
    id: 'OT-2026-103',
    customerId: 'C-2',
    customerName: 'Aluar S.A.I.C.',
    operatorId: 'O-2',
    operatorName: 'Téc. Marina Soria',
    date: '2026-08-03',
    time: '08:45',
    motive: 'Variador de Frecuencia',
    outcome: 'En diagnóstico',
    observations: 'Variador ABB ACS880 de alta potencia retirado de la celda de electrólisis por fallas térmicas y de disparo errático.',
    followUpDate: '2026-08-08',
    equipmentId: 'EQ-1003',
    equipmentName: 'ABB ACS880 Industrial Drive',
    prioridad: 'Crítica',
    fallaEncontrada: 'En revisión de osciloscopio en gate drivers.',
    horasTrabajadas: 2
  },
  {
    id: 'OT-2026-104',
    customerId: 'C-3',
    customerName: 'Acindar Industria Argentina',
    operatorId: 'O-2',
    operatorName: 'Téc. Marina Soria',
    date: '2026-07-28',
    time: '14:20',
    motive: 'Variador de Frecuencia',
    outcome: 'Esperando repuestos',
    observations: 'El variador Altivar ATV930 de 30kW no enciende el bus de continua. Se detecta daño por arco eléctrico.',
    followUpDate: '2026-08-12',
    equipmentId: 'EQ-1004',
    equipmentName: 'Schneider Electric Altivar ATV930',
    prioridad: 'Media',
    fallaEncontrada: 'Puente tiristorizado de entrada Semikron destruido. Requiere repuesto de importación directa de distribuidor oficial.',
    costoMateriales: 380,
    costoManoObra: 450,
    plazoEntregaDias: 15,
    horasTrabajadas: 3,
    repuestosUtilizados: []
  },
  {
    id: 'OT-2026-105',
    customerId: 'C-4',
    customerName: 'YPF Química',
    operatorId: 'O-1',
    operatorName: 'Ing. Lucas Peralta',
    date: '2026-07-30',
    time: '10:00',
    motive: 'PLC',
    outcome: 'Entregado',
    observations: 'PLC S7-1500 presentaba desconexión aleatoria del bus Profinet. El puerto físico se observaba sulfatado.',
    followUpDate: '2026-08-02',
    equipmentId: 'EQ-1005',
    equipmentName: 'Simatic S7-1500 CPU 1516-3',
    prioridad: 'Alta',
    fallaEncontrada: 'Transceptor físico Ethernet quemado por descarga estática de red. Conectores sulfatados.',
    costoMateriales: 85,
    costoManoObra: 250,
    plazoEntregaDias: 2,
    horasTrabajadas: 4,
    repuestosUtilizados: [
      { id: 'R-5', codigo: 'PHY-ETHER-100', descripcion: 'Chip Transceptor Ethernet Realtek Industrial', cantidad: 1 }
    ],
    tareasRealizadas: [
      'Desmontaje de la placa SMD de comunicación.',
      'Sustitución de chip de capa física Ethernet.',
      'Limpieza de contactos con alcohol isopropílico.',
      'Ensayo continuo de comunicación ping por 24hs.'
    ],
    fechaEntrega: '2026-08-02',
    garantiaMeses: 6,
    nroRemito: 'R-0004-9215'
  },
  {
    id: 'OT-2026-106',
    customerId: 'C-6',
    customerName: 'Toyota Argentina S.A.',
    operatorId: 'O-3',
    operatorName: 'Téc. Nicolás Gómez',
    date: '2026-08-03',
    time: '12:00',
    motive: 'Servocontrolador',
    outcome: 'En prueba',
    observations: 'Servopack Yaskawa de 1.5kW reportaba error de encoder. Ingresó junto con el cableado de retroalimentación.',
    followUpDate: '2026-08-06',
    equipmentId: 'EQ-1006',
    equipmentName: 'Servopack Sigma-7',
    prioridad: 'Crítica',
    fallaEncontrada: 'Optoacopladores de recepción de señal diferencial degradados por picos de tensión.',
    costoMateriales: 65,
    costoManoObra: 350,
    plazoEntregaDias: 4,
    horasTrabajadas: 5,
    repuestosUtilizados: [
      { id: 'R-6', codigo: 'OPTO-HP-6N137', descripcion: 'Optoacoplador de alta velocidad 6N137', cantidad: 2 }
    ],
    tareasRealizadas: [
      'Diagnóstico dinámico en banco con osciloscopio digital.',
      'Recambio de optoacopladores lógicos.',
      'Re-soldadura de pines del conector CN2 (encoder).',
      'Puesta en marcha en mesa de ensayo con carga simulada.'
    ]
  },
  {
    id: 'OT-2026-107',
    customerId: 'C-6',
    customerName: 'Toyota Argentina S.A.',
    operatorId: 'O-5',
    operatorName: 'Téc. Ariel Fernández',
    date: '2026-08-03',
    time: '15:20',
    motive: 'Control Numérico (CNC)',
    outcome: 'Esperando aprobación',
    observations: 'Consola CNC con pantalla LCD inoperativa. El teclado de membrana del panel frontal no ejecuta comandos.',
    followUpDate: '2026-08-10',
    equipmentId: 'EQ-1007',
    equipmentName: 'CNC Series 21i-MB Panel',
    prioridad: 'Alta',
    fallaEncontrada: 'Inversor CC-CA de retroiluminación quemado. Membrana del teclado cortada en el flex de acople.',
    costoMateriales: 210,
    costoManoObra: 300,
    plazoEntregaDias: 7,
    horasTrabajadas: 2,
    repuestosUtilizados: []
  }
];

// 5. Generate Agenda Items
export const AGENDA_ITEMS: AgendaItem[] = [
  { id: 'A-1', title: 'Diagnóstico de osciloscopio en variador ABB', customerName: 'Aluar S.A.I.C.', date: '2026-08-04', time: '10:00', completed: false, priority: 'Alta', otId: 'OT-2026-103', tecnicoName: 'Téc. Marina Soria', type: 'Diagnóstico' },
  { id: 'A-2', title: 'Prueba dinámica con carga de Servopack', customerName: 'Toyota Argentina S.A.', date: '2026-08-04', time: '11:30', completed: false, priority: 'Crítica', otId: 'OT-2026-106', tecnicoName: 'Téc. Nicolás Gómez', type: 'Prueba Dinámica' },
  { id: 'A-3', title: 'Revisión técnica de presupuesto de consola CNC', customerName: 'Toyota Argentina S.A.', date: '2026-08-04', time: '15:15', completed: false, priority: 'Media', otId: 'OT-2026-107', tecnicoName: 'Téc. Ariel Fernández', type: 'Reparación' },
  { id: 'A-4', title: 'Visita de planta por parada de trefiladora', customerName: 'Acindar Industria Argentina', date: '2026-08-05', time: '09:00', completed: false, priority: 'Crítica', tecnicoName: 'Ing. Damián Rosales', type: 'Visita de Planta' },
  { id: 'A-5', title: 'Ensayo térmico y de fugas a fuente Kepco', customerName: 'Loma Negra S.A.', date: '2026-08-05', time: '14:00', completed: false, priority: 'Baja', otId: 'OT-2026-108', tecnicoName: 'Téc. Valeria Ortiz', type: 'Calibración' },
  { id: 'A-6', title: 'Coordinar despacho y remito de PLC entregado', customerName: 'YPF Química', date: '2026-08-03', time: '16:30', completed: true, priority: 'Alta', otId: 'OT-2026-105', tecnicoName: 'Ing. Lucas Peralta', type: 'Logística' }
];

// 6. Generate Timeline Events (Technical Audit Logs)
export const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: 'T-1', date: '2026-08-03', time: '16:45', customerName: 'YPF Química', operatorName: 'Ing. Lucas Peralta', type: 'warranty', message: 'Garantía Emitida con éxito', description: 'Se activó la garantía de 6 meses sobre el PLC S7-1500 (OT-2026-105) tras ser entregado al sector logístico del cliente.' },
  { id: 'T-2', date: '2026-08-03', time: '15:30', customerName: 'Toyota Argentina S.A.', operatorName: 'Téc. Ariel Fernández', type: 'diagnostic', message: 'Diagnóstico Completado', description: 'Consola CNC (OT-2026-107) diagnosticada. Se cargó presupuesto detallado de repuestos de retroiluminación e teclado.' },
  { id: 'T-3', date: '2026-08-03', time: '12:15', customerName: 'Toyota Argentina S.A.', operatorName: 'Téc. Nicolás Gómez', type: 'repair', message: 'Iniciada etapa de En Prueba', description: 'El Servopack Yaskawa (OT-2026-106) fue reparado del circuito encoder y montado en el banco dinámico de ensayo.' },
  { id: 'T-4', date: '2026-08-03', time: '08:45', customerName: 'Aluar S.A.I.C.', operatorName: 'Téc. Marina Soria', type: 'status_change', message: 'OT Recepcionada en Taller', description: 'Variador de frecuencia ABB ACS880 de 110kW ingresado físicamente en el Laboratorio 2. Generada OT-2026-103.' },
  { id: 'T-5', date: '2026-08-02', time: '17:00', customerName: 'Tenaris Siderca S.A.', operatorName: 'Téc. Nicolás Gómez', type: 'status_change', message: 'Equipo Entregado y Cerrado', description: 'Se retiró el Servoamplificador Fanuc (OT-2026-102) con remito firmado R-0004-9231.' },
  { id: 'T-6', date: '2026-07-28', time: '11:00', customerName: 'Acindar Industria Argentina', operatorName: 'Téc. Marina Soria', type: 'stock', message: 'Repuesto Solicitado a Importación', description: 'Puente Semikron tiristorizado faltante en stock. Vinculado a la Orden de Compra internacional OC-2026-904.' }
];

// 7. Stock Items (Semiconductors & Electronic Components)
export const STOCK_ITEMS: StockItem[] = [
  { id: 'R-1', codigo: 'IGBT-FP100R12', descripcion: 'Módulo de Potencia IGBT Infineon 1200V 100A (FP100R12KT4)', fabricante: 'Infineon Technologies', cantidad: 8, stockMinimo: 2, ubicacion: 'Cajón A-12, Estantería Potencia', proveedor: 'Mouser Electronics', precioUnitario: 145 },
  { id: 'R-2', codigo: 'CAP-EPCOS-470', descripcion: 'Capacitor Electrolítico Radial 470uF 450V 105C', fabricante: 'EPCOS / TDK', cantidad: 35, stockMinimo: 10, ubicacion: 'Cajón B-04, Estantería Pasivos', proveedor: 'DigiKey Electronics', precioUnitario: 8.5 },
  { id: 'R-3', codigo: 'RES-COMP-GATE', descripcion: 'Resistencia Metal Film 10 Ohms 1W 1% precisión', fabricante: 'Vishay Dale', cantidad: 120, stockMinimo: 20, ubicacion: 'Cajón C-02, Estantería Pasivos', proveedor: 'Mouser Electronics', precioUnitario: 0.25 },
  { id: 'R-4', codigo: 'VAR-MOV-275', descripcion: 'Varistor de Óxido Metálico MOV 275V RMS 14mm', fabricante: 'EPCOS / TDK', cantidad: 48, stockMinimo: 15, ubicacion: 'Cajón B-08, Estantería Protecciones', proveedor: 'Mouser Electronics', precioUnitario: 1.2 },
  { id: 'R-5', codigo: 'PHY-ETHER-100', descripcion: 'Transceptor PHY Ethernet Industrial 10/100 Mbps', fabricante: 'Texas Instruments', cantidad: 4, stockMinimo: 2, ubicacion: 'Cajón D-01, Estantería Integrados', proveedor: 'DigiKey Electronics', precioUnitario: 4.8 },
  { id: 'R-6', codigo: 'OPTO-HP-6N137', descripcion: 'Optoacoplador lógico de alta velocidad 10MBd', fabricante: 'Broadcom', cantidad: 18, stockMinimo: 5, ubicacion: 'Cajón D-03, Estantería Acopladores', proveedor: 'Mouser Electronics', precioUnitario: 1.9 }
];

// 8. Purchase Orders (Aprovisionamiento de Repuestos de Importación)
export const PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'OC-2026-904',
    proveedor: 'Mouser Electronics (USA)',
    fechaPedido: '2026-07-28',
    fechaRecepcionEstimada: '2026-08-15',
    estado: 'En Aduana',
    items: [
      { codigo: 'IGBT-FP100R12', descripcion: 'Módulo de Potencia IGBT Infineon 1200V 100A', cantidad: 5, precioUnitario: 145 },
      { codigo: 'OPTO-HP-6N137', descripcion: 'Optoacoplador lógico de alta velocidad 10MBd', cantidad: 10, precioUnitario: 1.9 }
    ]
  },
  {
    id: 'OC-2026-905',
    proveedor: 'DigiKey Corp (USA)',
    fechaPedido: '2026-08-01',
    fechaRecepcionEstimada: '2026-08-12',
    estado: 'Enviado',
    items: [
      { codigo: 'CAP-EPCOS-470', descripcion: 'Capacitor Electrolítico Radial 470uF 450V', cantidad: 20, precioUnitario: 8.5 }
    ]
  }
];

// 9. Warranties (Control de Reparaciones entregadas con garantía vigente)
export const WARRANTY_ITEMS: WarrantyItem[] = [
  {
    id: 'GAR-1001',
    otId: 'OT-2026-102',
    clientName: 'Tenaris Siderca S.A.',
    equipmentName: 'Fanuc Servo Amplifier Unit',
    fechaInicio: '2026-08-03',
    fechaVencimiento: '2027-02-03',
    estado: 'Vigente',
    observaciones: 'Reparación del circuito de control y protecciones contra picos de red. Garantía estándar de 6 meses.'
  },
  {
    id: 'GAR-1002',
    otId: 'OT-2026-105',
    clientName: 'YPF Química',
    equipmentName: 'Simatic S7-1500 CPU',
    fechaInicio: '2026-08-02',
    fechaVencimiento: '2027-02-02',
    estado: 'Vigente',
    observaciones: 'Reemplazo del puerto físico PHY Ethernet. No cubre daños por descargas atmosféricas directas.'
  },
  {
    id: 'GAR-0994',
    otId: 'OT-2026-094',
    clientName: 'Acindar Industria Argentina',
    equipmentName: 'Yaskawa Spindle Drive 15kW',
    fechaInicio: '2026-03-10',
    fechaVencimiento: '2026-09-10',
    estado: 'Vigente',
    observaciones: 'Reconstrucción completa de pistas quemadas de circuito impreso y capacitores electrolíticos.'
  }
];
