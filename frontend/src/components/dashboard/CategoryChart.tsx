import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import type { CategoryType, Transaction } from '../../types/transaction';
import { formatCurrency, CATEGORY_COLORS } from '@/lib/formatters';

interface CategoryChartProps {
  transactions: Transaction[];
}

export const CategoryChart: React.FC<CategoryChartProps> = ({
  transactions,
}) => {
  // Aggregate expenses by category from local state
  const categoryTotals = transactions
    .filter((t) => t.t_type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<CategoryType, number>);

  const totalExpense = Object.values(categoryTotals).reduce(
    (sum, val) => sum + val,
    0
  );

  const chartData = Object.entries(categoryTotals)
    .map(([cat, amount]) => ({
      name: cat as CategoryType,
      value: amount,
      color: CATEGORY_COLORS[cat as CategoryType] || '#64748b',
      percentage: totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(1) : '0',
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-2xs flex flex-col justify-between">
      <div>
        <h3 className="text-base font-semibold text-foreground">
          Spending by Category
        </h3>
        <p className="text-xs text-muted-foreground">
          Distribution of expenses across categories
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-56 items-center justify-center text-xs text-muted-foreground">
          No expenses recorded yet.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Donut Chart */}
          <div className="md:col-span-6 h-52 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--popover)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    color: 'var(--popover-foreground)',
                    fontSize: '12px',
                  }}
                  formatter={(value?: any) => [formatCurrency(Number(value || 0)), 'Spent']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] font-medium text-muted-foreground uppercase">
                Total
              </span>
              <span className="text-sm font-bold text-foreground">
                {formatCurrency(totalExpense)}
              </span>
            </div>
          </div>

          {/* Category Legend List */}
          <div className="md:col-span-6 space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {chartData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-foreground truncate">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-muted-foreground">{item.percentage}%</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
