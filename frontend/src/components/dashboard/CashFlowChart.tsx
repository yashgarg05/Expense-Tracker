import React from 'react';
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
import { formatCurrency } from '@/lib/formatters';

interface CashFlowData {
  month: string;
  Income: number;
  Expenses: number;
}

interface CashFlowChartProps {
  data?: CashFlowData[];
}

const DEFAULT_CASH_FLOW_DATA: CashFlowData[] = [
  { month: 'Apr', Income: 85000, Expenses: 42000 },
  { month: 'May', Income: 92000, Expenses: 38000 },
  { month: 'Jun', Income: 105000, Expenses: 45000 },
  { month: 'Jul', Income: 98000, Expenses: 41000 },
  { month: 'Aug', Income: 115000, Expenses: 39000 },
  { month: 'Sep', Income: 145000, Expenses: 44299 },
];

export const CashFlowChart: React.FC<CashFlowChartProps> = ({
  data = DEFAULT_CASH_FLOW_DATA,
}) => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Income vs Expenses
          </h3>
          <p className="text-xs text-muted-foreground">
            Your cash flow over the last 6 months
          </p>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            barGap={6}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border)"
              opacity={0.6}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
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
                borderRadius: '8px',
                color: 'var(--popover-foreground)',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              }}
              formatter={(value?: any) => [formatCurrency(Number(value || 0)), '']}
            />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
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
    </div>
  );
};
