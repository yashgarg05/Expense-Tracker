import sys
from pathlib import Path

root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

try:
    from backend.models import Transaction
    from backend.engine import ExpenseTracker
except ImportError:
    from models import Transaction
    from engine import ExpenseTracker

from tabulate import tabulate
from datetime import datetime

tracker = ExpenseTracker()

def filter_transactions(transactions, category=None, start_date=None, end_date=None):
    filtered = transactions
    if category:
        filtered = [t for t in filtered if t.category.lower() == category.lower()]   
    if start_date:
        filtered = [t for t in filtered if datetime.strptime(t.date, "%Y-%m-%d") >= datetime.strptime(start_date, "%Y-%m-%d")]
    if end_date:
        filtered = [t for t in filtered if datetime.strptime(t.date, "%Y-%m-%d") <= datetime.strptime(end_date, "%Y-%m-%d")]
    return filtered

def print_transactions(transactions):
    if not transactions:
        print("No transactions yet!")
        return
    
    table = []
    for t in transactions:
        table.append([t.date, t.t_type, t.category, f"{t.amount:.2f}", t.note])
    
    headers = ["Date", "Type", "Category", "Amount", "Note"]
    print(tabulate(table, headers, tablefmt="grid"))

def menu():
    print("\n--- Expense Tracker ---")
    print("1. Add Transaction")
    print("2. View Transactions")
    print("3. View Summary")
    print("4. Edit Transaction")
    print("5. Delete Transaction")
    print("6. Exit")


while True:
    menu()
    choice = input("Enter a choice: ")

    if choice == "1":
        while True:
            try:
                amount = float(input("Amount: "))
                if amount <= 0:
                    raise ValueError("Amount must be positive")
                break
            except ValueError as e:
                print(f"Invalid input: {e}")

        while True:
            t_type = input("Type (income/expense): ").strip().lower()
            if t_type in ("income", "expense"):
                break
            print("Invalid type. Must be 'income' or 'expense'.")

        category = input("Category: ").strip()
        if not category:
            category = "Misc"


        from datetime import datetime
        while True:
            date = input("Date (YYYY-MM-DD): ").strip()
            try:
                datetime.strptime(date, "%Y-%m-%d")
                break
            except ValueError:
                print("Invalid date. Please use YYYY-MM-DD format.")

            
        note = input("Note (optional): ").strip()

        txn = Transaction(amount, category, t_type, date, note)
        tracker.add_transaction(txn)
        print("Transaction added successfully!")

    elif choice == "2":
        transactions = tracker.list_transactions()

        if not transactions:
            print("No transactions yet!")
            continue
        use_filter = input("Do you want to filter by category/date? (y/n): ").strip().lower()
        if use_filter == "y":
            category = input("Category (leave blank for all): ").strip() or None
            start_date = input("Start date YYYY-MM-DD (leave blank for none): ").strip() or None
            end_date = input("End date YYYY-MM-DD (leave blank for none): ").strip() or None
            transactions = filter_transactions(transactions, category, start_date, end_date)

        show_last = input("Show last 5 transactions only? (y/n): ").strip().lower()
        if show_last == "y":
            transactions = transactions[-5:]
        print_transactions(transactions)


    elif choice == "3":
        print(tracker.summary())
    
    elif choice == "4":
        transactions = tracker.list_transactions()
        if not transactions:
            print("No transactions to edit!")
            continue
        for idx, t in enumerate(transactions, 1):
            print(f"{idx}. {t.date} | {t.t_type} | {t.category} | {t.amount} | {t.note}")
        try:
            to_edit = int(input("Enter the number of the transaction to edit: "))
            if not (1 <= to_edit <= len(transactions)):
                print("Invalid number!")
                continue
            txn = transactions[to_edit - 1]
            while True:
                amount = input(f"New amount ({txn.amount}): ").strip()
                if not amount:
                    break
                try:
                    new_amount = float(amount)
                    if new_amount <= 0:
                        raise ValueError
                    txn.amount = new_amount
                    break
                except ValueError:
                    print("Invalid amount. Enter a positive number.")
            while True:
                t_type = input(f"New type ({txn.t_type}): ").strip().lower()
                if not t_type:
                    break
                if t_type in ("income", "expense"):
                    txn.t_type = t_type
                    break
                print("Invalid type. Must be 'income' or 'expense'.")
            category = input(f"New category ({txn.category}): ").strip()
            if category:
                txn.category = category
            while True:
                date = input(f"New date ({txn.date}): ").strip()
                if not date:
                    break
                try:
                    datetime.strptime(date, "%Y-%m-%d")
                    txn.date = date
                    break
                except ValueError:
                    print("Invalid date format. Use YYYY-MM-DD.")
            note = input(f"New note ({txn.note}): ").strip()
            if note:
                txn.note = note

            from storage import save_transactions
            save_transactions(transactions)
            print("Transaction updated!")
        except ValueError:
            print("Invalid input, editing canceled.")

    
    elif choice == "5":
        transactions = tracker.list_transactions()
        if not transactions:
            print("No transaction tos delete!")
            continue
        for idx, t in enumerate(transactions, 1):
            print(f"{idx}. {t.date} | {t.t_type} | {t.category} | {t.amount} | {t.note}")
        try:
            to_delete = int(input("Enter the number of the transaction to delete: "))
            if 1 <= to_delete <= len(transactions):
                removed = transactions.pop(to_delete - 1)
                from storage import save_transactions
                save_transactions(transactions)
                print(f"Deleted transaction: {removed.category} {removed.amount}")
            else:
                print("Invalid selection")
        except ValueError:
            print("Invalid input, deletion canceled.")
    
    elif choice == "6":
        print("Goodbye!")
        break

    else:
        print("Invalid input.")
