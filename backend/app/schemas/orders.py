from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class OrderStatusEnum(str, Enum):
    DRAFT = "DRAFT"
    CONFIRMED = "CONFIRMED"
    SHIPPED = "SHIPPED"
    RECEIVED = "RECEIVED"
    CANCELLED = "CANCELLED"

class OrderLineCreate(BaseModel):
    product_id: int
    quantity_ordered: int = Field(..., gt=0)
    unit_price: Optional[float] = None  # if not provided, use product's price

class OrderCreate(BaseModel):
    customer_id: int
    order_number: Optional[str] = None
    lines: List[OrderLineCreate]

class OrderLineResponse(BaseModel):
    product_id: int
    product_name: str
    quantity_ordered: int
    quantity_shipped: int
    unit_price: float
    line_total: float

class OrderResponse(BaseModel):
    id: int
    order_number: str
    customer_id: int
    customer_name: str
    status: OrderStatusEnum
    order_date: datetime
    total_amount: float
    lines: List[OrderLineResponse]

    class Config:
        from_attributes = True