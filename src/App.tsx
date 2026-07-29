import React, { useState } from 'react';
import { BucketProvider, useBucket } from './context/BucketContext';
import { useTranslation } from 'react-i18next';
import { VentureSetup } from './components/VentureSetup';
import { Dashboard } from './components/Dashboard';
import { ExpenseLogger } from './components/ExpenseLogger';
import { ApprovalsInbox } from './components/ApprovalsInbox';
import { DisputeSandbox } from './components/DisputeSandbox';
import { DrawingsLedger } from './components/DrawingsLedger';
import { VendorDirectory } from './components/VendorDirectory';
import { MilestoneVault } from './components/MilestoneVault';
import { MouGenerator } from './components/MouGenerator';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { DesignSpecs } from './components/DesignSpecs';
import { Auth } from './components/Auth';
import { TeamManagement } from './components/TeamManagement';
import { VentureHealth } from './components/VentureHealth';

const AppContent: React.FC = () => {
  const { t } = useTranslation();
  const { isConfigured, bizName, isLoading, userSession, logoutUser } = useBucket();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'expenses' | 'approvals' | 'more'>('dashboard');
  const [moreSubScreen, setMoreSubScreen] = useState<'menu' | 'disputes' | 'drawings' | 'vendors' | 'milestones' | 'mou' | 'reports' | 'settings' | 'designspecs' | 'team' | 'health'>('menu');
  const [partnerDropdownOpen, setPartnerDropdownOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-primary">
        <span className="material-symbols-outlined text-[44px] animate-spin">sync</span>
        <p className="font-bold text-body-sm mt-3.5">Synchronizing Ledger Bucket...</p>
      </div>
    );
  }

  if (!userSession) {
    return <Auth />;
  }

  // Render onboarding card if not configured
  if (!isConfigured) {
    return (
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-[60px] bg-white/45 backdrop-blur-[28px] border-b border-outline-variant/35 px-4 shrink-0 flex items-center justify-between z-10">
          <span className="font-display-lg text-headline-sm text-primary font-bold">Ledger Setup</span>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-5 pb-10">
          <VentureSetup onComplete={() => setActiveTab('dashboard')} />
        </main>
      </div>
    );
  }

  const getHeaderTitle = () => {
    if (activeTab === 'dashboard') return bizName;
    if (activeTab === 'expenses') return t('expense.title');
    if (activeTab === 'approvals') return t('approvals.title');
    if (activeTab === 'more') {
      if (moreSubScreen === 'menu') return 'Bucket Operations';
      if (moreSubScreen === 'disputes') return t('dispute.title');
      if (moreSubScreen === 'drawings') return t('drawings.title');
      if (moreSubScreen === 'vendors') return t('vendors.title');
      if (moreSubScreen === 'milestones') return t('milestones.title');
      if (moreSubScreen === 'mou') return t('mou.title');
      if (moreSubScreen === 'reports') return t('reports.title');
      if (moreSubScreen === 'settings') return t('settings.title');
      if (moreSubScreen === 'designspecs') return 'Design Specifications';
      if (moreSubScreen === 'team') return 'Manage Team';
      if (moreSubScreen === 'health') return 'Venture Health Intelligence';
    }
    return bizName;
  };

  const handleMoreNavigation = (sub: typeof moreSubScreen) => {
    setMoreSubScreen(sub);
    setActiveTab('more');
  };

  const renderContent = () => {
    if (activeTab === 'dashboard') return <Dashboard />;
    if (activeTab === 'expenses') return <ExpenseLogger />;
    if (activeTab === 'approvals') return <ApprovalsInbox />;
    if (activeTab === 'more') {
      if (moreSubScreen === 'menu') return renderMoreMenu();
      if (moreSubScreen === 'disputes') return <DisputeSandbox />;
      if (moreSubScreen === 'drawings') return <DrawingsLedger />;
      if (moreSubScreen === 'vendors') return <VendorDirectory />;
      if (moreSubScreen === 'milestones') return <MilestoneVault />;
      if (moreSubScreen === 'mou') return <MouGenerator />;
      if (moreSubScreen === 'reports') return <Reports />;
      if (moreSubScreen === 'settings') return <Settings />;
      if (moreSubScreen === 'designspecs') return <DesignSpecs />;
      if (moreSubScreen === 'team') return <TeamManagement />;
      if (moreSubScreen === 'health') return <VentureHealth />;
    }
    return <Dashboard />;
  };

  const renderMoreMenu = () => (
    <div className="grid grid-cols-2 gap-3.5 pt-1 overflow-visible animate-fade-in">
      <button
        onClick={() => handleMoreNavigation('disputes')}
        className="h-[135px] bg-white hover:bg-surface-container-low border border-outline-variant/30 rounded-[24px] p-4 flex flex-col items-center justify-center text-center transition-all hover-scale shadow-sm overflow-visible"
      >
        <span className="material-symbols-outlined text-[38px] text-primary">report_problem</span>
        <h4 className="font-bold text-[13px] text-primary tracking-wide leading-tight uppercase mt-1.5">{t('dispute.title')}</h4>
        <p className="text-[10px] text-on-surface-variant font-medium leading-tight mt-1 max-w-[90%] truncate w-full">Align arguments</p>
      </button>

      <button
        onClick={() => handleMoreNavigation('drawings')}
        className="h-[135px] bg-white hover:bg-surface-container-low border border-outline-variant/30 rounded-[24px] p-4 flex flex-col items-center justify-center text-center transition-all hover-scale shadow-sm overflow-visible"
      >
        <span className="material-symbols-outlined text-[38px] text-primary">payments</span>
        <h4 className="font-bold text-[13px] text-primary tracking-wide leading-tight uppercase mt-1.5">{t('drawings.title')}</h4>
        <p className="text-[10px] text-on-surface-variant font-medium leading-tight mt-1 max-w-[90%] truncate w-full">Log drawings</p>
      </button>

      <button
        onClick={() => handleMoreNavigation('vendors')}
        className="h-[135px] bg-white hover:bg-surface-container-low border border-outline-variant/30 rounded-[24px] p-4 flex flex-col items-center justify-center text-center transition-all hover-scale shadow-sm overflow-visible"
      >
        <span className="material-symbols-outlined text-[38px] text-primary">storefront</span>
        <h4 className="font-bold text-[13px] text-primary tracking-wide leading-tight uppercase mt-1.5">{t('vendors.title')}</h4>
        <p className="text-[10px] text-on-surface-variant font-medium leading-tight mt-1 max-w-[90%] truncate w-full">UPI directory</p>
      </button>

      <button
        onClick={() => handleMoreNavigation('milestones')}
        className="h-[135px] bg-white hover:bg-surface-container-low border border-outline-variant/30 rounded-[24px] p-4 flex flex-col items-center justify-center text-center transition-all hover-scale shadow-sm overflow-visible"
      >
        <span className="material-symbols-outlined text-[38px] text-primary">task_alt</span>
        <h4 className="font-bold text-[13px] text-primary tracking-wide leading-tight uppercase mt-1.5">{t('milestones.title')}</h4>
        <p className="text-[10px] text-on-surface-variant font-medium leading-tight mt-1 max-w-[90%] truncate w-full">Lock budgets</p>
      </button>

      <button
        onClick={() => handleMoreNavigation('mou')}
        className="h-[135px] bg-white hover:bg-surface-container-low border border-outline-variant/30 rounded-[24px] p-4 flex flex-col items-center justify-center text-center transition-all hover-scale shadow-sm overflow-visible"
      >
        <span className="material-symbols-outlined text-[38px] text-primary">gavel</span>
        <h4 className="font-bold text-[13px] text-primary tracking-wide leading-tight uppercase mt-1.5">{t('mou.title')}</h4>
        <p className="text-[10px] text-on-surface-variant font-medium leading-tight mt-1 max-w-[90%] truncate w-full">Legal MoU</p>
      </button>

      <button
        onClick={() => handleMoreNavigation('reports')}
        className="h-[135px] bg-white hover:bg-surface-container-low border border-outline-variant/30 rounded-[24px] p-4 flex flex-col items-center justify-center text-center transition-all hover-scale shadow-sm overflow-visible"
      >
        <span className="material-symbols-outlined text-[38px] text-primary">summarize</span>
        <h4 className="font-bold text-[13px] text-primary tracking-wide leading-tight uppercase mt-1.5">{t('reports.title')}</h4>
        <p className="text-[10px] text-on-surface-variant font-medium leading-tight mt-1 max-w-[90%] truncate w-full">Payout PDF & CSV</p>
      </button>

      <button
        onClick={() => handleMoreNavigation('settings')}
        className="h-[135px] bg-white hover:bg-surface-container-low border border-outline-variant/30 rounded-[24px] p-4 flex flex-col items-center justify-center text-center transition-all hover-scale shadow-sm overflow-visible"
      >
        <span className="material-symbols-outlined text-[38px] text-primary">settings</span>
        <h4 className="font-bold text-[13px] text-primary tracking-wide leading-tight uppercase mt-1.5">{t('settings.title')}</h4>
        <p className="text-[10px] text-on-surface-variant font-medium leading-tight mt-1 max-w-[90%] truncate w-full">Settings</p>
      </button>

      <button
        onClick={() => handleMoreNavigation('team')}
        className="h-[135px] bg-white hover:bg-surface-container-low border border-outline-variant/30 rounded-[24px] p-4 flex flex-col items-center justify-center text-center transition-all hover-scale shadow-sm overflow-visible"
      >
        <span className="material-symbols-outlined text-[38px] text-primary">groups</span>
        <h4 className="font-bold text-[13px] text-primary tracking-wide leading-tight uppercase mt-1.5">Manage Team</h4>
        <p className="text-[10px] text-on-surface-variant font-medium leading-tight mt-1 max-w-[90%] truncate w-full">Invites & split targets</p>
      </button>

      <button
        onClick={() => handleMoreNavigation('health')}
        className="h-[135px] bg-white hover:bg-surface-container-low border border-outline-variant/30 rounded-[24px] p-4 flex flex-col items-center justify-center text-center transition-all hover-scale shadow-sm overflow-visible"
      >
        <span className="material-symbols-outlined text-[38px] text-primary">analytics</span>
        <h4 className="font-bold text-[13px] text-primary tracking-wide leading-tight uppercase mt-1.5">Venture Health</h4>
        <p className="text-[10px] text-on-surface-variant font-medium leading-tight mt-1 max-w-[90%] truncate w-full">Predictive success AI</p>
      </button>

      <button
        onClick={() => handleMoreNavigation('designspecs')}
        className="h-[135px] bg-white hover:bg-surface-container-low border border-outline-variant/30 rounded-[24px] p-4 flex flex-col items-center justify-center text-center transition-all hover-scale shadow-sm overflow-visible"
      >
        <span className="material-symbols-outlined text-[38px] text-primary">design_services</span>
        <h4 className="font-bold text-[13px] text-primary tracking-wide leading-tight uppercase mt-1.5">Design Specs</h4>
        <p className="text-[10px] text-on-surface-variant font-medium leading-tight mt-1 max-w-[90%] truncate w-full">Mockup viewer</p>
      </button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      
      {/* Mock iOS Status Bar & Dynamic Island */}
      <div className="h-10 px-6 shrink-0 flex items-center justify-between z-20 text-on-surface font-semibold text-[13px] bg-white select-none relative">
        <span>9:41</span>
        <div className="w-[88px] h-[25px] bg-[#0c0c0d] rounded-full absolute left-1/2 -translate-x-1/2 top-2 flex items-center justify-center border border-white/5" />
        <div className="flex items-center gap-1.5 text-on-surface-variant">
          <span className="material-symbols-outlined text-[15px]">signal_cellular_alt</span>
          <span className="material-symbols-outlined text-[15px]">wifi</span>
          <span className="material-symbols-outlined text-[18px]">battery_std</span>
        </div>
      </div>

      {/* Dynamic Header */}
      <header className="h-[62px] bg-white border-b border-outline-variant/35 px-4 shrink-0 flex items-center justify-between z-10 relative shadow-sm">
        <div className="flex items-center gap-2 max-w-[65%]">
          {activeTab === 'more' && moreSubScreen !== 'menu' && (
            <button
              onClick={() => setMoreSubScreen('menu')}
              className="text-[#0f172a] hover:bg-slate-100 p-1.5 rounded-lg flex items-center justify-center transition-colors mr-1"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
          )}
          
          <div className="flex items-center">
            {/* Mint green circle with wallet */}
            <div className="w-9 h-9 rounded-full bg-[#d1fae5] flex items-center justify-center text-[#065f46] shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>wallet</span>
            </div>
            {/* Title text */}
            <span className="font-display font-extrabold text-[16px] text-[#065f46] tracking-tight ml-2.5 truncate">
              {activeTab === 'dashboard' ? (bizName || "Investor's Bucket") : getHeaderTitle()}
            </span>
          </div>
        </div>

        {/* Right side items: Bell Notification and Active Partner Avatar */}
        <div className="flex items-center gap-3">
          <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1.5 rounded-full hover:bg-slate-100">
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 0" }}>notifications</span>
          </button>

          {/* User session details and logout trigger */}
          <div className="relative">
            <button
              onClick={() => setPartnerDropdownOpen(!partnerDropdownOpen)}
              className="w-9 h-9 rounded-full border-2 border-[#a7f3d0] p-[2px] flex items-center justify-center overflow-hidden shrink-0 hover:border-primary transition-all bg-white shadow-sm"
              title="View Account"
            >
              <div 
                className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-[11px] bg-[#0d1c32]"
              >
                {userSession?.name.split(' ').map(n => n[0]).join('')}
              </div>
            </button>

            {partnerDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-outline-variant/40 rounded-2xl shadow-xl z-30 py-2 animate-fade-in text-left">
                <div className="px-3.5 py-1.5 border-b border-outline-variant/30 mb-1">
                  <p className="text-body-xs font-black text-[#0d1c32]">{userSession?.name}</p>
                  <p className="text-[9px] text-slate-500 font-semibold truncate">{userSession?.email}</p>
                </div>
                <button
                  onClick={() => {
                    handleMoreNavigation('team');
                    setPartnerDropdownOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 text-body-xs font-bold text-slate-700 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">groups</span>
                  Manage Team
                </button>
                <button
                  onClick={() => {
                    logoutUser();
                    setPartnerDropdownOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-red-50 text-body-xs font-bold text-red-600 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-40">
        {renderContent()}
      </main>

      {/* Floating Action Speed Dial Menu */}
      <div className="absolute bottom-24 right-5 flex flex-col-reverse items-end gap-3 z-30 group pb-3">
        {/* Main Trigger FAB */}
        <button
          className="w-12 h-12 bg-black text-[#fae403] rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95 group-hover:rotate-45"
          title="Quick Actions"
        >
          <span className="material-symbols-outlined text-[26px] font-bold">add</span>
        </button>

        {/* Action 1: Scan OCR */}
        <div className="flex items-center opacity-0 translate-y-3 scale-90 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300 delay-[50ms]">
          <span className="bg-[#0d1c32] text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-md mr-1 select-none">
            Scan OCR
          </span>
          <button
            onClick={() => {
              setActiveTab('expenses');
              setMoreSubScreen('menu');
            }}
            className="w-10 h-10 bg-black text-[#fae403] rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
            title="Scan OCR"
          >
            <span className="material-symbols-outlined text-[20px]">photo_camera</span>
          </button>
        </div>

        {/* Action 2: Approvals Inbox */}
        <div className="flex items-center opacity-0 translate-y-3 scale-90 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-300">
          <span className="bg-[#0d1c32] text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-md mr-1 select-none">
            Inbox Approvals
          </span>
          <button
            onClick={() => {
              setActiveTab('approvals');
              setMoreSubScreen('menu');
            }}
            className="w-10 h-10 bg-black text-[#fae403] rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
            title="Approvals Inbox"
          >
            <span className="material-symbols-outlined text-[20px]">pending_actions</span>
          </button>
        </div>
      </div>

      {/* Floating Bottom Nav Bar */}
      <nav className="absolute bottom-5 left-4 right-4 h-16 bg-[#0d1c32] backdrop-blur-md border border-white/10 rounded-full flex items-center justify-around z-30 shadow-[0_16px_40px_rgba(13,28,50,0.25)]">
        <button
          onClick={() => {
            setActiveTab('dashboard');
            setMoreSubScreen('menu');
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full rounded-full transition-all ${
            activeTab === 'dashboard' ? 'text-[#b2ee4a]' : 'text-white/60 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeTab === 'dashboard' ? "'FILL' 1" : "" }}>dashboard</span>
          <span className="text-[9px] font-bold mt-0.5">Ledger</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('expenses');
            setMoreSubScreen('menu');
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full rounded-full transition-all ${
            activeTab === 'expenses' ? 'text-[#b2ee4a]' : 'text-white/60 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeTab === 'expenses' ? "'FILL' 1" : "" }}>receipt_long</span>
          <span className="text-[9px] font-bold mt-0.5">Log Spend</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('approvals');
            setMoreSubScreen('menu');
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full rounded-full transition-all ${
            activeTab === 'approvals' ? 'text-[#b2ee4a]' : 'text-white/60 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeTab === 'approvals' ? "'FILL' 1" : "" }}>pending_actions</span>
          <span className="text-[9px] font-bold mt-0.5">Inbox</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('more');
            setMoreSubScreen('menu');
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full rounded-full transition-all ${
            activeTab === 'more' ? 'text-[#b2ee4a]' : 'text-white/60 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeTab === 'more' ? "'FILL' 1" : "" }}>grid_view</span>
          <span className="text-[9px] font-bold mt-0.5">More</span>
        </button>
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <BucketProvider>
      <AppContent />
    </BucketProvider>
  );
}
