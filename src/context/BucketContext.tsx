import React, { createContext, useContext, useState, useEffect } from 'react';
import { Partner, Expense, Drawing, Milestone, DisputeComment } from '../utils/calculations';

export interface UserSession {
  name: string;
  email: string;
  mobile: string;
  password?: string;
  bizName?: string;
}

interface BucketContextType {
  bizName: string;
  isConfigured: boolean;
  partners: Partner[];
  expenses: Expense[];
  drawings: Drawing[];
  disputeComments: DisputeComment[];
  milestones: Milestone[];
  activePartnerId: string;
  setActivePartnerId: (id: string) => void;
  updateBucketSetup: (bizName: string, partners: Partner[]) => void;
  addExpense: (amount: number, vendorName: string, category: string, paymentMode: 'cash' | 'UPI' | 'card', milestoneId: string | null, isOutOfPocket: boolean, submittedBy?: string) => void;
  approveExpense: (id: string) => void;
  disputeExpense: (id: string) => void;
  resolveDispute: (id: string) => void;
  addDisputeComment: (expenseId: string, text: string) => void;
  addDrawing: (partnerId: string, amount: number, reason: string) => void;
  lockMilestone: (id: string) => void;
  unlockMilestone: (id: string) => void;
  resetBucket: () => void;
  isLoading: boolean;

  // Authentication & Invites
  userSession: UserSession | null;
  registerUser: (name: string, email: string, mobile: string, password: string, bizName: string) => void;
  loginUser: (email: string, password: string) => boolean;
  logoutUser: () => void;
  inviteTeamMember: (name: string, emailOrMobile: string, role: string, capitalTarget: number, splitRatio: number) => boolean;
}

const BucketContext = createContext<BucketContextType | undefined>(undefined);

// Initial default milestones structure
const defaultMilestones: Milestone[] = [
  { id: 'm1', name: 'Lease & Deposit', phaseOrder: 1, targetBudget: 300000, isLocked: false },
  { id: 'm2', name: 'Kitchen Equipments & Interiors', phaseOrder: 2, targetBudget: 400000, isLocked: false },
  { id: 'm3', name: 'Procurement & Inventory', phaseOrder: 3, targetBudget: 200000, isLocked: true },
  { id: 'm4', name: 'Licenses & Marketing', phaseOrder: 4, targetBudget: 100000, isLocked: true },
];

export const BucketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const [bizName, setBizName] = useState('');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [disputeComments, setDisputeComments] = useState<DisputeComment[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>(defaultMilestones);
  const [activePartnerId, setActivePartnerId] = useState('p1');
  const [userSession, setUserSession] = useState<UserSession | null>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('@bucket_logged_in_user');
      if (storedUser) {
        setUserSession(JSON.parse(storedUser));
      }

      const storedSetup = localStorage.getItem('@bucket_setup');
      if (storedSetup) {
        const { bizName: loadedBiz, partners: loadedPartners, isConfigured: loadedConfigured } = JSON.parse(storedSetup);
        setBizName(loadedBiz);
        setPartners(loadedPartners);
        setIsConfigured(loadedConfigured);
      }

      const storedExpenses = localStorage.getItem('@bucket_expenses');
      if (storedExpenses) setExpenses(JSON.parse(storedExpenses));

      const storedDrawings = localStorage.getItem('@bucket_drawings');
      if (storedDrawings) setDrawings(JSON.parse(storedDrawings));

      const storedComments = localStorage.getItem('@bucket_comments');
      if (storedComments) setDisputeComments(JSON.parse(storedComments));

      const storedMilestones = localStorage.getItem('@bucket_milestones');
      if (storedMilestones) setMilestones(JSON.parse(storedMilestones));

      const storedActivePartner = localStorage.getItem('@bucket_active_partner');
      if (storedActivePartner) {
        setActivePartnerId(storedActivePartner);
      } else {
        setActivePartnerId('p1');
      }
    } catch (err) {
      console.error('Failed to load state from localStorage:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateActivePartnerId = (id: string) => {
    setActivePartnerId(id);
    localStorage.setItem('@bucket_active_partner', id);
  };

  const registerUser = (name: string, email: string, mobile: string, password: string, bizName: string) => {
    const session: UserSession = { name, email, mobile, password, bizName };
    setUserSession(session);
    localStorage.setItem('@bucket_user_session', JSON.stringify(session));
    localStorage.setItem('@bucket_logged_in_user', JSON.stringify(session));

    const ownerPartner: Partner = {
      id: 'p1',
      name,
      role: 'Owner & Operator',
      initialContribution: 0,
      capitalTarget: 500000,
      targetSplitRatio: 100, // Starts at 100% split for single owner
      emailOrMobile: email,
      status: 'Owner'
    };

    setBizName(bizName);
    setPartners([ownerPartner]);
    setIsConfigured(true);
    setActivePartnerId('p1');

    const seedExpenses: Expense[] = [
      { id: 'e1', amount: 150000, vendorName: 'City Real Estate', category: 'Lease & Deposit', paymentMode: 'UPI', submittedBy: 'p1', approvalStatus: 'Approved', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), milestoneId: 'm1', isOutOfPocket: true },
      { id: 'e2', amount: 50000, vendorName: 'Raw Materials Corp', category: 'Inventory', paymentMode: 'card', submittedBy: 'p1', approvalStatus: 'Approved', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), milestoneId: 'm3', isOutOfPocket: true }
    ];

    setExpenses(seedExpenses);
    setDisputeComments([]);
    setDrawings([]);
    setMilestones(defaultMilestones);

    localStorage.setItem('@bucket_setup', JSON.stringify({ bizName, partners: [ownerPartner], isConfigured: true }));
    localStorage.setItem('@bucket_expenses', JSON.stringify(seedExpenses));
    localStorage.setItem('@bucket_comments', JSON.stringify([]));
    localStorage.setItem('@bucket_drawings', JSON.stringify([]));
    localStorage.setItem('@bucket_milestones', JSON.stringify(defaultMilestones));
    localStorage.setItem('@bucket_active_partner', 'p1');
  };

  const loginUser = (email: string, password: string) => {
    const stored = localStorage.getItem('@bucket_user_session');
    if (stored) {
      const parsed = JSON.parse(stored) as UserSession;
      if (parsed.email.toLowerCase() === email.toLowerCase() && parsed.password === password) {
        setUserSession(parsed);
        localStorage.setItem('@bucket_logged_in_user', JSON.stringify(parsed));
        return true;
      }
    }
    return false;
  };

  const logoutUser = () => {
    setUserSession(null);
    localStorage.removeItem('@bucket_logged_in_user');
  };

  const inviteTeamMember = (name: string, emailOrMobile: string, role: string, capitalTarget: number, splitRatio: number) => {
    if (partners.length >= 5) {
      alert("Maximum of 5 team members allowed.");
      return false;
    }

    const newPartner: Partner = {
      id: `p_${Date.now()}`,
      name,
      role,
      initialContribution: 0,
      capitalTarget,
      targetSplitRatio: splitRatio,
      emailOrMobile,
      status: 'Invited'
    };

    // Auto-adjust owner's split target split ratio to keep sum = 100
    const updatedPartners = partners.map(p => {
      if (p.id === 'p1') {
        return { ...p, targetSplitRatio: Math.max(0, p.targetSplitRatio - splitRatio) };
      }
      return p;
    });

    const newPartners = [...updatedPartners, newPartner];
    setPartners(newPartners);

    localStorage.setItem('@bucket_setup', JSON.stringify({ bizName, partners: newPartners, isConfigured: true }));
    return true;
  };

  const updateBucketSetup = (newBizName: string, newPartners: Partner[]) => {
    setBizName(newBizName);
    setPartners(newPartners);
    setIsConfigured(true);

    const seedExpenses: Expense[] = [
      { id: 'e1', amount: 150000, vendorName: 'City Real Estate', category: 'Lease & Deposit', paymentMode: 'UPI', submittedBy: 'p1', approvalStatus: 'Approved', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), milestoneId: 'm1', isOutOfPocket: true },
      { id: 'e2', amount: 50000, vendorName: 'Raw Materials Corp', category: 'Inventory', paymentMode: 'card', submittedBy: 'p2', approvalStatus: 'Approved', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), milestoneId: 'm3', isOutOfPocket: true },
      { id: 'e3', amount: 120000, vendorName: 'Modern Decor & Ply', category: 'Interiors', paymentMode: 'card', submittedBy: 'p1', approvalStatus: 'Approved', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), milestoneId: 'm2', isOutOfPocket: true },
      { id: 'e4', amount: 35000, vendorName: 'Municipal Health Dept', category: 'Licenses', paymentMode: 'cash', submittedBy: 'p2', approvalStatus: 'Disputed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), milestoneId: 'm4', isOutOfPocket: true },
      { id: 'e5', amount: 18000, vendorName: 'Super Fresh Groceries', category: 'Inventory', paymentMode: 'UPI', submittedBy: 'p1', approvalStatus: 'Pending', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), milestoneId: 'm3', isOutOfPocket: true },
      { id: 'e6', amount: 45000, vendorName: 'A1 Printers & Flex', category: 'Marketing', paymentMode: 'UPI', submittedBy: 'p2', approvalStatus: 'Pending', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), milestoneId: 'm4', isOutOfPocket: true }
    ];

    const seedComments: DisputeComment[] = [
      { id: 'c1', expenseId: 'e4', partnerId: 'p1', text: 'This municipal license receipt looks incomplete. Can you upload a clear screenshot of the government registry?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString() }
    ];

    const seedDrawings: Drawing[] = [
      { id: 'd1', partnerId: 'p1', amount: 20000, reason: 'Temporary cash withdrawal for petty office stationery', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString() }
    ];

    setExpenses(seedExpenses);
    setDisputeComments(seedComments);
    setDrawings(seedDrawings);
    setMilestones(defaultMilestones);

    localStorage.setItem('@bucket_setup', JSON.stringify({ bizName: newBizName, partners: newPartners, isConfigured: true }));
    localStorage.setItem('@bucket_expenses', JSON.stringify(seedExpenses));
    localStorage.setItem('@bucket_comments', JSON.stringify(seedComments));
    localStorage.setItem('@bucket_drawings', JSON.stringify(seedDrawings));
    localStorage.setItem('@bucket_milestones', JSON.stringify(defaultMilestones));
  };

  const addExpense = (
    amount: number,
    vendorName: string,
    category: string,
    paymentMode: 'cash' | 'UPI' | 'card',
    milestoneId: string | null,
    isOutOfPocket: boolean,
    submittedBy?: string
  ) => {
    const newExpense: Expense = {
      id: `e_${Date.now()}`,
      amount,
      vendorName,
      category,
      paymentMode,
      submittedBy: submittedBy || activePartnerId,
      approvalStatus: 'Pending',
      timestamp: new Date().toISOString(),
      milestoneId,
      isOutOfPocket
    };

    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    localStorage.setItem('@bucket_expenses', JSON.stringify(updated));
  };

  const approveExpense = (id: string) => {
    const updated = expenses.map(e => (e.id === id ? { ...e, approvalStatus: 'Approved' as const } : e));
    setExpenses(updated);
    localStorage.setItem('@bucket_expenses', JSON.stringify(updated));
  };

  const disputeExpense = (id: string) => {
    const updated = expenses.map(e => (e.id === id ? { ...e, approvalStatus: 'Disputed' as const } : e));
    setExpenses(updated);
    localStorage.setItem('@bucket_expenses', JSON.stringify(updated));
  };

  const resolveDispute = (id: string) => {
    const updated = expenses.map(e => (e.id === id ? { ...e, approvalStatus: 'Approved' as const } : e));
    setExpenses(updated);
    localStorage.setItem('@bucket_expenses', JSON.stringify(updated));
  };

  const addDisputeComment = (expenseId: string, text: string) => {
    const newComment: DisputeComment = {
      id: `c_${Date.now()}`,
      expenseId,
      partnerId: activePartnerId,
      text,
      timestamp: new Date().toISOString()
    };

    const updated = [...disputeComments, newComment];
    setDisputeComments(updated);
    localStorage.setItem('@bucket_comments', JSON.stringify(updated));
  };

  const addDrawing = (partnerId: string, amount: number, reason: string) => {
    const newDrawing: Drawing = {
      id: `d_${Date.now()}`,
      partnerId,
      amount,
      reason,
      timestamp: new Date().toISOString()
    };

    const updated = [newDrawing, ...drawings];
    setDrawings(updated);
    localStorage.setItem('@bucket_drawings', JSON.stringify(updated));
  };

  const lockMilestone = (id: string) => {
    const updated = milestones.map(m => (m.id === id ? { ...m, isLocked: true } : m));
    setMilestones(updated);
    localStorage.setItem('@bucket_milestones', JSON.stringify(updated));
  };

  const unlockMilestone = (id: string) => {
    const updated = milestones.map(m => (m.id === id ? { ...m, isLocked: false } : m));
    setMilestones(updated);
    localStorage.setItem('@bucket_milestones', JSON.stringify(updated));
  };

  const resetBucket = () => {
    setBizName('');
    setPartners([]);
    setIsConfigured(false);
    setExpenses([]);
    setDrawings([]);
    setDisputeComments([]);
    setMilestones(defaultMilestones);
    setActivePartnerId('p1');
    setUserSession(null);

    localStorage.removeItem('@bucket_setup');
    localStorage.removeItem('@bucket_expenses');
    localStorage.removeItem('@bucket_drawings');
    localStorage.removeItem('@bucket_comments');
    localStorage.removeItem('@bucket_milestones');
    localStorage.removeItem('@bucket_active_partner');
    localStorage.removeItem('@bucket_logged_in_user');
    localStorage.removeItem('@bucket_user_session');
  };

  return (
    <BucketContext.Provider
      value={{
        bizName,
        isConfigured,
        partners,
        expenses,
        drawings,
        disputeComments,
        milestones,
        activePartnerId,
        setActivePartnerId: updateActivePartnerId,
        updateBucketSetup,
        addExpense,
        approveExpense,
        disputeExpense,
        resolveDispute,
        addDisputeComment,
        addDrawing,
        lockMilestone,
        unlockMilestone,
        resetBucket,
        isLoading,

        // Authentication & Invites
        userSession,
        registerUser,
        loginUser,
        logoutUser,
        inviteTeamMember
      }}
    >
      {children}
    </BucketContext.Provider>
  );
};

export const useBucket = () => {
  const context = useContext(BucketContext);
  if (!context) throw new Error('useBucket must be used within a BucketProvider');
  return context;
};
