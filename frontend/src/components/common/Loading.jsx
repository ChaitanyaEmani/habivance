import React from 'react'
import { Loader } from 'lucide-react';
const Loading = ({text}) => {
  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading {text}...</p>
        </div>
      </div>
    );
}

export default Loading