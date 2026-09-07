import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  amount: string;
  changePercent: number | null;
  changeLabel?: string;
  unit?: string;
  icon: LucideIcon;
  isInverseTrend?: boolean; // For expenses: decreasing is good (positive indicator)
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  amount,
  changePercent,
  changeLabel = 'from last month',
  unit = '%',
  icon: Icon,
  isInverseTrend = false,
}) => {
  const hasChange = changePercent !== null;
  const isZeroChange = changePercent === 0;
  const val = changePercent ?? 0;
  // If isInverseTrend is true (e.g. Expenses), a negative percentage is positive/good
  const isPositive = isInverseTrend ? val <= 0 : val >= 0;
  const absPercent = Math.abs(val).toFixed(val % 1 === 0 ? 0 : 1);

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-2xs transition-all duration-200 hover:border-foreground/20 hover:shadow-xs select-none">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3">
        <h2 className="text-2xl font-bold tracking-tight text-foreground font-mono">
          {amount}
        </h2>
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-xs">
        {hasChange ? (
          isZeroChange ? (
            <span className="text-muted-foreground">No change from last month</span>
          ) : (
            <>
              <span
                aria-label={`${val > 0 ? 'Increased by' : 'Decreased by'} ${absPercent} ${unit} ${changeLabel}`}
                className={cn(
                  'inline-flex items-center font-medium gap-0.5 rounded-sm px-1 py-0.5',
                  isPositive
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10'
                    : 'text-rose-700 dark:text-rose-400 bg-rose-500/10'
                )}
              >
                {val > 0 ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {absPercent} {unit}
              </span>
              <span className="text-muted-foreground">{changeLabel}</span>
            </>
          )
        ) : (
          <span className="text-muted-foreground">{changeLabel}</span>
        )}
      </div>
    </div>
  );
};
