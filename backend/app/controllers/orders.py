from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.crud import orders as order_crud
from app.crud import customers as customer_crud
from app.crud import products as product_crud   # you need to create this simple CRUD
from app.model import CurrentStock, TransactionType, OrderStatus
from app.schemas.orders import OrderCreate

def generate_order_number(db: Session) -> str:
    last_orders = order_crud.get_orders(db, skip=0, limit=1)
    if last_orders and last_orders[0].order_number.startswith("SO-"):
        try:
            num = int(last_orders[0].order_number.split("-")[1]) + 1
        except:
            num = 1
    else:
        num = 1
    return f"SO-{num:06d}"

def create_order_controller(db: Session, order: OrderCreate):
    # 1. Validate customer
    customer = customer_crud.get_customer(db, order.customer_id)
    if not customer or not customer.is_active:
        raise ValueError("Customer not found or inactive")

    # 2. Generate order number if not provided
    order_number = order.order_number or generate_order_number(db)

    # 3. Validate products, stock, calculate totals
    lines_data = []
    total_amount = 0.0
    for line in order.lines:
        product = product_crud.get_product(db, line.product_id)
        if not product or not product.is_active:
            raise ValueError(f"Product {line.product_id} not found or inactive")
        unit_price = line.unit_price if line.unit_price else product.price

        # Check stock
        current_stock = db.query(CurrentStock).filter(CurrentStock.product_id == product.id).first()
        if not current_stock or current_stock.quantity < line.quantity_ordered:
            raise ValueError(f"Insufficient stock for product {product.sku}. Available: {current_stock.quantity if current_stock else 0}")

        line_total = unit_price * line.quantity_ordered
        total_amount += line_total

        lines_data.append({
            "product_id": product.id,
            "quantity_ordered": line.quantity_ordered,
            "quantity_shipped": 0,
            "unit_price": unit_price,
            "product": product,
        })

    # 4. Create order (status = CONFIRMED)
    order_data = {
        "order_number": order_number,
        "customer_id": order.customer_id,
        "status": OrderStatus.CONFIRMED,
        "order_date": datetime.now(timezone.utc)
    }
    db_order = order_crud.create_order(db, order_data)

    # 5. Create lines, reduce stock, create inventory transactions
    for data in lines_data:
        line_data = {
            "sales_order_id": db_order.id,
            "product_id": data["product_id"],
            "quantity_ordered": data["quantity_ordered"],
            "quantity_shipped": data["quantity_shipped"],
            "unit_price": data["unit_price"]
        }
        line = order_crud.create_order_line(db, line_data)

        # Reduce stock
        current_stock = db.query(CurrentStock).filter(CurrentStock.product_id == data["product_id"]).first()
        if current_stock:
            current_stock.quantity -= data["quantity_ordered"]
            current_stock.updated_at = datetime.now(timezone.utc)

        # Create transaction
        tx_data = {
            "product_id": data["product_id"],
            "transaction_type": TransactionType.SALES_SHIPMENT,
            "quantity_change": -data["quantity_ordered"],
            "reference_type": "SALES_ORDER_LINE",
            "reference_id": line.id,
            "created_at": datetime.now(timezone.utc)
        }
        order_crud.create_inventory_transaction(db, tx_data)

    db.commit()
    db.refresh(db_order)
    return db_order

def get_order_controller(db: Session, order_id: int):
    return order_crud.get_order(db, order_id)

def get_orders_controller(db: Session, skip: int = 0, limit: int = 100, customer_id: int = None, status: str = None):
    return order_crud.get_orders(db, skip, limit, customer_id, status)

def cancel_order_controller(db: Session, order_id: int):
    order = order_crud.get_order(db, order_id)
    if not order:
        return None
    if order.status in [OrderStatus.SHIPPED, OrderStatus.RECEIVED]:
        raise ValueError(f"Cannot cancel order with status {order.status.value}")

    # Restore stock and create adjustment transactions
    for line in order.lines:
        current_stock = db.query(CurrentStock).filter(CurrentStock.product_id == line.product_id).first()
        if current_stock:
            current_stock.quantity += line.quantity_ordered
            current_stock.updated_at = datetime.now(timezone.utc)

        tx_data = {
            "product_id": line.product_id,
            "transaction_type": TransactionType.ADJUSTMENT,
            "quantity_change": line.quantity_ordered,
            "reference_type": "ORDER_CANCELLATION",
            "reference_id": order_id,
            "created_at": datetime.now(timezone.utc)
        }
        order_crud.create_inventory_transaction(db, tx_data)

    # Update order status to CANCELLED
    updated_order = order_crud.update_order_status(db, order_id, OrderStatus.CANCELLED)
    db.commit()
    return updated_order