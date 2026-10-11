import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Target, 
  Award,
  ArrowRight,
  ShieldCheck,
  Brain
} from 'lucide-react';

export default function PredictionResult({ result, formData, onSelectPreset }) {
  if (!result) {
    return (
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center h-full min-h-[480px]">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30 mb-5 animate-pulse">
          <Brain className="w-10 h-10 text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          Ready for SVM Classification
        </h3>
        <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
          Adjust the student's academic credentials, technical assessments, and interview parameters on the left, then click <strong className="text-blue-300">Run SVM Prediction</strong> to compute calibrated placement odds.
        </p>

        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          <button
            type="button"
            onClick={() => onSelectPreset('star')}
            className="p-3 text-xs rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 text-slate-300 text-left transition-all"
          >
            <div className="font-semibold text-emerald-400 mb-0.5">Test Top Achiever</div>
            <div className="text-[11px] text-slate-500">8.9 CGPA, 2 Internships</div>
          </button>
          <button
            type="button"
            onClick={() => onSelectPreset('at_risk')}
            className="p-3 text-xs rounded-xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/50 text-slate-300 text-left transition-all"
          >
            <div className="font-semibold text-rose-400 mb-0.5">Test At-Risk Profile</div>
            <div className="text-[11px] text-slate-500">5.6 CGPA, 3 Backlogs</div>
          </button>
        </div>
      </div>
    );
  }

  const isPlaced = result.prediction === 1;
  const placedPercent = result.probabilities?.placed ?? (isPlaced ? result.confidence : 100 - result.confidence);
  const notPlacedPercent = result.probabilities?.not_placed ?? (100 - placedPercent);
  const insights = result.insights || { strengths: [], improvements: [], actions: [] };

  return (
    <div className="space-y-6">
      
      {/* Primary Result Banner Card */}
      <div 
        className={`glass-panel-elevated p-6 sm:p-7 rounded-2xl border transition-all relative overflow-hidden ${
          isPlaced 
            ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/30 via-slate-900/80 to-slate-950/90 shadow-emerald-950/40' 
            : 'border-rose-500/40 bg-gradient-to-b from-rose-950/30 via-slate-900/80 to-slate-950/90 shadow-rose-950/40'
        }`}
      >
        {/* Glow orb background */}
        <div 
          className={`absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
            isPlaced ? 'bg-emerald-500/20' : 'bg-rose-500/20'
          }`} 
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center space-x-4">
            <div 
              className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg ${
                isPlaced 
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-emerald-500/20' 
                  : 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-rose-500/20'
              }`}
            >
              {isPlaced ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                  isPlaced 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}>
                  SVM Prediction
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {result.confidence}% Confidence
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {isPlaced ? 'Likely to be Placed' : 'Not Likely Placed'}
              </h2>
            </div>
          </div>

          {/* Probability Gauge Pill */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-medium">Placement Probability</span>
            <span className={`text-3xl font-black font-mono ${isPlaced ? 'text-emerald-400' : 'text-rose-400'}`}>
              {placedPercent}%
            </span>
          </div>
        </div>

        {/* Probability Breakdown Bar */}
        <div className="pt-5 space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              Placed: {placedPercent}%
            </span>
            <span className="text-rose-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-400 inline-block"></span>
              Not Placed: {notPlacedPercent}%
            </span>
          </div>
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 flex">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-l-full transition-all duration-700"
              style={{ width: `${placedPercent}%` }}
            />
            <div 
              className="h-full bg-gradient-to-r from-rose-500 to-orange-500 rounded-r-full transition-all duration-700"
              style={{ width: `${notPlacedPercent}%` }}
            />
          </div>
        </div>

        {/* Key Metrics Snapshot Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-5">
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400">CGPA</div>
            <div className="text-sm font-bold text-slate-200 font-mono">{formData.cgpa}</div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400">Backlogs</div>
            <div className={`text-sm font-bold font-mono ${formData.backlogs === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formData.backlogs}
            </div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400">Coding Score</div>
            <div className="text-sm font-bold text-cyan-400 font-mono">{formData.coding_score}/100</div>
          </div>
          <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[11px] text-slate-400">Internships</div>
            <div className="text-sm font-bold text-indigo-400 font-mono">{formData.internships}</div>
          </div>
        </div>

      </div>

      {/* Profile Strengths & Achievements */}
      {insights.strengths && insights.strengths.length > 0 && (
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/10">
          <div className="flex items-center space-x-2 text-sm font-bold text-emerald-400 mb-3">
            <Award className="w-4 h-4" />
            <span>Profile Strengths & Positive Indicators</span>
          </div>
          <ul className="space-y-2">
            {insights.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Critical Areas for Improvement */}
      {insights.improvements && insights.improvements.length > 0 && (
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 bg-amber-950/10">
          <div className="flex items-center space-x-2 text-sm font-bold text-amber-400 mb-3">
            <AlertTriangle className="w-4 h-4" />
            <span>Areas for Profile Improvement</span>
          </div>
          <ul className="space-y-2">
            {insights.improvements.map((imp, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Targeted Campus Drive Preparation Recommendations */}
      {insights.actions && insights.actions.length > 0 && (
        <div className="glass-panel p-5 rounded-2xl border border-blue-500/20 bg-blue-950/10">
          <div className="flex items-center space-x-2 text-sm font-bold text-blue-400 mb-3">
            <Lightbulb className="w-4 h-4" />
            <span>Actionable Next Steps for Placement Readiness</span>
          </div>
          <ul className="space-y-2.5">
            {insights.actions.map((act, idx) => (
              <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-200">
                <ArrowRight className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Algorithm Disclaimer note */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center space-x-2">
        <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
        <span>
          Classification produced by non-linear Support Vector Machine (SVC) trained on 1,600 verified student records using standard RBF kernel mapping.
        </span>
      </div>

    </div>
  );
}
