# Implementation Plan — Mini ERP + CRM Operations Portal

## Purpose

This document defines the implementation strategy, development phases, milestones, and execution plan for building the Mini ERP + CRM Operations Portal within the 48-hour assignment timeline.

The implementation prioritizes completion of all mandatory modules, clean architecture, working business logic, and successful deployment.

---

# Project Scope

The MVP will include:

- Authentication & role-based access
- Customer CRM
- Product & inventory management
- Stock movement logging
- Sales challan generation
- Challan confirmation with stock deduction
- REST APIs
- React frontend
- Cloud deployment
- Documentation

---

# Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM

## Database

- PostgreSQL (Supabase)

## Authentication

- JWT
- bcrypt

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: Supabase PostgreSQL

---

# Repository Structure

mini-erp-crm/

├── frontend/

├── backend/

├── docs/

│ ├── prd.md

│ ├── techspec.md

│ ├── schema.md

│ ├── appflow.md

│ └── implementation-plan.md

└── README.md

---

# Development Phases

## Phase 1 — Project Setup

### Goal

Create project structure and initialize development environment.

### Tasks

- Initialize Git repository
- Create frontend with Vite + React + TypeScript
- Create backend with Express + TypeScript
- Configure Prisma
- Connect PostgreSQL database
- Create environment configuration
- Configure CORS
- Create basic Express server

### Deliverable

Running frontend and backend connected to PostgreSQL.

Estimated Time: **2 hours**

---

## Phase 2 — Database Implementation

### Goal

Implement all required database models.

### Tasks

Create Prisma models for:

- User
- Customer
- FollowUp
- Product
- StockMovement
- Challan
- ChallanItem

Run migrations and seed initial users.

### Deliverable

Database schema created successfully.

Estimated Time: **2 hours**

---

## Phase 3 — Authentication Module

### Goal

Implement secure login and authorization.

### Tasks

- Password hashing
- JWT generation
- Login endpoint
- Authentication middleware
- Role middleware
- Protected routes

### APIs

POST /auth/login

GET /auth/me

### Deliverable

Role-based authentication working.

Estimated Time: **2 hours**

---

## Phase 4 — Customer CRM Module

### Goal

Implement customer management functionality.

### Tasks

- Customer CRUD APIs
- Search API
- Customer detail API
- Follow-up creation API
- Validation
- Pagination

### APIs

GET /customers

POST /customers

PUT /customers/:id

GET /customers/:id

POST /customers/:id/followups

### Deliverable

Complete customer CRM functionality.

Estimated Time: **3 hours**

---

## Phase 5 — Product & Inventory Module

### Goal

Implement product and stock management.

### Tasks

- Product CRUD APIs
- Inventory update logic
- Stock movement creation
- Stock history API
- Validation

### APIs

GET /products

POST /products

PUT /products/:id

GET /products/:id

GET /products/:id/movements

### Deliverable

Inventory management operational.

Estimated Time: **3 hours**

---

## Phase 6 — Sales Challan Module

### Goal

Implement challan creation and confirmation workflow.

### Tasks

- Challan creation
- Multiple product support
- Auto challan number generation
- Draft saving
- Confirmation logic
- Stock validation
- Stock deduction
- Product snapshot storage
- Transaction implementation

### APIs

POST /challans

GET /challans

GET /challans/:id

PUT /challans/:id/status

### Business Logic

Draft

- Save challan
- No inventory change

Confirmed

- Validate stock
- Prevent negative stock
- Deduct inventory
- Create stock movement logs
- Store product snapshots

### Deliverable

Complete challan workflow operational.

Estimated Time: **5 hours**

---

## Phase 7 — Frontend Development

### Goal

Build responsive admin-style UI.

### Layout

Sidebar + Top Navigation

### Pages

#### Login

- Email
- Password

#### Dashboard

- Summary cards
- Quick actions

#### Customers

- Table
- Search
- Add/Edit form

#### Customer Detail

- Customer information
- Follow-up timeline

#### Products

- Product table
- Add/Edit form

#### Create Challan

- Customer selector
- Product selector
- Quantity inputs
- Draft / Confirm buttons

#### Challan List

- Search
- Status filter
- View details

### Deliverable

All modules accessible through UI.

Estimated Time: **6 hours**

---

## Phase 8 — Integration

### Goal

Connect frontend with backend APIs.

### Tasks

- Axios service layer
- Authentication handling
- JWT storage
- Route protection
- Error handling
- Loading states
- Form validation

### Deliverable

End-to-end functionality working.

Estimated Time: **2 hours**

---

## Phase 9 — Deployment

### Goal

Deploy application to cloud platforms.

### Backend

Deploy to Render.

### Frontend

Deploy to Vercel.

### Database

Use Supabase PostgreSQL.

### Environment Variables

Backend

DATABASE_URL

JWT_SECRET

PORT

Frontend

VITE_API_URL

### Deliverable

Live frontend and backend URLs.

Estimated Time: **2 hours**

---

## Phase 10 — Documentation & Submission

### Goal

Prepare final submission package.

### Tasks

- Update README
- Add setup instructions
- Add deployment instructions
- Export Postman collection
- Prepare test credentials
- Write architecture summary
- Record application demo
- Record implementation explanation

### Deliverable

Complete submission package.

Estimated Time: **2 hours**

---

# 48-Hour Execution Timeline

## Day 1

### Hours 0–2

Project setup

### Hours 2–4

Database schema

### Hours 4–6

Authentication

### Hours 6–9

Customer CRM

### Hours 9–12

Product & Inventory

### End of Day 1

Backend core modules completed.

---

## Day 2

### Hours 12–17

Sales Challan module

### Hours 17–23

Frontend implementation

### Hours 23–25

API integration

### Hours 25–27

Deployment

### Hours 27–30

Documentation

### Hours 30–32

Screen recording

### Final Buffer

Testing and bug fixes.

---

# Testing Checklist

## Authentication

- Login works
- Invalid login rejected
- Protected routes secured

## Customers

- Create customer
- Edit customer
- Search customer
- Add follow-up

## Products

- Create product
- Edit product
- Update stock
- View stock history

## Challans

- Create draft challan
- Confirm challan
- Stock deducted
- Negative stock prevented
- Product snapshot stored

## Deployment

- Frontend accessible
- Backend accessible
- Database connected

---

# Git Commit Plan

Commit 1

Initialize project structure

Commit 2

Add Prisma schema and database

Commit 3

Implement authentication

Commit 4

Implement customer module

Commit 5

Implement product module

Commit 6

Implement inventory logging

Commit 7

Implement challan workflow

Commit 8

Build frontend dashboard

Commit 9

Connect frontend APIs

Commit 10

Deploy application and finalize documentation

---

# Submission Checklist

- GitHub Repository
- Live Frontend URL
- Live Backend URL
- PostgreSQL Database
- Test Credentials
- Postman Collection
- README.md
- PRD
- TechSpec
- Schema
- AppFlow
- Implementation Plan
- Screen Recording
- Architecture Explanation

---

# Risk Management

## Risk

Deployment failure

Mitigation

Deploy backend first, then frontend.

## Risk

Database connection issues

Mitigation

Use Supabase PostgreSQL and test locally before deployment.

## Risk

Authentication bugs

Mitigation

Implement middleware early and test with Postman.

## Risk

Stock deduction inconsistency

Mitigation

Use Prisma transactions for challan confirmation.

---

# MVP Completion Criteria

The implementation is considered complete when:

- Users can log in with role-based access
- Customers can be managed
- Products can be managed
- Inventory logs are created
- Sales challans can be created
- Challans can be confirmed
- Stock is deducted correctly
- Negative stock is prevented
- Application is deployed
- Documentation is complete
- Demo recording is available

This implementation plan is optimized for completing the assignment within the provided 48-hour timeline while demonstrating full-stack development capability, backend business logic, database design, frontend integration, and deployment readiness.