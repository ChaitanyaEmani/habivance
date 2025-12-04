import React from 'react'
import { Input, Textarea,Select,Button } from "../common/FormFields";

const AddHabitForm = ({formData,handleChange,setAddOpen,handleSubmit}) => {
     const categories = [
    "Nutrition",
    "Hydration",
    "Exercise",
    "Mental Health",
    "Sleep",
    "Health Monitoring",
    "Weight Management",
    "Productivity",
    "Lifestyle"
  ];
  return (
    <div className="min-h-screen">
      <div className="max-w-2xl ">
        <div className="space-y-4">
          <Input
            label="Habit Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Morning Exercise"
            required
          />

          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={categories}
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your habit..."
            rows={3}
          />

          <Select
            label="Frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            options={[
              { label: 'Daily', value: 'daily' },
              { label: 'Weekly', value: 'weekly' }
            ]}
            required
          />

          <Select
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            options={[
              { label: 'Low', value: 'low' },
              { label: 'Medium', value: 'medium' },
              { label: 'High', value: 'high' }
            ]}
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={()=>setAddOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              className="flex-1"
            >
              Add Habit
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddHabitForm