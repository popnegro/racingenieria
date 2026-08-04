import React, { useState, useEffect } from 'react';
import { X, Sliders, Check, Sparkles, AlertCircle, RefreshCw, Eye, Languages, EyeOff } from 'lucide-react';

interface PersonalizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PersonalizationDialog: React.FC<PersonalizationDialogProps> = ({
  isOpen,
  onClose
}) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'slate'>('light');
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [largeText, setLargeText] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Load persisted settings on mount
    const saved = localStorage.getItem('rac_personalization_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTheme(parsed.theme || 'light');
        setLanguage(parsed.language || 'es');
        setLargeText(parsed.largeText || false);
        setReducedMotion(parsed.reducedMotion || false);
        setHighContrast(parsed.highContrast || false);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSave = () => {
    const settings = { theme, language, largeText, reducedMotion, highContrast };
    localStorage.setItem('rac_personalization_settings', JSON.stringify(settings));
    
    // Apply immediate classes to document body
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (highContrast) {
      document.documentElement.classList.add('contrast-125');
    } else {
      document.documentElement.classList.remove('contrast-125');
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-md transition-all" 
      />

      {/* Main container */}
      <div 
        id="personalization-dialog-box"
        className="relative bg-white border border-zinc-200 w-full max-w-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden select-none animate-[scaleIn_0.2s_cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Sliders className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 tracking-tight leading-none">Personalización y Accesibilidad</h3>
              <p className="text-[10px] text-zinc-400 font-bold mt-1 uppercase tracking-wider">Preferencias de Consola</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preferences panel */}
        <div className="p-6 space-y-5">
          {/* Theme selection */}
          <div className="space-y-2">
            <label className="text-[9px] font-black tracking-widest text-zinc-400 uppercase block">
              Esquema de Colores
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={() => setTheme('light')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                  theme === 'light'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                    : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600'
                }`}
              >
                Claro Industrial
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                  theme === 'dark'
                    ? 'border-zinc-800 bg-zinc-900 text-zinc-100 shadow-sm'
                    : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600'
                }`}
              >
                Oscuro Laboratorio
              </button>
              <button
                onClick={() => setTheme('slate')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                  theme === 'slate'
                    ? 'border-zinc-500 bg-zinc-100 text-zinc-700 shadow-sm'
                    : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600'
                }`}
              >
                Gris Técnico
              </button>
            </div>
          </div>

          {/* Language selection */}
          <div className="space-y-2">
            <label className="text-[9px] font-black tracking-widest text-zinc-400 uppercase block">
              Idioma de la Consola
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setLanguage('es')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  language === 'es'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-sm'
                    : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600'
                }`}
              >
                <Languages className="w-3.5 h-3.5" />
                Español (Técnico)
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  language === 'en'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-sm'
                    : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600'
                }`}
              >
                <Languages className="w-3.5 h-3.5" />
                English (Technical)
              </button>
            </div>
          </div>

          {/* Accessibility toggles */}
          <div className="space-y-3 pt-2">
            <label className="text-[9px] font-black tracking-widest text-zinc-400 uppercase block">
              Opciones de Accesibilidad
            </label>

            <div className="space-y-2.5">
              <label className="flex items-center gap-3 p-3 bg-zinc-50/60 hover:bg-zinc-50 border border-zinc-150 rounded-xl cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={largeText}
                  onChange={(e) => setLargeText(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-zinc-300 rounded focus:ring-blue-500"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-zinc-800 block">Texto de Mayor Tamaño</span>
                  <span className="text-[10px] text-zinc-400 font-semibold block">Aumenta las fuentes para facilitar la lectura del panel técnico.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-zinc-50/60 hover:bg-zinc-50 border border-zinc-150 rounded-xl cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-zinc-300 rounded focus:ring-blue-500"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-zinc-800 block">Modo Alto Contraste</span>
                  <span className="text-[10px] text-zinc-400 font-semibold block">Asegura un contraste WCAG AAA óptimo para entornos oscuros o con reflejos.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-zinc-50/60 hover:bg-zinc-50 border border-zinc-150 rounded-xl cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={(e) => setReducedMotion(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-zinc-300 rounded focus:ring-blue-500"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-zinc-800 block">Movimiento Reducido</span>
                  <span className="text-[10px] text-zinc-400 font-semibold block">Inhabilita transiciones y animaciones complejas de framer-motion.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Footer Save Area */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-zinc-200 hover:bg-zinc-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
                saveSuccess
                  ? 'bg-emerald-600 text-white shadow-emerald-600/10'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/10'
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  ¡Aplicado con Éxito!
                </>
              ) : (
                <>
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
