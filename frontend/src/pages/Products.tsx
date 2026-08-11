import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/product.service';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { FormInput } from '../components/FormInput';
import { FormSelect } from '../components/FormSelect';
import { MovementType } from '../types';
import toast from 'react-hot-toast';
import { Plus, Edit2, ArrowDownUp, History } from 'lucide-react';

export const Products: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '', sku: '', category: '', unitPrice: 0, minimumStock: 0, warehouseLocation: ''
  });

  const [stockData, setStockData] = useState({
    quantity: 0, movementType: MovementType.IN, reason: ''
  });

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['products', page, search],
    queryFn: () => productService.getProducts({ page, search, limit: 10 })
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

  const stockMutation = useMutation({
    mutationFn: (data: any) => productService.updateStock(editingId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
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
        unitPrice: product.unitPrice, minimumStock: product.minimumStock,
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
    setStockData({ quantity: 1, movementType: MovementType.IN, reason: '' });
    setIsStockModalOpen(true);
  };

  const columns = [
    { header: 'Product', accessor: (row: any) => (
      <div>
        <div className="font-medium text-gray-900">{row.name}</div>
        <div className="text-xs text-gray-500">{row.sku}</div>
      </div>
    )},
    { header: 'Category', accessor: 'category' },
    { header: 'Price', accessor: (row: any) => `₹${row.unitPrice.toFixed(2)}` },
    { header: 'Stock', accessor: (row: any) => (
      <span className={`px-2 py-1 rounded-md text-sm font-medium ${row.currentStock <= row.minimumStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
        {row.currentStock}
      </span>
    )},
    { header: 'Location', accessor: 'warehouseLocation' },
    { header: 'Actions', accessor: (row: any) => (
      <div className="flex gap-2">
        <button onClick={() => handleOpenStockModal(row)} className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Update Stock">
          <ArrowDownUp size={18} />
        </button>
        <button onClick={() => handleOpenModal(row)} className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit">
          <Edit2 size={18} />
        </button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
        >
          <Plus size={18} /> Add Product
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

      <Modal isOpen={isStockModalOpen} onClose={() => setIsStockModalOpen(false)} title="Update Stock">
        <form onSubmit={e => { e.preventDefault(); stockMutation.mutate(stockData); }} className="space-y-4">
          <FormSelect 
            label="Movement Type" 
            value={stockData.movementType} 
            onChange={e => setStockData({...stockData, movementType: e.target.value as MovementType})}
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
    </div>
  );
};
