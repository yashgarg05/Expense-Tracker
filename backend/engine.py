def _get_storage():
    try:
        from backend import storage
        return storage
    except ImportError:
        import storage
        return storage

class ExpenseTracker():
    def __init__(self):
        self.reload()

    def reload(self):
        st = _get_storage()
        self.transactions = st.load_transactions()
        return self.transactions

    def add_transaction(self, txn):
        self.reload()
        self.transactions.append(txn)
        st = _get_storage()
        st.save_transactions(self.transactions)
        return txn

    def update_transaction(self, txn_id, amount, category, t_type, date, note="", title=""):
        self.reload()
        target = None
        for t in self.transactions:
            if t.id == txn_id:
                target = t
                break
        if not target:
            raise ValueError(f"Transaction with id '{txn_id}' not found.")

        target.amount = float(amount)
        target.category = category.strip()
        target.t_type = t_type.lower()
        target.date = date
        target.note = note.strip()
        target.title = title.strip() if title else category.strip()

        st = _get_storage()
        st.save_transactions(self.transactions)
        return target

    def delete_transaction(self, txn_id):
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
            "total_income": income,
            "total_expense": expense,
            "net_balance": balance,
            "savings_rate": round(savings_rate, 2)
        }