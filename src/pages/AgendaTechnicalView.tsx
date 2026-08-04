import React from 'react';
import { AgendaItem } from '../types';
import AgendaCalendar from '../components/AgendaCalendar';

interface AgendaTechnicalViewProps {
  id: string;
  agendaItems: AgendaItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (item: {
    title: string;
    customerName: string;
    date: string;
    time: string;
    priority: 'Baja' | 'Media' | 'Alta';
  }) => void;
  onDeleteItem: (id: string) => void;
}

export default function AgendaTechnicalView({
  id,
  agendaItems,
  onToggleItem,
  onAddItem,
  onDeleteItem,
}: AgendaTechnicalViewProps) {
  return (
    <section id={id} className="space-y-6">
      {/* Header/banner */}
      <header className="bg-primary/5 border border-primary/20 p-5 rounded-xl">
        <h2 className="text-lg font-bold text-primary">Agenda Técnica</h2>
        <p className="mt-1 text-sm text-primary/80">
          Visualiza, crea y gestiona los seguimientos técnicos de tus clientes. Usa la barra lateral para filtrar por prioridad o cliente.
        </p>
      </header>

      {/* Calendar component */}
      <div className="bg-white border border-zinc-200/60 rounded-xl shadow-sm p-4">
        <AgendaCalendar
          id="agenda-technical-calendar"
          items={agendaItems}
          onToggleItem={onToggleItem}
          onAddItem={onAddItem}
          onDeleteItem={onDeleteItem}
        />
      </div>
    </section>
  );
}
