import React, { useState } from 'react';
import { useBucket } from '../context/BucketContext';
import { useTranslation } from 'react-i18next';
import { formatIndianCurrency } from '../utils/calculations';

export const ApprovalsInbox: React.FC = () => {
  const { t } = useTranslation();
  const { partners, expenses, approveExpense, disputeExpense, activePartnerId } = useBucket();

  const [webhookLogs, setWebhookLogs] = useState<string[]>([
    `[SYS-INIT] Connected to WhatsApp Webhook Template API Channel (v1.0)...`,
    `[INFO] Awaiting new ledger logs to trigger templates...`
  ]);

  const pendingExpenses = React.useMemo(() => expenses.filter(e => e.approvalStatus === 'Pending'), [expenses]);
  const activePartner = React.useMemo(() => partners.find(p => p.id === activePartnerId), [partners, activePartnerId]);

  const addLog = (msg: string) => {
    setWebhookLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleAction = (expenseId: string, action: 'Approve' | 'Dispute', desc: string, submittedById: string) => {
    // Enforce dual-approval: cannot approve your own log
    if (action === 'Approve' && submittedById === activePartnerId) {
      alert("Dual-Approval Rule Enforced: You cannot approve your own logged expenses. A different co-founder partner must verify this expense.");
      return;
    }

    const partnerName = activePartner?.name || 'Partner';
    
    if (action === 'Approve') {
      approveExpense(expenseId);
      addLog(`SUCCESS: Expense "${desc}" approved by ${partnerName}.`);
      addLog(`API-OUT: Sent WhatsApp receipt verification to co-founders.`);
      alert("Expense approved and added to co-founder contributed balance.");
    } else {
      disputeExpense(expenseId);
      addLog(`FLAGGED: Expense "${desc}" disputed by ${partnerName}.`);
      addLog(`API-OUT: Queued template notification to dispute sandbox.`);
      alert("Expense moved to Dispute Resolution Sandbox.");
    }
  };

  return (
    <div className="space-y-stack-gap">
      
      {/* Title Greetings */}
      <section className="mb-4 text-left">
        <h2 className="font-display-lg text-display-lg text-primary mb-2">{t('approvals.title')}</h2>
        <p className="font-body-md text-on-surface-variant">Dual-approval verification console for co-founder expense audits.</p>
      </section>

      {/* Pending Items Tray */}
      <section className="bg-white rounded-[20px] p-card-inner-padding card-shadow border border-outline-variant/40 space-y-4">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
          Awaiting Actions ({pendingExpenses.length})
        </h3>

        {pendingExpenses.length === 0 ? (
          <p className="text-body-sm text-on-surface-variant py-4 text-center italic">All pending approvals are cleared. Great!</p>
        ) : (
          <div className="space-y-4.5">
            {pendingExpenses.map(exp => {
              const creator = partners.find(p => p.id === exp.submittedBy);
              const isSelf = exp.submittedBy === activePartnerId;

              return (
                <div key={exp.id} className="bg-surface rounded-2xl p-4 border border-outline-variant/30 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-body-sm text-on-surface">{exp.vendorName}</h4>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">
                        Logged by {creator?.name.split(' ')[0]} • {exp.category}
                      </p>
                    </div>
                    <span className="font-bold text-body-sm text-primary">{formatIndianCurrency(exp.amount)}</span>
                  </div>

                  <div className="flex justify-between items-center pb-2.5 border-b border-outline-variant/30">
                    <span className="bg-surface-container-high text-[9px] font-bold text-on-surface-variant px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                      {exp.paymentMode}
                    </span>
                    {isSelf && (
                      <span className="text-[10px] text-secondary font-semibold">Awaiting co-founder sign-off</span>
                    )}
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleAction(exp.id, 'Dispute', exp.vendorName, exp.submittedBy)}
                      className="flex-1 h-9 rounded-full border border-error/40 hover:bg-error-container/20 text-error font-bold text-[12px] flex items-center justify-center gap-1 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">report_problem</span>
                      {t('approvals.dispute')}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAction(exp.id, 'Approve', exp.vendorName, exp.submittedBy)}
                      disabled={isSelf}
                      className={`flex-1 h-9 rounded-full font-bold text-[12px] flex items-center justify-center gap-1 transition-all ${
                        isSelf 
                          ? 'bg-surface-container-high border border-outline-variant/30 text-outline cursor-not-allowed'
                          : 'bg-primary hover:bg-primary-container text-on-primary shadow-sm hover-scale'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      {t('approvals.approve')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Developer Webhook logs console terminal */}
      <section className="bg-[#18181b] text-white rounded-[20px] p-card-inner-padding border border-zinc-800 shadow-xl space-y-3">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
          <h3 className="font-label-md text-[10px] text-[#10b981] font-bold uppercase tracking-wider">{t('approvals.whatsappTerminal')}</h3>
        </div>

        <div className="h-36 overflow-y-auto font-mono text-[11px] leading-relaxed text-zinc-300 space-y-1 pr-1 text-left">
          {webhookLogs.map((log, index) => (
            <p key={index} className="break-all whitespace-pre-wrap">{log}</p>
          ))}
        </div>
      </section>
    </div>
  );
};
