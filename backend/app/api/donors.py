from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, require_roles
from app.models.models import Donor, User, Donation
from app.schemas.schemas import DonorOut

router = APIRouter(prefix="/donors", tags=["Donors"])

@router.get("/my-profile", response_model=DonorOut)
def get_my_donor_profile(
    current_user: User = Depends(require_roles(["donor"])),
    db: Session = Depends(get_db)
):
    donor = db.query(Donor).filter(Donor.user_id == current_user.id).first()
    if not donor:
        raise HTTPException(status_code=404, detail="Donor profile not found")
    return donor

@router.get("/my-stats")
def get_donor_stats(
    current_user: User = Depends(require_roles(["donor"])),
    db: Session = Depends(get_db)
):
    donor = db.query(Donor).filter(Donor.user_id == current_user.id).first()
    if not donor:
        raise HTTPException(status_code=404, detail="Donor profile not found")

    donations = db.query(Donation).filter(Donation.donor_id == donor.id).all()
    collected = [d for d in donations if d.status == "collected"]
    total_kg = sum(d.quantity for d in collected)
    meals = int(total_kg / 0.4)
    co2 = round(total_kg * 2.5, 1)

    return {
        "total_donations_count": len(donations),
        "collected_donations_count": len(collected),
        "total_kg_donated": round(total_kg, 1),
        "meals_provided": meals,
        "co2_saved_kg": co2
    }
