# FoodSave – Save Food, Share Hope
### Smart Restaurant Food Waste Management & Redistribution System
**Location**: Ahmedabad, Gujarat, India (Thaltej, SG Highway, Bodakdev) | **Currency**: Indian Rupee (₹)  
**Hotline**: +91 99784 28476 | **Email**: mayankprajapati@foodsave.org

FoodSave is a modern, responsive, full-stack food sustainability and circular economy web application designed to eliminate commercial food waste. It connects **Restaurant Owners**, **Food Donors**, **NGOs / Charities**, **Conscious Customers**, and **Platform Administrators** in one unified ecosystem.

Designed from the ground up to be **100% responsive across mobile phones, tablets, laptops, and ultra-wide desktops**, with a built-in offline mock data engine allowing the app to run **live on GitHub Pages with zero server setup**.

---

## 📱 Cross-Device Responsive Design

The platform has been meticulously tested and optimized across all viewports:
- **📱 Mobile Phones (360px – 480px)**:
  - Collapsible slide-down navigation drawer with 1-click dashboard and auth links.
  - Sticky touch-friendly Quick Role Switcher clamped to screen width (`w-[calc(100vw-2rem)]`).
  - Horizontal touch-scrollable tables (`overflow-x-auto min-w-[640px]`) that prevent column squishing on narrow screens.
  - Compact multi-stat metrics cards formatted with fluid fonts and responsive padding.
  - Native touch-friendly modals with `max-h-[90vh]` scrolling and enlarged touch targets.
- **📟 Tablets & iPads (768px – 1024px)**:
  - Adaptive 2-column and 3-column grids for surplus food cards and kitchen inventory.
  - Interactive Leaflet map with touch gestures and location markers across Ahmedabad.
- **💻 Laptops & Desktops (1024px – 1920px+)**:
  - Full-featured sidebar and tab views for high-density kitchen inventory and waste forecasting.
  - Real-time interactive Chart.js analytics and trend diagrams.

---

## 🌟 Key Features by User Role

### 1. 👑 Super Admin
- **Comprehensive Executive Dashboard**: Real-time KPI counters tracking total registered users, partner kitchens, verified charities, food donors, customer meals sold, food donated (kg), total waste recorded, organic composting volume, and CO2 emissions avoided.
- **User Management**: Search, filter, activate/deactivate accounts, toggle accreditation, and reassign user roles.
- **Restaurant & NGO Verification**: Review compliance documentation, FSSAI / health certifications, and approve/reject partner applications.
- **Waste & Composting Tracking**: Monitor commercial waste logs, organic vs non-organic categorization, and verify composting processor handovers.
- **ESG Reports & Data Export**: 1-click export of waste logs and order records to CSV.

### 2. 🍽️ Restaurant Owner
- **Profile & Accreditation**: Manage restaurant profiles, cuisine types, opening hours, and FSSAI health licenses.
- **Surplus Food Listings**: List edible surplus portions with photos, original price, discounted price, preparation timestamp, safe collection windows, and mandatory hygiene certification.
- **Kitchen Inventory Tracker**: Real-time stock levels, expiring batch alerts (<48 hrs), and 1-click conversion from inventory to surplus listing.
- **Daily Food Waste Logging**: Log food waste in kg (organic vs non-organic, plate waste, prep trimmings, composting routing).
- **Next-Day AI Demand & Order Forecasting**: Predictive ordering algorithm based on historical waste patterns, forecasted diners, and recommended prep portions.
- **Order Management & QR Pickup Scanner**: Track incoming customer orders and verify customer pickup QR code tokens in 1 click.
- **NGO Free Donation Claims**: Review incoming food claims from community charities, accept/reject, and schedule thermal handovers.

### 3. 🤝 NGO / Charity Organization
- **Verified Charity Portal**: Showcase organization credentials, registration number, and daily meal capacity.
- **Surplus & Donation Browser**: Search and filter available restaurant surplus and corporate catering donations across Ahmedabad.
- **1-Click Food Claim**: Claim free bulk food portions with required quantity and intended community shelter notes.
- **Digital Collection QR Token**: Present dynamic QR token at restaurant counters to verify receipt.

### 4. 💖 Food Donor (Catering / Corporate)
- **Direct Bulk Food Postings**: Event caterers, conference organizers, and corporate canteens post surplus food with photos, quantity, packaging type, and pickup deadlines.
- **Nearby Charity Network**: Connect with verified NGOs (e.g. Robin Hood Army Ahmedabad, Annamrita Foundation).
- **Collection Verification**: Dynamic verification QR tokens for driver handover confirmation.

### 5. 🛒 Customer / Zero-Waste Diner
- **Surplus Marketplace**: Discover gourmet bakery items and cooked entrees at 50% to 70% off regular menu prices.
- **Smart Filtering**: Filter by category (Bakery, Kathiyawadi Thalis, Gourmet Rolls, Fresh Produce), price slider, and search keywords.
- **Instant Booking**: Reserve portions and select designated pickup windows.
- **Dynamic Pickup QR Code**: Present digital QR code on mobile for contact-free verification at the counter.

---

## 🔑 Default Demo Accounts (All 5 Roles)

A floating **Quick Role Switcher** is present at the bottom-right of every page to allow reviewers to switch between any of the 5 roles in 1 click. Alternatively, you can log in manually:

| Role | Email | Password | Location / Notes |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@foodsave.org` | `admin123` | Gujarat State Sustainability Authority |
| **Restaurant Owner** | `bistro@foodsave.org` | `restaurant123` | Havmor Heritage & Bistro, Thaltej |
| **NGO / Charity** | `ngo@foodsave.org` | `ngo123` | Robin Hood Army Ahmedabad (Thaltej Chapter) |
| **Food Donor** | `donor@foodsave.org` | `donor123` | Mehta Banquets & Caterers, Bodakdev |
| **Customer** | `customer@foodsave.org` | `customer123` | Resident, Vastrapur / Thaltej |

---

## 🚀 Running Locally (Windows, Mac, Linux)

### Fast 1-Click Launch (Windows):
- Double click **`launch_foodsave.vbs`** or **`start.bat`** in the project folder to start both frontend and backend automatically.
- Double click **`create_desktop_shortcut.bat`** to create an icon directly on your Windows desktop.
- Double click **`stop_foodsave.bat`** to cleanly shut down background servers when finished.

### Manual Terminal Commands:

#### 1. Backend (FastAPI + Python):
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Base: `http://localhost:8000`
- Interactive Swagger UI: `http://localhost:8000/docs`

#### 2. Frontend (React + Vite + Tailwind):
```bash
cd frontend
npm install
npm run dev
```
- Local URL: `http://localhost:5173`
- Production Build: `npm run build`

---

## 📂 Project Structure

```
foodsave/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Automated GitHub Pages CI/CD workflow
├── .gitignore                    # Production git ignore configuration
├── package.json                  # Root npm runner scripts
├── start.bat                     # Windows 1-click startup script
├── launch_foodsave.vbs           # Windows silent background launcher
├── stop_foodsave.bat             # Windows shutdown script
├── create_desktop_shortcut.bat   # Desktop shortcut installer
├── README.md                     # Documentation & setup guide
├── backend/
│   ├── app/
│   │   ├── api/                  # 13 REST API route controllers
│   │   ├── core/                 # JWT security & database configuration
│   │   ├── models/               # SQLAlchemy ORM models
│   │   ├── schemas/              # Pydantic schemas
│   │   └── services/             # Pre-seeded Ahmedabad demo data
│   ├── requirements.txt
│   └── test_direct.py            # Comprehensive 9-workflow test script
└── frontend/
    ├── src/
    │   ├── components/           # Navbar, Footer, Map, Modals, RoleSwitcher
    │   ├── context/              # AuthContext & role session management
    │   ├── pages/                # Public pages & 5 specialized Dashboards
    │   └── services/
    │       ├── api.js            # Axios client with offline fallback adapter
    │       └── mockData.js       # Pre-seeded Ahmedabad mock data & localStorage
    ├── index.html
    ├── package.json
    └── vite.config.js            # Hash router & relative base path configuration
```

---

## 📞 Support & Community Partner Hotline

- **Contact Person**: Mayank Prajapati (Lead Administrator)
- **Direct Hotline**: +91 99784 28476
- **Official Email**: mayankprajapati@foodsave.org
- **Regional HQ**: Sarkhej - Gandhinagar Hwy, near Pakwan Cross Road, Bodakdev, Ahmedabad, Gujarat 380054

---

© 2026 FoodSave Technologies Inc. **Save Food. Feed People. Protect Our Planet.**
