import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { customerService } from '../services/customer.service';
import { productService } from '../services/product.service';
import { challanService } from '../services/challan.service';
import { FormSelect } from '../components/FormSelect';
import { FormInput } from '../components/FormInput';
import { Trash2, Plus, Save, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export const CreateChallan: React.FC = () => {
  const navigate = useNavigate();
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<Array<{ productId: string; quantity: number }>>([]);
  
  const { data: customersData } = useQuery({ queryKey: ['customers-all'], queryFn: () => customerService.getCustomers({ limit: 100 }) });
  const { data: productsData } = useQuery({ queryKey: ['products-all'], queryFn: () => productService.getProducts({ limit: 100 }) });

  const createMutation = useMutation({
    mutationFn: (data: any) => challanService.createChallan(data),
    onSuccess: (data) => {
      toast.success('Challan created successfully');
      navigate(`/challans/${data.data?.id}`);
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Failed to create challan')
  });

  const addItem = () => setItems([...items, { productId: '', quantity: 1 }]);
  
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };
  
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const handleSave = (status: 'DRAFT' | 'CONFIRMED') => {
    if (!customerId) return toast.error('Please select a customer');
    if (items.length === 0) return toast.error('Please add at least one item');
    if (items.some(i => !i.productId || i.quantity <= 0)) return toast.error('Please fill all item details correctly');
    
    createMutation.mutate({ customerId, status, items });
  };

  const getProductInfo = (id: string) => productsData?.data?.data.find(p => p.id === id);

  const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const totalAmount = items.reduce((sum, item) => {
    const p = getProductInfo(item.productId);
    return sum + (p ? Number(p.unitPrice) * (Number(item.quantity) || 0) : 0);
  }, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Create New Challan</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => handleSave('DRAFT')}
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 flex items-center gap-2"
          >
            <Save size={18} /> Save Draft
          </button>
          <button 
            onClick={() => handleSave('CONFIRMED')}
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center gap-2"
          >
            <Check size={18} /> Confirm & Issue
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-8">
        <div className="max-w-md">
          <FormSelect
            label="Select Customer"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            options={customersData?.data?.data.map(c => ({ label: `${c.customerName} (${c.businessName || 'Retail'})`, value: c.id })) || []}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Challan Items</h3>
            <button onClick={addItem} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg">
              <Plus size={16} /> Add Product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-100">
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase w-1/2">Product</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Unit Price</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase w-32">Quantity</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Total</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-500">No items added yet. Click "Add Product".</td></tr>
                ) : (
                  items.map((item, index) => {
                    const product = getProductInfo(item.productId);
                    return (
                      <tr key={index}>
                        <td className="py-3 px-4">
                          <select 
                            className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm"
                            value={item.productId}
                            onChange={(e) => updateItem(index, 'productId', e.target.value)}
                          >
                            <option value="">Select a product...</option>
                            {productsData?.data?.data.map(p => (
                              <option key={p.id} value={p.id}>{p.name} (Stock: {p.currentStock})</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {product ? `₹${Number(product.unitPrice).toFixed(2)}` : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <input 
                            type="number" 
                            min="1"
                            className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                          />
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {product ? `₹${(Number(product.unitPrice) * item.quantity).toFixed(2)}` : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <button onClick={() => removeItem(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {items.length > 0 && (
            <div className="mt-6 flex justify-end">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 w-72 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Total Quantity</span>
                  <span className="font-medium">{totalQuantity} units</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
