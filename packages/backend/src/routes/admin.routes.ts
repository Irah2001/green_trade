import { Router } from 'express';
import { deleteExpiredAnonymizedAccounts } from '../utils/rgpd.utils.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { 
  getStats, 
  getAllUsers, 
  getAllOrders, 
  banUser,
  getAllProducts 
} from '../controllers/adminController.js';

const router: Router = Router();

// Toutes les routes admin nécessitent l'authentification
router.use(authenticate);

/**
 * @route GET /api/admin/stats
 * @desc Récupérer les statistiques globales
 * @access Admin uniquement
 */
router.get('/stats', getStats);

/**
 * @route GET /api/admin/users
 * @desc Récupérer tous les utilisateurs avec pagination et filtres
 * @access Admin uniquement
 */
router.get('/users', getAllUsers);

/**
 * @route GET /api/admin/orders
 * @desc Récupérer toutes les commandes avec pagination et filtres
 * @access Admin uniquement
 */
router.get('/orders', getAllOrders);

/**
 * @route GET /api/admin/products
 * @desc Récupérer tous les produits (y compris inactifs)
 * @access Admin uniquement
 */
router.get('/products', getAllProducts);

/**
 * @route PATCH /api/admin/users/:id/ban
 * @desc Bloquer ou débloquer un utilisateur
 * @access Admin uniquement
 */
router.patch('/users/:id/ban', banUser);

/**
 * @route POST /api/admin/rgpd/cleanup
 * @desc Supprimer les comptes anonymisés expirés (cron job)
 * @access Admin seulement
 */
router.post('/rgpd/cleanup', async (req, res) => {
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
