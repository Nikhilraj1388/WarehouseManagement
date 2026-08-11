import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/customer.service';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FormInput } from '../components/FormInput';
import { FormSelect } from '../components/FormSelect';
import { CustomerType, CustomerStatus } from '../types';
import toast from 'react-hot-toast';
import { Plus, Edit2, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Customers: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    customerName: '',
    mobile: '',
    email: '',
    businessName: '',
    customerType: CustomerType.RETAIL,
    status: CustomerStatus.ACTIVE
  });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['customers', page, search],
    queryFn: () => customerService.getCustomers({ page, search, limit: 10 })
  });

  const mutation = useMutation({
    mutationFn: (data: any) => 
      editingId ? customerService.updateCustomer(editingId, data) : customerService.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success(`Customer ${editingId ? 'updated' : 'created'} successfully`);
      handleCloseModal();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => customerService.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer deleted successfully');
      setDeletingId(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete customer');
      setDeletingId(null);
    }
  });

  const handleOpenModal = (customer?: any) => {
    if (customer) {
      setEditingId(customer.id);
      setFormData({
        customerName: customer.customerName,
        mobile: customer.mobile,
        email: customer.email || '',
        businessName: customer.businessName || '',
        customerType: customer.customerType,
        status: customer.status
      });
    } else {
      setEditingId(null);
      setFormData({
        customerName: '', mobile: '', email: '', businessName: '',
        customerType: CustomerType.RETAIL, status: CustomerStatus.ACTIVE
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const columns = [
    { header: 'Name', accessor: (row: any) => (
      <div>
        <div className="font-medium text-gray-900">{row.customerName}</div>
        <div className="text-xs text-gray-500">{row.email}</div>
      </div>
    )},
    { header: 'Business', accessor: 'businessName' },
    { header: 'Mobile', accessor: 'mobile' },
    { header: 'Type', accessor: 'customerType' },
    { header: 'Status', accessor: (row: any) => <StatusBadge status={row.status} /> },
    { header: 'Actions', accessor: (row: any) => (
      <div className="flex gap-2">
        <Link to={`/customers/${row.id}`} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Detail">
          <Eye size={18} />
        </Link>
        <button onClick={() => handleOpenModal(row)} className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit Customer">
          <Edit2 size={18} />
        </button>
        <button onClick={() => setDeletingId(row.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Customer">
          <Trash2 size={18} />
        </button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
        >
          <Plus size={18} /> Add Customer
        </button>
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

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingId ? 'Edit Customer' : 'Add Customer'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Customer Name" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} required />
            <FormInput label="Mobile Number" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} required />
            <FormInput label="Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <FormInput label="Business Name" value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} />
            <FormSelect 
              label="Customer Type" 
              value={formData.customerType} 
              onChange={e => setFormData({...formData, customerType: e.target.value as CustomerType})}
              options={[
                { label: 'Retail', value: CustomerType.RETAIL },
                { label: 'Wholesale', value: CustomerType.WHOLESALE },
                { label: 'Distributor', value: CustomerType.DISTRIBUTOR }
              ]}
            />
            <FormSelect 
              label="Status" 
              value={formData.status} 
              onChange={e => setFormData({...formData, status: e.target.value as CustomerStatus})}
              options={[
                { label: 'Active', value: CustomerStatus.ACTIVE },
                { label: 'Lead', value: CustomerStatus.LEAD },
                { label: 'Inactive', value: CustomerStatus.INACTIVE }
              ]}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium disabled:opacity-70 shadow-md shadow-blue-500/20">
              {mutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        confirmText="Delete"
        danger
        onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
