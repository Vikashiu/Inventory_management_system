from sqlalchemy.orm import Session
from app.crud import customers as customer_crud
from app.schemas.customers import CustomerCreate, CustomerUpdate
from typing import List, Optional

def create_customer_controller(db: Session, customer: CustomerCreate):
    # Email uniqueness check
    existing = customer_crud.get_customers(db, active_only=False)
    if any(c.email == customer.email for c in existing):
        raise ValueError("Email already registered")
    return customer_crud.create_customer(db, customer.model_dump())

def get_customers_controller(db: Session, skip: int = 0, limit: int = 100, include_inactive: bool = False):
    active_only = not include_inactive
    return customer_crud.get_customers(db, skip=skip, limit=limit, active_only=active_only)

def get_customer_controller(db: Session, customer_id: int):
    return customer_crud.get_customer(db, customer_id)

def update_customer_controller(db: Session, customer_id: int, customer_update: CustomerUpdate):
    if customer_update.email:
        existing = customer_crud.get_customers(db, active_only=False)
        if any(c.email == customer_update.email and c.id != customer_id for c in existing):
            raise ValueError("Email already in use")
    update_data = customer_update.model_dump(exclude_unset=True)
    return customer_crud.update_customer(db, customer_id, update_data)

def delete_customer_controller(db: Session, customer_id: int, hard_delete: bool = False):
    # Optional: prevent hard delete if customer has orders
    if hard_delete:
        customer = customer_crud.get_customer(db, customer_id)
        if customer and customer.orders:
            raise ValueError("Cannot hard delete customer with existing orders")
    # soft_delete = not hard_delete
    return customer_crud.delete_customer(db, customer_id, hard_delete=hard_delete)