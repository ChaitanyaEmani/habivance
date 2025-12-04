import React from "react";

const StatsSection = () => {
  const stats = [
    { number: "500+", label: "Habit Templates" },
    { number: "10K+", label: "Active Users" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Tracking Support" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {stat.number}
            </div>
            <div className="text-gray-600 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;
