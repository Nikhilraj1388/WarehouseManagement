import prisma from '../prisma/client';
import { PrismaClient } from '@prisma/client';

export class ProductService {
  static async getProducts(params: { search?: string, category?: string, page: number, limit: number }) {
    const { search, category, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } }
      ];
    }
    if (category) {
      where.category = category;
    }

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }

  static async createProduct(data: any, userId: string) {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.create({ data });

      if (product.currentStock > 0) {
        await tx.stockMovement.create({
          data: {
            productId: product.id,
            quantity: product.currentStock,
            movementType: 'IN',
            reason: 'Initial stock',
            createdBy: userId
          }
        });
      }

      return product;
    });
  }

  static async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id }
    });
    if (!product) throw new Error('Product not found');
    return product;
  }

  static async updateProduct(id: string, data: any) {
    // Current stock shouldn't be updated directly without movement log
    const { currentStock, ...updateData } = data;
    return prisma.product.update({
      where: { id },
      data: updateData
    });
  }

  static async getProductMovements(id: string) {
    return prisma.stockMovement.findMany({
      where: { productId: id },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async updateStock(productId: string, userId: string, data: { quantity: number, type: 'IN' | 'OUT', reason?: string }) {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) throw new Error('Product not found');

      if (data.type === 'OUT' && product.currentStock < data.quantity) {
        throw new Error('Insufficient stock');
      }

      const movement = await tx.stockMovement.create({
        data: {
          productId,
          quantity: data.quantity,
          movementType: data.type,
          reason: data.reason,
          createdBy: userId
        }
      });

      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: {
          currentStock: data.type === 'IN' 
            ? product.currentStock + data.quantity 
            : product.currentStock - data.quantity
        }
      });

      return updatedProduct;
    });
  }
}
