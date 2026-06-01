from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.controllers import orders as order_controller
from app.schemas.orders import OrderCreate, OrderResponse, OrderLineResponse

router = APIRouter(prefix="/orders", tags=["Orders"])

def build_order_response(order, db):
    """Helper to convert ORM order to response schema"""
    lines_response = []
    for line in order.lines:
        lines_response.append(OrderLineResponse(
            product_id=line.product_id,
            product_name=line.product.name,
            quantity_ordered=line.quantity_ordered,
            quantity_shipped=line.quantity_shipped,
            unit_price=line.unit_price,
            line_total=line.unit_price * line.quantity_ordered
        ))
    total = sum(l.line_total for l in lines_response)
    return OrderResponse(
        id=order.id,
        order_number=order.order_number,
        customer_id=order.customer_id,
        customer_name=order.customer.full_name,
        status=order.status,
        order_date=order.order_date,
        total_amount=total,
        lines=lines_response
    )

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    try:
        db_order = order_controller.create_order_controller(db, order)
        return build_order_response(db_order, db)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/", response_model=List[OrderResponse])
def read_orders(
    skip: int = 0,
    limit: int = 100,
    customer_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    orders = order_controller.get_orders_controller(db, skip, limit, customer_id, status)
    return [build_order_response(o, db) for o in orders if o.status != "CANCELLED"]  # exclude cancelled by default

@router.get("/{order_id}", response_model=OrderResponse)
def read_order(order_id: int, db: Session = Depends(get_db)):
    order = order_controller.get_order_controller(db, order_id)
    if not order or order.status == "CANCELLED":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return build_order_response(order, db)

@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_order(order_id: int, db: Session = Depends(get_db)):
    try:
        result = order_controller.cancel_order_controller(db, order_id)
        if not result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return None