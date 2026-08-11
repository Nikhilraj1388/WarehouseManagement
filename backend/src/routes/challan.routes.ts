import { Router } from 'express';
import { getChallans, createChallan, getChallanById, updateChallanStatus } from '../controllers/challan.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';

const router = Router();

router.use(authenticate);

// List and Detail access for ADMIN, SALES, ACCOUNTS
router.get('/', requireRole(['ADMIN', 'SALES', 'ACCOUNTS']), getChallans);
router.get('/:id', requireRole(['ADMIN', 'SALES', 'ACCOUNTS']), getChallanById);

// Create and Status update access for ADMIN, SALES
router.post('/', requireRole(['ADMIN', 'SALES']), createChallan);
router.put('/:id/status', requireRole(['ADMIN', 'SALES']), updateChallanStatus);

export default router;
