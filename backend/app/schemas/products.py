from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime

class ProductBase(BaseModel):
    sku: str = Field(..., min_length=1, max_length=50)
    name: str = Field(..., min_length=1, max_length=200)
    price: float = Field(..., gt=0)
    category_id: Optional[int] = None
    unit_code: Optional[str] = None
    reorder_level: int = Field(0, ge=0)
    is_active: bool = True

class ProductCreate(ProductBase):
    initial_stock: int = Field(0, ge=0)  # initial quantity for CurrentStock

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1)
    price: Optional[float] = Field(None, gt=0)
    category_id: Optional[int] = None
    unit_code: Optional[str] = None
    reorder_level: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None

class ProductInDB(ProductBase):
    id: int
    # Note: quantity_in_stock is not stored in Product, comes from CurrentStock
    class Config:
        from_attributes = True

class ProductResponse(ProductInDB):
    quantity_in_stock: int = 0
    updated_at: Optional[datetime] = None  # from CurrentStock

class ProductListResponse(ProductResponse):
    pass