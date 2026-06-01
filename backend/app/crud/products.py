from sqlalchemy.orm import Session
from app.model import Product

def get_product(db: Session, product_id: int):
    return db.query(Product).filter(Product.id == product_id).first()

def get_product_by_sku(db: Session, sku: str):
    return db.query(Product).filter(Product.sku == sku).first()

def get_products(db: Session, skip: int = 0, limit: int = 100, active_only: bool = True):
    query = db.query(Product)
    if active_only:
        query = query.filter(Product.is_active == True)
    return query.offset(skip).limit(limit).all()

def create_product(db: Session, product_data: dict):
    product = Product(**product_data)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

def update_product(db: Session, product_id: int, update_data: dict):
    product = get_product(db, product_id)
    if not product:
        return None
    for field, value in update_data.items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product

def delete_product(db: Session, product_id: int, hard_delete: bool = False):
    product = get_product(db, product_id)
    if not product:
        return None
    if hard_delete:
        db.delete(product)
    else:
        product.is_active = False
    db.commit()
    return product