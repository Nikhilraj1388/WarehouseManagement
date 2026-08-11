import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

export const challanItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive()
});

export const createChallanSchema = z.object({
  customerId: z.string(),
  items: z.array(challanItemSchema).min(1, 'At least one item is required')
});

export const updateChallanStatusSchema = z.object({
  status: z.enum(['DRAFT', 'CONFIRMED', 'CANCELLED'])
});
