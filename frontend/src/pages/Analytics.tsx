import type { Transaction, CategoryType } from '../types/transaction';
import { CashFlowChart } from '../components/dashboard/CashFlowChart';
import { CategoryChart } from '../components/dashboard/CategoryChart';
import { formatCurrency, CATEGORY_COLORS } from '@/lib/formatters';
import { Sparkles, Award, ArrowUpRight } from 'lucide-react';

interface AnalyticsProps {
  transactions: Transaction[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ transactions }) => {
  // Compute top spending categories
  const expenseTx = transactions.filter((t) => t.t_type === 'expense');
  const categoryMap = expenseTx.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<CategoryType, number>);

  const totalExpense = Object.values(categoryMap).reduce((a, b) => a + b, 0);

  const topCategories = Object.entries(categoryMap)
    .map(([cat, amt]) => ({
      category: cat as CategoryType,
      amount: amt,
      percent: totalExpense > 0 ? (amt / totalExpense) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="space-y-8">
      {/* Financial Insights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-4 w-4" />
            <span>Smart Insight</span>
          </div>
          <p className="text-sm font-semibold text-foreground">
            You spent 12% less on dining this month.
          </p>
          <p className="text-xs text-muted-foreground">
            Great job! Food expenses dropped compared to August.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <Award className="h-4 w-4" />
            <span>Category Highlight</span>
          </div>
          <p className="text-sm font-semibold text-foreground">
            {topCategories.length > 0
              ? `${topCategories[0].category} is your top expense category.`
              : 'Shopping is your top spending category.'}
          </p>
          <p className="text-xs text-muted-foreground">
            Accounting for{' '}
            {topCategories.length > 0
              ? `${topCategories[0].percent.toFixed(1)}%`
              : '24.5%'}{' '}
            of total monthly outflow.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <ArrowUpRight className="h-4 w-4" />
            <span>Savings Trend</span>
          </div>
          <p className="text-sm font-semibold text-foreground">
            Your savings rate increased by +3.1%.
          </p>
          <p className="text-xs text-muted-foreground">
            Current net savings rate stands strong at 68.7%.
          </p>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <CashFlowChart transactions={transactions} />
        </div>
        <div className="lg:col-span-5">
          <CategoryChart transactions={transactions} />
        </div>
      </div>

      {/* Top Spending Categories Progress List */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Top Spending Breakdown
          </h3>
          <p className="text-xs text-muted-foreground">
            Categories ranking by overall expenditure
          </p>
        </div>

        <div className="space-y-4">
          {topCategories.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center">
              No expense data available for analytics breakdown.
            </p>
          ) : (
            topCategories.map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-foreground">{item.category}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-muted-foreground">
                      {item.percent.toFixed(1)}%
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${item.percent}%`,
                      backgroundColor:
                        CATEGORY_COLORS[item.category] || '#64748b',
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
