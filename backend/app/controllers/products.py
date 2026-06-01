from sqlalchemy.orm import Session
from app.crud import products as product_crud
from app.model import CurrentStock
from app.schemas.products import ProductCreate, ProductUpdate
from datetime import datetime, timezone

def create_product_controller(db: Session, product: ProductCreate):
    # Check SKU uniqueness
    existing = product_crud.get_product_by_sku(db, product.sku)
    if existing:
        raise ValueError(f"Product with SKU '{product.sku}' already exists")
    
    # Create product
    product_data = product.model_dump(exclude={'initial_stock'})
    db_product = product_crud.create_product(db, product_data)
    
    # Create initial stock record
    initial_stock = product.initial_stock
    stock = CurrentStock(
        product_id=db_product.id,
        quantity=initial_stock,
        updated_at=datetime.now(timezone.utc)
    )
    db.add(stock)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_product_controller(db: Session, product_id: int):
    return product_crud.get_product(db, product_id)

def get_products_controller(db: Session, skip: int = 0, limit: int = 100, include_inactive: bool = False):
    active_only = not include_inactive
    return product_crud.get_products(db, skip, limit, active_only)

def update_product_controller(db: Session, product_id: int, product_update: ProductUpdate):
    # If SKU is being updated, check uniqueness (though SKU update rarely allowed)
    # For simplicity, we don't allow SKU update. If needed, add check.
    update_data = product_update.model_dump(exclude_unset=True)
    return product_crud.update_product(db, product_id, update_data)

def delete_product_controller(db: Session, product_id: int, hard_delete: bool = False):
    # Optional: prevent deletion if product has pending orders
    # For soft delete, just set is_active=False
    return product_crud.delete_product(db, product_id, hard_delete)

def get_product_with_stock(db: Session, product_id: int):
    product = product_crud.get_product(db, product_id)
    if not product:
        return None
    stock = db.query(CurrentStock).filter(CurrentStock.product_id == product_id).first()
    quantity = stock.quantity if stock else 0
    updated_at = stock.updated_at if stock else None
    return product, quantity, updated_at