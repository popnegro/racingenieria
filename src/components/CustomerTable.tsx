import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Phone, Mail, Eye, User, Briefcase, Calendar } from 'lucide-react';
import { Customer, CustomerStatus } from '../types';
import StatusBadge from './StatusBadge';
import { motion } from 'motion/react';

interface CustomerTableProps {
  id: string;
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  onInitiateCall: (customer: Customer) => void;
  onInitiateEmail: (customer: Customer) => void;
}

export default function CustomerTable({
  id,
  customers,
  onSelectCustomer,
  onInitiateCall,
  onInitiateEmail
}: CustomerTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | 'Todos'>('Todos');
  const [operatorFilter, setOperatorFilter] = useState<string>('Todos');
  const [sortBy, setSortBy] = useState<'name' | 'lastContact' | 'company'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Extract unique operator names for the operator filter
  const operatorsList = useMemo(() => {
    const list = new Set(customers.map(c => c.assignedTo));
    return Array.from(list).sort();
  }, [customers]);

  // Handle Search and Filters
  const filteredCustomers = useMemo(() => {
    return customers
      .filter(customer => {
        const matchesSearch =
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone.includes(searchTerm) ||
          customer.cuit.includes(searchTerm) ||
          customer.planta.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.industria.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'Todos' || customer.status === statusFilter;
        const matchesOperator = operatorFilter === 'Todos' || customer.assignedTo === operatorFilter;

        return matchesSearch && matchesStatus && matchesOperator;
      })
      .sort((a, b) => {
        let fieldA = a[sortBy].toLowerCase();
        let fieldB = b[sortBy].toLowerCase();
        
        if (sortBy === 'lastContact') {
          fieldA = a.lastContact;
          fieldB = b.lastContact;
        }

        if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [customers, searchTerm, statusFilter, operatorFilter, sortBy, sortOrder]);

  // Handle sorting toggles
  const handleSort = (field: 'name' | 'lastContact' | 'company') => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1); // Reset page on sort
  };

  // Pagination bounds
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  // Reset page when filters change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: CustomerStatus | 'Todos') => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleOperatorChange = (operator: string) => {
    setOperatorFilter(operator);
    setCurrentPage(1);
  };

  return (
    <div id={id} className="bg-white border border-zinc-200/80 rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-full">
      {/* Header Controls */}
      <div className="p-4 border-b border-zinc-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-zinc-50/50">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, empresa o teléfono..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg text-sm bg-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Select Filter */}
          <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded-lg px-2 py-1.5 shadow-sm">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-1">Estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value as CustomerStatus | 'Todos')}
              className="text-xs font-semibold text-zinc-700 bg-transparent focus:outline-none cursor-pointer pr-1"
            >
               <option value="Todos">Todos</option>
               <option value="Activo">Activo</option>
               <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          {/* Operator Select Filter */}
          <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded-lg px-2 py-1.5 shadow-sm">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-1">Responsable:</span>
            <select
              value={operatorFilter}
              onChange={(e) => handleOperatorChange(e.target.value)}
              className="text-xs font-semibold text-zinc-700 bg-transparent focus:outline-none cursor-pointer pr-1 max-w-[150px]"
            >
              <option value="Todos">Todos</option>
              {operatorsList.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-x-auto min-h-[300px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/70 text-xs font-bold text-zinc-400 tracking-wider">
              <th className="py-3.5 px-5 select-none cursor-pointer hover:bg-zinc-100/50 transition-colors" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  Cliente / Razón Social {sortBy === 'name' && <ArrowUpDown className="w-3 h-3 text-blue-600" />}
                </div>
              </th>
              <th className="py-3.5 px-5">Contacto / Teléfono</th>
              <th className="py-3.5 px-5">Ubicación Planta</th>
              <th className="py-3.5 px-5 select-none cursor-pointer hover:bg-zinc-100/50 transition-colors" onClick={() => handleSort('company')}>
                <div className="flex items-center gap-1">
                  Industria {sortBy === 'company' && <ArrowUpDown className="w-3 h-3 text-blue-600" />}
                </div>
              </th>
              <th className="py-3.5 px-5">Estado</th>
              <th className="py-3.5 px-5 select-none cursor-pointer hover:bg-zinc-100/50 transition-colors" onClick={() => handleSort('lastContact')}>
                <div className="flex items-center gap-1">
                  Último Contacto {sortBy === 'lastContact' && <ArrowUpDown className="w-3 h-3 text-blue-600" />}
                </div>
              </th>
              <th className="py-3.5 px-5">Responsable</th>
              <th className="py-3.5 px-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-sm text-zinc-700">
            {paginatedCustomers.length > 0 ? (
              paginatedCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  onClick={() => onSelectCustomer(customer)}
                  className="hover:bg-zinc-50/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={customer.avatar}
                        alt={customer.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover border border-zinc-200"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">{customer.name}</span>
                        <span className="text-xs text-zinc-400 font-mono mt-0.5">CUIT: {customer.cuit}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex flex-col">
                      <span className="font-medium text-zinc-800">{customer.phone}</span>
                      <span className="text-xs text-zinc-400 font-mono">{customer.email}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-zinc-600 max-w-[200px] truncate" title={customer.planta}>
                    {customer.planta}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-zinc-100 text-zinc-800 border border-zinc-200">
                      {customer.industria}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <StatusBadge status={customer.status} />
                  </td>
                  <td className="py-3.5 px-5 font-mono text-xs text-zinc-500">
                    {customer.lastContact}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-1 text-xs text-zinc-600 font-medium">
                      <User className="w-3.5 h-3.5 text-zinc-400 stroke-[1.8]" />
                      <span>{customer.assignedTo}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectCustomer(customer)}
                        className="p-1.5 hover:bg-primary text-neutral-50 hover:text-white rounded-md transition-colors"
                        title="Ver Perfil Detallado"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onInitiateCall(customer)}
                        className="p-1.5 hover:bg-primary text-neutral-50 hover:text-white rounded-md transition-colors"
                        title="Iniciar Registro de Llamada"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onInitiateEmail(customer)}
                        className="p-1.5 hover:bg-primary text-neutral-50 hover:text-white rounded-md transition-colors"
                        title="Enviar Correo Electrónico"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-full mb-3 text-zinc-400">
                      <Search className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <h5 className="font-semibold text-zinc-800 text-sm">Sin resultados encontrados</h5>
                    <p className="text-xs text-zinc-400 mt-1">
                      No hay clientes que coincidan con los filtros de búsqueda establecidos. Revisa la ortografía o cambia el filtro.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
        <span className="text-xs text-zinc-400 font-medium font-mono">
          Mostrando {filteredCustomers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} de {filteredCustomers.length} clientes
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="p-1.5 border border-zinc-200 hover:bg-white text-zinc-500 rounded-md disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            // Limit page dots shown if too many
            if (totalPages > 5 && Math.abs(pageNum - currentPage) > 1 && pageNum !== 1 && pageNum !== totalPages) {
              if (pageNum === 2 || pageNum === totalPages - 1) {
                return <span key={pageNum} className="text-zinc-400 text-xs px-1 font-mono">...</span>;
              }
              return null;
            }
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7.5 h-7.5 text-xs font-semibold rounded-md flex items-center justify-center transition-all cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-primary text-neutral-50 shadow-sm font-bold'
                    : 'border border-zinc-200 hover:bg-white text-zinc-600'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-1.5 border border-zinc-200 hover:bg-white text-zinc-500 rounded-md disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
