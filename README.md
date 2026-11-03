# FUCHSIUS - Vehicle Service Booking System (MERN Stack)

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-purple.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v24+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Local%20%2F%20Atlas-brightgreen.svg)](https://www.mongodb.com/)

A modern, high-performance web platform enabling vehicle owners to schedule service appointments online while giving service center administrators powerful tools to review, approve, manage, and complete service workflows.

Designed and developed for the **FUCHSIUS Final Internship Project**.

---

## 🚀 Key Features

### 👤 Customer Portal
- **Service Catalog**: Browse all available service packages (Oil Change, Full Vehicle Service, Brake Inspection, Wheel Alignment, Diagnostics, AC Service) with duration & price estimates.
- **Instant Online Booking Form**: Schedule appointments by entering name, phone, vehicle plate number (e.g. `WP CAB-4521`), service type, preferred date, time slot, and special notes.
- **Booking Confirmation Modal**: Instant confirmation screen with a unique Reference ID and one-click copy.
- **Live Status Tracking**: Customers can check appointment progress in real-time (`Pending` ➔ `Approved` ➔ `Completed` / `Rejected`) by searching their Vehicle Plate, Phone Number, or Reference ID.

### 🛡️ Admin Management Portal
- **Secure Authentication**: Protected admin login with JWT tokens and Bcrypt password hashing.
- **Dashboard Metrics**:
  - Total Bookings
  - Pending Approvals
  - Approved Appointments
  - Completed Services
  - Daily Bookings count
- **Filter & Search Bar**:
  - Filter by Status (`All`, `Pending`, `Approved`, `Completed`, `Rejected`)
  - Filter by Date
  - Real-time text search by Customer Name, Phone, or Vehicle Number
- **One-Click Status Controls**: Change statuses directly from table rows (`Approve`, `Complete`, `Reject`, `Delete`).
- **Detailed Inspection Modal**: View full customer notes, timestamps, and service requirements.
- **Service Category Management**: Add new automotive services or remove obsolete packages dynamically.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19 + Vite | Fast HMR, component-driven UI |
| **Styling** | Tailwind CSS + Lucide Icons | Responsive modern design with FUCHSIUS branding |
| **Routing** | React Router v7 | Client-side SPA navigation |
| **HTTP Client** | Axios | Configured with JWT interceptors |
| **Notifications** | React Hot Toast | Real-time user feedback toasts |
| **Backend** | Node.js + Express.js | Modular RESTful API architecture |
| **Database** | MongoDB + Mongoose | Robust document modeling and indexing |
| **Auth & Security** | JWT + Bcrypt.js + CORS | Secure bearer authentication |

---

## 📁 Project Directory Structure

```
Final Project/
├── backend/
│   ├── config/
│   │   ├── db.js             # MongoDB connection setup
│   │   └── seed.js           # Auto-seeds default admin & services
│   ├── controllers/
│   │   ├── authController.js    # Login & profile handlers
│   │   ├── bookingController.js # CRUD, tracking, and metrics
│   │   └── serviceController.js # Service category management
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT bearer authentication
│   ├── models/
│   │   ├── User.js              # Admin schema with bcrypt
│   │   ├── Booking.js           # Booking schema
│   │   └── ServiceCategory.js   # Service category schema
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth
│   │   ├── bookingRoutes.js     # /api/bookings
│   │   └── serviceRoutes.js     # /api/services
│   ├── .env                     # Backend configuration
│   ├── package.json
│   └── server.js                # Express entry point
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js        # Axios instance with interceptors
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Brand navigation & responsive menu
│   │   │   ├── Footer.jsx       # Workshop details & contact
│   │   │   └── ProtectedRoute.jsx # Guard for admin routes
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Admin authentication state
│   │   ├── pages/
│   │   │   ├── HomePage.jsx     # Landing page with services & CTA
│   │   │   ├── BookingPage.jsx  # Booking form & instant confirmation
│   │   │   ├── TrackBookingPage.jsx # Live tracking & progress bar
│   │   │   ├── LoginPage.jsx    # Admin sign-in with 1-click demo button
│   │   │   ├── AdminDashboard.jsx # Dashboard metrics & bookings table
│   │   │   └── ServiceCategoriesPage.jsx # Categories CRUD
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── start-all.bat                # 1-click Windows launcher for both servers
├── start-backend.bat            # Backend launcher
├── start-frontend.bat           # Frontend launcher
├── DOCUMENTATION.md             # Complete functional and technical documentation
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or newer)
- [MongoDB](https://www.mongodb.com/) running locally on port `27017` (or MongoDB Atlas connection string)

### 2. Auto-Seeded Admin Credentials
When the backend starts for the first time, it automatically creates the default administrator and sets up default services:
- **Username**: `admin`
- **Password**: `admin123`

*(The login page also has an **Auto-Fill** demo button for quick evaluation)*

### 3. Launching the Application

#### Option A: Quick 1-Click Launch (Windows)
Double-click `start-all.bat` in the project root. This opens both Backend and Frontend in separate command windows.

#### Option B: Terminal Commands

**Terminal 1 — Backend:**
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000`*

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

Open **http://localhost:5173** in your web browser.

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate admin & receive JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated admin details | Yes (Bearer Token) |

### Bookings (`/api/bookings`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/bookings` | Create new service booking | No |
| `GET` | `/api/bookings` | Get all bookings (with search & filters) | No / Yes |
| `GET` | `/api/bookings/:id` | Get single booking details by ID | No / Yes |
| `GET` | `/api/bookings/track/search?query=...` | Track by Vehicle Plate, Phone, or ID | No |
| `GET` | `/api/bookings/metrics/summary` | Get aggregated dashboard metrics | No / Yes |
| `PUT` | `/api/bookings/:id/status` | Update booking status | Yes (Bearer Token) |
| `DELETE` | `/api/bookings/:id` | Delete booking record | Yes (Bearer Token) |

### Service Categories (`/api/services`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/services` | Get all available service categories | No |
| `POST` | `/api/services` | Create new service category | Yes (Bearer Token) |
| `DELETE` | `/api/services/:id` | Delete a service category | Yes (Bearer Token) |

---

## 🚢 Deployment Guide

### Deploy Backend (Render.com)
1. Push this repository to GitHub.
2. Go to **Render Dashboard** ➔ **New Web Service**.
3. Select your repository and configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Set Environment Variables in Render:
   - `MONGO_URI`: Your MongoDB Atlas URI
   - `JWT_SECRET`: A strong secret key
   - `PORT`: `5000`
   - `ADMIN_USERNAME`: `admin`
   - `ADMIN_PASSWORD`: `your_secure_password`

### Deploy Frontend (Vercel.com)
1. Go to **Vercel Dashboard** ➔ **New Project**.
2. Select your repository and configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Set Environment Variable:
   - `VITE_API_URL`: Your deployed Render backend URL (e.g., `https://your-api.onrender.com/api`)
4. Deploy!

---

## 📄 License
Developed for academic/internship evaluation.

