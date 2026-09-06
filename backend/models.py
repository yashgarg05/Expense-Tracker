class Transaction():
    def __init__(self, amount, category, t_type, date, note=""):
        self.amount = float(amount)   
        self.category = category.strip()      
        self.t_type = t_type.lower()        
        self.date = date                         
        self.note = note.strip()
    def to_dict(self):
        return{
            "amount": self.amount,
            "category": self.category,
            "t_type": self.t_type,
            "date": self.date,
            "note": self.note
        }
    @classmethod
    def from_dict(cls, data):
        return cls(
            amount = data["amount"],
            category = data["category"],
            t_type = data["t_type"],
            date = data["date"],
            note = data.get("note","")
        )
