import React, { useState, useMemo } from 'react';
import { CallLog, Customer, Operator, StockItem, OTEstado } from '../types';
import { 
  X, Wrench, Shield, DollarSign, Calendar, Clock, 
  Layers, Package, Check, Play, Pause, FileText, 
  Trash2, Plus, Printer, AlertTriangle, AlertCircle, Info
} from 'lucide-react';
import { motion } from 'motion/react';

interface WorkOrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ot: CallLog | null;
  customers: Customer[];
  operators: Operator[];
  stockItems: StockItem[];
  onUpdateOT: (updatedOT: CallLog) => void;
  onUpdateStock: (updatedStock: StockItem[]) => void;
}

const OT_STATUSES: OTEstado[] = [
  'Recepcionado',
  'En diagnóstico',
  'Esperando aprobación',
  'En reparación',
  'Esperando repuestos',
  'En prueba',
  'Finalizado',
  'Entregado'
];

export default function WorkOrderDetailModal({
  isOpen,
  onClose,
  ot,
  customers,
  operators,
  stockItems,
  onUpdateOT,
  onUpdateStock
}: WorkOrderDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'ficha' | 'diagnostico' | 'repuestos' | 'pdf'>('ficha');
  
  // Local states synced with OT
  const [outcome, setOutcome] = useState<OTEstado>('Recepcionado');
  const [prioridad, setPrioridad] = useState<CallLog['prioridad']>('Media');
  const [operatorId, setOperatorId] = useState('');
  const [observations, setObservations] = useState('');
  const [fallaEncontrada, setFallaEncontrada] = useState('');
  const [costoMateriales, setCostoMateriales] = useState(0);
  const [costoManoObra, setCostoManoObra] = useState(0);
  const [horasTrabajadas, setHorasTrabajadas] = useState(0);
  const [garantiaMeses, setGarantiaMeses] = useState(6);
  const [nroRemito, setNroRemito] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  
  // Tasks/steps logger state
  const [newStepText, setNewStepText] = useState('');
  const [tareasRealizadas, setTareasRealizadas] = useState<string[]>([]);

  // Parts consumption states
  const [selectedStockId, setSelectedStockId] = useState('');
  const [partQty, setPartQty] = useState(1);
  const [partsError, setPartsError] = useState('');

  // Audio simulation
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioRef] = useState<HTMLAudioElement | null>(null);

  // Sync state when OT changes
  React.useEffect(() => {
    if (ot) {
      setOutcome(ot.outcome);
      setPrioridad(ot.prioridad || 'Media');
      setOperatorId(ot.operatorId);
      setObservations(ot.observations);
      setFallaEncontrada(ot.fallaEncontrada || '');
      setCostoMateriales(ot.costoMateriales || 0);
      setCostoManoObra(ot.costoManoObra || 0);
      setHorasTrabajadas(ot.horasTrabajadas || 0);
      setGarantiaMeses(ot.garantiaMeses || 6);
      setNroRemito(ot.nroRemito || '');
      setFechaEntrega(ot.fechaEntrega || '');
      setTareasRealizadas(ot.tareasRealizadas || []);
      setPartsError('');
      
      if (stockItems.length > 0) {
        setSelectedStockId(stockItems[0].id);
      }
    }
  }, [ot, stockItems]);

  const customer = useMemo(() => {
    if (!ot) return null;
    return customers.find(c => c.id === ot.customerId) || null;
  }, [ot, customers]);

  const assignedOperatorObj = useMemo(() => {
    if (!ot) return null;
    return operators.find(op => op.id === operatorId) || null;
  }, [ot, operators, operatorId]);

  if (!isOpen || !ot) return null;

  // Save technical updates
  const handleSaveAll = () => {
    const updatedOT: CallLog = {
      ...ot,
      outcome,
      prioridad,
      operatorId,
      operatorName: operators.find(o => o.id === operatorId)?.name || ot.operatorName,
      observations,
      fallaEncontrada,
      costoMateriales,
      costoManoObra,
      horasTrabajadas,
      garantiaMeses,
      nroRemito: outcome === 'Entregado' ? nroRemito || `R-0004-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      fechaEntrega: outcome === 'Entregado' || outcome === 'Finalizado' ? fechaEntrega || '2026-08-03' : undefined,
      tareasRealizadas
    };
    onUpdateOT(updatedOT);
  };

  // Status step incrementer
  const handleStatusChange = (newStatus: OTEstado) => {
    setOutcome(newStatus);
    const updatedOT: CallLog = {
      ...ot,
      outcome: newStatus,
      prioridad,
      operatorId,
      observations,
      fallaEncontrada,
      costoMateriales,
      costoManoObra,
      horasTrabajadas,
      garantiaMeses,
      tareasRealizadas
    };
    if (newStatus === 'Entregado' && !fechaEntrega) {
      updatedOT.fechaEntrega = '2026-08-03';
      updatedOT.nroRemito = nroRemito || `R-0004-${Math.floor(1000 + Math.random() * 9000)}`;
      setFechaEntrega('2026-08-03');
      setNroRemito(updatedOT.nroRemito);
    }
    onUpdateOT(updatedOT);
  };

  // Append new technical task step
  const handleAddStep = () => {
    if (!newStepText.trim()) return;
    const newList = [...tareasRealizadas, newStepText.trim()];
    setTareasRealizadas(newList);
    setNewStepText('');
    
    // Auto-save OT with new step
    const updatedOT: CallLog = {
      ...ot,
      tareasRealizadas: newList
    };
    onUpdateOT(updatedOT);
  };

  const handleDeleteStep = (index: number) => {
    const newList = tareasRealizadas.filter((_, idx) => idx !== index);
    setTareasRealizadas(newList);
    
    const updatedOT: CallLog = {
      ...ot,
      tareasRealizadas: newList
    };
    onUpdateOT(updatedOT);
  };

  // Add spare part and decrement stock ledger
  const handleConsumePart = () => {
    setPartsError('');
    if (!selectedStockId) return;

    const stockItem = stockItems.find(s => s.id === selectedStockId);
    if (!stockItem) {
      setPartsError('Repuesto no encontrado.');
      return;
    }

    if (partQty <= 0) {
      setPartsError('La cantidad debe ser mayor que cero.');
      return;
    }

    if (stockItem.cantidad < partQty) {
      setPartsError(`Stock insuficiente. Solo quedan ${stockItem.cantidad} unidades disponibles.`);
      return;
    }

    // Decrement stock ledger
    const updatedStock = stockItems.map(s => {
      if (s.id === selectedStockId) {
        return {
          ...s,
          cantidad: s.cantidad - partQty
        };
      }
      return s;
    });

    // Append to OT parts used list
    const existingParts = ot.repuestosUtilizados || [];
    const existingIndex = existingParts.findIndex(p => p.id === selectedStockId);
    
    let updatedParts = [...existingParts];
    if (existingIndex >= 0) {
      updatedParts[existingIndex] = {
        ...updatedParts[existingIndex],
        cantidad: updatedParts[existingIndex].cantidad + partQty
      };
    } else {
      updatedParts.push({
        id: stockItem.id,
        codigo: stockItem.codigo,
        descripcion: stockItem.descripcion,
        cantidad: partQty
      });
    }

    // Calculate added cost
    const costToAdd = stockItem.precioUnitario * partQty;
    const newMaterialCost = costoMateriales + costToAdd;

    setCostoMateriales(newMaterialCost);

    // Update global state
    const updatedOT: CallLog = {
      ...ot,
      repuestosUtilizados: updatedParts,
      costoMateriales: newMaterialCost
    };

    onUpdateStock(updatedStock);
    onUpdateOT(updatedOT);
    setPartQty(1);
  };

  // Remove used spare part and return to stock ledger
  const handleRemovePart = (partId: string, quantityUsed: number) => {
    const originalStockItem = stockItems.find(s => s.id === partId);
    if (!originalStockItem) return;

    // Return to stock
    const updatedStock = stockItems.map(s => {
      if (s.id === partId) {
        return {
          ...s,
          cantidad: s.cantidad + quantityUsed
        };
      }
      return s;
    });

    // Remove from OT list
    const updatedParts = (ot.repuestosUtilizados || []).filter(p => p.id !== partId);

    // Decrement cost
    const costToRemove = originalStockItem.precioUnitario * quantityUsed;
    const newMaterialCost = Math.max(0, costoMateriales - costToRemove);
    setCostoMateriales(newMaterialCost);

    const updatedOT: CallLog = {
      ...ot,
      repuestosUtilizados: updatedParts,
      costoMateriales: newMaterialCost
    };

    onUpdateStock(updatedStock);
    onUpdateOT(updatedOT);
  };

  // Trigger print view
  const handlePrint = () => {
    window.print();
  };

  const totalPrice = costoMateriales + costoManoObra;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/40 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-zinc-200/90 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header Block */}
        <div className="px-6 py-4 bg-zinc-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-sm shadow-md">
              OT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold tracking-tight font-mono">{ot.id}</h3>
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                  prioridad === 'Crítica' ? 'bg-rose-500 text-white animate-pulse' :
                  prioridad === 'Alta' ? 'bg-amber-500 text-white' :
                  prioridad === 'Media' ? 'bg-blue-500 text-white' : 'bg-zinc-600 text-white'
                }`}>
                  {prioridad}
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                {ot.equipmentName} — Cliente: <strong className="text-zinc-300">{ot.customerName}</strong>
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-zinc-50 border-b border-zinc-200/80 px-6 py-1 shrink-0">
          <button
            onClick={() => setActiveTab('ficha')}
            className={`px-4 py-3 text-xs font-bold border-b-2 -mb-[1px] transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ficha'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-zinc-400 hover:text-zinc-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            Ficha de Reparación
          </button>
          <button
            onClick={() => setActiveTab('diagnostico')}
            className={`px-4 py-3 text-xs font-bold border-b-2 -mb-[1px] transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'diagnostico'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-zinc-400 hover:text-zinc-700'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Diagnóstico Técnico
          </button>
          <button
            onClick={() => setActiveTab('repuestos')}
            className={`px-4 py-3 text-xs font-bold border-b-2 -mb-[1px] transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'repuestos'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-zinc-400 hover:text-zinc-700'
            }`}
          >
            <Package className="w-4 h-4" />
            Repuestos & Stock
          </button>
          <button
            onClick={() => setActiveTab('pdf')}
            className={`px-4 py-3 text-xs font-bold border-b-2 -mb-[1px] transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pdf'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-zinc-400 hover:text-zinc-700'
            }`}
          >
            <Printer className="w-4 h-4" />
            Presupuesto Formal
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {activeTab === 'ficha' && (
            <div className="space-y-6">
              
              {/* Progress Stepper of Technical States */}
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-3">
                  Etapa Técnica Activa (Laboratorio)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                  {OT_STATUSES.map((status, idx) => {
                    const isSelected = outcome === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleStatusChange(status)}
                        className={`py-2 px-1 text-[10px] font-bold rounded-lg border text-center transition-all cursor-pointer leading-tight ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-800'
                        }`}
                      >
                        <div className="font-mono text-[9px] text-zinc-400 mb-0.5 font-bold">0{idx + 1}</div>
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grid with metadata */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Technical Info card */}
                <div className="border border-zinc-200/80 bg-zinc-50/40 rounded-xl p-4 space-y-3.5">
                  <h4 className="text-xs font-bold text-zinc-800 border-b border-zinc-200/60 pb-2 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-zinc-400" />
                    Detalles del Activo Industrial
                  </h4>
                  <div className="text-xs space-y-2">
                    <div>
                      <span className="text-[10px] text-zinc-400 block font-semibold">Equipo / Categoría</span>
                      <span className="font-bold text-zinc-800">{ot.equipmentName || ot.motive}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block font-semibold">Técnico de Turno</span>
                      <span className="font-bold text-zinc-800">{ot.operatorName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block font-semibold">Fecha de Recepción</span>
                      <span className="font-semibold text-zinc-700 font-mono">{ot.date} @ {ot.time} hs</span>
                    </div>
                  </div>
                </div>

                {/* 2. Plant Details card */}
                <div className="border border-zinc-200/80 bg-zinc-50/40 rounded-xl p-4 space-y-3.5">
                  <h4 className="text-xs font-bold text-zinc-800 border-b border-zinc-200/60 pb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-zinc-400" />
                    Origen y Planta Industrial
                  </h4>
                  <div className="text-xs space-y-2">
                    <div>
                      <span className="text-[10px] text-zinc-400 block font-semibold">Razón Social</span>
                      <span className="font-bold text-zinc-800">{ot.customerName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block font-semibold">Planta / Sector</span>
                      <span className="font-semibold text-zinc-700">{customer?.planta || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block font-semibold">CUIT de la Empresa</span>
                      <span className="font-mono font-bold text-zinc-600">{customer?.cuit || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Status summary card */}
                <div className="border border-zinc-200/80 bg-zinc-50/40 rounded-xl p-4 space-y-3.5">
                  <h4 className="text-xs font-bold text-zinc-800 border-b border-zinc-200/60 pb-2 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
                    Resumen Financiero & Tiempos
                  </h4>
                  <div className="text-xs space-y-2">
                    <div>
                      <span className="text-[10px] text-zinc-400 block font-semibold">Insumos y Repuestos</span>
                      <span className="font-bold text-zinc-800 font-mono">${costoMateriales} USD</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block font-semibold">Mano de Obra Certificada</span>
                      <span className="font-bold text-zinc-800 font-mono">${costoManoObra} USD</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 block font-semibold">Total de Presupuesto</span>
                      <span className="font-extrabold text-blue-600 font-mono text-sm">${totalPrice} USD</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Voice Notes & Reception Symptom Observations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Síntomas Reportados en Recepción</label>
                  <p className="text-xs text-zinc-700 bg-zinc-50 p-4 border border-zinc-200/80 rounded-xl leading-relaxed font-medium">
                    {observations || "No se especificaron observaciones durante el ingreso del equipo."}
                  </p>
                </div>

                {/* Technical audio record playback */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Nota de Voz de Ingreso</label>
                  {ot.audioUrl ? (
                    <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
                      <button
                        onClick={() => {
                          const sound = new Audio(ot.audioUrl);
                          sound.play();
                        }}
                        className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shrink-0 cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </button>
                      <div>
                        <span className="text-xs font-bold text-zinc-800 block">Grabación de Recepción</span>
                        <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">Haga clic para reproducir la nota del operador</span>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-zinc-200/80 rounded-xl p-4 text-center text-xs text-zinc-400 py-6 bg-zinc-50/30">
                      No se adjuntaron notas de voz de diagnóstico en el ingreso.
                    </div>
                  )}
                </div>

              </div>

              {/* Steps completed on lab log */}
              <div className="border border-zinc-200/80 rounded-xl p-5 bg-white space-y-4">
                <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Bitácora de Tareas en Laboratorio (Bench Log)
                </h4>

                {/* Add new task inline */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Registrar nueva tarea realizada en mesa de trabajo (ej. Limpieza por ultrasonido)..."
                    value={newStepText}
                    onChange={(e) => setNewStepText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddStep(); }}
                    className="flex-1 px-3 py-1.5 border border-zinc-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddStep}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Registrar
                  </button>
                </div>

                {/* List items */}
                <div className="space-y-2">
                  {tareasRealizadas.length > 0 ? (
                    tareasRealizadas.map((step, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between gap-3 p-2.5 bg-zinc-50 hover:bg-zinc-100/50 border border-zinc-150 rounded-lg text-xs"
                      >
                        <div className="flex items-center gap-2 font-medium text-zinc-700">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 stroke-[2.5]" />
                          <span>{step}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteStep(idx)}
                          className="p-1 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-xs text-zinc-400">
                      No se han asentado tareas de laboratorio para esta OT todavía.
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {activeTab === 'diagnostico' && (
            <div className="space-y-5">
              <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider pb-1 border-b border-zinc-100 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-600" />
                Informe de Diagnóstico de Laboratorio
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Técnico Encargado de la Reparación</label>
                  <select
                    value={operatorId}
                    onChange={(e) => setOperatorId(e.target.value)}
                    className="w-full border border-zinc-200 rounded-lg px-3 py-2 bg-zinc-50/40 text-xs font-semibold text-zinc-700 focus:outline-none cursor-pointer"
                  >
                    {operators.map(op => (
                      <option key={op.id} value={op.id}>{op.name} ({op.role})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Prioridad de Trabajo</label>
                  <select
                    value={prioridad}
                    onChange={(e) => setPrioridad(e.target.value as any)}
                    className="w-full border border-zinc-200 rounded-lg px-3 py-2 bg-zinc-50/40 text-xs font-semibold text-zinc-700 focus:outline-none cursor-pointer"
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Diagnóstico Técnico y Causa Raíz Encontrada *</label>
                <textarea
                  rows={4}
                  placeholder="Detallar los hallazgos tras revisar el equipo en el banco de pruebas. Especificar integrados averiados, pistas cortadas, valores de rizado, tensiones de bypass medidas..."
                  value={fallaEncontrada}
                  onChange={(e) => setFallaEncontrada(e.target.value)}
                  className="w-full border border-zinc-200 rounded-lg p-3 text-xs bg-zinc-50/40 focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-700 font-semibold leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Horas de Banco Trabajadas</label>
                  <input
                    type="number"
                    value={horasTrabajadas}
                    onChange={(e) => setHorasTrabajadas(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full border border-zinc-200 rounded-lg px-3 py-2 bg-zinc-50/40 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Garantía Certificada (Meses)</label>
                  <input
                    type="number"
                    value={garantiaMeses}
                    onChange={(e) => setGarantiaMeses(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full border border-zinc-200 rounded-lg px-3 py-2 bg-zinc-50/40 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Fecha de Entrega/Despacho</label>
                  <input
                    type="date"
                    value={fechaEntrega}
                    onChange={(e) => setFechaEntrega(e.target.value)}
                    className="w-full border border-zinc-200 rounded-lg px-3 py-1.5 bg-zinc-50/40 text-xs text-zinc-600 font-mono"
                  />
                </div>
              </div>

              {outcome === 'Entregado' && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[9px] font-bold text-blue-700 uppercase block mb-1">Nro de Remito de Despacho</label>
                    <input
                      type="text"
                      placeholder="R-0004-XXXX"
                      value={nroRemito}
                      onChange={(e) => setNroRemito(e.target.value)}
                      className="w-full border border-blue-200 rounded-md p-1.5 bg-white text-xs font-mono font-bold text-zinc-800"
                    />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-blue-700 font-medium leading-normal mt-3">
                    <Info className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>El remito firmado es obligatorio para la validación de la garantía extendida de RAC Ingeniería.</span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-zinc-150 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Guardar Informe de Diagnóstico
                </button>
              </div>

            </div>
          )}

          {activeTab === 'repuestos' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-1 border-b border-zinc-100">
                <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  Asociación de Repuestos & Consumo de Stock
                </h4>
                <span className="text-[10px] text-zinc-400 font-medium">Asociación directa que actualiza el inventario en tiempo real.</span>
              </div>

              {/* Consumer controller panel */}
              <div className="border border-zinc-200 bg-zinc-50/50 p-4 rounded-xl space-y-4">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Registrar Consumo de Repuesto</span>
                
                {partsError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-lg text-rose-600 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{partsError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  
                  <div className="md:col-span-6">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase block mb-1">Insumo Electrónico disponible en Stock</label>
                    <select
                      value={selectedStockId}
                      onChange={(e) => setSelectedStockId(e.target.value)}
                      className="w-full border border-zinc-200 rounded-lg p-2 bg-white text-xs font-semibold text-zinc-700 cursor-pointer"
                    >
                      {stockItems.map(item => (
                        <option 
                          key={item.id} 
                          value={item.id}
                          disabled={item.cantidad <= 0}
                        >
                          {item.codigo} — {item.descripcion} (Quedan: {item.cantidad} u) — ${item.precioUnitario} USD
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase block mb-1 font-semibold">Cantidad a Usar</label>
                    <input
                      type="number"
                      min={1}
                      value={partQty}
                      onChange={(e) => setPartQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full border border-zinc-200 rounded-lg p-2 bg-white text-xs font-mono font-bold"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <button
                      type="button"
                      onClick={handleConsumePart}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[2.2]" />
                      Consumir Stock
                    </button>
                  </div>

                </div>
              </div>

              {/* Parts already consumed */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Repuestos Utilizados en esta Reparación</span>
                
                {ot.repuestosUtilizados && ot.repuestosUtilizados.length > 0 ? (
                  <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-xl overflow-hidden bg-white">
                    {ot.repuestosUtilizados.map(part => {
                      // find price for display
                      const price = stockItems.find(s => s.id === part.id)?.precioUnitario || 0;
                      return (
                        <div key={part.id} className="flex items-center justify-between p-3.5 hover:bg-zinc-55 text-xs">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-zinc-800">{part.codigo}</p>
                            <p className="text-[10px] text-zinc-400 truncate mt-0.5">{part.descripcion}</p>
                          </div>
                          
                          <div className="flex items-center gap-6 shrink-0 ml-4">
                            <div className="text-right">
                              <span className="text-[10px] text-zinc-400 font-semibold block">Cantidad</span>
                              <span className="font-bold text-zinc-700 font-mono">{part.cantidad} unidades</span>
                            </div>
                            
                            <div className="text-right">
                              <span className="text-[10px] text-zinc-400 font-semibold block">Costo Subtotal</span>
                              <span className="font-extrabold text-zinc-900 font-mono">${price * part.cantidad} USD</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemovePart(part.id, part.cantidad)}
                              className="p-1 text-zinc-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Remover y devolver a stock"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/20 text-xs text-zinc-400">
                    No se han registrado componentes electrónicos consumidos del almacén para esta orden de trabajo.
                  </div>
                )}
              </div>

              {/* Budgets values details */}
              <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 pt-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Costo Total de Materiales (USD)</label>
                  <input
                    type="number"
                    value={costoMateriales}
                    onChange={(e) => setCostoMateriales(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full border border-zinc-200 rounded-lg px-3 py-2 bg-zinc-50/40 text-xs font-mono font-bold"
                  />
                  <p className="text-[9px] text-zinc-400 mt-1">Este costo se actualiza automáticamente al consumir repuestos de stock, pero se puede sobrescribir si es necesario.</p>
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Costo de Mano de Obra (Banco / Ensayo)</label>
                  <input
                    type="number"
                    value={costoManoObra}
                    onChange={(e) => setCostoManoObra(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full border border-zinc-200 rounded-lg px-3 py-2 bg-zinc-50/40 text-xs font-mono font-bold text-blue-600"
                  />
                  <p className="text-[9px] text-zinc-400 mt-1">Cálculo en base a las horas de taller y complejidad técnica.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-150 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Guardar Financiamiento de OT
                </button>
              </div>

            </div>
          )}

          {activeTab === 'pdf' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-150">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Previsualización de Presupuesto Técnico
                </span>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir / Descargar PDF
                </button>
              </div>

              {/* Printable Area with border shadow styled */}
              <div className="p-8 border border-zinc-250 bg-white rounded-xl shadow-xs max-w-2xl mx-auto text-zinc-800 space-y-6" id="printable-area-quote">
                
                {/* PDF Header */}
                <div className="flex items-start justify-between border-b-2 border-zinc-900 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-zinc-950 text-white font-black text-xs flex items-center justify-center rounded">RAC</div>
                      <span className="font-extrabold text-sm tracking-tight uppercase">RAC INGENIERÍA</span>
                    </div>
                    <p className="text-[9px] text-zinc-500 font-bold leading-normal uppercase">
                      Reparación de Electrónica Industrial & Servomotores<br />
                      Laboratorios de Ensayos Dinámicos en Carga<br />
                      Buenos Aires, Argentina | CUIT: 30-71458921-3
                    </p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-base font-extrabold text-zinc-900 uppercase">PRESUPUESTO TÉCNICO</h2>
                    <p className="text-xs font-mono font-bold text-blue-600 mt-1">{ot.id}</p>
                    <p className="text-[9px] text-zinc-400 mt-0.5">Fecha: {ot.date}</p>
                  </div>
                </div>

                {/* Cliente details */}
                <div className="grid grid-cols-2 gap-4 text-xs border-b border-zinc-150 pb-4">
                  <div className="space-y-1">
                    <span className="text-[9px] text-zinc-400 font-bold block uppercase">DATOS DE FACTURACIÓN</span>
                    <p className="font-extrabold text-zinc-950">{ot.customerName}</p>
                    <p className="text-[10px] text-zinc-600">CUIT: {customer?.cuit || 'N/A'}</p>
                    <p className="text-[10px] text-zinc-500">{customer?.planta || 'N/A'}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="text-[9px] text-zinc-400 font-bold block uppercase">ACTIVO ELECTRÓNICO</span>
                    <p className="font-extrabold text-zinc-900">{ot.equipmentName || ot.motive}</p>
                    <p className="text-[10px] text-zinc-600 font-medium">Responsable: {ot.operatorName}</p>
                    <p className="text-[10px] text-zinc-500">Garantía Ofrecida: {garantiaMeses} Meses</p>
                  </div>
                </div>

                {/* Diagnosis Summary Block */}
                <div className="space-y-2 text-xs border-b border-zinc-150 pb-4">
                  <span className="text-[9px] text-zinc-400 font-bold block uppercase">INFORME DE ENSAYOS & DIAGNÓSTICO DE INGRESO</span>
                  <div>
                    <span className="text-[9px] text-zinc-400 font-bold">Falla Inicial Reportada:</span>
                    <p className="text-[11px] text-zinc-700 italic mt-0.5 font-medium leading-relaxed">"{ot.observations}"</p>
                  </div>
                  {fallaEncontrada && (
                    <div className="mt-2.5">
                      <span className="text-[9px] text-zinc-400 font-bold">Causa Raíz de Falla Constatada:</span>
                      <p className="text-[11px] text-zinc-800 mt-0.5 font-bold leading-relaxed">{fallaEncontrada}</p>
                    </div>
                  )}
                </div>

                {/* Materials & Parts Breakdown Table */}
                <div className="space-y-2">
                  <span className="text-[9px] text-zinc-400 font-bold block uppercase">DETALLE DE INSUMOS & RECONSTRUCCIÓN</span>
                  <table className="w-full text-left text-xs divide-y divide-zinc-200">
                    <thead>
                      <tr className="text-[9px] text-zinc-400 font-bold uppercase">
                        <th className="pb-1.5">Código / Descripción</th>
                        <th className="pb-1.5 text-center">Cantidad</th>
                        <th className="pb-1.5 text-right">Precio Unitario</th>
                        <th className="pb-1.5 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-150">
                      {ot.repuestosUtilizados && ot.repuestosUtilizados.length > 0 ? (
                        ot.repuestosUtilizados.map(part => {
                          const up = stockItems.find(s => s.id === part.id)?.precioUnitario || 0;
                          return (
                            <tr key={part.id} className="text-[10px] font-medium text-zinc-700">
                              <td className="py-2">
                                <span className="font-bold text-zinc-900 block">{part.codigo}</span>
                                <span className="text-[9px] text-zinc-400 block">{part.descripcion}</span>
                              </td>
                              <td className="py-2 text-center font-bold">{part.cantidad}</td>
                              <td className="py-2 text-right font-mono">${up} USD</td>
                              <td className="py-2 text-right font-bold font-mono">${up * part.cantidad} USD</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr className="text-[10px] text-zinc-500 italic">
                          <td colSpan={4} className="py-2">Servicio técnico de diagnóstico y limpieza general de componentes.</td>
                        </tr>
                      )}
                      
                      {/* Bench Labor row */}
                      <tr className="text-[10px] font-medium text-zinc-700">
                        <td className="py-2" colSpan={2}>
                          <span className="font-bold text-zinc-900 block">Horas de Banco & Pruebas Dinámicas</span>
                          <span className="text-[9px] text-zinc-400 block">Certificación de aislamiento en carga e informe de ensayos térmicos ({horasTrabajadas} hs).</span>
                        </td>
                        <td className="py-2 text-right font-mono">N/A</td>
                        <td className="py-2 text-right font-bold font-mono">${costoManoObra} USD</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Total box */}
                <div className="flex justify-end pt-3 border-t-2 border-zinc-900">
                  <div className="text-right space-y-1">
                    <p className="text-[10px] text-zinc-400 font-bold">TOTAL NETO PRESUPUESTO TÉCNICO</p>
                    <p className="text-xl font-black text-blue-600 font-mono tracking-tighter">${totalPrice} USD</p>
                    <p className="text-[8px] text-zinc-400 font-semibold uppercase">Valores expresados en dólares estadounidenses pagaderos a tipo de cambio oficial.</p>
                  </div>
                </div>

                {/* Terms fine print */}
                <div className="bg-zinc-50 p-3.5 rounded-lg border border-zinc-200/60 text-[8px] text-zinc-500 leading-normal space-y-1">
                  <p className="font-bold text-zinc-700 uppercase tracking-wider">TÉRMINOS Y CONDICIONES DE GARANTÍA INDUSTRIAL</p>
                  <p>
                    1. La presente garantía técnica cubre defectos de mano de obra y de los componentes reemplazados listados en este documento por un plazo de {garantiaMeses} meses a partir de la firma del remito de despacho.
                  </p>
                  <p>
                    2. No se cubrirán daños derivados de transitorios de red eléctrica, golpes de tensión atmosféricos, mala parametrización, sobrecargas continuadas fuera de la placa de datos del equipo, presencia de humedad extrema IP descalificada, u operaciones por personal no certificado.
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer actions block */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200/80 flex items-center justify-between shrink-0">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
            Modificación Protegida por Bitácora Técnica
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Cerrar Panel
            </button>
            <button
              onClick={() => {
                handleSaveAll();
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Guardar y Salir
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
