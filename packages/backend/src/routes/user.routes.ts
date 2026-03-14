import { Router } from 'express';
import { getProfile, updateProfile, deleteAccount, getUserById } from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router: Router = Router();

/**
 * @route GET /api/users/me
 * @desc Récupérer le profil de l'utilisateur connecté
 * @access Privé (authentification requise)
 */
router.get('/me', authenticate, getProfile);

/**
 * @route PATCH /api/users/me
 * @desc Modifier le profil de l'utilisateur connecté
 * @access Privé (authentification requise)
 */
router.patch('/me', authenticate, updateProfile);

/**
 * @route DELETE /api/users/me
 * @desc Supprimer le compte de l'utilisateur connecté
 * @access Privé (authentification requise)
 */
router.delete('/me', authenticate, deleteAccount);

/**
 * @route GET /api/users/:id
 * @desc Récupérer le profil public d'un utilisateur (vendeur)
 * @access Public
 */
router.get('/:id', getUserById);

export default router;
