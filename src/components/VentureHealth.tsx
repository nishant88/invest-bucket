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
  const gaugeAngle = (healthData.score / 100) * 180 - 180;

  // Copy Stakeholder Summary to clipboard
  const handleCopySummary = () => {
    navigator.clipboard.writeText(healthData.stakeholderSummary);
    alert("Stakeholder summary copied to clipboard!");
  };

  return (
    <div className="space-y-5 text-left pb-16 animate-fade-in text-[#0d1c32] select-none w-full">
      
      {/* SECTION 1: Core Health Indicators Stack */}
      <section className="space-y-4">
        {/* Card 1: Venture Health Score */}
        <div className="bg-white rounded-[24px] p-6 card-shadow border border-outline-variant/30 relative overflow-hidden w-full h-44 flex flex-col justify-between">
          <div className="absolute right-0 top-0 w-28 h-28 bg-[#fae403]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Health Diagnostics</span>
              <h3 className="font-display font-extrabold text-[16px] text-[#0d1c32] mt-1">Core Venture Health Score</h3>
              
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-[44px] font-black text-[#0d1c32] tracking-tight leading-none">{healthData.score}</span>
                <span className="text-[14px] font-bold text-slate-400">/ 100</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2.5">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusColors.dot} animate-pulse`} />
                {healthData.statusLabel.toUpperCase()}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">
                Confidence: <strong className="text-[#0d1c32]">{healthData.confidence}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Success Probability Dial */}
        <div className="bg-[#0d1c32] text-white rounded-[24px] p-6 card-shadow border border-white/5 flex items-center justify-between relative overflow-hidden w-full h-44">
          <div className="absolute right-0 top-0 w-32 h-32 bg-[#fae403]/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 text-left flex-1 min-w-0 pr-6">
            <h4 className="text-[13px] font-extrabold text-[#fae403] uppercase tracking-wide">Success Probability</h4>
            <p className="text-[11px] text-white/80 leading-relaxed">
              Based on active ledger transactions, the success forecast remains positive at <strong className="text-white">{healthData.successProbability}%</strong>.
            </p>
            <div className="text-[9.5px] text-[#b2ee4a] font-bold flex items-center gap-1 mt-1.5">
              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
              Project Completion Target: {healthData.predictions.estCompletionDays} Days
            </div>
          </div>

          {/* SVG Progress Ring */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center bg-white/5 rounded-full">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.06)" strokeWidth="5" fill="transparent" />
              <circle 
                cx="32" 
                cy="32" 
                r="26" 
                stroke="#fae403" 
                strokeWidth="5" 
                fill="transparent"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 * (1 - healthData.successProbability / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center select-none">
              <span className="text-[13.5px] font-black text-white leading-none">{healthData.successProbability}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Analytics Gauges Stack */}
      <section className="space-y-4">
        {/* Card 1: Health Dial Gauge */}
        <div className="bg-white rounded-[24px] p-6 card-shadow border border-outline-variant/30 flex flex-col justify-between w-full h-52">
          <h4 className="font-display font-bold text-[11px] text-slate-500 uppercase tracking-wider block mb-2">Venture Health Gauge Dial</h4>
          
          <div className="relative flex flex-col items-center justify-center flex-1">
            <div className="relative w-40 h-20 overflow-hidden flex items-end">
              <svg className="w-40 h-40 absolute bottom-0 left-0">
                <circle cx="80" cy="80" r="68" stroke="#f1f5f9" strokeWidth="12" strokeDasharray="214 214" strokeDashoffset="0" fill="transparent" strokeLinecap="round" />
                <circle cx="80" cy="80" r="68" stroke={healthData.status === 'Green' ? '#10b981' : healthData.status === 'Amber' ? '#f59e0b' : '#f43f5e'} strokeWidth="12" strokeDasharray="214 214" strokeDashoffset={214 - (214 * (healthData.score / 100))} fill="transparent" strokeLinecap="round" />
              </svg>
              <div 
                className="absolute bottom-0 left-1/2 w-1.5 h-16 bg-[#0d1c32] origin-bottom -translate-x-1/2 transition-all duration-1000 rounded-t-full"
                style={{ transform: `translateX(-50%) rotate(${gaugeAngle}deg)` }}
              />
              <div className="absolute bottom-0 left-1/2 w-3.5 h-3.5 bg-[#0d1c32] rounded-full border-2 border-white -translate-x-1/2 translate-y-1.5 z-10" />
            </div>
          </div>

          <div className="text-center mt-2">
            <span className="text-[10px] font-bold text-slate-500 block leading-tight">Stability Index Score: <strong className="text-[#0d1c32] font-black">{healthData.score}</strong></span>
          </div>
        </div>

        {/* Card 2: Risk Severity Table */}
        <div className="bg-white rounded-[24px] p-6 card-shadow border border-outline-variant/30 w-full h-56 flex flex-col justify-between">
          <h4 className="font-display font-bold text-[11px] text-slate-500 uppercase tracking-wider block">Risk Severity Table</h4>
          
          <div className="grid grid-cols-2 gap-3 mt-3 flex-1">
            <div className="p-3.5 rounded-2xl border border-outline-variant/20 flex flex-col justify-between bg-slate-50/60 h-20">
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider leading-none">Financial Splits</span>
              <span className="text-[11px] font-extrabold text-[#0d1c32] uppercase mt-2">Low Variance</span>
            </div>

            <div className="p-3.5 rounded-2xl border border-outline-variant/20 flex flex-col justify-between bg-slate-50/60 h-20">
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider leading-none">Dispute Count</span>
              <span className={`text-[9.5px] font-black px-2.5 py-0.5 rounded-md inline-block w-fit uppercase mt-2 ${
                healthData.disputesCount === 0 ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
              }`}>
                {healthData.disputesCount === 0 ? 'None' : `${healthData.disputesCount} Active`}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl border border-outline-variant/20 flex flex-col justify-between bg-slate-50/60 h-20">
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider leading-none">Budget Overruns</span>
              <span className={`text-[9.5px] font-black px-2.5 py-0.5 rounded-md inline-block w-fit uppercase mt-2 ${
                healthData.overbudgetMilestonesCount === 0 ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
              }`}>
                {healthData.overbudgetMilestonesCount === 0 ? 'Low Risk' : `${healthData.overbudgetMilestonesCount} Overrun`}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl border border-outline-variant/20 flex flex-col justify-between bg-slate-50/60 h-20">
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider leading-none">Phase Locks</span>
              <span className="text-[11px] font-black text-[#0d1c32] uppercase mt-2">
                {healthData.completedMilestonesCount} / {healthData.totalMilestonesCount} Locked
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: AI Executive Center Stack */}
      <section className="space-y-4">
        {/* Card 1: AI Insight Card */}
        <div className="bg-[#ecf3e3] rounded-[24px] p-6 border border-outline-variant/30 text-[#0d1c32] relative overflow-hidden flex flex-col justify-between w-full min-h-[160px]">
          <div className="absolute right-4 top-4 select-none pointer-events-none opacity-20">
            <span className="material-symbols-outlined text-[#0d1c32] text-[54px]">insights</span>
          </div>

          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-1.5 text-emerald-800">
              <span className="material-symbols-outlined text-[16px]">stars</span>
              <span className="text-[9px] font-black uppercase tracking-wider">AI Intelligence Insights</span>
            </div>
            <p className="text-[12.5px] font-bold leading-relaxed text-[#0d1c32]/90 mt-2.5 pr-12 min-h-[48px] flex items-center">
              {healthData.insights[activeInsightIndex]}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-[#0d1c32]/10 pt-3 mt-4 relative z-10">
            <span className="text-[9px] font-bold text-[#0d1c32]/50">
              Card {activeInsightIndex + 1} of {healthData.insights.length}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveInsightIndex(prev => (prev - 1 + healthData.insights.length) % healthData.insights.length)}
                className="w-7 h-7 bg-white rounded-full flex items-center justify-center border border-black/5 active:scale-90 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[14px]">chevron_left</span>
              </button>
              <button 
                onClick={() => setActiveInsightIndex(prev => (prev + 1) % healthData.insights.length)}
                className="w-7 h-7 bg-white rounded-full flex items-center justify-center border border-black/5 active:scale-90 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Stakeholder Summary */}
        <div className="bg-white rounded-[24px] p-6 card-shadow border border-outline-variant/30 flex flex-col justify-between w-full min-h-[180px]">
          <div className="flex justify-between items-center pb-2 border-b border-outline-variant/25">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Stakeholder Executive Briefing</span>
            <button 
              onClick={handleCopySummary}
              className="flex items-center gap-1 bg-surface border border-outline-variant/20 rounded-xl px-2.5 py-1 text-[9px] font-black text-[#0d1c32] hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[12px]">content_copy</span>
              Copy Summary
            </button>
          </div>

          <blockquote className="text-[11.5px] font-semibold text-slate-600 leading-relaxed italic text-left mt-3 flex-1 overflow-y-auto max-h-28">
            "{healthData.stakeholderSummary}"
          </blockquote>
        </div>
      </section>

      {/* SECTION 4: Strategic Recommendations Stack */}
      <section className="bg-white rounded-[24px] p-6 card-shadow border border-outline-variant/30 space-y-4 w-full">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">recommend</span>
          <h4 className="font-display font-bold text-[11px] text-slate-500 uppercase tracking-wider">Action Recommendations</h4>
        </div>

        <div className="space-y-4">
          {/* Card 1: Financial Controls */}
          <div className="p-4 bg-surface rounded-2xl border border-outline-variant/15 space-y-2 flex flex-col justify-between min-h-28">
            <div className="flex items-center gap-1.5 text-primary">
              <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
              <h5 className="font-display font-extrabold text-[12px] uppercase tracking-wide">Financial Controls</h5>
            </div>
            <ul className="list-disc pl-5 text-[11px] font-medium text-slate-600 space-y-1 leading-normal flex-1">
              {healthData.recommendations.financial.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>

          {/* Card 2: Milestone Execution */}
          <div className="p-4 bg-surface rounded-2xl border border-outline-variant/15 space-y-2 flex flex-col justify-between min-h-28">
            <div className="flex items-center gap-1.5 text-primary">
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              <h5 className="font-display font-extrabold text-[12px] uppercase tracking-wide">Milestone Execution</h5>
            </div>
            <ul className="list-disc pl-5 text-[11px] font-medium text-slate-600 space-y-1 leading-normal flex-1">
              {healthData.recommendations.execution.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>

          {/* Card 3: Founder Alignment */}
          <div className="p-4 bg-surface rounded-2xl border border-outline-variant/15 space-y-2 flex flex-col justify-between min-h-28">
            <div className="flex items-center gap-1.5 text-primary">
              <span className="material-symbols-outlined text-[18px]">handshake</span>
              <h5 className="font-display font-extrabold text-[12px] uppercase tracking-wide">Founder Alignment</h5>
            </div>
            <ul className="list-disc pl-5 text-[11px] font-medium text-slate-600 space-y-1 leading-normal flex-1">
              {healthData.recommendations.collaboration.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>

          {/* Card 4: Roadmap Goals */}
          <div className="p-4 bg-surface rounded-2xl border border-outline-variant/15 space-y-2 flex flex-col justify-between min-h-28">
            <div className="flex items-center gap-1.5 text-primary">
              <span className="material-symbols-outlined text-[18px]">crisis_line</span>
              <h5 className="font-display font-extrabold text-[12px] uppercase tracking-wide">Roadmap Goals</h5>
            </div>
            <ul className="list-disc pl-5 text-[11px] font-medium text-slate-600 space-y-1 leading-normal flex-1">
              {healthData.recommendations.goals.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 5: Predictive Timeline Stack */}
      <section className="space-y-4 w-full">
        {/* Card 1: Timeline Probability Metrics */}
        <div className="bg-white rounded-[24px] p-6 card-shadow border border-outline-variant/30 w-full h-48 flex flex-col justify-between">
          <h4 className="font-display font-bold text-[11px] text-slate-500 uppercase tracking-wider block">Timeline Success Forecast</h4>
          
          <div className="divide-y divide-outline-variant/15 text-[11px] font-semibold text-slate-600 flex-1 flex flex-col justify-center">
            <div className="flex justify-between py-3">
              <span>On-Time Milestone Probability</span>
              <span className="text-[#0d1c32] font-black">{healthData.predictions.milestonesOnTimeProb}%</span>
            </div>
            <div className="flex justify-between py-3 items-center">
              <span>Financial Stability Index</span>
              <span className={`text-[9.5px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                healthData.predictions.financialStability === 'Stable' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {healthData.predictions.financialStability}
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span>Venture Success Projection</span>
              <span className="text-emerald-600 font-black">{healthData.predictions.forecastedSuccessPercent}% Success</span>
            </div>
          </div>
        </div>

        {/* Card 2: Predictive Risk Indicators */}
        <div className="bg-white rounded-[24px] p-6 card-shadow border border-outline-variant/30 w-full h-48 flex flex-col justify-between">
          <h4 className="font-display font-bold text-[11px] text-slate-500 uppercase tracking-wider block">Timeline Risks Identified</h4>
          
          <div className="flex flex-wrap gap-2 pt-1.5 flex-1 items-start content-start">
            {healthData.predictions.keyRisks.map((k, i) => (
              <span key={i} className="text-[9.5px] font-black text-[#ba1a1a] bg-rose-50 border border-rose-100 rounded-xl px-3 py-1 flex items-center gap-1.5 select-none leading-normal">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                {k}
              </span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
