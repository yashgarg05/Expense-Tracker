import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { Transaction } from '@/types/transaction';
import { formatCurrency } from '@/lib/formatters';

interface CashFlowChartProps {
  transactions?: Transaction[];
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({
  transactions = [],
}) => {
  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    // Map YYYY-MM -> { month: string, Income: number, Expenses: number }
    const monthMap: Record<string, { label: string; date: Date; Income: number; Expenses: number }> = {};

    transactions.forEach((tx) => {
      if (!tx.date) return;
      const d = new Date(tx.date);
      if (isNaN(d.getTime())) return;

      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

      if (!monthMap[key]) {
        monthMap[key] = { label, date: d, Income: 0, Expenses: 0 };
      }

      if (tx.t_type === 'income') {
        monthMap[key].Income += tx.amount;
      } else if (tx.t_type === 'expense') {
        monthMap[key].Expenses += tx.amount;
      }
    });

    return Object.keys(monthMap)
      .sort()
      .slice(-6)
      .map((key) => ({
        month: monthMap[key].label,
        Income: monthMap[key].Income,
        Expenses: monthMap[key].Expenses,
      }));
  }, [transactions]);

  return (
    <div className="rounded-xl border border-border/80 bg-card p-6 shadow-2xs select-none flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Income vs Expenses
          </h3>
          <p className="text-xs text-muted-foreground/80">
            Your monthly cash flow breakdown
          </p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-72 items-center justify-center text-xs text-muted-foreground/80">
          No transaction history available to plot cash flow.
        </div>
      ) : (
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              barGap={6}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
                opacity={0.5}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                dy={6}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--popover)',
                  borderColor: 'var(--border)',
                  borderRadius: '10px',
                  color: 'var(--popover-foreground)',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                  padding: '8px 12px',
                }}
                formatter={(value?: number | string | ReadonlyArray<number | string>) => [
                  formatCurrency(Number(Array.isArray(value) ? value[0] : value || 0)),
                  '',
                ]}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 500 }}
              />
              <Bar
                dataKey="Income"
                name="Income"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="Expenses"
                name="Expenses"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

