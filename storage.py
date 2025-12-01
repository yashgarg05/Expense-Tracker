import json
import os
from models import Transaction
File_Path = "data/transaction.json"

def load_transactions():
    if not os.path.exists(File_Path):
        return []
    with open(File_Path,"r") as f:
        data = json.load(f)
        return [Transaction.from_dict(item) for item in data]
def save_transactions(transactions):
    data = [txn.to_dict() for txn in transactions]
    os.makedirs(os.path.dirname(File_Path), exist_ok=True)

    with open(File_Path,"w") as f:
        json.dump(data,f,indent=4)