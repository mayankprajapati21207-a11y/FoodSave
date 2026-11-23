import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, require_roles
from app.models.models import (
    Order, FoodListing, Customer, Restaurant, Payment, Notification, User, Review
)
from app.schemas.schemas import (
    OrderCreate, OrderStatusUpdate, OrderOut
)

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("", response_model=OrderOut)
def create_order(
    order_in: OrderCreate,
    current_user: User = Depends(require_roles(["customer"])),
    db: Session = Depends(get_db)
):
    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer profile not found")

    listing = db.query(FoodListing).filter(FoodListing.id == order_in.listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Food listing not found")

    if listing.status != "available":
        raise HTTPException(status_code=400, detail="This food listing is no longer available")

    if order_in.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than 0")

    if order_in.quantity > listing.quantity:
        raise HTTPException(status_code=400, detail=f"Only {listing.quantity} {listing.unit} available")

    unit_price = listing.discount_price
    total_amount = round(unit_price * order_in.quantity, 2)
    order_number = f"FS-ORD-{uuid.uuid4().hex[:8].upper()}"
    qr_token = f"QR-ORD-{uuid.uuid4().hex[:12].upper()}"

    new_order = Order(
        order_number=order_number,
        customer_id=customer.id,
        listing_id=listing.id,
        quantity=order_in.quantity,
        unit_price=unit_price,
        total_amount=total_amount,
        status="confirmed",
        pickup_time_slot=order_in.pickup_time_slot,
        payment_status="completed", # Mock instant digital checkout
        payment_method=order_in.payment_method,
        qr_code_token=qr_token
    )
    db.add(new_order)
    db.flush()

    # Create payment record
    payment = Payment(
        order_id=new_order.id,
        transaction_id=f"TXN-{uuid.uuid4().hex[:10].upper()}",
        amount=total_amount,
        payment_method=order_in.payment_method,
        status="completed"
    )
    db.add(payment)

    # Decrement listing quantity
    listing.quantity -= order_in.quantity
    if listing.quantity <= 0:
        listing.status = "reserved"

    # Notify restaurant owner
    restaurant = listing.restaurant
    if restaurant and restaurant.user_id:
        notif = Notification(
            user_id=restaurant.user_id,
            title="New Food Order Received!",
            message=f"Order #{order_number} for {order_in.quantity} {listing.unit} of '{listing.title}' has been placed.",
            type="order",
            link_url=f"/dashboard/restaurant/orders"
        )
        db.add(notif)

    # Notify customer
    cust_notif = Notification(
        user_id=current_user.id,
        title="Order Confirmed!",
        message=f"Your order #{order_number} is confirmed. Please show your pickup QR code at {restaurant.name if restaurant else 'the restaurant'}.",
        type="order",
        link_url=f"/dashboard/customer/orders"
    )
    db.add(cust_notif)

    db.commit()
    db.refresh(new_order)
    return new_order

@router.get("/my-orders", response_model=List[OrderOut])
def get_my_orders(
    current_user: User = Depends(require_roles(["customer"])),
    db: Session = Depends(get_db)
):
    customer = db.query(Customer).filter(Customer.user_id == current_user.id).first()
    if not customer:
        return []
    return db.query(Order).filter(Order.customer_id == customer.id).order_by(Order.created_at.desc()).all()

@router.get("/restaurant-orders", response_model=List[OrderOut])
def get_restaurant_orders(
    current_user: User = Depends(require_roles(["restaurant"])),
    db: Session = Depends(get_db)
):
    restaurant = db.query(Restaurant).filter(Restaurant.user_id == current_user.id).first()
    if not restaurant:
        return []
    return db.query(Order).join(FoodListing).filter(FoodListing.restaurant_id == restaurant.id).order_by(Order.created_at.desc()).all()

@router.get("/all", response_model=List[OrderOut])
def get_all_orders_admin(
    current_user: User = Depends(require_roles(["super_admin"])),
    db: Session = Depends(get_db)
):
    return db.query(Order).order_by(Order.created_at.desc()).all()

@router.put("/{order_id}/status", response_model=OrderOut)
def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    old_status = order.status
    order.status = status_update.status
    if status_update.cancellation_reason:
        order.cancellation_reason = status_update.cancellation_reason

    # If cancelled, restore quantity to listing if listing was reserved/available
    if status_update.status == "cancelled" and old_status != "cancelled":
        listing = order.listing
        if listing:
            listing.quantity += order.quantity
            if listing.status == "reserved":
                listing.status = "available"

    # Notification to customer
    if order.customer and order.customer.user_id:
        notif = Notification(
            user_id=order.customer.user_id,
            title=f"Order Status: {status_update.status.replace('_', ' ').capitalize()}",
            message=f"Order #{order.order_number} is now {status_update.status.replace('_', ' ')}.",
            type="order"
        )
        db.add(notif)

    db.commit()
    db.refresh(order)
    return order

@router.post("/verify-qr")
def verify_pickup_qr(
    qr_token: str,
    current_user: User = Depends(require_roles(["restaurant", "super_admin"])),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.qr_code_token == qr_token).first()
    if not order:
        raise HTTPException(status_code=404, detail="Invalid QR code verification token.")

    if order.status == "completed":
        return {"status": "already_completed", "message": "This order has already been picked up and completed."}

    order.status = "completed"
    
    # Notify customer of successful handover
    if order.customer and order.customer.user_id:
        notif = Notification(
            user_id=order.customer.user_id,
            title="Pickup Verified – Enjoy Your Meal!",
            message=f"Your order #{order.order_number} has been verified and handed over. Thank you for saving food with FoodSave!",
            type="order"
        )
        db.add(notif)

    db.commit()
    return {
        "status": "success",
        "message": f"Order #{order.order_number} verified and marked as Completed!",
        "order": {
            "order_number": order.order_number,
            "quantity": order.quantity,
            "total_amount": order.total_amount,
            "customer_name": order.customer.user.full_name if order.customer and order.customer.user else "Customer",
            "item_title": order.listing.title if order.listing else "Food Item"
        }
    }
