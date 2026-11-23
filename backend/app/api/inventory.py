from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, require_roles
from app.models.models import (
    FoodInventory, Restaurant, FoodListing, User
)
from app.schemas.schemas import (
    InventoryCreate, InventoryUpdate, InventoryOut
)

router = APIRouter(prefix="/inventory", tags=["Food Inventory"])

@router.post("", response_model=InventoryOut)
def add_inventory_item(
    item_in: InventoryCreate,
    current_user: User = Depends(require_roles(["restaurant"])),
    db: Session = Depends(get_db)
):
    restaurant = db.query(Restaurant).filter(Restaurant.user_id == current_user.id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant profile not found")

    new_item = FoodInventory(
        restaurant_id=restaurant.id,
        item_name=item_in.item_name,
        category_id=item_in.category_id,
        quantity=item_in.quantity,
        unit=item_in.unit,
        purchase_or_prep_date=item_in.purchase_or_prep_date or datetime.now(timezone.utc),
        expiry_date=item_in.expiry_date,
        storage_condition=item_in.storage_condition,
        status=item_in.status,
        notes=item_in.notes
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.get("/my-inventory", response_model=List[InventoryOut])
def get_restaurant_inventory(
    current_user: User = Depends(require_roles(["restaurant"])),
    db: Session = Depends(get_db)
):
    restaurant = db.query(Restaurant).filter(Restaurant.user_id == current_user.id).first()
    if not restaurant:
        return []
    return db.query(FoodInventory).filter(FoodInventory.restaurant_id == restaurant.id).order_by(FoodInventory.expiry_date.asc()).all()

@router.put("/{item_id}", response_model=InventoryOut)
def update_inventory_item(
    item_id: int,
    item_update: InventoryUpdate,
    current_user: User = Depends(require_roles(["restaurant"])),
    db: Session = Depends(get_db)
):
    restaurant = db.query(Restaurant).filter(Restaurant.user_id == current_user.id).first()
    item = db.query(FoodInventory).filter(FoodInventory.id == item_id).first()
    if not item or item.restaurant_id != restaurant.id:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    for field, val in item_update.model_dump(exclude_unset=True).items():
        setattr(item, field, val)

    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def delete_inventory_item(
    item_id: int,
    current_user: User = Depends(require_roles(["restaurant"])),
    db: Session = Depends(get_db)
):
    restaurant = db.query(Restaurant).filter(Restaurant.user_id == current_user.id).first()
    item = db.query(FoodInventory).filter(FoodInventory.id == item_id).first()
    if not item or item.restaurant_id != restaurant.id:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    db.delete(item)
    db.commit()
    return {"message": "Inventory item removed"}
