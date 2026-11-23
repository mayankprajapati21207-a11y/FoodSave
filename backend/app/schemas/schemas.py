from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr, Field

# ----------------- Auth & User -----------------
class Token(BaseModel):
    access_token: str
    token_type: str
    user: "UserOut"

class TokenPayload(BaseModel):
    sub: Optional[str] = None

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    role: str = "customer" # super_admin, restaurant, donor, ngo, customer

class UserRegister(UserBase):
    password: str
    # Optional role-specific profile details during registration
    restaurant_name: Optional[str] = None
    restaurant_address: Optional[str] = None
    restaurant_cuisine: Optional[str] = None
    ngo_name: Optional[str] = None
    ngo_registration_number: Optional[str] = None
    ngo_address: Optional[str] = None
    donor_type: Optional[str] = "individual"
    donor_org_name: Optional[str] = None
    customer_address: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: Optional[bool] = None

class UserOut(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Restaurant -----------------
class RestaurantBase(BaseModel):
    name: str
    description: Optional[str] = None
    address: str
    city: str = "Metro City"
    state: str = "State"
    postal_code: Optional[str] = None
    latitude: Optional[float] = 28.6139
    longitude: Optional[float] = 77.2090
    phone: Optional[str] = None
    email: Optional[str] = None
    fssai_license: Optional[str] = None
    opening_hours: Optional[str] = "09:00 AM - 10:00 PM"
    cuisine_type: Optional[str] = "Multi-Cuisine"
    image_url: Optional[str] = None

class RestaurantCreate(RestaurantBase):
    pass

class RestaurantUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    phone: Optional[str] = None
    opening_hours: Optional[str] = None
    cuisine_type: Optional[str] = None
    image_url: Optional[str] = None
    is_verified: Optional[bool] = None

class RestaurantOut(RestaurantBase):
    id: int
    user_id: int
    rating: float
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- NGO -----------------
class NGOBase(BaseModel):
    organization_name: str
    registration_number: Optional[str] = None
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    address: str
    city: str = "Metro City"
    state: str = "State"
    postal_code: Optional[str] = None
    latitude: Optional[float] = 28.6200
    longitude: Optional[float] = 77.2150
    verification_doc_url: Optional[str] = None
    capacity_people_served: int = 500
    image_url: Optional[str] = None

class NGOCreate(NGOBase):
    pass

class NGOUpdate(BaseModel):
    organization_name: Optional[str] = None
    registration_number: Optional[str] = None
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    capacity_people_served: Optional[int] = None
    is_verified: Optional[bool] = None

class NGOOut(NGOBase):
    id: int
    user_id: int
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Donor -----------------
class DonorBase(BaseModel):
    donor_type: str = "individual"
    organization_name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = "Metro City"
    state: Optional[str] = "State"
    phone: Optional[str] = None

class DonorCreate(DonorBase):
    pass

class DonorOut(DonorBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Customer -----------------
class CustomerBase(BaseModel):
    default_address: Optional[str] = None
    phone: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerOut(CustomerBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Food Category -----------------
class FoodCategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon_name: Optional[str] = "Utensils"

class FoodCategoryOut(FoodCategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Food Inventory -----------------
class InventoryBase(BaseModel):
    item_name: str
    category_id: Optional[int] = None
    quantity: float
    unit: str = "kg"
    purchase_or_prep_date: Optional[datetime] = None
    expiry_date: datetime
    storage_condition: str = "refrigerated" # ambient, refrigerated, frozen
    status: str = "in_stock"
    notes: Optional[str] = None

class InventoryCreate(InventoryBase):
    pass

class InventoryUpdate(BaseModel):
    item_name: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    expiry_date: Optional[datetime] = None
    storage_condition: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class InventoryOut(InventoryBase):
    id: int
    restaurant_id: int
    created_at: datetime
    category: Optional[FoodCategoryOut] = None

    class Config:
        from_attributes = True

# ----------------- Food Listing -----------------
class ListingBase(BaseModel):
    title: str
    description: Optional[str] = None
    category_id: Optional[int] = None
    quantity: float
    unit: str = "portions"
    original_price: float = 0.0
    discount_price: float = 0.0
    is_free_donation: bool = False
    preparation_time: Optional[datetime] = None
    expiry_time: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    pickup_start: Optional[datetime] = None
    pickup_end: Optional[datetime] = None
    pickup_until: Optional[datetime] = None
    storage_info: str = "Freshly packed, refrigerated at 4°C"
    image_url: Optional[str] = None
    safety_certified_by_owner: bool = True

class ListingCreate(ListingBase):
    pass

class ListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    original_price: Optional[float] = None
    discount_price: Optional[float] = None
    is_free_donation: Optional[bool] = None
    expiry_time: Optional[datetime] = None
    pickup_start: Optional[datetime] = None
    pickup_end: Optional[datetime] = None
    storage_info: Optional[str] = None
    image_url: Optional[str] = None
    status: Optional[str] = None
    is_approved_by_admin: Optional[bool] = None

class ListingOut(ListingBase):
    id: int
    restaurant_id: int
    status: str
    is_approved_by_admin: bool
    created_at: datetime
    restaurant: Optional[RestaurantOut] = None
    category: Optional[FoodCategoryOut] = None

    class Config:
        from_attributes = True

# ----------------- Food Request (NGO) -----------------
class FoodRequestCreate(BaseModel):
    listing_id: int
    requested_quantity: float
    notes: Optional[str] = None

class FoodRequestUpdate(BaseModel):
    status: str # pending, accepted, rejected, collected, cancelled
    pickup_scheduled_at: Optional[datetime] = None
    notes: Optional[str] = None

class FoodRequestOut(BaseModel):
    id: int
    listing_id: int
    ngo_id: int
    requested_quantity: float
    status: str
    pickup_scheduled_at: Optional[datetime] = None
    collected_at: Optional[datetime] = None
    notes: Optional[str] = None
    qr_code_token: Optional[str] = None
    created_at: datetime
    listing: Optional[ListingOut] = None
    ngo: Optional[NGOOut] = None

    class Config:
        from_attributes = True

# ----------------- Donation (Direct Donors) -----------------
class DonationBase(BaseModel):
    title: str
    description: Optional[str] = None
    category_id: Optional[int] = None
    quantity: float
    unit: str = "kg"
    pickup_address: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    image_url: Optional[str] = None
    pickup_deadline: datetime

class DonationCreate(DonationBase):
    pass

class DonationUpdate(BaseModel):
    ngo_id: Optional[int] = None
    status: Optional[str] = None # available, requested, accepted, collected, cancelled

class DonationOut(DonationBase):
    id: int
    donor_id: int
    ngo_id: Optional[int] = None
    status: str
    qr_code_token: Optional[str] = None
    created_at: datetime
    donor: Optional[DonorOut] = None
    ngo: Optional[NGOOut] = None
    category: Optional[FoodCategoryOut] = None

    class Config:
        from_attributes = True

# ----------------- Order (Customer) -----------------
class OrderCreate(BaseModel):
    listing_id: int
    quantity: float
    pickup_time_slot: Optional[str] = "Today, 6:00 PM - 8:00 PM"
    payment_method: str = "online" # cash_on_pickup, online

class OrderStatusUpdate(BaseModel):
    status: str # pending, confirmed, ready_for_pickup, completed, cancelled
    cancellation_reason: Optional[str] = None

class OrderOut(BaseModel):
    id: int
    order_number: str
    customer_id: int
    listing_id: int
    quantity: float
    unit_price: float
    total_amount: float
    status: str
    pickup_time_slot: Optional[str] = None
    payment_status: str
    payment_method: str
    qr_code_token: Optional[str] = None
    cancellation_reason: Optional[str] = None
    created_at: datetime
    listing: Optional[ListingOut] = None
    customer: Optional[CustomerOut] = None

    class Config:
        from_attributes = True

# ----------------- Waste Management -----------------
class WasteRecordBase(BaseModel):
    quantity_kg: float
    waste_type: str = "organic" # organic, non_organic, mixed
    reason: str = "overproduction" # expired, overproduction, spoilage, plate_waste, storage_failure
    destination: str = "composting" # composting, bio_gas, landfill, animal_feed
    notes: Optional[str] = None
    date: Optional[datetime] = None

class WasteRecordCreate(WasteRecordBase):
    pass

class WasteRecordOut(WasteRecordBase):
    id: int
    restaurant_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class WasteProcessingCreate(BaseModel):
    waste_record_id: int
    processor_name: str
    processing_method: str = "composting"
    notes: Optional[str] = None

class WasteProcessingOut(BaseModel):
    id: int
    waste_record_id: int
    processor_name: str
    processing_method: str
    completion_date: Optional[datetime] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True

# ----------------- Review -----------------
class ReviewCreate(BaseModel):
    restaurant_id: int
    listing_id: Optional[int] = None
    order_id: Optional[int] = None
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

class ReviewOut(BaseModel):
    id: int
    restaurant_id: int
    user_id: int
    order_id: Optional[int] = None
    listing_id: Optional[int] = None
    rating: int
    comment: Optional[str] = None
    created_at: datetime
    user: Optional[UserOut] = None

    class Config:
        from_attributes = True

# ----------------- Notification -----------------
class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    type: str
    is_read: bool
    link_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Complaint / Contact -----------------
class ComplaintCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class ComplaintUpdate(BaseModel):
    status: str
    admin_notes: Optional[str] = None

class ComplaintOut(ComplaintCreate):
    id: int
    status: str
    admin_notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Admin Stats & Analytics -----------------
class AdminDashboardStats(BaseModel):
    total_users: int
    total_restaurants: int
    total_ngos: int
    total_donors: int
    total_customers: int
    total_food_listed_kg: float
    total_food_donated_kg: float
    total_food_sold_portions: int
    total_food_waste_recorded_kg: float
    total_organic_waste_processed_kg: float
    total_co2_saved_kg: float
    total_meals_saved: int

class LeaderboardEntry(BaseModel):
    restaurant_id: int
    restaurant_name: str
    cuisine_type: str
    food_saved_kg: float
    meals_provided: int
    co2_diverted_kg: float
    rating: float

# ----------------- Calculator -----------------
class WasteCalculatorInput(BaseModel):
    waste_type: str = "cooked_meals" # cooked_meals, bakery, fresh_produce, dairy, mixed
    quantity_kg_per_week: float
    weeks: int = 52

class WasteCalculatorResult(BaseModel):
    annual_waste_kg: float
    annual_co2_kg: float
    annual_water_liters: float
    annual_financial_loss: float
    potential_meals_saved: int
    trees_equivalent: float
