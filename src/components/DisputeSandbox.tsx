import React, { useState, useEffect, useRef } from 'react';
import { useBucket } from '../context/BucketContext';
import { useTranslation } from 'react-i18next';
import { formatIndianCurrency } from '../utils/calculations';

export const DisputeSandbox: React.FC = () => {
  const { t } = useTranslation();
  const { partners, expenses, disputeComments, activePartnerId, addDisputeComment, resolveDispute } = useBucket();

  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const disputedExpenses = React.useMemo(() => expenses.filter(e => e.approvalStatus === 'Disputed'), [expenses]);
  const selectedExpense = React.useMemo(() => expenses.find(e => e.id === selectedExpenseId), [expenses, selectedExpenseId]);
  const selectedComments = React.useMemo(() => disputeComments.filter(c => c.expenseId === selectedExpenseId), [disputeComments, selectedExpenseId]);
  const activePartner = React.useMemo(() => partners.find(p => p.id === activePartnerId), [partners, activePartnerId]);

  // Auto-scroll chat box to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [selectedComments, selectedExpenseId]);

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedExpenseId && commentText.trim()) {
      addDisputeComment(selectedExpenseId, commentText.trim());
      setCommentText('');
    }
  };

  const handleAddVoiceNote = () => {
    if (selectedExpenseId && activePartner) {
      const voiceNoteText = `🎤 [Voice Note (${activePartner.name}): "Let's review this together at the location. I think we can ask the vendor to issue a corrected bill."]`;
      addDisputeComment(selectedExpenseId, voiceNoteText);
    }
  };

  const handleResolve = (id: string) => {
    resolveDispute(id);
    setSelectedExpenseId(null);
    alert("Dispute marked as resolved. Expense approved into capital ledger.");
  };

  return (
    <div className="space-y-stack-gap">
      
      {/* Title Greetings */}
      <section className="mb-4 text-left">
        <h2 className="font-display-lg text-display-lg text-primary mb-2">{t('dispute.title')}</h2>
        <p className="font-body-md text-on-surface-variant">Resolve capital disputes through discussions and evidence.</p>
      </section>

      {/* Disputed List */}
      <section className="bg-white rounded-[20px] p-card-inner-padding card-shadow border border-outline-variant/40 space-y-4">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Disputed Logs ({disputedExpenses.length})</h3>

        {disputedExpenses.length === 0 ? (
          <div className="flex flex-col items-center py-6 text-center">
            <span className="material-symbols-outlined text-[36px] text-primary mb-1">celebration</span>
            <p className="text-body-sm text-on-surface-variant font-medium">{t('dispute.noDisputes')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {disputedExpenses.map(exp => {
              const creator = partners.find(p => p.id === exp.submittedBy);
              return (
                <button
                  key={exp.id}
                  onClick={() => setSelectedExpenseId(exp.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex justify-between items-center ${
                    selectedExpenseId === exp.id
                      ? 'bg-primary/5 border-primary'
                      : 'bg-surface border-outline-variant/30 hover:bg-surface-container-low'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-body-sm text-on-surface">{exp.vendorName}</h4>
                    <p className="text-[11px] text-on-surface-variant mt-1">Logged by {creator?.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-body-sm text-error">{formatIndianCurrency(exp.amount)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Comments Thread Panel */}
      {selectedExpense && (
        <section className="bg-white rounded-[20px] p-card-inner-padding card-shadow border border-outline-variant/40 space-y-4 animate-fade-in text-left">
          <div className="flex justify-between items-center pb-3 border-b border-outline-variant/30">
            <div>
              <h3 className="font-bold text-body-sm text-on-surface">{selectedExpense.vendorName}</h3>
              <p className="font-bold text-body-xs text-error mt-0.5">{formatIndianCurrency(selectedExpense.amount)}</p>
            </div>
            <button
              onClick={() => handleResolve(selectedExpense.id)}
              className="bg-primary hover:bg-primary-container text-on-primary text-body-xs font-bold px-3 py-1.5 rounded-full transition-all hover-scale shadow-sm"
            >
              Mark Resolved
            </button>
          </div>

          {/* Comments scroll container */}
          <div 
            ref={chatContainerRef}
            className="h-48 overflow-y-auto bg-surface-container-lowest rounded-xl p-3 border border-outline-variant/20 space-y-4 scroll-smooth"
          >
            {selectedComments.length === 0 ? (
              <p className="text-[11px] text-on-surface-variant italic text-center py-6">No discussions logged yet. Type below to align.</p>
            ) : (
              selectedComments.map(c => {
                const author = partners.find(p => p.id === c.partnerId);
                const isMe = c.partnerId === activePartnerId;
                const isVoice = c.text.startsWith('🎤');

                return (
                  <div 
                    key={c.id}
                    className={`flex flex-col max-w-[85%] ${
                      isMe ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                      {author?.name.split(' ')[0]} {isMe && '(You)'}
                    </span>
                    
                    <div className={`p-3 rounded-2xl text-[12px] leading-relaxed shadow-sm ${
                      isVoice
                        ? 'bg-secondary-container/20 border border-secondary-container/30 text-on-secondary-container font-medium'
                        : isMe
                          ? 'bg-primary text-on-primary rounded-tr-none'
                          : 'bg-surface border border-outline-variant/30 text-on-surface rounded-tl-none'
                    }`}>
                      {c.text}
                    </div>

                    <span className="text-[8px] text-outline mt-1 font-medium">
                      {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Form input */}
          <form onSubmit={handleSendComment} className="flex gap-2 items-center pt-2.5 border-t border-outline-variant/25">
            <button
              type="button"
              onClick={handleAddVoiceNote}
              title="Add Voice Note transcript"
              className="w-10 h-10 shrink-0 bg-secondary-container/20 text-on-secondary-container hover:bg-secondary-container/30 rounded-full flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>

            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Type message or paste registry URL..."
              required
              className="flex-1 bg-surface-container-low rounded-full px-4 py-2 text-[12px] outline-none"
            />

            <button
              type="submit"
              className="w-10 h-10 shrink-0 bg-primary hover:bg-primary-container text-on-primary rounded-full flex items-center justify-center transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
          </form>
        </section>
      )}
    </div>
  );
};
