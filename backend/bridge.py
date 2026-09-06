import sys
import json
from pathlib import Path

# Ensure root directory and backend directory are in sys.path
root_dir = Path(__file__).resolve().parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

try:
    from backend.engine import ExpenseTracker
    from backend.models import Transaction
except ImportError:
    from engine import ExpenseTracker
    from models import Transaction

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No command specified."}))
        sys.exit(1)

    command = sys.argv[1]
    payload_str = sys.argv[2] if len(sys.argv) > 2 else "{}"

    try:
        payload = json.loads(payload_str) if payload_str else {}
    except Exception as e:
        print(json.dumps({"success": False, "error": f"Invalid JSON payload: {e}"}))
        sys.exit(1)

    tracker = ExpenseTracker()

    try:
        if command == "get_transactions":
            txns = tracker.list_transactions()
            result = [t.to_dict() for t in txns]
            print(json.dumps({"success": True, "data": result}))

        elif command == "add_transaction":
            tx_data = payload.get("transaction", payload)
            txn = Transaction(
                amount=tx_data["amount"],
                category=tx_data["category"],
                t_type=tx_data["t_type"],
                date=tx_data["date"],
                note=tx_data.get("note", ""),
                title=tx_data.get("title", ""),
                id=tx_data.get("id")
            )
            saved = tracker.add_transaction(txn)
            print(json.dumps({"success": True, "data": saved.to_dict()}))

        elif command == "update_transaction":
            tx_data = payload.get("transaction", payload)
            txn_id = tx_data.get("id")
            if not txn_id:
                raise ValueError("Missing transaction 'id' for update.")
            updated = tracker.update_transaction(
                txn_id=txn_id,
                amount=tx_data["amount"],
                category=tx_data["category"],
                t_type=tx_data["t_type"],
                date=tx_data["date"],
                note=tx_data.get("note", ""),
                title=tx_data.get("title", "")
            )
            print(json.dumps({"success": True, "data": updated.to_dict()}))

        elif command == "delete_transaction":
            txn_id = payload.get("id")
            if not txn_id:
                raise ValueError("Missing 'id' for delete.")
            res = tracker.delete_transaction(txn_id)
            print(json.dumps({"success": True, "data": res}))

        elif command == "clear_transactions":
            res = tracker.clear_transactions()
            print(json.dumps({"success": True, "data": res}))

        elif command == "get_summary":
            sum_data = tracker.summary()
            print(json.dumps({"success": True, "data": sum_data}))

        else:
            print(json.dumps({"success": False, "error": f"Unknown command: {command}"}))
            sys.exit(1)

    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
