import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Activity, 
  Wrench, 
  Package, 
  Play, 
  Check,
  AlertCircle
} from 'lucide-react';
import { CustomerStatus, OTEstado } from '../types';

interface StatusBadgeProps {
  id?: string;
  status: CustomerStatus | OTEstado;
  className?: string;
}

export default function StatusBadge({ id, status, className = '' }: StatusBadgeProps) {
  const config: Record<
    string, 
    { 
      text: string; 
      bg: string; 
      textClass: string; 
      icon: React.ComponentType<{ className?: string }>;
      dot: string;
    }
  > = {
    // Customer status style
    Activo: {
      text: 'Activo',
      bg: 'bg-emerald-50 border border-emerald-300',
      textClass: 'text-emerald-800',
      icon: CheckCircle2,
      dot: 'bg-emerald-600'
    },
    Inactivo: {
      text: 'Inactivo',
      bg: 'bg-zinc-100 border border-zinc-300',
      textClass: 'text-zinc-600',
      icon: XCircle,
      dot: 'bg-zinc-500'
    },
    // Case/Call status style
    Abierto: {
      text: 'Abierto',
      bg: 'bg-blue-50 border border-blue-300',
      textClass: 'text-blue-800',
      icon: Clock,
      dot: 'bg-blue-600'
    },
    Resuelto: {
      text: 'Resuelto',
      bg: 'bg-emerald-50 border border-emerald-300',
      textClass: 'text-emerald-800',
      icon: CheckCircle2,
      dot: 'bg-emerald-600'
    },
    Pendiente: {
      text: 'Pendiente',
      bg: 'bg-amber-50 border border-amber-300',
      textClass: 'text-amber-800',
      icon: AlertTriangle,
      dot: 'bg-amber-600'
    },
    // OTEstado workflow
    Recepcionado: {
      text: 'Recepcionado',
      bg: 'bg-slate-100 border border-slate-300',
      textClass: 'text-slate-800',
      icon: FileText,
      dot: 'bg-slate-500'
    },
    'En diagnóstico': {
      text: 'En Diagnóstico',
      bg: 'bg-indigo-50 border border-indigo-300',
      textClass: 'text-indigo-800',
      icon: Activity,
      dot: 'bg-indigo-600'
    },
    'Esperando aprobación': {
      text: 'Esperando Aprobación',
      bg: 'bg-amber-50 border border-amber-300',
      textClass: 'text-amber-800',
      icon: AlertCircle,
      dot: 'bg-amber-600'
    },
    'En reparación': {
      text: 'En Reparación',
      bg: 'bg-blue-50 border border-blue-300',
      textClass: 'text-blue-800',
      icon: Wrench,
      dot: 'bg-blue-600'
    },
    'Esperando repuestos': {
      text: 'Esperando Repuestos',
      bg: 'bg-rose-50 border border-rose-300',
      textClass: 'text-rose-800',
      icon: Package,
      dot: 'bg-rose-600'
    },
    'En prueba': {
      text: 'En Prueba',
      bg: 'bg-orange-50 border border-orange-300',
      textClass: 'text-orange-800',
      icon: Play,
      dot: 'bg-orange-600'
    },
    Finalizado: {
      text: 'Finalizado',
      bg: 'bg-teal-50 border border-teal-300',
      textClass: 'text-teal-800',
      icon: CheckCircle2,
      dot: 'bg-teal-600'
    },
    Entregado: {
      text: 'Entregado',
      bg: 'bg-emerald-50 border border-emerald-300',
      textClass: 'text-emerald-800',
      icon: Check,
      dot: 'bg-emerald-600'
    }
  };

  const active = config[status] || {
    text: status,
    bg: 'bg-zinc-100 border border-zinc-300',
    textClass: 'text-zinc-800',
    icon: AlertCircle,
    dot: 'bg-zinc-500'
  };

  const IconComponent = active.icon;

  return (
    <span
      id={id}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold leading-none whitespace-nowrap transition-colors ${active.bg} ${active.textClass} ${className}`}
    >
      <IconComponent className="w-3.5 h-3.5 shrink-0" />
      <span className={`w-1.5 h-1.5 rounded-full ${active.dot}`} />
      <span>{active.text}</span>
    </span>
  );
}
