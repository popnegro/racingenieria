import { Category, Manufacturer, Equipment } from './types';

export const CATEGORIES: Category[] = [
  { id: 'variadores', name: 'Variadores de frecuencia', description: 'Control de velocidad y torque para motores trifásicos', iconName: 'Gauge' },
  { id: 'arrancadores', name: 'Arrancadores suaves', description: 'Arranque progresivo de motores industriales', iconName: 'Activity' },
  { id: 'temperatura', name: 'Controladores de temperatura', description: 'Reguladores PID para procesos de calor/frío', iconName: 'Thermometer' },
  { id: 'placas-dc', name: 'Placas controladoras de corriente continua', description: 'Control electrónico de motores CC de alta precisión', iconName: 'Cpu' },
  { id: 'cargadores', name: 'Cargadores de baterías', description: 'Sistemas de carga industrial para bancos de baterías', iconName: 'BatteryCharging' },
  { id: 'tetra-pak', name: 'Electrónica de líneas Tetra Pak', description: 'Módulos de automatización y control de envasado', iconName: 'Container' },
  { id: 'tpih', name: 'Equipos TPIH', description: 'Sistemas de calentamiento por inducción industrial', iconName: 'Flame' },
  { id: 'fotocelulas', name: 'Fotocélulas industriales', description: 'Sensores de barrera óptica y reflexión reflexivos', iconName: 'Eye' },
  { id: 'power-supply', name: 'Power Supply', description: 'Fuentes de alimentación conmutadas redundantes', iconName: 'Power' },
  { id: 'reles-nivel', name: 'Relés de nivel', description: 'Controladores conductivos para tanques y depósitos', iconName: 'Layers' },
  { id: 'nordson', name: 'Equipos Nordson', description: 'Sistemas de aplicación de adhesivos hot melt', iconName: 'Wrench' },
  { id: 'control-temp-dig', name: 'Controladores digitales de temperatura', description: 'Termostatos digitales de panel programables', iconName: 'Hash' },
  { id: 'det-explosivos', name: 'Detectores de mezcla explosiva', description: 'Analizadores ATEX para entornos con gases combustibles', iconName: 'ShieldAlert' },
  { id: 'radar-combustible', name: 'Radares de nivel de combustible', description: 'Transmisores de nivel sin contacto de onda guiada', iconName: 'Radio' },
  { id: 'sondas', name: 'Sondas capacitivas', description: 'Medición continua de nivel en polvos y sólidos', iconName: 'TrendingUp' },
  { id: 'paneles-auto', name: 'Paneles automotores', description: 'Cuadros de control centralizados para líneas de montaje', iconName: 'Sliders' },
  { id: 'control-presion', name: 'Controladores de presión', description: 'Presostatos y transductores inteligentes de presión', iconName: 'Compass' },
  { id: 'hmi', name: 'Pantallas HMI', description: 'Interfaces táctiles industriales hombre-máquina', iconName: 'Tv' },
  { id: 'control-peso', name: 'Controladores electrónicos de peso', description: 'Módulos transmisores para celdas de carga', iconName: 'Scale' },
  { id: 'control-ip', name: 'Controladores IP', description: 'Dispositivos de comunicación y control Ethernet industrial', iconName: 'Network' },
  { id: 'valvulas-int', name: 'Válvulas inteligentes', description: 'Actuadores posicionadores con bus de campo', iconName: 'Settings' },
  { id: 'inyeccion', name: 'Equipos de inyección', description: 'Control de procesos para inyectoras de plástico', iconName: 'ChevronRight' },
  { id: 'soplado', name: 'Equipos de soplado', description: 'Sistemas electrónicos de moldeo por soplado', iconName: 'Wind' },
  { id: 'ups', name: 'UPS', description: 'Sistemas de alimentación ininterrumpida industriales', iconName: 'Zap' },
  { id: 'elec-automotriz', name: 'Electrónica automotriz', description: 'Ecus, controladores de bus CAN y actuadores de test', iconName: 'Car' },
  { id: 'coleros', name: 'Coleros', description: 'Aplicadores industriales de cola fría y dosificadores', iconName: 'Droplet' },
  { id: 'bosch', name: 'Equipos Bosch', description: 'Controladores Rexroth, servodrives y sistemas CNC', iconName: 'Layers' }
];

export const MANUFACTURERS: Manufacturer[] = [
  { id: 'siemens', name: 'Siemens', description: 'Líder global en automatización industrial y digitalización' },
  { id: 'abb', name: 'ABB', description: 'Pioneros en tecnologías de electrificación y robótica' },
  { id: 'bosch', name: 'Bosch Rexroth', description: 'Expertos en hidráulica, servomotores y control de movimiento' },
  { id: 'nordson', name: 'Nordson', description: 'Sistemas de dispensación de precisión para adhesivos' },
  { id: 'schneider', name: 'Schneider Electric', description: 'Especialistas en gestión de energía y automatización industrial' },
  { id: 'omron', name: 'Omron', description: 'Sistemas de control, sensado y seguridad industrial avanzada' },
  { id: 'allen-bradley', name: 'Allen-Bradley', description: 'Controladores lógicos programables y variadores Rockwell' },
  { id: 'tetrapak', name: 'Tetra Pak', description: 'Equipos y componentes electrónicos para plantas de envasado alimentario' },
  { id: 'endress', name: 'Endress+Hauser', description: 'Instrumentación de procesos de alta gama y análisis' },
  { id: 'phoenix', name: 'Phoenix Contact', description: 'Fuentes de poder, relés y conectividad industrial premium' }
];

export const EQUIPMENTS: Equipment[] = [
  {
    id: 'eq-sinamics-g120',
    name: 'Sinamics G120 VFD 22kW',
    manufacturer: 'Siemens',
    model: '6SL3224-0BE32-2AA0',
    series: 'S-VFD-2026-X82',
    categoryId: 'variadores',
    description: 'Variador de frecuencia modular de alto rendimiento diseñado para el control preciso de velocidad y torque de motores de inducción trifásicos. Equipado con la unidad de control CU240E-2 PN con soporte integrado de Profinet y funciones de seguridad Safe Torque Off (STO).',
    applications: [
      'Control de bombas de alta presión',
      'Cintas transportadoras de velocidad variable en plantas de envasado',
      'Sistemas de ventilación industrial e intercambiadores de calor',
      'Extrusores de plástico y mezcladoras de alta carga'
    ],
    features: [
      'Modulado vectorial con y sin sensor de encoder',
      'Funciones de seguridad integradas SIL 3 / PL e (STO, SS1)',
      'Frenado regenerativo inteligente incorporado',
      'Unidad de operador inteligente IOP-2 de alta resolución'
    ],
    specs: {
      'Potencia Nominal': '22 kW (30 HP)',
      'Tensión de Entrada': '380V - 480V CA (3 Fases, ±10%)',
      'Corriente de Salida': '45 A continuo',
      'Rango de Frecuencia': '0 Hz - 550 Hz',
      'Clase de Protección': 'IP20 / UL Open Type',
      'Eficiencia Energética': '98.2%'
    },
    protocols: ['Profinet', 'Profibus DP', 'Ethernet/IP', 'Modbus TCP'],
    inputs: [
      '6 Entradas Digitales (PNP/NPN configurable)',
      '2 Entradas Analógicas (0-10V, 0/4-20mA)',
      '1 Entrada PTC/KTY para sensor de temperatura del motor'
    ],
    outputs: [
      '3 Salidas de Relé (250V CA, 2A)',
      '2 Salidas Analógicas (0-20mA, configurables por software)'
    ],
    compatibility: [
      'Motores Simotics GP 1LE1',
      'PLCs S7-1200 y S7-1500',
      'Módulos de comunicación PN ET200SP'
    ],
    location: 'Planta de Envase B - Línea de Soplado 4',
    status: 'operational',
    images: {
      general: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
      interior: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
      circuitBoard: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
      connectors: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
      terminals: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?q=80&w=800&auto=format&fit=crop',
      label: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop'
    },
    documents: [
      {
        id: 'doc-g120-manual',
        title: 'Manual de Instrucciones de Servicio - Sinamics G120',
        type: 'manual',
        fileSize: '14.2 MB',
        url: '#',
        contentMock: `MANUAL DE OPERACIÓN Y PUESTA EN MARCHA - SINAMICS G120
======================================================
Versión de Software: v4.7.12 - Edición Julio 2026

1. INSTRUCCIONES DE SEGURIDAD
   ¡PELIGRO DE DESCARGA ELÉCTRICA! 
   Antes de manipular las borneras de conexión, desconecte la alimentación principal y espere un mínimo de 15 minutos para permitir que los condensadores del bus de corriente continua se descarguen por completo.
   
2. ESQUEMA DE CONEXIONES Y CABLEADO
   - Conectores de Red: L1, L2, L3 para alimentación trifásica de red.
   - Conectores de Motor: U2, V2, W2 hacia los bornes del motor.
   - Bornes de Control (CU240E-2 PN):
     * Borne 5: Entrada analógica AI0+ (0-10V regulación de consigna).
     * Borne 9: Salida digital DO0.
     * Conectores RJ45: Puertos Ethernet Profinet (soporte anillo MRP).

3. PARÁMETROS BÁSICOS DE CONFIGURACIÓN (Quick Commissioning)
   * P0010 = 1 (Preparar parametrización rápida)
   * P0100 = 0 (Motor en kW/Hz, Norma IEC)
   * P0300 = 1 (Tipo de motor: Inducción asíncrono)
   * P0304 = 400 (Tensión nominal de placa de motor)
   * P0305 = 42.5 (Corriente nominal de motor)
   * P0307 = 22.0 (Potencia nominal en kW)
   * P0311 = 1465 (Velocidad nominal en RPM)
   * P1900 = 1 (Identificación de motor activada con arranque)
   * P3900 = 1 (Finalizar puesta en marcha con cálculo de modelo matemático)

4. CÓDIGOS DE FALLO Y SOLUCIÓN DE PROBLEMAS
   * F0001 - Sobrecorriente: Comprobar que el motor gire libremente y que los parámetros de rampa de aceleración (P1120) no sean excesivamente cortos.
   * F0002 - Sobretensión del Bus CC: Activar chopper de frenado o aumentar rampa de desaceleración (P1121).
   * F0003 - Subtensión de red: Verificar tensión entre fases L1-L2-L3.`
      },
      {
        id: 'doc-g120-datasheet',
        title: 'Datasheet Técnico - 6SL3224-0BE32-2AA0',
        type: 'datasheet',
        fileSize: '1.8 MB',
        url: '#'
      },
      {
        id: 'doc-g120-schematic',
        title: 'Esquema Eléctrico y Planos DWG - Armario de Control',
        type: 'schematic',
        fileSize: '4.5 MB',
        url: '#'
      }
    ],
    logs: [
      {
        id: 'log-1',
        date: '2026-06-15',
        type: 'preventive',
        technician: 'Ing. Alejandro Silva',
        description: 'Mantenimiento preventivo anual. Limpieza profunda del disipador térmico trasero, sustitución preventiva del ventilador de refrigeración principal (Soplador radial IP55) y verificación de apriete de bornes de potencia con llave dinamométrica.',
        outcome: 'Estado óptimo. Curva de temperatura interna disminuyó 4.5°C tras limpieza de disipador.',
        duration: '2.5 horas'
      },
      {
        id: 'log-2',
        date: '2026-04-02',
        type: 'calibration',
        technician: 'Ing. Alejandro Silva',
        description: 'Autotuning estático del motor Simotics (P1900=1) tras rebobinado del estator del motor trifásico. Verificación del bucle PID de la velocidad mediante transductor de presión en la línea de soplado.',
        outcome: 'Bucle PID sintonizado. Constante proporcional Kp=1.8, Tiempo integral Ti=0.45s.',
        duration: '1.5 horas'
      }
    ],
    tags: ['VFD', 'Profinet', 'Control Vectorial', 'SIL3', 'Siemens Rexroth'],
    relatedEquipmentIds: ['eq-hmi-tp900', 'eq-quint-ps'],
    relatedSpares: ['Ventilador Siemens 6SL3200-0SF15-0AA0', 'Fusibles Ultra-Rápidos Sitor 50A']
  },
  {
    id: 'eq-problue-flex',
    name: 'Nordson ProBlue Flex Adhesive Melter',
    manufacturer: 'Nordson',
    model: 'ProBlue Flex - Standard 4',
    series: 'N-PBF-9921-H22',
    categoryId: 'nordson',
    description: 'Sistema inteligente de aplicación de adhesivo termofusible (hot melt) de última generación. Ofrece una precisión excepcional en la entrega de adhesivo, autodiagnósticos avanzados y un control de temperatura multizona digital que evita la carbonización del polímero.',
    applications: [
      'Sellado de solapas de cajas en la línea de empaque Tetra Pak',
      'Aplicación de adhesivo estructural en líneas de montaje de filtros',
      'Etiquetado industrial de alta velocidad con adhesivo termoplástico'
    ],
    features: [
      'Control PID multizona para mangueras y pistolas aplicadoras (hasta 4 zonas)',
      'Tecnología de llenado automático con sensor capacitivo integrado',
      'Pantalla táctil intuitiva con visor de diagnóstico en tiempo real',
      'Conectividad de bus de campo integrada para integración con PLC principal'
    ],
    specs: {
      'Capacidad de Tanque': '4 kg (8.8 lb)',
      'Tasa de Fusión': '6.8 kg/hr (15 lb/hr)',
      'Rango de Temperatura': '40°C a 230°C (100°F a 450°F)',
      'Presión Máxima': '83 bar (1200 psi)',
      'Número de Mangueras': 'Hasta 4 mangueras conectables',
      'Alimentación Eléctrica': '400V CA (3 Fases + N, 50/60Hz)'
    },
    protocols: ['Ethernet/IP', 'Profinet', 'Modbus TCP', 'CANopen'],
    inputs: [
      '4 Entradas analógicas de termopar (PT100/Fe-CuNi)',
      '2 Entradas digitales de enclavamiento de seguridad'
    ],
    outputs: [
      '4 Salidas de potencia para resistencia de mangueras',
      '1 Salida de relé de listo para producir'
    ],
    compatibility: [
      'Mangueras Nordson Blue Series',
      'Pistolas aplicadoras Epic, SolidBlue y ClassicBlue',
      'Boquillas de precisión de pulverización controlada Saturn'
    ],
    location: 'Línea de Envasado Tetra Pak 1 - Módulo de Cierre',
    status: 'operational',
    images: {
      general: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
      interior: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
      circuitBoard: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
      connectors: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?q=80&w=800&auto=format&fit=crop',
      terminals: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop'
    },
    documents: [
      {
        id: 'doc-nordson-manual',
        title: 'Manual del Propietario y Mantenimiento - ProBlue Flex',
        type: 'manual',
        fileSize: '8.9 MB',
        url: '#',
        contentMock: `MANUAL DE EQUIPOS NORDSON - PROBLUE FLEX ADHESIVE SYSTEM
======================================================
Código de Publicación: 1605334_05 - Edición Mayo 2026

1. OPERACIONES DIARIAS Y SEGURIDAD CONTRA QUEMADURAS
   ¡ALTA TEMPERATURA! Las piezas del equipo de aplicación de adhesivo termofusible operan a temperaturas de hasta 230 °C. Utilice siempre gafas de seguridad con protectores laterales, guantes resistentes al calor y prendas de manga larga de algodón grueso.
   
2. SISTEMA DE PRESIÓN Y BOMBA
   - El sistema de bombeo de pistón neumático (relación 14:1) convierte la presión de aire comprimido de entrada en presión hidráulica para el adhesivo.
   - Presión de aire recomendada: 1.4 a 5.5 bar (20 a 80 psi).

3. DIAGNÓSTICO DE TEMPERATURA
   El controlador digital monitoriza constantemente la temperatura de cada zona. Si la temperatura real varía en más de +/- 15°C respecto al punto de consigna durante más de 10 minutos, el relé de enclavamiento de seguridad saltará, apagando la bomba para evitar degradación.

4. RUTINA DE MANTENIMIENTO PREVENTIVO
   - Limpieza de Filtro de Tanque: Cada 500 horas de operación o al cambiar de tipo de adhesivo.
   - Lavado químico del colector principal: Cada 2000 horas utilizando disolvente limpiador Purge-Gel Nordson.`
      },
      {
        id: 'doc-nordson-datasheet',
        title: 'Folleto de Especificaciones de Precisión',
        type: 'datasheet',
        fileSize: '2.3 MB',
        url: '#'
      }
    ],
    logs: [
      {
        id: 'log-nordson-1',
        date: '2026-07-20',
        type: 'corrective',
        technician: 'Tec. Martín Gómez',
        description: 'Cambio de manguera térmica zona 3 por fallo intermitente de lectura del sensor PT100. Limpieza interna del filtro del distribuidor colector principal y sustitución de juntas de teflón de alta presión.',
        outcome: 'Manguera sustituida con éxito. Lectura de temperatura estabilizada a 180°C.',
        duration: '3.0 horas'
      }
    ],
    tags: ['Hot Melt', 'Nordson', 'Adhesivos', 'Control de Temperatura', 'Empaque'],
    relatedEquipmentIds: ['eq-tp-envasadora'],
    relatedSpares: ['Manguera Térmica Nordson 1.8m', 'Filtro Colector Saturn 100 mesh', 'Boquilla Saturn Single-Port 0.012in']
  },
  {
    id: 'eq-hmi-tp900',
    name: 'SIMATIC HMI TP900 Comfort',
    manufacturer: 'Siemens',
    model: '6AV2124-0JC01-0AX0',
    series: 'S-HMI-1109-S31',
    categoryId: 'hmi',
    description: 'Panel de operador HMI de gama alta con pantalla panorámica TFT de 9 pulgadas, 16 millones de colores e interfaz táctil capacitiva. Ideal para la visualización gráfica intuitiva de líneas de envasado completas y monitorización de alarmas de procesos complejos.',
    applications: [
      'Visualización de control de procesos en salas de pasteurización',
      'Panel táctil de terminal de operador en empaquetadoras de cartón',
      'Monitorización de variables en líneas de inyección de polímeros'
    ],
    features: [
      'Pantalla TFT widescreen de alto brillo con amplio ángulo de visión',
      'Interfaces integradas: Profinet (conmutador de 2 puertos) y Profibus DP',
      'Soporte completo de scripts en VBScript y archivado histórico en tarjeta SD',
      'Seguridad integrada con gestión de usuarios según FDA 21 CFR Parte 11'
    ],
    specs: {
      'Diagonal de Pantalla': '9.0 pulgadas (Widescreen)',
      'Resolución': '800 x 480 píxeles',
      'Tipo de Panel': 'TFT de 16 millones de colores',
      'Alimentación': '24V CC (19.2V a 28.8V CC)',
      'Consumo de Corriente': '0.75 A continuo',
      'Temperatura Operativa': '0°C a 50°C'
    },
    protocols: ['Profinet', 'Profibus DP', 'Modbus TCP', 'OPC UA Client/Server'],
    inputs: [
      'Pantalla táctil capacitiva multipunto',
      '2 Puertos USB 2.0 para transferencia de proyectos o periféricos',
      '1 Puerto USB mini para mantenimiento técnico'
    ],
    outputs: [
      'Salida de audio analógica (Jack de 3.5mm para alarmas acústicas)',
      'Señales Profinet hacia controladores PLC distribuidos'
    ],
    compatibility: [
      'PLC S7-1500 y S7-1200',
      'Software de Ingeniería TIA Portal WinCC Comfort V18+',
      'Servidores OPC UA de terceros'
    ],
    location: 'Planta de Envase B - Consola de Operador 2',
    status: 'operational',
    images: {
      general: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1200&auto=format&fit=crop',
      interior: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
      circuitBoard: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop'
    },
    documents: [
      {
        id: 'doc-tp900-manual',
        title: 'Manual de Equipos Comfort Panels - Siemens',
        type: 'manual',
        fileSize: '11.5 MB',
        url: '#',
        contentMock: `MANUAL DE EQUIPOS CONFORT PANELS - SIMATIC HMI TP900
======================================================
Edición Noviembre 2025 - Referencia Siemens A5E30635412

1. ESPECIFICACIONES DE MONTAJE Y GRADO DE PROTECCIÓN
   - El panel está diseñado para empotrarse en armarios de control o pupitres de mando.
   - El panel frontal ofrece un grado de protección IP65 (estanqueidad al polvo y chorro de agua), mientras que la parte trasera es IP20. Asegúrese de que la junta de estanqueidad posterior encaje perfectamente sin pliegues antes del apriete mecánico.

2. CABLEADO DE INTERFACES
   - Alimentación de 24V CC: Conectar en el borne de 3 polos trasero suministrado.
   - Profinet (X1): Conmutador interno de dos puertos RJ45 para topologías de red en línea o estrella.
   - Profibus DP (X2): Conector hembra SUB-D de 9 polos.

3. COPIA DE SEGURIDAD Y RESTAURACIÓN (Back & Restore)
   Para clonar la configuración completa de un panel sin necesidad del software TIA Portal:
   - Inserte una tarjeta SD formateada (formato FAT32) de tipo "Simatic HMI Memory Card" en la ranura etiquetada como "Mover / System Card".
   - Acceda al panel de control de Windows CE embebido en el HMI.
   - Seleccione la utilidad "Backup / Restore" -> "Backup" -> Elija la ruta en la ranura de tarjetas.
   - Al sustituir el panel por avería física, simplemente mueva la tarjeta SD al nuevo panel y pulse "Restore" al arrancar.`
      }
    ],
    logs: [
      {
        id: 'log-hmi-1',
        date: '2026-05-10',
        type: 'inspection',
        technician: 'Ing. Alejandro Silva',
        description: 'Actualización del firmware interno del sistema operativo Windows Embedded CE mediante ProSave a la versión v18.0.0.3. Calibración de la pantalla capacitiva y carga de nuevas pantallas táctiles para la sección de alarmas de sellado.',
        outcome: 'Firmware actualizado sin errores. Pantallas de visualización cargadas.',
        duration: '1.2 horas'
      }
    ],
    tags: ['HMI', 'Comfort Panel', 'Profinet', 'TIA Portal', 'Siemens'],
    relatedEquipmentIds: ['eq-sinamics-g120'],
    relatedSpares: ['Tarjeta de Memoria HMI 2GB Siemens', 'Lápiz Óptico Industrial Comfort', 'Filtro protector de pantalla TP900']
  },
  {
    id: 'eq-quint-ps',
    name: 'Phoenix Contact Quint Power 24V/40A',
    manufacturer: 'Phoenix Contact',
    model: 'QUINT4-PS/1AC/24DC/40',
    series: 'P-QPS-4040-F22',
    categoryId: 'power-supply',
    description: 'Fuente de alimentación industrial conmutada monofásica de alta gama con tecnología SFB (Selective Fuse Breaking) integrada y visualización diagnóstica integrada. Diseñada para alimentar circuitos de control críticos en armarios de distribución bajo entornos electromagnéticos agresivos.',
    applications: [
      'Alimentación central de redes de PLCs y HMI en líneas de empaque',
      'Suministro de 24V CC para relés de potencia e instrumentación crítica',
      'Sistemas de control redundantes en subestaciones eléctricas'
    ],
    features: [
      'Soporte de Dynamic Boost de hasta el 150% de corriente nominal para picos transitorios',
      'Tecnología SFB: Desactiva selectivamente disyuntores magnéticos defectuosos en 15 ms',
      'Monitorización analógica inteligente integrada de corriente de salida y tensión de red',
      'Recubrimiento conformado de resina acrílica para protección contra humedad extrema'
    ],
    specs: {
      'Tensión de Entrada': '85V CA a 264V CA / 90V CC a 350V CC',
      'Tensión de Salida': '24V CC (ajustable de 24V a 29.5V CC)',
      'Corriente de Salida': '40 Amperios continuos',
      'Eficiencia': '94.5%',
      'Tiempo de Respaldo': '> 20 ms a 230V CA',
      'Dimensiones': '120 x 130 x 125 mm'
    },
    protocols: ['Soporte de contacto seco analógico', 'IO-Link (vía módulo opcional)'],
    inputs: [
      'L, N, PE bornes de tornillo enchufables',
      'Tensión de red monofásica autoadaptable'
    ],
    outputs: [
      '3 Bornes dobles de conexión de salida 24V CC (+) y (-)',
      'Contacto seco digital DC OK (13/14)',
      'Contacto analógico Out 1 / Out 2 de nivel de corriente'
    ],
    compatibility: [
      'Disyuntores electrónicos PTC / CBMC de Phoenix Contact',
      'Módulos de diodo redundante QUINT-DIODE',
      'Sistemas UPS con batería inteligente de respaldo'
    ],
    location: 'Planta de Envase B - Armario de Control Principal AC-02',
    status: 'operational',
    images: {
      general: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
      interior: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?q=80&w=800&auto=format&fit=crop',
      circuitBoard: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop'
    },
    documents: [
      {
        id: 'doc-quint4-manual',
        title: 'Manual de Instalación Técnica - Quint Power 40A',
        type: 'manual',
        fileSize: '4.1 MB',
        url: '#',
        contentMock: `MANUAL TÉCNICO DE FUENTES DE ALIMENTACIÓN - QUINT4
======================================================
Código Phoenix Contact: 1024321_04 - Edición Noviembre 2025

1. CONEXIÓN ELÉCTRICA Y SEGURIDAD
   - La instalación de este equipo debe ser realizada únicamente por técnicos cualificados.
   - Fusible previo de protección recomendado: Disyuntor magneto-térmico de 16A curva B o C.
   
2. FUNCIONAMIENTO DE LA TECNOLOGÍA SFB (Selective Fuse Breaking)
   La tecnología SFB suministra hasta 6 veces la corriente nominal de cortocircuito durante 15 ms. Esto permite que los disyuntores de las ramas secundarias individuales se disparen instantáneamente ante cortocircuitos selectivos, manteniendo la alimentación estable al resto de consumidores sanos conectados a la misma fuente.

3. AJUSTES DEL PANEL FRONTAL Y MONITOREO
   - El potenciómetro rotativo frontal permite calibrar la tensión de salida entre 24.0V y 29.5V CC para compensar caídas de tensión por cables largos.
   - El indicador gráfico LED frontal de barra muestra el porcentaje exacto de carga consumida: >25%, >50%, >75%, >100%. El LED "DC OK" encendido de color verde constante indica tensión de salida en rango óptimo.`
      }
    ],
    logs: [
      {
        id: 'log-quint-1',
        date: '2026-02-14',
        type: 'inspection',
        technician: 'Tec. Martín Gómez',
        description: 'Medición de rizado de salida de corriente continua (Ripple & Noise). El osciloscopio registra un ruido transitorio máximo de 18 mVp-p, muy por debajo de los 30 mVp-p tolerados por especificación del fabricante. Apriete mecánico de terminales a tornillo.',
        outcome: 'Rizado estable. Bornes ajustados a torque nominal de 0.6 Nm.',
        duration: '0.8 horas'
      }
    ],
    tags: ['Power Supply', 'SFB Technology', 'DIN Rail', 'Phoenix Contact', '24V DC'],
    relatedEquipmentIds: ['eq-sinamics-g120', 'eq-hmi-tp900'],
    relatedSpares: ['Fusible Phoenix Contact internal spark protector', 'Módulo de redundancia Quint Diode 40A']
  },
  {
    id: 'eq-rexroth-indramat',
    name: 'Bosch Rexroth Indramat IndraDrive HCS02',
    manufacturer: 'Bosch Rexroth',
    model: 'HCS02.1E-W0012-A-03-NNNN',
    series: 'B-IND-5520-C41',
    categoryId: 'bosch',
    description: 'Servocontrolador de alta precisión de la gama IndraDrive C. Diseñado para gobernar servomotores síncronos y asíncronos en aplicaciones de embalaje dinámico de alta velocidad. Cuenta con interfaz de comunicación SERCOS III integrada para una sincronización en tiempo de milisegundos.',
    applications: [
      'Control de ejes de coordenadas X-Y-Z en máquinas coleras industriales',
      'Alimentadores de precisión para empaquetadoras de productos secos',
      'Actuador principal en sistemas de inyección de resina'
    ],
    features: [
      'Interfaz de comunicación ethernet industrial de bus dual SERCOS III',
      'Codificador óptico de realimentación universal integrado para múltiples estándares',
      'Diseño modular compacto y ligero ideal para montaje en batería ahorrando espacio',
      'Gestión térmica integrada y disipador de aluminio forzado por ventilador'
    ],
    specs: {
      'Tensión de Entrada': '200V a 500V CA (Trifásica, 50/60Hz)',
      'Corriente Máxima': '12 Amperios pico',
      'Capacidad del Filtro de Red': 'Filtro EMC de clase A integrado',
      'Bucle de Control': '125 microsegundos de actualización',
      'Temperatura Máxima': '45°C sin derrateo de potencia'
    },
    protocols: ['SERCOS III', 'EtherCAT', 'Profinet', 'CANopen'],
    inputs: [
      '2 Entradas analógicas rápidas (±10V diferencial)',
      '4 Entradas digitales ultrarrápidas de captura de posición (Touch Probe)'
    ],
    outputs: [
      '1 Salida analógica auxiliar configurable',
      '2 Salidas de relé de estado del variador'
    ],
    compatibility: [
      'Servomotores síncronos Rexroth MSK y IndraDyn S',
      'Controlador lógico de movimiento Rexroth MLC',
      'Cableado de realimentación blindado con tecnología Single Cable Connection'
    ],
    location: 'Línea de Envasado Tetra Pak 1 - Módulo de Sellado Longitudinal',
    status: 'operational',
    images: {
      general: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
      interior: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop'
    },
    documents: [
      {
        id: 'doc-indradrive-manual',
        title: 'Manual de Proyecto y Configuración de Accionamientos IndraDrive',
        type: 'manual',
        fileSize: '15.6 MB',
        url: '#',
        contentMock: `MANUAL DE INGENIERÍA Y DIAGNÓSTICO - REXROTH INDRADRIVE C
======================================================
Código Rexroth: R911326487 - Edición Abril 2026

1. DIAGNÓSTICO INTEGRADO Y LECTURA DE CÓDIGOS DE PANTALLA
   El controlador frontal incluye una pantalla de 7 segmentos de 4 caracteres.
   - P0: Estado de apagado seguro activado.
   - AF: Funcionamiento normal, bucle de control de par cerrado.
   - E-XXXX: Error del sistema. El servocontrolador ha detectado una condición anómala y desenergiza el motor por seguridad.
   - F-2026: Error de bus de realimentación del encoder. Compruebe la continuidad del par trenzado de datos del cable del codificador.

2. CABLEADO DE ENERGÍA Y SEGURIDAD STO
   Para activar la seguridad integrada (Safe Torque Off):
   - El borne X41.3 y X41.4 de seguridad redundante dual debe recibir alimentación de 24V CC de una barrera de seguridad de doble canal externa.
   - Si se detecta una apertura de la línea de emergencia, el variador corta físicamente el paso de corriente a los transistores IGBT de salida en menos de 10 ms.`
      }
    ],
    logs: [
      {
        id: 'log-indradrive-1',
        date: '2026-07-03',
        type: 'preventive',
        technician: 'Ing. Alejandro Silva',
        description: 'Inspección de las guías de ventilación de refrigeración y limpieza del ventilador. Verificación del valor de offset de corriente en el lazo del servocontrolador MSK mediante software de puesta en servicio IndraWorks DS.',
        outcome: 'Autodiagnóstico óptimo de bucle de corriente. Temperatura de funcionamiento reducida a 38.5°C.',
        duration: '1.5 horas'
      }
    ],
    tags: ['IndraDrive', 'Servocontrolador', 'SERCOS III', 'Bosch Rexroth', 'Control de Posición'],
    relatedEquipmentIds: ['eq-sinamics-g120', 'eq-quint-ps'],
    relatedSpares: ['Servomotor MSK040C-0450-NN', 'Módulo de Seguridad IndraDrive X41', 'Cable de Conectividad Sercos III RJ45']
  },
  {
    id: 'eq-e5cc-temp',
    name: 'Omron E5CC Controlador Digital',
    manufacturer: 'Omron',
    model: 'E5CC-QX2ASM-800',
    series: 'O-TEM-2211-M31',
    categoryId: 'temperatura',
    description: 'Controlador digital de temperatura de panel con pantalla LCD de alto contraste de 4 dígitos. Ofrece un algoritmo PID avanzado de auto-ajuste y un tiempo de ciclo de muestreo de tan solo 50 ms para un control térmico extremadamente preciso en hornos industriales y extrusoras.',
    applications: [
      'Control de temperatura de mordazas de sellado térmico de bolsas',
      'Regulación térmica de cámaras de maduración de alimentos',
      'Monitorización de cabezales calientes en inyectoras plásticas'
    ],
    features: [
      'Pantalla LCD premium blanca con excelente visibilidad desde cualquier ángulo de visión',
      'Doble pantalla simultánea: PV (Valor de Proceso en verde) y SV (Consigna en naranja)',
      'Muestreo de alta velocidad ultra-rápido de 50 ms',
      'Puerto micro-USB frontal integrado para programación directa por PC mediante software CX-Thermo'
    ],
    specs: {
      'Dimensiones Frontales': '48 x 48 mm (1/16 DIN)',
      'Tipos de Entrada': 'Termopares (K, J, T, E, R, S, B), RTD (Pt100, JPt100)',
      'Salida de Control': 'Salida de tensión de pulso (para gobernar relés de estado sólido SSR)',
      'Alimentación': '100V CA a 240V CA (50/60 Hz)',
      'Consumo Eléctrico': '5.2 VA máximo',
      'Modo de Control': '2-PID con sintonización fina de auto-tuning'
    },
    protocols: ['Modbus RTU (vía bus RS-485 integrado)'],
    inputs: [
      '1 Entrada universal multi-rango (Termopar/RTD/Entrada Analógica analógica)',
      '2 Entradas de eventos digitales (arranque remoto/conmutación de consigna)'
    ],
    outputs: [
      '1 Salida de control por impulsos de tensión (12V CC, 21mA)',
      '2 Salidas de relé independientes para alarmas térmicas de seguridad'
    ],
    compatibility: [
      'Relés de Estado Sólido (SSR) de la serie Omron G3PE / G3NA',
      'Sondas de Temperatura PT100 industriales de Omron',
      'Software de parametrización CX-Thermo'
    ],
    location: 'Línea de Envasado Tetra Pak 1 - Cubierta de Armario Térmico',
    status: 'operational',
    images: {
      general: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
      interior: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?q=80&w=800&auto=format&fit=crop'
    },
    documents: [
      {
        id: 'doc-e5cc-manual',
        title: 'Guía del Usuario del E5CC - Omron Manual',
        type: 'manual',
        fileSize: '5.2 MB',
        url: '#',
        contentMock: `MANUAL DE MANUALES TÉCNICOS - OMRON E5CC/E5EC
======================================================
Referencia Omron: H174-ES1-05 - Edición Marzo 2026

1. CONFIGURACIÓN DEL SENSOR DE ENTRADA (Código de parámetro "IN-T")
   Es fundamental configurar el tipo de sensor correcto antes de acoplar la alimentación principal. El parámetro se encuentra en el menú de ajuste de nivel inicial:
   - "IN-T" = 5: Termopar tipo K (-200°C a 1300°C).
   - "IN-T" = 0: RTD Sonda Pt100 de tres hilos (-200°C a 850°C).
   Asegúrese de cablear el Pt100 respetando los bornes A, B y B' traseros.

2. ESQUEMA DE BORNES DE ENTRADA Y SALIDA (48x48mm)
   - Bornes 1 y 2: Entrada de corriente de red 100-240V CA.
   - Bornes 7 y 8: Salida de control (12V CC pulso, positivo en Borne 7).
   - Bornes 11 y 12: Conexión de sensor universal Termopar/RTD (RTD borne A en Borne 11, B en 12, B' en 10).
   - Bornes 3, 4 y 5: Salidas de alarma de contacto de relé seco.

3. AUTOTUNING (Sintonización automática PID)
   - Para activar la búsqueda automática de los mejores parámetros P, I, D:
     * Pulse brevemente la tecla O hasta visualizar el parámetro "AT".
     * Seleccione "AT-1" (Autotuning de desviación del 40%) o "AT-2" (Autotuning estándar al valor de consigna).
     * El indicador luminoso frontal "AT" comenzará a parpadear. El proceso finalizará automáticamente tras 2 ciclos térmicos.`
      }
    ],
    logs: [
      {
        id: 'log-e5cc-1',
        date: '2026-03-12',
        type: 'calibration',
        technician: 'Tec. Martín Gómez',
        description: 'Calibración de temperatura utilizando termómetro de alta precisión de referencia calibrado. Ajuste de la desviación de entrada (Input Shift) mediante parámetro "CN-V" para compensar pérdidas en cables.',
        outcome: 'Calibración exitosa. Desviación real corregida de +1.2°C a 0.0°C respecto al patrón.',
        duration: '1.0 horas'
      }
    ],
    tags: ['Controlador PID', 'Temperatura', 'Omron', 'Termopar Pt100', '1/16 DIN'],
    relatedEquipmentIds: ['eq-problue-flex'],
    relatedSpares: ['Relé de Estado Sólido Omron G3NA-210B', 'Sonda PT100 de vaina roscada de 100mm']
  },
  {
    id: 'eq-endress-radar',
    name: 'Micropilot FMR62 Radar de Combustible',
    manufacturer: 'Endress+Hauser',
    model: 'FMR62-BCACSACXXA2',
    series: 'EH-RAD-1102-M03',
    categoryId: 'radar-combustible',
    description: 'Radar de nivel de combustible sin contacto de alta frecuencia de 80 GHz. Ofrece una precisión de medición milimétrica, ignorando falsos ecos procedentes de agitadores o serpentines térmicos de tanques industriales gracias a su ángulo de emisión extremadamente estrecho.',
    applications: [
      'Medición continua de nivel en tanques de almacenamiento de gasóleo y combustible pesado',
      'Monitorización de silos de sólidos granulares y resinas plásticas en polvo',
      'Medición en reactores químicos con alta presencia de vapores densos'
    ],
    features: [
      'Frecuencia de radar de 80 GHz que genera un haz ultra-dirigido de 3 grados',
      'Algoritmo inteligente de supresión de falsos ecos por software integrado',
      'Mantenimiento predictivo con tecnología Heartbeat integrada con verificación ATEX',
      'Indicador gráfico retroiluminado con Bluetooth para diagnóstico rápido a través de tablet'
    ],
    specs: {
      'Frecuencia': '80 GHz (Frecuencia modulada de onda continua)',
      'Rango de Medición': 'Hasta 80 metros de distancia útil',
      'Precisión': '±1 mm',
      'Temperatura del Proceso': '-40°C a 200°C',
      'Presión Máxima': 'Up to 160 bar',
      'Salida Analógica': '4-20 mA con protocolo de datos HART'
    },
    protocols: ['HART 7', 'Profibus PA', 'Foundation Fieldbus', 'Bluetooth Smart'],
    inputs: [
      'Alimentación eléctrica a dos hilos (alimentación por lazo de corriente, 12-35V CC)',
      'Señal de retorno de microondas del fluido del tanque'
    ],
    outputs: [
      'Señal analógica por lazo de corriente 4-20mA proporcional al volumen',
      'Pantalla local con visualización de curva de eco'
    ],
    compatibility: [
      'Indicadores de campo RIA15 / RIA16',
      'Sistemas de adquisición de datos Memograph M',
      'Software de calibración FieldCare / DeviceCare de Endress+Hauser'
    ],
    location: 'Parque de Tanques Externo - Depósito de Diésel Auxiliar D-1',
    status: 'operational',
    images: {
      general: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
      interior: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop'
    },
    documents: [
      {
        id: 'doc-fmr62-manual',
        title: 'Manual de Instrucciones de Funcionamiento - Micropilot FMR62',
        type: 'manual',
        fileSize: '7.8 MB',
        url: '#',
        contentMock: `MANUAL DE INSTRUCCIONES DE INSTRUMENTACIÓN - MICROPILOT FMR62
======================================================
Referencia Endress+Hauser: BA01620F/00/ES - Edición 2026

1. CERTIFICACIÓN ATEX Y SEGURIDAD INTRÍNSECA
   Este instrumento cuenta con homologación ATEX II 1/2 G Ex ia IIC T6 Ga/Gb.
   Cualquier conexión eléctrica a un PLC o indicador de campo situado en zona segura debe realizarse obligatoriamente intercalando una barrera de aislamiento intrínseco (barrera Zener) debidamente dimensionada para evitar chispas por transitorios eléctricos en atmósferas explosivas.

2. DIRECTRICES DE INSTALACIÓN FÍSICA
   - Instale el instrumento de manera que el haz de microondas esté orientado perpendicularmente a la superficie del líquido del combustible.
   - Distancia mínima del sensor a la pared del tanque: 1/10 de la altura del depósito para evitar interferencias por rugosidad o cordones de soldadura.
   - Evite montar el sensor justo sobre tolvas de llenado, boquillas de descarga o deflectores internos.

3. MAPEO DE ECOS DE INTERFERENCIA (Supresión de ecos molestos)
   Si hay un obstáculo fijo (como un tubo de calefacción interno o un tirante del tanque) que cause falsos picos de nivel alto:
   - Conecte el dispositivo mediante HART a DeviceCare.
   - Acceda al menú "Diagnóstico" -> "Mapeo de ecos" -> "Iniciar mapeo".
   - Indique la distancia libre real actual del tanque. El software de radar registrará todos los picos actuales por debajo de esa línea como interferencias y los restará automáticamente de las lecturas dinámicas futuras.`
      }
    ],
    logs: [
      {
        id: 'log-fmr62-1',
        date: '2026-04-18',
        type: 'preventive',
        technician: 'Ing. Alejandro Silva',
        description: 'Prueba de diagnóstico Heartbeat integrada en el instrumento para verificar el estado de la antena y la integridad electrónica del oscilador de microondas de alta frecuencia. Comprobación del sello de estanqueidad de la brida de montaje.',
        outcome: 'Informe de verificación Heartbeat "Aprobado" emitido con éxito. Integridad del PTFE de la lente perfecta.',
        duration: '1.2 horas'
      }
    ],
    tags: ['Radar de Nivel', '80 GHz', 'Endress+Hauser', 'ATEX', 'HART Protocol'],
    relatedEquipmentIds: ['eq-quint-ps'],
    relatedSpares: ['Módulo de visualización digital local SD03', 'Barrera Zener Solitop Phoenix 24V', 'Brida de montaje PTFE DN80 PN16']
  },
  {
    id: 'eq-det-ex-crowcon',
    name: 'Xgard IQ Detector de Gases ATEX',
    manufacturer: 'Omron',
    model: 'Xgard IQ-ATEX-O2',
    series: 'C-XGD-9901-X22',
    categoryId: 'det-explosivos',
    description: 'Detector y transmisor inteligente de gases combustibles y mezclas explosivas con pantalla local. Diseñado para salas de calderas, instalaciones químicas y almacenes de reactivos peligrosos. Incorpora sensores inteligentes que se pre-calibran de forma remota.',
    applications: [
      'Detección de mezclas de vapores explosivos en salas de tanques de disolventes',
      'Monitorización continua de fugas de gas metano en hornos de secado',
      'Seguridad en foso de mantenimiento mecánico'
    ],
    features: [
      'Transmisor inteligente de acero inoxidable AISI 316 con homologación antideflagrante Ex d',
      'Módulo de pantalla OLED de alta definición y LEDs de estado de alarma en color azul/rojo',
      'Sensores de tipo "plug-and-play" auto-calibrados con memoria integrada de vida útil',
      'Salida analógica robusta 4-20mA y bus RS-485 Modbus RTU'
    ],
    specs: {
      'Gases Compatibles': 'Metano, Propano, Butano, Hidrógeno, Vapores de Etanol',
      'Tensión de Operación': '18V CC a 30V CC',
      'Consumo': '4.5 vatios máximo',
      'Rango de Medición': '0 a 100% LEL (Límite Inferior de Explosividad)',
      'Tiempo de Respuesta': 'T90 < 15 segundos',
      'Humedad Relativa': '0% a 95% sin condensación'
    },
    protocols: ['Modbus RTU', 'HART (analógico)'],
    inputs: [
      'Módulo sensor de tipo catalítico (pellistor) o de absorción infrarroja (IR)',
      'Botones frontales magnéticos no intrusivos para calibración sin abrir la envolvente'
    ],
    outputs: [
      'Señal de corriente de lazo analógico de 3 hilos 4-20mA',
      '3 Contactos de relé secos internos de potencia (Alarma, Prealarma y Fallo)'
    ],
    compatibility: [
      'Centrales de monitorización de gases Gasmaster',
      'Módulos de relés analógicos de barrera de seguridad',
      'Sistemas SCADA de monitorización de planta'
    ],
    location: 'Sala de Dosificación de Adhesivos Nordson - Línea de Envasado 1',
    status: 'operational',
    images: {
      general: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
      interior: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop'
    },
    documents: [
      {
        id: 'doc-xgard-manual',
        title: 'Manual de Seguridad de Detección de Fugas - Xgard IQ',
        type: 'manual',
        fileSize: '6.5 MB',
        url: '#',
        contentMock: `MANUAL TÉCNICO DE INSTALACIÓN Y SEGURIDAD - XGARD IQ
======================================================
Referencia Crowcon-Omron: XG-IQ-01-ES - Edición 2026

1. DIRECTRICES DE UBICACIÓN FÍSICA SEGÚN DENSIDAD DE GAS
   - Para gases pesados que el aire (Propano, Butano, Vapores de Disolventes): Instalar el detector a una altura máxima de 30 cm sobre el suelo.
   - Para gases ligeros que el aire (Metano, Gas Natural, Hidrógeno): Instalar el detector cerca del techo, a un máximo de 30 cm del nivel superior, alejado de corrientes de ventilación forzada.

2. CABLEADO DE TRES HILOS (Transmisor Analógico)
   - Borne 1: Alimentación +24V CC.
   - Borne 2: Señal analógica de retorno 4-20mA (resistencia de carga máxima 500 ohmios).
   - Borne 3: Común 0V.
   - El cableado debe ser obligatoriamente apantallado y con manguera armada tipo de protección ignífuga si el conducto discurre en zona ATEX clasificada.

3. CALIBRACIÓN SEMESTRAL OBLIGATORIA
   - El sensor pellistor de mezclas explosivas sufre deriva natural e intoxicación de catalizador por siliconas de limpieza. Se requiere una recalibración semestral con botella de gas patrón al 50% LEL.
   - Utilice el bolígrafo magnético en las ventanas táctiles frontales para entrar al menú "Calibración" sin necesidad de romper la estanqueidad d de la carcasa antideflagrante en zona activa.`
      }
    ],
    logs: [
      {
        id: 'log-xgard-1',
        date: '2026-07-15',
        type: 'calibration',
        technician: 'Tec. Martín Gómez',
        description: 'Verificación semestral de calibración de mezcla explosiva utilizando gas metano patrón al 50% LEL. Ajuste de cero de aire limpio y ganancia de escala. Comprobación del disparo de relés de prealarma (ajustado al 20% LEL) y sirena de alarma (ajustado al 40% LEL).',
        outcome: 'Deriva inicial detectada de -3.5% LEL corregida. Disparo de relé probado e instrumental verificado.',
        duration: '1.8 horas'
      }
    ],
    tags: ['Detector de Gases', 'Mezclas Explosivas', 'PELLISTOR', 'ATEX d', 'Seguridad Industrial'],
    relatedEquipmentIds: ['eq-problue-flex'],
    relatedSpares: ['Módulo de sensor recambio Catalítico Metano', 'Deflector de lluvia para Xgard IQ', 'Bolígrafo Magnético de calibración frontal']
  }
];
