export type TransactionType = 'income' | 'expense';

export type CategoryType =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills'
  | 'Health'
  | 'Education'
  | 'Salary'
  | 'Freelance'
  | 'Other';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: CategoryType;
  t_type: TransactionType;
  date: string; // ISO format: YYYY-MM-DD
  note: string;
}

export type ActivePage = 'overview' | 'transactions' | 'analytics' | 'settings';

export interface DashboardSummary {
  totalBalance: number;
  income: number;
  expenses: number;
  savingsRate: number;
  balanceChangePercent: number;
  incomeChangePercent: number;
  expensesChangePercent: number;
  savingsChangePercent: number;
}
