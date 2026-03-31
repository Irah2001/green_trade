import { Router } from 'express';
import { createCheckoutSession } from '../controllers/checkoutController.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router: Router = Router();

router.use(authenticate);

router.post('/create-session', createCheckoutSession);

export default router;
