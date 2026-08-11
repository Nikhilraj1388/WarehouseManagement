import prisma from '../prisma/client';
import { PrismaClient } from '@prisma/client';

export class CustomerService {
  static async getCustomers(params: { search?: string, status?: string, page: number, limit: number }) {
    const { search, status, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { customerName: { contains: search } },
        { mobile: { contains: search } },
        { email: { contains: search } }
      ];
    }
    if (status) {
      where.status = status as string;
    }

    const [data, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.customer.count({ where })
    ]);

    return { data, total, page, totalPages: Math.ceil(total / limit) };
  }

  static async createCustomer(data: any) {
    return prisma.customer.create({ data });
  }

  static async getCustomerById(id: string) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        followUps: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' }
        },
        challans: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!customer) throw new Error('Customer not found');
    return customer;
  }

  static async updateCustomer(id: string, data: any) {
    return prisma.customer.update({
      where: { id },
      data
    });
  }

  static async deleteCustomer(id: string) {
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) throw new Error('Customer not found');
    return prisma.customer.delete({ where: { id } });
  }

  static async addFollowUp(customerId: string, userId: string, data: { note: string, nextFollowUpDate?: string }) {
    return prisma.$transaction(async (tx) => {
      const followUp = await tx.followUp.create({
        data: {
          customerId,
          note: data.note,
          createdBy: userId
        }
      });

      if (data.nextFollowUpDate) {
        await tx.customer.update({
          where: { id: customerId },
          data: { followUpDate: new Date(data.nextFollowUpDate) }
        });
      }

      return followUp;
    });
  }
}
