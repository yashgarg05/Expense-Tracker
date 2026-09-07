import uuid

def _get_storage():
    try:
        from backend import storage
        return storage
    except ImportError:
        import storage
        return storage

try:
    from backend.models import Transaction
except ImportError:
    from models import Transaction

class ExpenseTracker:
    def __init__(self):
        self.transactions = []
        self.reload()

    def reload(self):
        st = _get_storage()
        self.transactions = st.load_transactions()
        return self.transactions

    def add_transaction(self, txn):
        if not isinstance(txn, Transaction):
            if isinstance(txn, dict):
                txn = Transaction.from_dict(txn)
            else:
                raise ValueError("Invalid transaction object.")

        self.reload()

        # Check for ID collision
        existing_ids = {t.id for t in self.transactions}
        if txn.id in existing_ids:
            txn.id = f"tx-{uuid.uuid4().hex[:8]}"

        self.transactions.append(txn)
        st = _get_storage()
        st.save_transactions(self.transactions)
        return txn

    def update_transaction(self, txn_id, amount, category, t_type, date, note="", title=""):
        if not txn_id or not isinstance(txn_id, str):
            raise ValueError("Valid transaction ID is required for update.")

        self.reload()
        target_idx = None
        for idx, t in enumerate(self.transactions):
            if t.id == txn_id:
                target_idx = idx
                break

        if target_idx is None:
            raise ValueError(f"Transaction with id '{txn_id}' not found.")

        # Construct new Transaction object to enforce strict validation rules
        updated_txn = Transaction(
            id=txn_id,
            amount=amount,
            category=category,
            t_type=t_type,
            date=date,
            note=note,
            title=title
        )

        self.transactions[target_idx] = updated_txn
        st = _get_storage()
        st.save_transactions(self.transactions)
        return updated_txn

    def delete_transaction(self, txn_id):
        if not txn_id or not isinstance(txn_id, str):
            raise ValueError("Valid transaction ID is required for deletion.")

        self.reload()
        initial_len = len(self.transactions)
        self.transactions = [t for t in self.transactions if t.id != txn_id]
        if len(self.transactions) == initial_len:
            raise ValueError(f"Transaction with id '{txn_id}' not found.")

        st = _get_storage()
        st.save_transactions(self.transactions)
        return True

    def clear_transactions(self):
        self.transactions = []
        st = _get_storage()
        st.save_transactions(self.transactions)
        return True

    def list_transactions(self):
        return self.reload()

    def summary(self):
        self.reload()
        income = sum(t.amount for t in self.transactions if t.t_type == "income")
        expense = sum(t.amount for t in self.transactions if t.t_type == "expense")
        balance = income - expense
        savings_rate = ((income - expense) / income * 100) if income > 0 else 0.0

        return {
            "total_income": round(income, 2),
            "total_expense": round(expense, 2),
            "net_balance": round(balance, 2),
            "savings_rate": round(savings_rate, 2)
        }