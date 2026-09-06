import type { Transaction, ActivePage } from '../types/transaction';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { CashFlowChart } from '../components/dashboard/CashFlowChart';
import { CategoryChart } from '../components/dashboard/CategoryChart';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { formatCurrency } from '@/lib/formatters';
import { calculateSummaryStats } from '@/lib/calculations';
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
  const stats = calculateSummaryStats(transactions);

  return (
    <div className="space-y-8">
      {/* 4 Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Balance"
          amount={formatCurrency(stats.totalBalance)}
          changePercent={stats.balanceMoM.changePercent}
          changeLabel={stats.balanceMoM.label}
          icon={Wallet}
        />
        <SummaryCard
          title="Income"
          amount={formatCurrency(stats.totalIncome)}
          changePercent={stats.incomeMoM.changePercent}
          changeLabel={stats.incomeMoM.label}
          icon={TrendingUp}
        />
        <SummaryCard
          title="Expenses"
          amount={formatCurrency(stats.totalExpenses)}
          changePercent={stats.expenseMoM.changePercent}
          changeLabel={stats.expenseMoM.label}
          icon={TrendingDown}
          isInverseTrend={true}
        />
        <SummaryCard
          title="Savings Rate"
          amount={`${stats.savingsRate}%`}
          changePercent={stats.savingsRateMoM.changePercent}
          changeLabel={stats.savingsRateMoM.label}
          unit="pp"
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
