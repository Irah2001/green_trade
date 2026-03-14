import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById, updateOrderStatus, shipOrder } from '../controllers/orderController.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router: Router = Router();

// Toutes les routes nécessitent une authentification
router.post('/', authenticate, createOrder);
router.get('/', authenticate, getMyOrders);
router.get('/:id', authenticate, getOrderById);
router.patch('/:id/status', authenticate, updateOrderStatus);
router.post('/:id/ship', authenticate, shipOrder);

export default router;
