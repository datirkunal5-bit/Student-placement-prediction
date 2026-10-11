import React from 'react';
import { 
  GraduationCap, 
  BarChart3, 
  BrainCircuit, 
  Users, 
  BookOpen, 
  Wifi, 
  WifiOff, 
  RefreshCw 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, backendStatus, onRefreshStatus }) {
  const tabs = [
    { id: 'predictor', label: 'Predictor & Calculator', icon: BrainCircuit },
    { id: 'metrics', label: 'Model Metrics & Matrix', icon: BarChart3 },
    { id: 'methodology', label: 'DMDW Methodology', icon: BookOpen },
    { id: 'personas', label: 'Student Personas', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Project Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('predictor')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25 border border-white/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">
                  EduPredict <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">AI</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  SVM Kernel
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Data Mining & Warehousing • Placement Analytics
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Backend Connection Status Pill */}
          <div className="flex items-center space-x-3">
            <div 
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                backendStatus.online
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              {backendStatus.online ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Backend Live (Port 5000)</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Simulated SVM Mode</span>
                </>
              )}
            </div>

            <button
              onClick={onRefreshStatus}
              title="Ping Backend API"
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/60 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/60">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-1 px-2 text-xs font-medium ${
                  isActive ? 'text-blue-400' : 'text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4 mb-1" />
                <span>{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
