import json
import sys
from pathlib import Path

try:
    from backend.models import Transaction
except ImportError:
    from models import Transaction

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
FILE_PATH = DATA_DIR / "transactions.json"

def load_transactions():
    if not FILE_PATH.exists():
        return []
    try:
        with open(FILE_PATH, "r", encoding="utf-8") as f:
            content = f.read().strip()
            if not content:
                return []
            data = json.loads(content)
            return [Transaction.from_dict(item) for item in data]
    except Exception as e:
        print(f"Error loading transactions: {e}", file=sys.stderr)
        raise e


def save_transactions(transactions):
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    data = [txn.to_dict() for txn in transactions]
    with open(FILE_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)