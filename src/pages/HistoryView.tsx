import React, { useState, useMemo } from 'react';
import { TimelineEvent } from '../types';
import { History, Search, Phone, FileText, CheckCircle2, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface HistoryViewProps {
  id: string;
  timelineEvents: TimelineEvent[];
}

export default function HistoryView({ id, timelineEvents }: HistoryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Todos' | 'call' | 'status_change' | 'note'>('Todos');

  // Filter timeline records
  const filteredEvents = useMemo(() => {
    return timelineEvents.filter(event => {
      const matchesSearch =
        event.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.operatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'Todos' || event.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [timelineEvents, searchTerm, typeFilter]);

  const eventIcons = {
    call: { icon: Phone, bg: 'bg-emerald-50 border border-emerald-200 text-emerald-600' },
    status_change: { icon: CheckCircle2, bg: 'bg-blue-50 border border-blue-200 text-blue-600' },
    note: { icon: FileText, bg: 'bg-amber-50 border border-amber-200 text-amber-600' }
  };

  return (
    <div id={id} className="space-y-6">
      
      {/* Search and filter controls panel */}
      <div className="p-4 bg-white border border-zinc-200/80 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar eventos por cliente, agente o palabras clave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-lg text-xs bg-zinc-50/40 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all font-semibold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
          <div className="flex items-center gap-1.5 bg-white border border-zinc-200 rounded-lg px-2 py-1.5 shadow-sm">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-0.5">Filtrar por:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="text-xs font-semibold text-zinc-700 bg-transparent focus:outline-none cursor-pointer pr-1"
            >
              <option value="Todos">Todos los Eventos</option>
              <option value="call">Llamadas de Soporte</option>
              <option value="status_change">Cambios de Estado</option>
              <option value="note">Notas Internas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline Layout */}
      <div className="bg-white border border-zinc-200/80 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] p-6 relative">
        {filteredEvents.length > 0 ? (
          <div className="relative border-l border-zinc-200 pl-6 ml-3 space-y-6">
            {filteredEvents.map((event, index) => {
              const config = eventIcons[event.type] || eventIcons.note;
              const Icon = config.icon;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
                  className="relative group"
                >
                  {/* Floating Left Circle with icon */}
                  <span className={`absolute -left-[37px] top-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${config.bg}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </span>

                  <div className="bg-zinc-50 border border-zinc-100 p-4.5 rounded-xl space-y-1 hover:border-zinc-200 transition-colors">
                    {/* Event top meta line */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <h4 className="text-xs font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                        {event.message}
                      </h4>
                      <span className="text-[10px] font-bold text-zinc-400 font-mono">
                        {event.date} a las {event.time} hs
                      </span>
                    </div>

                    {/* Detailed Event comment */}
                    <p className="text-xs text-zinc-600 leading-relaxed font-medium pt-1">
                      {event.description}
                    </p>

                    {/* Event bottom actors line */}
                    <div className="flex flex-wrap items-center gap-3 pt-3 mt-2 border-t border-zinc-100/60 text-[10px] text-zinc-400 font-semibold">
                      <span>
                        Cliente: <strong className="text-zinc-600 font-bold">{event.customerName}</strong>
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                      <span>
                        Registró: <strong className="text-zinc-600 font-bold">{event.operatorName}</strong>
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 max-w-sm mx-auto">
            <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-full mb-3 text-zinc-400 inline-block">
              <History className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h5 className="font-semibold text-zinc-800 text-sm">Sin registros históricos</h5>
            <p className="text-xs text-zinc-400 mt-1">
              No hay actividades en el historial que coincidan con la búsqueda actual. Intenta flexibilizar el término de búsqueda.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
