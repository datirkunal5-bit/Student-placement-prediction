import React from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Shuffle, 
  GraduationCap, 
  Briefcase, 
  Code2, 
  CalendarCheck,
  AlertCircle
} from 'lucide-react';

export default function PredictionForm({
  formData,
  setFormData,
  onSubmit,
  loading,
  onSelectPreset,
  onRandomize,
  onReset
}) {
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const getScoreBadge = (score, high = 75, medium = 60) => {
    if (score >= high) return { label: 'High', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    if (score >= medium) return { label: 'Medium', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    return { label: 'Needs Focus', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
  };

  const getCgpaBadge = (cgpa) => {
    if (cgpa >= 8.5) return { label: 'Distinction', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    if (cgpa >= 7.0) return { label: 'First Class', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
    if (cgpa >= 6.0) return { label: 'Average', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    return { label: 'Below Cutoff', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
  };

  return (
    <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
      
      {/* Decorative gradient blur in corner */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Preset Personas Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Quick Benchmark Profiles
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onRandomize}
              className="text-xs text-slate-400 hover:text-blue-300 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-800/60"
              title="Randomize Values"
            >
              <Shuffle className="w-3 h-3" />
              <span>Random</span>
            </button>
            <button
              type="button"
              onClick={onReset}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-800/60"
              title="Reset to default"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'star', label: 'Top Tier (8.9 CGPA)', color: 'border-emerald-500/30 hover:border-emerald-500 bg-emerald-500/5' },
            { id: 'tech', label: 'Tech Whiz (High DSA)', color: 'border-cyan-500/30 hover:border-cyan-500 bg-cyan-500/5' },
            { id: 'borderline', label: 'Borderline Profile', color: 'border-amber-500/30 hover:border-amber-500 bg-amber-500/5' },
            { id: 'at_risk', label: 'At-Risk (3 Backlogs)', color: 'border-rose-500/30 hover:border-rose-500 bg-rose-500/5' },
          ].map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset.id)}
              className={`px-3 py-2 text-xs font-medium rounded-xl border text-slate-200 text-left transition-all ${preset.color}`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        
        {/* Section 1: Academic Scores */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/70 space-y-4">
          <div className="flex items-center space-x-2 text-sm font-semibold text-slate-200 pb-2 border-b border-slate-800/60">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span>Academic Performance</span>
          </div>

          {/* CGPA */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-300 font-medium">B.Tech / Degree CGPA (0 - 10)</span>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getCgpaBadge(formData.cgpa).color}`}>
                  {getCgpaBadge(formData.cgpa).label}
                </span>
                <span className="font-mono text-sm text-blue-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {Number(formData.cgpa).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-3 items-center">
              <input
                type="range"
                min="4.0"
                max="10.0"
                step="0.05"
                value={formData.cgpa}
                onChange={(e) => handleChange('cgpa', parseFloat(e.target.value))}
                className="col-span-9 sm:col-span-10 w-full"
              />
              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={formData.cgpa}
                onChange={(e) => handleChange('cgpa', parseFloat(e.target.value) || 0)}
                className="col-span-3 sm:col-span-2 text-right bg-slate-950 border border-slate-800 text-slate-100 rounded-lg px-2 py-1 text-xs font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 10th & 12th Percentages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* 10th Standard */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-300">10th Std Marks (%)</span>
                <span className="font-mono text-xs text-slate-200 font-semibold">{formData.tenth_percentage}%</span>
              </div>
              <input
                type="range"
                min="45"
                max="100"
                step="0.5"
                value={formData.tenth_percentage}
                onChange={(e) => handleChange('tenth_percentage', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* 12th Standard */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-300">12th / Diploma (%)</span>
                <span className="font-mono text-xs text-slate-200 font-semibold">{formData.twelfth_percentage}%</span>
              </div>
              <input
                type="range"
                min="45"
                max="100"
                step="0.5"
                value={formData.twelfth_percentage}
                onChange={(e) => handleChange('twelfth_percentage', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Experience & Projects */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/70 space-y-4">
          <div className="flex items-center space-x-2 text-sm font-semibold text-slate-200 pb-2 border-b border-slate-800/60">
            <Briefcase className="w-4 h-4 text-purple-400" />
            <span>Practical Experience & Projects</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Backlogs */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-300">Active Backlogs</span>
                <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                  formData.backlogs === 0 
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                    : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                }`}>
                  {formData.backlogs} {formData.backlogs === 0 ? 'Clear' : 'Live'}
                </span>
              </div>
              <div className="flex space-x-1.5">
                {[0, 1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleChange('backlogs', num)}
                    className={`flex-1 py-1 text-xs rounded font-medium border transition-colors ${
                      formData.backlogs === num
                        ? num === 0
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-rose-600 text-white border-rose-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {num === 4 ? '4+' : num}
                  </button>
                ))}
              </div>
            </div>

            {/* Internships */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-300">Internships</span>
                <span className="font-mono text-xs text-indigo-400 font-semibold">{formData.internships}</span>
              </div>
              <div className="flex space-x-1.5">
                {[0, 1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleChange('internships', num)}
                    className={`flex-1 py-1 text-xs rounded font-medium border transition-colors ${
                      formData.internships === num
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {num === 4 ? '4+' : num}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-300">Projects Done</span>
                <span className="font-mono text-xs text-purple-400 font-semibold">{formData.projects}</span>
              </div>
              <div className="flex space-x-1.5">
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleChange('projects', num)}
                    className={`flex-1 py-1 text-xs rounded font-medium border transition-colors ${
                      formData.projects === num
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {num === 5 ? '5+' : num}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Section 3: Assessment & Skill Scores */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/70 space-y-4">
          <div className="flex items-center space-x-2 text-sm font-semibold text-slate-200 pb-2 border-b border-slate-800/60">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>Recruitment Assessment Scores</span>
          </div>

          <div className="space-y-3.5">
            {/* Coding Score */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Coding & DSA Assessment</span>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getScoreBadge(formData.coding_score, 75, 60).color}`}>
                    {getScoreBadge(formData.coding_score, 75, 60).label}
                  </span>
                  <span className="font-mono text-xs text-cyan-400 font-bold">{formData.coding_score}/100</span>
                </div>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="1"
                value={formData.coding_score}
                onChange={(e) => handleChange('coding_score', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Aptitude Score */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Quantitative & Logical Aptitude</span>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getScoreBadge(formData.aptitude_score, 75, 60).color}`}>
                    {getScoreBadge(formData.aptitude_score, 75, 60).label}
                  </span>
                  <span className="font-mono text-xs text-blue-400 font-bold">{formData.aptitude_score}/100</span>
                </div>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="1"
                value={formData.aptitude_score}
                onChange={(e) => handleChange('aptitude_score', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Communication Score */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Communication & Soft Skills</span>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getScoreBadge(formData.communication_score, 75, 60).color}`}>
                    {getScoreBadge(formData.communication_score, 75, 60).label}
                  </span>
                  <span className="font-mono text-xs text-indigo-400 font-bold">{formData.communication_score}/100</span>
                </div>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="1"
                value={formData.communication_score}
                onChange={(e) => handleChange('communication_score', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Discipline & Attendance */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/70 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
            <div className="flex items-center space-x-2 text-sm font-semibold text-slate-200">
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
              <span>College Attendance</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                formData.attendance >= 75 
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                  : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
              }`}>
                {formData.attendance >= 75 ? 'Eligible (>=75%)' : 'Short Attendance'}
              </span>
              <span className="font-mono text-xs text-emerald-400 font-bold">{formData.attendance}%</span>
            </div>
          </div>

          <input
            type="range"
            min="50"
            max="100"
            step="0.5"
            value={formData.attendance}
            onChange={(e) => handleChange('attendance', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Submit Prediction CTA Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-xl font-bold text-white text-base shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Running Support Vector Machine Classifier...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-blue-200 animate-pulse" />
              <span>Run SVM Placement Prediction</span>
            </>
          )}
        </button>

      </form>

    </div>
  );
}
