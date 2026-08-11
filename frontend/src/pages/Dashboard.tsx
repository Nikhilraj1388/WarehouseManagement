import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Package, AlertCircle, FileText, ArrowRight, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboard.service';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardService.getStats
  });

  if (isLoading) return <LoadingSpinner text="Loading dashboard..." />;

  const stats = data?.data;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
          <p className="text-gray-500 mt-1">Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/customers')} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Plus size={16} /> Customer
          </button>
          <button onClick={() => navigate('/products')} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Plus size={16} /> Product
          </button>
          <button onClick={() => navigate('/challans/create')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2">
            <Plus size={16} /> Challan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Customers" 
          value={stats?.totalCustomers || 0} 
          icon={<Users size={24} />} 
          color="blue"
        />
        <StatCard 
          title="Total Products" 
          value={stats?.totalProducts || 0} 
          icon={<Package size={24} />} 
          color="green"
        />
        <StatCard 
          title="Low Stock Alerts" 
          value={stats?.lowStockProducts || 0} 
          icon={<AlertCircle size={24} />} 
          color="amber"
        />
        <StatCard 
          title="Total Challans" 
          value={stats?.totalChallans || 0} 
          icon={<FileText size={24} />} 
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Recent Challans</h2>
            <Link to="/challans" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {stats?.recentChallans?.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No recent challans</div>
            ) : (
              stats?.recentChallans?.map(challan => (
                <div key={challan.id} className="p-4 px-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <Link to={`/challans/${challan.id}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {challan.challanNumber}
                    </Link>
                    <p className="text-sm text-gray-500">{challan.customer?.customerName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={challan.status} />
                    <span className="text-xs text-gray-400">
                      {new Date(challan.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Upcoming Follow-ups</h2>
          </div>
          <div className="divide-y divide-gray-100 p-2">
            {stats?.upcomingFollowUps?.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No upcoming follow-ups</div>
            ) : (
              stats?.upcomingFollowUps?.map(customer => (
                <div key={customer.id} className="p-4 hover:bg-gray-50 rounded-xl transition-colors m-2">
                  <div className="flex justify-between items-start mb-2">
                    <Link to={`/customers/${customer.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                      {customer.customerName}
                    </Link>
                    <span className="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-700 rounded-md">
                      {customer.followUpDate ? format(new Date(customer.followUpDate), 'MMM dd') : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {customer.notes || 'No notes provided.'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
