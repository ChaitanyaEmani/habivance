
import React, { useState } from 'react';

// Input Component
export const Input = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  type = "text",
  required = false,
  error = null
}) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Select/Dropdown Component
export const Select = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [],
  required = false,
  error = null
}) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    >
      {options.map((option, idx) => (
        <option key={idx} value={typeof option === 'string' ? option.toLowerCase() : option.value}>
          {typeof option === 'string' ? option : option.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Textarea Component
export const Textarea = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder,
  rows = 3,
  required = false,
  error = null
}) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Button Component
export const Button = ({ 
  children, 
  onClick, 
  variant = "primary",
  type = "button",
  className = "",
  disabled = false
}) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
    secondary: "border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
    success: "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};