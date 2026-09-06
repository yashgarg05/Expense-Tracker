import { useState, useEffect, useMemo } from 'react';
import { AppShell } from './components/layout/AppShell';
import { Overview } from './pages/Overview';
import { Transactions } from './pages/Transactions';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { TransactionDialog } from './components/transactions/TransactionDialog';
import { DeleteTransactionDialog } from './components/transactions/DeleteTransactionDialog';
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  clearTransactions,
} from './lib/api';
import { sortTransactions } from './lib/sort';
import type { Transaction, ActivePage } from './types/transaction';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './components/ui/button';

export function App() {
  const [activePage, setActivePage] = useState<ActivePage>('overview');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Derived sorted transactions: newest date first, newest insertion first for same date
  const sortedTransactions = useMemo(
    () => sortTransactions(transactions),
    [transactions]
  );

  // Dialog states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Open modal for adding new item
  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setIsAddModalOpen(true);
  };

  // Open modal for editing existing item
  const handleOpenEditModal = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsAddModalOpen(true);
  };

  // Save transaction handler (Create or Update)
  const handleSaveTransaction = async (
    data: Omit<Transaction, 'id'> & { id?: string }
  ) => {
    try {
      if (data.id) {
        // Update existing
        const updated = await updateTransaction(data as Transaction);
        setTransactions((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t))
        );
      } else {
        // Create new
        const created = await addTransaction(data);
        setTransactions((prev) => [...prev, created]);
      }
    } catch (err) {
      console.error('Failed to save transaction:', err);
      alert(`Error saving transaction: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Delete transaction handlers
  const handleOpenDeleteModal = (tx: Transaction) => {
    setDeletingTransaction(tx);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTransaction) return;
    try {
      await deleteTransaction(deletingTransaction.id);
      setTransactions((prev) =>
        prev.filter((t) => t.id !== deletingTransaction.id)
      );
      setDeletingTransaction(null);
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      alert(`Error deleting transaction: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Clear all transactions
  const handleClearAll = async () => {
    try {
      await clearTransactions();
      setTransactions([]);
    } catch (err) {
      console.error('Failed to clear transactions:', err);
      alert(`Error clearing transactions: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <>
      <AppShell
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenAddModal={handleOpenAddModal}
      >
        {isLoading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            <p className="text-xs font-medium">Loading transactions from Python backend...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">Failed to connect to Python backend</h3>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
            <Button size="xs" onClick={fetchTransactions} className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" /> Retry Connection
            </Button>
          </div>
        ) : (
          <>
            {activePage === 'overview' && (
              <Overview
                transactions={sortedTransactions}
                onNavigate={setActivePage}
                onOpenAddModal={handleOpenAddModal}
              />
            )}

            {activePage === 'transactions' && (
              <Transactions
                transactions={sortedTransactions}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
                onOpenAddModal={handleOpenAddModal}
              />
            )}

            {activePage === 'analytics' && (
              <Analytics transactions={sortedTransactions} />
            )}

            {activePage === 'settings' && (
              <Settings onClearAll={handleClearAll} />
            )}
          </>
        )}
      </AppShell>

      {/* Add / Edit Dialog */}
      <TransactionDialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveTransaction}
        initialData={editingTransaction}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteTransactionDialog
        isOpen={!!deletingTransaction}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleConfirmDelete}
        transaction={deletingTransaction}
      />
    </>
  );
}

export default App;

