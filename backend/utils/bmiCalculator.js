// Purpose: Calculate BMI and health risk
// Function: calculateBMI(height, weight)
// Formula: BMI = weight(kg) / (height(m))²
// Returns: BMI value + category (underweight/normal/overweight/obese)

// utils/bmiCalculator.js
/**
 * calculateBMI expects:
 * - height: in meters (e.g. 1.75)
 * - weight: in kg
 *
 * Returns { bmi: Number, category: String }
 */
export const calculateBMI = (height, weight) => {
  if (!height || !weight) {
    return { bmi: null, category: null };
  }

  

  // Convert height from cm to meters
  const heightInMeters = height / 100;
  
  // Calculate BMI
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
  
  // Determine category
  let category;
  if (bmi < 18.5) {
    category = 'Underweight';
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'Normal';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
  } else {
    category = 'Obese';
  }

  return {
    bmi: parseFloat(bmi),
    category,
  };
};

export const getHealthRisk = (bmi, age) => {
  if (!bmi) return 'Unknown';

  let risk = 'Low';

  if (bmi < 18.5) {
    risk = 'Moderate';
  } else if (bmi >= 25 && bmi < 30) {
    risk = 'Moderate';
  } else if (bmi >= 30) {
    risk = 'High';
  }

  // Adjust for age
  if (age > 60 && (bmi < 18.5 || bmi >= 30)) {
    risk = 'High';
  }

  return risk;
};
