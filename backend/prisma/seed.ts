import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Create users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const salesPassword = await bcrypt.hash('sales123', 10);
  const warehousePassword = await bcrypt.hash('warehouse123', 10);
  const accountsPassword = await bcrypt.hash('accounts123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@erp.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@erp.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  const sales = await prisma.user.upsert({
    where: { email: 'sales@erp.com' },
    update: {},
    create: {
      name: 'Sales User',
      email: 'sales@erp.com',
      passwordHash: salesPassword,
      role: 'SALES',
    },
  });

  const warehouse = await prisma.user.upsert({
    where: { email: 'warehouse@erp.com' },
    update: {},
    create: {
      name: 'Warehouse User',
      email: 'warehouse@erp.com',
      passwordHash: warehousePassword,
      role: 'WAREHOUSE',
    },
  });

  const accounts = await prisma.user.upsert({
    where: { email: 'accounts@erp.com' },
    update: {},
    create: {
      name: 'Accounts User',
      email: 'accounts@erp.com',
      passwordHash: accountsPassword,
      role: 'ACCOUNTS',
    },
  });

  console.log('Users seeded:', { admin: admin.email, sales: sales.email, warehouse: warehouse.email, accounts: accounts.email });

  // Create sample customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        customerName: 'Acme Corp',
        mobile: '9876543210',
        email: 'contact@acme.com',
        businessName: 'Acme Corporation Pvt Ltd',
        customerType: 'WHOLESALE',
        status: 'ACTIVE',
        address: '123 Business Park, Mumbai',
        notes: 'Premium wholesale buyer',
      }
    }),
    prisma.customer.create({
      data: {
        customerName: 'Raj Electronics',
        mobile: '9876543211',
        email: 'raj@electronics.com',
        businessName: 'Raj Electronics',
        gstNumber: '27AABCU9603R1ZM',
        customerType: 'DISTRIBUTOR',
        status: 'ACTIVE',
        address: '456 Market Road, Delhi',
        followUpDate: new Date('2026-08-20'),
        notes: 'Interested in bulk laptop orders',
      }
    }),
    prisma.customer.create({
      data: {
        customerName: 'Priya Sharma',
        mobile: '9876543212',
        email: 'priya@email.com',
        customerType: 'RETAIL',
        status: 'LEAD',
        address: '789 Residential Colony, Bangalore',
        followUpDate: new Date('2026-08-15'),
        notes: 'Enquiry about office equipment',
      }
    }),
    prisma.customer.create({
      data: {
        customerName: 'TechMart Solutions',
        mobile: '9876543213',
        email: 'info@techmart.com',
        businessName: 'TechMart Solutions LLP',
        gstNumber: '29GGGGG1314R9Z6',
        customerType: 'WHOLESALE',
        status: 'ACTIVE',
        address: '101 Tech Hub, Hyderabad',
      }
    }),
    prisma.customer.create({
      data: {
        customerName: 'Vikram Trading',
        mobile: '9876543214',
        email: 'vikram@trading.in',
        businessName: 'Vikram Trading Co',
        customerType: 'DISTRIBUTOR',
        status: 'INACTIVE',
        address: '222 Industrial Area, Pune',
        notes: 'Previously active, paused orders',
      }
    }),
  ]);

  console.log(`${customers.length} customers seeded.`);

  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Laptop X1 Pro',
        sku: 'LPT-X1-001',
        category: 'Laptops',
        unitPrice: 52000,
        currentStock: 100,
        minimumStock: 10,
        warehouseLocation: 'Rack A-1',
      }
    }),
    prisma.product.create({
      data: {
        name: 'Wireless Mouse M200',
        sku: 'MSE-M200-002',
        category: 'Accessories',
        unitPrice: 800,
        currentStock: 500,
        minimumStock: 50,
        warehouseLocation: 'Rack B-3',
      }
    }),
    prisma.product.create({
      data: {
        name: 'Mechanical Keyboard K500',
        sku: 'KBD-K500-003',
        category: 'Accessories',
        unitPrice: 3500,
        currentStock: 200,
        minimumStock: 20,
        warehouseLocation: 'Rack B-4',
      }
    }),
    prisma.product.create({
      data: {
        name: 'USB-C Hub 7-in-1',
        sku: 'HUB-UC7-004',
        category: 'Accessories',
        unitPrice: 1200,
        currentStock: 8,
        minimumStock: 15,
        warehouseLocation: 'Rack C-1',
      }
    }),
    prisma.product.create({
      data: {
        name: '27" Monitor UltraWide',
        sku: 'MON-27UW-005',
        category: 'Monitors',
        unitPrice: 28000,
        currentStock: 45,
        minimumStock: 5,
        warehouseLocation: 'Rack D-2',
      }
    }),
    prisma.product.create({
      data: {
        name: 'Webcam HD 1080p',
        sku: 'CAM-HD10-006',
        category: 'Accessories',
        unitPrice: 2200,
        currentStock: 3,
        minimumStock: 10,
        warehouseLocation: 'Rack B-5',
      }
    }),
  ]);

  console.log(`${products.length} products seeded.`);

  // Create sample stock movements for product history
  await prisma.stockMovement.createMany({
    data: [
      { productId: products[0].id, quantity: 100, movementType: 'IN', reason: 'Initial stock', createdBy: warehouse.id },
      { productId: products[1].id, quantity: 500, movementType: 'IN', reason: 'Initial stock', createdBy: warehouse.id },
      { productId: products[2].id, quantity: 200, movementType: 'IN', reason: 'Initial stock', createdBy: warehouse.id },
      { productId: products[3].id, quantity: 30, movementType: 'IN', reason: 'Initial stock', createdBy: warehouse.id },
      { productId: products[3].id, quantity: 22, movementType: 'OUT', reason: 'Bulk order fulfillment', createdBy: warehouse.id },
      { productId: products[4].id, quantity: 45, movementType: 'IN', reason: 'Initial stock', createdBy: warehouse.id },
      { productId: products[5].id, quantity: 15, movementType: 'IN', reason: 'Initial stock', createdBy: warehouse.id },
      { productId: products[5].id, quantity: 12, movementType: 'OUT', reason: 'Retailer dispatch', createdBy: warehouse.id },
    ]
  });

  console.log('Stock movements seeded.');

  // Create a sample draft challan
  const challan = await prisma.challan.create({
    data: {
      challanNumber: `CH-${new Date().getFullYear()}-0001`,
      customerId: customers[0].id,
      totalQuantity: 7,
      status: 'DRAFT',
      createdBy: sales.id,
      items: {
        create: [
          { productId: products[0].id, productName: products[0].name, sku: products[0].sku, unitPrice: products[0].unitPrice, quantity: 2 },
          { productId: products[1].id, productName: products[1].name, sku: products[1].sku, unitPrice: products[1].unitPrice, quantity: 5 },
        ]
      }
    }
  });

  console.log('Sample challan created:', challan.challanNumber);

  // Create follow-ups
  await prisma.followUp.createMany({
    data: [
      { customerId: customers[0].id, note: 'Initial call - interested in bulk laptop purchase', createdBy: sales.id },
      { customerId: customers[0].id, note: 'Sent quotation for 50 laptops', createdBy: sales.id },
      { customerId: customers[1].id, note: 'Meeting scheduled for next week', createdBy: sales.id },
      { customerId: customers[2].id, note: 'Enquired about office setup packages', createdBy: sales.id },
    ]
  });

  console.log('Follow-ups seeded.');
  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
