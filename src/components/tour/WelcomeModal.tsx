import React from 'react';
import { useProductTour } from './ProductTourContext';
import { HelpCircle, Sparkles, Clock, Compass, ShieldAlert, X } from 'lucide-react';

export const WelcomeModal: React.FC = () => {
  const { currentStepIndex, isActive, startTour, skipTour } = useProductTour();

  // Only render on the first step (welcome step) and when the tour is running
  if (!isActive || currentStepIndex !== 0) return null;

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
      {/* Light background scrim */}
      <div 
        onClick={skipTour}
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-md transition-all duration-300" 
      />

      {/* Main card */}
      <div 
        id="tour-welcome-modal"
        className="relative bg-white border border-zinc-200 w-full max-w-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden select-none animate-[scaleIn_0.3s_cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* Decorative Brand Header Pattern */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-6 md:p-8 text-white relative">
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <Clock className="w-3.5 h-3.5 text-blue-200" />
            <span className="text-[10px] font-bold text-blue-100 tracking-wider">
              Est. ~3 Minutos
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md overflow-hidden border border-zinc-200">
              <img 
                src="https://racingenieria.com.ar/inicio/wp-content/uploads/2026/05/marca_racTM2.jpg" 
                alt="RAC Logo" 
                className="max-h-full max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-[9px] font-black tracking-widest text-blue-200 uppercase">
                CONSOLA DE INTRODUCCIÓN
              </span>
              <h2 className="text-xl md:text-2xl font-black tracking-tight mt-0.5 font-display text-white">
                Bienvenido a RAC Customer Desk
              </h2>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6 bg-white">
          <div className="space-y-3">
            <p className="text-zinc-600 text-sm leading-relaxed font-medium">
              Hola, le damos la bienvenida a la consola técnica integrada de <strong>RAC Ingeniería</strong>. 
              Este panel automatizado unifica la recepción de activos complejos, la calibración técnica, 
              la gestión de inventario crítico y el seguimiento de KPIs operativos para laboratorios de alta complejidad.
            </p>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Le guiaremos a través de un recorrido interactivo para que aprenda a registrar activos, 
              controlar estados de servicio, auditar bitácoras operacionales e interpretar las analíticas avanzadas.
            </p>
          </div>

          {/* Key Value Propositions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg h-fit">
                <Sparkles className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Cero Retrasos Manuales</h4>
                <p className="text-[10.5px] text-zinc-500 leading-relaxed mt-0.5">
                  Estandarice la entrada de activos con especificaciones de motor/tensión validadas hoy.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg h-fit">
                <Compass className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Trazabilidad Total de OT</h4>
                <p className="text-[10.5px] text-zinc-500 leading-relaxed mt-0.5">
                  Asocie calibraciones y calibraciones dinámicas a cada número de serie único del cliente.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Actions Footer */}
          <div className="flex items-center justify-between gap-4 pt-3 border-t border-zinc-100">
            <button
              onClick={skipTour}
              className="px-4 py-2 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              Omitir Introducción
            </button>

            <button
              onClick={startTour}
              className="px-5 py-2.5 bg-primary hover:bg-primary/90 active:scale-95 text-neutral-50 rounded-xl text-xs font-bold shadow-md shadow-primary/10 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Comenzar Recorrido
              <Compass className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
