from datetime import datetime, timedelta


def default_deadline_three_days():
    return datetime.utcnow() + timedelta(days=3)