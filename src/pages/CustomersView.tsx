import React, { useMemo } from 'react';
import { Customer, Equipment } from '../types';
import CustomerTable from '../components/CustomerTable';
import { Users, AlertCircle, CheckCircle, Cpu } from 'lucide-react';

interface CustomersViewProps {
  id: string;
  customers: Customer[];
  equipments: Equipment[];
  onSelectCustomer: (customer: Customer) => void;
  onInitiateCall: (customer: Customer) => void;
  onInitiateEmail: (customer: Customer) => void;
}

export default function CustomersView({
  id,
  customers,
  equipments,
  onSelectCustomer,
  onInitiateCall,
  onInitiateEmail
}: CustomersViewProps) {
  
  // Scoped customer counts for the sub-header metrics
  const stats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter(c => c.status === 'Activo').length;
    const inactive = customers.filter(c => c.status === 'Inactivo').length;
    const totalEquipments = equipments.length;
    return { total, active, inactive, totalEquipments };
  }, [customers, equipments]);

  return (
    <div id={id} className="space-y-6">
      
      {/* 1. Fast Subheader Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200/80 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-3">
          <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg text-blue-600">
            <Users className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Clientes Industriales</span>
            <span className="text-xl font-bold text-zinc-900 leading-none">{stats.total}</span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-3">
          <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-600">
            <CheckCircle className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Cuentas Activas</span>
            <span className="text-xl font-bold text-zinc-900 leading-none">{stats.active}</span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-3">
          <div className="p-2 bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-500">
            <AlertCircle className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Cuentas Inactivas</span>
            <span className="text-xl font-bold text-zinc-900 leading-none">{stats.inactive}</span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-3">
          <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600">
            <Cpu className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Equipos en Base</span>
            <span className="text-xl font-bold text-zinc-900 leading-none">{stats.totalEquipments}</span>
          </div>
        </div>
      </div>

      {/* 2. Main Directory Table */}
      <div className="flex-1">
        <CustomerTable
          id="customer-table-container"
          customers={customers}
          onSelectCustomer={onSelectCustomer}
          onInitiateCall={onInitiateCall}
          onInitiateEmail={onInitiateEmail}
        />
      </div>

    </div>
  );
}
