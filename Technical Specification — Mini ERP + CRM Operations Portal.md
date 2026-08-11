# Technical Specification — Mini ERP + CRM Operations Portal

## Document Information

- **Project:** Mini ERP + CRM Operations Portal
- **Version:** 1.0
- **Status:** Draft
- **Tech Stack:** React + TypeScript + Node.js + Express + PostgreSQL
- **Database ORM:** Prisma
- **Deployment:** Vercel + Render + Supabase

---

# 1. System Overview

The Mini ERP + CRM Operations Portal is a role-based web application for managing customers, products, inventory, and sales challans for a wholesale/distribution business.

The system follows a **client-server architecture**.

Frontend communicates with the backend through REST APIs.

Backend interacts with PostgreSQL using Prisma ORM.

JWT authentication secures all protected endpoints.

---

# 2. Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM

## Database

- PostgreSQL

## Authentication

- JWT
- bcrypt

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: Supabase PostgreSQL

---

# 3. High-Level Architecture

React Frontend

↓

Axios

↓

Express REST API

↓

Authentication Middleware

↓

Controllers

↓

Services

↓

Prisma ORM

↓

PostgreSQL

---

# 4. Frontend Architecture

## Folder Structure

src/

components/

pages/

layouts/

hooks/

services/

types/

utils/

App.tsx

main.tsx

### Components

- Sidebar
- Navbar
- DataTable
- FormInput
- SearchBar
- StatusBadge
- LoadingSpinner

### Pages

- Login
- Dashboard
- Customers
- Customer Detail
- Products
- Create Challan
- Challan List

---

# 5. Backend Architecture

## Folder Structure

src/

routes/

controllers/

services/

middleware/

validators/

utils/

prisma/

app.ts

server.ts

### Route Layer

Defines REST endpoints.

### Controller Layer

Handles HTTP requests and responses.

### Service Layer

Contains business logic.

### Middleware

- JWT verification
- Role authorization
- Error handling
- Request validation

### Prisma Layer

Handles database operations.

---

# 6. Database Design

## User

id

name

email

passwordHash

role

createdAt

## Customer

id

customerName

mobile

email

businessName

gstNumber

customerType

address

status

followUpDate

notes

createdAt

## FollowUp

id

customerId

note

createdBy

createdAt

## Product

id

name

sku

category

unitPrice

currentStock

minimumStock

warehouseLocation

createdAt

## StockMovement

id

productId

quantity

movementType

reason

createdBy

createdAt

## Challan

id

challanNumber

customerId

status

totalQuantity

createdBy

createdAt

## ChallanItem

id

challanId

productId

productName

sku

unitPrice

quantity

---

# 7. Relationships

- User → creates Customers
- User → creates Challans
- User → creates Stock Movements
- Customer → has many FollowUps
- Customer → has many Challans
- Challan → has many ChallanItems
- Product → has many StockMovements
- Product → referenced by ChallanItems

---

# 8. Authentication Flow

## Login

1. User submits email and password.
2. Password verified using bcrypt.
3. JWT token generated.
4. Token returned to client.
5. Client stores token.
6. Token included in Authorization header.

Authorization: Bearer <jwt_token>

---

# 9. Authorization

Roles:

- ADMIN
- SALES
- WAREHOUSE
- ACCOUNTS

Role middleware example:

requireRole([ADMIN, SALES])

Access Matrix

Admin: Full access

Sales: Customers, Follow-ups, Challans

Warehouse: Products, Inventory

Accounts: Read-only Challans and Inventory

---

# 10. API Specification

## Authentication

POST /auth/login

POST /auth/register

GET /auth/me

## Customers

GET /customers

POST /customers

GET /customers/:id

PUT /customers/:id

DELETE /customers/:id

POST /customers/:id/followups

GET /customers/search

## Products

GET /products

POST /products

GET /products/:id

PUT /products/:id

DELETE /products/:id

GET /products/:id/movements

## Challans

GET /challans

POST /challans

GET /challans/:id

PUT /challans/:id/status

---

# 11. Validation Rules

## Customer

- customerName required
- mobile required
- customerType required
- status required

## Product

- name required
- sku required
- unitPrice >= 0
- currentStock >= 0
- minimumStock >= 0

## Challan

- customerId required
- minimum one product required
- quantity must be positive

---

# 12. Challan Confirmation Logic

When status changes from Draft to Confirmed:

1. Begin database transaction.
2. Fetch product stock.
3. Verify sufficient stock.
4. Reject if stock is insufficient.
5. Reduce product stock.
6. Create stock movement log.
7. Update challan status.
8. Commit transaction.

Pseudo Flow

For each challan item

↓

Check stock

↓

Stock available?

↙ ↘

No Yes

↓

Return Error

↓

Deduct Stock

↓

Create Stock Log

↓

Confirm Challan

---

# 13. Error Handling

Standard JSON format:

{

  "success": false,

  "message": "Insufficient stock"

}

HTTP Status Codes

200 OK

201 Created

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

500 Internal Server Error

---

# 14. Pagination

GET /customers?page=1&limit=10

Response

{

  "data": [],

  "page": 1,

  "limit": 10,

  "total": 120

}

---

# 15. Search & Filtering

Customers

- name
- mobile
- business name
- status

Products

- name
- sku
- category

Challans

- challan number
- customer
- status
- date range

---

# 16. Frontend State Management

Use React state and React Query.

Server State

- customers
- products
- challans

Local State

- forms
- modal visibility
- filters
- search text

---

# 17. UI Layout

Sidebar

- Dashboard
- Customers
- Products
- Challans

Top Navbar

- User profile
- Logout

Main Content

- Responsive tables
- Forms
- Cards
- Status badges

---

# 18. Security

- Password hashing with bcrypt
- JWT authentication
- Role-based authorization
- Input validation
- SQL injection prevention through Prisma
- XSS prevention
- Environment variables
- CORS configuration

---

# 19. Environment Variables

Backend

DATABASE_URL

JWT_SECRET

PORT

Frontend

VITE_API_URL

---

# 20. Deployment

## Frontend

Platform: Vercel

Build Command

npm run build

Output Directory

dist

## Backend

Platform: Render

Build Command

npm run build

Start Command

npm start

## Database

Platform: Supabase PostgreSQL

---

# 21. Logging

Application logs

- authentication events
- challan confirmations
- stock updates
- API errors

Stock movement logs provide audit history.

---

# 22. Testing

## Backend

- Authentication APIs
- Customer CRUD
- Product CRUD
- Challan creation
- Challan confirmation
- Stock validation

## Frontend

- Login flow
- Customer forms
- Product forms
- Challan workflow
- Responsive layout

---

# 23. Performance Considerations

- Database indexing on SKU and Challan Number
- Pagination for list endpoints
- Search query optimization
- Lazy loading where appropriate
- Efficient Prisma queries

---

# 24. Known Technical Limitations

- Single warehouse support
- Basic role permissions
- No invoice module
- No purchase order module
- No PDF export
- No background job processing
- Simplified inventory model

---

# 25. Future Technical Enhancements

- Docker containerization
- GitHub Actions CI/CD
- Redis caching
- WebSocket notifications
- AWS S3 file uploads
- PDF invoice generation
- Multi-warehouse inventory
- Audit trail
- Reporting module
- Kubernetes deployment

---

# Conclusion

This technical specification defines the architecture, database schema, API structure, business rules, deployment strategy, and implementation details required to build the Mini ERP + CRM Operations Portal according to the assignment requirements. The design prioritizes simplicity, maintainability, and completion within the provided 48-hour development window.