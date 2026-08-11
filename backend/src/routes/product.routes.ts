import { Router } from 'express';
import { getProducts, createProduct, getProductById, updateProduct, getProductMovements, updateStock } from '../controllers/product.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';

const router = Router();

router.use(authenticate);
router.use(requireRole(['ADMIN', 'WAREHOUSE']));

router.get('/', getProducts);
router.post('/', createProduct);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.get('/:id/movements', getProductMovements);
router.post('/:id/stock', updateStock);

export default router;
