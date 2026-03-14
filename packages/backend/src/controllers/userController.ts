import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../prismaClient.js';

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
    await prisma.$transaction(async (tx) => {
      // 1. Anonymiser les données personnelles de l'utilisateur
      const anonymizedEmail = `deleted-${userId}@anonymized.local`;
      await tx.user.update({
        where: { id: userId },
        data: {
          email: anonymizedEmail,
          passwordHash: '', // Vider le mot de passe
          firstName: 'Utilisateur',
          lastName: 'Supprimé',
          phone: null,
          city: null,
          postalCode: null,
          profile: { deleted: true, deletedAt: new Date().toISOString() },
          resetToken: null,
          resetTokenExpiry: null,
        }
      });
      
      // 2. Supprimer les données non essentielles
      // Supprimer le panier (données temporaires)
      await tx.cart.deleteMany({ where: { userId } });
      
      // Supprimer les produits actifs du vendeur (ou les désactiver)
      await tx.product.updateMany({ 
        where: { sellerId: userId, status: 'active' },
        data: { status: 'deleted' }
      });
      
      // Supprimer les messages (contenu privé)
      await tx.message.deleteMany({ where: { senderId: userId } });
      
      // 3. Les transactions sont CONSERVÉES pour l'historique comptable
      // mais les données personnelles sont déjà anonymisées via l'update du User
      // Les transactions pointent vers un utilisateur "Utilisateur Supprimé"
    });

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
        rating: true,
        createdAt: true,
        // Ne pas exposer l'email, le téléphone et l'adresse dans le profil public
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Si c'est un vendeur, on peut ajouter ses statistiques
    if (user.role === 'farmer' || user.role === 'seller') {
      const [productsCount, salesCount] = await Promise.all([
        prisma.product.count({ where: { sellerId: id, status: 'active' } }),
        prisma.transaction.count({ where: { sellerId: id, status: 'delivered' } }),
      ]);

      return res.status(200).json({
        ...user,
        stats: {
          activeProducts: productsCount,
          completedSales: salesCount,
        },
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('[ERREUR] Erreur lors de la récupération du profil public:', error);
    res.status(500).json({ message: "Erreur lors de la récupération du profil." });
  }
};
