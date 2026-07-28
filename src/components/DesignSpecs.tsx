import React, { useState } from 'react';

interface MockupView {
  id: string;
  name: string;
  folder: string;
  description: string;
}

export const DesignSpecs: React.FC = () => {
  const mockupViews: MockupView[] = [
    { id: '1', name: 'Partner Setup Onboarding', folder: 'partner_setup', description: 'Initialize co-founder partners, targets, split ratios, and initial cash.' },
    { id: '2', name: 'Dashboard Live Splits', folder: 'business_capital_ledger', description: 'Interactive SVG donut split chart, funding progress, and recent activity logs.' },
    { id: '3', name: 'Log Expense Receipt', folder: 'log_expense', description: 'Expense logs, receipt scanner viewfinder overlay, and cash warning alerts.' },
    { id: '4', name: 'Approvals Inbox Log', folder: 'approvals_required', description: 'Verification checklist, dual-signing logic, and live WhatsApp log hooks.' },
    { id: '5', name: 'Dispute Sandbox Chats', folder: 'dispute_sandbox', description: 'Dispute arguments comments board with simulated audio transcripts and auto-scroller.' },
    { id: '6', name: 'Drawings Cash Ledger', folder: 'drawings_ledger', description: 'Subtract capital cash balances directly from partner profiles.' },
    { id: '7', name: 'Merchant Payments Directory', folder: 'vendor_directory', description: 'Directory list of all unique outlet logs and auto-assigned UPI handles.' },
    { id: '8', name: 'Milestone Budget Vault', folder: 'milestone_vault', description: 'Lock/unlock budget stages to protect operational balances.' },
    { id: '9', name: 'Mutual MoU Generator', folder: 'mou_generator', description: 'Draft mutual understandings on splits, notice days, and exit valuations.' },
    { id: '10', name: 'CA Exporters & Settlements', folder: 'settlement_report', description: 'Download audit CSV files and estimate outgoing settlement payouts.' },
    { id: '11', name: 'Language Settings', folder: 'settings_language', description: 'Configure display languages (Hindi, English, Hinglish).' },
    { id: '12', name: 'Brand & Style Guides', folder: 'investor_s_bucket', description: 'Read color guides, typographies, layouts, and component radii specifications.' }
  ];

  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const activeMock = mockupViews.find(m => m.folder === selectedFolder);

  return (
    <div className="space-y-stack-gap text-left">
      
      {/* Title Greetings */}
      <section className="mb-4 text-left">
        <h2 className="font-display-lg text-display-lg text-primary mb-2">Design Spec Simulator</h2>
        <p className="font-body-md text-on-surface-variant">Explore the original design layout screenshots and raw mockup code pages.</p>
      </section>

      {/* Mockups list */}
      <section className="bg-white rounded-[20px] p-card-inner-padding card-shadow border border-outline-variant/40 space-y-4">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Available Design Specs ({mockupViews.length})</h3>
        
        <div className="grid grid-cols-1 gap-3.5">
          {mockupViews.map(mock => (
            <button
              key={mock.id}
              onClick={() => setSelectedFolder(selectedFolder === mock.folder ? null : mock.folder)}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all flex justify-between items-center ${
                selectedFolder === mock.folder
                  ? 'bg-primary/5 border-primary'
                  : 'bg-surface border-outline-variant/30 hover:bg-surface-container-low'
              }`}
            >
              <div className="flex-1 pr-4">
                <h4 className="font-bold text-body-sm text-on-surface">{mock.name}</h4>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">{mock.description}</p>
              </div>
              <span className="material-symbols-outlined text-outline shrink-0">
                {selectedFolder === mock.folder ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Active Mock Screen & Image Preview */}
      {activeMock && (
        <section className="bg-white rounded-[20px] p-card-inner-padding card-shadow border border-outline-variant/40 space-y-4 animate-fade-in text-left">
          <div className="flex justify-between items-center pb-3 border-b border-outline-variant/30">
            <div>
              <h3 className="font-bold text-body-sm text-on-surface">{activeMock.name}</h3>
              <p className="text-[10px] text-on-surface-variant mt-0.5">Folder: /design_specs/{activeMock.folder}/</p>
            </div>
            
            <a
              href={`/design_specs/${activeMock.folder}/code.html`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary-container text-on-primary text-body-xs font-bold px-3 py-1.5 rounded-full transition-all hover-scale shadow-sm flex items-center gap-1 shrink-0"
            >
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              Launch HTML Mockup
            </a>
          </div>

          <div className="space-y-2">
            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Screen Preview</p>
            <div className="w-full bg-surface-container-low rounded-2xl p-2.5 border border-outline-variant/20 flex justify-center overflow-hidden">
              <img
                src={`/design_specs/${activeMock.folder}/screen.png`}
                alt={`${activeMock.name} mockup screenshot`}
                className="max-w-full max-h-96 object-contain rounded-xl shadow-md transition-all hover:scale-105 duration-300 cursor-zoom-in"
                onError={(e) => {
                  // Fallback if image fails
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
