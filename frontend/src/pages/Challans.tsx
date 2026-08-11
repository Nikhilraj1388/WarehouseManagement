import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { challanService } from '../services/challan.service';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Eye, Plus } from 'lucide-react';

export const Challans: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['challans', page, search],
    queryFn: () => challanService.getChallans({ page, search, limit: 10 })
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
