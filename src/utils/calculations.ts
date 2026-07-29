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

export interface VentureHealthData {
  score: number;
  status: 'Green' | 'Amber' | 'Red';
  statusLabel: string;
  successProbability: number;
  confidence: 'High' | 'Medium' | 'Low';
  disputesCount: number;
  pendingApprovalsCount: number;
  overbudgetMilestonesCount: number;
  totalMilestonesCount: number;
  completedMilestonesCount: number;
  milestoneStats: {
    completed: number;
    pending: number;
    overbudget: number;
  };
  insights: string[];
  recommendations: {
    financial: string[];
    execution: string[];
    collaboration: string[];
    goals: string[];
  };
  stakeholderSummary: string;
  predictions: {
    milestonesOnTimeProb: number;
    estCompletionDays: number;
    forecastedSuccessPercent: number;
    financialStability: 'Stable' | 'Volatile' | 'At Risk';
    executionConfidence: 'High' | 'Medium' | 'Low';
    keyRisks: string[];
  };
}

export const calculateVentureHealth = (
  partners: Partner[],
  expenses: Expense[],
  _drawings: Drawing[],
  milestones: Milestone[]
): VentureHealthData => {
  const disputes = expenses.filter(e => e.approvalStatus === 'Disputed');
  const pending = expenses.filter(e => e.approvalStatus === 'Pending');

  // Milestone overruns spent vs budget
  const milestoneOverruns = milestones.filter(m => {
    const linkedExpenses = expenses.filter(e => e.milestoneId === m.id && e.approvalStatus === 'Approved');
    const spent = linkedExpenses.reduce((sum, e) => sum + e.amount, 0);
    return spent > m.targetBudget;
  });

  const completedMilestones = milestones.filter(m => m.isLocked);
  const pendingMilestones = milestones.filter(m => !m.isLocked);

  // Score computation (out of 100)
  let score = 100;
  score -= disputes.length * 15;
  score -= pending.length * 5;
  score -= milestoneOverruns.length * 10;
  score = Math.max(0, Math.min(100, score));

  // Determine status color
  let status: 'Green' | 'Amber' | 'Red' = 'Green';
  let statusLabel = 'Healthy';
  if (score < 50) {
    status = 'Red';
    statusLabel = 'Critical Risk';
  } else if (score < 80) {
    status = 'Amber';
    statusLabel = 'Needs Attention';
  }

  // Success Probability
  const milestoneRatio = milestones.length > 0 ? (completedMilestones.length / milestones.length) : 0;
  const successProbability = Math.round((score * 0.75) + (milestoneRatio * 25));

  // Confidence Level
  let confidence: 'High' | 'Medium' | 'Low' = 'High';
  if (disputes.length > 2 || milestoneOverruns.length > 1) {
    confidence = 'Low';
  } else if (disputes.length > 0 || pending.length > 1) {
    confidence = 'Medium';
  }

  // Dynamic AI insights
  const insights: string[] = [];
  if (disputes.length > 0) {
    const unresolvedRatio = Math.round((disputes.length / expenses.length) * 100) || 0;
    const recoveryPotential = Math.round(disputes.length * 3.5);
    insights.push(`${unresolvedRatio}% of disputes remain unresolved. Resolving these could improve venture health by approximately ${recoveryPotential}%.`);
  } else {
    insights.push(`Zero unresolved disputes logged! This keeps team collaboration clean and healthy.`);
  }

  if (completedMilestones.length > 0) {
    const completedRatio = Math.round((completedMilestones.length / milestones.length) * 100);
    insights.push(`Milestone completion is progressing well with ${completedRatio}% of planned roadmap goals locked.`);
  } else {
    insights.push(`No milestones have been completed and locked yet. Focus on completing current phase budgets.`);
  }

  if (pending.length > 0) {
    insights.push(`Financial approvals are delayed with an average backlog of ${pending.length} pending logs.`);
  } else {
    insights.push(`Your project execution speed has improved compared to last month with instant expense audits.`);
  }

  if (milestoneOverruns.length > 0) {
    insights.push(`Budget alert: ${milestoneOverruns.length} milestone phase(s) have overrun their targets.`);
  }

  // Smart Recommendations
  const financialRecs: string[] = [];
  const executionRecs: string[] = [];
  const collaborationRecs: string[] = [];
  const goalsRecs: string[] = [];

  if (pending.length > 0) {
    financialRecs.push('Resolve pending approvals.');
  }
  if (disputes.length > 0) {
    financialRecs.push('Reduce disputed transactions.');
  }
  if (financialRecs.length === 0) {
    financialRecs.push('Maintain active cash audits and lock approved transactions.');
  }

  if (milestoneOverruns.length > 0) {
    executionRecs.push('Complete overdue milestones.');
    executionRecs.push('Review allocation planning for next sprint phases.');
  } else {
    executionRecs.push('Stay on schedule for upcoming phase goals.');
  }

  if (partners.length < 2) {
    collaborationRecs.push('Invite key stakeholders or developers to build out target equity tasks.');
  } else {
    collaborationRecs.push('Conduct co-founder alignment reviews to ensure split equity holds value.');
  }

  if (pendingMilestones.length > 0) {
    goalsRecs.push(`Focus on "${pendingMilestones[0].name}" before adding new initiatives.`);
  } else {
    goalsRecs.push('Audit current outcomes and formulate next phase goals.');
  }

  // Stakeholder Summary
  let stakeholderSummary = '';
  if (status === 'Green') {
    stakeholderSummary = 'The venture is progressing as planned with healthy collaboration and timely execution. Co-founders are reconciled, and capital deposits are aligned with milestone targets. Prioritise upcoming phase objectives to sustain current traction.';
  } else if (status === 'Amber') {
    stakeholderSummary = 'Financial disputes have increased while milestone completion has slowed. Although overall progress remains positive, unresolved approvals and delayed milestones are reducing execution efficiency. Prioritising financial reconciliation and completing overdue milestones will significantly improve the likelihood of project success.';
  } else {
    stakeholderSummary = 'Critical risk alert: High financial dispute concentration or milestone delays are impacting project execution. Immediate stakeholder intervention is required to approve pending funds, resolve conflicts, and realign split balances.';
  }

  // AI Predictions
  const milestonesOnTimeProb = Math.max(10, Math.min(95, Math.round(score * 0.95 - milestoneOverruns.length * 5)));
  const estCompletionDays = Math.max(15, Math.round(pendingMilestones.length * 15 + milestoneOverruns.length * 8));
  const forecastedSuccessPercent = Math.round(score * 0.8 + 15);
  const financialStability = score > 85 ? 'Stable' : score > 55 ? 'Volatile' : 'At Risk' as const;
  const executionConfidence = confidence;

  const keyRisks: string[] = [];
  if (disputes.length > 0) keyRisks.push('Conflict friction from unresolved disputes.');
  if (milestoneOverruns.length > 0) keyRisks.push('Budget capital overrun in active phases.');
  if (pending.length > 2) keyRisks.push('Approval latency causing project task delays.');
  if (keyRisks.length === 0) keyRisks.push('No immediate critical risks identified.');

  return {
    score,
    status,
    statusLabel,
    successProbability,
    confidence,
    disputesCount: disputes.length,
    pendingApprovalsCount: pending.length,
    overbudgetMilestonesCount: milestoneOverruns.length,
    totalMilestonesCount: milestones.length,
    completedMilestonesCount: completedMilestones.length,
    milestoneStats: {
      completed: completedMilestones.length,
      pending: pendingMilestones.length,
      overbudget: milestoneOverruns.length,
    },
    insights,
    recommendations: {
      financial: financialRecs,
      execution: executionRecs,
      collaboration: collaborationRecs,
      goals: goalsRecs,
    },
    stakeholderSummary,
    predictions: {
      milestonesOnTimeProb,
      estCompletionDays,
      forecastedSuccessPercent,
      financialStability,
      executionConfidence,
      keyRisks,
    },
  };
};
