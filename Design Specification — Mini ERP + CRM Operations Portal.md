# Design Specification — Mini ERP + CRM Operations Portal

## Purpose

This document defines the visual design system, layout structure, UI components, navigation, color palette, typography, spacing, responsiveness, and user experience guidelines for the Mini ERP + CRM Operations Portal.

The design is inspired by a modern **admin dashboard interface** similar to the provided reference image and focuses on simplicity, clarity, and fast implementation within the 48-hour project timeline.

---

# Design Goals

- Clean and professional appearance
- Easy navigation
- Minimal learning curve for employees
- Fast implementation using Tailwind CSS
- Responsive for desktop and tablet devices
- Consistent UI across all modules

---

# Design Style

The application follows a **Modern Dashboard UI** pattern.

Characteristics:

- Dark left sidebar
- Light content area
- Rounded cards
- Soft shadows
- Minimal borders
- Blue as the primary accent color
- Large data tables
- Compact action buttons
- Clear visual hierarchy

---

# Color Palette

## Primary

- Blue: `#2563EB`

Used for:

- Primary buttons
- Active navigation
- Links
- Focus states

## Sidebar

- Dark Navy: `#0F172A`
- Hover: `#1E293B`
- Active: `#2563EB`

## Background

- App Background: `#F8FAFC`
- Card Background: `#FFFFFF`

## Text

- Primary: `#111827`
- Secondary: `#6B7280`
- Muted: `#9CA3AF`

## Status Colors

### Success

- Green: `#16A34A`
- Background: `#DCFCE7`

### Warning

- Orange: `#F59E0B`
- Background: `#FEF3C7`

### Error

- Red: `#DC2626`
- Background: `#FEE2E2`

### Info

- Blue: `#2563EB`
- Background: `#DBEAFE`

---

# Typography

## Font Family

Inter

Fallback:

sans-serif

## Headings

### H1

- Size: 32px
- Weight: 700

### H2

- Size: 24px
- Weight: 600

### H3

- Size: 20px
- Weight: 600

## Body

- Size: 14–16px
- Weight: 400

## Table Text

- Size: 14px

---

# Layout Structure

The application uses a **two-column dashboard layout**.

Sidebar (280px)

↓

Top Navigation

↓

Main Content Area

---

# Sidebar Design

## Width

280px

## Background

Dark navy (`#0F172A`)

## Logo Area

Top section:

Mini ERP

Icon + Product Name

## Navigation Items

- Dashboard
- Customers
- Products
- Inventory
- Sales Challans
- Reports
- Users
- Settings

## Active State

- Blue background
- White text
- Rounded corners

## Hover State

- Slightly lighter navy background

## Logout

Positioned at the bottom of the sidebar.

---

# Top Navigation Bar

## Height

72px

## Elements

Left:

- Hamburger menu
- Page title

Center:

- Global search input

Right:

- Notification icon
- User avatar
- User name
- Role dropdown

Background:

White

Border:

Bottom border `#E5E7EB`

---

# Dashboard Design

## Welcome Section

Title:

Dashboard

Subtitle:

Business activity overview

---

## KPI Cards

Grid:

4 columns

Cards:

- Total Customers
- Total Products
- Low Stock Items
- Total Challans

### Card Structure

Icon

Metric

Trend

Rounded corners

Soft shadow

Padding: 24px

Height: 140px

---

# Dashboard Content Layout

## Row 1

Recent Challans | Upcoming Follow-ups

## Row 2

Low Stock Products | Quick Actions

Cards use equal height where possible.

---

# Table Design

Used in:

- Customers
- Products
- Challans
- Inventory

## Table Style

- White background
- Rounded corners
- Light borders
- Row hover highlight
- Compact spacing

## Header

- Light gray background
- Bold text
- Sticky when scrolling

## Row Height

56px

---

# Status Badges

## Confirmed

Green

## Draft

Gray

## Cancelled

Red

## Lead

Blue

## Active

Green

## Inactive

Gray

Badges use rounded pill shapes.

---

# Quick Action Panel

Vertical action buttons.

Buttons:

- Add Customer
- Add Product
- Create Challan
- Update Stock

Button Style:

- Full width
- Rounded
- Colored backgrounds
- White icons
- White text

---

# Customer Page

## Top Section

Search Bar

Status Filter

Customer Type Filter

Add Customer Button

## Main Section

Customer table

Columns:

- Name
- Business
- Mobile
- Type
- Status
- Follow-up Date
- Actions

---

# Customer Detail Page

## Layout

Two-column card layout.

### Left

Customer information

### Right

Follow-up timeline

Sections:

- Contact Info
- Business Info
- Notes
- Follow-up History

---

# Product Page

## Top Section

Search

Category Filter

Add Product Button

## Table

Columns:

- Product
- SKU
- Category
- Unit Price
- Current Stock
- Warehouse
- Actions

Low stock values displayed in red.

---

# Inventory Page

Display stock movement history.

Columns:

- Product
- Movement Type
- Quantity
- Reason
- User
- Timestamp

Movement badges:

- IN (Green)
- OUT (Orange)

---

# Sales Challan Page

## Layout

Single large card.

Sections:

### Customer Selection

Dropdown

### Product Selection

Searchable product dropdown

### Challan Items

Table:

- Product
- Price
- Quantity
- Total

### Summary

- Total Quantity
- Total Amount

### Actions

- Save Draft
- Confirm Challan

---

# Forms

## Style

- White background
- Rounded inputs
- Gray borders
- Blue focus ring

## Field Height

44px

## Spacing

16px between fields

## Validation

Error message below field

Red border on invalid input

---

# Buttons

## Primary

Blue background

White text

## Secondary

White background

Gray border

## Success

Green background

## Warning

Orange background

## Danger

Red background

Standard height:

44px

Border radius:

10px

---

# Icons

Recommended:

Lucide React

Use simple outline icons.

Examples:

- Home
- Users
- Package
- Warehouse
- File
- Settings
- Bell
- Search

---

# Responsive Design

## Desktop (1200px+)

- Full sidebar
- Four KPI cards
- Two-column dashboard

## Tablet (768px–1199px)

- Collapsible sidebar
- Two KPI cards per row
- Stacked content cards

## Mobile (<768px)

- Sidebar becomes drawer
- Single-column layout
- Tables become horizontally scrollable
- Action buttons become full width

---

# Spacing System

Use an 8px spacing scale.

4px

8px

16px

24px

32px

40px

48px

Consistent spacing should be maintained across all screens.

---

# Shadows

Cards:

0 1px 3px rgba(0,0,0,0.08)

Modals:

0 10px 25px rgba(0,0,0,0.15)

Buttons:

Minimal shadow

---

# Border Radius

Cards:

16px

Inputs:

10px

Buttons:

10px

Badges:

999px

---

# User Experience Guidelines

- Keep navigation visible at all times
- Minimize clicks for common actions
- Highlight low stock clearly
- Show confirmation before destructive actions
- Provide success and error notifications
- Preserve form state during validation errors
- Use loading indicators for API requests

---

# Screen List

- Login
- Dashboard
- Customers
- Customer Detail
- Products
- Inventory
- Sales Challans
- Challan Detail
- Reports
- Settings

---

# Design Summary

The interface uses a **dark sidebar + light dashboard layout**, blue accent colors, rounded cards, clean tables, and simple forms to create a professional ERP dashboard that can be implemented quickly using React and Tailwind CSS while matching the reference design provided.