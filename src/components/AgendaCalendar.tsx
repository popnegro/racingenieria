import React, { useState, useMemo } from 'react';
import { AgendaItem } from '../types';
import { Calendar as CalendarIcon, Clock, CheckCircle2, Circle, AlertCircle, Plus, Trash2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AgendaCalendarProps {
  id: string;
  items: AgendaItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (item: { title: string; customerName: string; date: string; time: string; priority: 'Baja' | 'Media' | 'Alta' }) => void;
  onDeleteItem: (id: string) => void;
}

export default function AgendaCalendar({
  id,
  items,
  onToggleItem,
  onAddItem,
  onDeleteItem
}: AgendaCalendarProps) {
  const [selectedDate, setSelectedDate] = useState('2026-08-04'); // default to Aug 4
  const [newTitle, setNewTitle] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newTime, setNewTime] = useState('09:00');
  const [newPriority, setNewPriority] = useState<'Baja' | 'Media' | 'Alta'>('Media');
  const [showAddForm, setShowAddForm] = useState(false);

  // Month configurations (August 2026)
  const daysInMonth = 31;
  const startDayOffset = 5; // August 2026 starts on Saturday (0: Mon, 1: Tue... 5: Sat, 6: Sun)
  
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Map day index to date string YYYY-MM-DD
  const getDateString = (day: number) => {
    return `2026-08-${String(day).padStart(2, '0')}`;
  };

  // Group items by date for quick lookup
  const itemsByDate = useMemo(() => {
    const map: Record<string, AgendaItem[]> = {};
    items.forEach(item => {
      if (!map[item.date]) map[item.date] = [];
      map[item.date].push(item);
    });
    return map;
  }, [items]);

  // Items for the currently selected date
  const selectedDateItems = useMemo(() => {
    return itemsByDate[selectedDate] || [];
  }, [itemsByDate, selectedDate]);

  // Handle addition of a new item
  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddItem({
      title: newTitle.trim(),
      customerName: newCustomerName.trim() || 'Sin cliente especificado',
      date: selectedDate,
      time: newTime,
      priority: newPriority
    });

    setNewTitle('');
    setNewCustomerName('');
    setShowAddForm(false);
  };

  const priorityColors = {
    Baja: { dot: 'bg-zinc-300', text: 'text-zinc-500 bg-zinc-50 border-zinc-100' },
    Media: { dot: 'bg-blue-400', text: 'text-blue-600 bg-blue-50 border-blue-100' },
    Alta: { dot: 'bg-rose-500', text: 'text-rose-600 bg-rose-50 border-rose-100' }
  };

  return (
    <div id={id} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Calendar Grid card */}
      <div className="bg-white border border-zinc-200/80 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] p-5 lg:col-span-7 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4.5 h-4.5 text-zinc-500" />
              <h4 className="text-sm font-semibold text-zinc-900 tracking-tight">Calendario de Seguimientos</h4>
            </div>
            <span className="text-xs font-bold text-zinc-700 bg-zinc-100 px-2.5 py-1 rounded-md">Agosto 2026</span>
          </div>

          {/* Weekdays header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {weekDays.map(day => (
              <span key={day} className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider py-1.5">{day}</span>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty days offsets */}
            {Array.from({ length: startDayOffset }).map((_, idx) => (
              <div key={`offset-${idx}`} className="aspect-square bg-zinc-50/20 border border-transparent" />
            ))}

            {/* Days of Month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = getDateString(dayNum);
              const dayItems = itemsByDate[dateStr] || [];
              const isSelected = selectedDate === dateStr;
              const isToday = dayNum === 3; // Aug 3 as today based on local time
              const pendingItemsCount = dayItems.filter(i => !i.completed).length;

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square p-1 border rounded-lg flex flex-col justify-between cursor-pointer transition-all relative ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/30 ring-2 ring-blue-500/10'
                      : 'border-zinc-100 hover:border-zinc-300 bg-white'
                  } ${isToday ? 'ring-1 ring-zinc-800' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-[11px] font-bold ${
                      isSelected 
                        ? 'text-blue-600 font-extrabold' 
                        : isToday 
                          ? 'text-zinc-950 font-black' 
                          : 'text-zinc-700'
                    }`}>
                      {dayNum}
                    </span>
                    {isToday && (
                      <span className="text-[7px] font-bold px-1 py-0.2 bg-zinc-900 text-white rounded">HOY</span>
                    )}
                  </div>

                  {/* Tasks Dots indicator */}
                  <div className="flex gap-0.5 flex-wrap items-center mt-1">
                    {dayItems.slice(0, 3).map((item, i) => (
                      <span
                        key={item.id}
                        className={`w-1.5 h-1.5 rounded-full ${item.completed ? 'bg-zinc-300' : priorityColors[item.priority].dot}`}
                        title={item.title}
                      />
                    ))}
                    {dayItems.length > 3 && (
                      <span className="text-[8px] leading-none text-zinc-400 font-bold">+{dayItems.length - 3}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Alta
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Media
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" /> Baja / Resuelto
            </span>
          </div>
          <span>Zona Horaria: Buenos Aires (GMT-3)</span>
        </div>
      </div>

      {/* Task detail card */}
      <div className="bg-white border border-zinc-200/80 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] p-5 lg:col-span-5 flex flex-col h-full">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4">
          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tareas Pendientes</h4>
            <span className="text-xs font-bold text-zinc-800 mt-1 block">Fecha: {selectedDate}</span>
          </div>
          
          <button
            onClick={() => setShowAddForm(prev => !prev)}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 px-2.5 py-1 hover:bg-blue-50 rounded-md transition-colors cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            Nuevo
          </button>
        </div>

        {/* Task lists container */}
        <div className="flex-1 overflow-y-auto space-y-2.5 min-h-[220px] max-h-[300px] pr-1">
          
          {/* Slide down quick add form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleCreateItem}
                className="bg-zinc-50 border border-zinc-200/80 p-3 rounded-lg space-y-2 mb-3 overflow-hidden"
              >
                <div>
                  <label className="text-[9px] font-bold text-zinc-400 uppercase block mb-0.5">Asunto de la tarea</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Llamar para verificar demo..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-zinc-200 rounded-md bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-zinc-400 uppercase block mb-0.5">Cliente / Contacto</label>
                  <input
                    type="text"
                    placeholder="Ej. Juan Pérez (Opcional)"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-zinc-200 rounded-md bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-bold text-zinc-400 uppercase block mb-0.5">Hora</label>
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full text-xs px-2 py-1.5 border border-zinc-200 rounded-md bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-zinc-400 uppercase block mb-0.5">Prioridad</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full text-xs px-2 py-1.5 border border-zinc-200 rounded-md bg-white focus:outline-none cursor-pointer"
                    >
                      <option value="Baja">Baja</option>
                      <option value="Media">Media</option>
                      <option value="Alta">Alta</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-1.5 pt-1.5">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-[10px] font-bold text-zinc-500 hover:text-zinc-700 px-2 py-1 hover:bg-zinc-200/50 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-neutral-50 font-bold text-xs rounded-md shadow-sm hover:shadow-md transition-all whitespace-nowrap cursor-pointer flex items-center gap-1"
                  >
                    Agregar
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* List existing agenda items */}
          {selectedDateItems.length > 0 ? (
            selectedDateItems.map((item) => (
              <div
                key={item.id}
                className={`p-3 bg-white border rounded-lg flex items-start gap-3 justify-between group transition-all ${
                  item.completed 
                    ? 'border-zinc-100 opacity-65 bg-zinc-50/40' 
                    : 'border-zinc-200 hover:border-zinc-300 shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
                }`}
              >
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleItem(item.id)}
                  className="mt-0.5 text-zinc-400 hover:text-blue-600 transition-colors"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 stroke-[2.2]" />
                  ) : (
                    <Circle className="w-4.5 h-4.5 stroke-[2]" />
                  )}
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <span className={`text-xs font-semibold block leading-tight ${item.completed ? 'line-through text-zinc-400' : 'text-zinc-800'}`}>
                    {item.title}
                  </span>
                  <span className="text-[10px] text-zinc-400 block mt-1 font-semibold truncate">
                    Cliente: {item.customerName}
                  </span>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] font-bold font-mono text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      {item.time} hs
                    </span>
                    
                    <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider ${priorityColors[item.priority].text}`}>
                      {item.priority}
                    </span>
                  </div>
                </div>

                {/* Delete action */}
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="text-zinc-300 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-rose-50"
                  title="Eliminar de la agenda"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-10 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/25">
              <span className="text-xs text-zinc-400">No hay seguimientos agendados para este día.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
