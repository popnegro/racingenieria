import React, { useState, useMemo } from 'react';
import { 
  SlidersHorizontal, 
  Search, 
  MapPin, 
  Tag, 
  Bookmark, 
  ChevronRight, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  X,
  ArrowUpDown
} from 'lucide-react';
import { Equipment, Category } from '../types';
import { EQUIPMENTS, CATEGORIES, MANUFACTURERS } from '../data';

interface LibraryViewProps {
  onSelectEquipment: (id: string) => void;
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

type SortOption = 'name-asc' | 'name-desc' | 'status' | 'manufacturer';

export default function LibraryView({ 
  onSelectEquipment, 
  selectedCategory, 
  onSelectCategory,
  favorites,
  onToggleFavorite
}: LibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [showFilters, setShowFilters] = useState(false);

  // Filter & sort equipments
  const processedEquipments = useMemo(() => {
    let items = [...EQUIPMENTS];

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      items = items.filter(eq => 
        eq.name.toLowerCase().includes(q) ||
        eq.model.toLowerCase().includes(q) ||
        eq.series.toLowerCase().includes(q) ||
        eq.manufacturer.toLowerCase().includes(q) ||
        eq.protocols.some(p => p.toLowerCase().includes(q)) ||
        eq.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCategory) {
      items = items.filter(eq => eq.categoryId === selectedCategory);
    }

    // Manufacturer
    if (selectedManufacturer) {
      items = items.filter(eq => eq.manufacturer.toLowerCase() === selectedManufacturer.toLowerCase());
    }

    // Status
    if (selectedStatus) {
      items = items.filter(eq => eq.status === selectedStatus);
    }

    // Sorting
    items.sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      if (sortBy === 'manufacturer') {
        return a.manufacturer.localeCompare(b.manufacturer);
      }
      return 0;
    });

    return items;
  }, [searchQuery, selectedCategory, selectedManufacturer, selectedStatus, sortBy]);

  // Active category details
  const activeCategoryInfo = useMemo(() => {
    return CATEGORIES.find(c => c.id === selectedCategory) || null;
  }, [selectedCategory]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-6 px-4 font-sans animate-fade-in">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-light tracking-tight text-[#111111]">
            {activeCategoryInfo ? activeCategoryInfo.name : 'Biblioteca de Equipos'}
          </h2>
          <p className="text-sm text-[#717171] max-w-xl mt-1.5 leading-relaxed font-light">
            {activeCategoryInfo 
              ? activeCategoryInfo.description 
              : 'Catálogo de alta precisión visual para exploración técnica directa, localización en planta, estado operativo y esquemas de conexión.'
            }
          </p>
        </div>
        
        {/* Quick sorting controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              showFilters || selectedManufacturer || selectedStatus
                ? 'bg-[#111111] text-white border-[#111111] shadow-xs' 
                : 'bg-white text-[#111111] border-[#EEEEEE] hover:bg-[#FAFAFA]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtros</span>
            {(selectedManufacturer || selectedStatus) && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            )}
          </button>

          <div className="relative inline-flex items-center gap-1.5 bg-white border border-[#EEEEEE] rounded-lg px-2.5 py-2 text-[#111111]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#CCCCCC]" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-xs font-semibold text-[#111111] outline-none border-none bg-transparent cursor-pointer pr-1"
            >
              <option value="name-asc">Nombre (A-Z)</option>
              <option value="name-desc">Nombre (Z-A)</option>
              <option value="status">Estado</option>
              <option value="manufacturer">Fabricante</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories Horizontal Scroll Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Filtrar por Categoría</span>
          {selectedCategory && (
            <button 
              onClick={() => onSelectCategory(null)}
              className="text-[10px] text-[#717171] hover:text-[#111111] flex items-center gap-0.5 cursor-pointer"
            >
              <span>Limpiar categoría</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mask-image">
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border cursor-pointer transition-all shrink-0 ${
              !selectedCategory 
                ? 'bg-[#111111] border-[#111111] text-white' 
                : 'bg-[#F5F5F7] border-transparent text-[#717171] hover:bg-[#EEEEEE]'
            }`}
          >
            Todas las categorías
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border cursor-pointer transition-all shrink-0 ${
                selectedCategory === cat.id 
                  ? 'bg-[#111111] border-[#111111] text-white' 
                  : 'bg-[#F5F5F7] border-transparent text-[#717171] hover:bg-[#EEEEEE]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Expandable Advanced Filters Drawer Panel */}
      {showFilters && (
        <div className="p-4 bg-[#F9F9F9] border border-[#F0F0F0] rounded-xl grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-down">
          
          {/* Search Box */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#999999] uppercase tracking-widest">Búsqueda libre</label>
            <div className="relative flex items-center bg-white border border-[#EEEEEE] rounded-lg px-2.5 py-1.5">
              <Search className="w-3.5 h-3.5 text-[#999999] mr-2" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Escriba palabra clave..."
                className="w-full text-xs font-medium outline-none bg-transparent placeholder-[#BBBBBB]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-0.5 text-[#999999] hover:text-[#111111]">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Manufacturer Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#999999] uppercase tracking-widest">Fabricante</label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedManufacturer(null)}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  !selectedManufacturer ? 'bg-[#111111] text-white font-semibold' : 'bg-white border border-[#EEEEEE] hover:bg-[#FAFAFA] text-[#717171]'
                }`}
              >
                Todos
              </button>
              {MANUFACTURERS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedManufacturer(m.name)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    selectedManufacturer?.toLowerCase() === m.name.toLowerCase() 
                      ? 'bg-[#111111] text-white font-semibold' 
                      : 'bg-white border border-[#EEEEEE] hover:bg-[#FAFAFA] text-[#717171]'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#999999] uppercase tracking-widest">Estado Operativo</label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'Todos', value: null },
                { label: 'Operativo', value: 'operational' },
                { label: 'Mantenimiento', value: 'maintenance' }
              ].map(st => (
                <button
                  key={st.value || 'all'}
                  onClick={() => setSelectedStatus(st.value)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    selectedStatus === st.value ? 'bg-[#111111] text-white font-semibold' : 'bg-white border border-[#EEEEEE] hover:bg-[#FAFAFA] text-[#717171]'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Main Grid View of Editorial Cards */}
      {processedEquipments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedEquipments.map(eq => {
            const isFavorite = favorites.includes(eq.id);
            return (
              <div 
                key={eq.id}
                onClick={() => onSelectEquipment(eq.id)}
                className="bg-white border border-[#EEEEEE] rounded-2xl overflow-hidden hover:border-[#CCCCCC] transition-all duration-300 group cursor-pointer flex flex-col h-[350px]"
              >
                {/* Visual Image Section */}
                <div className="relative h-48 w-full bg-[#F5F5F7] overflow-hidden shrink-0">
                  <img 
                    src={eq.images.general} 
                    alt={eq.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />
                  
                  {/* Subtle Dark Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/15 via-transparent to-transparent" />
                  
                  {/* Manufacturer Badge */}
                  <span className="absolute top-4 left-4 px-2 py-0.5 text-[9px] font-bold uppercase bg-[#111111] text-white rounded tracking-widest">
                    {eq.manufacturer}
                  </span>

                  {/* Operational status marker */}
                  <span className={`absolute top-4 right-4 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase backdrop-blur-md border ${
                    eq.status === 'operational' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      eq.status === 'operational' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} />
                    <span>{eq.status === 'operational' ? 'OPERATIVO' : 'MANTENIMIENTO'}</span>
                  </span>

                  {/* Bookmark Button */}
                  <button 
                    onClick={(e) => onToggleFavorite(eq.id, e)}
                    className="absolute bottom-4 right-4 p-2 bg-[#111111]/75 hover:bg-[#111111] backdrop-blur-md rounded-full text-white transition-all cursor-pointer border border-[#EEEEEE]/10"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                  </button>
                </div>

                {/* Content Section (Minimal, elegant, clean) */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="text-base font-semibold text-[#111111] tracking-tight leading-snug group-hover:text-black transition-colors line-clamp-1">
                        {eq.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#717171]">
                      <span>Mod. <strong>{eq.model}</strong></span>
                      <span>•</span>
                      <span>S/N {eq.series}</span>
                    </div>
                  </div>

                  {/* Layout Bottom Details */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#F5F5F7] mt-auto">
                    <div className="flex items-center gap-1.5 text-xs text-[#717171] max-w-[65%] font-light">
                      <MapPin className="w-3.5 h-3.5 text-[#CCCCCC] shrink-0" />
                      <span className="truncate">{eq.location}</span>
                    </div>

                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#111111] group-hover:text-[#717171] transition-colors">
                      <span>Ver Ficha</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center border border-dashed border-[#EEEEEE] bg-[#F9F9F9] rounded-2xl animate-fade-in">
          <X className="w-8 h-8 text-[#CCCCCC] mx-auto mb-3" />
          <p className="text-sm font-semibold text-[#111111]">No se encontraron equipos catalogados</p>
          <p className="text-xs text-[#717171] mt-1 max-w-sm mx-auto font-light leading-relaxed">
            No hay elementos cargados que coincidan con la búsqueda actual o filtros seleccionados en esta categoría.
          </p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedManufacturer(null);
              setSelectedStatus(null);
              onSelectCategory(null);
            }}
            className="mt-4 px-4 py-2 bg-[#111111] hover:bg-black text-white rounded text-xs font-semibold cursor-pointer transition-colors"
          >
            Restaurar filtros de biblioteca
          </button>
        </div>
      )}

    </div>
  );
}
