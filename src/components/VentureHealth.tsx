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
  const gaugeAngle = (healthData.score / 100) * 180 - 180;

  // Copy Stakeholder Summary to clipboard
  const handleCopySummary = () => {
    navigator.clipboard.writeText(healthData.stakeholderSummary);
    alert("Stakeholder summary copied to clipboard!");
  };

  return (
    <div className="space-y-4 text-left pb-16 animate-fade-in text-[#0d1c32] select-none">
      
      {/* SECTION 1: Core Health Indicators Grid */}
      <section className="grid grid-cols-2 gap-3">
        {/* Card 1: Venture Health Score */}
        <div className="bg-white rounded-[24px] p-4 card-shadow border border-outline-variant/40 flex flex-col justify-between relative overflow-hidden h-[155px]">
          <div className="absolute right-0 top-0 w-20 h-20 bg-[#fae403]/10 rounded-full blur-xl pointer-events-none" />
          <div>
            <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">Health Score</span>
            <div className="flex items-baseline gap-0.5 mt-2.5">
              <span className="text-[34px] font-black text-[#0d1c32] tracking-tight leading-none">{healthData.score}</span>
              <span className="text-[11px] font-bold text-slate-400">/100</span>
            </div>
          </div>
          <div>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}>
              <span className={`w-1 h-1 rounded-full ${statusColors.dot} animate-pulse`} />
              {healthData.statusLabel.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Card 2: Success Probability Dial */}
        <div className="bg-[#0d1c32] text-white rounded-[24px] p-4 card-shadow border border-white/5 flex flex-col justify-between relative overflow-hidden h-[155px]">
          <div className="absolute right-0 top-0 w-20 h-20 bg-[#fae403]/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[8.5px] font-bold text-white/50 uppercase tracking-wider block">Probability</span>
              <span className="text-[20px] font-black text-[#fae403] tracking-tight block mt-1">{healthData.successProbability}%</span>
            </div>
            
            {/* SVG Progress Ring */}
            <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="19" stroke="rgba(255,255,255,0.06)" strokeWidth="4.5" fill="transparent" />
                <circle 
                  cx="24" 
                  cy="24" 
                  r="19" 
                  stroke="#fae403" 
                  strokeWidth="4.5" 
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 19}
                  strokeDashoffset={2 * Math.PI * 19 * (1 - healthData.successProbability / 100)}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="text-[8.5px] text-white/80 leading-normal font-semibold">
            Forecasted milestone success timeline: {healthData.predictions.estCompletionDays} Days.
          </div>
        </div>
      </section>

      {/* SECTION 2: Analytics Gauges Grid */}
      <section className="grid grid-cols-2 gap-3">
        {/* Card 1: Health Dial Gauge */}
        <div className="bg-white rounded-[24px] p-4 card-shadow border border-outline-variant/40 flex flex-col justify-between h-[175px]">
          <h4 className="font-display font-bold text-[9px] text-slate-500 uppercase tracking-wider block">Dial Indicator</h4>
          
          <div className="relative flex flex-col items-center justify-center flex-1">
            <div className="relative w-28 h-14 overflow-hidden flex items-end">
              <svg className="w-28 h-28 absolute bottom-0 left-0">
                <circle cx="56" cy="56" r="48" stroke="#f1f5f9" strokeWidth="10" strokeDasharray="151 151" strokeDashoffset="0" fill="transparent" strokeLinecap="round" />
                <circle cx="56" cy="56" r="48" stroke={healthData.status === 'Green' ? '#10b981' : healthData.status === 'Amber' ? '#f59e0b' : '#f43f5e'} strokeWidth="10" strokeDasharray="151 151" strokeDashoffset={151 - (151 * (healthData.score / 100))} fill="transparent" strokeLinecap="round" />
              </svg>
              <div 
                className="absolute bottom-0 left-1/2 w-1.5 h-11 bg-[#0d1c32] origin-bottom -translate-x-1/2 transition-all duration-1000 rounded-t-full"
                style={{ transform: `translateX(-50%) rotate(${gaugeAngle}deg)` }}
              />
              <div className="absolute bottom-0 left-1/2 w-3.5 h-3.5 bg-[#0d1c32] rounded-full border-2 border-white -translate-x-1/2 translate-y-1.5 z-10" />
            </div>
          </div>

          <div className="text-center">
            <span className="text-[9.5px] font-bold text-slate-500 block leading-tight">Overall Progress Stability</span>
          </div>
        </div>

        {/* Card 2: Risk Heat Map (Subgrid of 4 cards) */}
        <div className="bg-white rounded-[24px] p-4 card-shadow border border-outline-variant/40 flex flex-col justify-between h-[175px]">
          <h4 className="font-display font-bold text-[9px] text-slate-500 uppercase tracking-wider block">Risk Severity Heat Map</h4>
          
          <div className="grid grid-cols-2 gap-2 flex-1 mt-2.5">
            <div className="p-1.5 rounded-xl border border-outline-variant/20 flex flex-col justify-between bg-slate-50/50">
              <span className="text-[7.5px] text-slate-500 font-bold uppercase tracking-wider leading-none">Splits</span>
              <span className="text-[8.5px] font-black text-emerald-600 truncate leading-none uppercase mt-1">Low Risk</span>
            </div>

            <div className="p-1.5 rounded-xl border border-outline-variant/20 flex flex-col justify-between bg-slate-50/50">
              <span className="text-[7.5px] text-slate-500 font-bold uppercase tracking-wider leading-none">Disputes</span>
              <span className={`text-[8.5px] font-black truncate leading-none uppercase mt-1 ${
                healthData.disputesCount === 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {healthData.disputesCount === 0 ? 'None' : `${healthData.disputesCount} Act.`}
              </span>
            </div>

            <div className="p-1.5 rounded-xl border border-outline-variant/20 flex flex-col justify-between bg-slate-50/50">
              <span className="text-[7.5px] text-slate-500 font-bold uppercase tracking-wider leading-none">Overruns</span>
              <span className={`text-[8.5px] font-black truncate leading-none uppercase mt-1 ${
                healthData.overbudgetMilestonesCount === 0 ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                {healthData.overbudgetMilestonesCount === 0 ? 'Low' : `${healthData.overbudgetMilestonesCount} Ov.`}
              </span>
            </div>

            <div className="p-1.5 rounded-xl border border-outline-variant/20 flex flex-col justify-between bg-slate-50/50">
              <span className="text-[7.5px] text-slate-500 font-bold uppercase tracking-wider leading-none">Locks</span>
              <span className="text-[8.5px] font-black text-[#0d1c32] truncate leading-none uppercase mt-1">
                {healthData.completedMilestonesCount}/{healthData.totalMilestonesCount}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: AI Executive Center Grid */}
      <section className="grid grid-cols-2 gap-3">
        {/* Card 1: AI Insight Card */}
        <div className="bg-[#ecf3e3] rounded-[24px] p-4 border border-outline-variant/30 flex flex-col justify-between relative overflow-hidden h-[180px]">
          <div className="absolute right-2 top-2 select-none pointer-events-none opacity-20">
            <span className="material-symbols-outlined text-[#0d1c32] text-[40px]">insights</span>
          </div>

          <div className="space-y-1 relative z-10">
            <div className="flex items-center gap-1 text-emerald-800">
              <span className="material-symbols-outlined text-[14px]">stars</span>
              <span className="text-[8px] font-black uppercase tracking-wider">AI Insights</span>
            </div>
            <p className="text-[10px] font-semibold leading-normal text-[#0d1c32]/80 mt-1 min-h-[72px] flex items-center pr-3">
              {healthData.insights[activeInsightIndex]}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-[#0d1c32]/10 pt-2 relative z-10">
            <span className="text-[8px] font-bold text-[#0d1c32]/50">
              {activeInsightIndex + 1}/{healthData.insights.length}
            </span>
            <div className="flex gap-1">
              <button 
                onClick={() => setActiveInsightIndex(prev => (prev - 1 + healthData.insights.length) % healthData.insights.length)}
                className="w-5.5 h-5.5 bg-white rounded-full flex items-center justify-center border border-black/5 active:scale-90 transition-all"
              >
                <span className="material-symbols-outlined text-[12px]">chevron_left</span>
              </button>
              <button 
                onClick={() => setActiveInsightIndex(prev => (prev + 1) % healthData.insights.length)}
                className="w-5.5 h-5.5 bg-white rounded-full flex items-center justify-center border border-black/5 active:scale-90 transition-all"
              >
                <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Stakeholder Summary */}
        <div className="bg-white rounded-[24px] p-4 card-shadow border border-outline-variant/40 flex flex-col justify-between h-[180px]">
          <div className="flex justify-between items-center">
            <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-wider block">Stakeholder briefing</span>
            <button 
              onClick={handleCopySummary}
              className="flex items-center gap-0.5 bg-surface border border-outline-variant/20 rounded-md px-1.5 py-0.5 text-[8.5px] font-black text-[#0d1c32] hover:bg-slate-50 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[11px]">content_copy</span>
              Copy
            </button>
          </div>

          <blockquote className="bg-slate-50 rounded-xl p-2.5 text-[9.5px] font-semibold text-slate-500 border-l-2 border-[#0d1c32] leading-relaxed italic text-left flex-1 mt-2 overflow-y-auto max-h-[110px]">
            "{healthData.stakeholderSummary}"
          </blockquote>
        </div>
      </section>

      {/* SECTION 4: Strategic Recommendations 2x2 Grid */}
      <section className="bg-white rounded-[24px] p-4 card-shadow border border-outline-variant/40 space-y-3">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-[20px]">recommend</span>
          <h4 className="font-display font-bold text-[10px] text-slate-500 uppercase tracking-wider">Recommendations Checklist</h4>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: Financial Controls */}
          <div className="p-2.5 bg-surface rounded-xl border border-outline-variant/15 flex flex-col justify-between h-[95px]">
            <div className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
              <h5 className="font-display font-bold text-[9px] uppercase tracking-wide">Financials</h5>
            </div>
            <ul className="list-disc pl-3 text-[8.5px] font-semibold text-slate-500 space-y-0.5 leading-snug mt-1.5 flex-1 overflow-y-auto">
              {healthData.recommendations.financial.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>

          {/* Card 2: Milestone Execution */}
          <div className="p-2.5 bg-surface rounded-xl border border-outline-variant/15 flex flex-col justify-between h-[95px]">
            <div className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-[14px]">rocket_launch</span>
              <h5 className="font-display font-bold text-[9px] uppercase tracking-wide">Execution</h5>
            </div>
            <ul className="list-disc pl-3 text-[8.5px] font-semibold text-slate-500 space-y-0.5 leading-snug mt-1.5 flex-1 overflow-y-auto">
              {healthData.recommendations.execution.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>

          {/* Card 3: Founder Alignment */}
          <div className="p-2.5 bg-surface rounded-xl border border-outline-variant/15 flex flex-col justify-between h-[95px]">
            <div className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-[14px]">handshake</span>
              <h5 className="font-display font-bold text-[9px] uppercase tracking-wide">Alignment</h5>
            </div>
            <ul className="list-disc pl-3 text-[8.5px] font-semibold text-slate-500 space-y-0.5 leading-snug mt-1.5 flex-1 overflow-y-auto">
              {healthData.recommendations.collaboration.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>

          {/* Card 4: Roadmap Goals */}
          <div className="p-2.5 bg-surface rounded-xl border border-outline-variant/15 flex flex-col justify-between h-[95px]">
            <div className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-[14px]">crisis_line</span>
              <h5 className="font-display font-bold text-[9px] uppercase tracking-wide">Roadmap</h5>
            </div>
            <ul className="list-disc pl-3 text-[8.5px] font-semibold text-slate-500 space-y-0.5 leading-snug mt-1.5 flex-1 overflow-y-auto">
              {healthData.recommendations.goals.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 5: Predictive Timeline Grid */}
      <section className="grid grid-cols-2 gap-3">
        {/* Card 1: Timeline Probability Metrics */}
        <div className="bg-white rounded-[24px] p-4 card-shadow border border-outline-variant/40 flex flex-col justify-between h-[160px]">
          <h4 className="font-display font-bold text-[9px] text-slate-500 uppercase tracking-wider block">Timeline Forecast</h4>
          
          <div className="space-y-2 mt-2 flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-center text-[9.5px]">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px]">On-Time</span>
              <span className="font-black text-[#0d1c32]">{healthData.predictions.milestonesOnTimeProb}%</span>
            </div>
            <div className="flex justify-between items-center text-[9.5px] border-t border-outline-variant/10 pt-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px]">Stability</span>
              <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full ${
                healthData.predictions.financialStability === 'Stable' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {healthData.predictions.financialStability}
              </span>
            </div>
            <div className="flex justify-between items-center text-[9.5px] border-t border-outline-variant/10 pt-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px]">Projected</span>
              <span className="text-emerald-600 font-black">{healthData.predictions.forecastedSuccessPercent}% Succ.</span>
            </div>
          </div>
        </div>

        {/* Card 2: Predictive Risk Indicators */}
        <div className="bg-white rounded-[24px] p-4 card-shadow border border-outline-variant/40 flex flex-col justify-between h-[160px]">
          <h4 className="font-display font-bold text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Risk Indicators</h4>
          
          <div className="flex-1 flex flex-col justify-center mt-2.5">
            <div className="flex flex-col gap-1.5 max-h-[110px] overflow-y-auto">
              {healthData.predictions.keyRisks.map((k, i) => (
                <span key={i} className="text-[8px] font-black text-[#ba1a1a] bg-rose-50 border border-rose-100 rounded-md px-1.5 py-0.5 flex items-center gap-1 select-none leading-normal">
                  <span className="w-1 h-1 rounded-full bg-rose-500 shrink-0" />
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
