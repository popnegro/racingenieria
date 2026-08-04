import React, { useState, useEffect, useRef } from 'react';
import { useProductTour } from './ProductTourContext';

export const TourOverlay: React.FC = () => {
  const { currentStep, isActive } = useProductTour();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive || !currentStep.target) {
      setTargetRect(null);
      return;
    }

    const updatePosition = () => {
      const element = document.querySelector(currentStep.target!);
      if (element) {
        const rect = element.getBoundingClientRect();
        // Check if values actually changed to avoid infinite state updates
        setTargetRect((prev) => {
          if (
            prev &&
            prev.top === rect.top &&
            prev.left === rect.left &&
            prev.width === rect.width &&
            prev.height === rect.height
          ) {
            return prev;
          }
          return rect;
        });
      } else {
        setTargetRect(null);
      }

      // Keep polling dynamically in case of layout changes, drawer animations or scrolling
      animationFrameRef.current = requestAnimationFrame(updatePosition);
    };

    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [currentStep.target, isActive]);

  if (!isActive) return null;

  // Render full screen dark mask if no target found or target is empty (welcome/completion modal steps)
  if (!currentStep.target || !targetRect) {
    return (
      <div 
        id="tour-backdrop-global"
        className="fixed inset-0 bg-zinc-950/60 backdrop-blur-[2px] z-50 transition-opacity duration-300"
      />
    );
  }

  // Draw an SVG with a cutout mask around the target element
  const padding = 8; // Highlight margin padding
  const x = targetRect.left - padding;
  const y = targetRect.top - padding;
  const width = targetRect.width + padding * 2;
  const height = targetRect.height + padding * 2;
  const radius = 8; // Rounded corner for the spotlight cutout

  return (
    <svg
      id="tour-spotlight-svg"
      className="fixed inset-0 pointer-events-none w-full h-full z-50 transition-all duration-300"
      style={{ mixBlendMode: 'hard-light' }}
    >
      <defs>
        <mask id="spotlight-cutout-mask">
          {/* Base mask: white allows everything (so transparent in hard-light mask) */}
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          {/* Cutout area: black cuts through (making it transparent for the spotlight effect) */}
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            rx={radius}
            ry={radius}
            fill="black"
          />
        </mask>
      </defs>

      {/* Semi-transparent dark overlay covering the whole screen with the cutout mask */}
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="rgba(9, 9, 11, 0.65)"
        mask="url(#spotlight-cutout-mask)"
        className="pointer-events-auto transition-all duration-300"
      />

      {/* Decorative high-contrast focus border around the spotlight cutout */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={radius}
        ry={radius}
        fill="none"
        stroke="#2563eb" // Blue-600
        strokeWidth="2.5"
        strokeDasharray="4 4"
        className="animate-[dash_10s_linear_infinite]"
        style={{ mixBlendMode: 'normal' }}
      />
    </svg>
  );
};
