# Database Schema — Mini ERP + CRM Operations Portal

## Purpose

This document defines the database schema for the Mini ERP + CRM Operations Portal. It includes all entities, fields, relationships, constraints, and indexing considerations required for the MVP implementation.

**Database:** PostgreSQL  
**ORM:** Prisma  
**Naming Convention:** snake_case for database tables and columns, camelCase in application code.

---

# Entity Relationship Overview

Users
  |
  | creates
  |
  +------------------+
  |                  |
Customers        Products
  |                  |
  |                  |
FollowUps     StockMovements
  |
  |
Challans
  |
  |
ChallanItems

---

# Tables

## users

Stores application users and role information.

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | TEXT | NOT NULL |
| role | ENUM | ADMIN, SALES, WAREHOUSE, ACCOUNTS |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### Indexes

- UNIQUE(email)

---

## customers

Stores customer CRM information.

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key |
| customer_name | VARCHAR(150) | NOT NULL |
| mobile | VARCHAR(20) | NOT NULL |
| email | VARCHAR(255) | NULL |
| business_name | VARCHAR(150) | NULL |
| gst_number | VARCHAR(20) | NULL |
| customer_type | ENUM | RETAIL, WHOLESALE, DISTRIBUTOR |
| address | TEXT | NULL |
| status | ENUM | LEAD, ACTIVE, INACTIVE |
| follow_up_date | DATE | NULL |
| notes | TEXT | NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### Indexes

- INDEX(customer_name)
- INDEX(mobile)
- INDEX(status)

---

## follow_ups

Stores customer follow-up history.

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key |
| customer_id | UUID | FK → customers.id |
| note | TEXT | NOT NULL |
| created_by | UUID | FK → users.id |
| created_at | TIMESTAMP | DEFAULT NOW() |

### Relationships

- Many follow-ups belong to one customer
- Many follow-ups can be created by one user

### Indexes

- INDEX(customer_id)

---

## products

Stores product and inventory information.

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key |
| name | VARCHAR(150) | NOT NULL |
| sku | VARCHAR(50) | UNIQUE, NOT NULL |
| category | VARCHAR(100) | NOT NULL |
| unit_price | DECIMAL(10,2) | NOT NULL |
| current_stock | INTEGER | DEFAULT 0 |
| minimum_stock | INTEGER | DEFAULT 0 |
| warehouse_location | VARCHAR(100) | NULL |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### Constraints

- current_stock >= 0
- minimum_stock >= 0
- unit_price >= 0

### Indexes

- UNIQUE(sku)
- INDEX(category)
- INDEX(name)

---

## stock_movements

Stores inventory movement history.

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key |
| product_id | UUID | FK → products.id |
| quantity | INTEGER | NOT NULL |
| movement_type | ENUM | IN, OUT |
| reason | VARCHAR(255) | NOT NULL |
| created_by | UUID | FK → users.id |
| created_at | TIMESTAMP | DEFAULT NOW() |

### Relationships

- Many stock movements belong to one product
- Many stock movements can be created by one user

### Indexes

- INDEX(product_id)
- INDEX(created_at)

---

## challans

Stores sales challan records.

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key |
| challan_number | VARCHAR(50) | UNIQUE, NOT NULL |
| customer_id | UUID | FK → customers.id |
| total_quantity | INTEGER | DEFAULT 0 |
| status | ENUM | DRAFT, CONFIRMED, CANCELLED |
| created_by | UUID | FK → users.id |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

### Relationships

- Many challans belong to one customer
- Many challans can be created by one user

### Indexes

- UNIQUE(challan_number)
- INDEX(customer_id)
- INDEX(status)
- INDEX(created_at)

---

## challan_items

Stores product snapshot data for each challan.

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | Primary Key |
| challan_id | UUID | FK → challans.id |
| product_id | UUID | FK → products.id |
| product_name | VARCHAR(150) | NOT NULL |
| sku | VARCHAR(50) | NOT NULL |
| unit_price | DECIMAL(10,2) | NOT NULL |
| quantity | INTEGER | NOT NULL |

### Business Rule

Product snapshot fields ensure historical accuracy even if the product changes later.

### Relationships

- Many challan items belong to one challan
- Many challan items reference one product

### Indexes

- INDEX(challan_id)
- INDEX(product_id)

---

# Relationships

## users

- users.id → follow_ups.created_by
- users.id → stock_movements.created_by
- users.id → challans.created_by

## customers

- customers.id → follow_ups.customer_id
- customers.id → challans.customer_id

## products

- products.id → stock_movements.product_id
- products.id → challan_items.product_id

## challans

- challans.id → challan_items.challan_id

---

# Cardinality

users (1) ──────── (N) follow_ups

users (1) ──────── (N) stock_movements

users (1) ──────── (N) challans

customers (1) ──── (N) follow_ups

customers (1) ──── (N) challans

products (1) ───── (N) stock_movements

products (1) ───── (N) challan_items

challans (1) ───── (N) challan_items

---

# Inventory Business Rules

## Draft Challan

- No stock deduction
- No stock movement entry

## Confirmed Challan

For each challan item:

1. Verify current stock
2. Reject if insufficient stock
3. Deduct stock
4. Create OUT stock movement
5. Update challan status

All operations should execute inside a database transaction.

---

# Suggested Prisma Models

model User

model Customer

model FollowUp

model Product

model StockMovement

model Challan

model ChallanItem

Each model uses UUID primary keys and Prisma relations.

---

# Query Optimization

## Frequently Queried Fields

### Customers

- customer_name
- mobile
- status

### Products

- sku
- name
- category

### Challans

- challan_number
- customer_id
- status
- created_at

Indexes should be added on these fields to improve search and filtering performance.

---

# Data Integrity Constraints

## Customers

- customer_name required
- mobile required

## Products

- unique SKU
- non-negative stock
- non-negative price

## Challans

- unique challan number
- valid customer reference
- valid user reference

## Challan Items

- quantity > 0
- immutable product snapshot fields

---

# Soft Delete Strategy

For the MVP, records are permanently deleted.

Future enhancement:

Add

- deleted_at TIMESTAMP NULL

to support soft deletion and record recovery.

---

# Future Schema Extensions

## purchase_orders

For supplier procurement.

## invoices

For billing and accounts.

## warehouses

For multi-location inventory.

## product_images

For image uploads.

## audit_logs

For change tracking and compliance.

---

# Summary

The schema supports:

- Role-based authentication
- Customer CRM
- Follow-up tracking
- Product management
- Inventory management
- Stock movement auditing
- Sales challan generation
- Product snapshot preservation
- Inventory validation
- Transaction-safe stock deduction

This schema is optimized for a PostgreSQL + Prisma implementation and satisfies all core requirements of the Mini ERP + CRM Operations Portal assignment.