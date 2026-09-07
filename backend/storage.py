import json
import os
import sys
import shutil
import tempfile
from datetime import datetime
from pathlib import Path

try:
    from backend.models import Transaction
except ImportError:
    from models import Transaction

def get_data_dir() -> Path:
    env_dir = os.environ.get("EXPENSE_TRACKER_DATA_DIR")
    if env_dir:
        return Path(env_dir)
    return Path(__file__).resolve().parent / "data"

def get_file_path() -> Path:
    return get_data_dir() / "transactions.json"

def get_backup_path() -> Path:
    return get_data_dir() / "transactions.json.bak"

def create_corrupt_backup(file_path: Path) -> Path:
    data_dir = get_data_dir()
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    corrupt_path = data_dir / f"transactions.json.corrupt.{timestamp}"
    try:
        shutil.copy2(file_path, corrupt_path)
    except Exception as e:
        print(f"Warning: Failed to create corrupt backup: {e}", file=sys.stderr)
    return corrupt_path

def load_transactions():
    file_path = get_file_path()
    if not file_path.exists():
        return []

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read().strip()
            if not content:
                return []
            data = json.loads(content)
    except Exception as e:
        corrupt_path = create_corrupt_backup(file_path)
        raise ValueError(
            f"Failed to read transaction database: Corrupt JSON format. "
            f"Original file preserved at '{corrupt_path.name}'. Error: {e}"
        ) from e

    if not isinstance(data, list):
        corrupt_path = create_corrupt_backup(file_path)
        raise ValueError(
            f"Failed to read transaction database: Expected a JSON array, got {type(data).__name__}. "
            f"Original file preserved at '{corrupt_path.name}'."
        )

    transactions = []
    for idx, item in enumerate(data):
        try:
            transactions.append(Transaction.from_dict(item))
        except Exception as e:
            corrupt_path = create_corrupt_backup(file_path)
            raise ValueError(
                f"Failed to read transaction at index {idx}: {e}. "
                f"Original file preserved at '{corrupt_path.name}'."
            ) from e

    return transactions

def save_transactions(transactions):
    data_dir = get_data_dir()
    data_dir.mkdir(parents=True, exist_ok=True)

    file_path = get_file_path()
    backup_path = get_backup_path()

    # Convert and validate objects before opening files
    data = [txn.to_dict() if isinstance(txn, Transaction) else Transaction.from_dict(txn).to_dict() for txn in transactions]

    # Write to atomic temporary file in same directory
    fd, temp_path_str = tempfile.mkstemp(
        dir=str(data_dir),
        prefix="transactions_tmp_",
        suffix=".json"
    )
    temp_path = Path(temp_path_str)

    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
            f.flush()
            os.fsync(f.fileno())

        # Create single .bak file if existing valid file is present
        if file_path.exists():
            try:
                shutil.copy2(file_path, backup_path)
            except Exception as e:
                print(f"Warning: Failed to create file backup: {e}", file=sys.stderr)

        # Atomic replacement
        os.replace(temp_path, file_path)
    except Exception as e:
        if temp_path.exists():
            try:
                os.remove(temp_path)
            except Exception:
                pass
        raise IOError(f"Failed to save transactions safely: {e}") from e