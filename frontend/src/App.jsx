import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PredictionForm from './components/PredictionForm';
import PredictionResult from './components/PredictionResult';
import MetricsDashboard from './components/MetricsDashboard';
import MethodologyView from './components/MethodologyView';
import BatchProfilesView from './components/BatchProfilesView';
import { checkBackendStatus, requestPrediction, fetchSampleProfiles } from './services/api';
import { GraduationCap, ShieldCheck } from 'lucide-react';

const INITIAL_FORM_DATA = {
  cgpa: 7.8,
  tenth_percentage: 82.0,
  twelfth_percentage: 80.0,
  backlogs: 0,
  internships: 1,
  projects: 3,
  coding_score: 78.0,
  communication_score: 72.0,
  aptitude_score: 75.0,
  attendance: 86.0
};

export default function App() {
  const [activeTab, setActiveTab] = useState('predictor');
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ online: false, checked: false });
  const [sampleProfiles, setSampleProfiles] = useState([]);

  // Check backend health and pre-run initial prediction
  useEffect(() => {
    async function init() {
      const status = await checkBackendStatus();
      setBackendStatus({ online: status.online, checked: true });
      
      const profiles = await fetchSampleProfiles();
      setSampleProfiles(profiles);

      // Perform initial prediction so the user immediately sees a live result
      try {
        const initialResult = await requestPrediction(INITIAL_FORM_DATA);
        setPredictionResult(initialResult);
      } catch (err) {
        console.error("Initial prediction error:", err);
      }
    }
    init();
  }, []);

  const handleRefreshStatus = async () => {
    const status = await checkBackendStatus();
    setBackendStatus({ online: status.online, checked: true });
  };

  const handleSubmitPrediction = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    try {
      const res = await requestPrediction(formData);
      setPredictionResult(res);
    } catch (err) {
      console.error("Prediction failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = async (presetId) => {
    let selectedData = null;
    if (sampleProfiles && sampleProfiles.length) {
      const match = sampleProfiles.find((p) => p.id === presetId);
      if (match) selectedData = match.data;
    }

    if (!selectedData) {
      if (presetId === 'star') {
        selectedData = {
          cgpa: 8.9,
          tenth_percentage: 92.5,
          twelfth_percentage: 90.0,
          backlogs: 0,
          internships: 2,
          projects: 3,
          coding_score: 88.0,
          communication_score: 85.0,
          aptitude_score: 86.0,
          attendance: 92.0
        };
      } else if (presetId === 'tech') {
        selectedData = {
          cgpa: 7.4,
          tenth_percentage: 76.0,
          twelfth_percentage: 74.5,
          backlogs: 0,
          internships: 1,
          projects: 4,
          coding_score: 92.0,
          communication_score: 68.0,
          aptitude_score: 75.0,
          attendance: 84.0
        };
      } else if (presetId === 'borderline') {
        selectedData = {
          cgpa: 6.8,
          tenth_percentage: 70.0,
          twelfth_percentage: 68.0,
          backlogs: 1,
          internships: 1,
          projects: 2,
          coding_score: 58.0,
          communication_score: 62.0,
          aptitude_score: 66.0,
          attendance: 76.0
        };
      } else {
        selectedData = {
          cgpa: 5.6,
          tenth_percentage: 62.0,
          twelfth_percentage: 58.0,
          backlogs: 3,
          internships: 0,
          projects: 1,
          coding_score: 42.0,
          communication_score: 48.0,
          aptitude_score: 49.0,
          attendance: 65.0
        };
      }
    }

    setFormData(selectedData);
    setLoading(true);
    try {
      const res = await requestPrediction(selectedData);
      setPredictionResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadPersonaProfile = async (personaData) => {
    setFormData(personaData);
    setActiveTab('predictor');
    setLoading(true);
    try {
      const res = await requestPrediction(personaData);
      setPredictionResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomize = async () => {
    const randomCgpa = parseFloat((5.5 + Math.random() * 4.2).toFixed(2));
    const randomData = {
      cgpa: randomCgpa,
      tenth_percentage: parseFloat((60 + Math.random() * 38).toFixed(1)),
      twelfth_percentage: parseFloat((58 + Math.random() * 38).toFixed(1)),
      backlogs: Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0,
      internships: Math.floor(Math.random() * 3),
      projects: Math.floor(Math.random() * 5) + 1,
      coding_score: parseFloat((35 + Math.random() * 63).toFixed(1)),
      communication_score: parseFloat((45 + Math.random() * 50).toFixed(1)),
      aptitude_score: parseFloat((45 + Math.random() * 50).toFixed(1)),
      attendance: parseFloat((68 + Math.random() * 30).toFixed(1))
    };

    setFormData(randomData);
    setLoading(true);
    try {
      const res = await requestPrediction(randomData);
      setPredictionResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setFormData(INITIAL_FORM_DATA);
    setLoading(true);
    try {
      const res = await requestPrediction(INITIAL_FORM_DATA);
      setPredictionResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex flex-col selection:bg-blue-500/30 selection:text-white">
      
      {/* Navbar with tabs and live backend status */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        backendStatus={backendStatus}
        onRefreshStatus={handleRefreshStatus}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Tab 1: Predictor & Calculator */}
        {activeTab === 'predictor' && (
          <div className="space-y-6">
            
            {/* Page Header */}
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Support Vector Machine (SVM) Classification Engine</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Student Placement Predictor
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-3xl">
                Tune the academic scores, technical capabilities, and internship background to evaluate placement odds computed through non-linear Support Vector Machine hyperplane separation.
              </p>
            </div>

            {/* Split Grid: Form (Left) & Result (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Input Form (7 cols) */}
              <div className="lg:col-span-7">
                <PredictionForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmitPrediction}
                  loading={loading}
                  onSelectPreset={handleSelectPreset}
                  onRandomize={handleRandomize}
                  onReset={handleReset}
                />
              </div>

              {/* Right Column: Prediction Result (5 cols) */}
              <div className="lg:col-span-5 sticky top-24">
                <PredictionResult
                  result={predictionResult}
                  formData={formData}
                  onSelectPreset={handleSelectPreset}
                />
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Model Performance & Metrics */}
        {activeTab === 'metrics' && <MetricsDashboard />}

        {/* Tab 3: DMDW Methodology & Math */}
        {activeTab === 'methodology' && <MethodologyView />}

        {/* Tab 4: Student Personas & Benchmarks */}
        {activeTab === 'personas' && (
          <BatchProfilesView onSelectProfile={handleLoadPersonaProfile} />
        )}

      </main>

      {/* Modern Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-xs text-slate-500 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-slate-300">EduPredict AI</span>
            <span>•</span>
            <span>Data Mining & Data Warehousing (DMDW)</span>
          </div>

          <div className="flex items-center space-x-6 text-slate-400">
            <span>Algorithm: Support Vector Machine (SVC - RBF)</span>
            <span>StandardScaler Z-Score Normalization</span>
            <span>Port 5000 API</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
