import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/customer.service';
import { ArrowLeft, Phone, Mail, Building, MapPin, Calendar, Clock, Plus } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { FormInput } from '../components/FormInput';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export const CustomerDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [note, setNote] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerService.getCustomer(id!),
    enabled: !!id
  });

  const mutation = useMutation({
    mutationFn: () => customerService.addFollowUp(id!, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
      setNote('');
      toast.success('Follow-up added successfully');
    },
    onError: () => toast.error('Failed to add follow-up')
  });

  const handleAddFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    mutation.mutate();
  };

  if (isLoading) return <LoadingSpinner />;

  const customer = data?.data;
  if (!customer) return <div>Customer not found</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <button 
        onClick={() => navigate('/customers')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Customers
      </button>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{customer.customerName}</h1>
          <div className="flex gap-3 mt-2">
            <StatusBadge status={customer.status} />
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
              {customer.customerType}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={18} className="text-gray-400" />
                <span>{customer.mobile}</span>
              </div>
              {customer.email && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail size={18} className="text-gray-400" />
                  <span>{customer.email}</span>
                </div>
              )}
              {customer.businessName && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Building size={18} className="text-gray-400" />
                  <span>{customer.businessName}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-start gap-3 text-gray-600">
                  <MapPin size={18} className="text-gray-400 mt-1" />
                  <span>{customer.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Follow-up Timeline</h3>
            
            <form onSubmit={handleAddFollowUp} className="mb-8 flex gap-3">
              <div className="flex-1">
                <FormInput 
                  label="" 
                  placeholder="Add a new follow-up note..." 
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                disabled={mutation.isPending || !note.trim()}
                className="px-4 h-11 mt-1.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all disabled:opacity-70 flex items-center gap-2"
              >
                <Plus size={18} /> Add
              </button>
            </form>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {customer.followUps?.map((fup: any) => (
                <div key={fup.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <Clock size={16} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{fup.creator?.name || 'User'}</span>
                      <time className="text-xs text-gray-500 font-medium">{format(new Date(fup.createdAt), 'MMM dd, yyyy h:mm a')}</time>
                    </div>
                    <p className="text-gray-600 text-sm">{fup.note}</p>
                  </div>
                </div>
              ))}
              {customer.followUps?.length === 0 && (
                <div className="text-center text-gray-500 py-4">No follow-ups recorded yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
