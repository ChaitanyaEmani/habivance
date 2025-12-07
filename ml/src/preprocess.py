import pandas as pd
import numpy as np
from sklearn.preprocessing import MultiLabelBinarizer, LabelEncoder

class HabitDataPreprocessor:
    """
    Preprocesses user data for habit recommendation model
    """
    
    def __init__(self):
        self.mlb_health = MultiLabelBinarizer()
        self.le_bmi = LabelEncoder()
        self.le_goals = LabelEncoder()
        self.le_habit = LabelEncoder()
        self.health_issues_fitted = False
        self.fitted = False
        
    def fit(self, df):
        """
        Fit the preprocessor on training data
        """
        # Normalize case for consistency
        df['bmiCategory'] = df['bmiCategory'].str.lower().str.replace(" ", "")
        df['goals'] = df['goals'].str.lower().str.replace(" ", "")

        # Parse health issues (comma-separated string to list)
        df['healthIssues_list'] = df['healthIssues'].apply(
            lambda x: [issue.strip().lower().replace(" ", "") for issue in str(x).split(',')]
            if pd.notna(x) and x != 'none' else []
        )

        
        # Fit MultiLabelBinarizer for health issues
        self.mlb_health.fit(df['healthIssues_list'])
        self.health_issues_fitted = True
        
        # Fit LabelEncoders
        self.le_bmi.fit(df['bmiCategory'])
        self.le_goals.fit(df['goals'])
        self.le_habit.fit(df['recommendedHabit'])
        
        self.fitted = True
        return self
    
    def transform_input(self, bmi_category, health_issues, goals):
        """
        Transform user input into model-ready features
        
        Args:
            bmi_category: str (e.g., 'Overweight')
            health_issues: list of str (e.g., ['Diabetes', 'Hypertension'])
            goals: str (e.g., 'Weight Loss')
        
        Returns:
            numpy array of features
        """
        if not self.fitted:
            raise ValueError("Preprocessor must be fitted before transforming")
        
        # Normalize case
        bmi_category = bmi_category.lower().replace(" ", "") if bmi_category else None
        goals = goals.lower().replace(" ", "") if goals else None

        # Handle None or empty health issues
        if health_issues is None or len(health_issues) == 0:
            health_issues = []
        else:
            health_issues = [issue.lower().replace(" ", "") for issue in health_issues]

        
        # Encode BMI category
        bmi_encoded = self.le_bmi.transform([bmi_category])[0]
        
        # Encode goals
        goals_encoded = self.le_goals.transform([goals])[0]
        
        # Encode health issues (multi-hot)
        health_encoded = self.mlb_health.transform([health_issues])[0]
        
        # Combine all features
        features = np.concatenate([
            [bmi_encoded, goals_encoded],
            health_encoded
        ])
        
        return features.reshape(1, -1)
    
    def transform_dataset(self, df):
        """
        Transform entire dataset for training
        """
        # Normalize case
        df['bmiCategory'] = df['bmiCategory'].str.lower().str.replace(" ", "")
        df['goals'] = df['goals'].str.lower().str.replace(" ", "")

        # Parse health issues
        df['healthIssues_list'] = df['healthIssues'].apply(
            lambda x: [issue.strip().lower().replace(" ", "") for issue in str(x).split(',')]
            if pd.notna(x) and x != 'none' else []
        )

        
        # Encode features
        bmi_encoded = self.le_bmi.transform(df['bmiCategory'])
        goals_encoded = self.le_goals.transform(df['goals'])
        health_encoded = self.mlb_health.transform(df['healthIssues_list'])
        
        # Combine features
        X = np.column_stack([bmi_encoded, goals_encoded, health_encoded])
        
        # Encode target
        y = self.le_habit.transform(df['recommendedHabit'])
        
        return X, y
    
    def inverse_transform_habit(self, encoded_habits):
        """
        Convert encoded habit predictions back to habit names
        """
        return self.le_habit.inverse_transform(encoded_habits)
    
    def get_feature_names(self):
        """
        Get feature names for model interpretation
        """
        health_features = [f'health_{issue}' for issue in self.mlb_health.classes_]
        return ['bmi_category', 'goals'] + health_features