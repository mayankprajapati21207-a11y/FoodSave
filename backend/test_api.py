import sys
from fastapi.testclient import TestClient
from app.main import app

with TestClient(app) as client:
    print('--- Testing FoodSave Backend Endpoints ---')

    # 1. Root & Health
    res = client.get('/')
    assert res.status_code == 200, f'Root failed: {res.text}'
    print('✓ Root API is online:', res.json()['name'])

    # 2. Login all 5 roles
    roles_creds = [
        ('admin@foodsave.org', 'admin123', 'super_admin'),
        ('bistro@foodsave.org', 'restaurant123', 'restaurant'),
        ('ngo@foodsave.org', 'ngo123', 'ngo'),
        ('donor@foodsave.org', 'donor123', 'donor'),
        ('customer@foodsave.org', 'customer123', 'customer'),
    ]
    tokens = {}
    for email, pwd, expected_role in roles_creds:
        res = client.post('/api/auth/login', json={'email': email, 'password': pwd})
        assert res.status_code == 200, f'Login failed for {email}: {res.text}'
        data = res.json()
        assert data['user']['role'] == expected_role, f'Role mismatch for {email}'
        tokens[expected_role] = data['access_token']
        print(f'✓ Authenticated role [{expected_role}]: {email}')

    # 3. Categories
    res = client.get('/api/categories')
    assert res.status_code == 200 and len(res.json()) >= 5
    print(f'✓ Loaded {len(res.json())} food categories')

    # 4. Listings
    res = client.get('/api/food-listings')
    assert res.status_code == 200
    listings = res.json()
    assert len(listings) > 0, 'No listings found'
    listing_id = listings[0]['id']
    title = listings[0]['title']
    print(f'✓ Loaded {len(listings)} active surplus food listings. Sample: {title}')

    # 5. Customer places order
    cust_headers = {'Authorization': f'Bearer {tokens["customer"]}'}
    order_res = client.post('/api/orders', json={
        'listing_id': listing_id,
        'quantity': 1,
        'pickup_time_slot': 'Today, 6:00 PM',
        'payment_method': 'online'
    }, headers=cust_headers)
    assert order_res.status_code == 200, f'Order failed: {order_res.text}'
    order_data = order_res.json()
    order_token = order_data['qr_code_token']
    print(f'✓ Customer placed Order #{order_data["order_number"]}, QR: {order_token}')

    # 6. Restaurant verifies QR code
    rest_headers = {'Authorization': f'Bearer {tokens["restaurant"]}'}
    qr_res = client.post(f'/api/orders/verify-qr?qr_token={order_token}', headers=rest_headers)
    assert qr_res.status_code == 200
    print(f'✓ QR Code verified successfully by restaurant: {qr_res.json()["message"]}')

    # 7. Record daily waste
    waste_res = client.post('/api/waste/records', json={
        'quantity_kg': 6.5,
        'waste_type': 'organic',
        'reason': 'plate_waste',
        'destination': 'composting',
        'notes': 'Test daily trimmings'
    }, headers=rest_headers)
    assert waste_res.status_code == 200
    print(f'✓ Waste record logged: {waste_res.json()["quantity_kg"]} kg sent to {waste_res.json()["destination"]}')

    # 8. Impact & Calculator
    calc_res = client.post('/api/calculator/calculate', json={
        'waste_type': 'cooked_meals',
        'quantity_kg_per_week': 20,
        'weeks': 52
    })
    assert calc_res.status_code == 200
    print(f'✓ Waste Calculator: {calc_res.json()["potential_meals_saved"]} meals saveable, {calc_res.json()["annual_co2_kg"]} kg CO2')

    # 9. Admin Stats
    admin_headers = {'Authorization': f'Bearer {tokens["super_admin"]}'}
    admin_res = client.get('/api/admin/dashboard-stats', headers=admin_headers)
    assert admin_res.status_code == 200
    print(f'✓ Super Admin metrics verified: {admin_res.json()["total_users"]} users, {admin_res.json()["total_meals_saved"]} total meals saved')

    print('\n*** ALL 9 VERIFICATION CHECKS PASSED WITH FLYING COLORS! ***')
