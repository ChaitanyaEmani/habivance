import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os
import sys

# Add src directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from preprocess import HabitDataPreprocessor

def load_data(csv_path):
    """Load habit dataset"""
    print(f"Loading data from {csv_path}...")
    df = pd.read_csv(csv_path)
    print(f"Dataset shape: {df.shape}")
    print(f"\nColumns: {df.columns.tolist()}")
    print(f"\nFirst few rows:")
    print(df.head())
    return df

def train_model(csv_path='../data/habit_dataset.csv', model_path='../models/'):
    """
    Train the habit recommendation model
    """
    # Create models directory if it doesn't exist
    os.makedirs(model_path, exist_ok=True)
    
    # Load data
    df = load_data(csv_path)
    
    # Initialize preprocessor
    print("\n" + "="*50)
    print("Preprocessing data...")
    print("="*50)
    preprocessor = HabitDataPreprocessor()
    preprocessor.fit(df)
    
    # Transform data
    X, y = preprocessor.transform_dataset(df)
    print(f"\nFeature shape: {X.shape}")
    print(f"Target shape: {y.shape}")
    print(f"Feature names: {preprocessor.get_feature_names()}")
    
    # Split data (remove stratify due to small dataset with unique classes)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"\nTrain set: {X_train.shape}")
    print(f"Test set: {X_test.shape}")
    
    # Check class distribution
    unique, counts = np.unique(y, return_counts=True)
    single_instance_classes = sum(counts == 1)
    if single_instance_classes > 0:
        print(f"\nWarning: {single_instance_classes} habit(s) appear only once in dataset")
        print("Consider adding more diverse training examples for better performance")
    
    # Train model with better parameters for small dataset
    print("\n" + "="*50)
    print("Training Random Forest Classifier...")
    print("="*50)
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=None,
        min_samples_split=2,
        min_samples_leaf=1,
        random_state=42,
        class_weight='balanced',
        n_jobs=-1,
        bootstrap=True,
        max_features='sqrt'
    )
    
    model.fit(X_train, y_train)
    print("Training completed!")
    
    # Evaluate model
    print("\n" + "="*50)
    print("Model Evaluation")
    print("="*50)
    
    # Training accuracy
    train_pred = model.predict(X_train)
    train_acc = accuracy_score(y_train, train_pred)
    print(f"Training Accuracy: {train_acc:.4f}")
    
    # Test accuracy
    test_pred = model.predict(X_test)
    test_acc = accuracy_score(y_test, test_pred)
    print(f"Test Accuracy: {test_acc:.4f}")
    
    # Cross-validation score (skip if dataset is too small)
    if len(np.unique(y_train)) >= 5 and len(y_train) >= 10:
        try:
            cv_scores = cross_val_score(model, X_train, y_train, cv=min(3, len(y_train) // 10))
            print(f"Cross-validation scores: {cv_scores}")
            print(f"Mean CV Score: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
        except Exception as e:
            print(f"Cross-validation skipped: {str(e)}")
    else:
        print("Cross-validation skipped: Dataset too small or too many unique classes")
    
    # Feature importance
    print("\n" + "="*50)
    print("Top 10 Important Features:")
    print("="*50)
    feature_names = preprocessor.get_feature_names()
    feature_importance = pd.DataFrame({
        'feature': feature_names,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    print(feature_importance.head(10))
    
    # Save model and preprocessor
    model_file = os.path.join(model_path, 'habit_recommender.pkl')
    preprocessor_file = os.path.join(model_path, 'preprocessor.pkl')
    metadata_file = os.path.join(model_path, 'metadata.pkl')
    
    print("\n" + "="*50)
    print("Saving model artifacts...")
    print("="*50)
    joblib.dump(model, model_file)
    joblib.dump(preprocessor, preprocessor_file)
    
    # Save metadata for reference
    metadata = {
        'train_accuracy': train_acc,
        'test_accuracy': test_acc,
        'cv_mean_score': None,
        'cv_std_score': None,
        'n_features': X.shape[1],
        'n_classes': len(np.unique(y)),
        'feature_names': feature_names,
        'dataset_info': df.groupby('recommendedHabit')['category'].first().to_dict()
    }
    joblib.dump(metadata, metadata_file)
    
    print(f"Model saved to: {model_file}")
    print(f"Preprocessor saved to: {preprocessor_file}")
    print(f"Metadata saved to: {metadata_file}")
    
    print("\n" + "="*50)
    print("Training Complete!")
    print("="*50)
    
    return model, preprocessor

if __name__ == "__main__":
    # Get the directory of this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Set paths relative to script location
    csv_path = os.path.join(script_dir, '..', 'data', 'habit_dataset.csv')
    model_path = os.path.join(script_dir, '..', 'models')
    
    # Train model
    train_model(csv_path, model_path)