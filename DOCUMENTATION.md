# FUCHSIUS - Vehicle Service Booking System
## Comprehensive Project Documentation (Functional & Technical)

---

## 1. Executive Summary
- **Project Title**: Vehicle Service Booking System
- **Company / Brand**: FUCHSIUS
- **Tech Stack**: MERN (MongoDB, Express.js, React.js, Node.js) + Tailwind CSS + Vite
- **Target Audience**: Vehicle owners seeking hassle-free maintenance scheduling, and workshop managers aiming to digitize manual appointment workflows.

---

## 2. Problem Statement & Objectives

### 2.1 Problem Statement
Traditional automotive service centers rely on physical logbooks, telephone bookings, and disconnected communication. This leads to:
- Double-booking of workshop bays and technician shortages.
- Long customer waiting times and lack of service transparency.
- Missing customer history and untracked service records.
- Inefficient administrative management and manual overhead.

### 2.2 Project Objectives
1. Provide a modern, user-friendly customer web portal to schedule appointments in under two minutes.
2. Deliver a real-time status tracker for customers to monitor booking progress without making phone inquiries.
3. Build a centralized, secure Admin Dashboard to approve, reject, complete, or filter service appointments.
4. Allow administrators to customize and manage service categories dynamically.
5. Provide aggregate metrics for daily appointments and overall capacity management.

---

## 3. System Architecture & Tech Stack

```
   [ Customer Browser ]         [ Admin Browser ]
            |                          |
            +------------+-------------+
                         |
                 HTTP / RESTful APIs
                         |
                         v
      [ Frontend: React 19 + Vite + Tailwind CSS ]
                         |
               Axios (JWT Bearer Token)
                         |
                         v
     [ Backend: Node.js + Express REST API Server ]
                         |
             Mongoose ODM Object Layer
                         |
                         v
           [ Database: MongoDB Engine ]
```

### 3.1 Technology Stack Selection
- **Frontend Layer**:
  - `React.js (v19)`: Component-driven, fast virtual DOM rendering.
  - `Vite (v8)`: Ultra-fast module bundler with Hot Module Replacement (HMR).
  - `Tailwind CSS`: Modern utility-first styling for responsive layouts matching the FUCHSIUS brand.
  - `Lucide React`: Scalable, accessible SVG icons.
  - `React Router (v7)`: Client-side routing with guarded admin paths.
  - `React Hot Toast`: Lightweight notifications for real-time user feedback.
- **Backend Layer**:
  - `Node.js (v24)`: Asynchronous event-driven JavaScript runtime.
  - `Express.js (v4)`: Minimalist and robust web framework for REST API routing.
  - `Mongoose (v8)`: Schema-based solution to model application data.
  - `Bcrypt.js`: Salted password hashing for admin credentials.
  - `JSON Web Token (JWT)`: Stateless session authorization via Authorization Bearer headers.
- **Database Layer**:
  - `MongoDB`: Document database supporting flexible JSON-like schemas, indexed queries, and scalability.

---

## 4. Database Schema Design

### 4.1 `Users` Collection (Admin)
```javascript
{
  _id: ObjectId,
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String, // Bcrypt hashed
    required: true
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 4.2 `Bookings` Collection
```javascript
{
  _id: ObjectId,
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  vehicleNumber: {
    type: String,
    required: true,
    uppercase: true,
    trim: true // e.g. "WP CAB-4521"
  },
  serviceType: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true // YYYY-MM-DD
  },
  time: {
    type: String,
    required: true // e.g. "09:30 AM"
  },
  notes: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Completed", "Rejected"],
    default: "Pending"
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 4.3 `ServiceCategories` Collection
```javascript
{
  _id: ObjectId,
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true // e.g. "Oil & Filter Change"
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  priceEstimate: {
    type: String,
    default: "Contact for quote"
  },
  durationEstimate: {
    type: String,
    default: "1-2 hours"
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 5. API Endpoints Specification

### 5.1 Authentication Module (`/api/auth`)
- **`POST /api/auth/login`**
  - **Body**: `{ "username": "admin", "password": "..." }`
  - **Response 200**: `{ "success": true, "token": "<JWT>", "user": { "id": "...", "username": "admin" } }`
  - **Response 401**: `{ "success": false, "message": "Invalid username or password" }`
- **`GET /api/auth/me`** (Protected)
  - **Headers**: `Authorization: Bearer <token>`
  - **Response 200**: `{ "success": true, "user": { "_id": "...", "username": "admin" } }`

### 5.2 Bookings Module (`/api/bookings`)
- **`POST /api/bookings`** (Public)
  - **Body**: `{ customerName, phone, vehicleNumber, serviceType, date, time, notes }`
  - **Response 201**: Returns created booking object with status `"Pending"`.
- **`GET /api/bookings`** (Public/Protected)
  - **Query Params**: `status`, `date`, `search`
  - **Response 200**: List of matched booking documents sorted newest first.
- **`GET /api/bookings/:id`** (Public/Protected)
  - **Response 200**: Single booking by ID.
- **`GET /api/bookings/track/search?query=...`** (Public)
  - Searches by Vehicle Plate, Phone Number, or ObjectId.
  - **Response 200**: Array of customer appointments.
- **`GET /api/bookings/metrics/summary`** (Public/Protected)
  - Computes counts: `total`, `pending`, `approved`, `completed`, `rejected`, and `today`.
- **`PUT /api/bookings/:id/status`** (Protected)
  - **Headers**: `Authorization: Bearer <token>`
  - **Body**: `{ "status": "Approved" | "Completed" | "Rejected" | "Pending" }`
  - **Response 200**: Updated booking.
- **`DELETE /api/bookings/:id`** (Protected)
  - **Headers**: `Authorization: Bearer <token>`
  - **Response 200**: `{ "success": true, "message": "Booking deleted successfully" }`

### 5.3 Service Categories Module (`/api/services`)
- **`GET /api/services`** (Public)
  - **Response 200**: Array of all active service categories.
- **`POST /api/services`** (Protected)
  - **Body**: `{ name, description, priceEstimate, durationEstimate }`
  - **Response 201**: Newly created service category.
- **`DELETE /api/services/:id`** (Protected)
  - **Response 200**: Confirms deletion.

---

## 6. Functional Modules & User Workflows

### 6.1 Customer Module
1. **Explore Available Services**: The user lands on the Home Page and reviews automotive service packages with descriptions and estimated turnaround times.
2. **Submit Booking Form**:
   - Customer fills in contact details and vehicle registration number.
   - Selects the desired service from a dynamically populated dropdown.
   - Chooses a future date and preferred time slot.
   - Enters any specific mechanical issues or diagnostic symptoms.
3. **Instant Confirmation**:
   - An immediate modal provides the generated Booking Reference ID.
   - Provides a copy button and direct navigation to track live progress.
4. **Track Booking Status**:
   - Customer accesses the `/track` page.
   - Types vehicle plate number or phone.
   - Receives an intuitive visual progress bar indicating whether the appointment is **Pending Review**, **Approved**, **In Workshop**, or **Completed**.

### 6.2 Administrator Module
1. **Admin Authentication**:
   - Accesses `/login` with credentials.
   - Receives a signed JWT stored securely in `localStorage`.
   - Automatic redirect upon successful login.
2. **Dashboard Overview**:
   - High-level metric cards for instant status overview.
   - Real-time appointments table with color-coded status badges.
3. **Appointment Management**:
   - One-click buttons to change status to `Approved`, `Completed`, or `Rejected`.
   - Inspection modal to review customer notes and contact details.
   - Delete confirmation dialog to permanently remove records.
4. **Filter & Search Controls**:
   - Filter by status tab (`All`, `Pending`, `Approved`, `Completed`, `Rejected`).
   - Filter by appointment date.
   - Real-time keyword search by customer, vehicle, or phone.
5. **Service Categories Management**:
   - Dedicated page (`/admin/services`) to add new service packages or delete existing ones.

---

## 7. Testing & Verification

### 7.1 Backend API Tests Conducted
- **Database Seeding**: Verified automated creation of default admin and 6 service categories.
- **Authentication**: Tested `POST /api/auth/login` with correct and invalid passwords.
- **Booking Creation**: Tested `POST /api/bookings` with complete data validation.
- **Booking Tracking**: Tested `GET /api/bookings/track/search?query=WP%20CAQ-1928`.
- **Status Mutation**: Verified `PUT /api/bookings/:id/status` with Bearer token authentication.
- **Metrics Aggregation**: Verified accurate counters for total, pending, approved, and today's appointments.

### 7.2 Frontend UI & UX Tests Conducted
- **Responsive Navigation**: Verified both desktop navigation bar and mobile drawer.
- **Form Validation**: Tested client-side input validation for empty fields and required data.
- **Protected Routing**: Attempting to visit `/admin` without logging in properly redirects to `/login`.
- **Live Notifications**: Verified toast notifications on booking submission, status updates, category creation, and login/logout.
- **Production Build**: Executed `vite build` with zero errors, producing an optimized bundle.

---

## 8. Deployment Strategy

### 8.1 Backend on Render.com
- Environment: Node.js Web Service
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node server.js`
- Environment Variables:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `PORT=5000`
  - `ADMIN_USERNAME=admin`
  - `ADMIN_PASSWORD=admin123`

### 8.2 Frontend on Vercel
- Environment: Vite React Single Page Application (SPA)
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable:
  - `VITE_API_URL=https://<your-render-app>.onrender.com/api`

---

## 9. Conclusion
The **FUCHSIUS Vehicle Service Booking System** fully satisfies all functional, architectural, and technical requirements set forth in the internship documentation. Both customer and administrator modules are completed, integrated, tested, and ready for deployment.
