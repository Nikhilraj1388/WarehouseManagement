import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FormInput } from '../components/FormInput';
import { FormSelect } from '../components/FormSelect';
import { Role } from '../types';
import toast from 'react-hot-toast';
import { UserPlus, Edit2, Trash2, ShieldCheck, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../hooks/useAuth';

export const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: Role.SALES
  });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, search, roleFilter],
    queryFn: () => userService.getUsers({
      page,
      search,
      limit: 10,
      ...(roleFilter && { role: roleFilter })
    })
  });

  const userMutation = useMutation({
    mutationFn: (data: any) =>
      editingId ? userService.updateUser(editingId, data) : userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(`User ${editingId ? 'updated' : 'created'} successfully`);
      handleCloseModal();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
      setDeletingId(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete user');
      setDeletingId(null);
    }
  });

  const handleOpenModal = (user?: any) => {
    if (user) {
      setEditingId(user.id);
      setFormData({
        name: user.name,
        email: user.email,
        password: '', // Blank by default when editing
        role: user.role
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', email: '', password: '', role: Role.SALES });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    userMutation.mutate(formData);
  };

  const columns = [
    {
      header: 'Staff Member',
      accessor: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
            {row.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.name}</div>
            <div className="text-xs text-gray-500">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      accessor: (row: any) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-fit ${
          row.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
          row.role === 'SALES' ? 'bg-blue-100 text-blue-700' :
          row.role === 'WAREHOUSE' ? 'bg-amber-100 text-amber-700' :
          'bg-green-100 text-green-700'
        }`}>
          <ShieldCheck size={14} /> {row.role}
        </span>
      )
    },
    {
      header: 'Joined Date',
      accessor: (row: any) => row.createdAt ? format(new Date(row.createdAt), 'MMM dd, yyyy') : 'N/A'
    },
    {
      header: 'Actions',
      accessor: (row: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal(row)}
            className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            title="Edit User"
          >
            <Edit2 size={18} />
          </button>
          {row.id !== currentUser?.id && (
            <button
              onClick={() => setDeletingId(row.id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete User"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User & Staff Management</h1>
          <p className="text-sm text-gray-500">Create employee accounts and assign role-based permissions</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
        >
          <UserPlus size={18} /> Add Staff Member
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
        <Filter size={16} className="text-gray-400" />
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
        >
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="SALES">Sales</option>
          <option value="WAREHOUSE">Warehouse</option>
          <option value="ACCOUNTS">Accounts</option>
        </select>
        {roleFilter && (
          <button
            onClick={() => { setRoleFilter(''); setPage(1); }}
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

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingId ? 'Edit Staff Member' : 'Add New Staff Member'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Full Name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <FormInput
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <FormInput
            label={editingId ? 'Password (leave blank to keep unchanged)' : 'Password'}
            type="password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            required={!editingId}
          />
          <FormSelect
            label="Assign Role"
            value={formData.role}
            onChange={e => setFormData({ ...formData, role: e.target.value as Role })}
            options={[
              { label: 'Sales Representative (CRM & Sales Challans)', value: Role.SALES },
              { label: 'Warehouse Manager (Inventory & Stock Audit)', value: Role.WAREHOUSE },
              { label: 'Accounts (Billing Audit & Read-only)', value: Role.ACCOUNTS },
              { label: 'Admin (Master Access)', value: Role.ADMIN }
            ]}
          />
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
            <button type="submit" disabled={userMutation.isPending} className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium disabled:opacity-70 shadow-md shadow-blue-500/20">
              {userMutation.isPending ? 'Saving...' : 'Save Member'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        title="Delete Staff Member"
        message="Are you sure you want to delete this staff member's account? They will lose all access immediately."
        confirmText="Delete"
        danger
        onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
