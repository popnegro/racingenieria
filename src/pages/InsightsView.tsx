import React, { useMemo } from 'react';
import { Customer, Operator, CallLog } from '../types';
import { Award, Timer, Users, Percent, Flame, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface InsightsViewProps {
  id: string;
  customers: Customer[];
  operators: Operator[];
  callLogs: CallLog[];
}

export default function InsightsView({
  id,
  customers,
  operators,
  callLogs
}: InsightsViewProps) {
  
  // Calculate analytics in real-time
  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const resolvedCount = customers.filter(c => c.status === 'Resuelto').length;
    const openCount = customers.filter(c => c.status === 'Abierto').length;
    const pendingCount = customers.filter(c => c.status === 'Pendiente').length;

    // Resolution rate
    const resolutionRate = totalCustomers > 0 
      ? Math.round((resolvedCount / totalCustomers) * 100) 
      : 0;

    // Call logs stats
    const totalCalls = callLogs.length;

    return {
      totalCustomers,
      resolvedCount,
      openCount,
      pendingCount,
      resolutionRate,
      totalCalls
    };
  }, [customers, callLogs]);

  // Operator leaderboard data: Cases resolved per operator
  // To keep it 100% dynamic, let's count how many customers are resolved and assigned to each operator,
  // or count from the pre-aggregated operators array
  const operatorsStats = useMemo(() => {
    return operators.map(op => {
      // Find dynamic customers resolved by this operator
      const dynamicResolved = customers.filter(c => c.assignedTo === op.name && c.status === 'Resuelto').length;
      // Combine with their base count for realism
      const resolved = op.resolvedCases + dynamicResolved;
      const total = op.callsCount + (customers.filter(c => c.assignedTo === op.name).length * 4);
      return {
        name: op.name,
        role: op.role,
        avatar: op.avatar,
        resolved,
        total,
        ratio: Math.round((resolved / (total || 1)) * 100)
      };
    }).sort((a, b) => b.resolved - a.resolved);
  }, [operators, customers]);

  // Clients served per day of the week (Avg volume distribution)
  const dailyServed = [
    { label: 'Lunes', value: 42 },
    { label: 'Martes', value: 38 },
    { label: 'Miércoles', value: 55 },
    { label: 'Jueves', value: 48 },
    { label: 'Viernes', value: 39 },
    { label: 'Sábado', value: 12 },
    { label: 'Domingo', value: 8 }
  ];

  const maxServedValue = Math.max(...dailyServed.map(d => d.value));

  // Render a beautiful custom SVG donut chart representing status distribution
  const renderStatusDonut = () => {
    const total = stats.totalCustomers;
    const r = stats.resolvedCount;
    const o = stats.openCount;
    const p = stats.pendingCount;

    const rPercent = total > 0 ? Math.round((r / total) * 100) : 0;
    const oPercent = total > 0 ? Math.round((o / total) * 100) : 0;
    const pPercent = total > 0 ? Math.round((p / total) * 100) : 0;

    return (
      <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
        {/* Custom Pie Visualizer */}
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {/* Base circle */}
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f4f4f5" strokeWidth="15" />
            
            {/* Resolved sector (Emerald) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#059669"
              strokeWidth="15"
              strokeDasharray={`${rPercent * 2.51} 251`}
              strokeDashoffset="0"
              className="transition-all duration-500"
            />

            {/* Open sector (Blue) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#2563eb"
              strokeWidth="15"
              strokeDasharray={`${oPercent * 2.51} 251`}
              strokeDashoffset={`-${rPercent * 2.51}`}
              className="transition-all duration-500"
            />

            {/* Pending sector (Amber) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#d97706"
              strokeWidth="15"
              strokeDasharray={`${pPercent * 2.51} 251`}
              strokeDashoffset={`-${(rPercent + oPercent) * 2.51}`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-zinc-900 tracking-tight">{stats.resolutionRate}%</span>
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Cerrados</span>
          </div>
        </div>

        {/* Legend stats */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center justify-between border-b border-zinc-50 pb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600" />
              <span className="text-xs font-semibold text-zinc-700">Resuelto (Cerrado)</span>
            </div>
            <span className="text-xs font-bold font-mono text-zinc-900">{stats.resolvedCount} ({rPercent}%)</span>
          </div>

          <div className="flex items-center justify-between border-b border-zinc-50 pb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600" />
              <span className="text-xs font-semibold text-zinc-700">Casos Abiertos</span>
            </div>
            <span className="text-xs font-bold font-mono text-zinc-900">{stats.openCount} ({oPercent}%)</span>
          </div>

          <div className="flex items-center justify-between border-b border-zinc-50 pb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-600" />
              <span className="text-xs font-semibold text-zinc-700">Casos Pendientes</span>
            </div>
            <span className="text-xs font-bold font-mono text-zinc-900">{stats.pendingCount} ({pPercent}%)</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id={id} className="space-y-6">
      
      {/* 1. Header KPIs row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Tasa de Resolución</span>
            <span className="text-3xl font-extrabold text-emerald-600 mt-1 block font-mono">{stats.resolutionRate}%</span>
            <span className="text-[10px] text-zinc-400 mt-1 block font-medium">Casos resueltos s/ total</span>
          </div>
          <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-600">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Tiempo de Respuesta</span>
            <span className="text-3xl font-extrabold text-zinc-900 mt-1 block font-mono">14.2 min</span>
            <span className="text-[10px] text-emerald-600 mt-1 block font-bold">-2.1 min vs ayer</span>
          </div>
          <div className="p-2.5 bg-zinc-50 border border-zinc-100 rounded-lg text-zinc-500">
            <Timer className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Clientes Activos</span>
            <span className="text-3xl font-extrabold text-blue-600 mt-1 block font-mono">{stats.totalCustomers}</span>
            <span className="text-[10px] text-zinc-400 mt-1 block font-medium">Cuentas con casos abiertos/cerrados</span>
          </div>
          <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-lg text-blue-600">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Nivel de Conversión</span>
            <span className="text-3xl font-extrabold text-zinc-900 mt-1 block font-mono">94.8%</span>
            <span className="text-[10px] text-emerald-600 mt-1 block font-bold">Nivel SLA de atención</span>
          </div>
          <div className="p-2.5 bg-zinc-50 border border-zinc-100 rounded-lg text-zinc-500">
            <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* 2. Visualizers grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Casos Resueltos por Operador (Leaderboard) */}
        <div className="bg-white border border-zinc-200/80 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] p-5 lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 tracking-tight">Rendimiento Técnico (Casos Resueltos por Operador)</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Cantidad neta de incidentes cerrados satisfactoriamente.</p>
            </div>
            <Award className="w-4.5 h-4.5 text-amber-500" />
          </div>

          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
            {operatorsStats.map((op, idx) => (
              <div key={op.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold font-mono text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">
                      #{idx + 1}
                    </span>
                    <img
                      src={op.avatar}
                      alt={op.name}
                      className="w-6.5 h-6.5 rounded-full object-cover border border-zinc-200"
                    />
                    <span className="font-semibold text-zinc-800">{op.name}</span>
                  </div>
                  <span className="font-bold text-zinc-900 font-mono">
                    {op.resolved} <span className="text-[10px] text-zinc-400 font-medium">casos resueltos</span>
                  </span>
                </div>
                
                {/* Visual Bar progress */}
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (op.resolved / 210) * 100)}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    className="bg-blue-600 h-full rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Donut status chart */}
        <div className="bg-white border border-zinc-200/80 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] p-5 lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-5">
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 tracking-tight">Efectividad General de Casos</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Distribución porcentual de los 50 clientes corporativos.</p>
              </div>
            </div>

            {renderStatusDonut()}
          </div>

          <div className="pt-4 border-t border-zinc-100 mt-6 text-center">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              SLA Corporativo de Soporte: 95% meta mensual
            </span>
          </div>
        </div>

      </div>

      {/* 3. Clientes atendidos por día (Vertical chart) */}
      <div className="bg-white border border-zinc-200/80 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] p-5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-6">
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 tracking-tight">Distribución Semanal de Atención</h4>
            <p className="text-xs text-zinc-400 mt-0.5">Promedio de clientes atendidos o contactados por día de la semana.</p>
          </div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 border border-blue-100 px-2 py-1 rounded">
            Histórico Mensual
          </span>
        </div>

        {/* Bar layout */}
        <div className="grid grid-cols-7 gap-4 pt-4">
          {dailyServed.map((day) => {
            const pct = (day.value / maxServedValue) * 100;
            return (
              <div key={day.label} className="flex flex-col items-center gap-2">
                <div className="w-full bg-zinc-50 border border-zinc-100 rounded-lg h-36 flex flex-col justify-end overflow-hidden p-1 relative">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${pct}%` }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-blue-600/90 hover:bg-blue-600 rounded-md w-full transition-all flex items-start justify-center pt-1"
                  >
                    <span className="text-[9px] font-bold text-white leading-none font-mono">{day.value}</span>
                  </motion.div>
                </div>
                <span className="text-[10px] font-semibold text-zinc-500">{day.label}</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
