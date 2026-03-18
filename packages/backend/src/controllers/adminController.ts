import { Response } from 'express';
import prisma from '../prismaClient.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { auditLog } from '../utils/audit.utils.js';
import { anonymizeUser } from '../utils/rgpd.utils.js';

/**
 * PATCH /api/admin/users/:id — Admin: update any user
 */
export const adminUpdateUser = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.userId;
    if (!adminId) return res.status(401).json({ message: 'Non authentifié.' });

    const { id } = req.params;
    if (!id || typeof id !== 'string') return res.status(400).json({ message: 'ID utilisateur requis.' });

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    // Prevent changing the role of another admin (or own role)
    if (existing.role === 'admin' && req.body.role !== undefined && req.body.role !== 'admin') {
      return res.status(403).json({ message: 'Impossible de modifier le rôle d\'un autre administrateur.' });
    }

    const { firstName, lastName, role, phone, city, postalCode, profile } = req.body;

    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (role !== undefined) {
      const validRoles = ['buyer', 'seller', 'farmer', 'admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: `Rôle invalide. Valeurs: ${validRoles.join(', ')}` });
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

    // Audit log for role changes
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
 * DELETE /api/admin/users/:id — Admin: delete a user (GDPR anonymization)
 */
export const adminDeleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.userId;
    if (!adminId) return res.status(401).json({ message: 'Non authentifié.' });

    const { id } = req.params;
    if (!id || typeof id !== 'string') return res.status(400).json({ message: 'ID utilisateur requis.' });

    // Prevent admin from deleting themselves
    if (id === adminId) {
      return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte admin.' });
    }

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    // Use shared anonymization function (RGPD)
    await anonymizeUser(id, adminId);

    // Audit log for user deletion
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
