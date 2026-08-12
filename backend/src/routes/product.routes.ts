import { Router } from 'express';
import { getProducts, createProduct, getProductById, updateProduct, deleteProduct, getProductMovements, updateStock } from '../controllers/product.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';

const router = Router();

router.use(authenticate);

// Read access for all roles
router.get('/', requireRole(['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS']), getProducts);
router.get('/:id', requireRole(['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS']), getProductById);
router.get('/:id/movements', requireRole(['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS']), getProductMovements);

// Write and Stock access for ADMIN and WAREHOUSE
router.post('/', requireRole(['ADMIN', 'WAREHOUSE']), createProduct);
router.put('/:id', requireRole(['ADMIN', 'WAREHOUSE']), updateProduct);
router.delete('/:id', requireRole(['ADMIN', 'WAREHOUSE']), deleteProduct);
router.post('/:id/stock', requireRole(['ADMIN', 'WAREHOUSE']), updateStock);

export default router;
