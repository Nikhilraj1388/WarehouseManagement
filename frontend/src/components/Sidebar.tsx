import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Package, FileText, LogOut, UserCog } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Customers', path: '/customers', icon: <Users size={20} /> },
    { name: 'Products', path: '/products', icon: <Package size={20} /> },
    { name: 'Challans', path: '/challans', icon: <FileText size={20} /> },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ name: 'Staff Users', path: '/users', icon: <UserCog size={20} /> });
  }

  return (
    <div className="w-[280px] bg-[#0F172A] text-white flex flex-col h-screen fixed top-0 left-0">
      <div className="h-[72px] flex items-center px-6 border-b border-[#1E293B]">
        <div className="flex items-center gap-3 text-white font-bold text-xl tracking-wide">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Package size={20} className="text-white" />
          </div>
          Mini ERP
        </div>
      </div>
      <div className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-400 hover:bg-[#1E293B] hover:text-white'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>
      <div className="p-4 border-t border-[#1E293B]">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-[#1E293B] hover:text-white transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
