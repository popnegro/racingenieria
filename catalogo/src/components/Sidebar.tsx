import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Library, 
  Layers, 
  Search, 
  Sparkles,
  Bookmark,
  ChevronRight,
  Wifi,
  WifiOff
} from 'lucide-react';

interface SidebarProps {
  currentView: 'dashboard' | 'library' | 'categories';
  onViewChange: (view: 'dashboard' | 'library' | 'categories') => void;
  onOpenSearch: () => void;
  favoritesCount: number;
}

export default function Sidebar({ 
  currentView, 
  onViewChange, 
  onOpenSearch,
  favoritesCount
}: SidebarProps) {
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return (
    <aside id="app-sidebar" className="hidden lg:flex w-60 bg-[#FDFDFD] border-r border-[#EEEEEE] flex-col h-screen sticky top-0 text-[#111111]">
      {/* Platform Branding */}
      <div className="p-6 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#111111] flex items-center justify-center text-white font-mono font-bold text-base tracking-tight shrink-0">
            ST
          </div>
          <div className="min-w-0">
            <h1 className="font-semibold text-sm tracking-tight text-[#111111] truncate uppercase">BIBLIOTECA</h1>
            <p className="text-[10px] text-[#717171] font-mono tracking-widest uppercase mt-0.5 truncate">Industrial Hub</p>
          </div>
        </div>
      </div>

      {/* Spotlight Trigger */}
      <div className="px-4 mb-4">
        <button 
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#FFFFFF] hover:bg-[#FAFAFA] border border-[#EEEEEE] rounded-md text-xs transition-colors duration-150 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#717171]" />
            <span className="font-medium text-[#717171]">Buscar equipo...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[9px] font-sans font-medium bg-[#F5F5F5] border border-[#EEEEEE] rounded text-[#717171] select-none">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        <div className="px-3 mb-2 text-[10px] font-bold text-[#999999] tracking-widest uppercase">
          Plataforma
        </div>
        
        <button
          onClick={() => onViewChange('dashboard')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all cursor-pointer ${
            currentView === 'dashboard'
              ? 'bg-[#F5F5F5] text-[#111111]'
              : 'text-[#717171] hover:bg-[#FAFAFA] hover:text-[#111111]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </div>
          <ChevronRight className={`w-3 h-3 transition-transform ${currentView === 'dashboard' ? 'rotate-90 opacity-40' : 'opacity-0'}`} />
        </button>

        <button
          onClick={() => onViewChange('library')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all cursor-pointer ${
            currentView === 'library'
              ? 'bg-[#F5F5F5] text-[#111111]'
              : 'text-[#717171] hover:bg-[#FAFAFA] hover:text-[#111111]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Library className="w-4 h-4" />
            <span>Biblioteca</span>
          </div>
          <ChevronRight className={`w-3 h-3 transition-transform ${currentView === 'library' ? 'rotate-90 opacity-40' : 'opacity-0'}`} />
        </button>

        <button
          onClick={() => onViewChange('categories')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all cursor-pointer ${
            currentView === 'categories'
              ? 'bg-[#F5F5F5] text-[#111111]'
              : 'text-[#717171] hover:bg-[#FAFAFA] hover:text-[#111111]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4" />
            <span>Categorías</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] px-1.5 py-0.2 rounded ${currentView === 'categories' ? 'bg-[#EEEEEE] text-[#111111]' : 'bg-[#F5F5F5] text-[#717171]'}`}>
              27
            </span>
            <ChevronRight className={`w-3 h-3 transition-transform ${currentView === 'categories' ? 'rotate-90 opacity-40' : 'opacity-0'}`} />
          </div>
        </button>
      </nav>

      {/* Sidebar Footer with system integrity status */}
      <div className="p-4 border-t border-[#EEEEEE] mt-auto">
        <div className="p-4 bg-[#F9F9F9] rounded-xl border border-[#F0F0F0] space-y-1.5">
          <p className="text-[10px] uppercase tracking-widest text-[#999999] font-bold">Estado de Conexión</p>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            )}
            <span className="text-xs font-semibold text-[#111111]">
              {isOnline ? 'Sistemas en línea' : 'Modo Offline Activo'}
            </span>
          </div>
          <p className="text-[9px] text-[#717171] leading-relaxed">
            {isOnline 
              ? 'Catálogo sincronizado. Consultas en tiempo real activas.' 
              : 'Acceso local a manuales y fichas técnicas habilitado.'}
          </p>
        </div>
      </div>
    </aside>
  );
}
