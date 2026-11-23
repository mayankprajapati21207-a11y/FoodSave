from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from app.core.database import get_db
from app.core.security import get_current_user, require_roles
from app.models.models import (
    FoodListing, Restaurant, FoodCategory, User, Notification
)
from app.schemas.schemas import (
    ListingCreate, ListingUpdate, ListingOut
)

router = APIRouter(prefix="/food-listings", tags=["Food Listings"])

@router.get("", response_model=List[ListingOut])
def get_listings(
    category_id: Optional[int] = None,
    restaurant_id: Optional[int] = None,
    search: Optional[str] = None,
    is_free_only: Optional[bool] = None,
    max_price: Optional[float] = None,
    status_filter: Optional[str] = "available",
    db: Session = Depends(get_db)
):
    query = db.query(FoodListing).filter(FoodListing.is_approved_by_admin == True)
    
    if status_filter:
        query = query.filter(FoodListing.status == status_filter)
    if category_id:
        query = query.filter(FoodListing.category_id == category_id)
    if restaurant_id:
        query = query.filter(FoodListing.restaurant_id == restaurant_id)
    if is_free_only is not None and is_free_only:
        query = query.filter(FoodListing.is_free_donation == True)
    if max_price is not None:
        query = query.filter(FoodListing.discount_price <= max_price)
    if search:
        query = query.filter(FoodListing.title.ilike(f"%{search}%") | FoodListing.description.ilike(f"%{search}%"))

    # Return latest first
    return query.order_by(FoodListing.created_at.desc()).all()

@router.get("/my-listings", response_model=List[ListingOut])
def get_restaurant_listings(
    current_user: User = Depends(require_roles(["restaurant"])),
    db: Session = Depends(get_db)
):
    restaurant = db.query(Restaurant).filter(Restaurant.user_id == current_user.id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant profile not found")
    return db.query(FoodListing).filter(FoodListing.restaurant_id == restaurant.id).order_by(FoodListing.created_at.desc()).all()

@router.get("/{listing_id}", response_model=ListingOut)
def get_listing(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(FoodListing).filter(FoodListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Food listing not found")
    return listing

@router.post("", response_model=ListingOut)
def create_listing(
    listing_in: ListingCreate,
    current_user: User = Depends(require_roles(["restaurant", "super_admin"])),
    db: Session = Depends(get_db)
):
    restaurant = db.query(Restaurant).filter(Restaurant.user_id == current_user.id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant profile not found")

    # Safety verification check: expiry must be in the future, safety checklist acknowledged
    now = datetime.now(timezone.utc)
    expiry = listing_in.expiry_time or listing_in.expires_at or (now + timedelta(hours=24))
    if expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)

    if expiry <= now:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Food safety violation: Expiry time must be in the future. Expired food cannot be listed."
        )

    if not listing_in.safety_certified_by_owner:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Food safety verification required: You must certify proper temperature control and hygienic packing before listing."
        )

    p_start = listing_in.pickup_start or now
    if p_start.tzinfo is None:
        p_start = p_start.replace(tzinfo=timezone.utc)

    p_end = listing_in.pickup_end or listing_in.pickup_until or expiry
    if p_end.tzinfo is None:
        p_end = p_end.replace(tzinfo=timezone.utc)

    new_listing = FoodListing(
        restaurant_id=restaurant.id,
        title=listing_in.title,
        description=listing_in.description,
        category_id=listing_in.category_id,
        quantity=listing_in.quantity,
        unit=listing_in.unit,
        original_price=listing_in.original_price,
        discount_price=listing_in.discount_price,
        is_free_donation=listing_in.is_free_donation,
        preparation_time=listing_in.preparation_time or now,
        expiry_time=expiry,
        pickup_start=p_start,
        pickup_end=p_end,
        storage_info=listing_in.storage_info,
        image_url=listing_in.image_url or "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
        status="available",
        is_approved_by_admin=True, # Approved by default for smooth workflow
        safety_certified_by_owner=True
    )
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)
    return new_listing

@router.put("/{listing_id}", response_model=ListingOut)
def update_listing(
    listing_id: int,
    listing_in: ListingUpdate,
    current_user: User = Depends(require_roles(["restaurant", "super_admin"])),
    db: Session = Depends(get_db)
):
    listing = db.query(FoodListing).filter(FoodListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Food listing not found")

    # If restaurant owner, verify ownership
    if current_user.role == "restaurant":
        rest = db.query(Restaurant).filter(Restaurant.user_id == current_user.id).first()
        if not rest or listing.restaurant_id != rest.id:
            raise HTTPException(status_code=403, detail="Not authorized to edit this listing")

    for field, val in listing_in.model_dump(exclude_unset=True).items():
        setattr(listing, field, val)

    db.commit()
    db.refresh(listing)
    return listing

@router.delete("/{listing_id}")
def delete_listing(
    listing_id: int,
    current_user: User = Depends(require_roles(["restaurant", "super_admin"])),
    db: Session = Depends(get_db)
):
    listing = db.query(FoodListing).filter(FoodListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    if current_user.role == "restaurant":
        rest = db.query(Restaurant).filter(Restaurant.user_id == current_user.id).first()
        if not rest or listing.restaurant_id != rest.id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this listing")

    listing.status = "cancelled"
    db.commit()
    return {"message": "Listing cancelled successfully"}
