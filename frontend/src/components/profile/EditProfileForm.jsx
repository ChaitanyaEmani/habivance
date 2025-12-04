import React from 'react';
import { Input, Select, Button } from "../common/FormFields"; 
// adjust path based on your structure

const EditProfileForm = ({ 
  formData, 
  onInputChange, 
  onHealthIssuesChange, 
  onSubmit, 
  onCancel 
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">

      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={onInputChange}
        placeholder="Enter your name"
        required
      />

      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={onInputChange}
        placeholder="Enter your email"
        required
      />

      <Input
        label="Age"
        name="age"
        type="number"
        value={formData.age}
        onChange={onInputChange}
        placeholder="Enter your age"
        required
      />

      <Input
        label="Height (cm)"
        name="height"
        type="number"
        value={formData.height}
        onChange={onInputChange}
        placeholder="Enter your height in cm"
        required
      />

      <Input
        label="Weight (kg)"
        name="weight"
        type="number"
        value={formData.weight}
        onChange={onInputChange}
        placeholder="Enter your weight in kg"
        required
      />

      <Select
        label="Goals"
        name="goals"
        value={formData.goals}
        onChange={onInputChange}
        required
        options={[
          "",
          "weight loss",
          "muscle gain",
          "maintenance",
          "general fitness"
        ]}
      />

      {/* Health Issues Input */}
      <Input
        label="Health Issues (comma-separated)"
        name="healthIssues"
        value={formData.healthIssues.join(", ")}
        onChange={onHealthIssuesChange}
        placeholder="e.g., sugar, diabetes, hypertension"
      />
      <p className="text-xs text-gray-500">
        Separate multiple issues with commas
      </p>

      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary" className="flex-1">
          Save Changes
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>

    </form>
  );
};

export default EditProfileForm;
