import React, { useState, useEffect, useRef } from 'react';
import { useProductTour } from './ProductTourContext';
import { ChevronLeft, ChevronRight, X, Play, Volume2, HelpCircle } from 'lucide-react';

export const TourTooltip: React.FC = () => {
  const {
    currentStepIndex,
    isActive,
    steps,
    currentStep,
    nextStep,
    prevStep,
    skipTour,
    resumeLater,
    goToStep
  } = useProductTour();

  const [coords, setCoords] = useState<{ top: number; left: number; placement: string }>({ top: 0, left: 0, placement: 'center' });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Position calculation
  useEffect(() => {
    if (!isActive) return;

    const calculatePosition = () => {
      // For centered or missing targets, center the tooltip
      if (!currentStep.target) {
        setCoords({ top: 0, left: 0, placement: 'center' });
        return;
      }

      const targetEl = document.querySelector(currentStep.target);
      if (!targetEl || !tooltipRef.current) {
        setCoords({ top: 0, left: 0, placement: 'center' });
        return;
      }

      const targetRect = targetEl.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Handle mobile/small screens: center bottom or modal
      if (viewportWidth < 640) {
        setCoords({
          top: viewportHeight - tooltipRect.height - 16,
          left: (viewportWidth - tooltipRect.width) / 2,
          placement: 'mobile-sticky-bottom'
        });
        return;
      }

      let top = 0;
      let left = 0;
      let placement = currentStep.placement || 'bottom';
      const offset = 14; // spacing from the spotlight boundary

      switch (placement) {
        case 'top':
          top = targetRect.top - tooltipRect.height - offset;
          left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
          // Viewport collision fallback to bottom
          if (top < 10) {
            top = targetRect.bottom + offset;
            placement = 'bottom';
          }
          break;
        case 'bottom':
          top = targetRect.bottom + offset;
          left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
          // Viewport collision fallback to top
          if (top + tooltipRect.height > viewportHeight - 10) {
            top = targetRect.top - tooltipRect.height - offset;
            placement = 'top';
          }
          break;
        case 'left':
          top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
          left = targetRect.left - tooltipRect.width - offset;
          // Viewport collision fallback to right
          if (left < 10) {
            left = targetRect.right + offset;
            placement = 'right';
          }
          break;
        case 'right':
          top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
          left = targetRect.right + offset;
          // Viewport collision fallback to left
          if (left + tooltipRect.width > viewportWidth - 10) {
            left = targetRect.left - tooltipRect.width - offset;
            placement = 'left';
          }
          break;
        default:
          // Center screen
          top = (viewportHeight - tooltipRect.height) / 2;
          left = (viewportWidth - tooltipRect.width) / 2;
          placement = 'center';
      }

      // Final boundary confinement to prevent screen overflowing
      left = Math.max(16, Math.min(left, viewportWidth - tooltipRect.width - 16));
      top = Math.max(70, Math.min(top, viewportHeight - tooltipRect.height - 16));

      setCoords({ top, left, placement });
    };

    // Use requestAnimationFrame to continuously track target coordinates smoothly
    const tick = () => {
      calculatePosition();
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    tick();

    // Attach resize listeners
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition, true);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition, true);
    };
  }, [currentStep, isActive, currentStepIndex]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive) return;

      if (e.key === 'Escape') {
        resumeLater();
      } else if (e.key === 'ArrowRight') {
        nextStep();
      } else if (e.key === 'ArrowLeft') {
        prevStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, nextStep, prevStep, resumeLater]);

  if (!isActive) return null;

  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === steps.length - 1;

  // Render centered full-screen modal overlays for step 0 and step 9
  if (coords.placement === 'center') {
    return null; // The App layout will handle WelcomeModal and CompletionScreen centered overlays separately to keep things tidy
  }

  return (
    <div
      ref={tooltipRef}
      id={`tour-tooltip-${currentStep.id}`}
      style={{
        position: 'fixed',
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="z-55 w-[380px] max-w-[calc(100vw-32px)] bg-white border border-zinc-200 rounded-2xl shadow-[0_12px_30px_-10px_rgba(0,0,0,0.15)] p-5 select-none animate-[fadeIn_0.2s_ease-out]"
    >
      {/* Tooltip Header */}
      <div className="flex items-start justify-between gap-2 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-50 border border-blue-100 rounded flex items-center justify-center text-blue-600">
            <HelpCircle className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">
            Paso {currentStepIndex + 1} de {steps.length}
          </span>
        </div>
        
        <button
          onClick={resumeLater}
          className="p-1 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 rounded-lg transition-colors cursor-pointer"
          title="Guardar progreso y continuar después (ESC)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Title & Technical Description */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-zinc-900 tracking-tight leading-snug">
          {currentStep.title}
        </h3>
        <p className="text-xs text-zinc-500 leading-relaxed">
          {currentStep.description}
        </p>
      </div>

      {/* Business Value Highlight Block */}
      {currentStep.businessValue && (
        <div className="mt-3.5 p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[8px] font-black tracking-widest text-blue-600 uppercase">
              Impacto de Negocio
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
            {currentStep.businessValue}
          </p>
        </div>
      )}

      {/* Footer Progress & CTAs */}
      <div className="mt-5 pt-3.5 border-t border-zinc-100 flex items-center justify-between gap-3">
        {/* Interactive Progress Indicators */}
        <div className="flex items-center gap-1">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => goToStep(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStepIndex
                  ? 'w-4 bg-blue-600'
                  : 'w-1.5 bg-zinc-200 hover:bg-zinc-400'
              }`}
              title={`Ir al paso ${i + 1}`}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {!isFirst && (
            <button
              onClick={prevStep}
              className="px-2.5 py-1.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-600 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Atrás
            </button>
          )}

          <button
            onClick={nextStep}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
          >
            {currentStep.actionLabel || 'Siguiente'}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
