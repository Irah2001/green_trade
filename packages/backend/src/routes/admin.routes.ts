import { Router } from 'express';
import { deleteExpiredAnonymizedAccounts } from '../utils/rgpd.utils.js';
import { authenticate, isAdmin } from '../middlewares/auth.middleware.js';
import { getAllOrders } from '../controllers/orderController.js';

const router: Router = Router();

/**
 * @route GET /api/admin/orders
 * @desc Récupérer toutes les commandes (admin uniquement)
 * @access Admin seulement
 */
router.get('/orders', authenticate, isAdmin, getAllOrders);

/**
 * @route POST /api/admin/rgpd/cleanup
 * @desc Supprimer les comptes anonymisés expirés (cron job)
 * @access Admin seulement
 */
router.post('/rgpd/cleanup', authenticate, async (req, res) => {
  try {
    const userId = (req as any).userId;
    
    // Vérifier que l'utilisateur est admin
    const user = await (await import('../prismaClient.js')).default.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Accès refusé. Admin requis." });
    }

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

export default router;
