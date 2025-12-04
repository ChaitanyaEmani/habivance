from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys

# Add src directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))
from predict import HabitRecommender

app = Flask(__name__)
CORS(app)

# Initialize recommender
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models')
recommender = None

def initialize_recommender():
    """Initialize the habit recommender on startup"""
    global recommender
    try:
        recommender = HabitRecommender(MODEL_PATH)
        print("✓ Habit Recommender initialized successfully!")
        return True
    except Exception as e:
        print(f"✗ Error initializing recommender: {str(e)}")
        print("Make sure to train the model first by running: python src/train.py")
        return False

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    if recommender is None:
        return jsonify({
            'status': 'error',
            'message': 'Model not loaded. Please train the model first.'
        }), 503
    
    return jsonify({
        'status': 'healthy',
        'message': 'ML service is running',
        'model_loaded': True
    }), 200

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict habit recommendations
    
    Expected JSON body:
    {
        "bmiCategory": "Overweight",
        "healthIssues": ["Diabetes", "Hypertension"],
        "goals": "Weight Loss",
        "topK": 5  // optional, defaults to 5
    }
    """
    if recommender is None:
        return jsonify({
            'error': 'Model not loaded',
            'message': 'Please train the model first'
        }), 503
    
    try:
        # Parse request data
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'Invalid request',
                'message': 'Request body must be JSON'
            }), 400
        
        # Extract parameters
        bmi_category = data.get('bmiCategory')
        health_issues = data.get('healthIssues', [])
        goals = data.get('goals')
        top_k = data.get('topK', 5)
        
        # Validate required fields
        if not bmi_category:
            return jsonify({
                'error': 'Missing required field',
                'message': 'bmiCategory is required'
            }), 400
        
        if not goals:
            return jsonify({
                'error': 'Missing required field',
                'message': 'goals is required'
            }), 400
        
        # Validate BMI category
        valid_bmi = ['Underweight', 'Normal', 'Overweight', 'Obese']
        if bmi_category not in valid_bmi:
            return jsonify({
                'error': 'Invalid bmiCategory',
                'message': f'bmiCategory must be one of: {", ".join(valid_bmi)}'
            }), 400
        
        # Ensure health_issues is a list
        if not isinstance(health_issues, list):
            health_issues = [health_issues] if health_issues else []
        
        # Get predictions
        recommendations = recommender.predict_habits(
            bmi_category=bmi_category,
            health_issues=health_issues,
            goals=goals,
            top_k=top_k
        )
        
        return jsonify({
            'success': True,
            'data': {
                'recommendations': recommendations,
                'input': {
                    'bmiCategory': bmi_category,
                    'healthIssues': health_issues,
                    'goals': goals
                }
            }
        }), 200
        
    except ValueError as e:
        return jsonify({
            'error': 'Invalid input',
            'message': str(e)
        }), 400
        
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return jsonify({
            'error': 'Prediction failed',
            'message': str(e)
        }), 500

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get model metadata and performance metrics"""
    if recommender is None:
        return jsonify({
            'error': 'Model not loaded'
        }), 503
    
    try:
        info = recommender.get_model_info()
        return jsonify({
            'success': True,
            'data': info
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to get model info',
            'message': str(e)
        }), 500

@app.route('/', methods=['GET'])
def home():
    """Root endpoint"""
    return jsonify({
        'message': 'Habivance ML API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/health',
            'predict': '/predict (POST)',
            'model_info': '/model-info'
        }
    }), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Not found',
        'message': 'The requested endpoint does not exist'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal server error',
        'message': 'An unexpected error occurred'
    }), 500

if __name__ == '__main__':
    print("="*50)
    print("Habivance ML API Server")
    print("="*50)
    
    # Initialize recommender
    if initialize_recommender():
        print("\nStarting Flask server on http://localhost:5001")
        print("="*50)
        app.run(host='0.0.0.0', port=5001, debug=True)
    else:
        print("\n✗ Failed to start server. Please train the model first.")
        print("Run: python src/train.py")
        sys.exit(1)