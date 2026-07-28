import React, { useState } from 'react';
import { useBucket } from '../context/BucketContext';
import { useTranslation } from 'react-i18next';
import { formatIndianCurrency } from '../utils/calculations';

export const DrawingsLedger: React.FC = () => {
  const { t } = useTranslation();
  const { partners, drawings, addDrawing, activePartnerId } = useBucket();

  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  const activePartner = partners.find(p => p.id === activePartnerId);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmt = Number(amount);
    if (!numericAmt || numericAmt <= 0) {
      alert("Please enter a valid withdrawal amount.");
      return;
    }
    if (!reason.trim()) {
      alert("Please enter a withdrawal reason.");
      return;
    }

    addDrawing(activePartnerId, numericAmt, reason.trim());
    setAmount('');
    setReason('');
    alert("Cash drawing logged successfully. Co-founder capital balance updated.");
  };

  return (
    <div className="space-y-stack-gap">
      
      {/* Title Greetings */}
      <section className="mb-4 text-left">
        <h2 className="font-display-lg text-display-lg text-primary mb-2">{t('drawings.title')}</h2>
        <p className="font-body-md text-on-surface-variant">Track co-founder drawings (direct cash withdrawals for personal or petty use).</p>
      </section>

      {/* Log Form */}
      <section className="bg-white rounded-[20px] p-card-inner-padding card-shadow border border-outline-variant/40">
        <form onSubmit={handleWithdraw} className="space-y-4 pt-1 text-left">
          
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-primary uppercase tracking-wider">Withdrawing Partner</label>
            <div className="w-full bg-surface-container-low rounded-xl px-4 py-3 font-semibold text-body-sm text-outline border border-outline-variant/25 select-none">
              {activePartner?.name} ({activePartner?.role})
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-primary uppercase tracking-wider">{t('drawings.amount')}</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              required
              className="w-full bg-surface-container-low focus:bg-white rounded-xl outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-primary uppercase tracking-wider">{t('drawings.reason')}</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Petty cash for office desk lamp"
              required
              className="w-full bg-surface-container-low focus:bg-white rounded-xl outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full h-[52px] bg-primary hover:bg-primary-container text-on-primary font-bold rounded-xl transition-all hover-scale flex items-center justify-center gap-1.5 shadow-md"
          >
            <span className="material-symbols-outlined">payments</span>
            {t('drawings.withdrawBtn')}
          </button>
        </form>
      </section>

      {/* Drawings list history */}
      <section className="bg-white rounded-[20px] p-card-inner-padding card-shadow border border-outline-variant/40 space-y-4 text-left">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Drawing History ({drawings.length})</h3>
        
        <div className="space-y-4 divide-y divide-outline-variant/30">
          {drawings.length === 0 ? (
            <p className="text-body-sm text-on-surface-variant py-2 italic text-center">No cash drawings recorded yet.</p>
          ) : (
            drawings.map((draw, idx) => {
              const partner = partners.find(p => p.id === draw.partnerId);
              return (
                <div key={draw.id} className={`flex justify-between items-center pt-3.5 ${idx === 0 ? 'pt-0' : ''}`}>
                  <div>
                    <h4 className="font-bold text-body-sm text-on-surface">{partner?.name}</h4>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">{draw.reason}</p>
                    <p className="text-[9px] text-outline mt-1 font-medium">
                      {new Date(draw.timestamp).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className="font-bold text-body-sm text-error">-{formatIndianCurrency(draw.amount)}</span>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
