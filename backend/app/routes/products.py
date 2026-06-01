from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.controllers import products as product_controller
from app.schemas.products import ProductCreate, ProductUpdate, ProductResponse

router = APIRouter(prefix="/products", tags=["Products"])

def build_product_response(product, quantity, updated_at):
    return ProductResponse(
        id=product.id,
        sku=product.sku,
        name=product.name,
        price=product.price,
        category_id=product.category_id,
        unit_code=product.unit_code,
        reorder_level=product.reorder_level,
        is_active=product.is_active,
        quantity_in_stock=quantity,
        updated_at=updated_at
    )

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    try:
        db_product = product_controller.create_product_controller(db, product)
        # Get initial stock (just created)
        _, quantity, updated_at = product_controller.get_product_with_stock(db, db_product.id)
        return build_product_response(db_product, quantity, updated_at)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/", response_model=List[ProductResponse])
def read_products(
    skip: int = 0,
    limit: int = 100,
    include_inactive: bool = False,
    db: Session = Depends(get_db)
):
    products = product_controller.get_products_controller(db, skip, limit, include_inactive)
    result = []
    for p in products:
        _, qty, upd = product_controller.get_product_with_stock(db, p.id)
        result.append(build_product_response(p, qty, upd))
    return result

@router.get("/{product_id}", response_model=ProductResponse)
def read_product(product_id: int, db: Session = Depends(get_db)):
    product, quantity, updated_at = product_controller.get_product_with_stock(db, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    if not product.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product is inactive")
    return build_product_response(product, quantity, updated_at)

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product_update: ProductUpdate, db: Session = Depends(get_db)):
    db_product = product_controller.update_product_controller(db, product_id, product_update)
    if not db_product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    _, quantity, updated_at = product_controller.get_product_with_stock(db, product_id)
    return build_product_response(db_product, quantity, updated_at)

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    hard_delete: bool = False,
    db: Session = Depends(get_db)
):
    result = product_controller.delete_product_controller(db, product_id, hard_delete)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return None