import React, { useEffect } from 'react';
import { X, Keyboard, ArrowRight, CornerDownLeft, Eye, RefreshCw } from 'lucide-react';

interface ShortcutsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTour: () => void;
  onNavigate: (view: string) => void;
}

export const ShortcutsDialog: React.FC<ShortcutsDialogProps> = ({
  isOpen,
  onClose,
  onStartTour,
  onNavigate
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcutsList = [
    { key: 'D', action: 'Ir a Dashboard Principal', cat: 'Navegación', view: 'dashboard' },
    { key: 'C', action: 'Ir a Clientes Industriales', cat: 'Navegación', view: 'customers' },
    { key: 'O', action: 'Ir a Recepción y OTs', cat: 'Navegación', view: 'call-register' },
    { key: 'A', action: 'Ir a Agenda Técnica', cat: 'Navegación', view: 'agenda' },
    { key: 'B', action: 'Ir a Bitácora Operativa', cat: 'Navegación', view: 'timeline' },
    { key: 'R', action: 'Ir a Reportes y KPIs', cat: 'Navegación', view: 'insights' },
    { key: 'K', action: 'Abrir/Cerrar Menú de Atajos', cat: 'Consola', isSelf: true },
    { key: 'T', action: 'Iniciar Recorrido Guiado (Tour)', cat: 'Ayuda', isTour: true },
    { key: 'ESC', action: 'Cerrar modales y menús', cat: 'Consola' }
  ];

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-md transition-all" 
      />

      {/* Main dialog box */}
      <div 
        id="shortcuts-dialog-box"
        className="relative bg-white border border-zinc-200 w-full max-w-lg rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden select-none animate-[scaleIn_0.2s_cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Keyboard className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 tracking-tight leading-none">Centro de Atajos de Teclado</h3>
              <p className="text-[10px] text-zinc-400 font-bold mt-1 uppercase tracking-wider">Productividad en Laboratorio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts grid table */}
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <span className="text-[9px] font-black tracking-widest text-zinc-400 uppercase block px-1">
              Atajos de Teclado Globales
            </span>
            <div className="border border-zinc-150 rounded-xl divide-y divide-zinc-100 overflow-hidden bg-zinc-50/20">
              {shortcutsList.map((shortcut) => (
                <div 
                  key={shortcut.key}
                  className="flex items-center justify-between p-3 hover:bg-zinc-50/80 transition-colors group cursor-pointer"
                  onClick={() => {
                    if (shortcut.view) {
                      onNavigate(shortcut.view);
                      onClose();
                    } else if (shortcut.isTour) {
                      onStartTour();
                      onClose();
                    } else if (shortcut.isSelf) {
                      onClose();
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200/60 shadow-sm min-w-[20px] text-center uppercase tracking-wide">
                      {shortcut.key}
                    </span>
                    <span className="text-xs font-semibold text-zinc-700 group-hover:text-blue-600 transition-colors">
                      {shortcut.action}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-zinc-400/80 bg-zinc-100/50 px-2 py-0.5 rounded-full border border-zinc-150">
                      {shortcut.cat}
                    </span>
                    {shortcut.view && (
                      <ArrowRight className="w-3 h-3 text-zinc-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Info Onboarding Button */}
          <div className="p-4 bg-blue-50/50 border border-blue-100/50 rounded-xl flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-blue-900 leading-tight">¿Desea volver a ver el recorrido guiado?</h4>
              <p className="text-[10px] text-blue-700 font-medium">Configure y aprenda todos los módulos críticos del sistema en 3 minutos.</p>
            </div>
            <button
              onClick={() => {
                onStartTour();
                onClose();
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow-md transition-all whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} />
              Iniciar Tour [T]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
