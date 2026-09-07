import math
import uuid
from datetime import datetime

class Transaction:
    def __init__(self, amount, category, t_type, date, note="", title="", id=None):
        if not id or not isinstance(id, str) or not id.strip():
            self.id = f"tx-{uuid.uuid4().hex[:8]}"
        else:
            self.id = str(id).strip()

        if not category or not isinstance(category, str) or not category.strip():
            raise ValueError("Transaction category cannot be empty.")
        self.category = category.strip()

        if not title or not isinstance(title, str) or not title.strip():
            self.title = self.category
        else:
            self.title = title.strip()

        try:
            val = float(amount)
        except (ValueError, TypeError):
            raise ValueError(f"Invalid transaction amount: {amount}")

        if not math.isfinite(val) or val <= 0:
            raise ValueError(f"Transaction amount must be a positive finite number, got {amount}")
        self.amount = round(val, 2)

        if not t_type or not isinstance(t_type, str):
            raise ValueError("Transaction type must be a non-empty string.")
        t_type_clean = t_type.strip().lower()
        if t_type_clean not in ("income", "expense"):
            raise ValueError(f"Transaction type must be 'income' or 'expense', got '{t_type}'")
        self.t_type = t_type_clean

        if not date or not isinstance(date, str):
            raise ValueError("Transaction date must be a valid YYYY-MM-DD string.")
        date_clean = date.strip()
        try:
            datetime.strptime(date_clean, "%Y-%m-%d")
        except ValueError:
            raise ValueError(f"Transaction date must be in YYYY-MM-DD format, got '{date}'")
        self.date = date_clean

        self.note = str(note).strip() if note else ""

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "amount": self.amount,
            "category": self.category,
            "t_type": self.t_type,
            "date": self.date,
            "note": self.note
        }

    @classmethod
    def from_dict(cls, data):
        if not isinstance(data, dict):
            raise ValueError("Transaction data item must be a dictionary.")
        return cls(
            id=data.get("id"),
            title=data.get("title", data.get("category", "")),
            amount=data.get("amount"),
            category=data.get("category", ""),
            t_type=data.get("t_type", ""),
            date=data.get("date", ""),
            note=data.get("note", "")
        )
