import React from "react";
import { Input,Textarea,Select } from "../common/FormFields";
const AddHabitForm = ({ formData, onChange, onSubmit, onCancel, submitting }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Habit Name */}
      <Input 
        label="Habit Name"
        name="habit"
        value={formData.habit}
        onChange={onChange}
        placeholder="e.g., Morning Meditation"
        required
      />

      <Input 
        label="Category"
        name="category"
        value={formData.category}
        onChange={onChange}
        placeholder="e.g., Health, Productivity, Mindfulness"
        required
      />

      <Textarea label="Description" 
      name="description"
      value={formData.description}
      onChange={onChange}
       placeholder="Brief description of your habit..."
      required/>

      {/* Priority */}
      

      <Select
      label="Priority"
      name="priority"
      value={formData.priority}
      onChange={onChange}
      options={["Low","Medium","High"]} />

      

      <Input 
        label="Duration (minutes)"
        name="duration"
        value={formData.duration}
        onChange={onChange}
        placeholder="e.g., 15"
        required
      />

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95"
          disabled={submitting}
        >
          {submitting ? "Adding..." : "Add Habit"}
        </button>
      </div>
    </form>
  );
};

export default AddHabitForm;