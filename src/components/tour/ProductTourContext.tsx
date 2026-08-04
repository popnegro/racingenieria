import React, { createContext, useContext, useState, useEffect } from 'react';

export interface TourStep {
  id: string;
  title: string;
  description: string;
  businessValue?: string;
  target?: string; // CSS selector
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  actionLabel?: string;
  view?: string; // view to auto-navigate to
  tab?: 'ingreso' | 'kanban'; // specific tab for registration view
}

interface ProductTourContextType {
  currentStepIndex: number;
  isActive: boolean;
  hasCompleted: boolean;
  hasSkipped: boolean;
  steps: TourStep[];
  currentStep: TourStep;
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  resetTour: () => void;
  resumeLater: () => void;
  goToStep: (index: number) => void;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Bienvenido a RAC Customer Desk',
    description: 'La consola unificada de control operativo para laboratorios industriales. Gestione calibraciones, pruebas de carga, despiece, consumo de inventario y optimice las métricas de rendimiento de sus técnicos en una única plataforma integrada.',
    businessValue: 'Acelere el tiempo de resolución técnica (MTTR) hasta en un 40% y estandarice las auditorías de calidad bajo normativas ISO de calibración.',
    target: '', // Centered Welcome Modal
    placement: 'center',
    actionLabel: 'Comenzar Tour de Sistema',
    view: 'dashboard'
  },
  {
    id: 'topbar-overview',
    title: 'Consola de Estado y Técnico',
    description: 'La barra superior muestra su contexto operativo actual. Controle el estado de disponibilidad del técnico ("Disponible", "En Laboratorio", "En Planta") y visualice notificaciones en tiempo real sobre aprobaciones críticas.',
    businessValue: 'La asignación logística se optimiza automáticamente en base a la ubicación real y carga operativa declarada por cada técnico.',
    target: '#app-topbar',
    placement: 'bottom',
    actionLabel: 'Siguiente',
    view: 'dashboard'
  },
  {
    id: 'sidebar-nav',
    title: 'Navegación Modular Unificada',
    description: 'El menú lateral permite conmutar instantáneamente entre los módulos críticos de la organización: métricas consolidadas, catálogo técnico de clientes corporativos, flujo de ingreso de equipamiento, agenda del taller y bitácora de auditoría técnica.',
    businessValue: 'Elimina los silos operativos conectando administración, taller de reparaciones y logística de despacho en un solo flujo de datos continuo.',
    target: '#app-sidebar',
    placement: 'right',
    actionLabel: 'Siguiente',
    view: 'dashboard'
  },
  {
    id: 'dashboard-kpis',
    title: 'Métricas de Gestión y Rendimiento (KPIs)',
    description: 'Visualice indicadores clave en tiempo real como casos abiertos en laboratorio, volumen de llamadas del mes, tasa de resolución y tiempos medios de atención por tipo de activo industrial.',
    businessValue: 'Facilita a los supervisores la detección temprana de cuellos de botella e inventarios paralizados antes de vulnerar el SLA acordado.',
    target: '#kpi-open',
    placement: 'bottom',
    actionLabel: 'Ver Clientes',
    view: 'dashboard'
  },
  {
    id: 'customers-module',
    title: 'Catálogo de Plantas y Activos Industriales',
    description: 'Acceda al registro corporativo completo. Gestione plantas operativas, especificaciones de tensión/potencia de motores, generadores, variadores y el historial completo de reparaciones de cada cliente.',
    businessValue: 'Permite un mantenimiento preventivo de precisión gracias a la trazabilidad absoluta de cada máquina por su número de serie único.',
    target: '#customer-table-container',
    placement: 'top',
    actionLabel: 'Ingresar un Activo',
    view: 'customers'
  },
  {
    id: 'create-work-order',
    title: 'Recepción Técnica y Creación de OTs',
    description: 'Estandarice el ingreso de equipos al laboratorio. Rellene el formulario con el fabricante, modelo, número de serie, criticidad de la falla e ingrese notas del problema para crear de inmediato una Orden de Trabajo digital vinculada.',
    businessValue: 'Automatiza la hoja de ruta técnica desde el primer segundo, eliminando descripciones ambiguas y retrasos administrativos.',
    target: '#work-order-registration-form',
    placement: 'right',
    actionLabel: 'Siguiente',
    view: 'call-register',
    tab: 'ingreso'
  },
  {
    id: 'productivity-shortcuts',
    title: 'Atajos Globales de Productividad',
    description: 'Incremente su velocidad de respuesta técnica. El sistema implementa atajos de teclado globales para navegación rápida. Presione la tecla [K] en cualquier momento para ver la lista de combinaciones táctiles.',
    businessValue: 'Optimiza la ergonomía del software reduciendo los clics repetitivos en un 50% para operadores de alta densidad de transacciones.',
    target: '#productivity-shortcuts-badge',
    placement: 'bottom',
    actionLabel: 'Siguiente',
    view: 'call-register',
    tab: 'ingreso'
  },
  {
    id: 'alerts-bell',
    title: 'Centro de Notificaciones en Tiempo Real',
    description: 'Reciba alertas inmediatas ante desabastecimiento crítico de repuestos en pañol, aprobaciones de presupuestos por parte de clientes o asignación de OTs urgentes a su perfil técnico.',
    businessValue: 'Asegura una respuesta operativa reactiva inmediata ante contingencias o cambios de estado de clientes sin recargar la página.',
    target: "[title='Notificaciones']",
    placement: 'bottom',
    actionLabel: 'Siguiente',
    view: 'dashboard'
  },
  {
    id: 'technical-status',
    title: 'Cambio de Estado y Disponibilidad',
    description: 'Gestione su perfil operativo interactivo. Seleccione su estado en el menú desplegable para indicar si se encuentra realizando tareas de campo, diagnósticos en mesa de laboratorio o disponible para recepción.',
    businessValue: 'Brinda transparencia absoluta a la gerencia de planta sobre el estado de la fuerza de trabajo técnica.',
    target: '.animate-pulse',
    placement: 'bottom',
    actionLabel: 'Finalizar Introducción',
    view: 'dashboard'
  },
  {
    id: 'completion',
    title: '¡Felicitaciones! Onboarding Completado',
    description: 'Ha dominado con éxito los flujos operativos clave de la plataforma RAC Customer Desk. Ahora está completamente capacitado para gestionar activos industriales, programar tareas de laboratorio y registrar calibraciones.',
    businessValue: 'Usted cuenta con todas las herramientas necesarias para maximizar los estándares de calidad del laboratorio y cumplir con los objetivos técnicos mensuales.',
    target: '', // Centered Completed Modal
    placement: 'center',
    actionLabel: 'Comenzar a Trabajar',
    view: 'dashboard'
  }
];

const ProductTourContext = createContext<ProductTourContextType | undefined>(undefined);

export const ProductTourProvider: React.FC<{
  children: React.ReactNode;
  setActiveView: (view: string) => void;
  onSetRegisterTab?: (tab: 'ingreso' | 'kanban') => void;
}> = ({ children, setActiveView, onSetRegisterTab }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [hasSkipped, setHasSkipped] = useState<boolean>(false);

  // Load state from local storage on mount
  useEffect(() => {
    const savedTourState = localStorage.getItem('rac_tour_state');
    if (savedTourState) {
      try {
        const parsed = JSON.parse(savedTourState);
        setHasCompleted(parsed.hasCompleted || false);
        setHasSkipped(parsed.hasSkipped || false);
        if (parsed.isActive && !parsed.hasCompleted && !parsed.hasSkipped) {
          setCurrentStepIndex(parsed.currentStepIndex || 0);
          setIsActive(true);
        }
      } catch (e) {
        console.error('Error loading tour state from localStorage', e);
      }
    } else {
      // First-time user: automatically launch the onboarding tour
      // We will trigger isActive: true after a small delay to allow UI hydration
      const timer = setTimeout(() => {
        setIsActive(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Save state helper
  const saveState = (updatedState: {
    isActive: boolean;
    currentStepIndex: number;
    hasCompleted: boolean;
    hasSkipped: boolean;
  }) => {
    localStorage.setItem('rac_tour_state', JSON.stringify(updatedState));
  };

  const startTour = () => {
    setCurrentStepIndex(0);
    setIsActive(true);
    setHasCompleted(false);
    setHasSkipped(false);
    setActiveView('dashboard');
    saveState({
      isActive: true,
      currentStepIndex: 0,
      hasCompleted: false,
      hasSkipped: false
    });
  };

  const skipTour = () => {
    setIsActive(false);
    setHasSkipped(true);
    saveState({
      isActive: false,
      currentStepIndex: currentStepIndex,
      hasCompleted: false,
      hasSkipped: true
    });
  };

  const resumeLater = () => {
    setIsActive(false);
    saveState({
      isActive: false,
      currentStepIndex: currentStepIndex,
      hasCompleted: hasCompleted,
      hasSkipped: hasSkipped
    });
  };

  const resetTour = () => {
    localStorage.removeItem('rac_tour_state');
    setCurrentStepIndex(0);
    setIsActive(true);
    setHasCompleted(false);
    setHasSkipped(false);
    setActiveView('dashboard');
  };

  const nextStep = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      const nextStepObj = TOUR_STEPS[nextIndex];
      
      // Auto-navigate views
      if (nextStepObj.view) {
        setActiveView(nextStepObj.view);
      }
      
      // Auto-navigate specific tabs
      if (nextStepObj.tab && onSetRegisterTab) {
        onSetRegisterTab(nextStepObj.tab);
      }

      setCurrentStepIndex(nextIndex);
      saveState({
        isActive: true,
        currentStepIndex: nextIndex,
        hasCompleted: false,
        hasSkipped: false
      });
    } else {
      // Completed the tour!
      setIsActive(false);
      setHasCompleted(true);
      saveState({
        isActive: false,
        currentStepIndex: currentStepIndex,
        hasCompleted: true,
        hasSkipped: false
      });
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      const prevStepObj = TOUR_STEPS[prevIndex];
      
      // Auto-navigate views back
      if (prevStepObj.view) {
        setActiveView(prevStepObj.view);
      }
      
      // Auto-navigate tab back
      if (prevStepObj.tab && onSetRegisterTab) {
        onSetRegisterTab(prevStepObj.tab);
      }

      setCurrentStepIndex(prevIndex);
      saveState({
        isActive: true,
        currentStepIndex: prevIndex,
        hasCompleted: false,
        hasSkipped: false
      });
    }
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < TOUR_STEPS.length) {
      const stepObj = TOUR_STEPS[index];
      
      if (stepObj.view) {
        setActiveView(stepObj.view);
      }
      if (stepObj.tab && onSetRegisterTab) {
        onSetRegisterTab(stepObj.tab);
      }
      
      setCurrentStepIndex(index);
      saveState({
        isActive: true,
        currentStepIndex: index,
        hasCompleted: false,
        hasSkipped: false
      });
    }
  };

  const currentStep = TOUR_STEPS[currentStepIndex];

  return (
    <ProductTourContext.Provider
      value={{
        currentStepIndex,
        isActive,
        hasCompleted,
        hasSkipped,
        steps: TOUR_STEPS,
        currentStep,
        startTour,
        nextStep,
        prevStep,
        skipTour,
        resetTour,
        resumeLater,
        goToStep
      }}
    >
      {children}
    </ProductTourContext.Provider>
  );
};

export const useProductTour = () => {
  const context = useContext(ProductTourContext);
  if (context === undefined) {
    throw new Error('useProductTour must be used within a ProductTourProvider');
  }
  return context;
};
