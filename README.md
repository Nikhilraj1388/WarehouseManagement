# 📦 Mini ERP + CRM Operations Portal

A modern, full-stack Enterprise Resource Planning (ERP) and Customer Relationship Management (CRM) Operations Portal built with **TypeScript**, **Node.js (Express)**, **Prisma ORM**, **PostgreSQL**, **React (Vite)**, and **Tailwind CSS**.

---

## 🌐 Live Production Links

- **🚀 Live Frontend Web App (Vercel):** [https://warehouse-management-three-omega.vercel.app](https://warehouse-management-three-omega.vercel.app)
- **⚡ Live Backend REST API (Render):** [https://mini-erp-backend-rvwj.onrender.com/api](https://mini-erp-backend-rvwj.onrender.com/api)
- **📁 GitHub Repository:** [https://github.com/Nikhilraj1388/WarehouseManagement](https://github.com/Nikhilraj1388/WarehouseManagement)

---

## 🔑 Demo Account Credentials

| Role | Email | Password | Allowed Capabilities |
| :--- | :--- | :--- | :--- |
| **👑 ADMIN** | `nikhilraj2342005@gmail.com` | `myPassword123` | Master control: CRM, Inventory, Delivery Challans, Staff User Management, Dashboard Stats. Bypass all role restrictions. |
| **💼 SALES** | `sales@erp.com` | `sales123` | CRM customer management, create/confirm delivery challans, view stock levels (read-only inventory). |
| **📦 WAREHOUSE** | `warehouse@erp.com` | `warehouse123` | Product management, stock IN/OUT updates, view stock movement logs, view customer list (read-only). |
| **💳 ACCOUNTS** | `accounts@erp.com` | `accounts123` | Financial audit, view delivery challan snapshots, view customer background (read-only access). |

---

## 🏗️ System Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      Frontend (React 18 + Vite + SPA)                    │
│        TanStack Query • React Router v6 • Axios • Tailwind CSS v4       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                 HTTPS / JWT
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     Backend API (Node.js + Express + TS)                │
│       JWT Auth Middleware • Role-Based RBAC • Zod Schema Validation     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                               Prisma ORM
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     Database (PostgreSQL on Supabase)                    │
│   Transactional Atomicity ($transaction) • Foreign Key Cascades • Audit  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Architectural Highlights:
1. **Atomic Transactional Integrity (`Prisma $transaction`)**:
   - When a Delivery Challan is transitioned to `CONFIRMED`, the backend executes an atomic transaction that:
     1. Verifies current product stock level.
     2. Throws an error and rolls back if stock is insufficient.
     3. Deducts stock (`currentStock -= qty`).
     4. Generates an immutable `StockMovement` audit log record (`movementType: OUT`, `reason: Challan #...`).
     5. Updates challan status to `CONFIRMED`.
2. **Master Bypass Authorization Middleware**:
   - The `requireRole(['SALES', ...])` middleware checks user roles. The `ADMIN` role is globally granted master bypass across all routes.
3. **Immutability & Snapshot Preservation**:
   - When a Delivery Challan is created, product details (unit price, SKU, product name) are snapshot-stored inside `ChallanItem`. Future price changes to the product will not corrupt historic sales invoices.

---

## 🛡️ Role-Based Access Control (RBAC) Matrix

| Feature / Module | ADMIN | SALES | WAREHOUSE | ACCOUNTS |
| :--- | :---: | :---: | :---: | :---: |
| **View Dashboard Stats** | ✅ | ✅ | ✅ | ✅ |
| **Customer List & Search** | ✅ | ✅ | ✅ (Read) | ✅ (Read) |
| **Add / Edit / Delete Customer** | ✅ | ✅ | ❌ | ❌ |
| **Add Customer Follow-up Note** | ✅ | ✅ | ❌ | ❌ |
| **Product List & Search** | ✅ | ✅ (Read) | ✅ | ✅ (Read) |
| **Add / Edit / Delete Product** | ✅ | ❌ | ✅ | ❌ |
| **Update Product Stock (IN/OUT)** | ✅ | ❌ | ✅ | ❌ |
| **View Stock Movement Log** | ✅ | ✅ | ✅ | ✅ |
| **Create Delivery Challan (Draft)** | ✅ | ✅ | ❌ | ❌ |
| **Confirm Challan (Stock Deduction)** | ✅ | ✅ | ❌ | ❌ |
| **View Challan Snapshots** | ✅ | ✅ | ✅ | ✅ |
| **Staff & User Management** | ✅ | ❌ | ❌ | ❌ |

---

## 💻 Local Setup & Installation

### Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher
- **Git**

### 1. Clone Repository
```bash
git clone https://github.com/Nikhilraj1388/WarehouseManagement.git
cd WarehouseManagement
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
DATABASE_URL="postgresql://postgres:Nikhilraj%402304@db.ouqyhqrypxszchhvwyuh.supabase.co:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres:Nikhilraj%402304@db.ouqyhqrypxszchhvwyuh.supabase.co:5432/postgres?sslmode=require"
JWT_SECRET="mini-erp-jwt-secret-key-2024"
PORT=3001
```

Run database setup & start backend server:
```bash
npx prisma generate
npm run dev
```
*Backend will run locally at `http://localhost:3001`.*

### 3. Frontend Setup
Open a new terminal tab:
```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:
```env
VITE_API_URL=http://localhost:3001/api
```

Start frontend development server:
```bash
npm run dev
```
*Frontend will run locally at `http://localhost:5173`.*

---

## ☁️ Cloud Deployment Guide

### Deploying Backend to Render
1. Create a **Web Service** on Render connected to `Nikhilraj1388/WarehouseManagement`.
2. Set **Root Directory** to `backend`.
3. Set **Build Command**: `npm install && npx prisma generate && npm run build`
4. Set **Start Command**: `npm run start`
5. Add Environment Variables:
   - `DATABASE_URL`: `postgresql://postgres.ouqyhqrypxszchhvwyuh:Nikhilraj%402304@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true`
   - `DIRECT_URL`: `postgresql://postgres:Nikhilraj%402304@db.ouqyhqrypxszchhvwyuh.supabase.co:5432/postgres?sslmode=require`
   - `JWT_SECRET`: `mini-erp-jwt-secret-key-2024`
   - `PORT`: `3001`

### Deploying Frontend to Vercel
1. Import repository on Vercel.
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. Add Environment Variable:
   - `VITE_API_URL`: `https://mini-erp-backend-rvwj.onrender.com/api`

---

## 📬 Postman Collection & API Documentation

A complete, importable Postman v2.1.0 collection is located at [`postman_collection.json`](./postman_collection.json).

### API Endpoints Summary

#### 🔒 Authentication (`/api/auth`)
- `POST /api/auth/login` - Authenticate user & receive JWT token
- `POST /api/auth/register` - Register a new account
- `GET /api/auth/me` - Get current authenticated user profile

#### 👥 Customer CRM Module (`/api/customers`)
- `GET /api/customers` - List customers (Supports `search`, `status`, `customerType`, `page`, `limit`)
- `POST /api/customers` - Create customer (Name, Mobile, Email, Business Name, GST Number, Customer Type, Address, Status, Follow-up Date, Notes)
- `GET /api/customers/:id` - Get customer detail with follow-up timeline & challan history
- `PUT /api/customers/:id` - Update customer record
- `POST /api/customers/:id/followups` - Add follow-up note to customer
- `DELETE /api/customers/:id` - Delete customer record (ADMIN & SALES)

#### 📦 Product & Inventory Module (`/api/products`)
- `GET /api/products` - List products (Supports `search`, `category`, `page`, `limit`)
- `POST /api/products` - Create product (Name, SKU, Category, Price, Stock, Min Stock Alert, Location)
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product details
- `POST /api/products/:id/stock` - Adjust stock IN/OUT (Creates StockMovement audit record)
- `GET /api/products/:id/movements` - Get stock movement log history for product
- `DELETE /api/products/:id` - Delete product record (ADMIN & WAREHOUSE)

#### 🧾 Delivery Challans Module (`/api/challans`)
- `GET /api/challans` - List challans (Supports `search`, `status`, `page`, `limit`)
- `POST /api/challans` - Create Delivery Challan (Draft or Confirmed)
- `GET /api/challans/:id` - Get challan detail with product snapshot items
- `PUT /api/challans/:id/status` - Transition status (`CONFIRMED` triggers stock verification & atomic deduction)

#### ⚙️ User Management (`/api/users`)
- `GET /api/users` - List staff members (ADMIN only)
- `POST /api/users` - Create staff user with role assignment (ADMIN only)
- `PUT /api/users/:id` - Update staff role or credentials (ADMIN only)
- `DELETE /api/users/:id` - Remove staff member (ADMIN only)

#### 📊 Dashboard (`/api/dashboard`)
- `GET /api/dashboard/stats` - Summary KPI metrics, low stock alerts, recent challans, upcoming follow-ups

---

## ⚠️ Known Limitations & Future Scope

1. **Email Notifications**:
   - *Current Limitation*: Follow-up dates and low stock alerts are displayed visually in the portal UI dashboard.
   - *Future Scope*: Integration with SendGrid / Nodemailer to send automated email alerts to sales reps for upcoming follow-ups.
2. **PDF Challan Export**:
   - *Current Limitation*: Challans are viewed on screen with printable snapshots.
   - *Future Scope*: Adding `react-pdf` or server-side `puppeteer` PDF generation for one-click downloadable invoice PDFs.
3. **Multi-Warehouse Transfers**:
   - *Current Limitation*: Products store a `warehouseLocation` string tag.
   - *Future Scope*: Multi-tenant warehouse location transfer logs (transfer stock from Warehouse A to Warehouse B).
