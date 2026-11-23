from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Enum
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    role = Column(String(50), nullable=False, default="customer") # super_admin, restaurant, donor, ngo, customer
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Relationships
    restaurant = relationship("Restaurant", back_populates="user", uselist=False, cascade="all, delete-orphan")
    ngo = relationship("NGO", back_populates="user", uselist=False, cascade="all, delete-orphan")
    donor = relationship("Donor", back_populates="user", uselist=False, cascade="all, delete-orphan")
    customer = relationship("Customer", back_populates="user", uselist=False, cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user")
    complaints = relationship("Complaint", back_populates="user")
    admin_logs = relationship("AdminLog", back_populates="admin")


class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    address = Column(String(500), nullable=False)
    city = Column(String(100), nullable=False, default="Metro City")
    state = Column(String(100), nullable=False, default="State")
    postal_code = Column(String(20), nullable=True)
    latitude = Column(Float, nullable=True, default=28.6139)
    longitude = Column(Float, nullable=True, default=77.2090)
    phone = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)
    fssai_license = Column(String(100), nullable=True)
    opening_hours = Column(String(200), default="09:00 AM - 10:00 PM")
    cuisine_type = Column(String(100), default="Multi-Cuisine")
    rating = Column(Float, default=4.8)
    is_verified = Column(Boolean, default=True)
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="restaurant")
    inventory = relationship("FoodInventory", back_populates="restaurant", cascade="all, delete-orphan")
    listings = relationship("FoodListing", back_populates="restaurant", cascade="all, delete-orphan")
    waste_records = relationship("WasteRecord", back_populates="restaurant", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="restaurant")


class NGO(Base):
    __tablename__ = "ngos"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    organization_name = Column(String(255), nullable=False, index=True)
    registration_number = Column(String(100), nullable=True)
    contact_person = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    address = Column(String(500), nullable=False)
    city = Column(String(100), nullable=False, default="Metro City")
    state = Column(String(100), nullable=False, default="State")
    postal_code = Column(String(20), nullable=True)
    latitude = Column(Float, nullable=True, default=28.6200)
    longitude = Column(Float, nullable=True, default=77.2150)
    verification_doc_url = Column(String(500), nullable=True)
    is_verified = Column(Boolean, default=True)
    capacity_people_served = Column(Integer, default=500)
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="ngo")
    requests = relationship("FoodRequest", back_populates="ngo", cascade="all, delete-orphan")
    donations_received = relationship("Donation", back_populates="ngo")


class Donor(Base):
    __tablename__ = "donors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    donor_type = Column(String(50), default="individual") # individual or organization
    organization_name = Column(String(255), nullable=True)
    address = Column(String(500), nullable=True)
    city = Column(String(100), nullable=True, default="Metro City")
    state = Column(String(100), nullable=True, default="State")
    phone = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="donor")
    donations = relationship("Donation", back_populates="donor", cascade="all, delete-orphan")


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    default_address = Column(String(500), nullable=True)
    phone = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="customer")
    orders = relationship("Order", back_populates="customer", cascade="all, delete-orphan")


class FoodCategory(Base):
    __tablename__ = "food_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String(255), nullable=True)
    icon_name = Column(String(50), default="Utensils")
    created_at = Column(DateTime, default=utc_now)

    inventory_items = relationship("FoodInventory", back_populates="category")
    listings = relationship("FoodListing", back_populates="category")
    donations = relationship("Donation", back_populates="category")


class FoodInventory(Base):
    __tablename__ = "food_inventory"

    id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id", ondelete="CASCADE"), nullable=False)
    item_name = Column(String(255), nullable=False)
    category_id = Column(Integer, ForeignKey("food_categories.id"), nullable=True)
    quantity = Column(Float, nullable=False)
    unit = Column(String(50), default="kg") # kg, portions, packets
    purchase_or_prep_date = Column(DateTime, default=utc_now)
    expiry_date = Column(DateTime, nullable=False)
    storage_condition = Column(String(50), default="refrigerated") # ambient, refrigerated, frozen
    status = Column(String(50), default="in_stock") # in_stock, low_stock, wasted, listed
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    restaurant = relationship("Restaurant", back_populates="inventory")
    category = relationship("FoodCategory", back_populates="inventory_items")


class FoodListing(Base):
    __tablename__ = "food_listings"

    id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    category_id = Column(Integer, ForeignKey("food_categories.id"), nullable=True)
    quantity = Column(Float, nullable=False)
    unit = Column(String(50), default="portions") # portions, kg, packets
    original_price = Column(Float, default=0.0)
    discount_price = Column(Float, default=0.0)
    is_free_donation = Column(Boolean, default=False)
    preparation_time = Column(DateTime, default=utc_now)
    expiry_time = Column(DateTime, nullable=False)
    pickup_start = Column(DateTime, nullable=False)
    pickup_end = Column(DateTime, nullable=False)
    storage_info = Column(String(255), default="Freshly packed, refrigerated at 4°C")
    image_url = Column(String(500), nullable=True)
    status = Column(String(50), default="available") # available, reserved, completed, expired, cancelled
    is_approved_by_admin = Column(Boolean, default=True)
    safety_certified_by_owner = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)

    restaurant = relationship("Restaurant", back_populates="listings")
    category = relationship("FoodCategory", back_populates="listings")
    orders = relationship("Order", back_populates="listing")
    requests = relationship("FoodRequest", back_populates="listing")


class FoodRequest(Base):
    __tablename__ = "food_requests"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("food_listings.id", ondelete="CASCADE"), nullable=False)
    ngo_id = Column(Integer, ForeignKey("ngos.id", ondelete="CASCADE"), nullable=False)
    requested_quantity = Column(Float, nullable=False)
    status = Column(String(50), default="pending") # pending, accepted, rejected, collected, cancelled
    pickup_scheduled_at = Column(DateTime, nullable=True)
    collected_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    qr_code_token = Column(String(100), unique=True, index=True, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    listing = relationship("FoodListing", back_populates="requests")
    ngo = relationship("NGO", back_populates="requests")


class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)
    donor_id = Column(Integer, ForeignKey("donors.id", ondelete="CASCADE"), nullable=False)
    ngo_id = Column(Integer, ForeignKey("ngos.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category_id = Column(Integer, ForeignKey("food_categories.id"), nullable=True)
    quantity = Column(Float, nullable=False)
    unit = Column(String(50), default="kg")
    pickup_address = Column(String(500), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    image_url = Column(String(500), nullable=True)
    status = Column(String(50), default="available") # available, requested, accepted, collected, cancelled
    pickup_deadline = Column(DateTime, nullable=False)
    qr_code_token = Column(String(100), unique=True, index=True, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    donor = relationship("Donor", back_populates="donations")
    ngo = relationship("NGO", back_populates="donations_received")
    category = relationship("FoodCategory", back_populates="donations")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(100), unique=True, index=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)
    listing_id = Column(Integer, ForeignKey("food_listings.id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Float, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String(50), default="confirmed") # pending, confirmed, ready_for_pickup, completed, cancelled
    pickup_time_slot = Column(String(100), nullable=True)
    payment_status = Column(String(50), default="completed") # pending, completed, refunded
    payment_method = Column(String(50), default="online") # cash_on_pickup, online
    qr_code_token = Column(String(100), unique=True, index=True, nullable=True)
    cancellation_reason = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=utc_now)

    customer = relationship("Customer", back_populates="orders")
    listing = relationship("FoodListing", back_populates="orders")
    payment = relationship("Payment", back_populates="order", uselist=False, cascade="all, delete-orphan")
    review = relationship("Review", back_populates="order", uselist=False)


class WasteRecord(Base):
    __tablename__ = "waste_records"

    id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id", ondelete="CASCADE"), nullable=False)
    date = Column(DateTime, default=utc_now)
    quantity_kg = Column(Float, nullable=False)
    waste_type = Column(String(50), default="organic") # organic, non_organic, mixed
    reason = Column(String(100), default="overproduction") # expired, overproduction, spoilage, plate_waste, storage_failure
    destination = Column(String(100), default="composting") # composting, bio_gas, landfill, animal_feed
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    restaurant = relationship("Restaurant", back_populates="waste_records")
    processings = relationship("WasteProcessing", back_populates="waste_record", cascade="all, delete-orphan")


class WasteProcessing(Base):
    __tablename__ = "waste_processing"

    id = Column(Integer, primary_key=True, index=True)
    waste_record_id = Column(Integer, ForeignKey("waste_records.id", ondelete="CASCADE"), nullable=False)
    processor_name = Column(String(255), nullable=False)
    processing_method = Column(String(100), default="composting") # composting, biomethanation, recycling
    completion_date = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)

    waste_record = relationship("WasteRecord", back_populates="processings")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), unique=True, nullable=False)
    transaction_id = Column(String(100), unique=True, nullable=False)
    amount = Column(Float, nullable=False)
    payment_method = Column(String(50), default="online")
    status = Column(String(50), default="completed") # pending, completed, failed, refunded
    created_at = Column(DateTime, default=utc_now)

    order = relationship("Order", back_populates="payment")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="SET NULL"), nullable=True)
    listing_id = Column(Integer, ForeignKey("food_listings.id", ondelete="SET NULL"), nullable=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False) # 1 to 5
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    restaurant = relationship("Restaurant", back_populates="reviews")
    user = relationship("User", back_populates="reviews")
    order = relationship("Order", back_populates="review")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="system") # order, donation, waste_alert, system, verification
    is_read = Column(Boolean, default=False)
    link_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="notifications")


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    subject = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(50), default="pending") # pending, investigating, resolved
    admin_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="complaints")


class AdminLog(Base):
    __tablename__ = "admin_logs"

    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(255), nullable=False)
    target_type = Column(String(100), nullable=True)
    target_id = Column(Integer, nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=utc_now)

    admin = relationship("User", back_populates="admin_logs")
