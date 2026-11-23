from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.core.security import get_current_user, require_roles
from app.models.models import (
    WasteRecord, WasteProcessing, Restaurant, User, Notification
)
from app.schemas.schemas import (
    WasteRecordCreate, WasteRecordOut, WasteProcessingCreate, WasteProcessingOut
)

router = APIRouter(prefix="/waste", tags=["Food Waste Management"])

@router.post("/records", response_model=WasteRecordOut)
def record_food_waste(
    waste_in: WasteRecordCreate,
    current_user: User = Depends(require_roles(["restaurant", "super_admin"])),
    db: Session = Depends(get_db)
):
    restaurant = db.query(Restaurant).filter(Restaurant.user_id == current_user.id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant profile not found")

    new_waste = WasteRecord(
        restaurant_id=restaurant.id,
        date=waste_in.date or datetime.now(timezone.utc),
        quantity_kg=waste_in.quantity_kg,
        waste_type=waste_in.waste_type,
        reason=waste_in.reason,
        destination=waste_in.destination,
        notes=waste_in.notes
    )
    db.add(new_waste)
    db.flush()

    # If destination is composting/bio_gas, automatically create processing record
    if waste_in.destination in ["composting", "bio_gas", "recycling"]:
        proc = WasteProcessing(
            waste_record_id=new_waste.id,
            processor_name="GreenCycle Municipal Composting Facility",
            processing_method="composting" if waste_in.destination == "composting" else "biomethanation",
            completion_date=datetime.now(timezone.utc) + timedelta(days=14),
            notes="Scheduled for organic composting and soil enrichment."
        )
        db.add(proc)

    # Waste alert notification if excessive
    if waste_in.quantity_kg > 25.0:
        notif = Notification(
            user_id=current_user.id,
            title="High Waste Alert Detected!",
            message=f"You recorded {waste_in.quantity_kg} kg of {waste_in.waste_type} waste today due to {waste_in.reason}. Consider listing surplus earlier or reviewing batch preparation quantities.",
            type="waste_alert",
            link_url="/dashboard/restaurant/waste"
        )
        db.add(notif)

    db.commit()
    db.refresh(new_waste)
    return new_waste

@router.get("/my-records", response_model=List[WasteRecordOut])
def get_my_waste_records(
    current_user: User = Depends(require_roles(["restaurant"])),
    db: Session = Depends(get_db)
):
    restaurant = db.query(Restaurant).filter(Restaurant.user_id == current_user.id).first()
    if not restaurant:
        return []
    return db.query(WasteRecord).filter(WasteRecord.restaurant_id == restaurant.id).order_by(WasteRecord.date.desc()).all()

@router.get("/summary")
def get_waste_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(WasteRecord)
    if current_user.role == "restaurant":
        restaurant = db.query(Restaurant).filter(Restaurant.user_id == current_user.id).first()
        if restaurant:
            query = query.filter(WasteRecord.restaurant_id == restaurant.id)

    records = query.all()
    total_kg = sum(r.quantity_kg for r in records)
    organic_kg = sum(r.quantity_kg for r in records if r.waste_type == "organic")
    non_organic_kg = sum(r.quantity_kg for r in records if r.waste_type == "non_organic")
    diverted_to_compost = sum(r.quantity_kg for r in records if r.destination in ["composting", "bio_gas"])

    # Group by reason
    reason_map = {}
    for r in records:
        reason_map[r.reason] = round(reason_map.get(r.reason, 0) + r.quantity_kg, 1)

    # CO2 calculation: ~2.5 kg CO2e per kg of food waste sent to landfill; composting reduces emissions by ~80%
    co2_generated = round(total_kg * 2.5, 2)
    co2_avoided = round(diverted_to_compost * 2.0, 2)

    return {
        "total_waste_kg": round(total_kg, 2),
        "organic_kg": round(organic_kg, 2),
        "non_organic_kg": round(non_organic_kg, 2),
        "diverted_to_compost_kg": round(diverted_to_compost, 2),
        "co2_generated_kg": co2_generated,
        "co2_avoided_kg": co2_avoided,
        "by_reason": reason_map,
        "records_count": len(records)
    }

@router.get("/all-records", response_model=List[WasteRecordOut])
def get_all_waste_records_admin(
    current_user: User = Depends(require_roles(["super_admin"])),
    db: Session = Depends(get_db)
):
    return db.query(WasteRecord).order_by(WasteRecord.date.desc()).all()
