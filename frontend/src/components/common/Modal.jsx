import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-600 hover:text-gray-800 text-3xl leading-none w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="text-gray-700 p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;