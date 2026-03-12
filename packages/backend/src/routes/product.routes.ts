import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  getProducts,
  getProductById,
  getProductsBySeller,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = Router();

router.get('/', getProducts);
router.get('/seller/:sellerId', getProductsBySeller);
router.get('/:id', getProductById);
router.post('/', authenticate, createProduct);
router.put('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

export default router;
