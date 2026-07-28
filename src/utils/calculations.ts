export interface Partner {
  id: string;
  name: string;
  role: string;
  initialContribution: number;
  capitalTarget: number;
  targetSplitRatio: number;
  emailOrMobile?: string;
  status?: 'Owner' | 'Invited' | 'Accepted';
}

export interface Expense {
  id: string;
  amount: number;
  vendorName: string;
  category: string;
  receiptUrl?: string;
  paymentMode: 'cash' | 'UPI' | 'card';
  submittedBy: string; // partner.id
  approvalStatus: 'Pending' | 'Approved' | 'Disputed' | 'Auto-Flagged';
  timestamp: string;
  milestoneId?: string | null;
  isOutOfPocket?: boolean;
}

export interface Drawing {
  id: string;
  partnerId: string;
  amount: number;
  reason: string;
  timestamp: string;
}

export interface Milestone {
  id: string;
  name: string;
  phaseOrder: number;
  targetBudget: number;
  isLocked: boolean;
}

export interface DisputeComment {
  id: string;
  expenseId: string;
  partnerId: string;
  text: string;
  timestamp: string;
}

export const formatIndianCurrency = (amount: number): string => {
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);
  
  // Format with Indian grouping: e.g. 150000 -> 1,50,000
  const valStr = Math.round(absVal).toString();
  let lastThree = valStr.substring(valStr.length - 3);
  const otherNumbers = valStr.substring(0, valStr.length - 3);
  
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  return `${isNegative ? '-' : ''}₹${formatted}`;
};

export const calculateSummaryStats = (
  partners: Partner[],
  expenses: Expense[],
  drawings: Drawing[]
) => {
  const approvedExpenses = expenses.filter(e => e.approvalStatus === 'Approved');
  const totalSpent = approvedExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Calculate actual contributed per partner
  // Formula: Contribution = Initial Contribution + (Approved out-of-pocket expenses submitted by partner) - (Drawings by partner)
  const partnerContributions = partners.map(p => {
    const expensesSubmitted = approvedExpenses
      .filter(e => e.submittedBy === p.id && e.isOutOfPocket !== false)
      .reduce((sum, e) => sum + e.amount, 0);
    const drawingsMade = drawings
      .filter(d => d.partnerId === p.id)
      .reduce((sum, d) => sum + d.amount, 0);

    const actualContribution = p.initialContribution + expensesSubmitted - drawingsMade;
    return {
      partnerId: p.id,
      actualContribution,
    };
  });

  const totalCapitalContributed = partnerContributions.reduce(
    (sum, c) => sum + c.actualContribution,
    0
  );

  // Split ratios progress
  const targetTotalCapital = partners.reduce((sum, p) => sum + p.capitalTarget, 0);
  const fundingProgressPercentage = targetTotalCapital > 0 
    ? Math.min(100, Math.round((totalCapitalContributed / targetTotalCapital) * 100))
    : 0;

  // Running balance
  const runningBalance = totalCapitalContributed - totalSpent;

  return {
    totalSpent,
    totalCapitalContributed,
    runningBalance,
    fundingProgressPercentage,
    partnerContributions,
  };
};
