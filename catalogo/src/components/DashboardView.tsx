import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bookmark, 
  Activity, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Layers, 
  Flame, 
  Cpu,
  ArrowRight,
  Wifi,
  WifiOff,
  AlertTriangle,
  History,
  FileText,
  BookmarkCheck,
  Zap,
  Hammer,
  RotateCw
} from 'lucide-react';
import { Equipment, Category, Manufacturer } from '../types';
import { EQUIPMENTS, CATEGORIES, MANUFACTURERS } from '../data';

interface DashboardViewProps {
  onSelectEquipment: (id: string) => void;
  onViewChange: (view: 'library' | 'categories') => void;
  onSelectCategory: (catId: string) => void;
  onOpenSearch: () => void;
  favorites: string[];
}

// ==========================================
// SUBCOMPONENTS DECLARATIONS (As requested)
// ==========================================

// 1. Status Badge
export function StatusBadge({ status }: { status: Equipment['status'] }) {
  const config = {
    operational: {
      bg: 'bg-emerald-50/80 text-emerald-700 border-emerald-100',
      label: 'Operativo',
      dot: 'bg-emerald-500'
    },
    maintenance: {
      bg: 'bg-amber-50/80 text-amber-700 border-amber-100',
      label: 'En Mantenimiento',
      dot: 'bg-amber-500'
    },
    critical: {
      bg: 'bg-rose-50/80 text-rose-700 border-rose-100',
      label: 'Estado Crítico',
      dot: 'bg-rose-500'
    },
    offline: {
      bg: 'bg-zinc-100 text-zinc-600 border-zinc-200',
      label: 'Fuera de Línea',
      dot: 'bg-zinc-400'
    }
  };

  const current = config[status] || config.operational;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${current.bg} transition-all`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      <span>{current.label}</span>
    </span>
  );
}

// 2. SearchBar Anchor Component
export function SearchBar({ onClick }: { onClick: () => void }) {
  return (
    <div className="relative">
      <button 
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 bg-zinc-50 hover:bg-zinc-100/70 border border-zinc-200/80 rounded-2xl text-left transition-all duration-200 cursor-pointer group"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 group-hover:border-zinc-300 transition-colors">
            <Search className="w-4.5 h-4.5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-900">Búsqueda Unificada de Biblioteca</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Busque por número de serie, marca, modelo, o planos de conexión...</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-[10px] font-mono font-bold text-zinc-500 bg-white border border-zinc-200 px-2 py-1 rounded shadow-sm">
            ⌘K / Ctrl+K
          </span>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
        </div>
      </button>
    </div>
  );
}

// 3. DashboardHeader
export function DashboardHeader({ 
  onOpenSearch, 
  onViewChange 
}: { 
  onOpenSearch: () => void;
  onViewChange: (view: 'library' | 'categories') => void;
}) {
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200/60 text-zinc-600 w-fit">
          <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
          <span className="text-[9px] font-mono tracking-widest uppercase font-bold">
            {isOnline ? 'Sincronizado • Base de Datos Industrial' : 'Soporte Offline Activo'}
          </span>
        </div>
        
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button 
            onClick={() => onViewChange('library')}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold transition-all duration-150 shadow-sm cursor-pointer"
          >
            Ver Catálogo
          </button>
          <button 
            onClick={onOpenSearch}
            className="px-3 py-1.5 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg text-xs font-semibold text-zinc-700 transition-all duration-150 cursor-pointer"
          >
            Buscar Plano
          </button>
        </div>
      </div>

      <div className="max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-zinc-900 leading-tight">
          Sistemas Técnicos <span className="font-semibold text-zinc-950">Biblioteca Industrial</span>
        </h1>
        <p className="text-sm text-zinc-500 mt-2 leading-relaxed font-light">
          Consulte manuales originales indexados, esquemas de conexión interactivos e historial de mantenimiento unificado de todos los activos críticos sin conexión.
        </p>
      </div>
    </div>
  );
}

// 4. MetricCard
export function MetricCard({ 
  label, 
  value, 
  subtext, 
  color = 'blue',
  onClick
}: { 
  label: string; 
  value: string | number; 
  subtext: string;
  color?: 'emerald' | 'amber' | 'rose' | 'blue';
  onClick?: () => void;
}) {
  const colorStyles = {
    emerald: {
      text: 'text-emerald-600',
      bg: 'bg-emerald-50/50',
      border: 'hover:border-emerald-200'
    },
    amber: {
      text: 'text-amber-600',
      bg: 'bg-amber-50/50',
      border: 'hover:border-amber-200'
    },
    rose: {
      text: 'text-rose-600',
      bg: 'bg-rose-50/50',
      border: 'hover:border-rose-200'
    },
    blue: {
      text: 'text-zinc-900',
      bg: 'bg-zinc-50/50',
      border: 'hover:border-zinc-300'
    }
  };

  const currentStyle = colorStyles[color];

  return (
    <div 
      onClick={onClick}
      className={`p-4 bg-white border border-zinc-150 rounded-2xl transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-sm' : ''} ${currentStyle.border}`}
    >
      <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">{label}</p>
      <div className="flex items-baseline gap-2 mt-1.5">
        <span className={`text-3xl font-bold font-mono tracking-tight ${currentStyle.text}`}>{value}</span>
      </div>
      <p className="text-[11px] text-zinc-500 mt-1">{subtext}</p>
    </div>
  );
}

// 5. EquipmentCard
export function EquipmentCard({ 
  equipment, 
  onClick 
}: { 
  equipment: Equipment; 
  onClick: () => void; 
}) {
  return (
    <div 
      onClick={onClick}
      className="group bg-white border border-zinc-200/80 rounded-2xl overflow-hidden hover:border-zinc-400 hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col h-full"
    >
      <div className="relative h-36 w-full bg-zinc-100 overflow-hidden">
        <img 
          src={equipment.images.general} 
          alt={equipment.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-[1.015] transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 px-2 py-0.5 text-[9px] font-bold uppercase bg-zinc-950 text-white rounded tracking-widest">
          {equipment.manufacturer}
        </span>
        <div className="absolute top-3 right-3">
          <StatusBadge status={equipment.status} />
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h4 className="font-semibold text-xs sm:text-sm text-zinc-900 group-hover:text-zinc-950 transition-colors line-clamp-1">
            {equipment.name}
          </h4>
          <p className="text-[10px] font-mono text-zinc-500">Modelo: {equipment.model}</p>
          <p className="text-xs text-zinc-500 font-light line-clamp-2 leading-relaxed pt-1">
            {equipment.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-3 mt-4 border-t border-zinc-100 text-[10px] text-zinc-500 font-mono">
          <span className="truncate max-w-[120px]">{equipment.location}</span>
          <span className="font-semibold text-zinc-900 group-hover:text-zinc-600 inline-flex items-center gap-0.5 transition-colors">
            Ficha Técnica <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
}

// 6. ActivityTimeline
export function ActivityTimeline({ 
  logs, 
  onSelectEquipment 
}: { 
  logs: Array<any>; 
  onSelectEquipment: (id: string) => void; 
}) {
  if (!logs || logs.length === 0) {
    return <EmptyState title="Sin actividad reciente" description="No se registran bitácoras de servicio últimamente." />;
  }

  return (
    <div className="relative pl-4 space-y-6 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-200">
      {logs.map((log, index) => (
        <div key={`${log.id}-${index}`} className="relative space-y-1.5">
          {/* Point indicator */}
          <div className="absolute -left-[16px] top-1.5 w-2 h-2 rounded-full border border-white bg-zinc-900 shadow-sm" />
          
          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
            <span>{log.date}</span>
            <span className="bg-zinc-100 text-zinc-700 border border-zinc-200 px-1.5 py-0.2 rounded font-semibold uppercase text-[8px] tracking-wide">
              {log.type}
            </span>
          </div>
          
          <div>
            <button 
              onClick={() => onSelectEquipment(log.equipmentId)}
              className="text-xs font-semibold text-zinc-900 hover:text-zinc-600 transition-colors text-left font-sans block"
            >
              {log.equipmentName}
            </button>
            <p className="text-[11px] text-zinc-500 leading-relaxed font-light mt-0.5">
              {log.description}
            </p>
          </div>

          <p className="text-[9px] text-zinc-400 font-mono">Intervención: {log.technician}</p>
        </div>
      ))}
    </div>
  );
}

// 7. AlertCard
export function AlertCard({ 
  title, 
  description, 
  equipmentId, 
  onSelect,
  severity = 'warning' 
}: { 
  title: string; 
  description: string; 
  equipmentId: string; 
  onSelect: (id: string) => void;
  severity?: 'warning' | 'critical';
}) {
  const styles = {
    warning: 'bg-amber-50/60 border-amber-200 text-amber-900',
    critical: 'bg-rose-50/60 border-rose-200 text-rose-950'
  };

  return (
    <div 
      onClick={() => onSelect(equipmentId)}
      className={`p-3.5 border rounded-xl flex items-start gap-3 cursor-pointer transition-all hover:shadow-xs ${styles[severity]}`}
    >
      <div className="mt-0.5 shrink-0">
        <AlertTriangle className={`w-4 h-4 ${severity === 'critical' ? 'text-rose-500' : 'text-amber-500'}`} />
      </div>
      <div className="min-w-0 flex-1">
        <h5 className="text-xs font-semibold leading-normal">{title}</h5>
        <p className="text-[11px] opacity-85 leading-normal mt-0.5 font-light">{description}</p>
        <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold mt-1.5 underline underline-offset-2">
          Ver Ficha Técnica <ArrowRight className="w-2.5 h-2.5" />
        </span>
      </div>
    </div>
  );
}

// 8. QuickActions
export function QuickActions({ 
  onViewChange, 
  onOpenSearch 
}: { 
  onViewChange: (view: 'library' | 'categories') => void;
  onOpenSearch: () => void;
}) {
  const actions = [
    {
      title: 'Explorar Catálogo',
      desc: 'Acceder a biblioteca completa.',
      icon: Layers,
      action: () => onViewChange('library')
    },
    {
      title: 'Buscar Esquemas',
      desc: 'Planos de conexión y bornes.',
      icon: Search,
      action: onOpenSearch
    },
    {
      title: 'Por Categorías',
      desc: '27 ramas de ingeniería.',
      icon: Cpu,
      action: () => onViewChange('categories')
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {actions.map((act, i) => {
        const Icon = act.icon;
        return (
          <button 
            key={i}
            onClick={act.action}
            className="p-3.5 bg-white border border-zinc-200 rounded-xl hover:border-zinc-400 hover:shadow-xs text-left transition-all duration-150 group cursor-pointer flex items-start gap-3"
          >
            <div className="p-2 rounded-lg bg-zinc-50 group-hover:bg-zinc-900 group-hover:text-white text-zinc-600 transition-colors shrink-0">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-900">{act.title}</p>
              <p className="text-[10px] text-zinc-400 mt-0.5 leading-normal font-light">{act.desc}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// 9. EmptyState
export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-8 bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl text-center">
      <div className="w-9 h-9 rounded-xl bg-white border border-zinc-150 flex items-center justify-center text-zinc-300 mx-auto mb-3">
        <Bookmark className="w-4 h-4" />
      </div>
      <p className="text-xs font-semibold text-zinc-800">{title}</p>
      <p className="text-[11px] text-zinc-500 mt-1 max-w-xs mx-auto leading-relaxed font-light">{description}</p>
    </div>
  );
}

// 10. LoadingSkeleton
export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-28 bg-zinc-100 rounded-2xl w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-24 bg-zinc-100 rounded-2xl" />
        <div className="h-24 bg-zinc-100 rounded-2xl" />
        <div className="h-24 bg-zinc-100 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-8 w-44 bg-zinc-100 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-64 bg-zinc-100 rounded-2xl" />
            <div className="h-64 bg-zinc-100 rounded-2xl" />
          </div>
        </div>
        <div className="h-80 bg-zinc-100 rounded-2xl" />
      </div>
    </div>
  );
}


// ==========================================
// MAIN DASHBOARD COMPONENT
// ==========================================
export default function DashboardView({ 
  onSelectEquipment, 
  onViewChange, 
  onSelectCategory,
  onOpenSearch,
  favorites 
}: DashboardViewProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Soft trigger for loading state to make the UX extremely premium
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 120);
    return () => clearTimeout(timer);
  }, []);

  // Filter 4 prominent equipments for the highlighted grid
  const prominentEquipments = EQUIPMENTS.slice(0, 4);
  
  // Bookmarked items
  const favoriteEquipments = EQUIPMENTS.filter(e => favorites.includes(e.id));

  // Key featured technical categories
  const featuredCategories = CATEGORIES.slice(0, 4).map(cat => ({
    ...cat,
    count: EQUIPMENTS.filter(eq => eq.categoryId === cat.id).length
  }));

  // Aggregated technical activity logs
  const recentLogs = EQUIPMENTS.flatMap(eq => 
    eq.logs.map(log => ({
      ...log,
      equipmentName: eq.name,
      equipmentId: eq.id,
      manufacturer: eq.manufacturer
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
   .slice(0, 4);

  // Core metrics calculated dynamically
  const totalCount = EQUIPMENTS.length;
  const activeCount = EQUIPMENTS.filter(e => e.status === 'operational').length;
  const maintenanceCount = EQUIPMENTS.filter(e => e.status === 'maintenance').length;
  const criticalCount = EQUIPMENTS.filter(e => e.status === 'critical').length;

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-6 px-4">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-4 px-4 font-sans animate-fade-in">
      
      {/* 1. Header principal */}
      <DashboardHeader onOpenSearch={onOpenSearch} onViewChange={onViewChange} />

      {/* 2. Prominent Search Box */}
      <SearchBar onClick={onOpenSearch} />

      {/* 3. Resumen operativo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          label="Total Equipos" 
          value={totalCount} 
          subtext="Modelos en biblioteca" 
          color="blue"
          onClick={() => onViewChange('library')}
        />
        <MetricCard 
          label="Operativos" 
          value={activeCount} 
          subtext="Listos en producción" 
          color="emerald" 
          onClick={() => onViewChange('library')}
        />
        <MetricCard 
          label="En Mantenimiento" 
          value={maintenanceCount} 
          subtext="Soporte o calibración" 
          color="amber"
          onClick={() => onViewChange('library')}
        />
        <MetricCard 
          label="Estado Crítico" 
          value={criticalCount} 
          subtext="Atención técnica urgente" 
          color="rose"
          onClick={() => onViewChange('library')}
        />
      </div>

      {/* Quick Access panel of actions */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Accesos Rápidos</h3>
        <QuickActions onViewChange={onViewChange} onOpenSearch={onOpenSearch} />
      </div>

      {/* 4. Split Grid Layout: Left 2 Columns (Main catalog items), Right 1 Column (Sidebars) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns - Equipos destacados */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Equipos destacados */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Equipos Destacados</h3>
              <button 
                onClick={() => onViewChange('library')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 hover:text-zinc-600 transition-colors cursor-pointer"
              >
                <span>Ver biblioteca completa</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prominentEquipments.map(eq => (
                <EquipmentCard 
                  key={eq.id}
                  equipment={eq}
                  onClick={() => onSelectEquipment(eq.id)}
                />
              ))}
            </div>
          </div>

          {/* Categorías destacadas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Categorías Populares</h3>
              <button 
                onClick={() => onViewChange('categories')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 hover:text-zinc-600 transition-colors cursor-pointer"
              >
                <span>Explorar categorías</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {featuredCategories.map((cat, i) => {
                return (
                  <div 
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.id);
                      onViewChange('library');
                    }}
                    className="p-4 bg-white border border-zinc-200/80 hover:border-zinc-400 rounded-xl transition-all group cursor-pointer flex flex-col justify-between h-28"
                  >
                    <div className="w-8 h-8 rounded bg-zinc-50 border border-zinc-150 flex items-center justify-center text-zinc-500 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-150">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-zinc-950 transition-colors leading-tight line-clamp-1">{cat.name}</h4>
                      <p className="text-[9px] text-zinc-500 mt-0.5 font-mono">{cat.count} equipos</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fabricantes destacados */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Fabricantes Destacados</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {MANUFACTURERS.slice(0, 4).map(m => (
                <div 
                  key={m.id}
                  className="p-3 bg-white border border-zinc-200/80 rounded-xl text-center group transition-all"
                >
                  <div className="w-8 h-8 mx-auto rounded-lg bg-zinc-50 border border-zinc-150 flex items-center justify-center text-zinc-900 font-mono font-bold text-xs">
                    {m.name.substring(0, 2).toUpperCase()}
                  </div>
                  <p className="text-xs font-semibold text-zinc-950 mt-2 truncate">{m.name}</p>
                  <p className="text-[9px] text-zinc-400 font-mono">Garantía Industrial</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Columns - Alertas inteligentes, Actividad, Favoritos */}
        <div className="space-y-8 lg:border-l lg:border-zinc-100 lg:pl-6">
          
          {/* Alertas Inteligentes */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-zinc-400" />
              <span>Alertas Inteligentes</span>
            </h3>

            <div className="space-y-3">
              <AlertCard 
                title="Sincronización Crítica Pendiente"
                description="Manuales técnicos pesados cargados recientemente listos para predescarga."
                equipmentId="eq-sinamics-g120"
                onSelect={onSelectEquipment}
                severity="warning"
              />
              <AlertCard 
                title="Overtemperatura Registrada"
                description="ABB ACS580 reportó picos térmicos inusuales en cooler de ventilación."
                equipmentId="eq-abb-acs580"
                onSelect={onSelectEquipment}
                severity="critical"
              />
            </div>
          </div>

          {/* Mis Favoritos */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-zinc-400" />
              <span>Mis Favoritos ({favoriteEquipments.length})</span>
            </h3>

            {favoriteEquipments.length > 0 ? (
              <div className="space-y-2">
                {favoriteEquipments.map(eq => (
                  <div 
                    key={eq.id}
                    onClick={() => onSelectEquipment(eq.id)}
                    className="p-2.5 bg-white border border-zinc-200/80 hover:border-zinc-400 rounded-xl transition-all flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-zinc-50 overflow-hidden shrink-0 border border-zinc-150">
                      <img 
                        src={eq.images.general} 
                        alt={eq.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-zinc-900 group-hover:text-zinc-950 truncate">{eq.name}</h4>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5 truncate">{eq.manufacturer} • {eq.model}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-600 transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                title="Sin favoritos" 
                description="Pulsa la estrella en las fichas técnicas para tener acceso offline directo." 
              />
            )}
          </div>

          {/* Actividad Reciente */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-zinc-400" />
              <span>Historial Reciente</span>
            </h3>

            <ActivityTimeline logs={recentLogs} onSelectEquipment={onSelectEquipment} />
          </div>

        </div>

      </div>

    </div>
  );
}
