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
  isPrimary?: boolean; // For Total Balance: primary anchor card hierarchy
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  amount,
  changePercent,
  changeLabel = 'from last month',
  unit = '%',
  icon: Icon,
  isInverseTrend = false,
  isPrimary = false,
}) => {
  const hasChange = changePercent !== null;
  const isZeroChange = changePercent === 0;
  const val = changePercent ?? 0;
  // If isInverseTrend is true (e.g. Expenses), a negative percentage is positive/good
  const isPositive = isInverseTrend ? val <= 0 : val >= 0;
  const absPercent = Math.abs(val).toFixed(val % 1 === 0 ? 0 : 1);

  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-200 p-5 select-none relative overflow-hidden',
        isPrimary
          ? 'border-primary/30 bg-card shadow-xs ring-1 ring-primary/10 hover:border-primary/50'
          : 'border-border/80 bg-card shadow-2xs hover:border-border hover:shadow-xs'
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg border transition-colors',
            isPrimary
              ? 'bg-primary/10 text-primary border-primary/20'
              : 'bg-muted/70 text-muted-foreground border-border/50'
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-3.5">
        <h2
          className={cn(
            'font-bold tracking-tight text-foreground font-mono',
            isPrimary ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'
          )}
        >
          {amount}
        </h2>
      </div>

      <div className="mt-2.5 flex items-center gap-1.5 text-xs">
        {hasChange ? (
          isZeroChange ? (
            <span className="text-[11px] text-muted-foreground/80">
              No change from last month
            </span>
          ) : (
            <>
              <span
                aria-label={`${val > 0 ? 'Increased by' : 'Decreased by'} ${absPercent} ${unit} ${changeLabel}`}
                className={cn(
                  'inline-flex items-center font-semibold gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] border',
                  isPositive
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-rose-700 dark:text-rose-400 bg-rose-500/10 border-rose-500/20'
                )}
              >
                {val > 0 ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {absPercent}
                {unit}
              </span>
              <span className="text-[11px] text-muted-foreground/80">
                {changeLabel}
              </span>
            </>
          )
        ) : (
          <span className="text-[11px] text-muted-foreground/80">
            {changeLabel}
          </span>
        )}
      </div>
    </div>
  );
};
