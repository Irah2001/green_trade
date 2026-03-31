import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItemQuantity,
  syncCart,
} from '../controllers/cartController.js';

const router: Router = Router();

router.use(authenticate);

router.get('/', getCart);
router.post('/items', addCartItem);
router.post('/sync', syncCart);
router.put('/items/:productId', updateCartItemQuantity);
router.delete('/items/:productId', removeCartItem);
router.delete('/', clearCart);

export default router;
