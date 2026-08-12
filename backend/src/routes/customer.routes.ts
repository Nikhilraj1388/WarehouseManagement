import { Router } from 'express';
import { getCustomers, createCustomer, getCustomerById, updateCustomer, deleteCustomer, addFollowUp } from '../controllers/customer.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';

const router = Router();

router.use(authenticate);

// Read access for all roles
router.get('/', requireRole(['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS']), getCustomers);
router.get('/:id', requireRole(['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS']), getCustomerById);

// Write access for ADMIN and SALES
router.post('/', requireRole(['ADMIN', 'SALES']), createCustomer);
router.put('/:id', requireRole(['ADMIN', 'SALES']), updateCustomer);
router.delete('/:id', requireRole(['ADMIN', 'SALES']), deleteCustomer);
router.post('/:id/followups', requireRole(['ADMIN', 'SALES']), addFollowUp);

export default router;
