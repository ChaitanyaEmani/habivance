import React from 'react';

const PageHeader = ({ onAddClick, title, subTitle,page }) => {
  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {/* */}{title}
        </h1>
        <p className="text-gray-600">
          {/*  */}{subTitle}
        </p>
      </div>
      {page === "routine" && <button
        onClick={onAddClick}
        className="bg-blue-600 p-2 text-white rounded-md"
      >
        + Add New Habit
      </button>}
      
    </div>
  );
};

export default PageHeader;