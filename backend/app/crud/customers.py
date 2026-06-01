from sqlalchemy.orm import Session
from app.model import Customer

def get_customer(db: Session, customer_id: int):
    return db.query(Customer).filter(Customer.id == customer_id).first()

def get_customers(db: Session, skip: int = 0, limit: int = 100, active_only: bool = True):
    query = db.query(Customer)
    if active_only:
        query = query.filter(Customer.is_active == True)
    return query.offset(skip).limit(limit).all()

def create_customer(db: Session, customer_data: dict):
    db_customer = Customer(**customer_data)
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def update_customer(db: Session, customer_id: int, update_data: dict):
    db_customer = get_customer(db, customer_id)
    if not db_customer:
        return None
    for field, value in update_data.items():
        setattr(db_customer, field, value)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def delete_customer(db: Session, customer_id: int, hard_delete: bool = False):
    db_customer = get_customer(db, customer_id)
    if not db_customer:
        return None
    if hard_delete:
        db.delete(db_customer)
    else:
        db_customer.is_active = False
        db.commit()
        db.refresh(db_customer)
    return db_customer