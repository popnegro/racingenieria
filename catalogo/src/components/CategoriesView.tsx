import React from 'react';
import * as LucideIcons from 'lucide-react';
import { CATEGORIES, EQUIPMENTS } from '../data';

interface CategoriesViewProps {
  onSelectCategory: (catId: string) => void;
  onViewChange: (view: 'library') => void;
}

export default function CategoriesView({ onSelectCategory, onViewChange }: CategoriesViewProps) {
  
  // Dynamically calculate counts for each category
  const categoriesWithCounts = CATEGORIES.map(cat => {
    const count = EQUIPMENTS.filter(eq => eq.categoryId === cat.id).length;
    return {
      ...cat,
      count
    };
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-6 px-4 font-sans animate-fade-in">
      
      {/* Editorial Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#F5F5F5] border border-[#EEEEEE] text-[#717171] font-mono text-[9px] uppercase font-bold tracking-widest">
          Navegación Nivel 1
        </div>
        <h2 className="text-3xl font-light tracking-tight text-[#111111] mt-2">
          Las 27 Categorías del Catálogo
        </h2>
        <p className="text-sm text-[#717171] max-w-xl mt-1.5 leading-relaxed font-light">
          Estructura de clasificación técnica industrial. Navegue de forma inmediata por las familias de componentes electrónicos para acceder a sus manuales y esquemas.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoriesWithCounts.map((cat, idx) => {
          // Resolve Lucide Icon dynamically
          const IconComponent = (LucideIcons as any)[cat.iconName] || LucideIcons.Layers;

          return (
            <div
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                onViewChange('library');
              }}
              className="p-5 bg-white border border-[#EEEEEE] hover:border-[#CCCCCC] rounded-xl transition-all duration-200 group cursor-pointer flex items-start gap-4"
            >
              {/* Icon Frame */}
              <div className="w-10 h-10 rounded-lg bg-[#F5F5F7] border border-[#EEEEEE] flex items-center justify-center text-[#717171] shrink-0 group-hover:bg-[#111111] group-hover:text-white transition-all duration-200">
                <IconComponent className="w-5 h-5" />
              </div>

              {/* Text Meta */}
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-semibold text-[#111111] truncate transition-colors">
                    {cat.name}
                  </h3>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                    cat.count && cat.count > 0 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-[#F5F5F7] border-transparent text-[#999999]'
                  }`}>
                    {cat.count}
                  </span>
                </div>
                <p className="text-[11px] text-[#717171] leading-relaxed line-clamp-2 font-light">
                  {cat.description}
                </p>
                
                {/* Visual marker */}
                <span className="inline-flex items-center gap-1 pt-1.5 text-[10px] font-semibold text-[#111111] group-hover:text-[#717171] group-hover:translate-x-0.5 transition-all duration-200">
                  <span>Explorar categoría</span>
                  <LucideIcons.ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
