import React, { useMemo } from 'react';
import { Customer, CallLog, AgendaItem, TimelineEvent } from '../types';
import KPICard from '../components/KPICard';
import StatsChart from '../components/StatsChart';
import StatusBadge from '../components/StatusBadge';
import { Phone, CheckCircle, Clock, AlertCircle, Users, ArrowUpRight, Plus, ExternalLink, CalendarDays } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardViewProps {
  id: string;
  customers: Customer[];
  callLogs: CallLog[];
  agendaItems: AgendaItem[];
  timelineEvents: TimelineEvent[];
  onNavigateToView: (view: string) => void;
  onSelectCustomer: (customer: Customer) => void;
}

export default function DashboardView({
  id,
  customers,
  callLogs,
  agendaItems,
  timelineEvents,
  onNavigateToView,
  onSelectCustomer
}: DashboardViewProps) {
  
  // Calculate dynamic KPIs from the current state
  const kpis = useMemo(() => {
    const totalCallsCount = callLogs.length;
    const openCasesCount = customers.filter(c => c.status === 'Abierto').length;
    const resolvedCasesCount = customers.filter(c => c.status === 'Resuelto').length;
    const pendingCasesCount = customers.filter(c => c.status === 'Pendiente').length;
    const totalCustomersCount = customers.length;
    
    // Average response time simulation
    const avgTime = "12.4 min";

    return {
      totalCalls: totalCallsCount,
      openCases: openCasesCount,
      resolvedCases: resolvedCasesCount,
      pendingCases: pendingCasesCount,
      totalCustomers: totalCustomersCount,
      avgTime
    };
  }, [customers, callLogs]);

  // Aggregate calls per day for the last 7 days for the chart
  const callTrendData = useMemo(() => {
    const dailyCounts: Record<string, number> = {};
    
    // Default dates to guarantee points
    const dates = ['07-28', '07-29', '07-30', '07-31', '08-01', '08-02', '08-03'];
    dates.forEach(d => { dailyCounts[d] = 0; });

    callLogs.slice(0, 50).forEach(log => {
      // log.date is YYYY-MM-DD
      const parts = log.date.split('-');
      if (parts.length === 3) {
        const key = `${parts[1]}-${parts[2]}`; // MM-DD
        if (dailyCounts[key] !== undefined) {
          dailyCounts[key]++;
        }
      }
    });

    // Make sure we have some variance for demonstration
    dailyCounts['07-28'] = dailyCounts['07-28'] || 12;
    dailyCounts['07-29'] = dailyCounts['07-29'] || 18;
    dailyCounts['07-30'] = dailyCounts['07-30'] || 15;
    dailyCounts['07-31'] = dailyCounts['07-31'] || 22;
    dailyCounts['08-01'] = dailyCounts['08-01'] || 8;
    dailyCounts['08-02'] = dailyCounts['08-02'] || 11;
    dailyCounts['08-03'] = dailyCounts['08-03'] || 14;

    return Object.entries(dailyCounts).map(([label, value]) => ({
      label,
      value
    }));
  }, [callLogs]);

  // Status distributions
  const statusChartData = useMemo(() => {
    return [
      { label: 'Resuelto', value: kpis.resolvedCases },
      { label: 'Abierto', value: kpis.openCases },
      { label: 'Pendiente', value: kpis.pendingCases }
    ];
  }, [kpis]);

  // Filter urgent open cases to display in dashboard
  const urgentCases = useMemo(() => {
    return customers
      .filter(c => c.status === 'Abierto')
      .slice(0, 4);
  }, [customers]);

  // Today's pending callbacks
  const todaysAgenda = useMemo(() => {
    return agendaItems
      .filter(i => i.date === '2026-08-03' && !i.completed)
      .slice(0, 3);
  }, [agendaItems]);

  return (
    <div id={id} className="space-y-6">
      
      {/* 1. KPIs Cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          id="kpi-calls"
          title="Llamadas del Mes"
          value={kpis.totalCalls}
          icon={Phone}
          description="Llamadas registradas totales"
          change="+14.2%"
          changeType="positive"
        />
        <KPICard
          id="kpi-open"
          title="Casos Abiertos"
          value={kpis.openCases}
          icon={AlertCircle}
          description="Pendientes de respuesta"
          change="-4.5%"
          changeType="positive"
        />
        <KPICard
          id="kpi-resolved"
          title="Casos Resueltos"
          value={kpis.resolvedCases}
          icon={CheckCircle}
          description="Casos marcados como cerrados"
          change="+8.3%"
          changeType="positive"
        />
        <KPICard
          id="kpi-customers"
          title="Clientes Totales"
          value={kpis.totalCustomers}
          icon={Users}
          description="Cuentas activas en panel"
          change="Constante"
          changeType="neutral"
        />
        <KPICard
          id="kpi-avgtime"
          title="Atención Promedio"
          value={kpis.avgTime}
          icon={Clock}
          description="Tiempo promedio por llamada"
          change="-1.2m"
          changeType="positive"
        />
      </div>

      {/* 2. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 h-full">
          <StatsChart
            id="chart-volume"
            title="Volumen Diario de Llamadas (Últimos 7 Días)"
            subtitle="Representación del tráfico de llamadas registradas por el centro de soporte."
            type="area"
            data={callTrendData}
            color="blue"
          />
        </div>
        <div className="lg:col-span-4 h-full">
          <StatsChart
            id="chart-statuses"
            title="Distribución de Casos"
            subtitle="Estado actual de atención de los clientes en sistema."
            type="bar"
            data={statusChartData}
            color="emerald"
          />
        </div>
      </div>

      {/* 3. Operational Grid Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Urgent Cases and Quick Customer Lookup */}
        <div className="bg-white border border-zinc-200/80 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] p-5 lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 tracking-tight">Atención Prioritaria (Casos Abiertos)</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Clientes que requieren seguimiento o resolución inmediata.</p>
            </div>
            <button
              onClick={() => onNavigateToView('customers')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors cursor-pointer"
            >
              Ver todos
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-zinc-100">
            {urgentCases.length > 0 ? (
              urgentCases.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => onSelectCustomer(customer)}
                  className="py-3 flex items-center justify-between hover:bg-zinc-50/50 rounded-lg px-2 -mx-2 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      referrerPolicy="no-referrer"
                      className="w-8.5 h-8.5 rounded-full object-cover border border-zinc-200"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-zinc-800 truncate group-hover:text-blue-600 transition-colors">
                        {customer.name}
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-0.5 truncate font-semibold">
                        {customer.company} • Resp: {customer.assignedTo}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={customer.status} />
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <span className="text-xs text-zinc-400">Excelente! No hay casos abiertos en este momento.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Agenda Check */}
        <div className="bg-white border border-zinc-200/80 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] p-5 lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 tracking-tight">Seguimientos de Hoy</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Llamadas agendadas para el día de hoy.</p>
              </div>
              <button
                onClick={() => onNavigateToView('agenda')}
                className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                title="Ir a Agenda"
              >
                <CalendarDays className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {todaysAgenda.length > 0 ? (
                todaysAgenda.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg flex items-start gap-2.5 justify-between"
                  >
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-zinc-800 block truncate">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-zinc-400 mt-0.5 block font-semibold truncate">
                        Contacto: {item.customerName}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-[9px] font-bold font-mono text-zinc-500 bg-white border border-zinc-200 px-1.5 py-0.5 rounded">
                        {item.time} hs
                      </span>
                      <span className={`text-[8px] font-extrabold px-1 py-0.2 rounded ${
                        item.priority === 'Alta' 
                          ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                          : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 border border-dashed border-zinc-200 rounded-xl">
                  <p className="text-xs text-zinc-400">No hay tareas pendientes para hoy.</p>
                  <button
                    onClick={() => onNavigateToView('agenda')}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-800 mt-2 hover:underline cursor-pointer"
                  >
                    Agendar un seguimiento
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 mt-4">
            <button
              onClick={() => onNavigateToView('call-register')}
              className="w-full py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Nuevo Registro de Llamada
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
