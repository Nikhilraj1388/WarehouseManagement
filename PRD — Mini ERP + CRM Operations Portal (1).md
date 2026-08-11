# PRD — Mini ERP + CRM Operations Portal

## Product Requirements Document

**Project Name:** Mini ERP + CRM Operations Portal  
**Company Context:** Wholesale / Distribution Business  
**Version:** 1.0  
**Status:** Draft  
**Target Platform:** Web Application (Responsive)

---

# 1. Product Overview

The Mini ERP + CRM Operations Portal is a lightweight business management system for a wholesale/distribution company. The application enables internal employees to manage customers, products, inventory, and sales challans through a secure role-based interface.

The project demonstrates full-stack development capabilities including authentication, REST API development, database design, business logic implementation, responsive frontend development, and cloud deployment.

---

# 2. Problem Statement

The company currently manages customer information, inventory, and sales operations manually. This leads to:

- Poor customer follow-up tracking
- Inventory inconsistencies
- Manual challan generation
- Stock mismatches
- Limited operational visibility
- Lack of role-based access control

The portal centralizes these operations into a single web application.

---

# 3. Goals

## Primary Goals

- Secure role-based authentication
- Customer CRM management
- Product and inventory management
- Sales challan generation
- Automatic stock deduction
- Inventory validation
- Cloud deployment readiness

## Success Criteria

- Users can log in securely
- Customers can be created, edited, searched, and viewed
- Follow-up notes can be recorded
- Products and stock can be managed
- Stock movement logs are maintained
- Challans can be created and confirmed
- Confirmed challans reduce stock
- Negative stock is prevented
- APIs are documented and deployable

---

# 4. User Roles

## Admin

- Full system access
- Manage customers
- Manage products
- Manage inventory
- Create and manage challans
- View all records

## Sales

- Manage customers
- Add follow-up notes
- Create challans
- Confirm challans

## Warehouse

- Manage products
- Update stock
- View stock movement logs

## Accounts

- View challans
- View customers
- View inventory reports

---

# 5. Functional Requirements

## 5.1 Authentication Module

### Features

- User login
- JWT-based authentication
- Role-based authorization
- Protected API routes

### User Fields

- Name
- Email
- Password Hash
- Role
- Created At

---

## 5.2 Customer CRM Module

### Customer Fields

- Customer Name
- Mobile Number
- Email
- Business Name
- GST Number (optional)
- Customer Type
  - Retail
  - Wholesale
  - Distributor
- Address
- Status
  - Lead
  - Active
  - Inactive
- Follow-up Date
- Notes

### Features

- Add customer
- Edit customer
- Search customer
- View customer details
- Add follow-up notes

---

## 5.3 Product & Inventory Module

### Product Fields

- Product Name
- SKU / Code
- Category
- Unit Price
- Current Stock
- Minimum Stock Alert Quantity
- Warehouse Location

### Features

- Add product
- Edit product
- View products
- Update inventory
- View stock history

---

## 5.4 Stock Movement Module

Every inventory change creates a stock movement record.

### Stock Movement Fields

- Product
- Quantity Changed
- Movement Type
  - IN
  - OUT
- Reason
- Created By
- Timestamp

### Features

- Automatic log creation
- Inventory audit trail
- Product-wise history

---

## 5.5 Sales Challan Module

### Challan Fields

- Challan Number (Auto Generated)
- Customer
- Products
- Total Quantity
- Status
  - Draft
  - Confirmed
  - Cancelled
- Created By
- Created Date

### Features

- Create challan
- Select customer
- Add multiple products
- Enter quantities
- Save draft
- Confirm challan
- View challan history

### Business Rules

When a challan is confirmed:

- Verify available stock
- Reject confirmation if stock is insufficient
- Prevent negative stock
- Reduce product stock
- Create stock movement entries
- Store product snapshot data (name, SKU, price, quantity) inside challan items

---

# 6. User Flow

## Authentication

Login → Dashboard

## Customer Flow

Dashboard → Customers → Add/Edit/Search → Customer Details → Follow-up Notes

## Inventory Flow

Dashboard → Products → Add/Edit Product → Update Stock → Stock Movement Log

## Sales Flow

Dashboard → Create Challan → Select Customer → Add Products → Save Draft → Confirm Challan → Stock Updated

---

# 7. API Requirements

RESTful APIs with proper validation and error handling.

## Authentication

POST /auth/login  
POST /auth/register  
GET /auth/me

## Customers

GET /customers  
POST /customers  
GET /customers/:id  
PUT /customers/:id  
POST /customers/:id/followups

## Products

GET /products  
POST /products  
PUT /products/:id  
GET /products/:id  
GET /products/:id/movements

## Challans

GET /challans  
POST /challans  
GET /challans/:id  
PUT /challans/:id/status

## API Standards

- Input validation
- Proper HTTP status codes
- Meaningful error messages
- Pagination where applicable
- Search and filtering support

---

# 8. Frontend Requirements

## Pages

- Login
- Dashboard
- Customers
- Customer Detail
- Products
- Create Challan
- Challan List

## Dashboard Widgets

- Total Customers
- Active Customers
- Total Products
- Low Stock Products
- Total Challans

## UI Requirements

- Responsive design
- Sidebar navigation
- Admin-style layout
- Forms with validation
- Tables with search/filter
- Status badges

---

# 9. Non-Functional Requirements

## Performance

- Fast CRUD operations
- Optimized database queries
- Pagination for list endpoints

## Security

- JWT authentication
- Password hashing
- Role-based authorization
- Protected routes
- Environment variables
- Input validation

## Reliability

- Transaction-based stock updates
- Consistent inventory state
- Error logging
- API validation

---

# 10. Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

## Backend

- Node.js
- Express.js
- TypeScript

## Database

- PostgreSQL

## ORM

- Prisma

## Authentication

- JWT
- bcrypt

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: Supabase PostgreSQL

---

# 11. Database Entities

- User
- Customer
- FollowUp
- Product
- StockMovement
- Challan
- ChallanItem

---

# 12. Assumptions

- Single company instance
- Single warehouse per product
- Basic role permissions
- No purchase order module
- No invoice generation
- No payment gateway integration

---

# 13. Out of Scope

The following features are intentionally excluded from the MVP:

- Purchase Orders
- Invoice PDF generation
- GST calculations
- Accounting ledger
- Multi-warehouse inventory
- Email/SMS notifications
- Advanced reporting
- Barcode scanning

---

# 14. Deployment Plan

## Frontend

Deploy on Vercel.

## Backend

Deploy on Render.

## Database

Use Supabase PostgreSQL.

### Environment Variables

DATABASE_URL  
JWT_SECRET  
PORT

---

# 15. Known Limitations

- Basic reporting only
- Simplified role permissions
- No inventory reservation
- No concurrent stock locking
- Limited analytics

---

# 16. Future Enhancements

- Purchase Order Module
- Invoice Module
- PDF Export
- Dashboard Analytics
- Multi-Warehouse Support
- Product Image Upload
- Email Follow-up Reminders
- Docker Support
- CI/CD Pipeline
- AWS Deployment

---

# 17. Architecture Summary

React Frontend

↓

Express REST API

↓

Prisma ORM

↓

PostgreSQL Database

JWT authentication secures protected endpoints, while role-based middleware controls access to business modules. Inventory updates and challan confirmations are executed using database transactions to maintain data consistency.

---

# 18. Deliverables

- GitHub Repository
- Live Frontend URL
- Live Backend URL
- Test Credentials
- Postman Collection / API Documentation
- README with Setup & Deployment Instructions
- Architecture Summary
- Screen Recording of Complete Workflow