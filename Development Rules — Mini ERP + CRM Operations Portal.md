# Development Rules — Mini ERP + CRM Operations Portal

## Purpose

This document defines the mandatory development rules, coding standards, architecture guidelines, API conventions, database rules, and business constraints for the Mini ERP + CRM Operations Portal.

These rules ensure consistency, maintainability, security, and successful completion of the project within the 48-hour assignment timeline.

---

# 1. General Rules

- Build only the required MVP features.
- Keep the architecture simple and modular.
- Prioritize working functionality over visual polish.
- Avoid unnecessary third-party libraries.
- Every feature must be testable independently.
- Code should be readable and easy to explain during interviews.
- Use meaningful variable and function names.
- Do not commit secrets or credentials to Git.

---

# 2. Technology Rules

## Frontend

Must use:

- React
- TypeScript
- Vite
- Tailwind CSS

## Backend

Must use:

- Node.js
- Express.js
- TypeScript

## Database

Must use:

- PostgreSQL
- Prisma ORM

## Authentication

Must use:

- JWT
- bcrypt

---

# 3. Folder Structure Rules

## Backend

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

## Frontend

src/

components/

pages/

layouts/

services/

hooks/

types/

utils/

App.tsx

main.tsx

Do not place business logic directly inside route files.

---

# 4. Coding Standards

## TypeScript

- Use strict typing.
- Avoid using `any`.
- Create interfaces/types for request and response objects.
- Use enums for roles, statuses, and movement types.

## Naming

### Variables

camelCase

Example:

customerName

### Functions

camelCase

Example:

createCustomer()

### Components

PascalCase

Example:

CustomerTable

### Files

Use consistent naming.

Examples:

customer.service.ts

auth.middleware.ts

ProductForm.tsx

---

# 5. API Rules

All APIs must follow REST conventions.

## Authentication

POST /auth/login

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

Do not use verbs in endpoint names.

Correct:

/customers

Incorrect:

/getCustomers

---

# 6. Response Format Rules

## Success Response

{

  "success": true,

  "data": {}

}

## Error Response

{

  "success": false,

  "message": "Descriptive error message"

}

Use consistent JSON responses across all APIs.

---

# 7. HTTP Status Code Rules

200 OK

201 Created

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

500 Internal Server Error

Never return 200 for validation failures.

---

# 8. Authentication Rules

- Every protected route must verify JWT.
- Passwords must be hashed with bcrypt.
- JWT secret must come from environment variables.
- Tokens must expire after a reasonable duration.
- Unauthorized requests must return 401.

---

# 9. Authorization Rules

Roles:

- ADMIN
- SALES
- WAREHOUSE
- ACCOUNTS

Role middleware must be used on protected routes.

Example:

requireRole([ADMIN, SALES])

Admin has full access.

Sales can access:

- Customers
- Follow-ups
- Challans

Warehouse can access:

- Products
- Inventory

Accounts can access:

- Challans
- Reports

---

# 10. Validation Rules

Validate all incoming data.

## Customer

Required:

- customerName
- mobile
- customerType
- status

## Product

Required:

- name
- sku
- category
- unitPrice

Constraints:

- unitPrice >= 0
- currentStock >= 0

## Challan

Required:

- customerId
- at least one product
- positive quantity

Never trust frontend validation alone.

---

# 11. Database Rules

- Use UUID primary keys.
- Use foreign key constraints.
- Use Prisma relations.
- Add indexes on searchable fields.
- Do not store plain-text passwords.
- Use timestamps for auditability.

Tables:

- users
- customers
- follow_ups
- products
- stock_movements
- challans
- challan_items

---

# 12. Business Rules

## Customer

- Mobile number is mandatory.
- Customer status must be Lead, Active, or Inactive.

## Product

- SKU must be unique.
- Stock cannot be negative.
- Unit price cannot be negative.

## Inventory

Every stock change must create a stock movement log.

Movement types:

- IN
- OUT

---

# 13. Sales Challan Rules

## Draft

- No stock deduction
- No inventory movement

## Confirmed

Before confirmation:

1. Check stock
2. Reject if insufficient
3. Deduct stock
4. Create stock movement logs
5. Store product snapshot
6. Mark challan as Confirmed

Stock must never become negative.

---

# 14. Transaction Rules

Challan confirmation must run inside a database transaction.

All operations succeed or fail together.

Do not update stock outside a transaction.

---

# 15. Product Snapshot Rule

Challan items must store:

- productName
- sku
- unitPrice
- quantity

Do not rely only on productId for historical records.

---

# 16. Frontend Rules

- Use responsive layouts.
- Use reusable components.
- Keep forms controlled.
- Show loading indicators.
- Display API error messages.
- Validate forms before submission.
- Protect authenticated routes.

---

# 17. UI Rules

Use a clean admin-style interface.

Sidebar:

- Dashboard
- Customers
- Products
- Challans

Top Navbar:

- User profile
- Logout

Tables should support:

- Search
- Pagination
- Status badges

---

# 18. State Management Rules

Use React state and React Query.

Server state:

- customers
- products
- challans

Local state:

- forms
- modal visibility
- filters
- search input

Do not duplicate server state unnecessarily.

---

# 19. Environment Rules

Backend

DATABASE_URL

JWT_SECRET

PORT

Frontend

VITE_API_URL

Never hardcode URLs or secrets.

---

# 20. Git Rules

Commit frequently.

Recommended commits:

- Initial setup
- Database schema
- Authentication
- Customer module
- Product module
- Inventory module
- Challan module
- Frontend
- Deployment
- Documentation

Use descriptive commit messages.

Example:

Implement customer CRUD APIs

---

# 21. Deployment Rules

Frontend:

- Deploy on Vercel

Backend:

- Deploy on Render

Database:

- Supabase PostgreSQL

Deployment must use environment variables.

Production build must be tested before submission.

---

# 22. Documentation Rules

Repository must include:

- README.md
- prd.md
- techspec.md
- schema.md
- appflow.md
- implementation-plan.md
- tracker.md
- rules.md

README must contain:

- setup instructions
- environment variables
- deployment instructions
- test credentials
- project architecture

---

# 23. Testing Rules

Before submission verify:

Authentication

- Login works
- Invalid login fails

Customers

- Create
- Edit
- Search
- Follow-up

Products

- Create
- Edit
- Stock update

Challans

- Draft creation
- Confirmation
- Stock deduction
- Negative stock prevention

Deployment

- Frontend accessible
- Backend accessible

---

# 24. Recording Rules

Record:

- Project setup
- Database explanation
- Authentication
- Customer flow
- Product flow
- Challan confirmation
- Final application demo

Recording should clearly demonstrate your understanding of the implementation.

---

# 25. Submission Rules

Submit:

- GitHub Repository
- Live Frontend URL
- Live Backend URL
- Test Credentials
- Postman Collection
- Documentation
- Screen Recording

Ensure all links are working before final submission.

---

# Final Rule

A complete working MVP with clean architecture, proper authentication, inventory validation, and challan confirmation logic is more valuable than an incomplete feature-rich implementation. Prioritize correctness, simplicity, and the ability to confidently explain every part of the code during the technical interview.