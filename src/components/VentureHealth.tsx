import React, { useState } from 'react';
import { useBucket } from '../context/BucketContext';
import { calculateVentureHealth } from '../utils/calculations';

export const VentureHealth: React.FC = () => {
  const { partners, expenses, drawings, milestones } = useBucket();
  
  // Calculate health metrics dynamically
  const healthData = React.useMemo(() => {
    return calculateVentureHealth(partners, expenses, drawings, milestones);
  }, [partners, expenses, drawings, milestones]);

  const [activeInsightIndex, setActiveInsightIndex] = useState(0);

  const getStatusColor = (status: 'Green' | 'Amber' | 'Red') => {
    if (status === 'Green') return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', dot: 'bg-emerald-500' };
    if (status === 'Amber') return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', dot: 'bg-amber-500' };
    return { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', dot: 'bg-rose-500' };
  };

  const statusColors = getStatusColor(healthData.status);

  // SVG Gauge needle calculations
  const gaugeAngle = (healthData.score / 100) * 180 - 180; // range from -180 to 0 degrees

  // Copy Stakeholder Summary to clipboard
  const handleCopySummary = () => {
    navigator.clipboard.writeText(healthData.stakeholderSummary);
    alert("Stakeholder summary copied to clipboard!");
  };

  return (
    <div className="space-y-4 text-left pb-12 animate-fade-in text-[#0d1c32]">
      
      {/* 1. Header Overview Cards */}
      <section className="grid grid-cols-1 gap-3.5">
        {/* Main Score Glassmorphic Card */}
        <div className="bg-white/70 backdrop-blur-[20px] rounded-[24px] p-4.5 border border-white/40 card-shadow relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 top-0 w-24 h-24 bg-[#fae403]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Venture Analytics</span>
            <h3 className="font-display font-extrabold text-[14px] text-[#0d1c32] tracking-tight mt-0.5">Core Health Score</h3>
            
            <div className="flex items-baseline gap-0.5 mt-3">
              <span className="text-[38px] font-black text-[#0d1c32] tracking-tight leading-none">
                {healthData.score}
              </span>
              <span className="text-[12px] font-bold text-slate-400">/ 100</span>
            </div>

            {/* Health pill */}
            <div className="flex items-center gap-2 mt-3.5">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[8.5px] font-black border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusColors.dot} animate-pulse`} />
                {healthData.statusLabel.toUpperCase()}
              </span>
              <span className="text-[9.5px] text-slate-500 font-semibold">
                Confidence: <strong className="text-[#0d1c32]">{healthData.confidence}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Prediction probability card */}
        <div className="bg-[#0d1c32] text-white rounded-[24px] p-4.5 card-shadow flex items-center gap-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-[#fae403]/10 rounded-full blur-2xl pointer-events-none" />
          
          {/* Compact SVG Dial Chart */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.06)" strokeWidth="5.5" fill="transparent" />
              <circle 
                cx="32" 
                cy="32" 
                r="26" 
                stroke="#fae403" 
                strokeWidth="5.5" 
                fill="transparent"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 * (1 - healthData.successProbability / 100)}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute text-center select-none">
              <span className="text-[12.5px] font-black text-white leading-none">{healthData.successProbability}%</span>
              <span className="block text-[7px] text-white/60 font-bold uppercase tracking-wider mt-0.5">Success</span>
            </div>
          </div>

          <div className="space-y-1.5 text-left flex-1 min-w-0">
            <h4 className="text-[12px] font-extrabold text-[#fae403] uppercase tracking-wide">Success Probability</h4>
            <p className="text-[10px] text-white/80 leading-snug">
              Estimated success outlook currently stands at <strong className="text-white">{healthData.successProbability}%</strong> based on ledger progress.
            </p>
            <div className="text-[9px] text-[#b2ee4a] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">schedule</span>
              Est. Completion: {healthData.predictions.estCompletionDays} Days
            </div>
          </div>
        </div>
      </section>

      {/* 2. Visualizations Panel */}
      <section className="grid grid-cols-1 gap-3.5">
        {/* SVG Health Gauge dial */}
        <div className="bg-white rounded-[24px] p-4.5 card-shadow border border-outline-variant/30 space-y-3.5">
          <h4 className="font-display font-bold text-[11px] text-slate-500 uppercase tracking-wider">Health dial Indicator</h4>
          
          <div className="relative flex flex-col items-center py-2">
            <div className="relative w-36 h-18 overflow-hidden flex items-end">
              {/* Semicircle track */}
              <svg className="w-36 h-36 absolute bottom-0 left-0">
                <circle cx="72" cy="72" r="62" stroke="#f1f5f9" strokeWidth="12" strokeDasharray="195 195" strokeDashoffset="0" fill="transparent" strokeLinecap="round" />
                <circle cx="72" cy="72" r="62" stroke={healthData.status === 'Green' ? '#10b981' : healthData.status === 'Amber' ? '#f59e0b' : '#f43f5e'} strokeWidth="12" strokeDasharray="195 195" strokeDashoffset={195 - (195 * (healthData.score / 100))} fill="transparent" strokeLinecap="round" />
              </svg>

              {/* Semicircle needle */}
              <div 
                className="absolute bottom-0 left-1/2 w-1.5 h-14 bg-[#0d1c32] origin-bottom -translate-x-1/2 transition-all duration-1000 rounded-t-full"
                style={{ transform: `translateX(-50%) rotate(${gaugeAngle}deg)` }}
              />
              {/* Need pin */}
              <div className="absolute bottom-0 left-1/2 w-4.5 h-4.5 bg-[#0d1c32] rounded-full border-4 border-white -translate-x-1/2 translate-y-2 z-10" />
            </div>

            <div className="text-center mt-3.5">
              <span className="text-[20px] font-black text-[#0d1c32]">{healthData.score}</span>
              <span className="text-[10px] font-bold text-slate-500 block mt-0.5">Core Success Score</span>
            </div>
          </div>
        </div>

        {/* Risk Indicators List (Replaces squeezed grid Heat Map) */}
        <div className="bg-white rounded-[24px] p-4.5 card-shadow border border-outline-variant/30 space-y-3.5">
          <h4 className="font-display font-bold text-[11px] text-slate-500 uppercase tracking-wider">Risk Roster Summary</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2.5 bg-slate-50/60 rounded-xl border border-outline-variant/15 text-[10.5px]">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px]">Financial Splits</span>
              <span className="text-[#0d1c32] font-black">Low Split Variance</span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-slate-50/60 rounded-xl border border-outline-variant/15 text-[10.5px]">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px]">Disputes Count</span>
              <span className={`font-black px-2 py-0.5 rounded-md ${
                healthData.disputesCount === 0 ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-rose-700 bg-rose-50 border border-rose-100'
              }`}>
                {healthData.disputesCount} Active
              </span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-slate-50/60 rounded-xl border border-outline-variant/15 text-[10.5px]">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px]">Milestone Overruns</span>
              <span className={`font-black px-2 py-0.5 rounded-md ${
                healthData.overbudgetMilestonesCount === 0 ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-amber-700 bg-amber-50 border border-amber-100'
              }`}>
                {healthData.overbudgetMilestonesCount} Overrun
              </span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-slate-50/60 rounded-xl border border-outline-variant/15 text-[10.5px]">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px]">Phase Budget Locks</span>
              <span className="text-[#0d1c32] font-black">
                {healthData.completedMilestonesCount} / {healthData.totalMilestonesCount} Phases
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AI Insights Card (Responsive height auto-grow) */}
      <section className="bg-[#ecf3e3] rounded-[24px] p-4.5 border border-outline-variant/30 text-[#0d1c32] relative overflow-hidden flex flex-col justify-between">
        <div className="absolute right-3 top-3 select-none">
          <span className="material-symbols-outlined text-[#0d1c32]/10 text-[48px] pointer-events-none">insights</span>
        </div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-emerald-800">stars</span>
            <span className="text-[8.5px] font-black uppercase tracking-widest text-emerald-800">AI Analytics Insights</span>
          </div>

          <p className="text-[11px] font-bold leading-normal pr-8 min-h-[36px] flex items-center">
            {healthData.insights[activeInsightIndex]}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#0d1c32]/10 mt-3 relative z-10">
          <span className="text-[8.5px] font-bold text-[#0d1c32]/60">
            Card {activeInsightIndex + 1} of {healthData.insights.length}
          </span>
          <div className="flex gap-1.5">
            <button 
              onClick={() => setActiveInsightIndex(prev => (prev - 1 + healthData.insights.length) % healthData.insights.length)}
              className="w-6.5 h-6.5 bg-white rounded-full flex items-center justify-center border border-black/10 active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined text-[14px]">chevron_left</span>
            </button>
            <button 
              onClick={() => setActiveInsightIndex(prev => (prev + 1) % healthData.insights.length)}
              className="w-6.5 h-6.5 bg-white rounded-full flex items-center justify-center border border-black/10 active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Action Recommendations Grid */}
      <section className="bg-white rounded-[24px] p-4.5 card-shadow border border-outline-variant/30 space-y-3.5">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-[20px]">recommend</span>
          <h4 className="font-display font-bold text-[11px] text-slate-500 uppercase tracking-wider">Recommendations</h4>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {/* Financial Rec */}
          <div className="p-3 bg-surface rounded-xl border border-outline-variant/15 space-y-1.5">
            <div className="flex items-center gap-1.5 text-primary">
              <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
              <h5 className="font-display font-extrabold text-[10.5px] uppercase tracking-wide">Financial Controls</h5>
            </div>
            <ul className="space-y-1 pl-4.5 list-disc text-[10.5px] font-medium text-slate-600 leading-normal">
              {healthData.recommendations.financial.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>

          {/* Execution Rec */}
          <div className="p-3 bg-surface rounded-xl border border-outline-variant/15 space-y-1.5">
            <div className="flex items-center gap-1.5 text-primary">
              <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
              <h5 className="font-display font-extrabold text-[10.5px] uppercase tracking-wide">Milestone Execution</h5>
            </div>
            <ul className="space-y-1 pl-4.5 list-disc text-[10.5px] font-medium text-slate-600 leading-normal">
              {healthData.recommendations.execution.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>

          {/* Collaboration Rec */}
          <div className="p-3 bg-surface rounded-xl border border-outline-variant/15 space-y-1.5">
            <div className="flex items-center gap-1.5 text-primary">
              <span className="material-symbols-outlined text-[16px]">handshake</span>
              <h5 className="font-display font-extrabold text-[10.5px] uppercase tracking-wide">Founder Alignment</h5>
            </div>
            <ul className="space-y-1 pl-4.5 list-disc text-[10.5px] font-medium text-slate-600 leading-normal">
              {healthData.recommendations.collaboration.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>

          {/* Goals Rec */}
          <div className="p-3 bg-surface rounded-xl border border-outline-variant/15 space-y-1.5">
            <div className="flex items-center gap-1.5 text-primary">
              <span className="material-symbols-outlined text-[16px]">crisis_line</span>
              <h5 className="font-display font-extrabold text-[10.5px] uppercase tracking-wide">Roadmap Goals</h5>
            </div>
            <ul className="space-y-1 pl-4.5 list-disc text-[10.5px] font-medium text-slate-600 leading-normal">
              {healthData.recommendations.goals.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Stakeholder Summary */}
      <section className="bg-white rounded-[24px] p-4.5 card-shadow border border-outline-variant/30 space-y-3 relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#0d1c32] text-[18px]">assignment</span>
            <h4 className="font-display font-bold text-[11px] text-slate-500 uppercase tracking-wider">Executive Summary</h4>
          </div>
          <button 
            onClick={handleCopySummary}
            className="flex items-center gap-1 bg-surface border border-outline-variant/20 rounded-lg px-2 py-0.5 text-[9px] font-black text-[#0d1c32] hover:bg-slate-50 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[13px]">content_copy</span>
            Copy
          </button>
        </div>

        <blockquote className="bg-slate-50 rounded-xl p-3 text-[10.5px] font-semibold text-slate-600 border-l-3 border-[#0d1c32] leading-relaxed italic text-left">
          "{healthData.stakeholderSummary}"
        </blockquote>
      </section>

      {/* 6. Predictions Forecast list */}
      <section className="bg-white rounded-[24px] p-4.5 card-shadow border border-outline-variant/30 space-y-3.5">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-[20px]">auto_graph</span>
          <h4 className="font-display font-bold text-[11px] text-slate-500 uppercase tracking-wider">Predictive Future Timeline</h4>
        </div>

        <div className="divide-y divide-outline-variant/15 text-[10.5px] font-semibold text-slate-600">
          <div className="flex justify-between py-2.5">
            <span>On-Time Milestone Probability</span>
            <span className="text-[#0d1c32] font-black">{healthData.predictions.milestonesOnTimeProb}%</span>
          </div>
          <div className="flex justify-between py-2.5 items-center">
            <span>Financial Stability Index</span>
            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
              healthData.predictions.financialStability === 'Stable' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}>
              {healthData.predictions.financialStability}
            </span>
          </div>
          <div className="flex justify-between py-2.5">
            <span>Venture Success Projection</span>
            <span className="text-emerald-600 font-black">{healthData.predictions.forecastedSuccessPercent}% Success</span>
          </div>
          <div className="flex justify-between py-2.5 flex-col gap-2">
            <span>Timeline Risk Indicators</span>
            <div className="flex flex-wrap gap-1.5">
              {healthData.predictions.keyRisks.map((k, i) => (
                <span key={i} className="text-[8.5px] font-black text-[#ba1a1a] bg-rose-50 border border-rose-100 rounded-md px-2 py-0.5 flex items-center gap-1 select-none">
                  <span className="w-1 h-1 rounded-full bg-rose-500" />
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
