import React, { useState } from 'react';
import { useBucket } from '../context/BucketContext';
import { useTranslation } from 'react-i18next';
import { Partner } from '../utils/calculations';

interface VentureSetupProps {
  onComplete: () => void;
}

export const VentureSetup: React.FC<VentureSetupProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const { updateBucketSetup } = useBucket();

  const [bizName, setBizName] = useState('');
  const [setupPartners, setSetupPartners] = useState<Omit<Partner, 'id'>[]>([
    { name: 'Anand Mishra', role: 'Founder & Operator', initialContribution: 400000, capitalTarget: 1000000, targetSplitRatio: 60 },
    { name: 'Arjun Sharma', role: 'Tech Lead & Support', initialContribution: 200000, capitalTarget: 600000, targetSplitRatio: 40 }
  ]);

  const handleAddPartner = () => {
    if (setupPartners.length >= 4) {
      alert("A venture bucket supports a maximum of 4 partners.");
      return;
    }
    setSetupPartners(prev => [
      ...prev,
      {
        name: '',
        role: '',
        initialContribution: 0,
        capitalTarget: 0,
        targetSplitRatio: 0
      }
    ]);
  };

  const handleRemovePartner = (index: number) => {
    if (setupPartners.length <= 2) {
      alert("A venture bucket requires at least 2 partners.");
      return;
    }
    setSetupPartners(prev => prev.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, field: keyof Omit<Partner, 'id'>, value: any) => {
    setSetupPartners(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: value
      };
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName.trim()) {
      alert("Please enter a business venture name.");
      return;
    }

    // Validate split ratios sum to 100
    const sum = setupPartners.reduce((total, p) => total + Number(p.targetSplitRatio), 0);
    if (sum !== 100) {
      alert(`Investment Split Ratios must total exactly 100%. Current sum: ${sum}%`);
      return;
    }

    // Map to final partners with IDs
    const finalPartners: Partner[] = setupPartners.map((p, i) => ({
      ...p,
      id: `p${i + 1}`,
      initialContribution: Number(p.initialContribution),
      capitalTarget: Number(p.capitalTarget),
      targetSplitRatio: Number(p.targetSplitRatio)
    }));

    updateBucketSetup(bizName.trim(), finalPartners);
    onComplete();
  };

  return (
    <div className="space-y-stack-gap">
      {/* Introduction */}
      <section className="mb-4 text-left">
        <h2 className="font-display-lg text-display-lg text-primary mb-2">{t('setup.title')}</h2>
        <p className="font-body-md text-on-surface-variant">{t('setup.subtitle')}</p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Business Name Input */}
        <div className="bg-white rounded-2xl p-card-inner-padding card-shadow border border-outline-variant/40">
          <label className="block font-label-md text-label-md text-primary uppercase mb-2 tracking-wider">
            {t('setup.businessName')}
          </label>
          <input
            type="text"
            value={bizName}
            onChange={(e) => setBizName(e.target.value)}
            placeholder={t('setup.placeholderBiz')}
            required
            className="w-full bg-surface-container-low rounded-xl px-4 py-3 font-body-lg text-body-lg text-on-surface border border-outline-variant/30 focus:border-primary outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* Partners Section Header */}
        <div className="flex items-center justify-between px-1">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">{t('setup.addPartners')}</h3>
          <button
            type="button"
            onClick={handleAddPartner}
            className="text-primary font-bold text-label-md flex items-center gap-1 hover:text-primary-container"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            {t('setup.addNew')}
          </button>
        </div>

        {/* Partner Detail Cards */}
        <div className="space-y-4">
          {setupPartners.map((partner, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-card-inner-padding card-shadow border border-outline-variant/40 space-y-4 relative overflow-hidden"
            >
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant/40">
                <span className="bg-primary/10 text-primary font-bold text-[11px] px-2.5 py-0.5 rounded-full">
                  PARTNER {index + 1}
                </span>
                
                {setupPartners.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePartner(index)}
                    className="text-error hover:bg-error-container/20 p-1 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">person_remove</span>
                  </button>
                )}
              </div>

              {/* Grid fields */}
              <div className="space-y-3.5">
                {/* Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">{t('setup.partnerName')}</label>
                    <input
                      type="text"
                      value={partner.name}
                      onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                      placeholder="e.g. Anand Mishra"
                      required
                      className="w-full bg-surface rounded-lg px-3 py-2 text-body-sm text-on-surface border border-outline-variant/30 focus:border-primary outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">{t('setup.partnerRole')}</label>
                    <input
                      type="text"
                      value={partner.role}
                      onChange={(e) => handleFieldChange(index, 'role', e.target.value)}
                      placeholder="e.g. Operator"
                      required
                      className="w-full bg-surface rounded-lg px-3 py-2 text-body-sm text-on-surface border border-outline-variant/30 focus:border-primary"
                    />
                  </div>
                </div>

                {/* Capital targets & initial money */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Split Ratio (%)</label>
                    <input
                      type="number"
                      value={partner.targetSplitRatio || ''}
                      onChange={(e) => handleFieldChange(index, 'targetSplitRatio', Number(e.target.value))}
                      placeholder="e.g. 50"
                      min="0"
                      max="100"
                      required
                      className="w-full bg-surface rounded-lg px-2.5 py-2 text-body-sm text-on-surface border border-outline-variant/30 focus:border-primary"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Initial Cash (₹)</label>
                    <input
                      type="number"
                      value={partner.initialContribution || ''}
                      onChange={(e) => handleFieldChange(index, 'initialContribution', Number(e.target.value))}
                      placeholder="e.g. 100000"
                      min="0"
                      required
                      className="w-full bg-surface rounded-lg px-2.5 py-2 text-body-sm text-on-surface border border-outline-variant/30 focus:border-primary"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Target Capital (₹)</label>
                    <input
                      type="number"
                      value={partner.capitalTarget || ''}
                      onChange={(e) => handleFieldChange(index, 'capitalTarget', Number(e.target.value))}
                      placeholder="e.g. 500000"
                      min="0"
                      required
                      className="w-full bg-surface rounded-lg px-2.5 py-2 text-body-sm text-on-surface border border-outline-variant/30 focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full h-[52px] bg-primary hover:bg-primary-container text-on-primary font-bold rounded-xl transition-all hover-scale flex items-center justify-center gap-1.5 shadow-md"
        >
          <span className="material-symbols-outlined">rocket_launch</span>
          Initialize Capital Ledger
        </button>
      </form>
    </div>
  );
};
