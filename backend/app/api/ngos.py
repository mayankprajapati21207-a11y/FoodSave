from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, require_roles
from app.models.models import (
    NGO, User, FoodRequest, Donation
)
from app.schemas.schemas import (
    NGOOut, NGOUpdate
)

router = APIRouter(prefix="/ngos", tags=["NGOs & Charities"])

@router.get("", response_model=List[NGOOut])
def list_ngos(
    city: Optional[str] = None,
    verified_only: bool = True,
    db: Session = Depends(get_db)
):
    query = db.query(NGO)
    if verified_only:
        query = query.filter(NGO.is_verified == True)
    if city:
        query = query.filter(NGO.city.ilike(f"%{city}%"))
    return query.order_by(NGO.capacity_people_served.desc()).all()

@router.get("/my-profile", response_model=NGOOut)
def get_my_ngo_profile(
    current_user: User = Depends(require_roles(["ngo"])),
    db: Session = Depends(get_db)
):
    ngo = db.query(NGO).filter(NGO.user_id == current_user.id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO profile not found")
    return ngo

@router.put("/my-profile", response_model=NGOOut)
def update_my_ngo_profile(
    update_in: NGOUpdate,
    current_user: User = Depends(require_roles(["ngo"])),
    db: Session = Depends(get_db)
):
    ngo = db.query(NGO).filter(NGO.user_id == current_user.id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO profile not found")

    for field, val in update_in.model_dump(exclude_unset=True).items():
        if field != "is_verified":
            setattr(ngo, field, val)

    db.commit()
    db.refresh(ngo)
    return ngo

@router.get("/my-stats")
def get_ngo_stats(
    current_user: User = Depends(require_roles(["ngo"])),
    db: Session = Depends(get_db)
):
    ngo = db.query(NGO).filter(NGO.user_id == current_user.id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO profile not found")

    # Completed requests from restaurants
    collected_requests = db.query(FoodRequest).filter(
        FoodRequest.ngo_id == ngo.id,
        FoodRequest.status == "collected"
    ).all()
    requests_food_kg = sum(r.requested_quantity for r in collected_requests)

    # Completed direct donations
    collected_donations = db.query(Donation).filter(
        Donation.ngo_id == ngo.id,
        Donation.status == "collected"
    ).all()
    donations_food_kg = sum(d.quantity for d in collected_donations)

    total_food_collected_kg = round(requests_food_kg + donations_food_kg, 1)
    meals_distributed = int(total_food_collected_kg / 0.4)
    co2_diverted_kg = round(total_food_collected_kg * 2.5, 1)

    return {
        "organization_name": ngo.organization_name,
        "is_verified": ngo.is_verified,
        "capacity_people_served": ngo.capacity_people_served,
        "total_food_collected_kg": total_food_collected_kg,
        "meals_distributed": meals_distributed,
        "co2_diverted_kg": co2_diverted_kg,
        "active_pickups_count": db.query(FoodRequest).filter(
            FoodRequest.ngo_id == ngo.id,
            FoodRequest.status.in_(["pending", "accepted"])
        ).count()
    }

@router.get("/{ngo_id}", response_model=NGOOut)
def get_ngo_by_id(ngo_id: int, db: Session = Depends(get_db)):
    ngo = db.query(NGO).filter(NGO.id == ngo_id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO not found")
    return ngo
