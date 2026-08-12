import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { challanService } from '../services/challan.service';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Eye, Plus, Filter } from 'lucide-react';

export const Challans: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['challans', page, search, statusFilter],
    queryFn: () => challanService.getChallans({ 
      page, search, limit: 10,
      ...(statusFilter && { status: statusFilter })
    })
  });

  const columns = [
    { header: 'Challan No.', accessor: (row: any) => <span className="font-medium text-gray-900">{row.challanNumber}</span> },
    { header: 'Customer', accessor: (row: any) => row.customer?.customerName || 'N/A' },
    { header: 'Date', accessor: (row: any) => format(new Date(row.createdAt), 'MMM dd, yyyy') },
    { header: 'Total Qty', accessor: 'totalQuantity' },
    { header: 'Status', accessor: (row: any) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessor: (row: any) => (
      <Link to={`/challans/${row.id}`} className="inline-flex p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
        <Eye size={18} />
      </Link>
    )}
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Delivery Challans</h1>
        <Link 
          to="/challans/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
        >
          <Plus size={18} /> Create Challan
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
        <Filter size={16} className="text-gray-400" />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        {statusFilter && (
          <button
            onClick={() => { setStatusFilter(''); setPage(1); }}
            className="px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            Clear Filter
          </button>
        )}
      </div>

      <DataTable 
        columns={columns} 
        data={data?.data?.data || []} 
        loading={isLoading}
        pagination={data?.data ? { page: data.data.page, limit: data.data.limit, total: data.data.total } : undefined}
        onPageChange={setPage}
        searchValue={search}
        onSearch={(v) => { setSearch(v); setPage(1); }}
      />
    </div>
  );
};
