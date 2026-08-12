import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/product.service';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FormInput } from '../components/FormInput';
import { FormSelect } from '../components/FormSelect';
import { MovementType } from '../types';
import toast from 'react-hot-toast';
import { Plus, Edit2, ArrowDownUp, Trash2, Filter, History, ArrowDown, ArrowUp } from 'lucide-react';
import { format } from 'date-fns';

import { useAuth } from '../hooks/useAuth';

export const Products: React.FC = () => {
  const { user } = useAuth();
  const canManage = user?.role === 'ADMIN' || user?.role === 'WAREHOUSE';

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [movementProductName, setMovementProductName] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', sku: '', category: '', unitPrice: 0, minimumStock: 0, warehouseLocation: ''
  });

  const [stockData, setStockData] = useState({
    quantity: 0, movementType: MovementType.IN, type: MovementType.IN, reason: ''
  });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, search, categoryFilter],
    queryFn: () => productService.getProducts({ 
      page, search, limit: 10,
      ...(categoryFilter && { category: categoryFilter })
    })
  });

  // Extract unique categories from loaded products for the filter dropdown
  const allProducts = data?.data?.data || [];
  const categories = [...new Set(allProducts.map((p: any) => p.category).filter(Boolean))];

  // Stock movement history query (only when modal is open)
  const { data: movementsData, isLoading: movementsLoading } = useQuery({
    queryKey: ['movements', editingId],
    queryFn: () => productService.getMovements(editingId!),
    enabled: isMovementModalOpen && !!editingId
  });

  const productMutation = useMutation({
    mutationFn: (data: any) => 
      editingId ? productService.updateProduct(editingId, data) : productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(`Product ${editingId ? 'updated' : 'created'} successfully`);
      setIsModalOpen(false);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Something went wrong')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
      setDeletingId(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
      setDeletingId(null);
    }
  });

  const stockMutation = useMutation({
    mutationFn: (data: any) => productService.updateStock(editingId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      toast.success('Stock updated successfully');
      setIsStockModalOpen(false);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Something went wrong')
  });

  const handleOpenModal = (product?: any) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name, sku: product.sku, category: product.category,
        unitPrice: Number(product.unitPrice), minimumStock: product.minimumStock,
        warehouseLocation: product.warehouseLocation || ''
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', sku: '', category: '', unitPrice: 0, minimumStock: 0, warehouseLocation: '' });
    }
    setIsModalOpen(true);
  };

  const handleOpenStockModal = (product: any) => {
    setEditingId(product.id);
    setStockData({ quantity: 1, movementType: MovementType.IN, type: MovementType.IN, reason: '' });
    setIsStockModalOpen(true);
  };

  const handleOpenMovementModal = (product: any) => {
    setEditingId(product.id);
    setMovementProductName(product.name);
    setIsMovementModalOpen(true);
  };

  const columns = [
    { header: 'Product', accessor: (row: any) => (
      <div>
        <div className="font-medium text-gray-900">{row.name}</div>
        <div className="text-xs text-gray-500">{row.sku}</div>
      </div>
    )},
    { header: 'Category', accessor: (row: any) => (
      <span className="px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
        {row.category}
      </span>
    )},
    { header: 'Price', accessor: (row: any) => `₹${Number(row.unitPrice).toFixed(2)}` },
    { header: 'Stock', accessor: (row: any) => (
      <span className={`px-2 py-1 rounded-md text-sm font-medium ${row.currentStock <= row.minimumStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
        {row.currentStock}
      </span>
    )},
    { header: 'Location', accessor: 'warehouseLocation' },
    { header: 'Actions', accessor: (row: any) => (
      <div className="flex gap-1">
        <button onClick={() => handleOpenMovementModal(row)} className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="View Stock History">
          <History size={18} />
        </button>
        {canManage && (
          <>
            <button onClick={() => handleOpenStockModal(row)} className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Update Stock">
              <ArrowDownUp size={18} />
            </button>
            <button onClick={() => handleOpenModal(row)} className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit Product">
              <Edit2 size={18} />
            </button>
            <button onClick={() => setDeletingId(row.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Product">
              <Trash2 size={18} />
            </button>
          </>
        )}
      </div>
    )}
  ];

  const movements = movementsData?.data || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        {canManage && (
          <button 
            onClick={() => handleOpenModal()} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
          >
            <Plus size={18} /> Add Product
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
        <Filter size={16} className="text-gray-400" />
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((cat: any) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {categoryFilter && (
          <button
            onClick={() => { setCategoryFilter(''); setPage(1); }}
            className="px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            Clear Filter
          </button>
        )}
      </div>

      <DataTable 
        columns={columns} 
        data={allProducts} 
        loading={isLoading}
        pagination={data?.data ? { page: data.data.page, limit: data.data.limit, total: data.data.total } : undefined}
        onPageChange={setPage}
        searchValue={search}
        onSearch={(v) => { setSearch(v); setPage(1); }}
      />

      {/* Add/Edit Product Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={e => { e.preventDefault(); productMutation.mutate(formData); }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Product Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <FormInput label="SKU" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} required />
            <FormInput label="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
            <FormInput label="Unit Price (₹)" type="number" step="0.01" value={formData.unitPrice} onChange={e => setFormData({...formData, unitPrice: parseFloat(e.target.value)})} required />
            <FormInput label="Min. Stock Alert" type="number" value={formData.minimumStock} onChange={e => setFormData({...formData, minimumStock: parseInt(e.target.value)})} required />
            <FormInput label="Location (e.g. Rack A1)" value={formData.warehouseLocation} onChange={e => setFormData({...formData, warehouseLocation: e.target.value})} />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
            <button type="submit" disabled={productMutation.isPending} className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium">
              {productMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Update Stock Modal */}
      <Modal isOpen={isStockModalOpen} onClose={() => setIsStockModalOpen(false)} title="Update Stock">
        <form onSubmit={e => { e.preventDefault(); stockMutation.mutate(stockData); }} className="space-y-4">
          <FormSelect 
            label="Movement Type" 
            value={stockData.movementType} 
            onChange={e => {
              const val = e.target.value as MovementType;
              setStockData({...stockData, movementType: val, type: val});
            }}
            options={[{ label: 'Stock In (+)', value: MovementType.IN }, { label: 'Stock Out (-)', value: MovementType.OUT }]}
          />
          <FormInput label="Quantity" type="number" min="1" value={stockData.quantity} onChange={e => setStockData({...stockData, quantity: parseInt(e.target.value)})} required />
          <FormInput label="Reason / Reference" value={stockData.reason} onChange={e => setStockData({...stockData, reason: e.target.value})} required />
          
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => setIsStockModalOpen(false)} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={stockMutation.isPending} className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">Update Stock</button>
          </div>
        </form>
      </Modal>

      {/* Stock Movement History Modal */}
      <Modal isOpen={isMovementModalOpen} onClose={() => setIsMovementModalOpen(false)} title={`Stock Movement Log — ${movementProductName}`}>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {movementsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : movements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <History size={32} className="mx-auto mb-2 opacity-40" />
              <p>No stock movements recorded yet.</p>
            </div>
          ) : (
            movements.map((m: any) => (
              <div key={m.id} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-lg ${m.movementType === 'IN' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {m.movementType === 'IN' ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${m.movementType === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {m.movementType === 'IN' ? '+' : '-'}{m.quantity} units
                    </span>
                    <span className="text-xs text-gray-400">
                      {format(new Date(m.createdAt), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{m.reason || 'No reason specified'}</p>
                  {m.user && <p className="text-xs text-gray-400 mt-0.5">By: {m.user.name}</p>}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={() => setIsMovementModalOpen(false)} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium">Close</button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        danger
        onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
