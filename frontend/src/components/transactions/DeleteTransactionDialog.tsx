import type { Transaction } from '../../types/transaction';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction?: Transaction | null;
}

export const DeleteTransactionDialog: React.FC<
  DeleteTransactionDialogProps
> = ({ isOpen, onClose, onConfirm, transaction }) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Confirmation Card */}
      <div className="relative z-50 w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl space-y-5 text-foreground select-none animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">
            Delete transaction?
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to delete{' '}
            <span className="font-medium text-foreground">
              "{transaction.title}"
            </span>
            ? This action cannot be undone in local state.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
