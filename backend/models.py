import uuid

class Transaction():
    def __init__(self, amount, category, t_type, date, note="", title="", id=None):
        self.id = id if id else f"tx-{uuid.uuid4().hex[:8]}"
        self.title = title.strip() if title else category.strip()
        self.amount = float(amount)   
        self.category = category.strip()      
        self.t_type = t_type.lower()        
        self.date = date                         
        self.note = note.strip()

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
        return cls(
            id=data.get("id"),
            title=data.get("title", data.get("category", "")),
            amount=data["amount"],
            category=data["category"],
            t_type=data["t_type"],
            date=data["date"],
            note=data.get("note", "")
        )

