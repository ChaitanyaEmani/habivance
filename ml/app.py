from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys

# ------------------------------------------------------------------
# Path setup
# ------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.join(BASE_DIR, 'src')
MODEL_DIR = os.path.join(BASE_DIR, 'models')

sys.path.append(SRC_DIR)

from predict import HabitRecommender

# ------------------------------------------------------------------
# Flask app
# ------------------------------------------------------------------
app = Flask(__name__)
CORS(app)

# ------------------------------------------------------------------
# Model initialization (RUNS ON GUNICORN START)
# ------------------------------------------------------------------
print("=" * 50)
print("Habivance ML API – Startup")
print("=" * 50)

print("BASE_DIR:", BASE_DIR)
print("MODEL_DIR:", MODEL_DIR)
print("Model dir exists:", os.path.exists(MODEL_DIR))

if os.path.exists(MODEL_DIR):
    print("Files in model dir:", os.listdir(MODEL_DIR))

try:
    recommender = HabitRecommender(MODEL_DIR)
    print("✓ Habit Recommender initialized successfully!")
except Exception as e:
    recommender = None
    print("✗ Failed to initialize Habit Recommender")
    print("ERROR:", str(e))

print("=" * 50)

# ------------------------------------------------------------------
# Routes
# ------------------------------------------------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Habivance ML API",
        "version": "1.0.0",
        "model_loaded": recommender is not None,
        "endpoints": {
            "health": "/health",
            "predict": "/predict (POST)",
            "model_info": "/model-info"
        }
    }), 200


@app.route("/health", methods=["GET"])
def health():
    if recommender is None:
        return jsonify({
            "status": "error",
            "message": "Model not loaded"
        }), 503

    return jsonify({
        "status": "healthy",
        "model_loaded": True
    }), 200


@app.route("/predict", methods=["POST"])
def predict():
    if recommender is None:
        return jsonify({
            "error": "Model not loaded"
        }), 503

    data = request.get_json()
    if not data:
        return jsonify({
            "error": "Invalid JSON body"
        }), 400

    bmi_category = data.get("bmiCategory")
    health_issues = data.get("healthIssues", [])
    goals = data.get("goals")
    top_k = data.get("topK", 5)

    if not bmi_category or not goals:
        return jsonify({
            "error": "bmiCategory and goals are required"
        }), 400

    valid_bmi = ["underweight", "normal", "overweight", "obese"]
    if bmi_category not in valid_bmi:
        return jsonify({
            "error": f"bmiCategory must be one of {valid_bmi}"
        }), 400

    if not isinstance(health_issues, list):
        health_issues = [health_issues]

    try:
        recommendations = recommender.predict_habits(
            bmi_category=bmi_category,
            health_issues=health_issues,
            goals=goals,
            top_k=top_k
        )

        return jsonify({
            "success": True,
            "data": {
                "recommendations": recommendations
            }
        }), 200

    except Exception as e:
        print("Prediction error:", str(e))
        return jsonify({
            "error": "Prediction failed",
            "message": str(e)
        }), 500


@app.route("/model-info", methods=["GET"])
def model_info():
    if recommender is None:
        return jsonify({
            "error": "Model not loaded"
        }), 503

    try:
        info = recommender.get_model_info()
        return jsonify({
            "success": True,
            "data": info
        }), 200
    except Exception as e:
        return jsonify({
            "error": "Failed to get model info",
            "message": str(e)
        }), 500
