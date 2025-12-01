# Expense Tracker

A simple **Python CLI application** to track income and expenses, helping users manage their personal finances efficiently. This project demonstrates Python fundamentals, object-oriented programming, file handling, and data management in a practical product.

---

## Features

* Add, edit, and delete transactions
* View all transactions in a neatly formatted table
* Filter transactions by category or date
* View a summary of total income, expenses, and net balance
* Persistent storage using JSON files

---

## Installation

1. Clone this repository:

```bash
git clone https://github.com/yourusername/Expense-Tracker.git
cd Expense-Tracker
```

2. Ensure you have **Python 3.x** installed:

```bash
python --version
```

3. Run the application:

```bash
python main.py
```

---

## Project Structure

```
Expense-Tracker/
│
├── main.py           # Entry point
├── models.py         # Transaction class
├── engine.py         # ExpenseTracker class & core logic
├── storage.py        # Load/save JSON transactions
├── utils.py          # Helper functions
├── data/             # Sample transactions JSON
│    └── transactions.json
├── README.md
└── .gitignore
```

---

## Dependencies

* Python 3.x (No external packages required for basic CLI functionality)

Optional (if you later add GUI or enhancements):

* `tabulate` (for nicer tables)
* `tkinter` (for GUI version)

---

## How to Use

1. Launch the application: `python main.py`
2. Select an option from the menu:

```
--- Expense Tracker ---
1. Add Transaction
2. View Transactions
3. View Summary
4. Edit Transaction
5. Delete Transaction
6. Exit
```

3. Follow the prompts to manage your transactions.

---

## Future Improvements

* Add a **GUI interface** using Tkinter or Streamlit
* Export transactions to **CSV or Excel**
* Add **charts and graphs** for financial insights
* Implement **authentication** for multiple users

---

## License

This project is licensed under the MIT License.
