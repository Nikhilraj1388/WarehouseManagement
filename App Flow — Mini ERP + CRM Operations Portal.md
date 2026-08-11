# App Flow — Mini ERP + CRM Operations Portal

## Purpose

This document describes the complete user journey and application flow for the Mini ERP + CRM Operations Portal. It explains how different user roles interact with the system, how data moves between modules, and how business processes such as customer management, inventory updates, and sales challan confirmation are executed.

---

# 1. Application Entry Flow

Application Launch

↓

Login Page

↓

Enter Email & Password

↓

Authentication API

↓

Credentials Valid?

↙ ↘

No Yes

↓

Show Error

↓

Generate JWT Token

↓

Redirect to Dashboard

After successful login, the user is redirected to the dashboard based on their assigned role.

---

# 2. Role-Based Navigation

## Admin

Dashboard

├── Customers

├── Products

├── Inventory

├── Challans

└── User Management (Optional)

## Sales

Dashboard

├── Customers

├── Follow-ups

└── Challans

## Warehouse

Dashboard

├── Products

└── Inventory

## Accounts

Dashboard

├── Challans

└── Reports

---

# 3. Dashboard Flow

Login

↓

Dashboard

↓

Summary Cards

├── Total Customers

├── Active Customers

├── Total Products

├── Low Stock Products

└── Total Challans

↓

Quick Actions

├── Add Customer

├── Add Product

└── Create Challan

---

# 4. Customer CRM Flow

Dashboard

↓

Customers

↓

Customer List

↓

Search / Filter

↓

Select Action

├── Add Customer

├── Edit Customer

└── View Customer

## Add Customer Flow

Customer Form

↓

Enter Customer Details

↓

Validate Inputs

↓

Save Customer

↓

Success Message

↓

Return to Customer List

## Customer Detail Flow

Customer List

↓

Customer Detail

↓

View Information

↓

Follow-up Section

↓

Add Follow-up Note

↓

Save Follow-up

↓

Updated Customer Timeline

---

# 5. Product & Inventory Flow

Dashboard

↓

Products

↓

Product List

↓

Select Action

├── Add Product

├── Edit Product

└── View Product

## Add Product Flow

Product Form

↓

Enter Product Details

↓

Validate Data

↓

Save Product

↓

Product Created

## Inventory Update Flow

Product

↓

Update Stock

↓

Select Movement Type

├── IN

└── OUT

↓

Enter Quantity

↓

Save

↓

Update Product Stock

↓

Create Stock Movement Log

## Stock Movement Flow

Inventory Updated

↓

Stock Movement Record

↓

Store

- Product
- Quantity
- Movement Type
- Reason
- User
- Timestamp

↓

Display in Product History

---

# 6. Sales Challan Flow

Dashboard

↓

Create Challan

↓

Select Customer

↓

Add Products

↓

Enter Quantities

↓

Generate Challan Number

↓

Calculate Total Quantity

↓

Choose Status

├── Draft

└── Confirmed

## Draft Flow

Save Challan

↓

Store Challan

↓

Status = Draft

↓

No Stock Changes

## Confirmation Flow

Confirm Challan

↓

Begin Transaction

↓

Check Stock for Each Product

↓

Stock Available?

↙ ↘

No Yes

↓

Return Error

↓

Reduce Stock

↓

Create Stock Movement Logs

↓

Store Product Snapshot

↓

Update Challan Status

↓

Commit Transaction

↓

Success Response

---

# 7. Insufficient Stock Flow

Confirm Challan

↓

Requested Quantity

↓

Compare with Current Stock

↓

Requested > Available?

↓

Yes

↓

Return HTTP 400

↓

Display

"Insufficient stock for Product X"

↓

Challan remains Draft

No inventory changes occur when stock validation fails.

---

# 8. Challan Management Flow

Dashboard

↓

Challans

↓

Challan List

↓

Search / Filter

↓

Select Challan

↓

View Details

↓

Available Actions

├── Confirm (Draft Only)

├── Cancel

└── View History

## Cancel Flow

Select Challan

↓

Cancel Challan

↓

Status = Cancelled

↓

No Stock Restoration (Simplified MVP)

---

# 9. API Request Flow

React UI

↓

Axios Request

↓

Express Route

↓

Authentication Middleware

↓

Role Middleware

↓

Controller

↓

Service Layer

↓

Prisma ORM

↓

PostgreSQL

↓

Response

↓

Frontend UI Update

---

# 10. Authentication Flow

Login Form

↓

POST /auth/login

↓

Find User

↓

Verify Password

↓

Password Correct?

↙ ↘

No Yes

↓

401 Unauthorized

↓

Generate JWT

↓

Return Token

↓

Store Token

↓

Access Protected Routes

---

# 11. Authorization Flow

Request Protected API

↓

JWT Middleware

↓

Token Valid?

↙ ↘

No Yes

↓

401 Unauthorized

↓

Role Middleware

↓

Role Allowed?

↙ ↘

No Yes

↓

403 Forbidden

↓

Execute API

---

# 12. Complete Business Workflow

Sales Executive

↓

Create Customer

↓

Add Follow-up

↓

Customer Becomes Active

↓

Create Challan

↓

Add Products

↓

Confirm Challan

↓

Inventory Reduced

↓

Stock Movement Logged

↓

Accounts Can View Challan

↓

Warehouse Can View Updated Inventory

This represents the primary operational workflow of the application.

---

# 13. Error Handling Flow

User Action

↓

API Request

↓

Validation

↓

Validation Passed?

↙ ↘

No Yes

↓

400 Bad Request

↓

Execute Business Logic

↓

Business Rule Passed?

↙ ↘

No Yes

↓

409 / 400 Error

↓

Database Update

↓

Success Response

---

# 14. Logout Flow

User Clicks Logout

↓

Remove JWT Token

↓

Clear User Session

↓

Redirect to Login Page

---

# 15. End-to-End User Journey

Open Application

↓

Login

↓

Dashboard

↓

Create Customer

↓

Add Product

↓

Update Inventory

↓

Create Challan

↓

Confirm Challan

↓

Stock Deducted

↓

View Challan History

↓

Logout

This flow covers all major modules required in the assignment and demonstrates the complete ERP + CRM operational cycle from customer acquisition to inventory deduction and challan management.