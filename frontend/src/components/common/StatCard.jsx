import React from 'react'

const StatCard = ({ title, value, subtitle, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'border-blue-500 text-blue-500',
    green: 'border-green-500 text-green-500',
    purple: 'border-purple-500 text-purple-500',
    orange: 'border-orange-500 text-orange-500',
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <Icon className={`w-8 h-8 ${colorClasses[color]}`} />
      </div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
};

export default StatCard