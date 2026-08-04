import React, { useState, useMemo } from 'react';
import { Customer, Operator, Equipment, OTEstado } from '../types';
import { 
  Wrench, User, Calendar, MessageSquare, AlertCircle, Search, 
  Sparkles, Mic, Square, Trash2, Play, Pause, Volume2, 
  RefreshCw, Cpu, Tag, Server, CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

interface WorkOrderFormProps {
  id: string;
  customers: Customer[];
  operators: Operator[];
  equipments: Equipment[];
  preselectedCustomer?: Customer | null;
  onSubmitWorkOrder: (data: {
    customerId: string;
    operatorId: string;
    motive: string; // Equipment category / Primary symptom
    outcome: OTEstado; // 'Recepcionado'
    observations: string; // Reception symptoms & comments
    followUpDate?: string; // Target completion date
    audioUrl?: string; // Voice notes
    
    // OT Specific fields
    equipmentId: string; // 'new' or existing EQ ID
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
}

const FAULT_SYMPTOMS = [
  'Falla de encendido / Fuente muerta',
  'Falla de disparo / IGBT quemado',
  'Alarma de sobretensión / Bus de CC',
  'Error de comunicación (Profibus / Profinet)',
  'Falla de encoder / Pérdida de feedback',
  'Error térmico / Sobretemperatura activa',
  'Falla de software / Firmware corrupto',
  'Daño físico en panel LCD / Pantalla táctil rota',
  'Mantenimiento preventivo general',
  'Otro síntoma de falla...'
];

export default function WorkOrderForm({
  id,
  customers,
  operators,
  equipments,
  preselectedCustomer,
  onSubmitWorkOrder
}: WorkOrderFormProps) {
  // Search state for customer filter
  const [customerSearch, setCustomerSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Selection states
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedOperatorId, setSelectedOperatorId] = useState(operators[0]?.id || '');
  const [symptom, setSymptom] = useState(FAULT_SYMPTOMS[0]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [observations, setObservations] = useState('');
  const [prioridad, setPrioridad] = useState<'Baja' | 'Media' | 'Alta' | 'Crítica'>('Media');
  
  // Equipment selection states
  const [selectedEquipmentId, setSelectedEquipmentId] = useState('');
  
  // New equipment inline form states
  const [newEqFabricante, setNewEqFabricante] = useState('');
  const [newEqModelo, setNewEqModelo] = useState('');
  const [newEqSerie, setNewEqSerie] = useState('');
  const [newEqCategoria, setNewEqCategoria] = useState<Equipment['categoria']>('Variador de Frecuencia');
  const [newEqPotencia, setNewEqPotencia] = useState('');
  const [newEqTension, setNewEqTension] = useState('');

  // Target datepicker states
  const [scheduleFollowUp, setScheduleFollowUp] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpTime, setFollowUpTime] = useState('17:00');
  
  // Error state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Real-time derived validation state
  const isFormInvalid = useMemo(() => {
    if (!selectedCustomerId) return true;
    if (!selectedEquipmentId) return true;
    if (selectedEquipmentId === 'new') {
      if (!newEqFabricante.trim() || !newEqModelo.trim() || !newEqSerie.trim()) return true;
    }
    if (!observations.trim()) return true;
    if (symptom === 'Otro motivo personalizado...' && !customSymptom.trim()) return true;
    return false;
  }, [
    selectedCustomerId,
    selectedEquipmentId,
    newEqFabricante,
    newEqModelo,
    newEqSerie,
    observations,
    symptom,
    customSymptom
  ]);

  // Microphone recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [recordingMode, setRecordingMode] = useState<'real' | 'simulated'>('real');
  
  // Audio playback ref
  const audioPlaybackRef = React.useRef<HTMLAudioElement | null>(null);
  
  // MediaRecorder refs
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Clean up playback on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioPlaybackRef.current) {
        audioPlaybackRef.current.pause();
      }
    };
  }, []);

  // Sync preselected customer if provided
  React.useEffect(() => {
    if (preselectedCustomer) {
      setSelectedCustomerId(preselectedCustomer.id);
      setCustomerSearch(preselectedCustomer.name);
      setSelectedEquipmentId(''); // clear to trigger recalculation
    }
  }, [preselectedCustomer]);

  // Find the selected customer object
  const selectedCustomerObj = useMemo(() => {
    return customers.find(c => c.id === selectedCustomerId);
  }, [customers, selectedCustomerId]);

  // Filter equipments for this client
  const clientEquipments = useMemo(() => {
    if (!selectedCustomerId) return [];
    return equipments.filter(eq => eq.clientId === selectedCustomerId);
  }, [equipments, selectedCustomerId]);

  // Set default equipment when customer or equipment list changes
  React.useEffect(() => {
    if (clientEquipments.length > 0) {
      setSelectedEquipmentId(clientEquipments[0].id);
    } else {
      setSelectedEquipmentId('new');
    }
  }, [clientEquipments, selectedCustomerId]);

  // Filter customers for the search dropdown
  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers.slice(0, 5);
    return customers.filter(c =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.cuit.includes(customerSearch) ||
      c.planta.toLowerCase().includes(customerSearch.toLowerCase())
    ).slice(0, 5);
  }, [customers, customerSearch]);

  const startRecording = async () => {
    setError('');
    audioChunksRef.current = [];
    setRecordingSeconds(0);
    
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        setRecordingMode('real');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(audioBlob);
          setRecordedUrl(url);
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        
        timerRef.current = setInterval(() => {
          setRecordingSeconds(prev => prev + 1);
        }, 1000);
      } else {
        simulateRecording();
      }
    } catch (err: any) {
      console.warn("MediaRecorder failed or was blocked, starting simulator:", err);
      simulateRecording();
    }
  };

  const simulateRecording = () => {
    setRecordingMode('simulated');
    setIsRecording(true);
    timerRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (recordingMode === 'real' && mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(false);
      generateSyntheticAudioBlob();
    }
  };

  const generateSyntheticAudioBlob = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const dest = audioCtx.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(dest.stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
      };

      mediaRecorder.start();

      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(dest);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, audioCtx.currentTime); 
      osc.frequency.exponentialRampToValueAtTime(480, audioCtx.currentTime + 1.2);
      
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 2.0);

      osc.start();
      osc.stop(audioCtx.currentTime + 2.0);

      setTimeout(() => {
        mediaRecorder.stop();
        audioCtx.close();
      }, 2100);

    } catch (e) {
      console.error("Audio Synthesis fallback failed:", e);
      setRecordedUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    }
  };

  const deleteRecording = () => {
    if (recordedUrl && recordedUrl.startsWith('blob:')) {
      URL.revokeObjectURL(recordedUrl);
    }
    setRecordedUrl(null);
    setRecordingSeconds(0);
    setIsPlayingAudio(false);
    if (audioPlaybackRef.current) {
      audioPlaybackRef.current.pause();
      audioPlaybackRef.current = null;
    }
  };

  const togglePlayback = () => {
    if (!recordedUrl) return;
    
    if (audioPlaybackRef.current) {
      if (isPlayingAudio) {
        audioPlaybackRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        audioPlaybackRef.current.play().catch(e => console.error(e));
        setIsPlayingAudio(true);
      }
    } else {
      const audio = new Audio(recordedUrl);
      audioPlaybackRef.current = audio;
      audio.onended = () => {
        setIsPlayingAudio(false);
      };
      audio.play().catch(e => console.error(e));
      setIsPlayingAudio(true);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedCustomerId) {
      setError('Por favor, selecciona un cliente corporativo.');
      return;
    }

    if (!selectedEquipmentId) {
      setError('Por favor, selecciona o registra un equipo.');
      return;
    }

    if (selectedEquipmentId === 'new') {
      if (!newEqFabricante.trim() || !newEqModelo.trim() || !newEqSerie.trim()) {
        setError('Por favor, completa los campos obligatorios del nuevo equipo (Fabricante, Modelo y Serie).');
        return;
      }
    }

    if (!observations.trim()) {
      setError('Por favor, describe los síntomas o el motivo del ingreso.');
      return;
    }

    const finalSymptom = symptom === 'Otro motivo personalizado...' ? customSymptom : symptom;
    if (symptom === 'Otro motivo personalizado...' && !customSymptom.trim()) {
      setError('Por favor, especifica el síntoma de falla.');
      return;
    }

    // Prepare data
    const submitData = {
      customerId: selectedCustomerId,
      operatorId: selectedOperatorId,
      motive: finalSymptom,
      outcome: 'Recepcionado' as OTEstado,
      observations: observations.trim(),
      followUpDate: scheduleFollowUp && followUpDate ? `${followUpDate} ${followUpTime}`.trim() : undefined,
      audioUrl: recordedUrl || undefined,
      equipmentId: selectedEquipmentId,
      newEquipment: selectedEquipmentId === 'new' ? {
        fabricante: newEqFabricante.trim(),
        modelo: newEqModelo.trim(),
        nroSerie: newEqSerie.trim(),
        categoria: newEqCategoria,
        potencia: newEqPotencia.trim() || 'N/A',
        tension: newEqTension.trim() || 'N/A'
      } : undefined,
      prioridad
    };

    onSubmitWorkOrder(submitData);

    // Reset Form
    setSuccess(true);
    setObservations('');
    setCustomSymptom('');
    setScheduleFollowUp(false);
    setFollowUpDate('');
    setRecordedUrl(null);
    setRecordingSeconds(0);
    setIsPlayingAudio(false);
    audioPlaybackRef.current = null;
    
    // Reset new eq fields
    setNewEqFabricante('');
    setNewEqModelo('');
    setNewEqSerie('');
    setNewEqCategoria('Variador de Frecuencia');
    setNewEqPotencia('');
    setNewEqTension('');

    setTimeout(() => {
      setSuccess(false);
    }, 4000);
  };

  return (
    <div id={id} className="bg-white border border-zinc-200/80 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] p-6">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100">
        <Wrench className="w-5 h-5 text-blue-600 stroke-[2.2]" />
        <div>
          <h4 className="text-sm font-bold text-zinc-900 tracking-tight">Recepción e Ingreso de Equipo</h4>
          <p className="text-xs text-zinc-400 mt-0.5">Asienta el ingreso al laboratorio y genera una nueva Orden de Trabajo (OT).</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Error Notification */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-rose-600 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Notification */}
        {success && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-700 text-xs font-bold flex items-center gap-2.5 animate-pulse">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
            <div>
              <p className="font-bold">¡Orden de Trabajo Generada!</p>
              <p className="font-normal text-[11px] text-emerald-600 mt-0.5">El equipo ingresó a taller de inmediato. El historial técnico y la bitácora han sido actualizados.</p>
            </div>
          </div>
        )}

        {/* 1. Customer Search Selection */}
        <div className="relative">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
            Cliente / Razón Social <span className="text-rose-500">*</span>
          </label>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar cliente por Razón Social, CUIT o Planta..."
              value={customerSearch}
              onFocus={() => setShowDropdown(true)}
              onChange={(e) => {
                setCustomerSearch(e.target.value);
                setSelectedCustomerId(''); // Clear if typing
                setShowDropdown(true);
              }}
              className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-lg text-xs bg-zinc-50/40 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all font-semibold text-zinc-800"
            />
          </div>

          {/* Search Dropdown Panel */}
          {showDropdown && (
            <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg max-h-56 overflow-y-auto divide-y divide-zinc-100">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(customer => (
                  <button
                    key={customer.id}
                    type="button"
                    onClick={() => {
                      setSelectedCustomerId(customer.id);
                      setCustomerSearch(customer.name);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 transition-colors flex items-center gap-2.5"
                  >
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-800 truncate">{customer.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">{customer.planta} — CUIT: {customer.cuit}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-zinc-400 text-xs">No se encontraron clientes</div>
              )}
            </div>
          )}
          
          {/* Badge indicator for preselected client */}
          {selectedCustomerObj && (
            <div className="mt-2.5 p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg flex items-center justify-between text-xs">
              <span className="font-medium text-blue-700">
                Seleccionado: <strong className="font-bold">{selectedCustomerObj.name}</strong> ({selectedCustomerObj.planta})
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedCustomerId('');
                  setCustomerSearch('');
                  setSelectedEquipmentId('');
                }}
                className="text-[10px] text-zinc-400 hover:text-zinc-600 font-bold px-1.5 py-0.5 hover:bg-zinc-100 rounded cursor-pointer"
              >
                Limpiar
              </button>
            </div>
          )}
        </div>

        {/* 2. Equipment Selection / Registration */}
        {selectedCustomerId && (
          <div className="p-4 bg-zinc-50/50 border border-zinc-200/60 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Equipo a Intervenir
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedEquipmentId('new')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded border transition-colors cursor-pointer ${
                    selectedEquipmentId === 'new'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  Registrar Nuevo Equipo
                </button>
                {clientEquipments.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedEquipmentId(clientEquipments[0].id)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded border transition-colors cursor-pointer ${
                      selectedEquipmentId !== 'new'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    Elegir de Planta ({clientEquipments.length})
                  </button>
                )}
              </div>
            </div>

            {selectedEquipmentId !== 'new' && clientEquipments.length > 0 ? (
              /* Dropdown of existing equipments */
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Equipos en Planta de {selectedCustomerObj?.name}</label>
                <div className="flex items-center gap-2 border border-zinc-200 rounded-lg px-3 py-2 bg-white">
                  <Cpu className="w-4 h-4 text-zinc-400" />
                  <select
                    value={selectedEquipmentId}
                    onChange={(e) => setSelectedEquipmentId(e.target.value)}
                    className="text-xs font-semibold text-zinc-700 focus:outline-none bg-transparent cursor-pointer flex-1"
                  >
                    {clientEquipments.map(eq => (
                      <option key={eq.id} value={eq.id}>{eq.fabricante} {eq.modelo} (S/N: {eq.nroSerie})</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              /* Inline form to register new equipment */
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3 pt-2 text-xs border-t border-zinc-200/60"
              >
                <p className="text-[10px] font-semibold text-zinc-400 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-zinc-400 animate-pulse" />
                  Registrando equipo en base de activos...
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-zinc-400 uppercase block mb-1">Fabricante *</label>
                    <input
                      type="text"
                      placeholder="Siemens, ABB, Fanuc..."
                      value={newEqFabricante}
                      onChange={(e) => setNewEqFabricante(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-zinc-400 uppercase block mb-1">Modelo *</label>
                    <input
                      type="text"
                      placeholder="Sinamics S120, etc."
                      value={newEqModelo}
                      onChange={(e) => setNewEqModelo(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-zinc-400 uppercase block mb-1">Nro de Serie (S/N) *</label>
                    <input
                      type="text"
                      placeholder="S/N original del fabricante"
                      value={newEqSerie}
                      onChange={(e) => setNewEqSerie(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-zinc-400 uppercase block mb-1">Categoría Técnica</label>
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-zinc-400 uppercase block mb-1">Potencia</label>
                    <input
                      type="text"
                      placeholder="ej. 45 kW, 10 HP"
                      value={newEqPotencia}
                      onChange={(e) => setNewEqPotencia(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-zinc-400 uppercase block mb-1">Tensión Nominal</label>
                    <input
                      type="text"
                      placeholder="ej. 380V Trifásico, 24VCC"
                      value={newEqTension}
                      onChange={(e) => setNewEqTension(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-md bg-white"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* 3. Assigned Technician & Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
              Técnico Asignado de Laboratorio <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2 border border-zinc-200 rounded-lg px-3 py-2 bg-zinc-50/40">
              <User className="w-4 h-4 text-zinc-400" />
              <select
                value={selectedOperatorId}
                onChange={(e) => setSelectedOperatorId(e.target.value)}
                className="text-xs font-semibold text-zinc-700 focus:outline-none bg-transparent cursor-pointer flex-1"
              >
                {operators.map(op => (
                  <option key={op.id} value={op.id}>{op.name} ({op.role})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
              Prioridad / Criticidad <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2 border border-zinc-200 rounded-lg px-3 py-2 bg-zinc-50/40">
              <Tag className="w-4 h-4 text-zinc-400" />
              <select
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value as any)}
                className="text-xs font-semibold text-zinc-700 focus:outline-none bg-transparent cursor-pointer flex-1"
              >
                <option value="Baja">Baja (Mantenimiento preventivo)</option>
                <option value="Media">Media (Falla no urgente)</option>
                <option value="Alta">Alta (Línea operativa lenta)</option>
                <option value="Crítica">Crítica (Planta Parada)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Fault symptom selection */}
        <div>
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
            Síntoma Primario / Falla Reportada <span className="text-rose-500">*</span>
          </label>
          <select
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            className="w-full border border-zinc-200 rounded-lg px-3 py-2 bg-zinc-50/40 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-semibold text-zinc-700 cursor-pointer"
          >
            {FAULT_SYMPTOMS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
            <option value="Otro motivo personalizado...">Otro síntoma de falla...</option>
          </select>

          {symptom === 'Otro motivo personalizado...' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2"
            >
              <input
                type="text"
                placeholder="Describir síntoma personalizado..."
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                className="w-full border border-zinc-200 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-zinc-400 font-medium"
              />
            </motion.div>
          )}
        </div>

        {/* 5. Observations */}
        <div>
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
            Estado de Recepción e Instrucciones Iniciales <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
            <textarea
              rows={3}
              placeholder="Describir las condiciones físicas de recepción (ej. suciedad extrema, conectores faltantes) y las instrucciones iniciales de desmontaje/diagnóstico en el taller..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-zinc-200 rounded-lg text-xs bg-zinc-50/40 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all text-zinc-700 leading-relaxed font-semibold"
            />
          </div>
        </div>

        {/* Technical Voice Note Grabber */}
        <div className="border border-zinc-200/80 rounded-xl p-4 bg-zinc-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className={`w-4 h-4 ${isRecording ? 'text-rose-500 animate-pulse' : 'text-zinc-400'}`} />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Grabadora de Diagnóstico Inicial (Audio)
              </span>
            </div>
            {recordedUrl && (
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                Audio Adjunto
              </span>
            )}
          </div>

          {!isRecording && !recordedUrl ? (
            <button
              type="button"
              onClick={startRecording}
              className="w-full py-2 bg-white hover:bg-zinc-100/50 border border-zinc-200 rounded-lg flex items-center justify-center gap-2 text-xs font-bold text-zinc-700 transition-colors cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-blue-600 stroke-[2.5]" />
              Grabar Nota de Voz de Recepción
            </button>
          ) : isRecording ? (
            <div className="bg-rose-50/40 border border-rose-100/60 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-end gap-0.5 h-5">
                  <span className="w-0.75 bg-rose-500 h-2 rounded animate-[bounce_0.8s_infinite]" />
                  <span className="w-0.75 bg-rose-500 h-4 rounded animate-[bounce_0.5s_infinite_0.15s]" />
                  <span className="w-0.75 bg-rose-500 h-3 rounded animate-[bounce_0.7s_infinite_0.3s]" />
                  <span className="w-0.75 bg-rose-500 h-5 rounded animate-[bounce_0.6s_infinite_0.45s]" />
                  <span className="w-0.75 bg-rose-500 h-2 rounded animate-[bounce_0.9s_infinite_0.6s]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-rose-600 font-mono">
                    {formatTime(recordingSeconds)}
                  </span>
                  <span className="text-[9px] font-semibold text-rose-400 block -mt-0.5 uppercase">
                    Grabando... {recordingMode === 'simulated' ? '(Simulador de Audio)' : ''}
                  </span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={stopRecording}
                className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-colors cursor-pointer flex items-center justify-center"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          ) : (
            <div className="bg-blue-50/30 border border-blue-100/60 rounded-lg p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={togglePlayback}
                    className="w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  >
                    {isPlayingAudio ? (
                      <Pause className="w-3 h-3 fill-current" />
                    ) : (
                      <Play className="w-3 h-3 fill-current ml-0.5" />
                    )}
                  </button>
                  <div>
                    <span className="text-xs font-bold text-zinc-800 block">Audio de diagnóstico preliminar</span>
                    <span className="text-[9px] font-semibold text-zinc-400 block -mt-0.5 font-mono">
                      Duración: {formatTime(recordingSeconds)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={startRecording}
                    className="p-1.5 border border-zinc-200 hover:bg-zinc-100 bg-white text-zinc-500 rounded-lg transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={deleteRecording}
                    className="p-1.5 border border-rose-200 hover:bg-rose-50 text-rose-600 bg-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="h-1 bg-zinc-200/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: isPlayingAudio ? '100%' : '0%' }}
                  transition={{ duration: isPlayingAudio ? recordingSeconds : 0.2, ease: 'linear' }}
                  className="h-full bg-blue-600 rounded-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* 6. Target datepicker (follow-up) */}
        <div className="border border-zinc-100 rounded-xl p-3 bg-zinc-50/30">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={scheduleFollowUp}
              onChange={(e) => setScheduleFollowUp(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <span className="text-xs font-bold text-zinc-700">Establecer Plazo de Diagnóstico Estimado</span>
          </label>

          {scheduleFollowUp && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-zinc-100"
            >
              <div>
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Fecha Límite</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-600 font-mono"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Hora Límite</label>
                <input
                  type="time"
                  value={followUpTime}
                  onChange={(e) => setFollowUpTime(e.target.value)}
                  className="w-full border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-600 font-mono"
                />
              </div>
            </motion.div>
          )}
        </div>

         {/* 7. Submit Button */}
         <button
           type="submit"
           disabled={isFormInvalid}
           className="w-full h-10 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed text-white font-bold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
         >
           <Wrench className="w-4 h-4 stroke-[2.2]" />
           Generar Orden de Trabajo (Ingresar a Laboratorio)
         </button>
      </form>
    </div>
  );
}
