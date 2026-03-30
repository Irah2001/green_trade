import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prismaClient.js';
import { anonymizeUser } from '../utils/rgpd.utils.js';
import { normalizeOrderStatus } from '../utils/orderStatus.js';

/**
 * Récupérer tous les utilisateurs (admin uniquement)
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ message: "Non authentifié." });
    }

    const requester = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (requester?.role !== 'admin') {
      return res.status(403).json({ message: "Accès réservé aux administrateurs." });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        city: true,
        postalCode: true,
        profile: true,
        rating: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('[ERREUR] Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs." });
  }
};

/**
 * Récupérer le profil de l'utilisateur connecté
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ message: "Non authentifié." });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        city: true,
        postalCode: true,
        profile: true,
        rating: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('[ERREUR] Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: "Erreur lors de la récupération du profil." });
  }
};

/**
 * Modifier le profil de l'utilisateur connecté
 */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { firstName, lastName, phone, city, postalCode, profile } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Non authentifié." });
    }

    // Construire l'objet de mise à jour avec seulement les champs fournis
    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (city !== undefined) updateData.city = city;
    if (postalCode !== undefined) updateData.postalCode = postalCode;
    if (profile !== undefined) updateData.profile = profile;

    // Vérifier qu'il y a au moins un champ à mettre à jour
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        message: "Aucune donnée à mettre à jour. Veuillez fournir au moins un champ." 
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        city: true,
        postalCode: true,
        profile: true,
      },
    });

    console.log(`[OK] Profil mis à jour pour l'utilisateur: ${updatedUser.email}`);
    res.status(200).json({
      message: "Profil mis à jour avec succès.",
      user: updatedUser,
    });
  } catch (error) {
    console.error('[ERREUR] Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du profil." });
  }
};

/**
 * Supprimer le compte de l'utilisateur connecté
 */
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { password } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Non authentifié." });
    }

    // Vérifier que le mot de passe est fourni
    if (!password) {
      return res.status(400).json({ 
        message: "Veuillez fournir votre mot de passe pour confirmer la suppression." 
      });
    }

    // Récupérer l'utilisateur avec son mot de passe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    // RGPD: Anonymiser l'utilisateur au lieu de le supprimer complètement
    // On garde les transactions pour l'historique mais on anonymise les données personnelles
    await anonymizeUser(userId);

    console.log(`[OK] Compte anonymisé (RGPD) pour l'utilisateur: ${user.email}`);
    res.status(200).json({ 
      message: "Votre compte a été supprimé avec succès. Vos données personnelles ont été anonymisées conformément au RGPD." 
    });
  } catch (error) {
    console.error('[ERREUR] Erreur lors de la suppression du compte:', error);
    res.status(500).json({ 
      message: "Erreur lors de la suppression du compte.",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Récupérer le profil public d'un utilisateur (par exemple un vendeur)
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: "ID utilisateur requis." });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        city: true,
        postalCode: true,
        profile: true,
        rating: true,
        createdAt: true,
        // Ne pas exposer l'email dans le profil public
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const publicProfile =
      user.profile && typeof user.profile === 'object' && !Array.isArray(user.profile)
        ? {
            avatar: (user.profile as { avatar?: string }).avatar,
            bio: (user.profile as { bio?: string }).bio,
          }
        : undefined;

    const publicUser = {
      ...user,
      profile: publicProfile,
    };

    // Si c'est un vendeur, on peut ajouter ses statistiques
    if (publicUser.role === 'seller') {
      const [productsCount, transactions] = await Promise.all([
        prisma.product.count({ where: { sellerId: id, status: 'active' } }),
        prisma.transaction.findMany({
          where: { sellerId: id },
          select: { status: true },
        }),
      ]);

      const completedSales = transactions.filter(({ status }) => normalizeOrderStatus(status) === 'confirmed').length;

      return res.status(200).json({
        ...publicUser,
        stats: {
          activeProducts: productsCount,
          completedSales,
        },
      });
    }

    res.status(200).json(publicUser);
  } catch (error) {
    console.error('[ERREUR] Erreur lors de la récupération du profil public:', error);
    res.status(500).json({ message: "Erreur lors de la récupération du profil." });
  }
};
