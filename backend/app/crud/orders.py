from sqlalchemy.orm import Session
from app.model import SalesOrder, SalesOrderLine, InventoryTransaction

def create_order(db: Session, order_data: dict) -> SalesOrder:
    db_order = SalesOrder(**order_data)
    db.add(db_order)
    db.flush()
    return db_order

def create_order_line(db: Session, line_data: dict) -> SalesOrderLine:
    line = SalesOrderLine(**line_data)
    db.add(line)
    db.flush()
    return line

def create_inventory_transaction(db: Session, tx_data: dict) -> InventoryTransaction:
    tx = InventoryTransaction(**tx_data)
    db.add(tx)
    db.flush()
    return tx

def get_order(db: Session, order_id: int) -> SalesOrder | None:
    return db.query(SalesOrder).filter(SalesOrder.id == order_id).first()

def get_orders(db: Session, skip: int = 0, limit: int = 100, customer_id: int = None, status: str = None):
    query = db.query(SalesOrder)
    if customer_id:
        query = query.filter(SalesOrder.customer_id == customer_id)
    if status:
        query = query.filter(SalesOrder.status == status)
    return query.order_by(SalesOrder.order_date.desc()).offset(skip).limit(limit).all()

def update_order_status(db: Session, order_id: int, new_status) -> SalesOrder | None:
    order = get_order(db, order_id)
    if order:
        order.status = new_status
        db.commit()
        db.refresh(order)
    return order

def delete_order_hard(db: Session, order_id: int) -> bool:
    order = get_order(db, order_id)
    if order:
        db.delete(order)
        db.commit()
        return True
    return False