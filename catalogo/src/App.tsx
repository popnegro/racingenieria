import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles, X, Info, Search, HelpCircle, FileText, Bell, LayoutDashboard, Library, Layers } from 'lucide-react';

import Sidebar from './components/Sidebar';
import SpotlightSearch from './components/SpotlightSearch';
import DashboardView from './components/DashboardView';
import LibraryView from './components/LibraryView';
import CategoriesView from './components/CategoriesView';
import EquipmentDetailView from './components/EquipmentDetailView';

import { EQUIPMENTS } from './data';
import { Equipment, MaintenanceLog } from './types';

export default function App() {
  // Views navigation
  const [currentView, setCurrentView] = useState<'dashboard' | 'library' | 'categories'>('dashboard');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);

  // Persistence of dynamic logs
  const [equipments, setEquipments] = useState<Equipment[]>(() => {
    const saved = localStorage.getItem('industrial_library_equipments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse equipments from localStorage, fallback to default.', e);
      }
    }
    return EQUIPMENTS;
  });

  // Persistence of bookmarked Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('industrial_library_favorites');
    return saved ? JSON.parse(saved) : ['eq-sinamics-g120', 'eq-problue-flex'];
  });

  // Spotlight search overlay visibility
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Toast system state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem('industrial_library_equipments', JSON.stringify(equipments));
  }, [equipments]);

  useEffect(() => {
    localStorage.setItem('industrial_library_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Command palette hotkey (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Show Toast wrapper
  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    const t = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    return () => clearTimeout(t);
  }, []);

  // Handle bookmarked item toggling
  const handleToggleFavorite = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(favId => favId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  // Handle registering/adding new maintenance logs
  const handleAddMaintenanceLog = useCallback((equipmentId: string, log: MaintenanceLog) => {
    setEquipments(prevList => {
      return prevList.map(eq => {
        if (eq.id === equipmentId) {
          // If the added log type is critical, we could theoretically change status!
          let nextStatus = eq.status;
          if (log.type === 'corrective') {
            nextStatus = 'operational'; // fixed
          }
          return {
            ...eq,
            status: nextStatus,
            logs: [log, ...eq.logs]
          };
        }
        return eq;
      });
    });
  }, []);

  // Quick select category from dashboard
  const handleSelectCategory = useCallback((catId: string | null) => {
    setSelectedCategoryId(catId);
    setCurrentView('library');
    setSelectedEquipmentId(null);
  }, []);

  // Select single equipment to view details
  const handleSelectEquipment = useCallback((id: string) => {
    setSelectedEquipmentId(id);
  }, []);

  return (
    <div id="app-root" className="flex bg-[#FDFDFD] text-[#111111] min-h-screen font-sans selection:bg-[#111111] selection:text-white">
      
      {/* 1. Sidebar minimalista */}
      <Sidebar 
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          setSelectedEquipmentId(null); // Clear selected item when moving views
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        favoritesCount={favorites.length}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-h-screen bg-[#FFFFFF] relative">
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-10 bg-[#FFFFFF]/80 backdrop-blur-md border-b border-[#F0F0F0] px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="lg:hidden w-7 h-7 rounded bg-[#111111] flex items-center justify-center text-white font-mono font-bold text-xs tracking-tight shrink-0">
              ST
            </div>
            <span className="text-[10px] font-bold text-[#999999] font-mono tracking-widest uppercase truncate max-w-[120px] sm:max-w-none">
              CATÁLOGO INDUSTRIAL
            </span>
            <span className="hidden sm:inline text-[#EEEEEE] font-light">|</span>
            <span className="hidden sm:inline text-xs text-[#717171] font-medium truncate">Búsqueda directa e indexación de planos</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Quick search badge */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="px-2.5 py-1 bg-[#FAFAFA] hover:bg-[#F5F5F5] border border-[#EEEEEE] rounded text-[11px] font-semibold text-[#111111] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-[#717171]" />
              <span className="hidden xs:inline">Spotlight</span>
            </button>
            
            {/* Helpful user info badge */}
            <div className="flex items-center gap-1.5 text-[#717171]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] sm:text-[11px] font-semibold truncate max-w-[80px] xs:max-w-[120px] sm:max-w-none">
                grasso.luis@gmail.com
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Core View Body Container */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 pb-24 lg:pb-8">
          <AnimatePresence mode="wait">
            {selectedEquipmentId ? (
              // Detailed Equipment View (Apple Support Editorial layout)
              <motion.div
                key={`detail-${selectedEquipmentId}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.18 }}
              >
                <EquipmentDetailView 
                  equipmentId={selectedEquipmentId}
                  onBack={() => setSelectedEquipmentId(null)}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onSelectEquipment={handleSelectEquipment}
                  onAddMaintenanceLog={handleAddMaintenanceLog}
                  onShowToast={showToast}
                  equipments={equipments}
                />
              </motion.div>
            ) : currentView === 'dashboard' ? (
              // Pristine Dashboard overview
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.18 }}
              >
                <DashboardView 
                  onSelectEquipment={handleSelectEquipment}
                  onViewChange={setCurrentView}
                  onSelectCategory={handleSelectCategory}
                  onOpenSearch={() => setIsSearchOpen(true)}
                  favorites={favorites}
                />
              </motion.div>
            ) : currentView === 'library' ? (
              // Editorial VFD/Sensor catalog with search filters
              <motion.div
                key="library"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.18 }}
              >
                <LibraryView 
                  onSelectEquipment={handleSelectEquipment}
                  selectedCategory={selectedCategoryId}
                  onSelectCategory={setSelectedCategoryId}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />
              </motion.div>
            ) : (
              // Structured grid of 27 technical categories
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.18 }}
              >
                <CategoriesView 
                  onSelectCategory={handleSelectCategory}
                  onViewChange={setCurrentView}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* 4. Mobile Bottom Navigation Bar (Visible only on mobile/tablet) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EEEEEE] px-4 py-2.5 flex items-center justify-around shadow-lg">
          <button
            onClick={() => {
              setCurrentView('dashboard');
              setSelectedEquipmentId(null);
            }}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors cursor-pointer ${
              currentView === 'dashboard' && !selectedEquipmentId ? 'text-zinc-950 font-semibold' : 'text-[#717171]'
            }`}
          >
            <LayoutDashboard className="w-4.5 h-4.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('library');
              setSelectedEquipmentId(null);
            }}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors cursor-pointer ${
              currentView === 'library' && !selectedEquipmentId ? 'text-zinc-950 font-semibold' : 'text-[#717171]'
            }`}
          >
            <Library className="w-4.5 h-4.5" />
            <span>Biblioteca</span>
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center gap-1 text-[10px] font-medium text-[#717171] cursor-pointer"
          >
            <Search className="w-4.5 h-4.5" />
            <span>Buscar</span>
          </button>

          <button
            onClick={() => {
              setCurrentView('categories');
              setSelectedEquipmentId(null);
            }}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors cursor-pointer ${
              currentView === 'categories' && !selectedEquipmentId ? 'text-zinc-950 font-semibold' : 'text-[#717171]'
            }`}
          >
            <Layers className="w-4.5 h-4.5" />
            <span>Categorías</span>
          </button>
        </div>

      </div>

      {/* 2. Spotlight Command Palette Search Overlay */}
      <SpotlightSearch 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectEquipment={handleSelectEquipment}
      />

      {/* 3. Global Premium Toast notification banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 p-4 bg-slate-950 text-white rounded-xl shadow-xl border border-white/10 flex items-center gap-3 max-w-sm"
          >
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-xs font-semibold leading-normal">{toastMessage}</p>
            <button 
              onClick={() => setToastMessage(null)}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
