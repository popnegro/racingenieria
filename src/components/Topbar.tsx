import React, { useState } from 'react';
import { Bell, Check, UserCheck, ShieldAlert, CircleDot, Headphones, Search, Sliders } from 'lucide-react';
import { Operator } from '../types';

interface TopbarProps {
  id: string;
  activeView: string;
  activeOperator: Operator;
  globalSearchTerm: string;
  onGlobalSearchChange: (val: string) => void;
  onOpenPersonalization?: () => void;
}

type AgentStatus = 'Disponible' | 'En Laboratorio' | 'En Planta';

export default function Topbar({
  id,
  activeView,
  activeOperator,
  globalSearchTerm,
  onGlobalSearchChange,
  onOpenPersonalization
}: TopbarProps) {
  const [status, setStatus] = useState<AgentStatus>('Disponible');
  const [notificationsCount, setNotificationsCount] = useState(3);

  const viewTitles: Record<string, { main: string; desc: string }> = {
    dashboard: { main: 'Dashboard Operativo', desc: 'Métricas críticas, control de paradas de línea y estado del laboratorio en tiempo real.' },
    customers: { main: 'Clientes Industriales', desc: 'Registro técnico de cuentas corporativas, plantas activas e historial de activos.' },
    'call-register': { main: 'Recepción y Órdenes de Trabajo (OT)', desc: 'Registro de ingreso de equipamiento industrial de alta complejidad y síntomas reportados.' },
    agenda: { main: 'Agenda Técnica de Laboratorio', desc: 'Planificación de pruebas dinámicas, calibraciones, diagnósticos y visitas de planta.' },
    timeline: { main: 'Bitácora Operativa', desc: 'Auditoría en tiempo real de reparaciones, cambios de estado de OTs y aprobaciones de presupuestos.' },
    insights: { main: 'Reportes, KPIs y Estadísticas', desc: 'Análisis detallado de tiempos medios de reparación (MTTR), fallas por marca y productividad.' }
  };

  const activeTitle = viewTitles[activeView] || { main: 'RAC Ingeniería', desc: 'Plataforma ERP Técnica de Laboratorio.' };

  const statusConfig = {
    Disponible: { dot: 'bg-emerald-500', text: 'text-emerald-700 bg-emerald-50 border border-emerald-200/50' },
    'En Laboratorio': { dot: 'bg-blue-500', text: 'text-blue-700 bg-blue-50 border border-blue-200/50' },
    'En Planta': { dot: 'bg-amber-500', text: 'text-amber-700 bg-amber-50 border border-amber-200/50' }
  };

  return (
    <header
      id={id}
      className="bg-white border-b border-zinc-200 h-[64px] px-6 flex items-center justify-between sticky top-0 z-40 select-none"
    >
      {/* Title & Description Block */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-zinc-900 tracking-tight leading-none">{activeTitle.main}</h1>
        <p className="text-[10px] text-zinc-400 font-semibold mt-1 truncate hidden sm:block">
          {activeTitle.desc}
        </p>
      </div>

      {/* Right Controls Area */}
      <div className="flex items-center gap-4">
        
        {/* Availability Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider hidden md:block">
            Estado del Técnico:
          </span>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[status as keyof typeof statusConfig]?.text || 'text-zinc-600 bg-zinc-50'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[status as keyof typeof statusConfig]?.dot || 'bg-zinc-400'} animate-pulse`} />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AgentStatus)}
              className="bg-transparent focus:outline-none cursor-pointer pr-1 font-bold"
            >
              <option value="Disponible">Disponible</option>
              <option value="En Laboratorio">En Laboratorio</option>
              <option value="En Planta">En Planta</option>
            </select>
          </div>
        </div>

        {/* Vertical Divider */}
        <span className="h-5 w-px bg-zinc-200" />

        {/* Notifications and Operator info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPersonalization}
            className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
            title="Personalización y Accesibilidad"
          >
            <Sliders className="w-4.5 h-4.5" />
          </button>

          <button
            onClick={() => setNotificationsCount(0)}
            className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-700 transition-colors relative cursor-pointer"
            title="Notificaciones"
          >
            <Bell className="w-5 h-5" />
            {notificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-600 rounded-full ring-2 ring-white" />
            )}
          </button>
          
          <div className="flex items-center gap-2.5">
            <img
              src={activeOperator.avatar}
              alt={activeOperator.name}
              className="w-8 h-8 rounded-full object-cover border border-zinc-200 shadow-sm"
            />
            <div className="hidden lg:flex flex-col">
              <span className="text-xs font-bold text-zinc-800 leading-none">{activeOperator.name}</span>
              <span className="text-[9px] text-blue-600 font-bold mt-1 font-mono uppercase tracking-wider">ONLINE</span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
