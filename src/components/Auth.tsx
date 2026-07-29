import React, { useState } from 'react';
import { useBucket } from '../context/BucketContext';

export const Auth: React.FC = () => {
  const { registerUser, loginUser } = useBucket();
  const [isLogin, setIsLogin] = useState(true);

  // Form states
  const [bizName, setBizName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const success = loginUser(email, password);
      if (!success) {
        setError('Invalid email credentials or password.');
      }
    } else {
      if (!bizName.trim() || !name.trim() || !email.trim() || !mobile.trim() || !password.trim()) {
        setError('All fields are required.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      registerUser(name.trim(), email.trim(), mobile.trim(), password, bizName.trim());
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-4 py-8 select-none min-h-screen bg-gradient-to-br from-[#f4f8ee] via-white to-[#ecf3e3]">
      <div className="w-full max-w-md mx-auto bg-white/60 backdrop-blur-[24px] rounded-[32px] p-6 border border-white/40 shadow-xl text-left animate-fade-in">
        {/* Header Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#0d1c32]/10 flex items-center justify-center text-[#0d1c32] mx-auto shadow-sm mb-3">
            <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>wallet</span>
          </div>
          <h2 className="font-display font-extrabold text-[22px] text-[#0d1c32] tracking-tight leading-tight">
            {isLogin ? 'Welcome Back' : 'Create Ledger Bucket'}
          </h2>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            {isLogin ? 'Sign in to access your business venture splits' : 'Set up your co-founder account and active ledger'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl px-4 py-2.5 text-body-xs font-semibold flex items-center gap-1.5 animate-fade-in">
            <span className="material-symbols-outlined text-[16px] shrink-0">info</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              {/* Business Name */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Business Venture Name</label>
                <input
                  type="text"
                  required
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  placeholder="e.g. Harvest Cafe & Roasters"
                  className="w-full bg-white/80 rounded-xl px-3.5 py-2.5 text-body-sm text-on-surface border border-outline-variant/30 focus:border-primary outline-none transition-all"
                />
              </div>

              {/* Owner Name */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jerome Bell"
                  className="w-full bg-white/80 rounded-xl px-3.5 py-2.5 text-body-sm text-on-surface border border-outline-variant/30 focus:border-primary outline-none transition-all"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-white/80 rounded-xl px-3.5 py-2.5 text-body-sm text-on-surface border border-outline-variant/30 focus:border-primary outline-none transition-all"
                />
              </div>
            </>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. jerome@bell.com"
              className="w-full bg-white/80 rounded-xl px-3.5 py-2.5 text-body-sm text-on-surface border border-outline-variant/30 focus:border-primary outline-none transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/80 rounded-xl px-3.5 py-2.5 text-body-sm text-on-surface border border-outline-variant/30 focus:border-primary outline-none transition-all"
            />
          </div>

          {!isLogin && (
            /* Confirm Password */
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/80 rounded-xl px-3.5 py-2.5 text-body-sm text-on-surface border border-outline-variant/30 focus:border-primary outline-none transition-all"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#0d1c32] hover:bg-[#122744] text-[#fae403] font-bold text-body-sm py-3 rounded-2xl transition-all shadow-md active:scale-95 mt-2"
          >
            {isLogin ? 'Sign In' : 'Sign Up & Configure'}
          </button>
        </form>

        {/* Toggle link */}
        <div className="text-center mt-5 text-[11px] text-slate-500 font-medium">
          {isLogin ? (
            <p>
              Don't have a ledger yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
                className="text-[#0d1c32] font-bold hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already configured a ledger?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
                className="text-[#0d1c32] font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
