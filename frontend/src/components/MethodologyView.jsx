import React from 'react';
import { 
  BookOpen, 
  Binary, 
  Workflow, 
  GitMerge, 
  ShieldCheck, 
  Sliders, 
  Cpu, 
  BrainCircuit 
} from 'lucide-react';

export default function MethodologyView() {
  const steps = [
    {
      step: '01',
      title: 'Data Collection & Synthesis',
      description: 'Generates 1,600 statistically representative student academic and recruitment profiles across 10 distinct continuous and discrete variables, modeling realistic real-world college recruitment distributions.',
      icon: DatabaseIcon
    },
    {
      step: '02',
      title: 'Data Cleaning & Preprocessing',
      description: 'Deduplication, schema normalization, outlier containment via statistical clipping, and validation against realistic academic boundaries (CGPA [0-10], percentages [0-100]).',
      icon: Workflow
    },
    {
      step: '03',
      title: 'Stratified Train/Test Splitting',
      description: '80% training set (1,280 samples) and 20% holdout test set (320 samples). Stratified sampling ensures identical placed/unplaced ratio across splits to eliminate selection bias.',
      icon: GitMerge
    },
    {
      step: '04',
      title: 'Feature Standardization (Z-Score)',
      description: 'StandardScaler scales each feature to zero mean and unit variance (z = (x - μ) / σ). The scaler is fitted strictly on the training partition to prevent data leakage.',
      icon: Sliders
    },
    {
      step: '05',
      title: 'SVM Model Training (RBF Kernel)',
      description: 'Employs Support Vector Classifier (SVC) using Radial Basis Function (RBF) kernel mapping inputs into infinite-dimensional Hilbert space to find the optimal maximum-margin separating hyperplane.',
      icon: BrainCircuit
    },
    {
      step: '06',
      title: 'Probability Calibration & Insights',
      description: 'Platt scaling converts SVM decision distance into well-calibrated probabilities. Dynamic heuristic rules produce personalized guidance for students.',
      icon: ShieldCheck
    }
  ];

  function DatabaseIcon(props) {
    return <Binary {...props} />;
  }

  return (
    <div className="space-y-8">
      
      {/* Overview Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 bg-gradient-to-r from-blue-950/20 via-slate-900/60 to-purple-950/20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Data Mining & Data Warehousing (DMDW) Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Machine Learning Pipeline & Theoretical Foundations
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            This project applies core Data Mining principles — from data preprocessing and normalization to maximum-margin classification via non-linear Support Vector Machines — to predict student campus placement outcomes.
          </p>
        </div>
      </div>

      {/* 6 Step Pipeline Cards */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Workflow className="w-5 h-5 text-indigo-400" />
          End-to-End CRISP-DM Methodology
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.step} 
                className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Step {item.step}
                    </span>
                    <Icon className="w-5 h-5 text-slate-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mathematical Formulation of SVM RBF Kernel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Math & Kernel Box */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            Support Vector Machine Formulation
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Support Vector Machines identify the optimal hyperplane that maximizes the margin separating the two classes (<code className="text-blue-300">Placed</code> vs <code className="text-rose-300">Not Placed</code>). Because placement criteria are inherently non-linear, we apply the <strong>Radial Basis Function (RBF) Kernel</strong>:
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center font-mono text-sm text-blue-400 shadow-inner">
            K(x, x') = exp(-γ · ||x - x'||²)
          </div>

          <ul className="space-y-2 text-xs text-slate-400">
            <li>• <strong className="text-slate-200">γ (gamma = 'scale'):</strong> Computes inverse variance <code className="text-blue-300">1 / (n_features · Var(X))</code>, adapting the Gaussian kernel bandwidth to normalized inputs.</li>
            <li>• <strong className="text-slate-200">C = 1.5:</strong> Regularization parameter balancing margin width against training classification margin violations.</li>
            <li>• <strong className="text-slate-200">Support Vectors:</strong> Critical subset of borderline student samples determining the orientation and position of the separation boundary.</li>
          </ul>
        </div>

        {/* Feature Importance & Weight Analysis */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            Empirical Feature Influence & Weighting
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            Data mining analysis of campus recruitment trends establishes the following hierarchy of feature impacts:
          </p>

          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Coding & Problem Solving Score</span>
                <span className="font-mono text-cyan-400 font-bold">~30% Impact</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Degree CGPA (Academic Benchmark)</span>
                <span className="font-mono text-blue-400 font-bold">~25% Impact</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Active Backlogs (Disqualification Penalty)</span>
                <span className="font-mono text-rose-400 font-bold">High Negative Weight</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '90%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Internships & Real-World Projects</span>
                <span className="font-mono text-purple-400 font-bold">~20% Impact</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Aptitude, Communication & Attendance</span>
                <span className="font-mono text-emerald-400 font-bold">~15% Impact</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '50%' }} />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
