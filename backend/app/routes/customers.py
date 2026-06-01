from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.controllers import customers as customer_controller
from app.schemas.customers import CustomerCreate, CustomerUpdate, CustomerResponse

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.post("/", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    try:
        return customer_controller.create_customer_controller(db, customer)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/", response_model=List[CustomerResponse])
def read_customers(
    skip: int = 0, 
    limit: int = 100, 
    include_inactive: bool = False,
    db: Session = Depends(get_db)
):
    # Call controller method (you'll need to implement this in the controller)
    customers = customer_controller.get_customers_controller(db, skip=skip, limit=limit, include_inactive=include_inactive)
    return customers

@router.get("/{customer_id}", response_model=CustomerResponse)
def read_customer(customer_id: int, db: Session = Depends(get_db)):
    db_customer = customer_controller.get_customer_controller(db, customer_id)
    if not db_customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    if not db_customer.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer is inactive")
    return db_customer

@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(
    customer_id: int, 
    customer_update: CustomerUpdate, 
    db: Session = Depends(get_db)
):
    try:
        db_customer = customer_controller.update_customer_controller(db, customer_id, customer_update)
        if not db_customer:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
        return db_customer
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(
    customer_id: int, 
    hard_delete: bool = False,
    db: Session = Depends(get_db)
):
    try:
        result = customer_controller.delete_customer_controller(db, customer_id, hard_delete=hard_delete)
        if result is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return None