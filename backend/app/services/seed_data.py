from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.models.models import (
    User, Restaurant, NGO, Donor, Customer, FoodCategory,
    FoodListing, FoodInventory, Order, FoodRequest, Donation,
    WasteRecord, WasteProcessing, Payment, Review, Notification, Complaint, AdminLog
)

def seed_database(db: Session):
    # Check if admin already exists
    if db.query(User).filter(User.email == "admin@foodsave.org").first():
        return

    print("Seeding FoodSave database with Ahmedabad, Thaltej, India locations and Rupee pricing...")
    now = datetime.now(timezone.utc)

    # 1. Categories
    categories = [
        FoodCategory(name="Bakery & Pastries", description="Fresh bread, pav, khari, puffs, and artisan baked goods", icon_name="Croissant"),
        FoodCategory(name="Cooked Meals", description="Warm nutritious thalis, biryanis, curries, khichdi, and rotis", icon_name="Utensils"),
        FoodCategory(name="Fresh Produce", description="Farm-fresh vegetables, organic greens, and seasonal fruits", icon_name="Apple"),
        FoodCategory(name="Dairy & Sweets", description="Pure milk, fresh paneer, curd, chaas, and traditional mithai", icon_name="Milk"),
        FoodCategory(name="Beverages & Juices", description="Fresh sugarcane juice, spiced buttermilk, and fruit coolers", icon_name="Coffee"),
        FoodCategory(name="Packaged Foods", description="Sealed pantry staples, pulses, basmati rice, and dry grains", icon_name="Package"),
        FoodCategory(name="Desserts & Snacks", description="Shrikhand, gulab jamun, jalebi, and evening Gujarati snacks", icon_name="Cake"),
    ]
    for c in categories:
        db.add(c)
    db.flush()

    cat_map = {c.name: c.id for c in categories}

    # 2. Super Admin User
    admin_user = User(
        email="admin@foodsave.org",
        hashed_password=get_password_hash("admin123"),
        full_name="Priya Sharma (State Sustainability Admin)",
        phone="+91 98250 12345",
        role="super_admin",
        is_active=True,
        is_verified=True,
        avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80"
    )
    db.add(admin_user)
    db.flush()

    # 3. Primary Restaurant User & Profile (Thaltej, Ahmedabad)
    restaurant_user = User(
        email="bistro@foodsave.org",
        hashed_password=get_password_hash("restaurant123"),
        full_name="Rajesh Patel (Chef & Proprietor)",
        phone="+91 98240 88990",
        role="restaurant",
        is_active=True,
        is_verified=True,
        avatar_url="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=250&q=80"
    )
    db.add(restaurant_user)
    db.flush()

    bistro_restaurant = Restaurant(
        user_id=restaurant_user.id,
        name="The Grand Thakar & Artisan Bakery",
        description="Premium authentic Gujarati and Kathiyawadi dining with zero-food-waste kitchen protocol.",
        address="Near Thaltej Cross Road, SG Highway, Thaltej",
        city="Ahmedabad",
        state="Gujarat",
        postal_code="380054",
        latitude=23.0500,
        longitude=72.5100,
        phone="+91 79 2685 4400",
        email="contact@grandthakar-ahmedabad.com",
        fssai_license="10721026000452",
        opening_hours="11:00 AM - 11:00 PM",
        cuisine_type="Authentic Gujarati & Artisan Bakes",
        rating=4.9,
        is_verified=True,
        image_url="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
    )
    db.add(bistro_restaurant)

    # Additional Partner Restaurants in Ahmedabad
    extra_restaurants_data = [
        {
            "email": "sunrisegrill@foodsave.org",
            "name": "Sankalp Express & Cafe",
            "full_name": "Ketan Shah",
            "address": "Sindhu Bhavan Road, Bodakdev",
            "city": "Ahmedabad",
            "cuisine": "Healthy South Indian & Bowls",
            "lat": 23.0420,
            "lng": 72.5020,
            "rating": 4.8,
            "img": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
        },
        {
            "email": "spicegarden@foodsave.org",
            "name": "Gordhan Thal Dining Hall",
            "full_name": "Jignesh Dave",
            "address": "Opp. Acropolis Mall, SG Highway, Thaltej",
            "city": "Ahmedabad",
            "cuisine": "Traditional Royal Thali",
            "lat": 23.0480,
            "lng": 72.5150,
            "rating": 4.7,
            "img": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80"
        },
        {
            "email": "pastaperfect@foodsave.org",
            "name": "Mocha Bistro & Patisserie",
            "full_name": "Ananya Joshi",
            "address": "Dev Arc Mall, ISCON Cross Road, Satellite",
            "city": "Ahmedabad",
            "cuisine": "Artisan Pastas & Bakery",
            "lat": 23.0300,
            "lng": 72.5080,
            "rating": 4.9,
            "img": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80"
        }
    ]

    extra_restaurants = []
    for r_data in extra_restaurants_data:
        u = User(
            email=r_data["email"],
            hashed_password=get_password_hash("restaurant123"),
            full_name=r_data["full_name"],
            phone="+91 98980 55667",
            role="restaurant",
            is_active=True,
            is_verified=True,
            avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80"
        )
        db.add(u)
        db.flush()
        rest = Restaurant(
            user_id=u.id,
            name=r_data["name"],
            description="Dedicated zero-food-waste culinary partner in Ahmedabad.",
            address=r_data["address"],
            city="Ahmedabad",
            state="Gujarat",
            postal_code="380054",
            latitude=r_data["lat"],
            longitude=r_data["lng"],
            phone="+91 79 4000 8899",
            email=r_data["email"],
            fssai_license="10722026001890",
            opening_hours="10:30 AM - 11:30 PM",
            cuisine_type=r_data["cuisine"],
            rating=r_data["rating"],
            is_verified=True,
            image_url=r_data["img"]
        )
        db.add(rest)
        extra_restaurants.append(rest)
    db.flush()

    # 4. NGO User & Profile in Ahmedabad
    ngo_user = User(
        email="ngo@foodsave.org",
        hashed_password=get_password_hash("ngo123"),
        full_name="Dharmesh Shah (Robin Hood Army Coordinator)",
        phone="+91 98255 43210",
        role="ngo",
        is_active=True,
        is_verified=True,
        avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80"
    )
    db.add(ngo_user)
    db.flush()

    hope_ngo = NGO(
        user_id=ngo_user.id,
        organization_name="Robin Hood Army Ahmedabad (Thaltej Chapter)",
        registration_number="GJ-AHM-NGO-2018-0912",
        contact_person="Dharmesh Shah",
        phone="+91 98255 43210",
        address="Behind Thaltej Fire Station, Near Hebatpur Road, Thaltej",
        city="Ahmedabad",
        state="Gujarat",
        postal_code="380054",
        latitude=23.0520,
        longitude=72.5080,
        verification_doc_url="https://foodsave.org/docs/rha_ahmedabad_cert.pdf",
        is_verified=True,
        capacity_people_served=1500,
        image_url="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
    )
    db.add(hope_ngo)

    # Additional NGO in Vastrapur, Ahmedabad
    ngo_user2 = User(
        email="shelter@foodsave.org",
        hashed_password=get_password_hash("ngo123"),
        full_name="Bhavna Vaghela",
        phone="+91 98790 11223",
        role="ngo",
        is_active=True,
        is_verified=True,
        avatar_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80"
    )
    db.add(ngo_user2)
    db.flush()
    shelter_ngo = NGO(
        user_id=ngo_user2.id,
        organization_name="Akshaya Annakshetra Foundation Gujarat",
        registration_number="GJ-AHM-NGO-2015-4421",
        contact_person="Bhavna Vaghela",
        phone="+91 98790 11223",
        address="Near Vastrapur Lake, Vastrapur",
        city="Ahmedabad",
        state="Gujarat",
        postal_code="380015",
        latitude=23.0350,
        longitude=72.5290,
        is_verified=True,
        capacity_people_served=2000,
        image_url="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80"
    )
    db.add(shelter_ngo)
    db.flush()

    # 5. Food Donor User & Profile (Mehta Banquets SG Highway)
    donor_user = User(
        email="donor@foodsave.org",
        hashed_password=get_password_hash("donor123"),
        full_name="Anil Mehta (Director, Mehta Banquets & Catering)",
        phone="+91 98251 77889",
        role="donor",
        is_active=True,
        is_verified=True,
        avatar_url="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80"
    )
    db.add(donor_user)
    db.flush()

    vance_donor = Donor(
        user_id=donor_user.id,
        donor_type="organization",
        organization_name="Mehta Banquet & Convention Hall",
        address="Behind Rajpath Club, SG Highway, Bodakdev",
        city="Ahmedabad",
        state="Gujarat",
        phone="+91 98251 77889"
    )
    db.add(vance_donor)
    db.flush()

    # 6. Customer User & Profile (Thaltej Resident)
    customer_user = User(
        email="customer@foodsave.org",
        hashed_password=get_password_hash("customer123"),
        full_name="Aarav Joshi",
        phone="+91 97123 45678",
        role="customer",
        is_active=True,
        is_verified=True,
        avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80"
    )
    db.add(customer_user)
    db.flush()

    alex_customer = Customer(
        user_id=customer_user.id,
        default_address="B-402, Shivalik Residency, Near Thaltej Shilaj Road, Thaltej",
        phone="+91 97123 45678"
    )
    db.add(alex_customer)
    db.flush()

    # 7. Food Listings with Rupee (₹) pricing
    listings_data = [
        {
            "rest": bistro_restaurant,
            "title": "Fresh Artisan Sourdough & Maska Bun Basket",
            "desc": "Crispy rustic sourdough loaves and soft fresh bakery buns baked this morning at Thaltej.",
            "cat": cat_map["Bakery & Pastries"],
            "qty": 8,
            "unit": "baskets",
            "orig_price": 350.00,
            "disc_price": 120.00,
            "is_free": False,
            "hours_exp": 18,
            "img": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
            "storage": "Sealed food-grade bakery packets, room temperature"
        },
        {
            "rest": bistro_restaurant,
            "title": "Special Kathiyawadi Baingan Bharta & Rotla Meal Box",
            "desc": "Fresh smoky roasted eggplant mash, warm bajra rotla, fresh jaggery and garlic chutney.",
            "cat": cat_map["Cooked Meals"],
            "qty": 14,
            "unit": "portions",
            "orig_price": 280.00,
            "disc_price": 99.00,
            "is_free": False,
            "hours_exp": 24,
            "img": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
            "storage": "Individual thermal safe containers, kept at 4°C"
        },
        {
            "rest": bistro_restaurant,
            "title": "Chef's Special Dal Khichdi & Kadhi (Free NGO Donation)",
            "desc": "Wholesome, nourishing hot Moong Dal Khichdi and Gujarati sweet-sour Kadhi for local shelter meals.",
            "cat": cat_map["Cooked Meals"],
            "qty": 25,
            "unit": "portions",
            "orig_price": 220.00,
            "disc_price": 0.00,
            "is_free": True,
            "hours_exp": 16,
            "img": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
            "storage": "Insulated food-grade stainless steel warmer vessels"
        },
        {
            "rest": extra_restaurants[0],
            "title": "Steamed Idli & Medu Vada Combo with Coconut Chutney",
            "desc": "Freshly steamed soft idlis and crispy golden vadas with sambar and fresh chutney.",
            "cat": cat_map["Cooked Meals"],
            "qty": 12,
            "unit": "boxes",
            "orig_price": 240.00,
            "disc_price": 85.00,
            "is_free": False,
            "hours_exp": 20,
            "img": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
            "storage": "Chilled food-safe pack, 4°C"
        },
        {
            "rest": extra_restaurants[1],
            "title": "Royal Gujarati Thali Portion with Sweets & Farsan",
            "desc": "Paneer sabzi, undhiyu, dal-rice, phulka rotis, dhokla and shrikhand sweet bowl.",
            "cat": cat_map["Cooked Meals"],
            "qty": 10,
            "unit": "portions",
            "orig_price": 380.00,
            "disc_price": 140.00,
            "is_free": False,
            "hours_exp": 22,
            "img": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
            "storage": "Hot insulated food pack, sealed"
        },
        {
            "rest": extra_restaurants[2],
            "title": "Handmade Spinach Ravioli & Garlic Herb Bread",
            "desc": "Fresh pasta parcels stuffed with creamy paneer and baby spinach in sage butter sauce.",
            "cat": cat_map["Cooked Meals"],
            "qty": 8,
            "unit": "portions",
            "orig_price": 420.00,
            "disc_price": 150.00,
            "is_free": False,
            "hours_exp": 26,
            "img": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
            "storage": "Packed hot at 65°C"
        }
    ]

    created_listings = []
    for l_data in listings_data:
        listing = FoodListing(
            restaurant_id=l_data["rest"].id,
            title=l_data["title"],
            description=l_data["desc"],
            category_id=l_data["cat"],
            quantity=l_data["qty"],
            unit=l_data["unit"],
            original_price=l_data["orig_price"],
            discount_price=l_data["disc_price"],
            is_free_donation=l_data["is_free"],
            preparation_time=now - timedelta(hours=3),
            expiry_time=now + timedelta(hours=l_data["hours_exp"]),
            pickup_start=now + timedelta(hours=1),
            pickup_end=now + timedelta(hours=l_data["hours_exp"] - 1),
            storage_info=l_data["storage"],
            image_url=l_data["img"],
            status="available",
            is_approved_by_admin=True,
            safety_certified_by_owner=True
        )
        db.add(listing)
        created_listings.append(listing)
    db.flush()

    # 8. Food Inventory for Grand Thakar
    inventory_items = [
        FoodInventory(
            restaurant_id=bistro_restaurant.id,
            item_name="Premium Sharbati Wheat Flour (50kg bags)",
            category_id=cat_map["Bakery & Pastries"],
            quantity=150.0,
            unit="kg",
            purchase_or_prep_date=now - timedelta(days=5),
            expiry_date=now + timedelta(days=90),
            storage_condition="ambient",
            status="in_stock",
            notes="Stored in dry dry-goods storage room at Thaltej outlet"
        ),
        FoodInventory(
            restaurant_id=bistro_restaurant.id,
            item_name="Fresh Amul Malai Paneer & Curd",
            category_id=cat_map["Dairy & Sweets"],
            quantity=22.5,
            unit="kg",
            purchase_or_prep_date=now - timedelta(days=2),
            expiry_date=now + timedelta(days=3),
            storage_condition="refrigerated",
            status="low_stock",
            notes="Needs to be used in sabzis or listed for surplus by tomorrow"
        ),
        FoodInventory(
            restaurant_id=bistro_restaurant.id,
            item_name="Fresh Farm Methi & Palak Greens",
            category_id=cat_map["Fresh Produce"],
            quantity=15.0,
            unit="kg",
            purchase_or_prep_date=now - timedelta(days=1),
            expiry_date=now + timedelta(days=2),
            storage_condition="refrigerated",
            status="in_stock",
            notes="Crisp and cold-stored"
        ),
    ]
    for inv in inventory_items:
        db.add(inv)
    db.flush()

    # 9. Direct Donations from Mehta Banquets SG Highway
    donations = [
        Donation(
            donor_id=vance_donor.id,
            ngo_id=hope_ngo.id,
            title="Surplus Wedding Banquet Pulao & Gujarati Dal Portions",
            description="80 portions of fragrant vegetable pulao, dal, puris, and sweet gulab jamun from afternoon wedding reception.",
            category_id=cat_map["Cooked Meals"],
            quantity=45.0,
            unit="kg",
            pickup_address="Mehta Banquet Hall, Behind Rajpath Club, Bodakdev, SG Highway",
            latitude=23.0380,
            longitude=72.5120,
            image_url="https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80",
            status="accepted",
            pickup_deadline=now + timedelta(hours=14),
            qr_code_token="QR-DON-MEHTA-99214"
        ),
        Donation(
            donor_id=vance_donor.id,
            ngo_id=None,
            title="Assorted Sealed Grains, Rice Bags, and Cooking Oil Tins",
            description="Unopened dry grocery rations suitable for community dry-ration parcels.",
            category_id=cat_map["Packaged Foods"],
            quantity=120.0,
            unit="kg",
            pickup_address="Mehta Banquets Godown, SG Highway",
            latitude=23.0400,
            longitude=72.5130,
            image_url="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
            status="available",
            pickup_deadline=now + timedelta(days=7),
            qr_code_token="QR-DON-MEHTA-88123"
        ),
    ]
    for d in donations:
        db.add(d)
    db.flush()

    # 10. Sample Customer Order
    sample_order = Order(
        order_number="FS-ORD-AHM772",
        customer_id=alex_customer.id,
        listing_id=created_listings[0].id,
        quantity=2.0,
        unit_price=120.00,
        total_amount=240.00,
        status="confirmed",
        pickup_time_slot="Today, 6:30 PM - 8:00 PM",
        payment_status="completed",
        payment_method="online",
        qr_code_token="QR-ORD-AHM-DEMO772"
    )
    db.add(sample_order)
    db.flush()

    payment = Payment(
        order_id=sample_order.id,
        transaction_id="UPI-AHM-PAY-44391",
        amount=240.00,
        payment_method="online",
        status="completed"
    )
    db.add(payment)

    # 11. Sample NGO Food Request
    ngo_req = FoodRequest(
        listing_id=created_listings[2].id, # The free Khichdi & Kadhi listing
        ngo_id=hope_ngo.id,
        requested_quantity=20.0,
        status="accepted",
        pickup_scheduled_at=now + timedelta(hours=4),
        notes="Robin Hood Army food van will collect at 5:30 PM for distribution near Thaltej slum shelters.",
        qr_code_token="QR-REQ-RHA-83910"
    )
    db.add(ngo_req)

    # 12. Daily Food Waste Records for Grand Thakar
    waste_logs = [
        WasteRecord(
            restaurant_id=bistro_restaurant.id,
            date=now - timedelta(days=1),
            quantity_kg=14.5,
            waste_type="organic",
            reason="plate_waste",
            destination="composting",
            notes="Dining hall table leftovers and vegetable peelings diverted to Ahmedabad Municipal Corporation organic composting."
        ),
        WasteRecord(
            restaurant_id=bistro_restaurant.id,
            date=now - timedelta(days=2),
            quantity_kg=8.2,
            waste_type="organic",
            reason="overproduction",
            destination="animal_feed",
            notes="Surplus day-old dough and rotlas sent to certified local Gaushala."
        ),
        WasteRecord(
            restaurant_id=bistro_restaurant.id,
            date=now - timedelta(days=3),
            quantity_kg=18.0,
            waste_type="organic",
            reason="spoilage",
            destination="bio_gas",
            notes="Chilled dairy storage fluctuation; disposed safely to biomethanation biogas facility."
        ),
        WasteRecord(
            restaurant_id=bistro_restaurant.id,
            date=now - timedelta(days=4),
            quantity_kg=4.0,
            waste_type="non_organic",
            reason="storage_failure",
            destination="landfill",
            notes="Damaged single-use packing liners."
        ),
    ]
    for w in waste_logs:
        db.add(w)
        db.flush()
        if w.destination in ["composting", "bio_gas"]:
            proc = WasteProcessing(
                waste_record_id=w.id,
                processor_name="AMC Pirana Waste-to-Compost Processing Facility",
                processing_method="composting" if w.destination == "composting" else "biomethanation",
                completion_date=now + timedelta(days=10),
                notes="Organic waste conversion to natural fertilizer in progress."
            )
            db.add(proc)

    # 13. Customer Review
    review = Review(
        restaurant_id=bistro_restaurant.id,
        user_id=customer_user.id,
        order_id=sample_order.id,
        rating=5,
        comment="Incredible Kathiyawadi food and bakery! Fresh, piping hot, and saved more than 60% while stopping food from going to waste. Proud to use FoodSave in Ahmedabad!"
    )
    db.add(review)

    # 14. Notifications for each role
    notifs = [
        Notification(
            user_id=admin_user.id,
            title="Gujarat State Audit: All Systems Operational",
            message="FoodSave Ahmedabad central hub and live tracking are active across Thaltej, Bodakdev, and Satellite.",
            type="system"
        ),
        Notification(
            user_id=restaurant_user.id,
            title="New Customer Order Received!",
            message="Aarav Joshi placed order #FS-ORD-AHM772 for 2 baskets of Fresh Maska Bun & Sourdough.",
            type="order",
            link_url="/dashboard/restaurant"
        ),
        Notification(
            user_id=restaurant_user.id,
            title="Robin Hood Army Food Request Accepted",
            message="Robin Hood Army scheduled pickup for 20 portions of Dal Khichdi at 5:30 PM.",
            type="donation",
            link_url="/dashboard/restaurant"
        ),
        Notification(
            user_id=ngo_user.id,
            title="Pickup Confirmed by The Grand Thakar",
            message="Your pickup for Dal Khichdi has been confirmed at Thaltej crossroad branch. Show your collection QR code upon arrival.",
            type="donation",
            link_url="/dashboard/ngo"
        ),
        Notification(
            user_id=customer_user.id,
            title="Order Confirmed – Ready for Pickup!",
            message="Your order #FS-ORD-AHM772 is confirmed. Present your QR code at The Grand Thakar, Thaltej.",
            type="order",
            link_url="/dashboard/customer"
        )
    ]
    for n in notifs:
        db.add(n)

    # 15. Complaints / Feedback
    complaint = Complaint(
        name="Harshil Vora",
        email="harshil.vora@example.in",
        subject="Restaurant Onboarding - SG Highway Chain",
        message="Namaste FoodSave team, we run 4 multi-cuisine restaurants across Thaltej and SG Highway, Ahmedabad and want to link our nightly surplus food inventory.",
        status="pending"
    )
    db.add(complaint)

    db.commit()
    print("Database successfully seeded with realistic Ahmedabad, Thaltej production demo data!")
