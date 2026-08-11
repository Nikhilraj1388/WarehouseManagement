# Mini ERP + CRM Operations Portal

A full-stack lightweight business management system for wholesale/distribution companies. Manages customers, products, inventory, and sales challans through a secure role-based interface.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express.js + TypeScript |
| Database | PostgreSQL (Supabase) + Prisma ORM |
| Auth | JWT + bcrypt |
| State | React Query + React Context |

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API route definitions
│   │   ├── middleware/     # Auth & error middleware
│   │   ├── validators/    # Zod validation schemas
│   │   ├── prisma/        # Prisma client singleton
│   │   ├── utils/         # Helper functions
│   │   ├── types/         # TypeScript declarations
│   │   ├── app.ts         # Express app setup
│   │   └── server.ts      # Server entry point
│   └── prisma/
│       ├── schema.prisma  # Database schema
│       └── seed.ts        # Seed data
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks (useAuth)
│   │   ├── services/      # API service layer
│   │   ├── types/         # TypeScript interfaces
│   │   ├── App.tsx        # Router setup
│   │   └── main.tsx       # Entry point
│   └── index.html
└── docs/                  # Specification documents
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL database (or Supabase account)

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-jwt-secret-key"
PORT=3001
```

Run migrations and seed:
```bash
npx prisma migrate dev --name init
npx prisma generate
npm run prisma:seed
```

Start the server:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:3001/api
```

Start the dev server:
```bash
npm run dev
```

## 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@erp.com | admin123 |
| Sales | sales@erp.com | sales123 |
| Warehouse | warehouse@erp.com | warehouse123 |
| Accounts | accounts@erp.com | accounts123 |

## 📋 Features

### Authentication & Authorization
- JWT-based secure login
- Role-based access control (Admin, Sales, Warehouse, Accounts)
- Protected API routes and frontend routes

### Customer CRM
- Create, edit, search, and view customers
- Customer types: Retail, Wholesale, Distributor
- Status tracking: Lead → Active → Inactive
- Follow-up notes with timeline

### Product & Inventory Management
- Full product CRUD with SKU management
- Real-time stock tracking
- Stock IN/OUT with movement logging
- Low stock alerts (below minimum threshold)
- Complete audit trail via stock movement history

### Sales Challan
- Create challans with multiple products
- Auto-generated challan numbers
- Draft → Confirmed workflow
- **Transactional stock deduction** on confirmation
- Negative stock prevention
- Product snapshot storage for historical accuracy

### Dashboard
- KPI cards: Total Customers, Products, Low Stock, Challans
- Recent challans overview
- Upcoming follow-ups
- Quick action buttons

## 🗄️ Database Schema

7 tables with proper relations:
- **User** — Application users with roles
- **Customer** — CRM customer data
- **FollowUp** — Customer follow-up notes
- **Product** — Product catalog with stock
- **StockMovement** — Inventory audit trail
- **Challan** — Sales challan records
- **ChallanItem** — Challan line items with product snapshots

## 🔌 API Endpoints

```
POST   /api/auth/login              # Login
GET    /api/auth/me                 # Current user

GET    /api/customers               # List (search, filter, paginate)
POST   /api/customers               # Create
GET    /api/customers/:id           # Detail
PUT    /api/customers/:id           # Update
POST   /api/customers/:id/followups # Add follow-up

GET    /api/products                # List
POST   /api/products                # Create
GET    /api/products/:id            # Detail
PUT    /api/products/:id            # Update
POST   /api/products/:id/stock      # Update stock
GET    /api/products/:id/movements  # Stock history

GET    /api/challans                # List
POST   /api/challans                # Create
GET    /api/challans/:id            # Detail
PUT    /api/challans/:id/status     # Confirm/Cancel

GET    /api/dashboard/stats         # Dashboard KPIs
```

## 🏗️ Architecture

```
React Frontend → Axios → Express REST API → Auth Middleware → Controllers → Services → Prisma ORM → PostgreSQL
```

- JWT authentication secures all protected endpoints
- Role-based middleware controls module access
- Challan confirmation uses Prisma `$transaction` for data consistency
- Stock movements provide complete audit trail

## 📝 Assumptions & Limitations

- Single company instance
- Single warehouse per product
- Basic role permissions (4 roles)
- No purchase order or invoice module
- No payment gateway integration
- Simplified inventory model (no reservations)

## 🚀 Deployment

- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Supabase PostgreSQL
