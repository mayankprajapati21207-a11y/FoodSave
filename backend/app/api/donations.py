import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, require_roles
from app.models.models import (
    Donation, FoodRequest, FoodListing, NGO, Donor, Restaurant, User, Notification
)
from app.schemas.schemas import (
    DonationCreate, DonationUpdate, DonationOut,
    FoodRequestCreate, FoodRequestUpdate, FoodRequestOut
)

router = APIRouter(prefix="/donations", tags=["Donations & NGO Requests"])

# ------------ Direct Donor Donations ------------
@router.post("", response_model=DonationOut)
def create_donation(
    donation_in: DonationCreate,
    current_user: User = Depends(require_roles(["donor", "super_admin"])),
    db: Session = Depends(get_db)
):
    donor = db.query(Donor).filter(Donor.user_id == current_user.id).first()
    if not donor:
        raise HTTPException(status_code=404, detail="Donor profile not found")

    qr_token = f"QR-DON-{uuid.uuid4().hex[:12].upper()}"
    new_donation = Donation(
        donor_id=donor.id,
        title=donation_in.title,
        description=donation_in.description,
        category_id=donation_in.category_id,
        quantity=donation_in.quantity,
        unit=donation_in.unit,
        pickup_address=donation_in.pickup_address,
        latitude=donation_in.latitude or 28.6139,
        longitude=donation_in.longitude or 77.2090,
        image_url=donation_in.image_url or "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80",
        pickup_deadline=donation_in.pickup_deadline,
        status="available",
        qr_code_token=qr_token
    )
    db.add(new_donation)
    db.commit()
    db.refresh(new_donation)

    # Notify all verified NGOs in the area
    ngos = db.query(NGO).filter(NGO.is_verified == True).all()
    for ngo in ngos:
        if ngo.user_id:
            notif = Notification(
                user_id=ngo.user_id,
                title="New Direct Food Donation Available!",
                message=f"'{donation_in.title}' ({donation_in.quantity} {donation_in.unit}) is available for pickup at {donation_in.pickup_address}.",
                type="donation",
                link_url="/dashboard/ngo/available"
            )
            db.add(notif)
    db.commit()

    return new_donation

@router.get("/available", response_model=List[DonationOut])
def get_available_donations(
    category_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Donation).filter(Donation.status == "available")
    if category_id:
        query = query.filter(Donation.category_id == category_id)
    return query.order_by(Donation.created_at.desc()).all()

@router.get("/my-donations", response_model=List[DonationOut])
def get_my_donations(
    current_user: User = Depends(require_roles(["donor"])),
    db: Session = Depends(get_db)
):
    donor = db.query(Donor).filter(Donor.user_id == current_user.id).first()
    if not donor:
        return []
    return db.query(Donation).filter(Donation.donor_id == donor.id).order_by(Donation.created_at.desc()).all()

@router.get("/ngo-donations", response_model=List[DonationOut])
def get_ngo_claimed_donations(
    current_user: User = Depends(require_roles(["ngo"])),
    db: Session = Depends(get_db)
):
    ngo = db.query(NGO).filter(NGO.user_id == current_user.id).first()
    if not ngo:
        return []
    return db.query(Donation).filter(Donation.ngo_id == ngo.id).order_by(Donation.created_at.desc()).all()

@router.put("/{donation_id}/claim", response_model=DonationOut)
def claim_donation(
    donation_id: int,
    current_user: User = Depends(require_roles(["ngo"])),
    db: Session = Depends(get_db)
):
    ngo = db.query(NGO).filter(NGO.user_id == current_user.id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO profile not found")

    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    if donation.status != "available":
        raise HTTPException(status_code=400, detail="Donation is no longer available")

    donation.ngo_id = ngo.id
    donation.status = "accepted"

    # Notify donor
    if donation.donor and donation.donor.user_id:
        notif = Notification(
            user_id=donation.donor.user_id,
            title="Donation Accepted by NGO!",
            message=f"'{ngo.organization_name}' has accepted your food donation '{donation.title}' and will coordinate pickup.",
            type="donation"
        )
        db.add(notif)

    db.commit()
    db.refresh(donation)
    return donation

# ------------ NGO Requests on Restaurant Surplus ------------
@router.post("/requests", response_model=FoodRequestOut)
def create_ngo_request(
    request_in: FoodRequestCreate,
    current_user: User = Depends(require_roles(["ngo"])),
    db: Session = Depends(get_db)
):
    ngo = db.query(NGO).filter(NGO.user_id == current_user.id).first()
    if not ngo:
        raise HTTPException(status_code=404, detail="NGO profile not found")

    listing = db.query(FoodListing).filter(FoodListing.id == request_in.listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Food listing not found")

    if listing.status != "available":
        raise HTTPException(status_code=400, detail="Food listing is not available for request")

    if request_in.requested_quantity > listing.quantity:
        raise HTTPException(status_code=400, detail=f"Requested quantity exceeds available {listing.quantity} {listing.unit}")

    qr_token = f"QR-REQ-{uuid.uuid4().hex[:12].upper()}"
    new_request = FoodRequest(
        listing_id=listing.id,
        ngo_id=ngo.id,
        requested_quantity=request_in.requested_quantity,
        status="pending",
        notes=request_in.notes,
        qr_code_token=qr_token
    )
    db.add(new_request)

    # Notify restaurant owner
    if listing.restaurant and listing.restaurant.user_id:
        notif = Notification(
            user_id=listing.restaurant.user_id,
            title="NGO Food Donation Request!",
            message=f"{ngo.organization_name} requested {request_in.requested_quantity} {listing.unit} of '{listing.title}'.",
            type="donation",
            link_url="/dashboard/restaurant/requests"
        )
        db.add(notif)

    db.commit()
    db.refresh(new_request)
    return new_request

@router.get("/requests/my-requests", response_model=List[FoodRequestOut])
def get_ngo_requests(
    current_user: User = Depends(require_roles(["ngo"])),
    db: Session = Depends(get_db)
):
    ngo = db.query(NGO).filter(NGO.user_id == current_user.id).first()
    if not ngo:
        return []
    return db.query(FoodRequest).filter(FoodRequest.ngo_id == ngo.id).order_by(FoodRequest.created_at.desc()).all()

@router.get("/requests/restaurant-requests", response_model=List[FoodRequestOut])
def get_restaurant_incoming_requests(
    current_user: User = Depends(require_roles(["restaurant"])),
    db: Session = Depends(get_db)
):
    restaurant = db.query(Restaurant).filter(Restaurant.user_id == current_user.id).first()
    if not restaurant:
        return []
    return db.query(FoodRequest).join(FoodListing).filter(FoodListing.restaurant_id == restaurant.id).order_by(FoodRequest.created_at.desc()).all()

@router.put("/requests/{request_id}", response_model=FoodRequestOut)
def update_ngo_request_status(
    request_id: int,
    update_in: FoodRequestUpdate,
    current_user: User = Depends(require_roles(["restaurant", "ngo", "super_admin"])),
    db: Session = Depends(get_db)
):
    req = db.query(FoodRequest).filter(FoodRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    req.status = update_in.status
    if update_in.pickup_scheduled_at:
        req.pickup_scheduled_at = update_in.pickup_scheduled_at
    if update_in.notes:
        req.notes = update_in.notes

    if update_in.status == "accepted":
        # Deduct quantity from listing
        if req.listing:
            req.listing.quantity = max(0.0, req.listing.quantity - req.requested_quantity)
            if req.listing.quantity == 0:
                req.listing.status = "reserved"

    if update_in.status == "collected":
        req.collected_at = datetime.now(timezone.utc)

    # Notify NGO
    if req.ngo and req.ngo.user_id:
        notif = Notification(
            user_id=req.ngo.user_id,
            title=f"Food Request {update_in.status.capitalize()}!",
            message=f"Your request for '{req.listing.title if req.listing else 'Food'}' has been {update_in.status}.",
            type="donation"
        )
        db.add(notif)

    db.commit()
    db.refresh(req)
    return req

@router.post("/verify-collection-qr")
def verify_donation_collection_qr(
    qr_token: str,
    current_user: User = Depends(require_roles(["restaurant", "donor", "super_admin"])),
    db: Session = Depends(get_db)
):
    # Check food requests
    req = db.query(FoodRequest).filter(FoodRequest.qr_code_token == qr_token).first()
    if req:
        req.status = "collected"
        req.collected_at = datetime.now(timezone.utc)
        db.commit()
        return {
            "status": "success",
            "message": f"Successfully verified NGO collection for {req.requested_quantity} {req.listing.unit} of '{req.listing.title}' by {req.ngo.organization_name}!",
            "details": {
                "ngo": req.ngo.organization_name,
                "quantity": req.requested_quantity,
                "item": req.listing.title
            }
        }

    # Check direct donations
    don = db.query(Donation).filter(Donation.qr_code_token == qr_token).first()
    if don:
        don.status = "collected"
        db.commit()
        return {
            "status": "success",
            "message": f"Successfully verified direct food collection for '{don.title}' ({don.quantity} {don.unit})!",
            "details": {
                "ngo": don.ngo.organization_name if don.ngo else "Verified Collector",
                "quantity": don.quantity,
                "item": don.title
            }
        }

    raise HTTPException(status_code=404, detail="Invalid donation collection QR token.")
