import React from 'react';
import type { Transaction, ActivePage } from '../../types/transaction';
import { formatCurrency, formatDate, getCategoryIcon } from '@/lib/formatters';
import { ArrowRight, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onNavigateToTransactions: (page: ActivePage) => void;
  onOpenAddModal: () => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  onNavigateToTransactions,
  onOpenAddModal,
}) => {
  const recentList = transactions.slice(0, 5);

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-2xs">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Recent Transactions
          </h3>
          <p className="text-xs text-muted-foreground">
            Your latest financial activities
          </p>
        </div>
        <button
          onClick={() => onNavigateToTransactions('transactions')}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline transition-all"
        >
          <span>View all</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {recentList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
            <Inbox className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-semibold text-foreground">
            No transactions yet
          </h4>
          <p className="text-xs text-muted-foreground max-w-xs mt-1">
            Add your first transaction to start tracking your finances.
          </p>
          <Button
            onClick={onOpenAddModal}
            size="sm"
            className="mt-4 text-xs font-medium"
          >
            Add Transaction
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {recentList.map((tx) => {
            const Icon = getCategoryIcon(tx.category);
            const isIncome = tx.t_type === 'income';

            return (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3.5 hover:bg-muted/40 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border',
                      isIncome
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-muted text-foreground border-border'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-xs font-semibold text-foreground truncate">
                      {tx.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground">
                        {tx.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground/50">
                        •
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {formatDate(tx.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span
                    className={cn(
                      'text-xs font-semibold',
                      isIncome
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-foreground'
                    )}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
