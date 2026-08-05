import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Bookmark, 
  MapPin, 
  Wrench, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Download, 
  Plus, 
  Sparkles, 
  Tag, 
  X, 
  Search, 
  Maximize2,
  Calendar,
  AlertTriangle,
  Cpu,
  BookmarkCheck,
  Building,
  User,
  Copy,
  Check,
  Briefcase,
  RotateCcw,
  MessageSquare,
  Mail,
  Phone
} from 'lucide-react';
import { Equipment, MaintenanceLog, TechnicalDoc, EquipmentStatus } from '../types';
import { EQUIPMENTS, CATEGORIES } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

interface EquipmentDetailViewProps {
  equipmentId: string;
  onBack: () => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectEquipment: (id: string) => void;
  onAddMaintenanceLog: (equipmentId: string, log: MaintenanceLog) => void;
  onShowToast: (message: string) => void;
  equipments: Equipment[];
}

type DetailTab = 'specs' | 'apps' | 'io' | 'compat' | 'sales';

export default function EquipmentDetailView({ 
  equipmentId, 
  onBack, 
  favorites, 
  onToggleFavorite,
  onSelectEquipment,
  onAddMaintenanceLog,
  onShowToast,
  equipments
}: EquipmentDetailViewProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('specs');
  
  // Find the current equipment (could be modified in local state by adding logs)
  const equipment = useMemo(() => {
    return equipments.find(e => e.id === equipmentId);
  }, [equipmentId, equipments]);

  // Sales Agent State
  const [clientName, setClientName] = useState('Aceros del Norte S.A.');
  const [clientSector, setClientSector] = useState('Siderurgia y Metalurgia');
  const [clientContact, setClientContact] = useState('Ing. Carlos Mendoza (Jefe de Planta)');
  const [clientPainPoint, setClientPainPoint] = useState('Evitar paradas imprevistas en la línea de laminación');
  const [clientObjective, setClientObjective] = useState('Contrato anual de mantenimiento preventivo y stock crítico en sitio');
  const [clientUrgency, setClientUrgency] = useState('Alta');
  const [clientBudget, setClientBudget] = useState('Por definir (evaluación según criticidad de línea)');
  const [salesStyle, setSalesStyle] = useState<'consultative' | 'urgency' | 'value'>('consultative');
  const [generatedPitch, setGeneratedPitch] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const handleGeneratePitch = async () => {
    if (!equipment) return;
    setIsGenerating(true);
    setGeneratedPitch('');
    try {
      const response = await fetch('/api/sales/pitch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipment: {
            name: equipment.name,
            manufacturer: equipment.manufacturer,
            model: equipment.model,
            specs: equipment.specs,
          },
          clientInfo: {
            name: clientName,
            sector: clientSector,
            contact: clientContact,
            painPoint: clientPainPoint,
            objective: clientObjective,
            urgency: clientUrgency,
            budget: clientBudget,
          },
          lastLog: equipment.logs[0] || null,
          salesStyle,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al generar el pitch comercial.');
      }

      const data = await response.json();
      setGeneratedPitch(data.pitch || '');
      onShowToast('¡Speech de venta e inteligencia de prospección comercial generados!');
    } catch (err) {
      console.error(err);
      onShowToast('Error al conectar con el Agente de Ventas IA.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPitch = () => {
    if (!generatedPitch) return;
    navigator.clipboard.writeText(generatedPitch);
    setCopiedText(true);
    onShowToast('¡Pitch copiado al portapapeles!');
    setTimeout(() => setCopiedText(false), 2000);
  };

  if (!equipment) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-500 font-medium">Equipo no encontrado.</p>
        <button onClick={onBack} className="mt-4 text-slate-900 font-bold underline">Volver</button>
      </div>
    );
  }

  // Active general image (for gallery state)
  const [selectedGalleryImageKey, setSelectedGalleryImageKey] = useState<keyof typeof equipment.images>('general');
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // Document PDF viewer modal state
  const [activeDocViewer, setActiveDocViewer] = useState<TechnicalDoc | null>(null);
  const [docSearchQuery, setDocSearchQuery] = useState('');

  // Maintenance log form state
  const [isLogFormOpen, setIsLogFormOpen] = useState(false);
  const [techName, setTechName] = useState('');
  const [logType, setLogType] = useState<'preventive' | 'corrective' | 'calibration' | 'inspection'>('preventive');
  const [logDesc, setLogDesc] = useState('');
  const [logOutcome, setLogOutcome] = useState('');
  const [logDuration, setLogDuration] = useState('');

  const isFavorite = favorites.includes(equipment.id);

  // Dynamic breadcrumb
  const categoryName = useMemo(() => {
    return CATEGORIES.find(c => c.id === equipment.categoryId)?.name || 'Biblioteca';
  }, [equipment.categoryId]);

  // Gallery image map
  const galleryImages = useMemo(() => {
    return Object.entries(equipment.images)
      .filter(([_, value]) => !!value)
      .map(([key, value]) => ({ key: key as keyof typeof equipment.images, url: value as string }));
  }, [equipment.images]);

  // Active gallery URL
  const activeGalleryUrl = equipment.images[selectedGalleryImageKey] || equipment.images.general;

  // Handle logging maintenance
  const handleSubmitLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!techName.trim() || !logDesc.trim() || !logOutcome.trim() || !logDuration.trim()) {
      alert('Por favor, complete todos los campos obligatorios del registro.');
      return;
    }

    const newLog: MaintenanceLog = {
      id: `log-dynamic-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: logType,
      technician: techName,
      description: logDesc,
      outcome: logOutcome,
      duration: logDuration
    };

    onAddMaintenanceLog(equipment.id, newLog);
    
    // Reset Form
    setTechName('');
    setLogDesc('');
    setLogOutcome('');
    setLogDuration('');
    setIsLogFormOpen(false);
    onShowToast('Mantenimiento registrado con éxito en la Bitácora.');
  };

  // Get related equipments list
  const relatedEquipments = useMemo(() => {
    if (!equipment.relatedEquipmentIds) return [];
    return EQUIPMENTS.filter(eq => equipment.relatedEquipmentIds?.includes(eq.id));
  }, [equipment]);

  // Highlight matches in mock PDF reader
  const pdfLines = useMemo(() => {
    if (!activeDocViewer?.contentMock) return [];
    const lines = activeDocViewer.contentMock.split('\n');
    if (!docSearchQuery) return lines;

    return lines;
  }, [activeDocViewer, docSearchQuery]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4 px-4 font-sans animate-fade-in">
      
      {/* Top Breadcrumbs & Back Bar */}
      <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-4">
        <div className="flex items-center gap-2.5 text-xs text-[#717171] font-light">
          <button 
            onClick={onBack}
            className="flex items-center gap-1 hover:text-[#111111] transition-colors cursor-pointer group font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Volver</span>
          </button>
          <span>/</span>
          <span className="cursor-pointer hover:text-[#111111]" onClick={onBack}>{categoryName}</span>
          <span>/</span>
          <span className="text-[#111111] font-semibold">{equipment.name}</span>
        </div>

        <button 
          onClick={(e) => {
            onToggleFavorite(equipment.id, e);
            onShowToast(isFavorite ? 'Quitado de Favoritos' : 'Añadido a Favoritos');
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#EEEEEE] hover:bg-[#FAFAFA] rounded-lg text-xs font-semibold text-[#111111] transition-all cursor-pointer"
        >
          <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-[#CCCCCC]'}`} />
          <span>{isFavorite ? 'Anclado' : 'Marcar favorito'}</span>
        </button>
      </div>

      {/* Main Structural Layout: Left gallery & info, Right specs & documents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (5/12): Gallery and Primary Identifiers */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Hero Visual Card */}
          <div className="relative bg-[#F5F5F7] rounded-2xl border border-[#EEEEEE] overflow-hidden group">
            <div className="aspect-4/3 relative w-full overflow-hidden">
              <img 
                src={activeGalleryUrl} 
                alt={equipment.name} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setIsZoomModalOpen(true)}
                className="absolute bottom-4 right-4 p-2 bg-[#111111]/75 hover:bg-[#111111] backdrop-blur-md rounded-full text-white cursor-pointer transition-all border border-[#EEEEEE]/10"
                title="Ampliar Imagen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Gallery Image Category Label */}
            <div className="absolute top-4 left-4 px-2 py-0.5 text-[9px] font-bold uppercase bg-[#111111] text-white rounded tracking-widest">
              {selectedGalleryImageKey === 'general' && 'Vista General'}
              {selectedGalleryImageKey === 'interior' && 'Interior'}
              {selectedGalleryImageKey === 'circuitBoard' && 'Placa Electrónica'}
              {selectedGalleryImageKey === 'connectors' && 'Conectores / Puertos'}
              {selectedGalleryImageKey === 'terminals' && 'Borneras / Bornes'}
              {selectedGalleryImageKey === 'label' && 'Placa de Características'}
            </div>
          </div>

          {/* Gallery Thumbnail Selector Strip */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-[#999999] uppercase tracking-widest">Exploración Visual de Componentes</p>
            <div className="grid grid-cols-5 gap-2">
              {galleryImages.map(img => (
                <button
                  key={img.key}
                  onClick={() => setSelectedGalleryImageKey(img.key)}
                  className={`aspect-square rounded-lg overflow-hidden border transition-all cursor-pointer bg-[#F5F5F7] ${
                    selectedGalleryImageKey === img.key 
                      ? 'border-[#111111] ring-2 ring-[#111111]/10' 
                      : 'border-[#EEEEEE] hover:border-[#CCCCCC]'
                  }`}
                >
                  <img 
                    src={img.url} 
                    alt={img.key} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Technical Specs Summary Card */}
          <div className="p-5 bg-[#F9F9F9] border border-[#EEEEEE] rounded-2xl space-y-4">
            <div>
              <span className="text-[9px] font-bold uppercase text-[#999999] tracking-widest">Identificadores de Activo</span>
              <h3 className="text-xl font-semibold text-[#111111] tracking-tight mt-0.5">{equipment.name}</h3>
              <p className="text-xs font-light text-[#717171] mt-1">{equipment.manufacturer} • Catálogo Editorial</p>
            </div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs pt-2 border-t border-[#EEEEEE]">
              <div>
                <p className="text-[#999999] font-medium">Modelo</p>
                <p className="font-semibold text-[#111111] font-mono mt-0.5 truncate">{equipment.model}</p>
              </div>
              <div>
                <p className="text-[#999999] font-medium">Número de Serie</p>
                <p className="font-semibold text-[#111111] font-mono mt-0.5 truncate">{equipment.series}</p>
              </div>
              <div>
                <p className="text-[#999999] font-medium">Ubicación de Planta</p>
                <p className="font-semibold text-[#111111] mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#CCCCCC] shrink-0" />
                  <span className="truncate font-light text-[#717171]">{equipment.location}</span>
                </p>
              </div>
              <div>
                <p className="text-[#999999] font-medium">Estado Físico</p>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 border ${
                  equipment.status === 'operational' 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                    : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  <span className={`w-1 h-1 rounded-full ${equipment.status === 'operational' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span>{equipment.status === 'operational' ? 'Operativo' : 'Mantenimiento'}</span>
                </span>
              </div>
            </div>

            {/* Tag Badges */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {equipment.tags.map(t => (
                <span key={t} className="px-2 py-0.5 bg-white border border-[#EEEEEE] text-[#717171] font-mono text-[9px] font-medium rounded uppercase tracking-wider">
                  {t}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (7/12): Technical Tabs, Documentation, and Maintenance Logs */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* Section: Technical specifications Tabs */}
          <div className="space-y-4">
            
            {/* Elegant Horizontal Tab Bar */}
            <div className="flex border-b border-[#EEEEEE] overflow-x-auto scrollbar-none">
              {[
                { id: 'specs', label: 'Especificaciones' },
                { id: 'apps', label: 'Aplicaciones y Características' },
                { id: 'io', label: 'Interfaces y Señales' },
                { id: 'compat', label: 'Compatibilidad' },
                { id: 'sales', label: 'Agente de Ventas IA ⚡' }
              ].map(tb => (
                <button
                  key={tb.id}
                  onClick={() => setActiveTab(tb.id as DetailTab)}
                  className={`px-4 py-2.5 text-xs font-semibold transition-all relative border-b-2 cursor-pointer whitespace-nowrap ${
                    activeTab === tb.id 
                      ? 'border-[#111111] text-[#111111]' 
                      : 'border-transparent text-[#717171] hover:text-[#111111]'
                  }`}
                >
                  {tb.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="py-2">
              
              {/* Tabs 1: Specifications */}
              {activeTab === 'specs' && (
                <div className="border border-[#EEEEEE] rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-[#F9F9F9] border-b border-[#EEEEEE] text-[10px] font-bold text-[#999999] uppercase tracking-widest">
                        <th className="px-4 py-3">Parámetro Técnico</th>
                        <th className="px-4 py-3">Rango de Operación / Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEEEEE] font-medium text-[#717171]">
                      {Object.entries(equipment.specs).map(([key, val]) => (
                        <tr key={key} className="hover:bg-[#F9F9F9] transition-colors">
                          <td className="px-4 py-3 font-semibold text-[#111111]">{key}</td>
                          <td className="px-4 py-3 font-mono text-[#111111]">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tabs 2: Applications & Features */}
              {activeTab === 'apps' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-[#F9F9F9] border border-[#EEEEEE] rounded-xl">
                  
                  {/* Applications Bullet list */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold uppercase text-[#999999] tracking-widest">Aplicaciones de Planta</h4>
                    <ul className="space-y-2 text-xs text-[#717171] font-light">
                      {equipment.applications.map((app, i) => (
                        <li key={i} className="flex items-start gap-2 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#111111] mt-1.5 shrink-0" />
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Features Bullet list */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold uppercase text-[#999999] tracking-widest">Características Avanzadas</h4>
                    <ul className="space-y-2 text-xs text-[#717171] font-light">
                      {equipment.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#111111] mt-1.5 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              )}

              {/* Tabs 3: Inputs/Outputs & Protocols */}
              {activeTab === 'io' && (
                <div className="space-y-6 p-4 bg-white border border-[#EEEEEE] rounded-xl">
                  
                  {/* Communication Protocols */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold uppercase text-[#999999] tracking-widest">Protocolos de Bus de Campo Soportados</h4>
                    <div className="flex flex-wrap gap-2">
                      {equipment.protocols.map(p => (
                        <span key={p} className="px-2.5 py-1 bg-[#111111] text-white font-mono text-[10px] font-bold rounded tracking-wider">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Inputs & Outputs columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-[#EEEEEE]">
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-bold uppercase text-emerald-600 tracking-widest">Entradas / Bornes de Captación</h5>
                      <ul className="space-y-2 text-xs text-[#717171] font-light">
                        {equipment.inputs.map((inp, idx) => (
                          <li key={idx} className="flex items-start gap-2 leading-relaxed">
                            <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-600 border border-emerald-100 font-mono text-[9px] rounded font-bold shrink-0 mt-0.5">IN</span>
                            <span>{inp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-[10px] font-bold uppercase text-blue-600 tracking-widest">Salidas / Bornes de Actuación</h5>
                      <ul className="space-y-2 text-xs text-[#717171] font-light">
                        {equipment.outputs.map((out, idx) => (
                          <li key={idx} className="flex items-start gap-2 leading-relaxed">
                            <span className="px-1.5 py-0.2 bg-blue-50 text-blue-600 border border-blue-100 font-mono text-[9px] rounded font-bold shrink-0 mt-0.5">OUT</span>
                            <span>{out}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              )}

              {/* Tabs 4: Compatibility */}
              {activeTab === 'compat' && (
                <div className="p-4 bg-[#F9F9F9] border border-[#EEEEEE] rounded-xl space-y-3">
                  <h4 className="text-[10px] font-bold uppercase text-[#999999] tracking-widest">Interoperabilidad Certificada</h4>
                  <ul className="space-y-2.5 text-xs text-[#717171] font-light">
                    {equipment.compatibility.map((comp, idx) => (
                      <li key={idx} className="flex items-center gap-2 px-3 py-2 bg-white border border-[#EEEEEE] rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tabs 5: AI Sales Agent */}
              {activeTab === 'sales' && (
                <div className="space-y-6">
                  {/* Executive Header */}
                  <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                      <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Agente de Ventas IA Comercial</h4>
                    </div>
                    <p className="text-xs text-[#717171] font-light leading-relaxed">
                      Este agente inteligente analiza las especificaciones técnicas del activo, las necesidades del cliente y el historial de mantenimiento para estructurar una estrategia de prospección comercial de alta conversión.
                    </p>
                  </div>

                  {/* Two-column Config Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Left: Client Profile info */}
                    <div className="p-4 bg-white border border-[#EEEEEE] rounded-xl space-y-3">
                      <h5 className="text-[10px] font-bold text-[#999999] uppercase tracking-widest flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" />
                        <span>Perfil de Prospección del Cliente</span>
                      </h5>

                      <div className="space-y-2 text-xs">
                        <div>
                          <label className="block text-[9px] font-bold text-[#999999] uppercase tracking-wider mb-1">Nombre de la Empresa</label>
                          <input 
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="w-full bg-white border border-[#EEEEEE] rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none text-[#111111] focus:border-[#CCCCCC]"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-[#999999] uppercase tracking-wider mb-1">Sector Industrial</label>
                          <input 
                            type="text"
                            value={clientSector}
                            onChange={(e) => setClientSector(e.target.value)}
                            className="w-full bg-white border border-[#EEEEEE] rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none text-[#111111] focus:border-[#CCCCCC]"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-[#999999] uppercase tracking-wider mb-1">Contacto de Decisión y Cargo</label>
                          <input 
                            type="text"
                            value={clientContact}
                            onChange={(e) => setClientContact(e.target.value)}
                            className="w-full bg-white border border-[#EEEEEE] rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none text-[#111111] focus:border-[#CCCCCC]"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-[#999999] uppercase tracking-wider mb-1">Desafío / Dolor Principal</label>
                          <input 
                            type="text"
                            value={clientPainPoint}
                            onChange={(e) => setClientPainPoint(e.target.value)}
                            className="w-full bg-white border border-[#EEEEEE] rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none text-[#111111] focus:border-[#CCCCCC]"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-[#999999] uppercase tracking-wider mb-1">Objetivo Comercial Buscado</label>
                          <input 
                            type="text"
                            value={clientObjective}
                            onChange={(e) => setClientObjective(e.target.value)}
                            className="w-full bg-white border border-[#EEEEEE] rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none text-[#111111] focus:border-[#CCCCCC]"
                            placeholder="Ej. Contrato de mantenimiento o kit de repuestos"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] font-bold text-[#999999] uppercase tracking-wider mb-1">Urgencia</label>
                            <select
                              value={clientUrgency}
                              onChange={(e) => setClientUrgency(e.target.value)}
                              className="w-full bg-white border border-[#EEEEEE] rounded-lg px-2 py-1.5 text-xs font-medium outline-none text-[#111111] focus:border-[#CCCCCC]"
                            >
                              <option value="Baja">Baja</option>
                              <option value="Media">Media</option>
                              <option value="Alta">Alta</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-[#999999] uppercase tracking-wider mb-1">Presupuesto</label>
                            <input 
                              type="text"
                              value={clientBudget}
                              onChange={(e) => setClientBudget(e.target.value)}
                              className="w-full bg-white border border-[#EEEEEE] rounded-lg px-2 py-1.5 text-xs font-medium outline-none text-[#111111] focus:border-[#CCCCCC]"
                              placeholder="Ej. Por definir"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Technical Trigger & Style */}
                    <div className="p-4 bg-[#F9F9F9] border border-[#EEEEEE] rounded-xl space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <h5 className="text-[10px] font-bold text-[#999999] uppercase tracking-widest flex items-center gap-1">
                          <Cpu className="w-3.5 h-3.5" />
                          <span>Trigger de Mantenimiento Reciente</span>
                        </h5>

                        {equipment.logs && equipment.logs.length > 0 ? (
                          <div className="bg-white p-3 border border-[#EEEEEE] rounded-lg space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-[#111111]">Última Intervención</span>
                              <span className={`px-1.5 py-0.2 text-[8px] font-bold uppercase rounded ${
                                equipment.logs[0].type === 'preventive' ? 'bg-emerald-50 text-emerald-600' :
                                equipment.logs[0].type === 'corrective' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                              }`}>
                                {equipment.logs[0].type}
                              </span>
                            </div>
                            <p className="text-[10px] text-[#717171] font-mono">{equipment.logs[0].date} • Técnico: {equipment.logs[0].technician}</p>
                            <p className="text-[11px] text-[#111111] font-light leading-snug line-clamp-2 italic">
                              "{equipment.logs[0].description}"
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 bg-amber-50/40 border border-dashed border-amber-200 rounded-lg text-xs text-amber-700 space-y-1 font-light">
                            <p className="font-semibold">Sin historial técnico reciente</p>
                            <p className="text-[10px] leading-relaxed">Agregue un registro de mantenimiento en la sección inferior para activar un trigger comercial real en base a reparaciones físicas.</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5 pt-3">
                        <label className="block text-[9px] font-bold text-[#999999] uppercase tracking-wider">Estilo / Enfoque Comercial</label>
                        <select
                          value={salesStyle}
                          onChange={(e) => setSalesStyle(e.target.value as any)}
                          className="w-full bg-white border border-[#EEEEEE] rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none text-[#111111] focus:border-[#CCCCCC]"
                        >
                          <option value="consultative">Técnico Consultivo (Asesor de confianza)</option>
                          <option value="urgency">Mitigación de Riesgos y Urgencia (Evitar paradas)</option>
                          <option value="value">Valor y Retorno de Inversión (Eficiencia y Vida útil)</option>
                        </select>
                      </div>
                    </div>

                  </div>

                  {/* Generation Button */}
                  <button
                    onClick={handleGeneratePitch}
                    disabled={isGenerating}
                    className="w-full py-2.5 bg-[#111111] hover:bg-black text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Generando Estrategia Comercial de Precisión...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Prospectar y Generar Speech de Ventas</span>
                      </>
                    )}
                  </button>

                  {/* Pitch Results */}
                  <AnimatePresence>
                    {generatedPitch && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 bg-[#FAFAFA] border border-[#EEEEEE] rounded-xl space-y-4 animate-slide-down"
                      >
                        <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-3">
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <h4 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Inteligencia de Venta Generada</h4>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleCopyPitch}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#FAFAFA] border border-[#EEEEEE] rounded-lg text-[10px] font-semibold text-[#111111] transition-all cursor-pointer"
                              title="Copiar Speech completo"
                            >
                              {copiedText ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>Copiado</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-[#717171]" />
                                  <span>Copiar Speech</span>
                                </>
                              )}
                            </button>
                            
                            <button
                              onClick={handleGeneratePitch}
                              className="p-1 hover:bg-[#EEEEEE] rounded-lg text-[#717171] hover:text-[#111111] transition-colors cursor-pointer"
                              title="Regenerar"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Speech content box */}
                        <div className="bg-white p-5 border border-[#EEEEEE] rounded-lg overflow-y-auto max-h-[400px]">
                          <div className="prose prose-sm max-w-none text-[#111111] leading-relaxed text-xs">
                            <Markdown>{generatedPitch}</Markdown>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

            </div>
          </div>

          {/* Section: Interactive Document Library */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#999999]">Colección Documental Editorial</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {equipment.documents.map(doc => (
                <div 
                  key={doc.id}
                  onClick={() => {
                    if (doc.contentMock) {
                      setActiveDocViewer(doc);
                    } else {
                      onShowToast(`Abriendo ${doc.title}...`);
                    }
                  }}
                  className="p-4 bg-white hover:bg-[#F9F9F9] border border-[#EEEEEE] hover:border-[#CCCCCC] rounded-xl transition-all group cursor-pointer flex items-start justify-between"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#F5F5F7] flex items-center justify-center text-[#717171] group-hover:bg-[#111111] group-hover:text-white transition-all duration-200">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-[#111111] truncate">{doc.title}</h4>
                      <p className="text-[10px] text-[#999999] font-mono mt-0.5 uppercase tracking-widest font-bold">{doc.type} • {doc.fileSize}</p>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onShowToast(`Descargando archivo: ${doc.title}`);
                    }}
                    className="p-1.5 hover:bg-[#EEEEEE] rounded text-[#999999] hover:text-[#111111] transition-colors cursor-pointer shrink-0"
                    title="Descargar PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Maintenance Log Bitácora & Live logging form */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#999999]">Bitácora de Mantenimiento e Historial</h3>
              
              <button
                onClick={() => setIsLogFormOpen(!isLogFormOpen)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#111111] hover:text-[#717171] transition-colors cursor-pointer"
              >
                {isLogFormOpen ? (
                  <span>Ocultar formulario</span>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Registrar actividad</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Interactive Log Form */}
            {isLogFormOpen && (
              <form onSubmit={handleSubmitLog} className="p-5 bg-[#F9F9F9] border border-[#EEEEEE] rounded-xl space-y-4 animate-slide-down">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#111111]" />
                  <h4 className="text-xs font-bold text-[#111111]">Nueva Entrada en Bitácora Técnica</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#999999] uppercase tracking-widest">Nombre del Técnico *</label>
                    <input 
                      type="text" 
                      required
                      value={techName}
                      onChange={(e) => setTechName(e.target.value)}
                      placeholder="Ej. Ing. Alejandro Silva"
                      className="w-full bg-white border border-[#EEEEEE] rounded-lg px-3 py-1.5 text-xs font-medium outline-none placeholder-[#CCCCCC] focus:border-[#CCCCCC] text-[#111111]"
                    />
                  </div>

                  {/* Type Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#999999] uppercase tracking-widest">Tipo de Operación *</label>
                    <select
                      value={logType}
                      onChange={(e) => setLogType(e.target.value as any)}
                      className="w-full bg-white border border-[#EEEEEE] rounded-lg px-3 py-1.5 text-xs font-medium outline-none focus:border-[#CCCCCC] text-[#111111]"
                    >
                      <option value="preventive">Preventivo</option>
                      <option value="corrective">Correctivo</option>
                      <option value="calibration">Calibración / Sintonía</option>
                      <option value="inspection">Inspección de rutina</option>
                    </select>
                  </div>

                  {/* Duration Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#999999] uppercase tracking-widest">Duración de Tarea *</label>
                    <input 
                      type="text" 
                      required
                      value={logDuration}
                      onChange={(e) => setLogDuration(e.target.value)}
                      placeholder="Ej. 2.0 horas"
                      className="w-full bg-white border border-[#EEEEEE] rounded-lg px-3 py-1.5 text-xs font-medium outline-none placeholder-[#CCCCCC] focus:border-[#CCCCCC] text-[#111111]"
                    />
                  </div>

                  {/* Outcome Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#999999] uppercase tracking-widest">Resultado / Conclusión *</label>
                    <input 
                      type="text" 
                      required
                      value={logOutcome}
                      onChange={(e) => setLogOutcome(e.target.value)}
                      placeholder="Ej. Estado óptimo. Calibrado completo."
                      className="w-full bg-white border border-[#EEEEEE] rounded-lg px-3 py-1.5 text-xs font-medium outline-none placeholder-[#CCCCCC] focus:border-[#CCCCCC] text-[#111111]"
                    />
                  </div>

                </div>

                {/* Description Textarea */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#999999] uppercase tracking-widest">Descripción detallada de la Intervención *</label>
                  <textarea 
                    rows={3}
                    required
                    value={logDesc}
                    onChange={(e) => setLogDesc(e.target.value)}
                    placeholder="Detalle las tareas físicas, limpieza, comprobación de bornes, apriete o cambios efectuados..."
                    className="w-full bg-white border border-[#EEEEEE] rounded-lg p-3 text-xs font-medium outline-none placeholder-[#CCCCCC] focus:border-[#CCCCCC] text-[#111111]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsLogFormOpen(false)}
                    className="px-3 py-1.5 border border-[#EEEEEE] bg-white hover:bg-[#FAFAFA] text-[#717171] font-semibold rounded-lg text-xs cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#111111] hover:bg-black text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs"
                  >
                    Guardar Registro Técnico
                  </button>
                </div>
              </form>
            )}

            {/* Spaced Timeline of logs */}
            <div className="relative pl-5 space-y-8 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#EEEEEE]">
              {equipment.logs.map((log) => (
                <div key={log.id} className="relative space-y-2">
                  {/* Timeline Dot with distinct colors */}
                  <div className={`absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full border border-white ring-4 ring-[#FDFDFD] flex items-center justify-center ${
                    log.type === 'preventive' ? 'bg-emerald-500' :
                    log.type === 'corrective' ? 'bg-red-500' :
                    log.type === 'calibration' ? 'bg-blue-500' : 'bg-amber-500'
                  }`} />

                  {/* Header Meta */}
                  <div className="flex items-center justify-between text-[11px] text-[#717171] font-mono">
                    <span className="flex items-center gap-1 font-semibold text-[#717171]">
                      <Calendar className="w-3.5 h-3.5 text-[#CCCCCC]" />
                      <span>{log.date}</span>
                    </span>
                    <span className="bg-[#F5F5F7] border border-[#EEEEEE] text-[#111111] px-2 py-0.5 rounded font-bold uppercase tracking-widest scale-95 text-[9px]">
                      {log.type === 'preventive' && 'Preventivo'}
                      {log.type === 'corrective' && 'Correctivo'}
                      {log.type === 'calibration' && 'Sintonía'}
                      {log.type === 'inspection' && 'Inspección'}
                    </span>
                  </div>

                  {/* Narrative details */}
                  <div className="bg-[#F9F9F9] p-4 border border-[#EEEEEE] rounded-xl space-y-2">
                    <p className="text-xs text-[#111111] font-light leading-relaxed">
                      {log.description}
                    </p>
                    
                    <div className="pt-2 border-t border-[#EEEEEE] grid grid-cols-2 gap-2 text-[10px] text-[#717171] font-mono">
                      <div>
                        <span>Resultado:</span> <strong className="text-[#111111] font-semibold">{log.outcome}</strong>
                      </div>
                      <div>
                        <span>Técnico:</span> <strong className="text-[#111111] font-semibold">{log.technician}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Related Spare Parts & Equipments */}
          <div className="space-y-6 pt-4 border-t border-[#EEEEEE]">
            
            {/* Spare Parts Tag collection */}
            {equipment.relatedSpares && equipment.relatedSpares.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase text-[#999999] tracking-widest">Repuestos Originales Homologados</h4>
                <div className="flex flex-wrap gap-2">
                  {equipment.relatedSpares.map(sp => (
                    <span key={sp} className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F5F5F7] border border-[#EEEEEE] rounded-lg text-xs font-semibold text-[#111111]">
                      <Wrench className="w-3 h-3 text-[#999999]" />
                      <span>{sp}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Equipments navigation */}
            {relatedEquipments.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase text-[#999999] tracking-widest">Sistemas Co-dependientes Relacionados</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedEquipments.map(eq => (
                    <div
                      key={eq.id}
                      onClick={() => onSelectEquipment(eq.id)}
                      className="p-3 bg-white hover:bg-[#F9F9F9] border border-[#EEEEEE] hover:border-[#CCCCCC] rounded-xl transition-all cursor-pointer flex items-center gap-3 group"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#F5F5F7]">
                        <img 
                          src={eq.images.general} 
                          alt={eq.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-semibold text-[#111111] truncate group-hover:text-black transition-colors">{eq.name}</h5>
                        <p className="text-[10px] text-[#717171] font-mono mt-0.5 truncate">{eq.manufacturer} • {eq.model}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#CCCCCC] group-hover:text-[#111111] transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* MODAL 1: Full-screen Image Zoom Viewer */}
      <AnimatePresence>
        {isZoomModalOpen && (
          <div className="fixed inset-0 bg-[#111111]/95 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-xl bg-black border border-white/10"
            >
              <button 
                onClick={() => setIsZoomModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-[#111111]/80 hover:bg-[#111111] border border-white/10 text-white rounded-full transition-all cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>
              
              <img 
                src={activeGalleryUrl} 
                alt={equipment.name} 
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[80vh] object-contain mx-auto"
              />
              
              <div className="p-4 bg-black text-[#717171] text-xs text-center border-t border-white/5 font-mono uppercase tracking-widest">
                {equipment.name} — Detalle ampliado del componente
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Interactive Document PDF Reader / Viewer */}
      <AnimatePresence>
        {activeDocViewer && (
          <div className="fixed inset-0 bg-[#111111]/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-sans">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="w-full max-w-4xl bg-white rounded-xl shadow-lg border border-[#EEEEEE] overflow-hidden flex flex-col h-[85vh]"
            >
              {/* Top Control Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#EEEEEE] bg-[#F9F9F9]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#111111] text-white flex items-center justify-center font-bold text-sm tracking-wider">
                    PDF
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-[#111111]">{activeDocViewer.title}</h3>
                    <p className="text-[10px] text-[#999999] font-mono mt-0.5 uppercase tracking-widest font-bold">Biblioteca Técnica • {activeDocViewer.fileSize}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onShowToast('Descargando archivo local...')}
                    className="p-1.5 hover:bg-[#EEEEEE] rounded text-[#717171] hover:text-[#111111] transition-colors cursor-pointer"
                    title="Descargar archivo"
                  >
                    <Download className="w-4.5 h-4.5" />
                  </button>
                  <button 
                    onClick={() => {
                      setActiveDocViewer(null);
                      setDocSearchQuery('');
                    }}
                    className="p-1.5 hover:bg-[#EEEEEE] rounded text-[#717171] hover:text-[#111111] transition-colors cursor-pointer"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {/* Document search bar */}
              <div className="flex items-center gap-2 px-5 py-2.5 border-b border-[#EEEEEE] bg-[#FDFDFD]">
                <Search className="w-4 h-4 text-[#CCCCCC] shrink-0" />
                <input 
                  type="text"
                  value={docSearchQuery}
                  onChange={(e) => setDocSearchQuery(e.target.value)}
                  placeholder="Buscar texto en el manual indexado..."
                  className="w-full text-xs outline-none bg-transparent placeholder-[#CCCCCC] text-[#111111] font-light"
                />
                {docSearchQuery && (
                  <button onClick={() => setDocSearchQuery('')} className="p-0.5 text-[#999999] hover:text-[#111111]">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Viewer body scroll pane */}
              <div className="flex-1 overflow-y-auto bg-[#111111] p-6 text-[#EEEEEE] font-mono text-xs leading-relaxed selection:bg-amber-500 selection:text-slate-950">
                <div className="max-w-2xl mx-auto space-y-4 bg-black p-8 rounded-lg shadow-xl border border-white/5 whitespace-pre-wrap">
                  {pdfLines.map((line, idx) => {
                    if (docSearchQuery && line.toLowerCase().includes(docSearchQuery.toLowerCase())) {
                      // Highlight matching search words
                      const parts = line.split(new RegExp(`(${docSearchQuery})`, 'gi'));
                      return (
                        <div key={idx} className="bg-amber-500/10 text-amber-300 py-0.5 px-1 rounded border-l-2 border-amber-500 my-1">
                          {parts.map((part, pidx) => 
                            part.toLowerCase() === docSearchQuery.toLowerCase() 
                              ? <mark key={pidx} className="bg-amber-400 text-slate-950 rounded px-0.5 font-bold">{part}</mark>
                              : part
                          )}
                        </div>
                      );
                    }
                    return <div key={idx}>{line}</div>;
                  })}
                </div>
              </div>

              {/* Viewer Footer */}
              <div className="px-5 py-3 border-t border-[#EEEEEE] bg-[#F9F9F9] text-[10px] text-[#717171] flex items-center justify-between font-mono">
                <span>Páginas indexadas: 1/1</span>
                <span>Visor de Documentos de Precisión</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
