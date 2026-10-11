import os
import json
import joblib
import numpy as np
import pandas as pd
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

@app.route('/api/sample-profiles', methods=['GET'])
def get_sample_profiles():
    """Returns preset realistic student profiles for testing and quick demonstrations."""
    samples = [
        {
            "id": "star",
            "name": "High Achiever (Top Tier)",
            "description": "Strong CGPA, multiple internships, high coding & communication scores",
            "data": {
                "cgpa": 8.9,
                "tenth_percentage": 92.5,
                "twelfth_percentage": 90.0,
                "backlogs": 0,
                "internships": 2,
                "projects": 3,
                "coding_score": 88.0,
                "communication_score": 85.0,
                "aptitude_score": 86.0,
                "attendance": 92.0
            }
        },
        {
            "id": "tech",
            "name": "Technical Whiz",
            "description": "Exceptional coding & projects, moderate academics, zero backlogs",
            "data": {
                "cgpa": 7.4,
                "tenth_percentage": 76.0,
                "twelfth_percentage": 74.5,
                "backlogs": 0,
                "internships": 1,
                "projects": 4,
                "coding_score": 92.0,
                "communication_score": 68.0,
                "aptitude_score": 75.0,
                "attendance": 84.0
            }
        },
        {
            "id": "borderline",
            "name": "Borderline / Moderate",
            "description": "Average CGPA, 1 backlog, good aptitude, needs coding improvement",
            "data": {
                "cgpa": 6.8,
                "tenth_percentage": 70.0,
                "twelfth_percentage": 68.0,
                "backlogs": 1,
                "internships": 1,
                "projects": 2,
                "coding_score": 58.0,
                "communication_score": 62.0,
                "aptitude_score": 66.0,
                "attendance": 76.0
            }
        },
        {
            "id": "at_risk",
            "name": "At-Risk Student",
            "description": "Multiple backlogs, low technical and communication scores",
            "data": {
                "cgpa": 5.6,
                "tenth_percentage": 62.0,
                "twelfth_percentage": 58.0,
                "backlogs": 3,
                "internships": 0,
                "projects": 1,
                "coding_score": 42.0,
                "communication_score": 48.0,
                "aptitude_score": 49.0,
                "attendance": 65.0
            }
        }
    ]
    return jsonify(samples), 200

@app.route('/api/confusion-matrix-image', methods=['GET'])
def get_confusion_matrix_image():
    """Serves the generated confusion matrix heatmap image."""
    img_path = os.path.join(MODELS_DIR, 'confusion_matrix.png')
    if os.path.exists(img_path):
        return send_file(img_path, mimetype='image/png')
    return jsonify({"error": "Confusion matrix image not found."}), 404

def generate_insights(data, is_placed, prob_placed):
    """Generates strengths, areas for improvement, and actionable tips based on student data."""
    strengths = []
    improvements = []
    actions = []

    # Academic Performance
    if data['cgpa'] >= 8.0:
        strengths.append(f"Strong CGPA ({data['cgpa']}/10) passes premium recruiter filters.")
    elif data['cgpa'] < 6.5:
        improvements.append(f"CGPA is currently {data['cgpa']}. Aim to raise it above 7.0 for wider eligibility.")
        actions.append("Focus on core semester coursework to elevate cumulative CGPA.")

    # Backlogs
    if data['backlogs'] == 0:
        strengths.append("Clean academic record with 0 active backlogs.")
    else:
        improvements.append(f"{data['backlogs']} active backlog(s) strictly disqualify or penalize in major campus drives.")
        actions.append("Clear all standing backlogs in the upcoming supplementary examination round.")

    # Coding & Projects
    if data['coding_score'] >= 75:
        strengths.append(f"Competitive coding score ({data['coding_score']}/100) indicates solid technical problem-solving.")
    else:
        improvements.append(f"Technical coding score ({data['coding_score']}/100) is below target threshold for product/service roles.")
        actions.append("Practice Data Structures & Algorithms daily on LeetCode/HackerRank to cross 75+.")

    if data['projects'] >= 3:
        strengths.append(f"Robust project portfolio with {data['projects']} implemented projects.")
    elif data['projects'] < 2:
        improvements.append("Limited project count. Employers prioritize demonstrable practical work.")
        actions.append("Build and deploy 1-2 full-stack or domain-specific projects to GitHub.")

    # Internships
    if data['internships'] >= 1:
        strengths.append(f"Industry exposure proven with {data['internships']} completed internship(s).")
    else:
        improvements.append("Zero industry internships completed.")
        actions.append("Apply for summer or virtual internships to gain verified practical experience.")

    # Soft skills & Aptitude
    if data['communication_score'] < 65:
        improvements.append("Communication score requires attention for HR and interview clearance.")
        actions.append("Engage in mock technical and HR interviews, debate clubs, or presentation sessions.")

    if data['aptitude_score'] < 65:
        improvements.append("Aptitude score is under standard placement screening cutoff (typically 65%+).")
        actions.append("Solve quantitative aptitude and logical reasoning mock tests weekly.")

    # Attendance
    if data['attendance'] < 75:
        improvements.append(f"Attendance is {data['attendance']}%, which may fail college placement criteria.")
        actions.append("Ensure classroom attendance stays strictly above 75%.")

    return {
        "strengths": strengths if strengths else ["Basic academic requirements met."],
        "improvements": improvements if improvements else ["Consistent across all evaluated metrics."],
        "actions": actions if actions else ["Maintain ongoing interview preparation and project maintenance."]
    }

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
        # Construct feature vector in DataFrame format matching training columns
        feature_df = pd.DataFrame([[cleaned_data[col] for col in features]], columns=features)
        
        # Scale features using the fitted training StandardScaler
        scaled_features = scaler.transform(feature_df)
        
        # Predict class and probability using the trained SVM (SVC)
        prediction_class = int(model.predict(scaled_features)[0])
        probabilities = model.predict_proba(scaled_features)[0]
        
        # probability of class 1 (Placed) vs class 0 (Not Placed)
        prob_placed = float(probabilities[1])
        prob_not_placed = float(probabilities[0])
        
        if prediction_class == 1:
            status = "Likely Placed"
            confidence = round(prob_placed * 100, 1)
        else:
            status = "Not Likely Placed"
            confidence = round(prob_not_placed * 100, 1)
            
        insights = generate_insights(cleaned_data, prediction_class, prob_placed)
            
        return jsonify({
            "prediction": prediction_class,
            "status": status,
            "confidence": confidence,
            "probabilities": {
                "placed": round(prob_placed * 100, 2),
                "not_placed": round(prob_not_placed * 100, 2)
            },
            "insights": insights
        }), 200
        
    except Exception as e:
        return jsonify({
            "error": f"Internal prediction error: {str(e)}"
        }), 500

if __name__ == '__main__':
    # Run Flask on port 5000 as required
    app.run(host='0.0.0.0', port=5000, debug=False)
