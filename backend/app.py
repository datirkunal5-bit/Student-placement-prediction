import os
import json
import joblib
import numpy as np
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for all routes so React (localhost:5173) can communicate smoothly
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

# Global variables for model assets
model = None
scaler = None
features = None
metrics = None

def load_ml_assets():
    """Loads trained SVM model, scaler, feature ordering, and metrics from disk."""
    global model, scaler, features, metrics
    
    model_path = os.path.join(MODELS_DIR, 'svm_model.pkl')
    scaler_path = os.path.join(MODELS_DIR, 'scaler.pkl')
    features_path = os.path.join(MODELS_DIR, 'features.pkl')
    metrics_path = os.path.join(MODELS_DIR, 'metrics.json')
    
    if os.path.exists(model_path) and os.path.exists(scaler_path) and os.path.exists(features_path):
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        features = joblib.load(features_path)
        print("SVM model, scaler, and features successfully loaded.")
    else:
        print("Model assets not found. Please run train_model.py first.")
        
    if os.path.exists(metrics_path):
        with open(metrics_path, 'r') as f:
            metrics = json.load(f)
        print("Metrics successfully loaded.")
    else:
        print("Metrics JSON not found.")

# Attempt initial loading
load_ml_assets()

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        "message": "Student Placement Prediction API is running",
        "algorithm": "Support Vector Machine (SVM / SVC)",
        "status": "online"
    }), 200

@app.route('/api/model-metrics', methods=['GET'])
def get_model_metrics():
    """Returns actual trained model metrics, confusion matrix, and dataset statistics."""
    global metrics
    metrics_path = os.path.join(MODELS_DIR, 'metrics.json')
    if metrics is None and os.path.exists(metrics_path):
        with open(metrics_path, 'r') as f:
            metrics = json.load(f)
            
    if metrics is None:
        return jsonify({
            "error": "Model has not been trained yet. Please run train_model.py first."
        }), 404
        
    return jsonify(metrics), 200

@app.route('/api/confusion-matrix-image', methods=['GET'])
def get_confusion_matrix_image():
    """Serves the generated confusion matrix heatmap image."""
    img_path = os.path.join(MODELS_DIR, 'confusion_matrix.png')
    if os.path.exists(img_path):
        return send_file(img_path, mimetype='image/png')
    return jsonify({"error": "Confusion matrix image not found."}), 404

def validate_input_data(data):
    """
    Validates prediction input according to specified requirements:
    - CGPA: 0 to 10
    - 10th percentage: 0 to 100
    - 12th percentage: 0 to 100
    - Backlogs: 0 or greater (integer)
    - Internships: 0 or greater (integer)
    - Projects: 0 or greater (integer)
    - Coding score: 0 to 100
    - Communication score: 0 to 100
    - Aptitude score: 0 to 100
    - Attendance: 0 to 100
    """
    required_fields = [
        'cgpa', 'tenth_percentage', 'twelfth_percentage', 'backlogs',
        'internships', 'projects', 'coding_score', 'communication_score',
        'aptitude_score', 'attendance'
    ]
    
    if not isinstance(data, dict):
        return None, "Invalid JSON payload. Expected a JSON object."
        
    for field in required_fields:
        if field not in data:
            return None, f"Missing required field: '{field}'"
        if data[field] is None or data[field] == '':
            return None, f"Field '{field}' cannot be empty."

    # Validate CGPA
    try:
        cgpa = float(data['cgpa'])
        if not (0.0 <= cgpa <= 10.0):
            return None, "CGPA must be between 0 and 10"
    except (ValueError, TypeError):
        return None, "CGPA must be a valid number between 0 and 10"

    # Validate 10th percentage
    try:
        tenth = float(data['tenth_percentage'])
        if not (0.0 <= tenth <= 100.0):
            return None, "10th percentage must be between 0 and 100"
    except (ValueError, TypeError):
        return None, "10th percentage must be a valid number between 0 and 100"

    # Validate 12th percentage
    try:
        twelfth = float(data['twelfth_percentage'])
        if not (0.0 <= twelfth <= 100.0):
            return None, "12th percentage must be between 0 and 100"
    except (ValueError, TypeError):
        return None, "12th percentage must be a valid number between 0 and 100"

    # Validate Backlogs
    try:
        backlogs = int(data['backlogs'])
        if backlogs < 0:
            return None, "Number of backlogs must be 0 or greater"
    except (ValueError, TypeError):
        return None, "Number of backlogs must be a non-negative integer"

    # Validate Internships
    try:
        internships = int(data['internships'])
        if internships < 0:
            return None, "Number of internships must be 0 or greater"
    except (ValueError, TypeError):
        return None, "Number of internships must be a non-negative integer"

    # Validate Projects
    try:
        projects = int(data['projects'])
        if projects < 0:
            return None, "Number of projects must be 0 or greater"
    except (ValueError, TypeError):
        return None, "Number of projects must be a non-negative integer"

    # Validate Coding Score
    try:
        coding = float(data['coding_score'])
        if not (0.0 <= coding <= 100.0):
            return None, "Coding score must be between 0 and 100"
    except (ValueError, TypeError):
        return None, "Coding score must be a valid number between 0 and 100"

    # Validate Communication Score
    try:
        comm = float(data['communication_score'])
        if not (0.0 <= comm <= 100.0):
            return None, "Communication score must be between 0 and 100"
    except (ValueError, TypeError):
        return None, "Communication score must be a valid number between 0 and 100"

    # Validate Aptitude Score
    try:
        aptitude = float(data['aptitude_score'])
        if not (0.0 <= aptitude <= 100.0):
            return None, "Aptitude score must be between 0 and 100"
    except (ValueError, TypeError):
        return None, "Aptitude score must be a valid number between 0 and 100"

    # Validate Attendance
    try:
        attendance = float(data['attendance'])
        if not (0.0 <= attendance <= 100.0):
            return None, "Attendance must be between 0 and 100"
    except (ValueError, TypeError):
        return None, "Attendance must be a valid number between 0 and 100"

    cleaned_dict = {
        'cgpa': cgpa,
        'tenth_percentage': tenth,
        'twelfth_percentage': twelfth,
        'backlogs': backlogs,
        'internships': internships,
        'projects': projects,
        'coding_score': coding,
        'communication_score': comm,
        'aptitude_score': aptitude,
        'attendance': attendance
    }
    return cleaned_dict, None

@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Accepts student details JSON, scales features using saved StandardScaler,
    predicts placement status using trained SVM, calculates model probability,
    and returns prediction and confidence.
    """
    global model, scaler, features
    
    # Reload model assets if not loaded yet
    if model is None or scaler is None or features is None:
        load_ml_assets()
        
    if model is None or scaler is None or features is None:
        return jsonify({
            "error": "Trained model or scaler not found. Please run train_model.py first."
        }), 500
        
    try:
        data = request.get_json(silent=True)
    except Exception:
        return jsonify({"error": "Malformed JSON payload in request."}), 400
        
    if not data:
        return jsonify({"error": "No JSON payload provided."}), 400
        
    cleaned_data, error_msg = validate_input_data(data)
    if error_msg:
        return jsonify({"error": error_msg}), 400
        
    try:
        # Construct feature vector in the EXACT order saved during training
        feature_vector = [cleaned_data[col] for col in features]
        feature_array = np.array([feature_vector])
        
        # Scale features using the fitted training StandardScaler
        scaled_features = scaler.transform(feature_array)
        
        # Predict class and probability using the trained SVM (SVC)
        prediction_class = int(model.predict(scaled_features)[0])
        probabilities = model.predict_proba(scaled_features)[0]
        
        # probability of class 1 (Placed) vs class 0 (Not Placed)
        prob_placed = probabilities[1]
        prob_not_placed = probabilities[0]
        
        if prediction_class == 1:
            status = "Likely Placed"
            confidence = round(float(prob_placed) * 100, 1)
        else:
            status = "Not Likely Placed"
            confidence = round(float(prob_not_placed) * 100, 1)
            
        return jsonify({
            "prediction": prediction_class,
            "status": status,
            "confidence": confidence,
            "probabilities": {
                "placed": round(float(prob_placed) * 100, 2),
                "not_placed": round(float(prob_not_placed) * 100, 2)
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            "error": f"Internal prediction error: {str(e)}"
        }), 500

if __name__ == '__main__':
    # Run Flask on port 5000 as required
    app.run(host='0.0.0.0', port=5000, debug=False)
