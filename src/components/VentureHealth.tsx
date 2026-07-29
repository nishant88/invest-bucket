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

  // SVG Gauge calculations
  const gaugeAngle = (healthData.score / 100) * 180 - 180; // range from -180 to 0 degrees

  // Copy Stakeholder Summary to clipboard
  const handleCopySummary = () => {
    navigator.clipboard.writeText(healthData.stakeholderSummary);
    alert("Stakeholder summary copied to clipboard!");
  };

  return (
    <div className="space-y-stack-gap text-left pb-10 animate-fade-in">
      
      {/* 1. Header Overview Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Main Score Glassmorphic Card */}
        <div className="bg-white/70 backdrop-blur-[20px] rounded-[32px] p-6 border border-white/40 card-shadow flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-28 h-28 bg-[#fae403]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute left-0 bottom-0 w-24 h-24 bg-[#b2ee4a]/10 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Business Analytics</span>
            <h3 className="font-display font-extrabold text-[24px] text-[#0d1c32] mt-1">Venture Health Score</h3>
            
            <div className="flex items-baseline gap-1 mt-4">
              <span className="text-[52px] font-black text-[#0d1c32] tracking-tight leading-none">
                {healthData.score}
              </span>
              <span className="text-[16px] font-bold text-slate-400">/ 100</span>
            </div>

            {/* Health pill */}
            <div className="flex items-center gap-1.5 mt-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-body-xs font-black border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}>
                <span className={`w-2 h-2 rounded-full ${statusColors.dot} animate-pulse`} />
                {healthData.statusLabel}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">
                Confidence: <strong className="text-[#0d1c32]">{healthData.confidence}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Prediction probability card */}
        <div className="bg-[#0d1c32] text-white rounded-[32px] p-6 card-shadow flex items-center gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-[#fae403]/15 rounded-full blur-3xl pointer-events-none" />
          
          {/* SVG Dial Chart */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="56" cy="56" r="48" stroke="rgba(255,255,255,0.06)" strokeWidth="8" fill="transparent" />
              <circle 
                cx="56" 
                cy="56" 
                r="48" 
                stroke="#fae403" 
                strokeWidth="8" 
                fill="transparent"
                strokeDasharray={2 * Math.PI * 48}
                strokeDashoffset={2 * Math.PI * 48 * (1 - healthData.successProbability / 100)}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute text-center select-none">
              <span className="text-[20px] font-black text-white leading-none">{healthData.successProbability}%</span>
              <span className="block text-[8px] text-white/60 font-bold uppercase tracking-wider mt-0.5">Prob.</span>
            </div>
          </div>

          <div className="space-y-2 text-left">
            <h4 className="text-[15px] font-extrabold text-[#fae403] uppercase tracking-wide">Success Prediction</h4>
            <p className="text-[11px] text-white/80 leading-normal max-w-[90%]">
              Based on active ledger variables, the probability of reaching milestone targets without liquidity default holds at <strong className="text-white">{healthData.successProbability}%</strong>.
            </p>
            <div className="text-[10px] text-[#b2ee4a] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">timeline</span>
              Est. Complete: {healthData.predictions.estCompletionDays} Days
            </div>
          </div>
        </div>
      </section>

      {/* 2. Visualizations Panel */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SVG Health Gauge dial */}
        <div className="bg-white rounded-[28px] p-5 card-shadow border border-outline-variant/40 space-y-4">
          <h4 className="font-label-md text-label-md text-slate-500 uppercase tracking-wider">Health Dial Gauge</h4>
          
          <div className="relative flex flex-col items-center py-4">
            <div className="relative w-48 h-24 overflow-hidden flex items-end">
              {/* Semicircle track */}
              <svg className="w-48 h-48 absolute bottom-0 left-0">
                <circle cx="96" cy="96" r="84" stroke="#f1f5f9" strokeWidth="16" strokeDasharray="264 264" strokeDashoffset="0" fill="transparent" strokeLinecap="round" />
                <circle cx="96" cy="96" r="84" stroke={healthData.status === 'Green' ? '#10b981' : healthData.status === 'Amber' ? '#f59e0b' : '#f43f5e'} strokeWidth="16" strokeDasharray="264 264" strokeDashoffset={264 - (264 * (healthData.score / 100))} fill="transparent" strokeLinecap="round" />
              </svg>

              {/* Semicircle needle */}
              <div 
                className="absolute bottom-0 left-1/2 w-2 h-20 bg-[#0d1c32] origin-bottom -translate-x-1/2 transition-all duration-1000 rounded-t-full"
                style={{ transform: `translateX(-50%) rotate(${gaugeAngle}deg)` }}
              />
              {/* Semicircle needle center pin */}
              <div className="absolute bottom-0 left-1/2 w-5 h-5 bg-[#0d1c32] rounded-full border-4 border-white -translate-x-1/2 translate-y-2.5 z-10" />
            </div>

            <div className="text-center mt-5">
              <span className="text-[28px] font-black text-[#0d1c32]">{healthData.score}</span>
              <span className="text-[13px] font-bold text-slate-500 block">Current Core Health Score</span>
            </div>
          </div>
        </div>

        {/* Risk Heat Map */}
        <div className="bg-white rounded-[28px] p-5 card-shadow border border-outline-variant/40 space-y-4">
          <h4 className="font-label-md text-label-md text-slate-500 uppercase tracking-wider">Risk Severity Heat Map</h4>
          
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-2xl border border-outline-variant/20 flex flex-col justify-between min-h-[75px]">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Financial Splits</span>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] font-extrabold text-[#0d1c32]">Variance Range</span>
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md uppercase">Low Risk</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl border border-outline-variant/20 flex flex-col justify-between min-h-[75px]">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Disputes</span>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] font-extrabold text-[#0d1c32]">{healthData.disputesCount} Active</span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase border ${
                  healthData.disputesCount === 0 ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-600 bg-rose-50 border-rose-100'
                }`}>
                  {healthData.disputesCount === 0 ? 'None' : 'High Risk'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl border border-outline-variant/20 flex flex-col justify-between min-h-[75px]">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Overruns</span>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] font-extrabold text-[#0d1c32]">{healthData.overbudgetMilestonesCount} Overrun</span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase border ${
                  healthData.overbudgetMilestonesCount === 0 ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-amber-600 bg-amber-50 border-amber-100'
                }`}>
                  {healthData.overbudgetMilestonesCount === 0 ? 'Low Risk' : 'Medium Risk'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl border border-outline-variant/20 flex flex-col justify-between min-h-[75px]">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Phase Locks</span>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] font-extrabold text-[#0d1c32]">
                  {healthData.completedMilestonesCount} / {healthData.totalMilestonesCount} Locked
                </span>
                <span className="text-[9px] font-black text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md uppercase">Medium Risk</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AI Insights Card (Interactive slider/ticker) */}
      <section className="bg-[#ecf3e3] rounded-[28px] p-5 border border-outline-variant/30 text-[#0d1c32] relative overflow-hidden flex flex-col justify-between min-h-[140px]">
        <div className="absolute right-3 top-3 select-none">
          <span className="material-symbols-outlined text-[#0d1c32]/20 text-[56px] pointer-events-none">insights</span>
        </div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-emerald-700">stars</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-800">AI Intelligence Insight</span>
          </div>

          <p className="text-[13px] font-extrabold leading-relaxed pr-8 min-h-[44px] flex items-center">
            {healthData.insights[activeInsightIndex]}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#0d1c32]/10 mt-2">
          <span className="text-[9px] font-bold text-[#0d1c32]/60">
            Card {activeInsightIndex + 1} of {healthData.insights.length}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveInsightIndex(prev => (prev - 1 + healthData.insights.length) % healthData.insights.length)}
              className="w-7 h-7 bg-white rounded-full flex items-center justify-center border border-black/10 active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>
            <button 
              onClick={() => setActiveInsightIndex(prev => (prev + 1) % healthData.insights.length)}
              className="w-7 h-7 bg-white rounded-full flex items-center justify-center border border-black/10 active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Action Recommendations Grid */}
      <section className="bg-white rounded-[28px] p-5 card-shadow border border-outline-variant/40 space-y-5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[24px]">recommend</span>
          <h4 className="font-label-md text-label-md text-slate-500 uppercase tracking-wider">Smart Action Recommendations</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Financial Rec */}
          <div className="p-4 bg-surface rounded-2xl border border-outline-variant/20 space-y-2">
            <div className="flex items-center gap-1.5 text-primary">
              <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
              <h5 className="font-display font-extrabold text-[12px] uppercase tracking-wide">Financial Controls</h5>
            </div>
            <ul className="space-y-1.5 pl-5 list-disc text-[11px] font-semibold text-slate-600">
              {healthData.recommendations.financial.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>

          {/* Execution Rec */}
          <div className="p-4 bg-surface rounded-2xl border border-outline-variant/20 space-y-2">
            <div className="flex items-center gap-1.5 text-primary">
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              <h5 className="font-display font-extrabold text-[12px] uppercase tracking-wide">Milestone Execution</h5>
            </div>
            <ul className="space-y-1.5 pl-5 list-disc text-[11px] font-semibold text-slate-600">
              {healthData.recommendations.execution.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>

          {/* Collaboration Rec */}
          <div className="p-4 bg-surface rounded-2xl border border-outline-variant/20 space-y-2">
            <div className="flex items-center gap-1.5 text-primary">
              <span className="material-symbols-outlined text-[18px]">handshake</span>
              <h5 className="font-display font-extrabold text-[12px] uppercase tracking-wide">Founder Alignment</h5>
            </div>
            <ul className="space-y-1.5 pl-5 list-disc text-[11px] font-semibold text-slate-600">
              {healthData.recommendations.collaboration.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>

          {/* Goals Rec */}
          <div className="p-4 bg-surface rounded-2xl border border-outline-variant/20 space-y-2">
            <div className="flex items-center gap-1.5 text-primary">
              <span className="material-symbols-outlined text-[18px]">crisis_line</span>
              <h5 className="font-display font-extrabold text-[12px] uppercase tracking-wide">Roadmap Goals</h5>
            </div>
            <ul className="space-y-1.5 pl-5 list-disc text-[11px] font-semibold text-slate-600">
              {healthData.recommendations.goals.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Stakeholder Summary */}
      <section className="bg-white rounded-[28px] p-5 card-shadow border border-outline-variant/40 space-y-3.5 relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0d1c32] text-[22px]">assignment</span>
            <h4 className="font-display font-extrabold text-[13px] text-[#0d1c32] uppercase tracking-wide">Stakeholder Executive Summary</h4>
          </div>
          <button 
            onClick={handleCopySummary}
            className="flex items-center gap-1 bg-surface border border-outline-variant/30 rounded-xl px-2.5 py-1 text-[10px] font-black text-[#0d1c32] hover:bg-slate-50 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[14px]">content_copy</span>
            Copy
          </button>
        </div>

        <blockquote className="bg-slate-50 rounded-2xl p-4 text-[11px] font-semibold text-slate-600 border-l-4 border-[#0d1c32] leading-relaxed italic text-left">
          "{healthData.stakeholderSummary}"
        </blockquote>
      </section>

      {/* 6. Predictions Forecast list */}
      <section className="bg-white rounded-[28px] p-5 card-shadow border border-outline-variant/40 space-y-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">auto_graph</span>
          <h4 className="font-label-md text-label-md text-slate-500 uppercase tracking-wider">Predictive Future Risks & Timeline</h4>
        </div>

        <div className="divide-y divide-outline-variant/20">
          <div className="flex justify-between py-3">
            <span className="text-[11px] font-bold text-slate-500">Timeline On-Time Milestones Probability</span>
            <span className="text-[12px] font-black text-[#0d1c32]">{healthData.predictions.milestonesOnTimeProb}%</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-[11px] font-bold text-slate-500">Financial stability index</span>
            <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded-full ${
              healthData.predictions.financialStability === 'Stable' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}>
              {healthData.predictions.financialStability}
            </span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-[11px] font-bold text-slate-500">Overall success projection forecast</span>
            <span className="text-[12px] font-black text-emerald-600">{healthData.predictions.forecastedSuccessPercent}% Success</span>
          </div>
          <div className="flex justify-between py-3 flex-col gap-2">
            <span className="text-[11px] font-bold text-slate-500">Immediate Risk Indicators identified</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {healthData.predictions.keyRisks.map((k, i) => (
                <span key={i} className="text-[9px] font-black text-[#ba1a1a] bg-rose-50 border border-rose-100 rounded-md px-2 py-1 flex items-center gap-1 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
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
