import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className={`h-11 px-4 rounded-[10px] border bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 ${
          error ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
        }`}
      />
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </div>
  );
};
