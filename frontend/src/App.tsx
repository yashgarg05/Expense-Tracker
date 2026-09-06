import { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { Overview } from './pages/Overview';
import { Transactions } from './pages/Transactions';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { TransactionDialog } from './components/transactions/TransactionDialog';
import { DeleteTransactionDialog } from './components/transactions/DeleteTransactionDialog';
import { INITIAL_MOCK_TRANSACTIONS } from './data/mockTransactions';
import type { Transaction, ActivePage } from './types/transaction';

export function App() {
  const [activePage, setActivePage] = useState<ActivePage>('overview');
  const [transactions, setTransactions] = useState<Transaction[]>(
    INITIAL_MOCK_TRANSACTIONS
  );

  // Dialog states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);

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
  const handleSaveTransaction = (
    data: Omit<Transaction, 'id'> & { id?: string }
  ) => {
    if (data.id) {
      // Update existing
      setTransactions((prev) =>
        prev.map((t) => (t.id === data.id ? ({ ...data, id: data.id } as Transaction) : t))
      );
    } else {
      // Create new with temporary frontend ID
      const newTx: Transaction = {
        ...data,
        id: `tx-${Date.now()}`,
      };
      setTransactions((prev) => [newTx, ...prev]);
    }
  };

  // Delete transaction handlers
  const handleOpenDeleteModal = (tx: Transaction) => {
    setDeletingTransaction(tx);
  };

  const handleConfirmDelete = () => {
    if (!deletingTransaction) return;
    setTransactions((prev) =>
      prev.filter((t) => t.id !== deletingTransaction.id)
    );
    setDeletingTransaction(null);
  };

  // Clear all transactions
  const handleClearAll = () => {
    setTransactions([]);
  };

  return (
    <>
      <AppShell
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenAddModal={handleOpenAddModal}
      >
        {activePage === 'overview' && (
          <Overview
            transactions={transactions}
            onNavigate={setActivePage}
            onOpenAddModal={handleOpenAddModal}
          />
        )}

        {activePage === 'transactions' && (
          <Transactions
            transactions={transactions}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
            onOpenAddModal={handleOpenAddModal}
          />
        )}

        {activePage === 'analytics' && (
          <Analytics transactions={transactions} />
        )}

        {activePage === 'settings' && (
          <Settings onClearAll={handleClearAll} />
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
