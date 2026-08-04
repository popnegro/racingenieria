import React from 'react';
import { LayoutDashboard, Building2, Wrench, Calendar, History, BarChart2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Operator } from '../types';
import logo from '../assets/images/rac-brand.jpg';

interface SidebarProps {
  id: string;
  activeView: string;
  setActiveView: (view: string) => void;
  activeOperator: Operator;
  operators: Operator[];
  onChangeOperator: (operator: Operator) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  id,
  activeView,
  setActiveView,
  activeOperator,
  operators,
  onChangeOperator,
  isCollapsed,
  setIsCollapsed,
  isOpen = true,
  onClose,
}: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Principal', icon: LayoutDashboard },
    { id: 'customers', label: 'Clientes Industriales', icon: Building2 },
    { id: 'call-register', label: 'Recepción y OTs', icon: Wrench },
    { id: 'agenda', label: 'Agenda Técnica', icon: Calendar },
    { id: 'agenda-technical', label: 'Agenda Técnica Avanzada', icon: Calendar },
    { id: 'timeline', label: 'Bitácora Operativa', icon: History },
    { id: 'insights', label: 'Reportes y KPIs', icon: BarChart2 },
  ];

  return ( <>
    {/* Mobile backdrop */}
    <div
      className={`fixed inset-0 bg-black/40 z-20 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      aria-hidden="true"
    />

    <aside
      id={id}
      role="navigation"
      aria-label="Main navigation"
      className={`bg-zinc-950 text-zinc-100 h-screen border-r border-zinc-800 flex flex-col justify-between transition-transform duration-300 select-none 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:w-64 w-full lg:static fixed inset-y-0 left-0 z-30`}
    >
      {/* Top Brand Block */}
      <div>
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between h-[64px] bg-zinc-900/40">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-8 rounded bg-white p-0.5 flex items-center justify-center shadow-sm overflow-hidden border border-zinc-700">
                <img src={logo} alt="RAC Logo" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xs text-zinc-50 tracking-tight leading-none uppercase">RAC Ingeniería</span>
                <span className="text-[9px] text-zinc-400 font-bold mt-1 tracking-wider uppercase">ERP de Laboratorio</span>
              </div>
            </div>
          ) : (
            <div className="w-10 h-8 rounded bg-white p-0.5 flex items-center justify-center shadow-sm overflow-hidden border border-zinc-700 mx-auto">
              <img src={logo} alt="RAC Logo" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer hidden md:block"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${isActive
                    ? 'bg-primary text-neutral-50 shadow-md shadow-primary/20 font-extrabold'
                    : 'hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100'
                  }`}
              >
                <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white stroke-[2.2]' : 'text-zinc-400'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile Switching Block */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-900/30">
        {!isCollapsed ? (
          <div className="space-y-3">
            {/* Swapping user container */}
            <div className="flex items-center gap-2.5 p-2 bg-zinc-900/60 border border-zinc-800 rounded-lg shadow-sm">
              <img src={activeOperator.avatar} alt={activeOperator.name} className="w-8 h-8 rounded-full object-cover border border-zinc-700" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-zinc-100 truncate leading-none">{activeOperator.name}</p>
                <p className="text-[10px] text-zinc-400 font-bold mt-1 truncate">{activeOperator.role}</p>
              </div>
            </div>

            {/* Operator switch selector */}
            <div className="space-y-1.5">
              <label className="text-[8px] font-extrabold text-zinc-500 uppercase tracking-widest block px-1">Técnico Activo</label>
              <select
                value={activeOperator.id}
                onChange={(e) => {
                  const selected = operators.find((op) => op.id === e.target.value);
                  if (selected) onChangeOperator(selected);
                }}
                className="w-full bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold cursor-pointer"
              >
                {operators.map((op) => (
                  <option key={op.id} value={op.id} className="bg-zinc-950 text-zinc-300 font-semibold">
                    {op.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 items-center">
            <img src={activeOperator.avatar} alt={activeOperator.name} className="w-8 h-8 rounded-full object-cover border border-zinc-800" title={`${activeOperator.name} (${activeOperator.role})`} />
          </div>
        )}
      </div>
    </aside></>
      
  );
}

