import { Response } from 'express';
import { USER_ROLES } from '@greentrade/shared';
import prisma from '../prismaClient.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { auditLog } from '../utils/audit.utils.js';
import { anonymizeUser } from '../utils/rgpd.utils.js';

/**
 * @route GET /api/admin/stats
 * @desc Récupérer les statistiques globales de la plateforme
 * @access Admin uniquement
 */
export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId as string;

    // Vérifier que l'utilisateur est admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Accès refusé. Admin requis." });
    }

    // Récupérer les statistiques
    const [totalUsers, totalProducts, totalOrders, transactions] = await Promise.all([
      prisma.user.count({ where: { email: { not: { startsWith: 'deleted-' } } } }),
      prisma.product.count({ where: { status: 'active' } }),
      prisma.transaction.count(),
      prisma.transaction.findMany({
        select: { amount: true, status: true, createdAt: true }
      })
    ]);

    // Calculer le revenu total
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

    // Statistiques par statut
    const pendingOrders = transactions.filter(t => t.status === 'pending').length;
    const paidOrders = transactions.filter(t => t.status === 'paid').length;
    const shippedOrders = transactions.filter(t => t.status === 'shipped').length;
    const deliveredOrders = transactions.filter(t => t.status === 'delivered').length;

    // Commandes récentes (5 dernières avec détails)
    const recentOrdersData = await prisma.transaction.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        amount: true,
        status: true,
        createdAt: true,
        buyer: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        product: {
          select: {
            title: true
          }
        }
      }
    });

    // Formater les commandes récentes
    const recentOrders = recentOrdersData.map(order => ({
      id: order.id,
      totalPrice: order.amount,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      buyer: {
        firstName: order.buyer.firstName,
        lastName: order.buyer.lastName
      },
      product: {
        title: order.product.title
      }
    }));

    res.status(200).json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      ordersByStatus: {
        pending: pendingOrders,
        paid: paidOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders
      },
      recentOrders
    });
  } catch (error) {
    console.error('[ERREUR] Récupération statistiques admin:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des statistiques." });
  }
};

/**
 * @route GET /api/admin/users
 * @desc Récupérer la liste de tous les utilisateurs
 * @access Admin uniquement
 */
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId as string;

    // Vérifier que l'utilisateur est admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Accès refusé. Admin requis." });
    }

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Filtres optionnels
    const role = req.query.role as string | undefined;
    const search = req.query.search as string | undefined;

    const where: any = {
      email: { not: { startsWith: 'deleted-' } } // Exclure les comptes anonymisés
    };

    if (role && role !== 'all') {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          city: true,
          rating: true,
          createdAt: true,
          profile: true,
          isBanned: true,
          banReason: true,
          bannedAt: true
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.status(200).json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('[ERREUR] Récupération utilisateurs admin:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs." });
  }
};

/**
 * @route GET /api/admin/orders
 * @desc Récupérer la liste de toutes les commandes
 * @access Admin uniquement
 */
export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId as string;

    // Vérifier que l'utilisateur est admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Accès refusé. Admin requis." });
    }

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Filtres optionnels
    const status = req.query.status as string | undefined;

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          buyer: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          },
          seller: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          },
          product: {
            select: {
              id: true,
              title: true,
              price: true,
              images: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.transaction.count({ where })
    ]);

    res.status(200).json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('[ERREUR] Récupération commandes admin:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des commandes." });
  }
};

/**
 * @route PATCH /api/admin/users/:id/ban
 * @desc Bloquer ou débloquer un utilisateur
 * @access Admin uniquement
 */
export const banUser = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.userId as string;
    const targetUserId = req.params.id as string;
    const { isBanned, reason } = req.body;

    if (typeof isBanned !== 'boolean') {
      return res.status(400).json({ message: "Le champ 'isBanned' est requis." });
    }

    // Vérifier que l'utilisateur est admin
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: { role: true }
    });

    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: "Accès refusé. Admin requis." });
    }

    // Vérifier que l'utilisateur cible existe
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, email: true, role: true }
    });

    if (!targetUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Empêcher de bannir un admin
    if (targetUser.role === 'admin') {
      return res.status(403).json({ message: "Impossible de bannir un administrateur." });
    }

    // Mettre à jour les champs de ban directement sur le User
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { 
        isBanned,
        banReason: isBanned ? (reason || 'Non spécifié') : null,
        bannedAt: isBanned ? new Date() : null,
        bannedBy: isBanned ? adminId : null
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isBanned: true,
        banReason: true,
        bannedAt: true
      }
    });

    console.log(`[OK] Utilisateur ${targetUser.email} ${isBanned ? 'banni' : 'débanni'} par admin ${adminId}`);

    res.status(200).json({
      message: isBanned ? "Utilisateur banni avec succès." : "Utilisateur débanni avec succès.",
      user: updatedUser
    });
  } catch (error) {
    console.error('[ERREUR] Ban/Unban utilisateur:', error);
    res.status(500).json({ message: "Erreur lors du bannissement de l'utilisateur." });
  }
};

/**
 * @route GET /api/admin/products
 * @desc Récupérer tous les produits (y compris inactifs)
 * @access Admin uniquement
 */
export const getAllProducts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId as string;

    // Vérifier que l'utilisateur est admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Accès refusé. Admin requis." });
    }

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Filtres optionnels
    const status = req.query.status as string | undefined;

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          seller: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ]);

    res.status(200).json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('[ERREUR] Récupération produits admin:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des produits." });
  }
};

/**
 * @route PATCH /api/admin/users/:id
 * @desc Modifier n'importe quel utilisateur (admin)
 * @access Admin uniquement
 */
export const adminUpdateUser = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.userId;
    if (!adminId) return res.status(401).json({ message: 'Non authentifié.' });

    const { id } = req.params;
    if (!id || typeof id !== 'string') return res.status(400).json({ message: 'ID utilisateur requis.' });

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    // Empêcher de modifier le rôle d'un autre admin
    if (existing.role === 'admin' && req.body.role !== undefined && req.body.role !== 'admin') {
      return res.status(403).json({ message: 'Impossible de modifier le rôle d\'un autre administrateur.' });
    }

    const { firstName, lastName, role, phone, city, postalCode, profile } = req.body;

    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (role !== undefined) {
      if (!USER_ROLES.includes(role)) {
        return res.status(400).json({ message: `Rôle invalide. Valeurs: ${USER_ROLES.join(', ')}` });
      }
      updateData.role = role;
    }
    if (phone !== undefined) updateData.phone = phone;
    if (city !== undefined) updateData.city = city;
    if (postalCode !== undefined) updateData.postalCode = postalCode;
    if (profile !== undefined) updateData.profile = profile;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'Aucune donnée à mettre à jour.' });
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, phone: true, city: true, postalCode: true,
        profile: true, rating: true, createdAt: true,
      },
    });

    // Audit log pour les changements de rôle
    if (role !== undefined && role !== existing.role) {
      await auditLog({
        adminId,
        action: 'USER_ROLE_CHANGED',
        targetUserId: id,
        details: { oldRole: existing.role, newRole: role },
      });
    }

    res.status(200).json({ message: 'Utilisateur mis à jour.', user });
  } catch (error) {
    console.error('[ADMIN] adminUpdateUser:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur.' });
  }
};

/**
 * @route DELETE /api/admin/users/:id
 * @desc Supprimer un utilisateur (anonymisation RGPD)
 * @access Admin uniquement
 */
export const adminDeleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.userId;
    if (!adminId) return res.status(401).json({ message: 'Non authentifié.' });

    const { id } = req.params;
    if (!id || typeof id !== 'string') return res.status(400).json({ message: 'ID utilisateur requis.' });

    // Empêcher un admin de se supprimer lui-même
    if (id === adminId) {
      return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte admin.' });
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    // Utiliser la fonction d'anonymisation partagée (RGPD)
    await anonymizeUser(id, adminId);

    // Audit log pour la suppression d'utilisateur
    await auditLog({
      adminId,
      action: 'USER_DELETED',
      targetUserId: id,
      details: { anonymized: true },
    });

    res.status(200).json({ message: 'Utilisateur supprimé (anonymisé RGPD).' });
  } catch (error) {
    console.error('[ADMIN] adminDeleteUser:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur.' });
  }
};
