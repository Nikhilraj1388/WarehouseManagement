import { Router } from 'express';
import { getCustomers, createCustomer, getCustomerById, updateCustomer, deleteCustomer, addFollowUp } from '../controllers/customer.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';

const router = Router();

router.use(authenticate);
router.use(requireRole(['ADMIN', 'SALES']));

router.get('/', getCustomers);
router.post('/', createCustomer);
router.get('/:id', getCustomerById);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);
router.post('/:id/followups', addFollowUp);

export default router;
