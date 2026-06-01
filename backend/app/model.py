from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Enum, CheckConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
from app.database import Base

class OrderStatus(enum.Enum):
    DRAFT = "DRAFT"
    CONFIRMED = "CONFIRMED"
    SHIPPED = "SHIPPED"
    RECEIVED = "RECEIVED"
    CANCELLED = "CANCELLED"

class TransactionType(enum.Enum):
    PURCHASE_RECEIPT = "PURCHASE_RECEIPT"
    SALES_SHIPMENT = "SALES_SHIPMENT"
    ADJUSTMENT = "ADJUSTMENT"
    INITIAL = "INITIAL"

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    parent_id = Column(Integer, ForeignKey("categories.id"), nullable=True)

class UnitOfMeasure(Base):
    __tablename__ = "unit_of_measure"

    code = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))
    unit_code = Column(String, ForeignKey("unit_of_measure.code"))
    reorder_level = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    price = Column(Float, nullable=False)

    stock = relationship("CurrentStock", back_populates="product", uselist=False)
    order_lines = relationship("SalesOrderLine", back_populates="product")

class CurrentStock(Base):
    __tablename__ = "current_stock"
    product_id = Column(Integer, ForeignKey("products.id"), primary_key=True)
    quantity = Column(Integer, nullable=False, default=0)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    product = relationship("Product", back_populates="stock")
    __table_args__ = (CheckConstraint('quantity >= 0', name='check_qty_non_negative'),)

class SalesOrder(Base):
    __tablename__ = "sales_orders"
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, nullable=False)
    
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    customer = relationship("Customer", back_populates="orders")

    status = Column(Enum(OrderStatus), default=OrderStatus.DRAFT)
    order_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    lines = relationship("SalesOrderLine", back_populates="order")


class SalesOrderLine(Base):
    __tablename__ = "sales_order_lines"
    id = Column(Integer, primary_key=True, index=True)
    sales_order_id = Column(Integer, ForeignKey("sales_orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity_ordered = Column(Integer, nullable=False)
    quantity_shipped = Column(Integer, default=0)
    unit_price = Column(Float, nullable=False)

    order = relationship("SalesOrder", back_populates="lines")
    product = relationship("Product", back_populates="order_lines")

class InventoryTransaction(Base):
    __tablename__ = "inventory_transactions"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    transaction_type = Column(Enum(TransactionType), nullable=False)
    quantity_change = Column(Integer, nullable=False)
    reference_type = Column(String, nullable=False) # e.g., 'SALES_ORDER_LINE'
    reference_id = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    product = relationship("Product")

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationship to sales orders
    orders = relationship("SalesOrder", back_populates="customer")