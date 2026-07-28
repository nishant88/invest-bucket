import React, { useState } from 'react';
import { useBucket } from '../context/BucketContext';
import { useTranslation } from 'react-i18next';
import { calculateSummaryStats, formatIndianCurrency } from '../utils/calculations';

export const Reports: React.FC = () => {
  const { t } = useTranslation();
  const { partners, expenses, drawings, bizName } = useBucket();

  const [selectedExitingPartnerId, setSelectedExitingPartnerId] = useState<string | null>(null);

  const stats = React.useMemo(() => calculateSummaryStats(partners, expenses, drawings), [partners, expenses, drawings]);
  const approvedExpenses = expenses.filter(e => e.approvalStatus === 'Approved');

  const handleExportCALedger = () => {
    // Generate simple CSV text
    let csv = `DATE,TYPE,MERCHANT/VENDOR,CATEGORY,MODE,SPENT BY,AMOUNT,STATUS\n`;
    
    approvedExpenses.forEach(e => {
      const creator = partners.find(p => p.id === e.submittedBy);
      csv += `${new Date(e.timestamp).toLocaleDateString('en-IN')},EXPENSE,"${e.vendorName.replace(/"/g, '""')}",${e.category},${e.paymentMode},"${creator?.name || 'Unknown'}",${e.amount},Approved\n`;
    });

    drawings.forEach(d => {
      const creator = partners.find(p => p.id === d.partnerId);
      csv += `${new Date(d.timestamp).toLocaleDateString('en-IN')},DRAWING,"Cash Withdrawal",Drawings,cash,"${creator?.name || 'Unknown'}",${d.amount},Approved\n`;
    });

    // Download simulated CSV file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${bizName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_ledger_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert("CA Audit ledger CSV sheet downloaded successfully!");
  };

  const calculateExitSettlement = (exitingId: string) => {
    const exitingPartner = partners.find(p => p.id === exitingId);
    if (!exitingPartner) return null;

    const totalContribution = stats.totalCapitalContributed;
    const exitContribution = stats.partnerContributions.find(c => c.partnerId === exitingId)?.actualContribution || 0;

    const sharePct = totalContribution > 0 ? (exitContribution / totalContribution) : 0;
    const proRataRefund = Math.max(0, Math.round(sharePct * stats.runningBalance));

    return {
      name: exitingPartner.name,
      contribution: exitContribution,
      proRataRefund,
      sharePct: Math.round(sharePct * 100)
    };
  };

  const exitReport = selectedExitingPartnerId ? calculateExitSettlement(selectedExitingPartnerId) : null;

  return (
    <div className="space-y-stack-gap">
      
      {/* Title Greetings */}
      <section className="mb-4 text-left">
        <h2 className="font-display-lg text-display-lg text-primary mb-2">{t('reports.title')}</h2>
        <p className="font-body-md text-on-surface-variant">Export ledger auditing sheets or calculate outgoing partner payouts.</p>
      </section>

      {/* CA Audit sheet download */}
      <section className="bg-white rounded-[20px] p-card-inner-padding card-shadow border border-outline-variant/40 space-y-4 text-left">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">CA Audit File Exporter</h3>
        <p className="text-body-xs text-on-surface-variant leading-relaxed">
          Generate a standard spreadsheet CSV log compiling all approved co-founder receipts, categories, payment modes, and drawings for tax verification.
        </p>
        
        <button
          type="button"
          onClick={handleExportCALedger}
          className="w-full h-11 bg-primary hover:bg-primary-container text-on-primary font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">download</span>
          {t('reports.caExport')}
        </button>
      </section>

      {/* Exit Settlement Calculator */}
      <section className="bg-white rounded-[20px] p-card-inner-padding card-shadow border border-outline-variant/40 space-y-4 text-left">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{t('reports.settlement')}</h3>
        <p className="text-body-xs text-on-surface-variant leading-relaxed">
          Select a co-founder from the active pool to estimate their outgoing payout settlements according to their net contribution split balance.
        </p>

        {/* Select exiting partner */}
        <div className="flex gap-2 w-full">
          {partners.map(p => (
            <button
              type="button"
              key={p.id}
              onClick={() => setSelectedExitingPartnerId(selectedExitingPartnerId === p.id ? null : p.id)}
              className={`flex-1 py-2 rounded-xl text-body-xs font-bold transition-all border ${
                selectedExitingPartnerId === p.id
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-surface border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Calculations display */}
        {exitReport && (
          <div className="bg-surface rounded-2xl p-4 border border-outline-variant/30 space-y-3 animate-fade-in text-body-xs">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Exiting Co-Founder</span>
              <strong className="text-primary font-bold">{exitReport.name}</strong>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Net Contributed Capital</span>
              <strong className="text-on-surface font-semibold">{formatIndianCurrency(exitReport.contribution)}</strong>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Active Equity Contribution Split</span>
              <strong className="text-on-surface font-semibold">{exitReport.sharePct}%</strong>
            </div>

            <div className="flex justify-between items-center pt-2.5 border-t border-outline-variant/30">
              <strong className="text-on-surface font-bold text-body-sm">Pro-Rata Cash Refund Due</strong>
              <strong className="text-primary font-bold text-headline-sm">{formatIndianCurrency(exitReport.proRataRefund)}</strong>
            </div>

            <div className="bg-primary/5 rounded-xl p-3 border border-primary/10 mt-1">
              <h4 className="text-[10px] font-bold text-primary">Settlement Formula:</h4>
              <p className="text-[10px] text-on-surface-variant leading-relaxed mt-1">
                Since some capital has been spent on setup costs, your refund is your active equity share ({exitReport.sharePct}%) of the remaining cash pool ({formatIndianCurrency(stats.runningBalance)}).
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
