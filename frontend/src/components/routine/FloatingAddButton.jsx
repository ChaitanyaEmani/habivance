import React from 'react';
import { Plus } from 'lucide-react';

const FloatingAddButton = ({ onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
};

export default FloatingAddButton;