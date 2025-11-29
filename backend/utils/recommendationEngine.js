// Purpose: Core algorithm for matching habits to user
// Function: matchHabits(userProfile, allHabits)
// Logic:
// If user has "eye problems" → filter habits with criteria "eye care"
// If BMI > 30 → recommend "weight loss exercises"
export const matchHabits = (userProfile, allHabits) => {
  const { bmi, bmiCategory, age, healthIssues } = userProfile;
  const recommendedHabits = [];

  allHabits.forEach((habit) => {
    let score = 0;
    const reasons = [];

    // Match based on health issues
    if (healthIssues && healthIssues.length > 0) {
      healthIssues.forEach((issue) => {
        const issueLower = issue.toLowerCase();
        if (habit.recommendedFor.some(rec => rec.toLowerCase().includes(issueLower))) {
          score += 10;
          reasons.push(`Recommended for ${issue}`);
        }
        if (habit.criteria.some(crit => crit.toLowerCase().includes(issueLower))) {
          score += 5;
          reasons.push(`Helpful for managing ${issue}`);
        }
      });
    }

    // Match based on BMI category
    if (bmiCategory) {
      const categoryLower = bmiCategory.toLowerCase();
      if (habit.recommendedFor.some(rec => rec.toLowerCase().includes(categoryLower))) {
        score += 8;
        reasons.push(`Suitable for ${bmiCategory} BMI`);
      }
      
      // Specific recommendations for weight categories
      if (bmiCategory === 'Overweight' || bmiCategory === 'Obese') {
        if (habit.category === 'Exercise' || 
            habit.criteria.some(c => c.toLowerCase().includes('weight loss'))) {
          score += 7;
          reasons.push('Helps with weight management');
        }
      }
      
      if (bmiCategory === 'Underweight') {
        if (habit.criteria.some(c => c.toLowerCase().includes('weight gain') || 
                                    c.toLowerCase().includes('nutrition'))) {
          score += 7;
          reasons.push('Supports healthy weight gain');
        }
      }
    }

    // Match based on age
    if (age) {
      if (age > 50) {
        if (habit.criteria.some(c => c.toLowerCase().includes('senior') || 
                                    c.toLowerCase().includes('bone health') ||
                                    c.toLowerCase().includes('flexibility'))) {
          score += 6;
          reasons.push('Age-appropriate activity');
        }
      }
      
      if (age < 30) {
        if (habit.criteria.some(c => c.toLowerCase().includes('energy') || 
                                    c.toLowerCase().includes('fitness'))) {
          score += 4;
          reasons.push('Builds healthy habits early');
        }
      }
    }

    // General health recommendations
    if (habit.recommendedFor.includes('general health') || 
        habit.criteria.includes('general health')) {
      score += 3;
      reasons.push('Good for overall health');
    }

    // Add habit to recommendations if score is above threshold
    if (score > 0) {
      recommendedHabits.push({
        ...habit.toObject(),
        matchScore: score,
        reasons: reasons,
      });
    }
  });

  // Sort by match score (highest first)
  recommendedHabits.sort((a, b) => b.matchScore - a.matchScore);

  return recommendedHabits;
};