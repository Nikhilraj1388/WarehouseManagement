import React from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T = any> {
  header: string;
  accessor: keyof T | string | ((row: T) => React.ReactNode);
  className?: string;
}

export interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
  onPageChange?: (page: number) => void;
  searchValue?: string;
  onSearch?: (value: string) => void;
}

export function DataTable<T = any>({
  columns,
  data,
  loading,
  pagination,
  onPageChange,
  searchValue,
  onSearch,
}: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {onSearch !== undefined && (
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            />
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {columns.map((col, i) => (
                <th key={i} className={`py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((_, j) => (
                    <td key={j} className="py-4 px-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-gray-500">
                  No data found
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors duration-150 group">
                  {columns.map((col, j) => (
                    <td key={j} className={`py-4 px-6 text-sm text-gray-700 ${col.className || ''}`}>
                      {typeof col.accessor === 'function' ? col.accessor(row) : (row[col.accessor as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <span className="text-sm text-gray-500">
            Showing {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page * pagination.limit >= pagination.total}
              className="p-2 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
