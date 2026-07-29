import React, { useState } from 'react';
import { useBucket } from '../context/BucketContext';
import { formatIndianCurrency } from '../utils/calculations';

export const TeamManagement: React.FC = () => {
  const { partners, inviteTeamMember, bizName } = useBucket();

  // Invite form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [method, setMethod] = useState<'email' | 'mobile'>('email');
  const [contactVal, setContactVal] = useState('');
  const [capitalTarget, setCapitalTarget] = useState('');
  const [splitRatio, setSplitRatio] = useState('');
  const [msg, setMsg] = useState({ text: '', type: 'success' });

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ text: '', type: 'success' });

    if (partners.length >= 5) {
      setMsg({ text: 'A venture team cannot have more than 5 members.', type: 'error' });
      return;
    }

    const numericCap = parseFloat(capitalTarget) || 0;
    const numericSplit = parseFloat(splitRatio) || 0;

    if (!name.trim() || !role.trim() || !contactVal.trim() || numericCap <= 0 || numericSplit <= 0) {
      setMsg({ text: 'Please fill in all invite parameters with valid positive scores.', type: 'error' });
      return;
    }

    // Check split target limits
    const owner = partners.find(p => p.id === 'p1');
    if (owner && owner.targetSplitRatio < numericSplit) {
      setMsg({ text: `Split ratio cannot exceed the owner's remaining split share of ${owner.targetSplitRatio}%.`, type: 'error' });
      return;
    }

    const success = inviteTeamMember(name.trim(), contactVal.trim(), role.trim(), numericCap, numericSplit);
    if (success) {
      setMsg({ text: `Invitation sent successfully to ${name}!`, type: 'success' });

      // Trigger native intent
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const separator = isIOS ? '&' : '?';
      const bodyText = `Hi ${name}! You are invited to join my business venture "${bizName}" on Investor's Bucket. Your target capital contribution is ${formatIndianCurrency(numericCap)} for a split share of ${numericSplit}%.`;

      if (method === 'mobile') {
        window.location.href = `sms:${contactVal}${separator}body=${encodeURIComponent(bodyText)}`;
      } else {
        window.location.href = `mailto:${contactVal}?subject=${encodeURIComponent("Join " + bizName + " on Investor's Bucket")}&body=${encodeURIComponent(bodyText)}`;
      }

      // Reset inputs
      setName('');
      setRole('');
      setContactVal('');
      setCapitalTarget('');
      setSplitRatio('');
    } else {
      setMsg({ text: 'Could not send invitation.', type: 'error' });
    }
  };

  return (
    <div className="space-y-stack-gap animate-fade-in text-left">
      
      {/* Overview Head card */}
      <section className="bg-gradient-to-br from-[#0d1c32] via-[#122b4d] to-[#0d1c32] text-white rounded-[28px] p-5 shadow-lg border border-white/5 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-[#fae403]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-24 h-24 bg-[#b2ee4a]/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h3 className="text-body-lg font-extrabold text-[#fae403] tracking-wide uppercase">Venture Team</h3>
            <p className="text-[11px] text-white/80 font-medium mt-1">Manage co-founders, advisors and active members</p>
          </div>
          <div className="bg-white/10 px-3 py-2 rounded-2xl border border-white/10 text-center select-none">
            <p className="text-[20px] font-black text-[#b2ee4a] leading-none">{partners.length} / 5</p>
            <p className="text-[8px] text-white/70 font-semibold uppercase tracking-wider mt-1">Capacity</p>
          </div>
        </div>
      </section>

      {/* Notification prompt */}
      {msg.text && (
        <div className={`rounded-2xl px-4 py-3 text-body-xs font-bold flex items-center gap-1.5 animate-fade-in border ${
          msg.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
        }`}>
          <span className="material-symbols-outlined text-[18px]">
            {msg.type === 'error' ? 'info' : 'check_circle'}
          </span>
          {msg.text}
        </div>
      )}

      {/* Active Team Members list */}
      <section className="bg-white rounded-[24px] p-5 card-shadow border border-outline-variant/40 space-y-4">
        <h4 className="font-label-md text-label-md text-slate-500 uppercase tracking-wider">Active Team Roster</h4>
        
        <div className="space-y-3.5">
          {partners.map(p => (
            <div key={p.id} className="flex items-center justify-between p-3 bg-surface rounded-2xl border border-outline-variant/20 hover:shadow-sm transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-body-xs text-black ${
                  p.id === 'p1' ? 'bg-[#fae403]' : 'bg-[#b2ee4a]'
                }`}>
                  {p.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h5 className="font-display font-extrabold text-body-sm text-[#0d1c32] flex items-center gap-1.5">
                    {p.name}
                    {p.id === 'p1' && (
                      <span className="bg-[#0d1c32]/10 text-[#0d1c32] text-[8px] font-bold px-1.5 py-0.5 rounded-md">Owner</span>
                    )}
                  </h5>
                  <p className="text-[10px] text-slate-500 font-semibold">{p.role} • {p.emailOrMobile}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-headline-sm text-body-xs font-black text-[#0d1c32]">{formatIndianCurrency(p.capitalTarget)}</p>
                <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                  p.status === 'Owner' || p.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {p.targetSplitRatio}% split • {p.status || 'Accepted'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Invite Member panel */}
      {partners.length < 5 ? (
        <section className="bg-white rounded-[24px] p-5 card-shadow border border-outline-variant/40 space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">person_add</span>
            <h4 className="font-label-md text-label-md text-slate-500 uppercase tracking-wider">Invite New Co-Founder</h4>
          </div>

          <form onSubmit={handleSendInvite} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Co-Founder Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Arjun Sharma"
                className="w-full bg-surface-container-low rounded-xl px-3.5 py-2.5 text-body-sm text-on-surface border border-outline-variant/30 focus:border-primary outline-none transition-all"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Operational Role</label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Tech Lead & Backend Developer"
                className="w-full bg-surface-container-low rounded-xl px-3.5 py-2.5 text-body-sm text-on-surface border border-outline-variant/30 focus:border-primary outline-none transition-all"
              />
            </div>

            {/* Invite Method Toggle */}
            <div className="grid grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => setMethod('email')}
                className={`py-2 px-3 rounded-xl border text-body-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                  method === 'email' ? 'bg-[#0d1c32] border-[#0d1c32] text-[#fae403]' : 'bg-surface border-outline-variant/30 text-slate-500'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">mail</span>
                Email Invite
              </button>
              <button
                type="button"
                onClick={() => setMethod('mobile')}
                className={`py-2 px-3 rounded-xl border text-body-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                  method === 'mobile' ? 'bg-[#0d1c32] border-[#0d1c32] text-[#fae403]' : 'bg-surface border-outline-variant/30 text-slate-500'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">phone_iphone</span>
                Mobile Invite
              </button>
            </div>

            {/* Contact Input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">
                {method === 'email' ? 'Email Address' : 'Mobile Number'}
              </label>
              <input
                type={method === 'email' ? 'email' : 'tel'}
                required
                value={contactVal}
                onChange={(e) => setContactVal(e.target.value)}
                placeholder={method === 'email' ? 'arjun@sharma.com' : '+91 99999 88888'}
                className="w-full bg-surface-container-low rounded-xl px-3.5 py-2.5 text-body-sm text-on-surface border border-outline-variant/30 focus:border-primary outline-none transition-all"
              />
            </div>

            {/* Split specifications */}
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Capital Budget (INR)</label>
                <input
                  type="number"
                  required
                  value={capitalTarget}
                  onChange={(e) => setCapitalTarget(e.target.value)}
                  placeholder="200000"
                  className="w-full bg-surface-container-low rounded-xl px-3.5 py-2.5 text-body-sm text-on-surface border border-outline-variant/30 focus:border-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Target Split Ratio (%)</label>
                <input
                  type="number"
                  required
                  value={splitRatio}
                  onChange={(e) => setSplitRatio(e.target.value)}
                  placeholder="20"
                  max="100"
                  className="w-full bg-surface-container-low rounded-xl px-3.5 py-2.5 text-body-sm text-on-surface border border-outline-variant/30 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0d1c32] hover:bg-[#122744] text-[#fae403] font-bold text-body-xs py-3 rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 mt-2"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              Send Activation Invitation
            </button>
          </form>
        </section>
      ) : (
        <section className="bg-white rounded-[24px] p-5 card-shadow border border-outline-variant/40 text-center py-6">
          <span className="material-symbols-outlined text-amber-500 text-[40px]">group_off</span>
          <h5 className="font-display font-extrabold text-body-sm text-[#0d1c32] mt-2">Team Limit Reached</h5>
          <p className="text-[10px] text-slate-500 mt-1 max-w-[85%] mx-auto">
            Venture ledger buckets are restricted to a maximum of 5 registered partners to maintain clean active shares.
          </p>
        </section>
      )}
    </div>
  );
};
