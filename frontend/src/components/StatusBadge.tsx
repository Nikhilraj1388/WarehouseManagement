import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
      case 'ACTIVE':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'CANCELLED':
      case 'ERROR':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'DRAFT':
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'LEAD':
      case 'INFO':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'WARNING':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle()}`}>
      {status}
    </span>
  );
};
