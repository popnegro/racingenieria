import React, { useState, useEffect, useRef } from 'react';
import { Search, Compass, Cpu, Tag, ArrowRight, ShieldAlert, Cpu as CoreIcon, Info } from 'lucide-react';
import { Equipment } from '../types';
import { EQUIPMENTS } from '../data';
import { AnimatePresence, motion } from 'motion/react';

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEquipment: (id: string) => void;
}

export default function SpotlightSearch({ isOpen, onClose, onSelectEquipment }: SpotlightSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter equipment based on query
  const filteredItems = EQUIPMENTS.filter(item => {
    const q = query.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.manufacturer.toLowerCase().includes(q) ||
      item.model.toLowerCase().includes(q) ||
      item.series.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.protocols.some(p => p.toLowerCase().includes(q)) ||
      item.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  // Autofocus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle outside clicks
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Handle hotkey & arrows
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          onSelectEquipment(filteredItems[selectedIndex].id);
          onClose();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose, onSelectEquipment]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#000000]/15 backdrop-blur-xs z-50 flex items-start justify-center pt-[10vh] px-4 font-sans">
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.97, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -8 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border border-[#EEEEEE] overflow-hidden flex flex-col max-h-[75vh]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F0F0F0] bg-white">
          <Search className="w-5 h-5 text-[#999999] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search brand, model, series..."
            className="w-full bg-transparent outline-none border-none text-base text-[#111111] placeholder-[#BBBBBB] flex-1"
          />
          <kbd className="px-2 py-0.5 text-[9px] font-sans font-medium bg-[#FAFAFA] border border-[#EEEEEE] rounded text-[#717171] select-none shrink-0 shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-3 min-h-[250px] max-h-[450px]">
          {filteredItems.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-2 text-[10px] font-bold text-[#999999] uppercase tracking-widest">
                Equipos Encontrados ({filteredItems.length})
              </div>
              {filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectEquipment(item.id);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all border cursor-pointer ${
                      isSelected 
                        ? 'bg-[#F9F9F9] border-[#F0F0F0] text-[#111111]' 
                        : 'bg-transparent border-transparent hover:bg-[#FAFAFA] text-[#717171]'
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-10 h-10 rounded-lg border flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                        isSelected ? 'bg-white border-[#EEEEEE] text-[#111111]' : 'bg-[#F5F5F7] border-transparent text-[#717171]'
                      }`}>
                        {item.manufacturer.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold truncate ${isSelected ? 'text-[#111111]' : 'text-[#444444]'}`}>
                            {item.name}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                            isSelected 
                              ? 'bg-[#EEEEEE] text-[#111111]' 
                              : 'bg-[#F5F5F7] text-[#717171]'
                          }`}>
                            {item.model}
                          </span>
                        </div>
                        <div className="flex items-center gap-x-2.5 gap-y-1 mt-0.5 flex-wrap text-[11px] text-[#888888]">
                          <span>
                            S/N: <strong className="font-semibold text-[#555555]">{item.series}</strong>
                          </span>
                          <span>•</span>
                          <span className="truncate">
                            {item.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.protocols.map(p => (
                        <span key={p} className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                          isSelected ? 'bg-white border border-[#EEEEEE] text-[#717171]' : 'bg-[#F5F5F7] text-[#717171]'
                        }`}>
                          {p}
                        </span>
                      ))}
                      <ArrowRight className={`w-4 h-4 text-[#CCCCCC] transition-transform ${
                        isSelected ? 'translate-x-1 text-[#111111]' : ''
                      }`} />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-10 h-10 rounded-full bg-[#FAFAFA] flex items-center justify-center mb-3 border border-[#F0F0F0]">
                <Info className="w-5 h-5 text-[#999999]" />
              </div>
              <p className="text-sm font-semibold text-[#111111]">No se encontraron equipos</p>
              <p className="text-xs text-[#717171] mt-1 max-w-sm">
                Intente buscar por marcas como <span className="font-mono bg-[#FAFAFA] px-1 py-0.5 rounded text-[#111111]">Siemens</span>, 
                <span className="font-mono bg-[#FAFAFA] px-1 py-0.5 rounded text-[#111111]"> Nordson</span>, o protocolos como <span className="font-mono bg-[#FAFAFA] px-1 py-0.5 rounded text-[#111111]">Profinet</span>.
              </p>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-4 bg-[#FAFAFA] rounded-b-3xl border-t border-[#F0F0F0] flex justify-between items-center text-[10px] text-[#999999] font-mono select-none">
          <div className="flex items-center gap-3">
            <span>Esc para cerrar</span>
            <span>•</span>
            <span>Enter para seleccionar</span>
          </div>
          <div>
            <span className="font-semibold text-[#555555]">{filteredItems.length} resultados</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
