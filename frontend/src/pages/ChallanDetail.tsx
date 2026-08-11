import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { challanService } from '../services/challan.service';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ChallanStatus } from '../types';
import toast from 'react-hot-toast';
import { ArrowLeft, Printer, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export const ChallanDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['challan', id],
    queryFn: () => challanService.getChallan(id!),
    enabled: !!id
  });

  const mutation = useMutation({
    mutationFn: (status: ChallanStatus) => challanService.updateChallanStatus(id!, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challan', id] });
      toast.success('Challan status updated');
    },
    onError: (error: any) => toast.error(error.response?.data?.message || 'Update failed')
  });

  if (isLoading) return <LoadingSpinner />;
  const challan = data?.data;
  if (!challan) return <div>Challan not found</div>;

  const totalAmount = challan.items?.reduce((sum: number, item: any) => sum + (Number(item.unitPrice) * item.quantity), 0) || 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/challans')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 flex items-center gap-2">
            <Printer size={18} /> Print
          </button>
          {challan.status === ChallanStatus.DRAFT && (
            <>
              <button onClick={() => mutation.mutate(ChallanStatus.CANCELLED)} className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 flex items-center gap-2">
                <XCircle size={18} /> Cancel
              </button>
              <button onClick={() => mutation.mutate(ChallanStatus.CONFIRMED)} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-md flex items-center gap-2">
                <CheckCircle size={18} /> Confirm
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" id="printable-area">
        <div className="p-8 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{challan.challanNumber}</h1>
            <div className="flex items-center gap-3">
              <span className="text-gray-500">Date: {format(new Date(challan.createdAt), 'PPP')}</span>
              <StatusBadge status={challan.status} />
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Mini ERP Inc.</h2>
            <p className="text-gray-500 text-sm">123 Business Road, Tech Park</p>
            <p className="text-gray-500 text-sm">support@minierp.com</p>
          </div>
        </div>

        <div className="p-8 bg-gray-50/50 border-b border-gray-100 flex justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Billed To:</p>
            <Link to={`/customers/${challan.customerId}`} className="text-lg font-bold text-blue-600 hover:underline">{challan.customer?.customerName}</Link>
            <p className="text-gray-700 mt-1">{challan.customer?.businessName}</p>
            <p className="text-gray-600 text-sm mt-1">{challan.customer?.mobile}</p>
            <p className="text-gray-600 text-sm">{challan.customer?.address}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Created By:</p>
            <p className="text-gray-900 font-medium">{challan.creator?.name}</p>
          </div>
        </div>

        <div className="p-8">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 font-semibold text-gray-900">Item Details</th>
                <th className="py-3 font-semibold text-gray-900 text-center">Qty</th>
                <th className="py-3 font-semibold text-gray-900 text-right">Price</th>
                <th className="py-3 font-semibold text-gray-900 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {challan.items?.map((item: any) => (
                <tr key={item.id}>
                  <td className="py-4">
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                  </td>
                  <td className="py-4 text-center text-gray-700">{item.quantity}</td>
                  <td className="py-4 text-right text-gray-700">₹{Number(item.unitPrice).toFixed(2)}</td>
                  <td className="py-4 text-right font-medium text-gray-900">₹{(Number(item.unitPrice) * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="mt-8 flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Total Items</span>
                <span className="font-medium">{challan.totalQuantity} units</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between text-xl font-bold text-gray-900">
                <span>Total Amount</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
