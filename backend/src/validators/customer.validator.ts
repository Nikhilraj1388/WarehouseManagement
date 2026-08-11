import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

export const createCustomerSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  mobile: z.string().min(1, 'Mobile is required'),
  email: z.string().email().optional().or(z.literal('')),
  businessName: z.string().optional(),
  gstNumber: z.string().optional(),
  customerType: z.enum(['RETAIL', 'WHOLESALE', 'DISTRIBUTOR']),
  address: z.string().optional(),
  status: z.enum(['LEAD', 'ACTIVE', 'INACTIVE']).optional()
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const followUpSchema = z.object({
  note: z.string().min(1, 'Note is required'),
  nextFollowUpDate: z.string().datetime().optional()
});
