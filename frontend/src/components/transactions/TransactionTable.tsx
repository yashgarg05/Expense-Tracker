import { useState, useMemo } from 'react';
import type { Transaction, CategoryType, TransactionType } from '../../types/transaction';
import { formatCurrency, formatDate, getCategoryIcon } from '@/lib/formatters';
import { sortTransactions, type SortMode } from '@/lib/sort';
import { Search, Edit2, Trash2, Filter, Inbox, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onOpenAddModal: () => void;
  isDeleting?: boolean;
}

const CATEGORIES: (CategoryType | 'All')[] = [
  'All',
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Bills',
  'Health',
  'Education',
  'Salary',
  'Freelance',
  'Other',
];

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onEdit,
  onDelete,
  onOpenAddModal,
  isDeleting = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryType | 'All'>('All');
  const [sortMode, setSortMode] = useState<SortMode>('date-desc');

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    const filtered = transactions.filter((tx) => {
      // Type check
      if (typeFilter !== 'all' && tx.t_type !== typeFilter) return false;
      // Category check
      if (categoryFilter !== 'All' && tx.category !== categoryFilter) return false;
      // Search check
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = tx.title.toLowerCase().includes(q);
        const matchesNote = tx.note?.toLowerCase().includes(q);
        const matchesCategory = tx.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesNote && !matchesCategory) return false;
      }
      return true;
    });

    return sortTransactions(filtered, sortMode);
  }, [transactions, typeFilter, categoryFilter, searchQuery, sortMode]);

  const isFiltered = searchQuery.trim() !== '' || typeFilter !== 'all' || categoryFilter !== 'All';

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-4 rounded-xl border border-border shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title, category, note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
          />
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Segmented Filter */}
          <div className="flex items-center rounded-lg bg-muted p-1 border border-border text-xs">
            <button
              onClick={() => setTypeFilter('all')}
              className={cn(
                'px-2.5 py-1 rounded-md font-medium transition-all',
                typeFilter === 'all'
                  ? 'bg-card text-foreground shadow-2xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={cn(
                'px-2.5 py-1 rounded-md font-medium transition-all',
                typeFilter === 'income'
                  ? 'bg-card text-emerald-600 dark:text-emerald-400 shadow-2xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Income
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={cn(
                'px-2.5 py-1 rounded-md font-medium transition-all',
                typeFilter === 'expense'
                  ? 'bg-card text-foreground shadow-2xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Expenses
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 border border-input rounded-lg bg-background px-2.5 py-1.5 text-xs text-foreground">
            <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value as CategoryType | 'All')
              }
              className="bg-transparent outline-none text-xs font-medium cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 border border-input rounded-lg bg-background px-2.5 py-1.5 text-xs text-foreground">
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="bg-transparent outline-none text-xs font-medium cursor-pointer"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Amount: High to Low</option>
              <option value="amount-asc">Amount: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-border bg-card shadow-2xs overflow-hidden">
        {filteredAndSortedTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
              <Inbox className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">
              {isFiltered ? 'No matching transactions' : 'No transactions recorded'}
            </h4>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              {isFiltered
                ? 'Try adjusting your search terms or filters.'
                : 'Start tracking your income and expenses by adding your first transaction.'}
            </p>
            {isFiltered ? (
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('all');
                  setCategoryFilter('All');
                }}
                variant="outline"
                size="sm"
                className="mt-4 text-xs font-medium"
              >
                Clear Filters
              </Button>
            ) : (
              <Button
                onClick={onOpenAddModal}
                size="sm"
                className="mt-4 text-xs font-medium"
              >
                Add Transaction
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-muted-foreground font-medium uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAndSortedTransactions.map((tx: Transaction) => {
                  const Icon = getCategoryIcon(tx.category);
                  const isIncome = tx.t_type === 'income';

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-muted/40 transition-colors group"
                    >
                      {/* Description / Title */}
                      <td className="py-3.5 px-4 font-medium text-foreground">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border',
                              isIncome
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                : 'bg-muted text-foreground border-border'
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col truncate max-w-xs">
                            <span className="font-semibold text-foreground truncate">
                              {tx.title}
                            </span>
                            {tx.note && (
                              <span className="text-[11px] text-muted-foreground truncate">
                                {tx.note}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground border border-border">
                          {tx.category}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-muted-foreground font-mono">
                        {formatDate(tx.date)}
                      </td>

                      {/* Type Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-semibold uppercase tracking-wider',
                            isIncome
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {tx.t_type}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right font-mono font-semibold">
                        <span
                          className={
                            isIncome
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-foreground'
                          }
                        >
                          {isIncome ? '+' : '-'}
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEdit(tx)}
                            disabled={isDeleting}
                            aria-label={`Edit ${tx.title}`}
                            className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            title="Edit transaction"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(tx)}
                            disabled={isDeleting}
                            aria-label={`Delete ${tx.title}`}
                            className="p-1.5 rounded-md text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-colors disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            title="Delete transaction"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

