import type { Transaction } from '@/types/transaction';

export interface MoMResult {
  changePercent: number | null;
  label: string;
}

export interface SummaryStats {
  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
  savingsRate: number;
  incomeMoM: MoMResult;
  expenseMoM: MoMResult;
  balanceMoM: MoMResult;
  savingsRateMoM: MoMResult;
}

export function calculateSummaryStats(
  transactions: Transaction[],
  refDate: Date = new Date()
): SummaryStats {
  const noDataMoM: MoMResult = { changePercent: null, label: 'No previous month data' };

  if (!transactions || transactions.length === 0) {
    return {
      totalIncome: 0,
      totalExpenses: 0,
      totalBalance: 0,
      savingsRate: 0,
      incomeMoM: noDataMoM,
      expenseMoM: noDataMoM,
      balanceMoM: noDataMoM,
      savingsRateMoM: noDataMoM,
    };
  }

  // 1. All-time total balance across all transactions
  const allTimeIncome = transactions
    .filter((t) => t.t_type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const allTimeExpenses = transactions
    .filter((t) => t.t_type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = allTimeIncome - allTimeExpenses;

  // 2. Calendar reference dates
  const currentYear = refDate.getFullYear();
  const currentMonth = refDate.getMonth();

  const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const prevYear = prevMonthDate.getFullYear();
  const prevMonth = prevMonthDate.getMonth();

  // End of previous month cutoff
  const endOfPrevMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);
  // End of current month cutoff
  const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

  let curIncome = 0;
  let curExpenses = 0;
  let prevIncome = 0;
  let prevExpenses = 0;
  let hasPrevMonthData = false;

  let cumBalanceCur = 0;
  let cumBalancePrev = 0;
  let hasCumPrevData = false;

  transactions.forEach((tx) => {
    if (!tx.date) return;
    const d = new Date(tx.date);
    if (isNaN(d.getTime())) return;

    const amount = tx.t_type === 'income' ? tx.amount : -tx.amount;

    // Cumulative balance calculations
    if (d <= endOfCurrentMonth) {
      cumBalanceCur += amount;
    }
    if (d <= endOfPrevMonth) {
      hasCumPrevData = true;
      cumBalancePrev += amount;
    }

    // Monthly income/expense breakdown
    if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
      if (tx.t_type === 'income') curIncome += tx.amount;
      if (tx.t_type === 'expense') curExpenses += tx.amount;
    } else if (d.getFullYear() === prevYear && d.getMonth() === prevMonth) {
      hasPrevMonthData = true;
      if (tx.t_type === 'income') prevIncome += tx.amount;
      if (tx.t_type === 'expense') prevExpenses += tx.amount;
    }
  });

  const curSavingsRate =
    curIncome > 0
      ? Math.max(0, ((curIncome - curExpenses) / curIncome) * 100)
      : 0;

  const prevSavingsRate =
    prevIncome > 0
      ? Math.max(0, ((prevIncome - prevExpenses) / prevIncome) * 100)
      : 0;

  // Total Balance MoM comparison (Cumulative)
  let balanceMoM: MoMResult;
  if (!hasCumPrevData || cumBalancePrev === 0) {
    balanceMoM = noDataMoM;
  } else {
    const percent = ((cumBalanceCur - cumBalancePrev) / Math.abs(cumBalancePrev)) * 100;
    balanceMoM = {
      changePercent: parseFloat(percent.toFixed(1)),
      label: 'from last month',
    };
  }

  // Monthly Income MoM
  let incomeMoM: MoMResult;
  if (!hasPrevMonthData || prevIncome === 0) {
    incomeMoM = noDataMoM;
  } else {
    const percent = ((curIncome - prevIncome) / prevIncome) * 100;
    incomeMoM = {
      changePercent: parseFloat(percent.toFixed(1)),
      label: 'from last month',
    };
  }

  // Monthly Expense MoM
  let expenseMoM: MoMResult;
  if (!hasPrevMonthData || prevExpenses === 0) {
    expenseMoM = noDataMoM;
  } else {
    const percent = ((curExpenses - prevExpenses) / prevExpenses) * 100;
    expenseMoM = {
      changePercent: parseFloat(percent.toFixed(1)),
      label: 'from last month',
    };
  }

  // Savings Rate MoM (Percentage-point difference)
  let savingsRateMoM: MoMResult;
  if (!hasPrevMonthData || prevIncome === 0) {
    savingsRateMoM = noDataMoM;
  } else {
    const diff = curSavingsRate - prevSavingsRate;
    savingsRateMoM = {
      changePercent: parseFloat(diff.toFixed(1)),
      label: 'from last month',
    };
  }

  return {
    totalIncome: curIncome,
    totalExpenses: curExpenses,
    totalBalance,
    savingsRate: parseFloat(curSavingsRate.toFixed(1)),
    incomeMoM,
    expenseMoM,
    balanceMoM,
    savingsRateMoM,
  };
}
