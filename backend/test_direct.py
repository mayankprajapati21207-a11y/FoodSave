import sys
from app.core.database import SessionLocal
from app.api import auth, categories, food_listings, orders, waste, admin, calculator
from app.schemas.schemas import (
    UserLogin, OrderCreate, WasteRecordCreate, WasteCalculatorInput, ComplaintCreate
)
from app.models.models import User, FoodListing, Restaurant

db = SessionLocal()

print("==================================================")
print("  FOODSAVE – END-TO-END VERIFICATION TEST SUITE   ")
print("==================================================")

# 1. Test Categories
cats = categories.get_categories(db=db)
print(f"✓ Categories loaded: {len(cats)} categories found.")
for c in cats[:3]:
    print(f"   - {c.name}: {c.description}")

# 2. Test Login for all 5 roles
roles_creds = [
    ('admin@foodsave.org', 'admin123', 'super_admin'),
    ('bistro@foodsave.org', 'restaurant123', 'restaurant'),
    ('ngo@foodsave.org', 'ngo123', 'ngo'),
    ('donor@foodsave.org', 'donor123', 'donor'),
    ('customer@foodsave.org', 'customer123', 'customer'),
]
authenticated_users = {}
for email, pwd, expected_role in roles_creds:
    token_res = auth.login(UserLogin(email=email, password=pwd), db=db)
    user_obj = token_res['user']
    assert user_obj.role == expected_role, f"Role mismatch for {email}"
    authenticated_users[expected_role] = user_obj
    print(f"✓ Authenticated [{expected_role}]: {user_obj.full_name} ({email})")

# 3. Test Food Listings
listings = food_listings.get_listings(db=db)
print(f"✓ Active Food Listings: {len(listings)} listings available in marketplace.")
for l in listings[:3]:
    print(f"   - {l.title} (₹{l.discount_price:.2f}) [{l.quantity} {l.unit}]")

# 4. Test Customer placing an order
target_listing = listings[0]
customer_user = authenticated_users['customer']
order = orders.create_order(
    OrderCreate(
        listing_id=target_listing.id,
        quantity=1.0,
        pickup_time_slot="Today, 6:30 PM",
        payment_method="online"
    ),
    current_user=customer_user,
    db=db
)
print(f"✓ Order Created: #{order.order_number} for {order.quantity} of '{target_listing.title}'")
print(f"   - QR Code Token: {order.qr_code_token}")
print(f"   - Status: {order.status}, Total: ₹{order.total_amount:.2f}")

# 5. Test QR Code Pickup Verification by Restaurant Owner
restaurant_user = authenticated_users['restaurant']
verify_res = orders.verify_pickup_qr(qr_token=order.qr_code_token, current_user=restaurant_user, db=db)
print(f"✓ QR Verification Result: {verify_res['message']}")
assert verify_res['status'] == 'success'

# 6. Test Restaurant recording daily food waste
waste_rec = waste.record_food_waste(
    WasteRecordCreate(
        quantity_kg=8.5,
        waste_type="organic",
        reason="overproduction",
        destination="composting",
        notes="Shift prep trim and unserved soup diverted to composting"
    ),
    current_user=restaurant_user,
    db=db
)
print(f"✓ Waste Recorded: {waste_rec.quantity_kg} kg of {waste_rec.waste_type} waste routed to {waste_rec.destination}")

# 7. Test Waste Impact Calculator
calc_res = calculator.calculate_waste_impact(
    WasteCalculatorInput(
        waste_type="cooked_meals",
        quantity_kg_per_week=18.0,
        weeks=52
    )
)
print(f"✓ Waste Calculator Output:")
print(f"   - Annual Food Waste: {calc_res['annual_waste_kg']} kg")
print(f"   - Avoidable Carbon Emissions: {calc_res['annual_co2_kg']} kg CO2e")
print(f"   - Potential Meals Saved: {calc_res['potential_meals_saved']} meals")
print(f"   - Virtual Water Conserved: {calc_res['annual_water_liters']} L")

# 8. Test Super Admin Dashboard Stats
admin_user = authenticated_users['super_admin']
admin_stats = admin.get_admin_dashboard_stats(current_user=admin_user, db=db)
print(f"✓ Super Admin Dashboard Metrics:")
print(f"   - Total Platform Users: {admin_stats['total_users']}")
print(f"   - Partner Restaurants: {admin_stats['total_restaurants']}")
print(f"   - Verified NGOs: {admin_stats['total_ngos']}")
print(f"   - Food Rescued: {admin_stats['total_food_listed_kg']} kg")
print(f"   - Meals Saved: {admin_stats['total_meals_saved']}")

# 9. Test Public Contact Submission
contact_res = admin.submit_complaint_or_contact(
    ComplaintCreate(
        name="Elena Rostova",
        email="elena@sunriseorganic.com",
        subject="Bakery Onboarding Inquiry",
        message="We would like to add 3 more branch locations to FoodSave surplus network."
    ),
    db=db
)
print(f"✓ Contact Submission Saved: #{contact_res.id} '{contact_res.subject}' status={contact_res.status}")

db.close()
print("\n==================================================")
print("  ALL 9 END-TO-END BUSINESS WORKFLOWS VALIDATED!  ")
print("==================================================")
