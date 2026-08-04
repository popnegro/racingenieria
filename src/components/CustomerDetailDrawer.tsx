import React, { useState, useMemo } from 'react';
import { 
  X, Phone, Mail, FileText, User, Tag, Calendar, Plus, Trash2, 
  CheckCircle2, Save, MapPin, Play, Pause, Volume2, 
  Wrench, Cpu, AlertCircle, Edit3, RefreshCw
} from 'lucide-react';
import { Customer, CustomerStatus, CallLog, Operator, Equipment, OTEstado } from '../types';
import StatusBadge from './StatusBadge';
import { motion, AnimatePresence } from 'motion/react';

interface CustomerDetailDrawerProps {
  id: string;
  customer: Customer | null;
  onClose: () => void;
  operators: Operator[];
  customerCalls: CallLog[];
  onUpdateCustomer: (updatedCustomer: Customer) => void;
  onInitiateCall: (customer: Customer) => void;
  onInitiateEmail: (customer: Customer) => void;
  equipments: Equipment[];
  onAddEquipment: (eq: Equipment) => void;
  onUpdateEquipment: (eq: Equipment) => void;
  onDeleteEquipment: (eqId: string) => void;
}

export default function CustomerDetailDrawer({
  id,
  customer,
  onClose,
  operators,
  customerCalls,
  onUpdateCustomer,
  onInitiateCall,
  onInitiateEmail,
  equipments,
  onAddEquipment,
  onUpdateEquipment,
  onDeleteEquipment
}: CustomerDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<'equipos' | 'ots' | 'ficha'>('equipos');
  const [newNote, setNewNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Call audio note states
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Equipment Form States (Add)
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEqFabricante, setNewEqFabricante] = useState('');
  const [newEqModelo, setNewEqModelo] = useState('');
  const [newEqSerie, setNewEqSerie] = useState('');
  const [newEqCategoria, setNewEqCategoria] = useState<Equipment['categoria']>('Variador de Frecuencia');
  const [newEqPotencia, setNewEqPotencia] = useState('');
  const [newEqTension, setNewEqTension] = useState('');
  const [newEqStatus, setNewEqStatus] = useState<Equipment['status']>('En Laboratorio');
  const [newEqObs, setNewEqObs] = useState('');

  // Equipment Form States (Edit)
  const [editingEqId, setEditingEqId] = useState<string | null>(null);
  const [editEqFabricante, setEditEqFabricante] = useState('');
  const [editEqModelo, setEditEqModelo] = useState('');
  const [editEqSerie, setEditEqSerie] = useState('');
  const [editEqCategoria, setEditEqCategoria] = useState<Equipment['categoria']>('Variador de Frecuencia');
  const [editEqPotencia, setEditEqPotencia] = useState('');
  const [editEqTension, setEditEqTension] = useState('');
  const [editEqStatus, setEditEqStatus] = useState<Equipment['status']>('En Laboratorio');
  const [editEqObs, setEditEqObs] = useState('');

  const toggleCallAudio = (callId: string, audioUrl: string) => {
    if (playingAudioId === callId) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingAudioId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => {
        setPlayingAudioId(null);
      };
      audio.play().catch(e => console.error(e));
      setPlayingAudioId(callId);
    }
  };

  // Stop audio playback when drawer is closed or customer changes
  React.useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingAudioId(null);
    };
  }, [customer]);
  
  // Edit customer profile states
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editPlanta, setEditPlanta] = useState('');
  const [editIndustria, setEditIndustria] = useState<Customer['industria']>('Siderúrgica');

  // Sync state when customer changes
  React.useEffect(() => {
    if (customer) {
      setEditName(customer.name);
      setEditPhone(customer.phone);
      setEditEmail(customer.email);
      setEditCompany(customer.company || customer.razonSocial);
      setEditPlanta(customer.planta);
      setEditIndustria(customer.industria || 'Siderúrgica');
      setIsEditing(false);
      setShowAddForm(false);
      setEditingEqId(null);
    }
  }, [customer]);

  if (!customer) return null;

  // Filter equipments belonging to this customer
  const clientEquipments = useMemo(() => {
    return equipments.filter(eq => eq.clientId === customer.id);
  }, [equipments, customer.id]);

  // Handle Note Addition
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    const updatedCustomer: Customer = {
      ...customer,
      notes: [newNote.trim(), ...customer.notes]
    };
    onUpdateCustomer(updatedCustomer);
    setNewNote('');
  };

  // Handle Note Deletion
  const handleDeleteNote = (indexToDelete: number) => {
    const updatedCustomer: Customer = {
      ...customer,
      notes: customer.notes.filter((_, idx) => idx !== indexToDelete)
    };
    onUpdateCustomer(updatedCustomer);
  };

  // Update Customer Status directly
  const handleStatusChange = (status: CustomerStatus) => {
    const updatedCustomer: Customer = {
      ...customer,
      status
    };
    onUpdateCustomer(updatedCustomer);
  };

  // Update Operator directly
  const handleOperatorChange = (assignedTo: string) => {
    const updatedCustomer: Customer = {
      ...customer,
      assignedTo
    };
    onUpdateCustomer(updatedCustomer);
  };

  // Save General profile edits
  const handleSaveProfile = () => {
    const updatedCustomer: Customer = {
      ...customer,
      name: editName,
      razonSocial: editName,
      company: editCompany,
      phone: editPhone,
      email: editEmail,
      planta: editPlanta,
      industria: editIndustria
    };
    onUpdateCustomer(updatedCustomer);
    setIsEditing(false);
  };

  // Equipment Add Submit
  const handleSaveNewEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEqFabricante.trim() || !newEqModelo.trim() || !newEqSerie.trim()) return;

    const newId = `EQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEq: Equipment = {
      id: newId,
      clientId: customer.id,
      clientName: customer.name,
      fabricante: newEqFabricante.trim(),
      modelo: newEqModelo.trim(),
      nroSerie: newEqSerie.trim(),
      categoria: newEqCategoria,
      potencia: newEqPotencia.trim() || 'N/A',
      tension: newEqTension.trim() || 'N/A',
      status: newEqStatus,
      observaciones: newEqObs.trim()
    };

    onAddEquipment(newEq);

    // Clear form
    setNewEqFabricante('');
    setNewEqModelo('');
    setNewEqSerie('');
    setNewEqCategoria('Variador de Frecuencia');
    setNewEqPotencia('');
    setNewEqTension('');
    setNewEqStatus('En Laboratorio');
    setNewEqObs('');
    setShowAddForm(false);
  };

  // Equipment Edit Trigger
  const handleStartEditEquipment = (eq: Equipment) => {
    setEditingEqId(eq.id);
    setEditEqFabricante(eq.fabricante);
    setEditEqModelo(eq.modelo);
    setEditEqSerie(eq.nroSerie);
    setEditEqCategoria(eq.categoria);
    setEditEqPotencia(eq.potencia);
    setEditEqTension(eq.tension);
    setEditEqStatus(eq.status);
    setEditEqObs(eq.observaciones);
  };

  // Equipment Edit Save
  const handleSaveEditedEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEqId) return;

    const updatedEq: Equipment = {
      id: editingEqId,
      clientId: customer.id,
      clientName: customer.name,
      fabricante: editEqFabricante.trim(),
      modelo: editEqModelo.trim(),
      nroSerie: editEqSerie.trim(),
      categoria: editEqCategoria,
      potencia: editEqPotencia.trim(),
      tension: editEqTension.trim(),
      status: editEqStatus,
      observaciones: editEqObs.trim()
    };

    onUpdateEquipment(updatedEq);
    setEditingEqId(null);
  };

  // Compute OT status statistics
  const otStats = useMemo(() => {
    const total = customerCalls.length;
    const activeStates: OTEstado[] = ['Recepcionado', 'En diagnóstico', 'Esperando aprobación', 'En reparación', 'Esperando repuestos', 'En prueba'];
    const active = customerCalls.filter(call => activeStates.includes(call.outcome as OTEstado)).length;
    const completed = customerCalls.filter(call => ['Finalizado', 'Entregado'].includes(call.outcome)).length;
    return { total, active, completed };
  }, [customerCalls]);

  return (
    <div id={id} className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900 cursor-pointer"
      />

      {/* Drawer Body */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 border-l border-zinc-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-2 py-1 bg-zinc-100 text-zinc-500 rounded-md">
              {customer.id}
            </span>
            <h3 className="font-bold text-zinc-900 tracking-tight">Ficha de Cliente</h3>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-200/60 rounded-lg text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Main Visual Card */}
          <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-xl flex items-start gap-4">
            <img
              src={customer.avatar}
              alt={customer.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
            />
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full text-base font-bold text-zinc-900 px-2 py-1 border border-zinc-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Razón Social"
                  />
                  <input
                    type="text"
                    value={editCompany}
                    placeholder="Compañía / Planta"
                    onChange={(e) => setEditCompany(e.target.value)}
                    className="w-full text-xs text-zinc-600 px-2 py-1 border border-zinc-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <>
                  <h4 className="text-lg font-bold text-zinc-900 truncate tracking-tight">{customer.name}</h4>
                  <p className="text-xs text-zinc-500 font-semibold flex items-center gap-1 mt-0.5">
                    <span className="text-zinc-400">CUIT:</span> <span className="font-mono">{customer.cuit}</span>
                  </p>
                </>
              )}
              
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                <StatusBadge status={customer.status} />
                <span className="text-[10px] text-zinc-400 font-mono font-medium ml-1">
                  Último contacto: {customer.lastContact}
                </span>
              </div>
            </div>
          </div>

          {/* Action Grid Controls */}
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => onInitiateCall(customer)}
              className="flex flex-col items-center justify-center p-3 border border-zinc-200 hover:border-emerald-200 hover:bg-emerald-50 text-zinc-600 hover:text-emerald-700 rounded-xl transition-all font-semibold gap-1 text-[11px] cursor-pointer"
            >
              <Phone className="w-4 h-4 stroke-[2]" />
              Llamar
            </button>
            <button
              onClick={() => onInitiateEmail(customer)}
              className="flex flex-col items-center justify-center p-3 border border-zinc-200 hover:border-blue-200 hover:bg-blue-50 text-zinc-600 hover:text-blue-700 rounded-xl transition-all font-semibold gap-1 text-[11px] cursor-pointer"
            >
              <Mail className="w-4 h-4 stroke-[2]" />
              Email
            </button>
            <button
              onClick={() => {
                if (isEditing) {
                  handleSaveProfile();
                } else {
                  setIsEditing(true);
                  setActiveTab('ficha'); // switch to ficha to make inputs visible
                }
              }}
              className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-all font-semibold gap-1 text-[11px] cursor-pointer ${
                isEditing
                  ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                  : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-600'
              }`}
            >
              {isEditing ? <Save className="w-4 h-4 stroke-[2]" /> : <FileText className="w-4 h-4 stroke-[2]" />}
              {isEditing ? 'Guardar' : 'Editar Ficha'}
            </button>
            <button
              onClick={() => handleStatusChange(customer.status === 'Activo' ? 'Inactivo' : 'Activo')}
              className="flex flex-col items-center justify-center p-3 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-600 rounded-xl transition-all font-semibold gap-1 text-[11px] cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 stroke-[2]" />
              {customer.status === 'Activo' ? 'Desactivar' : 'Activar'}
            </button>
          </div>

          {/* Tab Selector Section */}
          <div className="flex border-b border-zinc-200">
            <button
              type="button"
              onClick={() => setActiveTab('equipos')}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                activeTab === 'equipos'
                  ? 'border-zinc-900 text-zinc-950'
                  : 'border-transparent text-zinc-400 hover:text-zinc-600'
              }`}
            >
              Equipos ({clientEquipments.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ots')}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                activeTab === 'ots'
                  ? 'border-zinc-900 text-zinc-950'
                  : 'border-transparent text-zinc-400 hover:text-zinc-600'
              }`}
            >
              Historial OTs ({customerCalls.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ficha')}
              className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                activeTab === 'ficha'
                  ? 'border-zinc-900 text-zinc-950'
                  : 'border-transparent text-zinc-400 hover:text-zinc-600'
              }`}
            >
              Ficha & Notas
            </button>
          </div>

          {/* TAB 1: EQUIPOS EN PLANTA */}
          {activeTab === 'equipos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Activos en Planta</h5>
                <button
                  type="button"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {showAddForm ? 'Cerrar' : 'Registrar Equipo'}
                </button>
              </div>

              {/* Add Equipment Form inline */}
              <AnimatePresence>
                {showAddForm && (
                  <motion.form 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleSaveNewEquipment}
                    className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-3 overflow-hidden text-xs"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Fabricante *</label>
                        <input
                          type="text"
                          required
                          placeholder="ej. Siemens, ABB"
                          value={newEqFabricante}
                          onChange={(e) => setNewEqFabricante(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Modelo *</label>
                        <input
                          type="text"
                          required
                          placeholder="ej. Sinamics S120"
                          value={newEqModelo}
                          onChange={(e) => setNewEqModelo(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Nro de Serie / SN *</label>
                        <input
                          type="text"
                          required
                          placeholder="ej. SN-98321-X"
                          value={newEqSerie}
                          onChange={(e) => setNewEqSerie(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Categoría</label>
                        <select
                          value={newEqCategoria}
                          onChange={(e) => setNewEqCategoria(e.target.value as Equipment['categoria'])}
                          className="w-full px-2 py-1.5 border border-zinc-200 rounded-md bg-white focus:outline-none cursor-pointer"
                        >
                          <option value="Variador de Frecuencia">Variador de Frecuencia</option>
                          <option value="Servocontrolador">Servocontrolador</option>
                          <option value="PLC">PLC</option>
                          <option value="HMI">HMI</option>
                          <option value="Fuente Industrial">Fuente Industrial</option>
                          <option value="Control Numérico (CNC)">Control Numérico (CNC)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Potencia</label>
                        <input
                          type="text"
                          placeholder="ej. 45 kW"
                          value={newEqPotencia}
                          onChange={(e) => setNewEqPotencia(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Tensión</label>
                        <input
                          type="text"
                          placeholder="ej. 380V Trifásico"
                          value={newEqTension}
                          onChange={(e) => setNewEqTension(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Estado Técnico</label>
                        <select
                          value={newEqStatus}
                          onChange={(e) => setNewEqStatus(e.target.value as Equipment['status'])}
                          className="w-full px-2 py-1.5 border border-zinc-200 rounded-md bg-white focus:outline-none cursor-pointer"
                        >
                          <option value="Operativo">Operativo</option>
                          <option value="En Laboratorio">En Laboratorio</option>
                          <option value="Falla Reportada">Falla Reportada</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Observaciones</label>
                      <input
                        type="text"
                        placeholder="Detalles sobre el ingreso o fallas reportadas"
                        value={newEqObs}
                        onChange={(e) => setNewEqObs(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="px-3 py-1.5 bg-zinc-200 text-zinc-700 hover:bg-zinc-300 font-bold rounded-md transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 font-bold rounded-md transition-colors cursor-pointer"
                      >
                        Guardar Equipo
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Equipments List */}
              <div className="space-y-3">
                {clientEquipments.length > 0 ? (
                  clientEquipments.map((eq) => (
                    <div
                      key={eq.id}
                      className="p-4 bg-zinc-50/70 border border-zinc-200/80 rounded-xl relative group transition-all hover:bg-zinc-50"
                    >
                      {editingEqId === eq.id ? (
                        /* Inline Edit Form */
                        <form onSubmit={handleSaveEditedEquipment} className="space-y-3 text-xs">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Fabricante</label>
                              <input
                                type="text"
                                required
                                value={editEqFabricante}
                                onChange={(e) => setEditEqFabricante(e.target.value)}
                                className="w-full px-2 py-1 border border-zinc-200 rounded-md bg-white"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Modelo</label>
                              <input
                                type="text"
                                required
                                value={editEqModelo}
                                onChange={(e) => setEditEqModelo(e.target.value)}
                                className="w-full px-2 py-1 border border-zinc-200 rounded-md bg-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Nro de Serie</label>
                              <input
                                type="text"
                                required
                                value={editEqSerie}
                                onChange={(e) => setEditEqSerie(e.target.value)}
                                className="w-full px-2 py-1 border border-zinc-200 rounded-md bg-white"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Categoría</label>
                              <select
                                value={editEqCategoria}
                                onChange={(e) => setEditEqCategoria(e.target.value as Equipment['categoria'])}
                                className="w-full px-2 py-1 border border-zinc-200 rounded-md bg-white"
                              >
                                <option value="Variador de Frecuencia">Variador de Frecuencia</option>
                                <option value="Servocontrolador">Servocontrolador</option>
                                <option value="PLC">PLC</option>
                                <option value="HMI">HMI</option>
                                <option value="Fuente Industrial">Fuente Industrial</option>
                                <option value="Control Numérico (CNC)">Control Numérico (CNC)</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Potencia</label>
                              <input
                                type="text"
                                value={editEqPotencia}
                                onChange={(e) => setEditEqPotencia(e.target.value)}
                                className="w-full px-2 py-1 border border-zinc-200 rounded-md bg-white"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Tensión</label>
                              <input
                                type="text"
                                value={editEqTension}
                                onChange={(e) => setEditEqTension(e.target.value)}
                                className="w-full px-2 py-1 border border-zinc-200 rounded-md bg-white"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Estado</label>
                              <select
                                value={editEqStatus}
                                onChange={(e) => setEditEqStatus(e.target.value as Equipment['status'])}
                                className="w-full px-2 py-1 border border-zinc-200 rounded-md bg-white"
                              >
                                <option value="Operativo">Operativo</option>
                                <option value="En Laboratorio">En Laboratorio</option>
                                <option value="Falla Reportada">Falla Reportada</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Observaciones</label>
                            <input
                              type="text"
                              value={editEqObs}
                              onChange={(e) => setEditEqObs(e.target.value)}
                              className="w-full px-2 py-1 border border-zinc-200 rounded-md bg-white"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => setEditingEqId(null)}
                              className="px-2.5 py-1 bg-zinc-200 text-zinc-700 font-bold rounded"
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className="px-2.5 py-1 bg-blue-600 text-white font-bold rounded"
                            >
                              Guardar
                            </button>
                          </div>
                        </form>
                      ) : (
                        /* Standard View Card */
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-mono font-bold text-zinc-500 bg-zinc-200/60 px-1.5 py-0.5 rounded">
                                  {eq.id}
                                </span>
                                <h6 className="font-bold text-zinc-800 text-sm">
                                  {eq.fabricante} {eq.modelo}
                                </h6>
                              </div>
                              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mt-1">
                                {eq.categoria}
                              </span>
                            </div>
                            
                            {/* Technical Status indicators */}
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold border ${
                              eq.status === 'Operativo'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : eq.status === 'En Laboratorio'
                                ? 'bg-amber-50 border-amber-200 text-amber-700'
                                : 'bg-rose-50 border-rose-200 text-rose-700'
                            }`}>
                              <span className={`w-1 h-1 rounded-full ${
                                eq.status === 'Operativo' ? 'bg-emerald-500' : eq.status === 'En Laboratorio' ? 'bg-amber-500' : 'bg-rose-500'
                              }`} />
                              {eq.status}
                            </span>
                          </div>

                          {/* Technical attributes */}
                          <div className="grid grid-cols-3 gap-2 mt-3 text-xs border-t border-zinc-100 pt-2.5 font-medium text-zinc-500">
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block">Número de Serie</span>
                              <span className="font-mono text-zinc-700">{eq.nroSerie}</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block">Potencia</span>
                              <span className="text-zinc-700">{eq.potencia}</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block">Tensión de Red</span>
                              <span className="text-zinc-700">{eq.tension}</span>
                            </div>
                          </div>

                          {eq.observaciones && (
                            <p className="text-[11px] text-zinc-500 mt-2.5 bg-zinc-100/60 rounded-md p-2 border border-zinc-200/40">
                              <span className="font-bold text-zinc-600 block text-[9px] uppercase tracking-wider mb-0.5">Observación de Ingreso</span>
                              {eq.observaciones}
                            </p>
                          )}

                          {/* Action overlay on hover */}
                          <div className="absolute right-2.5 bottom-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                              type="button"
                              onClick={() => handleStartEditEquipment(eq)}
                              className="p-1 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all cursor-pointer"
                              title="Editar Atributos"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteEquipment(eq.id)}
                              className="p-1 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all cursor-pointer"
                              title="Eliminar Equipo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 border border-dashed border-zinc-200 rounded-xl">
                    <Wrench className="w-8 h-8 text-zinc-300 mx-auto stroke-[1.5] mb-2" />
                    <span className="text-xs text-zinc-400 block">No hay equipos registrados en planta para este cliente.</span>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(true)}
                      className="text-xs font-bold text-blue-600 mt-2 hover:underline cursor-pointer"
                    >
                      Añadir el primer equipo activo
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: HISTORIAL DE OTS / WORK ORDERS */}
          {activeTab === 'ots' && (
            <div className="space-y-6">
              {/* Statistical KPI sub-row */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-zinc-50 border border-zinc-100 p-2.5 rounded-lg">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">OTs Totales</span>
                  <span className="text-lg font-bold text-zinc-800">{otStats.total}</span>
                </div>
                <div className="bg-blue-50/50 border border-blue-100 p-2.5 rounded-lg">
                  <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider block">En Taller</span>
                  <span className="text-lg font-bold text-blue-700">{otStats.active}</span>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-lg">
                  <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider block">Entregados</span>
                  <span className="text-lg font-bold text-emerald-700">{otStats.completed}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Historial de Órdenes de Trabajo</h5>
                
                {customerCalls.length > 0 ? (
                  <div className="relative border-l border-zinc-200 pl-4 ml-2.5 space-y-5">
                    {customerCalls.map((call) => (
                      <div key={call.id} className="relative">
                        {/* Dot indicator aligned with timeline */}
                        <span className="absolute -left-[20.5px] top-1.5 w-3 h-3 rounded-full bg-blue-100 border-2 border-blue-600" />
                        
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-mono font-bold text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded">
                                {call.id}
                              </span>
                              <span className="text-xs font-bold text-zinc-800">
                                {call.motive}
                              </span>
                            </div>
                            <span className="text-[10px] text-zinc-400 font-mono font-bold">
                              {call.date}
                            </span>
                          </div>

                          {call.equipmentName && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-500">
                              <Cpu className="w-3 h-3 text-zinc-400" />
                              {call.equipmentName}
                            </span>
                          )}
                          
                          <p className="text-[11px] text-zinc-500 leading-normal bg-zinc-50 p-2 rounded border border-zinc-100 mt-1">
                            {call.observations}
                          </p>

                          {/* Voice Note attachments */}
                          {call.audioUrl && (
                            <div className="mt-2 bg-blue-50/40 border border-blue-100/60 rounded-lg p-2 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => toggleCallAudio(call.id, call.audioUrl!)}
                                  className="w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shadow-sm shrink-0 cursor-pointer"
                                >
                                  {playingAudioId === call.id ? (
                                    <Pause className="w-2.5 h-2.5 fill-current" />
                                  ) : (
                                    <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                                  )}
                                </button>
                                <div className="min-w-0">
                                  <span className="text-[10px] font-bold text-zinc-700 block truncate leading-tight">
                                    Nota de voz técnica (Diagnóstico)
                                  </span>
                                  <span className="text-[9px] text-zinc-400 font-mono block font-bold">
                                    {playingAudioId === call.id ? 'Reproduciendo...' : 'Grabado en banco'}
                                  </span>
                                </div>
                              </div>
                              <Volume2 className={`w-3.5 h-3.5 ${playingAudioId === call.id ? 'text-blue-600 animate-pulse' : 'text-zinc-400'}`} />
                            </div>
                          )}

                          {call.fallaEncontrada && (
                            <div className="bg-rose-50/50 border border-rose-100 rounded p-2 text-[11px] mt-1 text-rose-800">
                              <span className="font-bold text-rose-700 block text-[9px] uppercase tracking-wider mb-0.5">Falla Encontrada</span>
                              {call.fallaEncontrada}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-[10px] pt-1.5 text-zinc-400 font-semibold">
                            <StatusBadge status={call.outcome as OTEstado} className="scale-90 origin-left" />
                            <span>Técnico: {call.operatorName}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed border-zinc-200 rounded-xl">
                    <span className="text-xs text-zinc-400">No se registran órdenes de trabajo asociadas a esta planta.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: FICHA DE DATOS & NOTAS GENERALES */}
          {activeTab === 'ficha' && (
            <div className="space-y-6">
              {/* Quick Assignments & Details */}
              <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-4">
                <h5 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Gestión & Contacto</h5>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Assignee select */}
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                      Técnico Supervisor
                    </label>
                    <div className="flex items-center gap-1.5 border border-zinc-200 rounded-lg px-2 py-1.5 bg-zinc-50/50">
                      <User className="w-4 h-4 text-zinc-400" />
                      <select
                        value={customer.assignedTo}
                        onChange={(e) => handleOperatorChange(e.target.value)}
                        className="text-xs font-semibold text-zinc-700 focus:outline-none bg-transparent cursor-pointer flex-1"
                      >
                        {operators.map(op => (
                          <option key={op.id} value={op.name}>{op.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Status Select */}
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                      Estado de Cuenta
                    </label>
                    <div className="flex items-center gap-1.5 border border-zinc-200 rounded-lg px-2 py-1.5 bg-zinc-50/50">
                      <Tag className="w-4 h-4 text-zinc-400" />
                      <select
                        value={customer.status}
                        onChange={(e) => handleStatusChange(e.target.value as CustomerStatus)}
                        className="text-xs font-semibold text-zinc-700 focus:outline-none bg-transparent cursor-pointer flex-1"
                      >
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact and Plant info fields */}
                <div className="space-y-3 pt-3 border-t border-zinc-100 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Ubicación Planta / Fábrica</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editPlanta}
                        onChange={(e) => setEditPlanta(e.target.value)}
                        className="w-full px-2 py-1.5 border border-zinc-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="font-semibold text-zinc-800 block bg-zinc-50 p-2 rounded border border-zinc-100">{customer.planta}</span>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Rubro Industrial / Industria</label>
                    {isEditing ? (
                      <select
                        value={editIndustria}
                        onChange={(e) => setEditIndustria(e.target.value as Customer['industria'])}
                        className="w-full px-2 py-1.5 border border-zinc-200 rounded-md bg-white focus:outline-none cursor-pointer"
                      >
                        <option value="Siderúrgica">Siderúrgica</option>
                        <option value="Alimenticia">Alimenticia</option>
                        <option value="Automotriz">Automotriz</option>
                        <option value="Química">Química</option>
                        <option value="Cemento">Cemento</option>
                        <option value="Energía">Energía</option>
                        <option value="Metalúrgica">Metalúrgica</option>
                        <option value="Papelera">Papelera</option>
                      </select>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200 mt-1">
                        {customer.industria}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Teléfono Directo</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full font-mono px-2 py-1.5 border border-zinc-200 rounded-md bg-white"
                        />
                      ) : (
                        <span className="font-semibold font-mono text-zinc-700">{customer.phone}</span>
                      )}
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Email Corporativo</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full font-mono px-2 py-1.5 border border-zinc-200 rounded-md bg-white"
                        />
                      ) : (
                        <span className="font-semibold font-mono text-zinc-700 block truncate" title={customer.email}>{customer.email}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Management */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Bitácora Interna de Notas</h5>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-full font-mono">
                    {customer.notes.length}
                  </span>
                </div>

                {/* Quick add note form */}
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Escribir nota o reporte para la bitácora..."
                    className="flex-1 text-xs px-3 py-2 border border-zinc-200 rounded-lg placeholder-zinc-400 focus:outline-none focus:border-zinc-400 transition-colors bg-zinc-50/50"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </form>

                {/* Notes List */}
                <div className="space-y-2">
                  {customer.notes.map((note, index) => (
                    <div
                      key={index}
                      className="p-3 bg-zinc-50/70 border border-zinc-100 rounded-lg relative group transition-colors hover:bg-zinc-50 flex justify-between gap-3 items-start"
                    >
                      <p className="text-xs text-zinc-700 font-semibold leading-relaxed flex-1">{note}</p>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(index)}
                        className="p-1 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Eliminar Nota"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
