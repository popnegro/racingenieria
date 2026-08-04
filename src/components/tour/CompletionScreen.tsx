import React from 'react';
import { useProductTour } from './ProductTourContext';
import { CheckCircle, Trophy, RotateCcw, ArrowRight, ArrowUpRight, HelpCircle, FileText } from 'lucide-react';

export const CompletionScreen: React.FC = () => {
  const { currentStepIndex, steps, isActive, nextStep, startTour, skipTour } = useProductTour();

  // Only render on the last step (completion step) and when the tour is running
  if (!isActive || currentStepIndex !== steps.length - 1) return null;

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
      {/* Light background scrim */}
      <div 
        onClick={skipTour}
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-md transition-all duration-300" 
      />

      {/* Main card */}
      <div 
        id="tour-completion-modal"
        className="relative bg-white border border-zinc-200 w-full max-w-lg rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden select-none animate-[scaleIn_0.3s_cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* Celebration Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-800 p-6 md:p-8 text-white text-center relative flex flex-col items-center">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-emerald-200 mb-3 border border-white/15">
            <Trophy className="w-6 h-6 stroke-[2]" />
          </div>

          <span className="text-[9px] font-black tracking-widest text-emerald-200 uppercase">
            ¡RECORRIDO FINALIZADO!
          </span>
          <h2 className="text-xl md:text-2xl font-black tracking-tight mt-0.5 font-display text-white">
            ¡Ya está listo para operar!
          </h2>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6 bg-white">
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest block">
                Logros Completados
              </span>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Introducción a Consola Operativa y KPIs</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Flujo de Clientes y Trazabilidad de Activos</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ingreso Técnico de Equipos e Inventario</span>
                </div>
              </div>
            </div>

            {/* Quick Operating Tips */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2.5">
              <div className="flex items-center gap-1.5 pb-1.5 border-b border-zinc-200/50">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-extrabold text-slate-800 tracking-tight">Consejos Rápidos para el Éxito</h4>
              </div>
              <ul className="text-[11px] text-zinc-500 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>Presione <strong>K</strong> en su teclado para abrir y cerrar el menú de atajos táctiles desde cualquier vista.</li>
                <li>Haga clic en un cliente en el directorio para abrir su ficha completa con histórico y ficha de activos.</li>
                <li>Mantenga su estado actualizado en la barra superior para optimizar la logística de asignaciones.</li>
              </ul>
            </div>
          </div>

          {/* Call to Actions Footer */}
          <div className="flex items-center justify-between gap-4 pt-3 border-t border-zinc-100">
            <button
              onClick={startTour}
              className="px-3.5 py-2 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reiniciar Tour
            </button>

            <button
              onClick={nextStep} // Completes and exits the tour
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/10 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Comenzar Operación
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
