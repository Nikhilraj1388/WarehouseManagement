import prisma from '../prisma/client';
import { PrismaClient } from '@prisma/client';

export class ChallanService {
  static async getChallans(params: { search?: string, status?: string, page: number, limit: number }) {
    const { search, status, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { challanNumber: { contains: search } },
        { customer: { customerName: { contains: search } } }
      ];
    }
    if (status) {
      where.status = status as string;
    }

    const [data, total] = await Promise.all([
      prisma.challan.findMany({
        where,
        skip,
        take: limit,
        include: { customer: { select: { customerName: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.challan.count({ where })
    ]);

    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }

  static async createChallan(data: any, userId: string) {
    return prisma.$transaction(async (tx) => {
      // Generate challan number
      const count = await tx.challan.count();
      const challanNumber = `CH-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
      const status = data.status || 'DRAFT';
      
      let totalQty = 0;
      const challanItems = [];

      for (const item of data.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new Error(`Product not found`);

        if (status === 'CONFIRMED') {
          if (product.currentStock < item.quantity) {
            throw new Error(`Insufficient stock for product ${product.name}. Required: ${item.quantity}, Available: ${product.currentStock}`);
          }

          await tx.product.update({
            where: { id: product.id },
            data: { currentStock: product.currentStock - item.quantity }
          });

          await tx.stockMovement.create({
            data: {
              productId: product.id,
              quantity: item.quantity,
              movementType: 'OUT',
              reason: `Challan ${challanNumber}`,
              createdBy: userId
            }
          });
        }

        challanItems.push({
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          unitPrice: product.unitPrice,
          quantity: item.quantity
        });
        totalQty += item.quantity;
      }

      return tx.challan.create({
        data: {
          challanNumber,
          customerId: data.customerId,
          status,
          createdBy: userId,
          totalQuantity: totalQty,
          items: {
            create: challanItems
          }
        },
        include: { items: true }
      });
    });
  }

  static async getChallanById(id: string) {
    const challan = await prisma.challan.findUnique({
      where: { id },
      include: {
        customer: true,
        items: true,
        user: { select: { name: true } }
      }
    });
    if (!challan) throw new Error('Challan not found');
    return challan;
  }

  static async updateStatus(id: string, status: string) {
    return prisma.challan.update({
      where: { id },
      data: { status }
    });
  }

  static async confirmChallan(challanId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const challan = await tx.challan.findUnique({
        where: { id: challanId },
        include: { items: true }
      });

      if (!challan) throw new Error('Challan not found');
      if (challan.status !== 'DRAFT') throw new Error('Only DRAFT challans can be confirmed');

      for (const item of challan.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new Error(`Product ${item.productName} not found`);
        if (product.currentStock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }

        await tx.product.update({
          where: { id: product.id },
          data: { currentStock: product.currentStock - item.quantity }
        });

        await tx.stockMovement.create({
          data: {
            productId: product.id,
            quantity: item.quantity,
            movementType: 'OUT',
            reason: `Challan ${challan.challanNumber}`,
            createdBy: userId
          }
        });
      }

      return tx.challan.update({
        where: { id: challanId },
        data: { status: 'CONFIRMED' }
      });
    });
  }
}
