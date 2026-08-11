import prisma from '../prisma/client';
import { PrismaClient } from '@prisma/client';

export class DashboardService {
  static async getStats() {
    const lowStockProductsResult = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count FROM "Product" WHERE "currentStock" <= "minimumStock"
    `;
    const lowStockProducts = Number(lowStockProductsResult[0]?.count || 0);

    const [
      totalCustomers,
      activeCustomers,
      totalProducts,
      totalChallans,
      recentChallans,
      upcomingFollowUps
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.count({ where: { status: 'ACTIVE' } }),
      prisma.product.count(),
      prisma.challan.count(),
      prisma.challan.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { customer: { select: { customerName: true } } }
      }),
      prisma.customer.findMany({
        where: {
          followUpDate: {
            gte: new Date(),
          }
        },
        take: 5,
        orderBy: { followUpDate: 'asc' },
        select: { id: true, customerName: true, followUpDate: true }
      })
    ]);

    return {
      totalCustomers,
      activeCustomers,
      totalProducts,
      lowStockProducts,
      totalChallans,
      recentChallans,
      upcomingFollowUps
    };
  }
}
