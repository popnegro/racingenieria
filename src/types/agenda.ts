export type AgendaPriority = 'Baja' | 'Media' | 'Alta';

export interface AgendaItemInput {
  title: string;
  customerName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  priority: AgendaPriority;
}
