import React, { useState } from 'react';
import { useBucket } from '../context/BucketContext';
import { useTranslation } from 'react-i18next';
import { formatIndianCurrency, calculateSummaryStats, calculateVentureHealth } from '../utils/calculations';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { partners, expenses, drawings, activePartnerId, milestones } = useBucket();

  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | null>(null);
  const [cyclingIndex, setCyclingIndex] = useState(0);

  React.useEffect(() => {
    if (activeSegmentIndex !== null) return;
    const cycleLength = partners.length + 2;
    const interval = setInterval(() => {
      setCyclingIndex(prev => (prev + 1) % cycleLength);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeSegmentIndex, partners.length]);

  const stats = React.useMemo(() => calculateSummaryStats(partners, expenses, drawings), [partners, expenses, drawings]);

  const healthData = React.useMemo(() => {
    return calculateVentureHealth(partners, expenses, drawings, milestones);
  }, [partners, expenses, drawings, milestones]);

  // Format recent activity list from approved logs & drawings
  const recentActivities = React.useMemo(() => {
    return [
      ...expenses.map(e => ({
        id: e.id,
        title: e.vendorName,
        desc: `${e.category} • via ${e.paymentMode}`,
        amount: e.amount,
        type: 'expense' as const,
        status: e.approvalStatus,
        timestamp: e.timestamp
      })),
      ...drawings.map(d => {
        const partner = partners.find(p => p.id === d.partnerId);
        return {
          id: d.id,
          title: `Cash Drawing: ${partner?.name || 'Partner'}`,
          desc: d.reason,
          amount: d.amount,
          type: 'drawing' as const,
          status: 'Approved' as const,
          timestamp: d.timestamp
        };
      })
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);
  }, [expenses, drawings, partners]);

  const totalContribution = stats.totalCapitalContributed;
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const partnerColors = ['#0d1c32', '#fae403', '#b2ee4a'];

  const renderDonutCenter = () => {
    const displayIndex = cyclingIndex;
    if (displayIndex < partners.length) {
      const p = partners[displayIndex];
      const actual = stats.partnerContributions.find(c => c.partnerId === p.id)?.actualContribution || 0;
      const pct = totalContribution > 0 ? Math.round((actual / totalContribution) * 100) : 0;
      return (
        <div key={`p-${p.id}`} className="animate-fade-in text-center flex flex-col items-center select-none">
          <span className="font-display-lg text-[30px] text-primary font-black leading-none">{pct}%</span>
          <span className="font-label-md text-[9px] text-on-surface-variant uppercase mt-1.5 tracking-wider">{p.name.split(' ')[0]} Share</span>
        </div>
      );
    }

    if (displayIndex === partners.length) {
      return (
        <div key="funding" className="animate-fade-in text-center flex flex-col items-center select-none">
          <span className="font-display-lg text-[30px] text-primary font-black leading-none">{stats.fundingProgressPercentage}%</span>
          <span className="font-label-md text-[9px] text-on-surface-variant uppercase mt-1.5 tracking-wider">{t('dashboard.fundingProgress')}</span>
        </div>
      );
    }

    const splitStr = partners[0] ? `${Math.round(partners[0].targetSplitRatio)}:${Math.round(partners[1]?.targetSplitRatio || 0)}` : '0:0';
    return (
      <div key="split" className="animate-fade-in text-center flex flex-col items-center select-none">
        <span className="font-display-lg text-[26px] text-primary font-black leading-none">{splitStr}</span>
        <span className="font-label-md text-[9px] text-on-surface-variant uppercase mt-2 tracking-wider">Active Split</span>
      </div>
    );
  };

  const activePartner = partners.find(p => p.id === activePartnerId) || partners[0];

  return (
    <div className="space-y-stack-gap">

      {/* Modern Profile Header Card (Screenshot-matching layout) */}
      <div className="bg-gradient-to-r from-[#ecf3e3]/80 via-white to-[#ecf3e3]/80 rounded-[24px] p-4 card-shadow border border-outline-variant/30 flex items-center justify-between text-left relative overflow-hidden">
        {/* Faded background glow effects */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#fae403]/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-24 h-24 bg-[#b2ee4a]/5 rounded-full blur-xl pointer-events-none" />

        {/* Left side: Avatar image + Welcome texts */}
        <div className="flex items-center gap-3.5 z-10">
          <img
            src="/co_founder_avatar.png"
            alt="Co-Founder Profile"
            className="w-12 h-12 rounded-full object-cover border border-outline-variant/45 shadow-sm"
          />
          <div>
            <span className="text-[12px] text-slate-500 font-medium flex items-center gap-1 leading-tight">
              Welcome Back 👋
            </span>
            <div className="relative mt-1">
              <h3 className="font-display font-extrabold text-[18px] text-[#0d1c32] flex items-center gap-1 leading-tight select-none">
                {activePartner ? activePartner.name : 'Jerome Bell'}
              </h3>
            </div>
          </div>
        </div>

        {/* Right side: Circular Notification Bell with Red Dot */}
        <button
          type="button"
          onClick={() => alert("Notification center is currently empty.")}
          className="w-11 h-11 bg-white border border-outline-variant/30 rounded-full flex items-center justify-center shadow-sm relative active:scale-95 transition-all text-[#0d1c32] hover:bg-surface-container-low z-10"
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 0" }}>notifications</span>
          <span className="w-2.5 h-2.5 bg-red-500 rounded-full absolute top-2.5 right-2.5 border-2 border-white" />
        </button>
      </div>

      {/* Contextual Venture Health Mini Card */}
      <div 
        onClick={() => {
          // Trigger the 'health' subscreen navigation by finding and clicking the header pill
          const healthPill = document.querySelector('[title="View Account"]')?.parentElement?.firstChild as HTMLButtonElement;
          if (healthPill) healthPill.click();
        }}
        className="bg-white rounded-[24px] p-4 border border-outline-variant/30 flex items-center justify-between text-left cursor-pointer active:scale-[0.99] transition-all hover:bg-slate-50 relative overflow-hidden card-shadow"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[22px]">analytics</span>
          <div>
            <h4 className="font-display font-extrabold text-[12.5px] text-[#0d1c32]">Venture Health Index</h4>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Success probability currently sits at {healthData.successProbability}%</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-full border ${
            healthData.status === 'Green' 
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
              : healthData.status === 'Amber'
              ? 'bg-amber-50 text-amber-600 border-amber-100'
              : 'bg-rose-50 text-rose-600 border-rose-100'
          }`}>
            {healthData.score}/100
          </span>
          <span className="material-symbols-outlined text-[16px] text-slate-400">chevron_right</span>
        </div>
      </div>

      {/* Live Equity splits donut */}
      <section className="bg-white rounded-[20px] p-card-inner-padding card-shadow border border-outline-variant/40 flex flex-col items-center">
        <h2 className="w-full text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-6">
          {t('dashboard.liveSplit')}
        </h2>

        <div className="relative w-56 h-56 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#eeeeed"
              strokeWidth="10"
            />
            {totalContribution === 0 ? (
              /* Grey placeholder when total contributions is zero */
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="#dadad9"
                strokeWidth="10"
              />
            ) : (() => {
              let accumulatedPercentage = 0;
              return stats.partnerContributions.map((c, index) => {
                const partner = partners.find(p => p.id === c.partnerId);
                if (!partner) return null;

                const share = c.actualContribution / totalContribution;
                const strokeDashoffset = circumference - share * circumference;
                const rotationAngle = accumulatedPercentage * 360;
                accumulatedPercentage += share;

                return (
                  <circle
                    key={c.partnerId}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke={partnerColors[index % partnerColors.length]}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="progress-ring__circle cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setActiveSegmentIndex(index)}
                    onMouseLeave={() => setActiveSegmentIndex(null)}
                    style={{
                      transform: `rotate(${rotationAngle}deg)`,
                      transformOrigin: '50% 50%',
                      opacity: activeSegmentIndex === null || activeSegmentIndex === index ? 1 : 0.45,
                    }}
                  />
                );
              });
            })()}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {renderDonutCenter()}
          </div>
        </div>

        {/* Focus segment display indicator */}
        {activeSegmentIndex !== null && partners[activeSegmentIndex] && (
          <div className="mt-4 bg-primary/5 text-primary text-[12px] px-3.5 py-1 rounded-full font-semibold animate-fade-in">
            {partners[activeSegmentIndex].name}:{' '}
            {totalContribution > 0
              ? Math.round(
                  (stats.partnerContributions.find(c => c.partnerId === partners[activeSegmentIndex].id)
                    ?.actualContribution || 0) /
                    totalContribution *
                    100
                )
              : 0}
            % of active capital pool
          </div>
        )}

        {/* Legend buttons grid */}
        <div className="grid grid-cols-2 gap-4 mt-8 w-full">
          {partners.map((p, idx) => {
            const contrib = stats.partnerContributions.find(c => c.partnerId === p.id)?.actualContribution || 0;
            const pct = totalContribution > 0 ? Math.round((contrib / totalContribution) * 100) : 0;

            return (
              <button
                key={p.id}
                onMouseEnter={() => setActiveSegmentIndex(idx)}
                onMouseLeave={() => setActiveSegmentIndex(null)}
                className={`flex items-center gap-3 text-left p-2 rounded-xl transition-all border border-transparent ${
                  activeSegmentIndex === idx ? 'bg-surface-container-low border-outline-variant/35' : ''
                }`}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full shrink-0"
                  style={{ backgroundColor: partnerColors[idx % partnerColors.length] }}
                />
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{p.name.split(' ')[0]}</p>
                  <p className="font-headline-sm text-body-md font-bold text-on-surface">
                    {formatIndianCurrency(contrib)}
                    <span className="text-[10px] text-outline font-medium ml-1">({pct}%)</span>
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Capital statistics grid */}
      <section className="bg-[#0d1c32] text-white rounded-[28px] p-5 shadow-md border-0 flex items-center justify-between">
        <div>
          <p className="font-label-md text-[11px] text-white/85 uppercase tracking-wider">{t('dashboard.totalCommitted')}</p>
          <p className="text-[28px] font-extrabold leading-none mt-1.5 drop-shadow-sm text-[#fae403]">
            {formatIndianCurrency(partners.reduce((sum, p) => sum + p.capitalTarget, 0))}
          </p>
        </div>
        <div className="bg-white/15 p-3 rounded-2xl text-[#fae403]">
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        {/* Spent progress */}
        <div className="bg-white rounded-2xl p-3.5 card-shadow border border-outline-variant/40">
          <p className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">{t('dashboard.spent')}</p>
          <p className="text-body-md text-error font-extrabold mt-0.5 leading-none">{formatIndianCurrency(stats.totalSpent)}</p>
          <div className="w-full h-1.5 bg-surface-container-low rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-error rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(
                  100,
                  totalContribution > 0 ? (stats.totalSpent / totalContribution) * 100 : 0
                )}%`
              }}
            />
          </div>
        </div>

        {/* Running cash progress */}
        <div className="bg-white rounded-2xl p-3.5 card-shadow border border-outline-variant/40">
          <p className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">{t('dashboard.runningBal')}</p>
          <p className="text-body-md text-primary font-extrabold mt-0.5 leading-none">{formatIndianCurrency(stats.runningBalance)}</p>
          <div className="w-full h-1.5 bg-surface-container-low rounded-full mt-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                backgroundColor: '#b2ee4a',
                width: `${Math.min(
                  100,
                  totalContribution > 0 ? (stats.runningBalance / totalContribution) * 100 : 0
                )}%`
              }}
            />
          </div>
        </div>
      </section>

      {/* Target Progress grids */}
      <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider px-1">INDIVIDUAL COMMITMENTS</h3>
      <div className="space-y-4">
        {partners.map((p, idx) => {
          const actual = stats.partnerContributions.find(c => c.partnerId === p.id)?.actualContribution || 0;
          const progress = p.capitalTarget > 0 ? Math.min(100, Math.round((actual / p.capitalTarget) * 100)) : 0;

          return (
            <div 
              key={p.id}
              className="bg-white rounded-[28px] p-5 shadow-sm border border-outline-variant/30 space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-body-md shadow-sm"
                    style={{ backgroundColor: partnerColors[idx % partnerColors.length] }}
                  >
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-body-sm text-on-surface flex items-center gap-1">
                      {p.name}
                      <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    </h4>
                    <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">{p.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-body-sm font-extrabold text-primary">{progress}%</span>
                </div>
              </div>

              {/* Progress Bar with custom partner colors */}
              <div className="w-full h-2.5 bg-white rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    backgroundColor: '#b2ee4a',
                    width: `${progress}%`
                  }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-on-surface-variant font-medium">
                <span>Contributed: <strong className="text-on-surface font-semibold">{formatIndianCurrency(actual)}</strong></span>
                <span>Target: <strong className="text-on-surface font-semibold">{formatIndianCurrency(p.capitalTarget)}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent activity list cards */}
      <section className="bg-white rounded-[20px] p-card-inner-padding card-shadow border border-outline-variant/40 space-y-4">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{t('dashboard.recentActivity')}</h3>
        
        <div className="space-y-4 divide-y divide-outline-variant/30">
          {recentActivities.length === 0 ? (
            <p className="text-body-sm text-on-surface-variant py-2">No activity logged yet.</p>
          ) : (
            recentActivities.map((act, idx) => (
              <div key={act.id} className={`flex items-start justify-between pt-3.5 ${idx === 0 ? 'pt-0' : ''}`}>
                <div className="flex gap-3">
                  <div className={`p-2 rounded-xl mt-0.5 flex items-center justify-center ${
                    act.type === 'drawing' ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-primary/5 text-primary'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">
                      {act.type === 'drawing' ? 'account_balance_wallet' : 'receipt_long'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-body-sm text-on-surface leading-tight">{act.title}</h4>
                    <p className="text-[12px] text-on-surface-variant mt-0.5">{act.desc}</p>
                    <p className="text-[10px] text-outline mt-1 font-medium">
                      {new Date(act.timestamp).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <span className="font-bold text-body-sm text-on-surface">
                    {act.type === 'drawing' ? '-' : ''}{formatIndianCurrency(act.amount)}
                  </span>
                  
                  {/* Status chip badge */}
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    act.status === 'Approved' ? 'bg-[#00513b]/10 text-[#00513b]' :
                    act.status === 'Disputed' ? 'bg-error-container text-[#ba1a1a]' :
                    act.status === 'Auto-Flagged' ? 'bg-secondary-fixed text-secondary' :
                    'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    {act.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
