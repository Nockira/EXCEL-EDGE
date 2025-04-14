import React from "react";
import { UseFormRegister } from "react-hook-form";

interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  name: string;
  register: UseFormRegister<any>;
  error?: string;
  disabled: boolean;
  className?: string;
}

export const TextInput: React.FC<InputProps> = ({
  label,
  type,
  placeholder,
  name,
  register,
  error,
  disabled,
  className,
}) => {
  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-600">{label}</label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        disabled={disabled}
        className={`px-4 py-2 border border-gray-500 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-yellow-500 ${className}`}
      />
      <span className="text-red-600 text-sm">{error}</span>
    </div>
  );
};
