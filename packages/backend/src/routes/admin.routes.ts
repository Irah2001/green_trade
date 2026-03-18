import { Router } from 'express';
import { deleteExpiredAnonymizedAccounts } from '../utils/rgpd.utils.js';
import { authenticate, isAdmin } from '../middlewares/auth.middleware.js';
import { getAllOrders } from '../controllers/orderController.js';
import { adminUpdateUser, adminDeleteUser } from '../controllers/adminController.js';

const router: Router = Router();

/**
 * @route GET /api/admin/orders
 * @desc Récupérer toutes les commandes (admin uniquement)
 * @access Admin seulement
 */
router.get('/orders', authenticate, isAdmin, getAllOrders);

/**
 * @route POST /api/admin/rgpd/cleanup
 * @desc Delete expired anonymized accounts (cron job)
 * @access Admin only
 */
router.post('/rgpd/cleanup', authenticate, isAdmin, async (req, res) => {
  try {
    const daysToKeep = Number(req.body.daysToKeep) || 30;
    const deletedCount = await deleteExpiredAnonymizedAccounts(daysToKeep);

    res.status(200).json({
      message: `Nettoyage RGPD terminé.`,
      deletedCount,
      daysToKeep
    });
  } catch (error) {
    console.error('[ADMIN] Erreur lors du nettoyage RGPD:', error);
    res.status(500).json({ message: "Erreur lors du nettoyage RGPD." });
  }
});

/**
 * @route PATCH /api/admin/users/:id
 * @desc Admin: update any user
 * @access Admin only
 */
router.patch('/users/:id', authenticate, isAdmin, adminUpdateUser);

/**
 * @route DELETE /api/admin/users/:id
 * @desc Admin: delete a user (GDPR anonymization)
 * @access Admin only
 */
router.delete('/users/:id', authenticate, isAdmin, adminDeleteUser);

export default router;
