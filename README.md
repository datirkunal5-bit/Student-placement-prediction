# 🎓 EduPredict AI: Student Placement Prediction System

[![Algorithm](https://img.shields.io/badge/Algorithm-SVM%20(RBF%20Kernel)-blue.svg)](#)
[![Accuracy](https://img.shields.io/badge/Accuracy-81.25%25-brightgreen.svg)](#)
[![Recall](https://img.shields.io/badge/Recall-95.00%25-success.svg)](#)
[![Backend](https://img.shields.io/badge/Backend-Flask%20REST%20API-orange.svg)](#)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite%20%2B%20Tailwind-purple.svg)](#)
[![Course](https://img.shields.io/badge/Domain-Data%20Mining%20%26%20Data%20Warehousing%20(DMDW)-indigo.svg)](#)

EduPredict AI is a full-stack, machine learning application designed for campus placement prediction and student academic profiling. Using a non-linear **Support Vector Machine (SVC)** with a **Radial Basis Function (RBF)** kernel, the system classifies whether a student is likely to be placed based on multi-factorial academic, practical, and interview assessment metrics, while generating actionable recommendations for recruitment readiness.

---

## 🌟 Key Features

* **Interactive Placement Predictor & Calculator**:
  * Dual-control range sliders and numeric inputs for 10 evaluation features.
  * Instant probability gauge and calibrated confidence meter.
  * Placement status badge (*Likely to be Placed* vs *Not Likely Placed*).
  * Profile diagnostic engine generating personalized strengths, risk alerts, and targeted preparation steps.
* **Quick Benchmark Personas**:
  * One-click presets: *Top Tier Achiever (8.9 CGPA)*, *Tech Whiz (High DSA)*, *Borderline Candidate*, and *At-Risk Student*.
  * Persona comparison cards with direct pre-filling into the calculator.
* **Model Analytics & Evaluation Dashboard**:
  * Real-time metrics evaluated on an unseen stratified test partition ($N = 320$).
  * Interactive confusion matrix grid breakdown (TP, TN, FP, FN, Sensitivity, Specificity).
  * Server-rendered high-resolution Seaborn confusion matrix heatmap.
* **DMDW Methodology & Architecture**:
  * 6-step CRISP-DM lifecycle documentation.
  * Support Vector Machine RBF mathematical formulation: $K(x, x') = \exp(-\gamma ||x - x'||^2)$.
  * Empirical feature importance and weight analysis.

---

## 📊 Model Performance

Evaluated on 1,600 student instances using an 80/20 stratified split:

| Metric | Score | Key Takeaway |
| :--- | :---: | :--- |
| **Accuracy** | **81.25%** | Correctly predicts placement status on 81 out of 100 unseen candidates |
| **Recall (Sensitivity)** | **95.00%** | Captures 95% of all truly employable students (low false negatives) |
| **Precision** | **81.01%** | 81% of predicted placements are true positives |
| **F1-Score** | **87.45%** | High harmonic balance between precision and recall |

### Confusion Matrix ($N = 320$ Holdout Test Set)

| Actual \ Predicted | Predicted: Not Placed (0) | Predicted: Placed (1) |
| :--- | :---: | :---: |
| **Actual: Not Placed (0)** | **51** (TN) | **49** (FP) |
| **Actual: Placed (1)** | **11** (FN) | **209** (TP) |

---

## 🛠️ Tech Stack & Architecture

### Backend
* **Python 3.11** & **Flask** REST API with `Flask-CORS`
* **Scikit-Learn**: Support Vector Classifier (`SVC(kernel='rbf', C=1.5, gamma='scale', probability=True)`)
* **Data Processing**: Pandas, NumPy, StandardScaler (Z-Score normalization)
* **Visualization**: Matplotlib, Seaborn
* **Model Persistence**: Joblib

### Frontend
* **React 19** & **Vite 8**
* **Tailwind CSS v4** + Custom Glassmorphic Design Tokens
* **Lucide React** Icons
* **Google Fonts**: Plus Jakarta Sans & JetBrains Mono

---

## 📂 Project Structure

```
├── backend/
│   ├── app.py                     # Flask REST API endpoints & prediction logic
│   ├── train_model.py             # Model training, evaluation & asset exporter
│   ├── requirements.txt           # Python dependencies
│   ├── data/
│   │   ├── prepare_dataset.py     # Realistic placement dataset generator
│   │   └── student_placement_data.csv # 1,600 student dataset
│   └── models/
│       ├── svm_model.pkl          # Serialized SVM model
│       ├── scaler.pkl             # Fitted StandardScaler
│       ├── features.pkl           # Feature ordering
│       ├── metrics.json           # Performance metrics & dataset stats
│       └── confusion_matrix.png   # Seaborn heatmap visual plot
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Header & backend status monitor
│   │   │   ├── PredictionForm.jsx # Input controls & benchmark chips
│   │   │   ├── PredictionResult.jsx # Output gauge & action recommendations
│   │   │   ├── MetricsDashboard.jsx # KPI cards & Confusion matrix table
│   │   │   ├── MethodologyView.jsx # DMDW pipeline & SVM math concepts
│   │   │   └── BatchProfilesView.jsx # Curated student personas
│   │   ├── services/
│   │   │   └── api.js             # API service layer with fallback simulation
│   │   ├── App.jsx                # Main application coordinator
│   │   ├── index.css              # Glassmorphic UI styling
│   │   └── main.jsx               # Entry point
│   ├── package.json
│   └── vite.config.js
└── README.md                      # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
* Python 3.9+ installed
* Node.js 18+ and npm installed

### 1. Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# (Optional) Retrain model and regenerate dataset
python train_model.py

# Start Flask API server (runs on http://localhost:5000)
python app.py
```

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to explore the application!

---

## 📝 Features Evaluated in Model

1. **CGPA** (0.0 – 10.0): Overall academic degree average.
2. **10th Percentage** (0 – 100): Secondary school performance.
3. **12th Percentage** (0 – 100): Higher secondary / diploma performance.
4. **Active Backlogs** (Integer $\ge 0$): Active uncleared courses (heavily penalized by recruiters).
5. **Internships** (0 – 4): Industry practical experience count.
6. **Projects** (0 – 5): Practical application count.
7. **Coding / DSA Score** (0 – 100): Algorithmic problem-solving capability.
8. **Communication Score** (0 – 100): Behavioral, HR, and interview soft skills.
9. **Aptitude Score** (0 – 100): Quantitative, logical, and verbal screening test.
10. **Attendance** (0 – 100): College regularity and eligibility threshold.

---

## 📄 License
This project was developed for academic Data Mining & Data Warehousing (DMDW) study and demonstration purposes.
