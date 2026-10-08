import os
import json
import joblib
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

def train_and_evaluate():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(backend_dir, 'data')
    models_dir = os.path.join(backend_dir, 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    csv_path = os.path.join(data_dir, 'student_placement_data.csv')
    if not os.path.exists(csv_path):
        print(f"Dataset not found at {csv_path}. Generating realistic dataset...")
        import sys
        sys.path.append(data_dir)
        from prepare_dataset import generate_placement_dataset
        df_gen = generate_placement_dataset(n_samples=1600, random_state=42)
        df_gen.to_csv(csv_path, index=False)
        print("Dataset generated successfully.")
    
    print("Loading dataset...")
    df = pd.read_csv(csv_path)
    print(f"Dataset shape: {df.shape}")
    
    # 1. Data Cleaning
    initial_len = len(df)
    df = df.drop_duplicates()
    if len(df) < initial_len:
        print(f"Removed {initial_len - len(df)} duplicate records.")
    
    # Handle missing values if any
    missing_count = df.isnull().sum().sum()
    if missing_count > 0:
        print(f"Handling {missing_count} missing values...")
        df = df.dropna()
    
    feature_columns = [
        'cgpa',
        'tenth_percentage',
        'twelfth_percentage',
        'backlogs',
        'internships',
        'projects',
        'coding_score',
        'communication_score',
        'aptitude_score',
        'attendance'
    ]
    target_column = 'placement_status'
    
    print("Features:")
    print("- CGPA")
    print("- 10th Percentage")
    print("- 12th Percentage")
    print("- Backlogs")
    print("- Internships")
    print("- Projects")
    print("- Coding Score")
    print("- Communication Score")
    print("- Aptitude Score")
    print("- Attendance")
    
    X = df[feature_columns]
    y = df[target_column]
    
    # 2. Train/Test Split (Prevent Data Leakage)
    print("Splitting dataset...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    # 3. Scaling Features (Scaler is fitted ONLY on training data)
    print("Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # 4. Training SVM Model (ONLY Support Vector Machine - SVC with RBF kernel and probability=True)
    print("Training SVM...")
    svm_model = SVC(kernel="rbf", probability=True, C=1.5, gamma="scale", random_state=42)
    svm_model.fit(X_train_scaled, y_train)
    
    # 5. Model Evaluation on Unseen Test Data
    y_pred = svm_model.predict(X_test_scaled)
    
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred))
    rec = float(recall_score(y_test, y_pred))
    f1 = float(f1_score(y_test, y_pred))
    cm = confusion_matrix(y_test, y_pred)
    
    tn, fp, fn, tp = cm.ravel()
    
    print("\nModel Evaluation")
    print("----------------")
    print(f"Accuracy: {acc:.4f} ({acc*100:.2f}%)")
    print(f"Precision: {prec:.4f}")
    print(f"Recall: {rec:.4f}")
    print(f"F1 Score: {f1:.4f}")
    print("Confusion Matrix:")
    print(cm)
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=["Not Placed", "Placed"]))
    
    # 6. Save Confusion Matrix Visualization
    cm_img_path = os.path.join(models_dir, 'confusion_matrix.png')
    plt.figure(figsize=(6, 5))
    sns.heatmap(
        cm,
        annot=True,
        fmt='d',
        cmap='Blues',
        xticklabels=['Predicted: Not Placed', 'Predicted: Placed'],
        yticklabels=['Actual: Not Placed', 'Actual: Placed'],
        annot_kws={"size": 14}
    )
    plt.title('SVM Placement Classification Confusion Matrix', fontsize=12, fontweight='bold', pad=12)
    plt.ylabel('Actual Outcome', fontsize=11)
    plt.xlabel('Predicted Outcome', fontsize=11)
    plt.tight_layout()
    plt.savefig(cm_img_path, dpi=300)
    plt.close()
    print(f"Confusion matrix plot saved at: {cm_img_path}")
    
    # 7. Save Metrics JSON
    metrics = {
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "confusion_matrix": {
            "tn": int(tn),
            "fp": int(fp),
            "fn": int(fn),
            "tp": int(tp)
        },
        "dataset_info": {
            "dataset_name": "Student Placement Dataset",
            "total_records": int(len(df)),
            "train_records": int(len(X_train)),
            "test_records": int(len(X_test)),
            "num_features": len(feature_columns),
            "features": feature_columns,
            "target_variable": target_column,
            "train_ratio": "80%",
            "test_ratio": "20%",
            "algorithm": "Support Vector Machine (SVC - RBF Kernel)"
        }
    }
    
    metrics_path = os.path.join(models_dir, 'metrics.json')
    with open(metrics_path, 'w') as f:
        json.dump(metrics, f, indent=4)
    
    # 8. Save Model, Scaler, and Feature Order using Joblib
    model_path = os.path.join(models_dir, 'svm_model.pkl')
    scaler_path = os.path.join(models_dir, 'scaler.pkl')
    features_path = os.path.join(models_dir, 'features.pkl')
    
    print("Saving model...")
    joblib.dump(svm_model, model_path)
    
    print("Saving scaler...")
    joblib.dump(scaler, scaler_path)
    
    print("Saving feature order...")
    joblib.dump(feature_columns, features_path)
    
    print("Saving metrics...")
    print(f"Metrics saved to {metrics_path}")
    print("Training completed successfully.")

if __name__ == '__main__':
    train_and_evaluate()
