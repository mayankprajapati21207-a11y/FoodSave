from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from app.core.database import get_db
from app.core.security import (
    get_password_hash, verify_password, create_access_token, get_current_user
)
from app.core.config import settings
from app.models.models import (
    User, Restaurant, NGO, Donor, Customer, Notification, AdminLog
)
from app.schemas.schemas import (
    UserRegister, UserLogin, Token, UserOut, UserUpdate
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # Check if user exists
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    # Create User
    hashed_pwd = get_password_hash(user_in.password)
    new_user = User(
        email=user_in.email,
        hashed_password=hashed_pwd,
        full_name=user_in.full_name,
        phone=user_in.phone,
        role=user_in.role,
        is_active=True,
        is_verified=True if user_in.role in ["customer", "donor"] else False, # Restaurants & NGOs require verification
        avatar_url=f"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create role specific profile
    if user_in.role == "restaurant":
        rest = Restaurant(
            user_id=new_user.id,
            name=user_in.restaurant_name or f"{user_in.full_name}'s Eatery",
            address=user_in.restaurant_address or "123 Green Avenue, Downtown",
            cuisine_type=user_in.restaurant_cuisine or "Multi-Cuisine",
            is_verified=True # Auto-verify for easy demonstration
        )
        db.add(rest)
    elif user_in.role == "ngo":
        ngo = NGO(
            user_id=new_user.id,
            organization_name=user_in.ngo_name or f"{user_in.full_name} Charity Foundation",
            registration_number=user_in.ngo_registration_number or "REG-2026-NGO",
            address=user_in.ngo_address or "45 Hope Street, Downtown",
            is_verified=True
        )
        db.add(ngo)
    elif user_in.role == "donor":
        donor = Donor(
            user_id=new_user.id,
            donor_type=user_in.donor_type or "individual",
            organization_name=user_in.donor_org_name,
            address="Residential Area, Downtown"
        )
        db.add(donor)
    elif user_in.role == "customer":
        cust = Customer(
            user_id=new_user.id,
            default_address=user_in.customer_address or "12 Community Lane, Downtown",
            phone=user_in.phone
        )
        db.add(cust)

    # Welcome notification
    welcome_notif = Notification(
        user_id=new_user.id,
        title="Welcome to FoodSave!",
        message="Thank you for joining our mission to save food and reduce waste.",
        type="system"
    )
    db.add(welcome_notif)

    # Admin log
    log = AdminLog(
        admin_id=None,
        action="USER_REGISTERED",
        target_type="User",
        target_id=new_user.id,
        details=f"New user registered with role {new_user.role}: {new_user.email}"
    )
    db.add(log)
    db.commit()

    # Generate token
    token = create_access_token({"sub": str(new_user.id), "role": new_user.role, "email": new_user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Please contact support."
        )

    token = create_access_token({"sub": str(user.id), "role": user.role, "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserOut)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserOut)
def update_profile(update_data: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if update_data.full_name is not None:
        current_user.full_name = update_data.full_name
    if update_data.phone is not None:
        current_user.phone = update_data.phone
    if update_data.avatar_url is not None:
        current_user.avatar_url = update_data.avatar_url
    
    db.commit()
    db.refresh(current_user)
    return current_user
