import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().optional(),
  unitPrice: z.number().min(0, 'Unit price must be >= 0'),
  currentStock: z.number().int().min(0, 'Stock must be >= 0').optional(),
  minimumStock: z.number().int().min(0).optional(),
  warehouseLocation: z.string().optional()
});

export const updateProductSchema = createProductSchema.partial();

export const stockUpdateSchema = z.object({
  quantity: z.number().int().positive('Quantity must be greater than 0'),
  type: z.enum(['IN', 'OUT']).optional(),
  movementType: z.enum(['IN', 'OUT']).optional(),
  reason: z.string().optional()
}).refine(data => data.type || data.movementType, {
  message: "Invalid option: expected type or movementType to be 'IN' or 'OUT'",
  path: ['movementType']
}).transform(data => ({
  quantity: data.quantity,
  type: (data.type || data.movementType!) as 'IN' | 'OUT',
  reason: data.reason
}));
