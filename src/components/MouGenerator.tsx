import React, { useState } from 'react';
import { useBucket } from '../context/BucketContext';
import { useTranslation } from 'react-i18next';

export const MouGenerator: React.FC = () => {
  const { t } = useTranslation();
  const { partners, bizName } = useBucket();

  const [profitSplit, setProfitSplit] = useState('60:40');
  const [exitNoticeDays, setExitNoticeDays] = useState('90');
  const [valuationMethod, setValuationMethod] = useState('3x multiplier on net monthly earnings');
  const [exitRules, setExitRules] = useState('Settlement capital paid in equal installments over 6 months.');
  const [isGenerated, setIsGenerated] = useState(false);
  const [mouText, setMouText] = useState('');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profitSplit.trim() || !exitNoticeDays.trim() || !valuationMethod.trim() || !exitRules.trim()) {
      alert("Please fill all agreement parameters.");
      return;
    }

    const partnerNames = partners.map(p => `${p.name} (${p.role})`).join(' and ');
    const capitalSummary = partners.map(p => `- ${p.name}: commitment of ₹${p.capitalTarget} at ${p.targetSplitRatio}% target`).join('\n');

    const draft = `MUTUAL MEMORANDUM OF UNDERSTANDING (MoU)

This onboarding agreement is entered into for the startup venture "${bizName}" by the co-founders:
${partnerNames}

1. CAPITAL CONTRIBUTION TARGETS
The partners agree to the initial capital commitment targets:
${capitalSummary}

2. PROFIT / LOSS SPLIT RATIO
It is mutually agreed that the active profit/loss distribution ratio for the venture operations shall be: ${profitSplit}.

3. EXIT NOTICE PERIOD
In the event that any partner intends to exit the partnership, the partner must submit a written exit notice at least ${exitNoticeDays} days in advance.

4. VALUATION OF INTEREST
The exit valuation of the outgoing partner's business interest shall be calculated using the agreed method: ${valuationMethod}.

5. OUTGOING CAPITAL PAYOUT
The return of the outgoing partner's contributed capital and settlement balance shall follow these guidelines: ${exitRules}.

Signed mutually by the co-founders,
Date: ${new Date().toLocaleDateString('en-IN')}
Status: Draft Mutual Understanding`;

    setMouText(draft);
    setIsGenerated(true);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(mouText);
    alert("Draft MoU agreement copied to clipboard!");
  };

  return (
    <div className="space-y-stack-gap">
      
      {/* Title Greetings */}
      <section className="mb-4 text-left">
        <h2 className="font-display-lg text-display-lg text-primary mb-2">{t('mou.title')}</h2>
        <p className="font-body-md text-on-surface-variant">Draft onboarding capital and operational split rules between partners.</p>
      </section>

      <section className="bg-white rounded-[20px] p-card-inner-padding card-shadow border border-outline-variant/40 space-y-4">
        {/* Warning Alert */}
        <div className="bg-error-container/20 border border-error/15 text-error text-[11px] leading-relaxed p-3.5 rounded-xl text-left">
          {t('mou.warning')}
        </div>

        {!isGenerated ? (
          <form onSubmit={handleGenerate} className="space-y-4 pt-1 text-left">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-primary uppercase tracking-wider">{t('mou.profitSplit')}</label>
              <input
                type="text"
                value={profitSplit}
                onChange={(e) => setProfitSplit(e.target.value)}
                placeholder="e.g. 60:40 or 50:50"
                required
                className="w-full bg-surface-container-low focus:bg-white rounded-xl outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-primary uppercase tracking-wider">{t('mou.exitNotice')}</label>
              <input
                type="number"
                value={exitNoticeDays}
                onChange={(e) => setExitNoticeDays(e.target.value)}
                placeholder="e.g. 90"
                required
                className="w-full bg-surface-container-low focus:bg-white rounded-xl outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-primary uppercase tracking-wider">{t('mou.exitValuation')}</label>
              <input
                type="text"
                value={valuationMethod}
                onChange={(e) => setValuationMethod(e.target.value)}
                placeholder="e.g. Multiplier or asset splits valuation"
                required
                className="w-full bg-surface-container-low focus:bg-white rounded-xl outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-primary uppercase tracking-wider">Exit Capital Refund Guidelines</label>
              <textarea
                value={exitRules}
                onChange={(e) => setExitRules(e.target.value)}
                placeholder="e.g. Paid back in equal installments over 6 months."
                required
                rows={3}
                className="w-full bg-surface-container-low focus:bg-white rounded-xl outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full h-[52px] bg-primary hover:bg-primary-container text-on-primary font-bold rounded-xl transition-all hover-scale flex items-center justify-center gap-1.5 shadow-md"
            >
              <span className="material-symbols-outlined">gavel</span>
              {t('mou.generate')}
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-left animate-fade-in">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">MoU AGREEMENT DRAFT PREVIEW</h3>
            
            <pre className="w-full bg-surface-container-low rounded-2xl p-4 border border-outline-variant/30 font-mono text-[11px] leading-relaxed text-on-surface whitespace-pre-wrap select-text max-h-72 overflow-y-auto">
              {mouText}
            </pre>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleCopyToClipboard}
                className="w-full h-11 bg-primary hover:bg-primary-container text-on-primary font-bold rounded-xl flex items-center justify-center gap-1 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">content_copy</span>
                Copy Agreement text
              </button>

              <button
                type="button"
                onClick={() => setIsGenerated(false)}
                className="w-full h-11 bg-surface hover:bg-surface-container-low border border-outline-variant/30 text-on-surface-variant font-bold rounded-xl flex items-center justify-center gap-1 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">edit</span>
                Edit Agreement Criteria
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
