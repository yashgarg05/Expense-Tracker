import json
import os
import shutil
import tempfile
import unittest
from pathlib import Path

# Add project root to sys.path
import sys
root_dir = Path(__file__).resolve().parent.parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from backend.models import Transaction
from backend.storage import load_transactions, save_transactions, get_file_path, get_backup_path
from backend.engine import ExpenseTracker

class TestBackendReliability(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp(prefix="expense_tracker_test_")
        os.environ["EXPENSE_TRACKER_DATA_DIR"] = self.temp_dir
        self.tracker = ExpenseTracker()

    def tearDown(self):
        if "EXPENSE_TRACKER_DATA_DIR" in os.environ:
            del os.environ["EXPENSE_TRACKER_DATA_DIR"]
        shutil.rmtree(self.temp_dir, ignore_errors=True)

    def test_missing_json_file(self):
        # When file does not exist, should return empty list without error
        file_path = get_file_path()
        if file_path.exists():
            os.remove(file_path)
        txns = load_transactions()
        self.assertEqual(txns, [])

    def test_empty_json_file(self):
        file_path = get_file_path()
        file_path.parent.mkdir(parents=True, exist_ok=True)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write("   \n ")
        txns = load_transactions()
        self.assertEqual(txns, [])

    def test_valid_crud_operations(self):
        # Add transaction
        txn = Transaction(
            amount=150.50,
            category="Food",
            t_type="expense",
            date="2026-09-07",
            title="Groceries",
            note="Weekly shopping"
        )
        saved = self.tracker.add_transaction(txn)
        self.assertIsNotNone(saved.id)

        # List transactions
        all_txns = self.tracker.list_transactions()
        self.assertEqual(len(all_txns), 1)
        self.assertEqual(all_txns[0].amount, 150.50)

        # Update transaction
        updated = self.tracker.update_transaction(
            txn_id=saved.id,
            amount=175.00,
            category="Food",
            t_type="expense",
            date="2026-09-07",
            title="Groceries Updated",
            note="Adjusted price"
        )
        self.assertEqual(updated.amount, 175.00)
        self.assertEqual(updated.title, "Groceries Updated")

        # Summary check
        summary = self.tracker.summary()
        self.assertEqual(summary["total_expense"], 175.00)
        self.assertEqual(summary["net_balance"], -175.00)

        # Delete transaction
        res = self.tracker.delete_transaction(saved.id)
        self.assertTrue(res)
        self.assertEqual(self.tracker.list_transactions(), [])

    def test_malformed_json_preserves_file(self):
        file_path = get_file_path()
        file_path.parent.mkdir(parents=True, exist_ok=True)
        corrupt_content = "{ invalid json content..."
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(corrupt_content)

        with self.assertRaises(ValueError) as ctx:
            load_transactions()
        self.assertIn("Corrupt JSON format", str(ctx.exception))

        # Original file must still exist and be intact
        with open(file_path, "r", encoding="utf-8") as f:
            self.assertEqual(f.read(), corrupt_content)

        # A corrupt backup must have been created
        corrupt_backups = list(Path(self.temp_dir).glob("transactions.json.corrupt.*"))
        self.assertGreaterEqual(len(corrupt_backups), 1)

    def test_wrong_root_json_type(self):
        file_path = get_file_path()
        file_path.parent.mkdir(parents=True, exist_ok=True)
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump({"foo": "bar"}, f)

        with self.assertRaises(ValueError) as ctx:
            load_transactions()
        self.assertIn("Expected a JSON array", str(ctx.exception))

    def test_malformed_transaction_item(self):
        file_path = get_file_path()
        file_path.parent.mkdir(parents=True, exist_ok=True)
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump([{"invalid_field": 123}], f)

        with self.assertRaises(ValueError) as ctx:
            load_transactions()
        self.assertIn("Failed to read transaction at index 0", str(ctx.exception))

    def test_invalid_transaction_inputs(self):
        # Negative amount
        with self.assertRaises(ValueError):
            Transaction(amount=-50, category="Food", t_type="expense", date="2026-09-07")

        # Zero amount
        with self.assertRaises(ValueError):
            Transaction(amount=0, category="Food", t_type="expense", date="2026-09-07")

        # NaN / Infinity
        with self.assertRaises(ValueError):
            Transaction(amount=float("nan"), category="Food", t_type="expense", date="2026-09-07")

        with self.assertRaises(ValueError):
            Transaction(amount=float("inf"), category="Food", t_type="expense", date="2026-09-07")

        # Invalid t_type
        with self.assertRaises(ValueError):
            Transaction(amount=100, category="Food", t_type="invalid_type", date="2026-09-07")

        # Invalid date
        with self.assertRaises(ValueError):
            Transaction(amount=100, category="Food", t_type="expense", date="2026-02-31")

        with self.assertRaises(ValueError):
            Transaction(amount=100, category="Food", t_type="expense", date="invalid-date")

        # Empty category
        with self.assertRaises(ValueError):
            Transaction(amount=100, category="   ", t_type="expense", date="2026-09-07")

    def test_update_nonexistent_id(self):
        with self.assertRaises(ValueError) as ctx:
            self.tracker.update_transaction("nonexistent_id", 100, "Food", "expense", "2026-09-07")
        self.assertIn("not found", str(ctx.exception))

    def test_delete_nonexistent_id(self):
        with self.assertRaises(ValueError) as ctx:
            self.tracker.delete_transaction("nonexistent_id")
        self.assertIn("not found", str(ctx.exception))

    def test_atomic_write_and_backup(self):
        txn = Transaction(amount=100, category="Salary", t_type="income", date="2026-09-07")
        self.tracker.add_transaction(txn)

        file_path = get_file_path()
        backup_path = get_backup_path()
        self.assertTrue(file_path.exists())

        # Second save should create backup
        txn2 = Transaction(amount=50, category="Food", t_type="expense", date="2026-09-07")
        self.tracker.add_transaction(txn2)

        self.assertTrue(backup_path.exists())
        with open(backup_path, "r", encoding="utf-8") as f:
            bak_data = json.load(f)
            self.assertEqual(len(bak_data), 1)

        with open(file_path, "r", encoding="utf-8") as f:
            current_data = json.load(f)
            self.assertEqual(len(current_data), 2)

if __name__ == "__main__":
    unittest.main()
