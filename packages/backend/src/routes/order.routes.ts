import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById, updateOrderStatus } from '../controllers/orderController.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router: Router = Router();

// Toutes les routes nécessitent une authentification
router.post('/', authenticate, createOrder);
router.get('/', authenticate, getMyOrders);
router.get('/:id', authenticate, getOrderById);
router.patch('/:id/status', authenticate, updateOrderStatus);
export default router;
