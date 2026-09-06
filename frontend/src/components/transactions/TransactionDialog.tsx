import { useState, useEffect } from 'react';
import type { Transaction, CategoryType, TransactionType } from '../../types/transaction';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'> & { id?: string }) => void;
  initialData?: Transaction | null;
}

const CATEGORIES: CategoryType[] = [
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

export const TransactionDialog: React.FC<TransactionDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [tType, setTType] = useState<TransactionType>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryType>('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setTType(initialData.t_type);
      setTitle(initialData.title);
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      setDate(initialData.date);
      setNote(initialData.note || '');
    } else {
      // Default reset
      setTType('expense');
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!title.trim()) {
      errs.title = 'Title is required';
    }
    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      errs.amount = 'Please enter a valid positive amount';
    }
    if (!category) {
      errs.category = 'Category is required';
    }
    if (!date) {
      errs.date = 'Date is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: initialData?.id,
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      t_type: tType,
      date,
      note: note.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div className="relative z-50 w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl space-y-6 text-foreground select-none animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {initialData ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {initialData
                ? 'Update transaction details in local state.'
                : 'Record a new income or expense item.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Transaction Type Segmented Switch */}
          <div className="space-y-1">
            <label className="font-medium text-foreground">Type</label>
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1 border border-border">
              <button
                type="button"
                onClick={() => {
                  setTType('expense');
                  if (category === 'Salary' || category === 'Freelance') {
                    setCategory('Food');
                  }
                }}
                className={cn(
                  'rounded-md py-1.5 font-medium transition-all text-xs',
                  tType === 'expense'
                    ? 'bg-card text-foreground shadow-2xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => {
                  setTType('income');
                  if (category !== 'Salary' && category !== 'Freelance') {
                    setCategory('Salary');
                  }
                }}
                className={cn(
                  'rounded-md py-1.5 font-medium transition-all text-xs',
                  tType === 'income'
                    ? 'bg-card text-emerald-600 dark:text-emerald-400 shadow-2xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Income
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label htmlFor="tx-title" className="font-medium text-foreground">
              Description / Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="tx-title"
              type="text"
              placeholder="e.g. Swiggy Order, Monthly Rent, Salary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={cn(
                'w-full rounded-lg border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors',
                errors.title ? 'border-rose-500' : 'border-input'
              )}
            />
            {errors.title && (
              <p className="text-[11px] text-rose-500">{errors.title}</p>
            )}
          </div>

          {/* Amount & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Amount */}
            <div className="space-y-1">
              <label htmlFor="tx-amount" className="font-medium text-foreground">
                Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                id="tx-amount"
                type="number"
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={cn(
                  'w-full rounded-lg border bg-background px-3 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors',
                  errors.amount ? 'border-rose-500' : 'border-input'
                )}
              />
              {errors.amount && (
                <p className="text-[11px] text-rose-500">{errors.amount}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label htmlFor="tx-category" className="font-medium text-foreground">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="tx-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label htmlFor="tx-date" className="font-medium text-foreground">
              Date <span className="text-rose-500">*</span>
            </label>
            <input
              id="tx-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={cn(
                'w-full rounded-lg border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors',
                errors.date ? 'border-rose-500' : 'border-input'
              )}
            />
            {errors.date && (
              <p className="text-[11px] text-rose-500">{errors.date}</p>
            )}
          </div>

          {/* Note */}
          <div className="space-y-1">
            <label htmlFor="tx-note" className="font-medium text-foreground">
              Note (Optional)
            </label>
            <textarea
              id="tx-note"
              rows={2}
              placeholder="Add extra details or comments..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors resize-none"
            />
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {initialData ? 'Save Changes' : 'Add Transaction'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
