import type { Transaction, ActivePage } from '../types/transaction';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { CashFlowChart } from '../components/dashboard/CashFlowChart';
import { CategoryChart } from '../components/dashboard/CategoryChart';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { formatCurrency } from '@/lib/formatters';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

interface OverviewProps {
  transactions: Transaction[];
  onNavigate: (page: ActivePage) => void;
  onOpenAddModal: () => void;
}

export const Overview: React.FC<OverviewProps> = ({
  transactions,
  onNavigate,
  onOpenAddModal,
}) => {
  // Calculate dynamic totals from transaction state
  const totalIncome = transactions
    .filter((t) => t.t_type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.t_type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpenses;

  const savingsRate =
    totalIncome > 0
      ? Math.max(0, parseFloat((((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)))
      : 0;

  return (
    <div className="space-y-8">
      {/* 4 Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Balance"
          amount={formatCurrency(totalBalance)}
          changePercent={12.4}
          icon={Wallet}
        />
        <SummaryCard
          title="Income"
          amount={formatCurrency(totalIncome)}
          changePercent={8.2}
          icon={TrendingUp}
        />
        <SummaryCard
          title="Expenses"
          amount={formatCurrency(totalExpenses)}
          changePercent={-4.5}
          icon={TrendingDown}
          isInverseTrend={true}
        />
        <SummaryCard
          title="Savings Rate"
          amount={`${savingsRate}%`}
          changePercent={3.1}
          icon={PiggyBank}
        />
      </div>

      {/* Charts Grid: 2 Column Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <CashFlowChart transactions={transactions} />
        </div>
        <div className="lg:col-span-5">
          <CategoryChart transactions={transactions} />
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div>
        <RecentTransactions
          transactions={transactions}
          onNavigateToTransactions={onNavigate}
          onOpenAddModal={onOpenAddModal}
        />
      </div>
    </div>
  );
};
