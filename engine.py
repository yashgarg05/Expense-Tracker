class ExpenseTracker():
    def __init__(self):
        from storage import load_transactions
        self.transactions = load_transactions()

    def add_transaction(self, txn):
        self.transactions.append(txn)
        from storage import save_transactions
        save_transactions(self.transactions)

    def list_transactions(self):
        return self.transactions
    
    def summary(self):
        income = sum(t.amount for t in self.transactions if t.t_type == "income")
        expense = sum(t.amount for t in self.transactions if t.t_type == "expense")
        balance = income - expense
    
        return {
                "total_income": income,
                "total_expense": expense,
                "net_balance": balance
            }