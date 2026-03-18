import { Router } from 'express';
import { createCheckoutSession, confirmCheckoutSession } from '../controllers/checkoutController.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router: Router = Router();

router.use(authenticate);

router.post('/create-session', createCheckoutSession);
router.post('/confirm-session', confirmCheckoutSession);

export default router;
