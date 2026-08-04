import React, { useState, useMemo } from 'react';
import { Customer, Operator, CallLog, Equipment, StockItem, OTEstado } from '../types';
import WorkOrderForm from '../components/WorkOrderForm';
import WorkOrderDetailModal from '../components/WorkOrderDetailModal';
import { 
  Wrench, Clock, FileText, UserCheck, Kanban, Search, 
  SlidersHorizontal, LayoutGrid, CheckCircle, ChevronLeft, 
  ChevronRight, ArrowRightLeft, User, AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';

interface WorkOrderRegisterViewProps {
  id: string;
  customers: Customer[];
  operators: Operator[];
  callLogs: CallLog[]; // our OTs list
  equipments: Equipment[];
  stockItems: StockItem[];
  preselectedCustomer: Customer | null;
  onSubmitCall: (data: {
    customerId: string;
    operatorId: string;
    motive: string;
    outcome: OTEstado;
    observations: string;
    followUpDate?: string;
    audioUrl?: string;
    
    // OT Details
    equipmentId: string;
    newEquipment?: {
      fabricante: string;
      modelo: string;
      nroSerie: string;
      categoria: Equipment['categoria'];
      potencia: string;
      tension: string;
    };
    prioridad: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  }) => void;
  onUpdateCallLog: (updatedOT: CallLog) => void;
  onUpdateStockItems: (updatedStock: StockItem[]) => void;
  defaultTab?: 'ingreso' | 'kanban';
}

const KANBAN_COLUMNS: OTEstado[] = [
  'Recepcionado',
  'En diagnóstico',
  'Esperando aprobación',
  'En reparación',
  'Esperando repuestos',
  'En prueba',
  'Finalizado',
  'Entregado'
];

export default function WorkOrderRegisterView({
  id,
  customers,
  operators,
  callLogs,
  equipments,
  stockItems,
  preselectedCustomer,
  onSubmitCall,
  onUpdateCallLog,
  onUpdateStockItems,
  defaultTab
}: WorkOrderRegisterViewProps) {
  const [activeTab, setActiveTab] = useState<'ingreso' | 'kanban'>('kanban'); // Default to Kanban as it's the centerpiece of Lab management

  React.useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);
  
  // Kanban board filters
  const [searchQuery, setSearchQuery] = useState('');
  const [techFilter, setTechFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Selected OT state for Detail modal
  const [selectedOT, setSelectedOT] = useState<CallLog | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Scoped recent OTs list for display in the right sidebar of the Intake Form
  const recentLogs = useMemo(() => {
    return [...callLogs]
      .sort((a, b) => b.id.localeCompare(a.id))
      .slice(0, 5); // display 5 most recent
  }, [callLogs]);

  // Filtered OTs for Kanban columns
  const filteredOTs = useMemo(() => {
    return callLogs.filter(ot => {
      // 1. Search Query (OT ID, Customer Name, or Equipment Name)
      const matchesSearch = 
        ot.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ot.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ot.equipmentName && ot.equipmentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ot.motive.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Technical filter
      const matchesTech = techFilter === 'ALL' || ot.operatorId === techFilter;

      // 3. Priority filter
      const matchesPriority = priorityFilter === 'ALL' || ot.prioridad === priorityFilter;

      return matchesSearch && matchesTech && matchesPriority;
    });
  }, [callLogs, searchQuery, techFilter, priorityFilter]);

  // Group OTs by state for the Kanban columns
  const otByColumn = useMemo(() => {
    const columns: Record<OTEstado, CallLog[]> = {
      'Recepcionado': [],
      'En diagnóstico': [],
      'Esperando aprobación': [],
      'En reparación': [],
      'Esperando repuestos': [],
      'En prueba': [],
      'Finalizado': [],
      'Entregado': []
    };

    filteredOTs.forEach(ot => {
      if (columns[ot.outcome]) {
        columns[ot.outcome].push(ot);
      } else {
        // Fallback or legacy mapping
        columns['Recepcionado'].push(ot);
      }
    });

    return columns;
  }, [filteredOTs]);

  // Quick state transitions handler from Kanban card controls
  const handleMoveStatus = (ot: CallLog, direction: 'next' | 'prev') => {
    const currentIndex = KANBAN_COLUMNS.indexOf(ot.outcome);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (direction === 'next') {
      nextIndex = Math.min(KANBAN_COLUMNS.length - 1, currentIndex + 1);
    } else {
      nextIndex = Math.max(0, currentIndex - 1);
    }

    if (nextIndex === currentIndex) return; // no change

    const newStatus = KANBAN_COLUMNS[nextIndex];
    const updatedOT: CallLog = {
      ...ot,
      outcome: newStatus
    };
    
    // Auto-populate delivery defaults if entering 'Entregado'
    if (newStatus === 'Entregado' && !ot.fechaEntrega) {
      updatedOT.fechaEntrega = '2026-08-03';
      updatedOT.nroRemito = ot.nroRemito || `R-0004-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    onUpdateCallLog(updatedOT);
  };

  const handleCardClick = (ot: CallLog) => {
    setSelectedOT(ot);
    setIsDetailModalOpen(true);
  };

  return (
    <div id={id} className="space-y-6">
      
      {/* Top Section: Navigation Tabs & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-zinc-200">
        <div>
          <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
            <Kanban className="w-5.5 h-5.5 text-blue-600" />
            Coordinación de Laboratorio y OTs
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5 font-medium">
            Gestión técnica interactiva de equipos industriales en reparación.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200/60 self-start sm:self-auto shadow-sm">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'kanban'
                ? 'bg-white text-zinc-900 shadow-sm font-extrabold'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-zinc-400" />
            Tablero Kanban
          </button>
          <button
            onClick={() => setActiveTab('ingreso')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ingreso'
                ? 'bg-white text-zinc-900 shadow-sm font-extrabold'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Wrench className="w-4 h-4 text-zinc-400" />
            Ingreso de Activo
          </button>
        </div>
      </div>

      {/* Main Container Views */}
      {activeTab === 'ingreso' ? (
        /* View 1: WorkOrder Intake form & Recent OTs sidebar list */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Intake Form Component */}
          <div className="lg:col-span-7 h-full">
            <WorkOrderForm
              id="work-order-registration-form"
              customers={customers}
              operators={operators}
              equipments={equipments}
              preselectedCustomer={preselectedCustomer}
              onSubmitWorkOrder={onSubmitCall}
            />
          </div>

          {/* Right Sidebar Recents list */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white border border-zinc-200/80 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] p-5">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 mb-4">
                <Clock className="w-4.5 h-4.5 text-zinc-500" />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 tracking-tight">Órdenes de Trabajo Recientes</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5 font-medium">Últimos activos recibidos e ingresados al taller hoy.</p>
                </div>
              </div>

              <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
                {recentLogs.length > 0 ? (
                  recentLogs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => handleCardClick(log)}
                      className="p-3.5 bg-zinc-50/50 hover:bg-zinc-50 border border-zinc-150 rounded-xl space-y-2 transition-all relative cursor-pointer group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-blue-600">
                          {log.id}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-mono font-bold">
                          {log.date} @ {log.time}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <p className="text-xs font-extrabold text-zinc-800 group-hover:text-blue-600 transition-colors">
                          {log.customerName}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-semibold flex items-center gap-1">
                          <Wrench className="w-3 h-3 text-zinc-400" />
                          {log.equipmentName || log.motive}
                        </p>
                      </div>

                      <p className="text-[11px] text-zinc-600 line-clamp-2 leading-relaxed italic">
                        "{log.observations}"
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-200/40">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          log.prioridad === 'Crítica' ? 'bg-rose-100 text-rose-700 font-extrabold' :
                          log.prioridad === 'Alta' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {log.prioridad || 'Media'}
                        </span>
                        
                        <span className="font-semibold text-zinc-500">
                          Téc: {log.operatorName}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <span className="text-xs text-zinc-400 font-semibold">No se registran OTs ingresadas hoy.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 text-center">
              <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest block">
                Sincronización de Base de Activos Industriales
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* View 2: High-end interactive Kanban Board */
        <div className="space-y-4">
          
          {/* Kanban Filters toolbar */}
          <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-100">
              <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-bold text-zinc-800 tracking-tight">Filtros Rápidos de Diagnóstico</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Search input query */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Buscar por OT, Cliente o Equipo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs bg-zinc-50/40 focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-700 font-semibold"
                />
              </div>

              {/* Tech Filter */}
              <div>
                <select
                  value={techFilter}
                  onChange={(e) => setTechFilter(e.target.value)}
                  className="w-full border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs bg-zinc-50/40 focus:outline-none text-zinc-600 font-semibold cursor-pointer"
                >
                  <option value="ALL">Todos los Técnicos</option>
                  {operators.map(op => (
                    <option key={op.id} value={op.id}>{op.name}</option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs bg-zinc-50/40 focus:outline-none text-zinc-600 font-semibold cursor-pointer"
                >
                  <option value="ALL">Todas las Prioridades</option>
                  <option value="Crítica">Prioridad Crítica</option>
                  <option value="Alta">Prioridad Alta</option>
                  <option value="Media">Prioridad Media</option>
                  <option value="Baja">Prioridad Baja</option>
                </select>
              </div>
            </div>
          </div>

          {/* Kanban Board Scrolling Columns Frame */}
          <div className="overflow-x-auto pb-4 scrollbar-thin select-none">
            <div className="flex gap-4 min-w-[1600px] h-[550px] items-stretch">
              
              {KANBAN_COLUMNS.map((colName) => {
                const columnOTs = otByColumn[colName] || [];
                return (
                  <div 
                    key={colName}
                    className="flex-1 min-w-[220px] bg-zinc-50 border border-zinc-200 rounded-xl p-3 flex flex-col justify-between"
                  >
                    {/* Column Header */}
                    <div>
                      <div className="flex items-center justify-between mb-3 border-b border-zinc-200 pb-2">
                        <span className="text-[11px] font-extrabold text-zinc-700 uppercase tracking-tight flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${
                            colName === 'Recepcionado' ? 'bg-zinc-400' :
                            colName === 'En diagnóstico' ? 'bg-blue-400 animate-pulse' :
                            colName === 'Esperando aprobación' ? 'bg-amber-400' :
                            colName === 'En reparación' ? 'bg-orange-400 animate-pulse' :
                            colName === 'Esperando repuestos' ? 'bg-red-400' :
                            colName === 'En prueba' ? 'bg-purple-400 animate-pulse' :
                            colName === 'Finalizado' ? 'bg-emerald-500' : 'bg-green-600'
                          }`} />
                          {colName}
                        </span>
                        <span className="bg-zinc-200/80 text-zinc-600 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full font-mono">
                          {columnOTs.length}
                        </span>
                      </div>

                      {/* Card Items List */}
                      <div className="space-y-3 overflow-y-auto max-h-[440px] pr-1 scrollbar-none">
                        {columnOTs.length > 0 ? (
                          columnOTs.map((ot) => (
                            <motion.div
                              key={ot.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`bg-white border rounded-xl p-3 shadow-xs space-y-2.5 hover:shadow-md transition-all cursor-pointer relative group ${
                                ot.prioridad === 'Crítica' ? 'border-l-[3.5px] border-l-rose-500 border-zinc-200' :
                                ot.prioridad === 'Alta' ? 'border-l-[3.5px] border-l-amber-500 border-zinc-200' :
                                'border-l-[3.5px] border-l-blue-500 border-zinc-200'
                              }`}
                            >
                              
                              {/* Card ID & Date Header */}
                              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 font-bold" onClick={() => handleCardClick(ot)}>
                                <span>{ot.id}</span>
                                <span>{ot.date}</span>
                              </div>

                              {/* Card Client & Equipment Name */}
                              <div onClick={() => handleCardClick(ot)} className="space-y-0.5">
                                <h5 className="text-[11px] font-extrabold text-zinc-800 leading-tight group-hover:text-blue-600 transition-colors">
                                  {ot.customerName}
                                </h5>
                                <p className="text-[10px] text-zinc-500 font-semibold truncate flex items-center gap-1">
                                  <Wrench className="w-2.5 h-2.5 text-zinc-400" />
                                  {ot.equipmentName || ot.motive}
                                </p>
                              </div>

                              {/* Quick Technician Info */}
                              <div onClick={() => handleCardClick(ot)} className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 pt-1">
                                <User className="w-3 h-3 text-zinc-400" />
                                <span>Téc: {ot.operatorName.replace('Téc. ', '').replace('Ing. ', '')}</span>
                              </div>

                              {/* Interactive controls: Step Transitions */}
                              <div className="flex items-center justify-between border-t border-zinc-100 pt-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleMoveStatus(ot, 'prev'); }}
                                  disabled={colName === 'Recepcionado'}
                                  className={`p-1 border border-zinc-150 rounded hover:bg-zinc-50 transition-colors cursor-pointer ${
                                    colName === 'Recepcionado' ? 'opacity-30 cursor-not-allowed' : ''
                                  }`}
                                  title="Mover a etapa anterior"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5 text-zinc-500 stroke-[2.5]" />
                                </button>

                                <span className="text-[8px] font-extrabold text-zinc-400 uppercase tracking-widest" onClick={() => handleCardClick(ot)}>
                                  Mover Etapa
                                </span>

                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleMoveStatus(ot, 'next'); }}
                                  disabled={colName === 'Entregado'}
                                  className={`p-1 border border-zinc-150 rounded hover:bg-zinc-50 transition-colors cursor-pointer ${
                                    colName === 'Entregado' ? 'opacity-30 cursor-not-allowed' : ''
                                  }`}
                                  title="Mover a etapa siguiente"
                                >
                                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500 stroke-[2.5]" />
                                </button>
                              </div>

                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-10 border border-dashed border-zinc-200 rounded-xl bg-zinc-100/10">
                            <span className="text-[10px] text-zinc-400 font-semibold">Vacío</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Column footer stats */}
                    <div className="text-[9px] font-extrabold text-zinc-400 border-t border-zinc-200/60 pt-2 mt-4 text-center select-none tracking-wide">
                      Total: ${columnOTs.reduce((acc, current) => acc + (current.costoMateriales || 0) + (current.costoManoObra || 0), 0)} USD
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
          
          <div className="bg-amber-50/60 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-800 leading-relaxed font-semibold flex gap-2.5 items-start">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-amber-900">Guía de Laboratorio Técnico</p>
              <p className="font-medium text-amber-800/90 mt-0.5">
                Las etapas del tablero representan el flujo continuo de ensayos y reparaciones industriales de RAC Ingeniería. Puede arrastrar o hacer clic en las flechas de movimiento rápido para actualizar el flujo. Al hacer clic en la tarjeta de cualquier OT se abrirá el panel completo de diagnóstico, cotización e insumos de stock.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Global OT Detail & Diagnosis Modal with stock subtraction */}
      <WorkOrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => { setSelectedOT(null); setIsDetailModalOpen(false); }}
        ot={selectedOT}
        customers={customers}
        operators={operators}
        stockItems={stockItems}
        onUpdateOT={onUpdateCallLog}
        onUpdateStock={onUpdateStockItems}
      />

    </div>
  );
}
