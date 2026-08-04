import React, { useState } from 'react';
import { Customer, Operator, CallLog, AgendaItem, TimelineEvent, OTEstado, Equipment, StockItem } from './types';
import { CUSTOMERS, OPERATORS, CALL_LOGS, AGENDA_ITEMS, TIMELINE_EVENTS, EQUIPMENTS, STOCK_ITEMS } from './data/mockData';

// Layout and Global components
import { Menu, ChevronRight } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { ProductTourProvider, useProductTour } from './components/tour/ProductTourContext';
import CustomerDetailDrawer from './components/CustomerDetailDrawer';
import { MobileMenuProvider, useMobileMenu } from './context/MobileMenuContext';

// Views/Pages
import DashboardView from './pages/DashboardView';
import CustomersView from './pages/CustomersView';
import WorkOrderRegisterView from './pages/WorkOrderRegisterView';
import AgendaView from './pages/AgendaView';
import HistoryView from './pages/HistoryView';
import InsightsView from './pages/InsightsView';

import { AnimatePresence } from 'motion/react';

// Tour functionality disabled – imports removed

export function AppContent({
  activeView,
  setActiveView,
  registerTab,
  setRegisterTab
}: {
  activeView: string;
  setActiveView: (view: string) => void;
  registerTab: 'ingreso' | 'kanban';
  setRegisterTab: (tab: 'ingreso' | 'kanban') => void;
}) {
  // Retrieve tour controls from context
  const { startTour } = useProductTour();
  // Mobile menu controls (drawer)
  const { isOpen, close, toggle } = useMobileMenu();
  // Sidebar collapsed state for desktop
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState<boolean>(false);

  // Mobile drawer state is now managed by MobileMenuContext (isOpen, toggle, close)


  // ... existing state definitions unchanged ...



  // Central Core States (populated initially from stable deterministic mock data)
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS);
  const [operators, setOperators] = useState<Operator[]>(OPERATORS);
  const [callLogs, setCallLogs] = useState<CallLog[]>(CALL_LOGS);
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>(AGENDA_ITEMS);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(TIMELINE_EVENTS);
  const [equipments, setEquipments] = useState<Equipment[]>(EQUIPMENTS);
  const [stockItems, setStockItems] = useState<StockItem[]>(STOCK_ITEMS);

  // Active Context States
  const [activeOperator, setActiveOperator] = useState<Operator>(OPERATORS[0]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [preselectedCustomerForCall, setPreselectedCustomerForCall] = useState<Customer | null>(null);

  // 1. UPDATE CUSTOMER Details (Status, Notes, Operator assignment)
  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    // Find previous state to log changes if status changed
    const previousCustomer = customers.find(c => c.id === updatedCustomer.id);
    
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));

    // Update active drawer instance if it is open
    if (selectedCustomer?.id === updatedCustomer.id) {
      setSelectedCustomer(updatedCustomer);
    }

    // Log status change if applicable
    if (previousCustomer && previousCustomer.status !== updatedCustomer.status) {
      const now = new Date();
      const newEvent: TimelineEvent = {
        id: `T-${timelineEvents.length + 1}`,
        date: '2026-08-03', // Fixed system local date
        time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
        customerName: updatedCustomer.name,
        operatorName: activeOperator.name,
        type: 'status_change',
        message: `Estado actualizado a ${updatedCustomer.status}`,
        description: `El operador modificó el estado del caso de "${previousCustomer.status}" a "${updatedCustomer.status}" voluntariamente.`
      };
      setTimelineEvents(prev => [newEvent, ...prev]);
    }
  };

  // 1.5 EQUIPMENT ACTIONS
  const handleAddEquipment = (newEq: Equipment) => {
    setEquipments(prev => [newEq, ...prev]);
    const now = new Date();
    const newEvent: TimelineEvent = {
      id: `T-${timelineEvents.length + 1}`,
      date: '2026-08-03',
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      customerName: newEq.clientName,
      operatorName: activeOperator.name,
      type: 'stock',
      message: `Equipo Registrado: ${newEq.fabricante} ${newEq.modelo}`,
      description: `Se ingresó y asoció el equipo con N/S ${newEq.nroSerie} a la base de activos del cliente.`
    };
    setTimelineEvents(prev => [newEvent, ...prev]);
  };

  const handleUpdateEquipment = (updatedEq: Equipment) => {
    setEquipments(prev => prev.map(e => e.id === updatedEq.id ? updatedEq : e));
    const now = new Date();
    const newEvent: TimelineEvent = {
      id: `T-${timelineEvents.length + 1}`,
      date: '2026-08-03',
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      customerName: updatedEq.clientName,
      operatorName: activeOperator.name,
      type: 'diagnostic',
      message: `Equipo Modificado: ${updatedEq.fabricante} ${updatedEq.modelo}`,
      description: `Se actualizaron los parámetros técnicos y observaciones del equipo con N/S ${updatedEq.nroSerie}.`
    };
    setTimelineEvents(prev => [newEvent, ...prev]);
  };

  const handleDeleteEquipment = (eqId: string) => {
    const eq = equipments.find(e => e.id === eqId);
    if (!eq) return;
    setEquipments(prev => prev.filter(e => e.id !== eqId));
    const now = new Date();
    const newEvent: TimelineEvent = {
      id: `T-${timelineEvents.length + 1}`,
      date: '2026-08-03',
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      customerName: eq.clientName,
      operatorName: activeOperator.name,
      type: 'status_change',
      message: `Equipo Retirado de Planta: ${eq.fabricante} ${eq.modelo}`,
      description: `El equipo con N/S ${eq.nroSerie} fue removido del listado de activos.`
    };
    setTimelineEvents(prev => [newEvent, ...prev]);
  };
  const handleUpdateCallLog = (updatedLog: CallLog) => {
    setCallLogs(prev => prev.map(log => log.id === updatedLog.id ? updatedLog : log));

    const originalLog = callLogs.find(l => l.id === updatedLog.id);
    if (originalLog && originalLog.outcome !== updatedLog.outcome) {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newEvent: TimelineEvent = {
        id: `T-${timelineEvents.length + 1}`,
        date: '2026-08-03',
        time: currentTime,
        customerName: updatedLog.customerName,
        operatorName: activeOperator.name,
        type: 'status_change',
        message: `OT ${updatedLog.id}: Cambio de Estado`,
        description: `El estado cambió de "${originalLog.outcome}" a "${updatedLog.outcome}". Actualizado por ${activeOperator.name}.`
      };
      setTimelineEvents(prev => [newEvent, ...prev]);

      if (updatedLog.outcome === 'Entregado' && updatedLog.equipmentId) {
        setEquipments(prev => prev.map(eq => eq.id === updatedLog.equipmentId ? { ...eq, status: 'Operativo' } : eq));
      } else if (updatedLog.outcome === 'En reparación' && updatedLog.equipmentId) {
        setEquipments(prev => prev.map(eq => eq.id === updatedLog.equipmentId ? { ...eq, status: 'En Laboratorio' } : eq));
      }
    }
  };

  const handleRegisterCall = (data: {
    customerId: string;
    operatorId: string;
    motive: string;
    outcome: OTEstado;
    observations: string;
    followUpDate?: string;
    audioUrl?: string;
    
    // OT details
    equipmentId: string;
    newEquipment?: {
      fabricante: string;
      modelo: string;
      nroSerie: string;
      categoria: Equipment['categoria'];
      potencia: string;
      tension: string;
    };
    prioridad: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  }) => {
    const customer = customers.find(c => c.id === data.customerId);
    const operator = operators.find(o => o.id === data.operatorId);
    if (!customer || !operator) return;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const currentDate = '2026-08-03';

    // A. Create/Select Equipment
    let finalEquipmentId = data.equipmentId;
    let finalEquipmentName = '';

    if (data.equipmentId === 'new' && data.newEquipment) {
      const newEqId = `EQ-${1000 + equipments.length + 1}`;
      const newEq: Equipment = {
        id: newEqId,
        clientId: customer.id,
        clientName: customer.name,
        fabricante: data.newEquipment.fabricante,
        modelo: data.newEquipment.modelo,
        nroSerie: data.newEquipment.nroSerie,
        categoria: data.newEquipment.categoria,
        potencia: data.newEquipment.potencia,
        tension: data.newEquipment.tension,
        status: 'En Laboratorio',
        observaciones: `Registrado automáticamente durante el ingreso de la OT.`
      };
      setEquipments(prev => [...prev, newEq]);
      finalEquipmentId = newEqId;
      finalEquipmentName = `${data.newEquipment.fabricante} ${data.newEquipment.modelo}`;
    } else {
      const eq = equipments.find(e => e.id === data.equipmentId);
      if (eq) {
        finalEquipmentName = `${eq.fabricante} ${eq.modelo}`;
        setEquipments(prev => prev.map(e => e.id === eq.id ? { ...e, status: 'En Laboratorio' } : e));
      }
    }

    // B. Generate and insert OT (Work Order)
    const newOTId = `OT-2026-${100 + callLogs.length + 1}`;
    const newCallLog: CallLog = {
      id: newOTId,
      customerId: customer.id,
      customerName: customer.name,
      operatorId: operator.id,
      operatorName: operator.name,
      date: currentDate,
      time: currentTime,
      motive: data.motive, // symptom category
      outcome: 'Recepcionado', // initial stage
      observations: data.observations,
      followUpDate: data.followUpDate?.split(' ')[0],
      audioUrl: data.audioUrl,
      equipmentId: finalEquipmentId,
      equipmentName: finalEquipmentName,
      prioridad: data.prioridad || 'Media',
      tareasRealizadas: ['Equipo recibido físicamente en el taller.'],
      repuestosUtilizados: [],
      costoMateriales: 0,
      costoManoObra: 150, // default evaluation labor base
      horasTrabajadas: 1
    };

    setCallLogs(prev => [newCallLog, ...prev]);

    // C. Append custom Note to customer profile and set Last Contact
    const updatedNotes = [`OT registrada: "${newOTId}" - ${finalEquipmentName}. Síntoma: ${data.motive}. Obs: ${data.observations}`, ...customer.notes];
    const updatedCustomer: Customer = {
      ...customer,
      lastContact: currentDate,
      assignedTo: operator.name, // assign this operator
      notes: updatedNotes
    };
    handleUpdateCustomer(updatedCustomer);

    // D. Register timeline event
    const newTimelineEvent: TimelineEvent = {
      id: `T-${timelineEvents.length + 1}`,
      date: currentDate,
      time: currentTime,
      customerName: customer.name,
      operatorName: operator.name,
      type: 'status_change',
      message: `Nueva OT Recepcionada: ${newOTId}`,
      description: `Equipo ${finalEquipmentName} ingresado a Laboratorio por: "${data.motive}". Asignado a: ${operator.name}.`
    };
    setTimelineEvents(prev => [newTimelineEvent, ...prev]);

    // E. If followUpDate is specified, register Agenda Item
    if (data.followUpDate) {
      const dateTimeParts = data.followUpDate.split(' ');
      const followUpDateStr = dateTimeParts[0];
      const followUpTimeStr = dateTimeParts[1] || '17:00';

      const newAgendaItem: AgendaItem = {
        id: `A-${agendaItems.length + 1}`,
        title: `Diagnóstico límite: ${newOTId} (${finalEquipmentName})`,
        customerName: customer.name,
        date: followUpDateStr,
        time: followUpTimeStr,
        completed: false,
        priority: data.prioridad || 'Media',
        type: 'Diagnóstico',
        otId: newOTId,
        tecnicoName: operator.name
      };
      setAgendaItems(prev => [newAgendaItem, ...prev]);
    }

    // F. Increment operator statistics for visualization
    setOperators(prev => prev.map(op => {
      if (op.id === operator.id) {
        return {
          ...op,
          callsCount: op.callsCount + 1
        };
      }
      return op;
    }));

    // Reset preselection
    setPreselectedCustomerForCall(null);
  };

  // 3. INITIATE DIRECT CALL SHORTCUT (Navigates and populates form)
  const handleInitiateCallShortcut = (customer: Customer) => {
    setPreselectedCustomerForCall(customer);
    setActiveView('call-register');
    setSelectedCustomer(null); // Close sidebar profile
  };

  // 4. INITIATE DIRECT EMAIL (Generates client email action logs)
  const handleInitiateEmailShortcut = (customer: Customer) => {
    const confirmSend = window.confirm(`¿Deseas registrar un correo de contacto enviado a ${customer.email}?`);
    if (!confirmSend) return;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const currentDate = '2026-08-03';

    // A. Add Note to Customer
    const updatedCustomer: Customer = {
      ...customer,
      lastContact: currentDate,
      notes: [`Se envió correo corporativo formal de seguimiento a ${customer.email}.`, ...customer.notes]
    };
    handleUpdateCustomer(updatedCustomer);

    // B. Register Timeline Event
    const newEvent: TimelineEvent = {
      id: `T-${timelineEvents.length + 1}`,
      date: currentDate,
      time: currentTime,
      customerName: customer.name,
      operatorName: activeOperator.name,
      type: 'note',
      message: 'Email de seguimiento enviado',
      description: `Se remitió información corporativa solicitada a la cuenta de contacto (${customer.email}).`
    };
    setTimelineEvents(prev => [newEvent, ...prev]);
  };

  // 5. AGENDA ITEM INTERACTIONS
  const handleToggleAgendaItem = (itemId: string) => {
    setAgendaItems(prev => prev.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item));
  };

  const handleAddAgendaItem = (item: { title: string; customerName: string; date: string; time: string; priority: 'Baja' | 'Media' | 'Alta' | 'Crítica' }) => {
    const newItem: AgendaItem = {
      id: `A-${agendaItems.length + 1}`,
      title: item.title,
      customerName: item.customerName,
      date: item.date,
      time: item.time,
      completed: false,
      priority: item.priority,
      type: 'Diagnóstico'
    };
    setAgendaItems(prev => [newItem, ...prev]);
  };

  const handleDeleteAgendaItem = (itemId: string) => {
    setAgendaItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Modals / dialog states for shortcuts and preferences
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(false);

  // Tour functionality disabled – startTour removed

  React.useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      // Do not trigger shortcuts if user is typing in form inputs or textareas
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
        return;
      }

      const key = e.key.toLowerCase();
      
      // Shortcuts routing
      if (key === 'k') {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      } else if (key === 't') {
        e.preventDefault();
        startTour();
      } else if (key === 'd') {
        e.preventDefault();
        setActiveView('dashboard');
      } else if (key === 'c') {
        e.preventDefault();
        setActiveView('customers');
      } else if (key === 'o' || key === 'w') {
        e.preventDefault();
        setActiveView('call-register');
        if (setRegisterTab) setRegisterTab('ingreso');
      } else if (key === 'a') {
        e.preventDefault();
        setActiveView('agenda');
      } else if (key === 'b') {
        e.preventDefault();
        setActiveView('timeline');
      } else if (key === 'r' || key === 'i') {
        e.preventDefault();
        setActiveView('insights');
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [setActiveView, setRegisterTab, startTour]);

  // 6. RENDER CURRENT ACTIVE VIEW
  const renderViewContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView
            id="page-dashboard"
            customers={customers}
            callLogs={callLogs}
            agendaItems={agendaItems}
            timelineEvents={timelineEvents}
            onNavigateToView={setActiveView}
            onSelectCustomer={setSelectedCustomer}
          />
        );
      case 'customers':
        return (
          <CustomersView
            id="page-customers"
            customers={customers}
            equipments={equipments}
            onSelectCustomer={setSelectedCustomer}
            onInitiateCall={handleInitiateCallShortcut}
            onInitiateEmail={handleInitiateEmailShortcut}
          />
        );
      case 'call-register':
        return (
          <WorkOrderRegisterView
            id="page-call-register"
            customers={customers}
            operators={operators}
            callLogs={callLogs}
            equipments={equipments}
            stockItems={stockItems}
            preselectedCustomer={preselectedCustomerForCall}
            onSubmitCall={handleRegisterCall}
            onUpdateCallLog={handleUpdateCallLog}
            onUpdateStockItems={setStockItems}
            defaultTab={registerTab}
          />
        );
      case 'agenda':
        return (
          <AgendaView
            id="page-agenda"
            agendaItems={agendaItems}
            onToggleItem={handleToggleAgendaItem}
            onAddItem={handleAddAgendaItem}
            onDeleteItem={handleDeleteAgendaItem}
          />
        );
      case 'timeline':
        return (
          <HistoryView
            id="page-timeline"
            timelineEvents={timelineEvents}
          />
        );
      case 'insights':
        return (
          <InsightsView
            id="page-insights"
            customers={customers}
            operators={operators}
            callLogs={callLogs}
          />
        );
      default:
        return <div className="p-10">Vista no encontrada</div>;
    }
  };

  // Scoped calls of selected customer to render in their side profile history timeline
  const selectedCustomerCalls = React.useMemo(() => {
    if (!selectedCustomer) return [];
    return callLogs.filter(log => log.customerId === selectedCustomer.id);
  }, [callLogs, selectedCustomer]);

  return (
    <div className="min-h-screen flex bg-background text-neutral-50 font-sans">
      {/* Hamburger button – visible on mobile */}
      <button
        className="lg:hidden absolute top-4 left-4 z-30 p-2 rounded-md bg-zinc-800/60 hover:bg-zinc-700 transition"
        onClick={toggle}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <ChevronRight className="w-5 h-5 text-neutral-200" /> : <Menu className="w-5 h-5 text-neutral-200" />}
      </button>

      {/* Sidebar navigation – drawer on mobile */}
      <Sidebar
        id="app-sidebar"
        activeView={activeView}
        setActiveView={setActiveView}
        activeOperator={activeOperator}
        operators={operators}
        onChangeOperator={setActiveOperator}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isOpen={isOpen}
        onClose={close}
      />

      {/* Main body area container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        <Header onMenuClick={toggle} />
        {/* Scrollable View Frame */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 bg-zinc-50/50">
          {renderViewContent()}
        </main>
      </div>

      {/* Floating sliding right customer profile drawer */}
      <AnimatePresence>
        {selectedCustomer && (
          <CustomerDetailDrawer
            id="customer-profile-drawer"
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
            operators={operators}
            customerCalls={selectedCustomerCalls}
            onUpdateCustomer={handleUpdateCustomer}
            onInitiateCall={handleInitiateCallShortcut}
            onInitiateEmail={handleInitiateEmailShortcut}
            equipments={equipments}
            onAddEquipment={handleAddEquipment}
            onUpdateEquipment={handleUpdateEquipment}
            onDeleteEquipment={handleDeleteEquipment}
          />
        )}
      </AnimatePresence>

      {/* Floating sliding shortcuts helper button */}
      <button
        id="productivity-shortcuts-badge"
        onClick={() => setIsShortcutsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-white border border-zinc-200 hover:bg-zinc-50 active:scale-95 text-zinc-700 p-3 rounded-full shadow-lg hover:shadow-xl flex items-center gap-2 transition-all cursor-pointer group"
        title="Atajos de Teclado [K] y Recorrido Guiado"
      >
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
        <span className="text-xs font-bold font-display max-w-0 overflow-hidden group-hover:max-w-[120px] transition-all duration-300 whitespace-nowrap">
          Atajos [K]
        </span>
        <svg className="w-4 h-4 stroke-[2.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 16h10" />
        </svg>
      </button>

      {/* Tour UI disabled */}

    </div>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [registerTab, setRegisterTab] = useState<'ingreso' | 'kanban'>('kanban');

  return (
    <MobileMenuProvider>
      <ProductTourProvider setActiveView={setActiveView} onSetRegisterTab={setRegisterTab}>
        <AppContent
          activeView={activeView}
          setActiveView={setActiveView}
          registerTab={registerTab}
          setRegisterTab={setRegisterTab}
        />
      </ProductTourProvider>
    </MobileMenuProvider>
  );
}
