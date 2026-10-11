import React, { useEffect, useState } from 'react';
import { 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Award, 
  AlertTriangle, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { fetchSampleProfiles } from '../services/api';

export default function BatchProfilesView({ onSelectProfile }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfiles() {
      setLoading(true);
      const data = await fetchSampleProfiles();
      setProfiles(data);
      setLoading(false);
    }
    loadProfiles();
  }, []);

  if (loading) {
    return (
      <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading representative student personas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            Curated Student Personas & Benchmarks
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Explore diverse candidate profiles to observe how the SVM hyperplane separates different combinations of academics, technical skills, and backlog counts.
          </p>
        </div>
      </div>

      {/* Profile Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profiles.map((p) => {
          const d = p.data;
          const isHighAchiever = p.id === 'star';
          const isTech = p.id === 'tech';
          const isAtRisk = p.id === 'at_risk';

          return (
            <div 
              key={p.id}
              className={`glass-panel p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                isHighAchiever 
                  ? 'border-emerald-500/30 hover:border-emerald-500/60 bg-gradient-to-br from-emerald-950/20 to-slate-900/60' 
                  : isAtRisk
                  ? 'border-rose-500/30 hover:border-rose-500/60 bg-gradient-to-br from-rose-950/20 to-slate-900/60'
                  : 'border-slate-800 hover:border-blue-500/40 bg-slate-900/40'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{p.description}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border ${
                    isAtRisk
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {isAtRisk ? 'Unlikely Placed' : 'Likely Placed'}
                  </span>
                </div>

                {/* Attributes Grid */}
                <div className="grid grid-cols-3 gap-2.5 my-4 text-xs">
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">CGPA</span>
                    <span className="font-bold font-mono text-white text-sm">{d.cgpa}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">Coding Score</span>
                    <span className="font-bold font-mono text-cyan-400 text-sm">{d.coding_score}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">Backlogs</span>
                    <span className={`font-bold font-mono text-sm ${d.backlogs === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {d.backlogs}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">Internships</span>
                    <span className="font-bold font-mono text-indigo-400 text-sm">{d.internships}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">Projects</span>
                    <span className="font-bold font-mono text-purple-400 text-sm">{d.projects}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">Attendance</span>
                    <span className="font-bold font-mono text-emerald-400 text-sm">{d.attendance}%</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onSelectProfile(p.data)}
                className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-blue-600 transition-all flex items-center justify-center space-x-2 border border-slate-700/80 hover:border-blue-500 cursor-pointer"
              >
                <span>Load Profile into Predictor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
