import React from 'react';
import { useBucket } from '../context/BucketContext';
import { useTranslation } from 'react-i18next';

export const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { resetBucket, bizName } = useBucket();

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the entire bucket? This will delete all co-founders investment target splits, approved expense ledger logs, drawings, and reset the app back to onboarding.")) {
      resetBucket();
      alert("Ledger database erased successfully.");
    }
  };

  const languagesList = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'hinglish', name: 'Hinglish' }
  ];

  return (
    <div className="space-y-stack-gap">
      
      {/* Title Greetings */}
      <section className="mb-4 text-left">
        <h2 className="font-display-lg text-display-lg text-primary mb-2">{t('settings.title')}</h2>
        <p className="font-body-md text-on-surface-variant">Configure app display settings and database controls.</p>
      </section>

      {/* Language */}
      <section className="bg-white rounded-[20px] p-card-inner-padding card-shadow border border-outline-variant/40 space-y-4 text-left">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{t('settings.changeLanguage')}</h3>
        
        <div className="flex flex-wrap gap-2.5">
          {languagesList.map(lang => {
            const isActive = i18n.language === lang.code;
            return (
              <button
                type="button"
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`px-4 py-2 rounded-full text-body-xs font-semibold border transition-all ${
                  isActive
                    ? 'bg-primary/10 border-primary/20 text-primary font-bold'
                    : 'bg-surface border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                {isActive && <span className="font-bold mr-1">✓</span>}
                {lang.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Reset */}
      <section className="bg-white rounded-[20px] p-card-inner-padding card-shadow border border-outline-variant/40 space-y-4 text-left">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Developer Sandbox Database</h3>
        <p className="text-body-xs text-on-surface-variant leading-relaxed">
          Use this control button to erase all contributions, approvals, and drawings, and return back to the onboarding configure state. Active Venture: "{bizName || 'None'}".
        </p>

        <button
          type="button"
          onClick={handleReset}
          className="w-full h-11 bg-[#ba1a1a]/5 hover:bg-[#ba1a1a]/10 border border-[#ba1a1a]/15 text-[#ba1a1a] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">delete_forever</span>
          Erase & Reset Ledger Bucket
        </button>
      </section>
    </div>
  );
};
