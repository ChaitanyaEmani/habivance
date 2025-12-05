import pandas as pd
import numpy as np
import joblib
import os

class HabitRecommender:
    """
    Habit recommendation system using trained ML model
    """
    
    def __init__(self, model_path='../models/'):
        self.model_path = model_path
        self.model = None
        self.preprocessor = None
        self.metadata = None
        self.dataset = None
        self.load_model()
        
    def load_model(self):
        """Load trained model and preprocessor"""
        try:
            model_file = os.path.join(self.model_path, 'habit_recommender.pkl')
            preprocessor_file = os.path.join(self.model_path, 'preprocessor.pkl')
            metadata_file = os.path.join(self.model_path, 'metadata.pkl')
            
            self.model = joblib.load(model_file)
            self.preprocessor = joblib.load(preprocessor_file)
            
            if os.path.exists(metadata_file):
                self.metadata = joblib.load(metadata_file)
            
            # Load dataset for habit details
            dataset_path = os.path.join(self.model_path, '..', 'data', 'habit_dataset.csv')
            if os.path.exists(dataset_path):
                self.dataset = pd.read_csv(dataset_path)
            
            print("Model loaded successfully!")
            
        except Exception as e:
            raise Exception(f"Error loading model: {str(e)}")
    
    def predict_habits(self, bmi_category, health_issues, goals, top_k=5):
        """
        Predict top K habits for user
        
        Args:
            bmi_category: str (e.g., 'Overweight')
            health_issues: list of str (e.g., ['Diabetes', 'Hypertension'])
            goals: str (e.g., 'Weight Loss')
            top_k: int, number of recommendations to return
        
        Returns:
            list of dicts with habit recommendations
        """
        # Validate inputs
        valid_bmi = ['Underweight', 'Normal', 'Overweight', 'Obese']
        if bmi_category not in valid_bmi:
            raise ValueError(f"Invalid bmiCategory. Must be one of: {valid_bmi}")
        
        # Handle empty health issues
        if health_issues is None:
            health_issues = []
        
        # Transform input
        features = self.preprocessor.transform_input(bmi_category, health_issues, goals)
        
        # Get prediction probabilities
        probabilities = self.model.predict_proba(features)[0]
        
        # Get top K predictions
        top_indices = np.argsort(probabilities)[-top_k:][::-1]
        
        # Convert indices to habit names
        top_habits = self.preprocessor.inverse_transform_habit(top_indices)
        
        # Prepare recommendations with details
        recommendations = []
        
        for habit in top_habits:
            # Get habit details from dataset
            habit_info = self._get_habit_details(habit)
            
            recommendation = {
                'habit': habit,
                'category': habit_info.get('category', 'Health'),
                'duration': int(habit_info.get('duration', 30)),
                'priority': habit_info.get('priority', 'medium'),
                'description': self._generate_description(habit, habit_info)
            }
            
            recommendations.append(recommendation)
        
        # Sort by priority (high -> medium -> low)
        priority_order = {'high': 0, 'medium': 1, 'low': 2}
        recommendations.sort(key=lambda x: priority_order.get(x['priority'], 1))
        
        return recommendations
    
    def _get_habit_details(self, habit_name):
        """Get habit details from dataset"""
        if self.dataset is not None:
            habit_row = self.dataset[self.dataset['recommendedHabit'] == habit_name]
            if not habit_row.empty:
                return {
                    'category': habit_row.iloc[0]['category'],
                    'duration': habit_row.iloc[0]['duration'],
                    'priority': habit_row.iloc[0]['priority']
                }
        
        # Default values if not found
        return {'category': 'Health', 'duration': 30, 'priority': 'medium'}
    
    def _generate_description(self, habit, habit_info):
        """Generate a brief description for the habit"""
        category = habit_info.get('category', 'Health')
        duration = habit_info.get('duration', 30)
        
        descriptions = {
            'Fitness': f"This {duration}-minute fitness activity will help improve your physical health.",
            'Diet': f"Following this dietary habit for {duration} minutes daily supports your nutrition goals.",
            'Health': f"This {duration}-minute health practice promotes overall wellbeing.",
            'Mental Health': f"Dedicate {duration} minutes to this mental wellness practice."
        }
        
        return descriptions.get(category, f"Practice this habit for {duration} minutes daily.")
    
    def get_model_info(self):
        """Get model metadata"""
        if self.metadata:
            return {
                'train_accuracy': self.metadata.get('train_accuracy'),
                'test_accuracy': self.metadata.get('test_accuracy'),
                'cv_score': self.metadata.get('cv_mean_score'),
                'n_features': self.metadata.get('n_features'),
                'n_classes': self.metadata.get('n_classes')
            }
        return None

# Example usage
if __name__ == "__main__":
    # Initialize recommender
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, '..', 'models')
    
    recommender = HabitRecommender(model_path)
    
    # Test prediction
    print("\n" + "="*50)
    print("Testing Habit Recommender")
    print("="*50)
    
    test_cases = [
        {
            'bmi_category': 'Overweight',
            'health_issues': ['Diabetes'],
            'goals': 'Weight Loss'
        },
        {
            'bmi_category': 'Normal',
            'health_issues': [],
            'goals': 'General Health'
        },
        {
            'bmi_category': 'Obese',
            'health_issues': ['Hypertension', 'Heart Disease'],
            'goals': 'Weight Loss'
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\nTest Case {i}:")
        print(f"BMI: {test_case['bmi_category']}")
        print(f"Health Issues: {test_case['health_issues']}")
        print(f"Goals: {test_case['goals']}")
        print("\nRecommendations:")
        
        recommendations = recommender.predict_habits(
            test_case['bmi_category'],
            test_case['health_issues'],
            test_case['goals'],
            top_k=3
        )
        
        for j, rec in enumerate(recommendations, 1):
            print(f"\n{j}. {rec['habit']}")
            print(f"   Category: {rec['category']}")
            print(f"   Duration: {rec['duration']} minutes")
            print(f"   Priority: {rec['priority']}")
            print(f"   {rec['description']}")
    
    # Print model info
    print("\n" + "="*50)
    print("Model Information")
    print("="*50)
    model_info = recommender.get_model_info()
    if model_info:
        for key, value in model_info.items():
            print(f"{key}: {value}")