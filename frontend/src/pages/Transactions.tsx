import type { Transaction } from '../types/transaction';
import { TransactionTable } from '../components/transactions/TransactionTable';

interface TransactionsPageProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onOpenAddModal: () => void;
}

export const Transactions: React.FC<TransactionsPageProps> = ({
  transactions,
  onEdit,
  onDelete,
  onOpenAddModal,
}) => {
  return (
    <div className="space-y-6">
      <TransactionTable
        transactions={transactions}
        onEdit={onEdit}
        onDelete={onDelete}
        onOpenAddModal={onOpenAddModal}
      />
    </div>
  );
};
