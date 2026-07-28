import React, { useState } from 'react';
import { useBucket } from '../context/BucketContext';
import { useTranslation } from 'react-i18next';
import { formatIndianCurrency } from '../utils/calculations';

export const MilestoneVault: React.FC = () => {
  const { t } = useTranslation();
  const { milestones, expenses, lockMilestone, unlockMilestone } = useBucket();

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleLockToggle = (id: string, currentlyLocked: boolean) => {
    if (currentlyLocked) {
      unlockMilestone(id);
    } else {
      lockMilestone(id);
    }
  };

  return (
    <div className="space-y-stack-gap">
      
      {/* Title Greetings */}
      <section className="mb-4 text-left">
        <h2 className="font-display-lg text-display-lg text-primary mb-2">{t('milestones.title')}</h2>
        <p className="font-body-md text-on-surface-variant">Lock specific setup phase budgets to block co-founder expense overrides.</p>
      </section>

      {/* Timeline nodes list */}
      <section className="relative pl-1 text-left space-y-4">
        {milestones.map(m => {
          const linkedExpenses = expenses.filter(
            e => e.milestoneId === m.id && e.approvalStatus === 'Approved'
          );
          const totalSum = linkedExpenses.reduce((sum, e) => sum + e.amount, 0);
          const isExpanded = expandedId === m.id;

          return (
            <div key={m.id} className="relative bg-white rounded-3xl p-5 border border-outline-variant/40 shadow-sm space-y-4">
              
              {/* Header clickable */}
              <div 
                onClick={() => toggleExpand(m.id)}
                className="flex items-start gap-3.5 pb-3.5 border-b border-outline-variant/35 cursor-pointer select-none"
              >
                <span className="material-symbols-outlined text-[24px] text-primary shrink-0 mt-0.5">
                  {m.isLocked ? 'lock' : 'lock_open'}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-body-sm text-on-surface">{m.name}</h3>
                    
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      m.isLocked ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-primary/10 text-primary'
                    }`}>
                      {m.isLocked ? t('milestones.locked') : t('milestones.unlocked')}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">
                    Phase {m.phaseOrder} • {linkedExpenses.length} approved expenses
                  </p>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Spent Balance</p>
                  <p className="font-bold text-body-sm text-primary mt-1">{formatIndianCurrency(totalSum)}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleLockToggle(m.id, m.isLocked)}
                  className={`h-8 px-4 rounded-full text-[11px] font-bold transition-all border ${
                    m.isLocked
                      ? 'bg-surface border-outline-variant/35 text-on-surface-variant hover:bg-surface-container-low'
                      : 'bg-error-container/20 border-error/20 text-error hover:bg-error-container/30'
                  }`}
                >
                  {m.isLocked ? t('milestones.unlockBtn') : t('milestones.lockBtn')}
                </button>
              </div>

              {/* Tagged list dropdown details */}
              {isExpanded && (
                <div className="bg-surface rounded-2xl p-3 border border-outline-variant/20 space-y-2.5 animate-fade-in">
                  <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">APPROVED EXPENSES TAGGED</p>
                  {linkedExpenses.length === 0 ? (
                    <p className="text-[11px] text-on-surface-variant italic py-1">No approved expenses logged here.</p>
                  ) : (
                    linkedExpenses.map((exp, expIdx) => (
                      <div key={exp.id} className={`flex justify-between items-center text-body-xs ${expIdx > 0 ? 'pt-2 border-t border-outline-variant/20' : ''}`}>
                        <div>
                          <p className="font-bold text-on-surface">{exp.vendorName}</p>
                          <p className="text-[9px] text-outline mt-0.5">{new Date(exp.timestamp).toLocaleDateString('en-IN')}</p>
                        </div>
                        <span className="font-bold text-primary">{formatIndianCurrency(exp.amount)}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
};
