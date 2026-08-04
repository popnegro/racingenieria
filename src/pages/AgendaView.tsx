import React from 'react';
import { AgendaItem } from '../types';
import AgendaCalendar from '../components/AgendaCalendar';

interface AgendaViewProps {
  id: string;
  agendaItems: AgendaItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (item: { title: string; customerName: string; date: string; time: string; priority: 'Baja' | 'Media' | 'Alta' }) => void;
  onDeleteItem: (id: string) => void;
}

export default function AgendaView({
  id,
  agendaItems,
  onToggleItem,
  onAddItem,
  onDeleteItem
}: AgendaViewProps) {
  return (
    <div id={id} className="space-y-6">
      
      {/* 1. Header description banner */}
      <div className="bg-zinc-50 border border-zinc-200/60 p-4.5 rounded-xl">
        <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Notas de Agenda</h3>
        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
          Las llamadas marcadas con <strong>"Programar Seguimiento"</strong> en el formulario de llamadas aparecerán automáticamente aquí. 
          Úsalo para no perder contacto con clientes VIP y monitorear llamadas técnicas de soporte asignadas en agenda.
        </p>
      </div>

      {/* 2. Interactive Monthly Agenda Component */}
      <div>
        <AgendaCalendar
          id="agenda-calendar-instance"
          items={agendaItems}
          onToggleItem={onToggleItem}
          onAddItem={onAddItem}
          onDeleteItem={onDeleteItem}
        />
      </div>

    </div>
  );
}
