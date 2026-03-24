import prisma from '../prismaClient.js';
import { Prisma } from '@prisma/client';

/**
 * RGPD: Supprimer définitivement les comptes anonymisés après X jours
 * Cette fonction doit être appelée par un cron job quotidien
 */
export const deleteExpiredAnonymizedAccounts = async (daysToKeep: number = 30): Promise<number> => {
  try {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - daysToKeep);

    // Trouver les utilisateurs anonymisés depuis plus de X jours
    const anonymizedUsers = await prisma.user.findMany({
      where: {
        email: {
          startsWith: 'deleted-',
          endsWith: '@anonymized.local'
        }
      },
      select: { id: true, email: true, profile: true }
    });

    // Filtrer ceux qui sont expirés
    const expiredUsers = anonymizedUsers.filter(user => {
      if (!user.profile || typeof user.profile !== 'object') return false;
      const profile = user.profile as { deletedAt?: string };
      if (!profile.deletedAt) return false;
      
      const deletedAt = new Date(profile.deletedAt);
      return deletedAt < expirationDate;
    });

    let deletedCount = 0;

    // Supprimer définitivement chaque compte expiré
    for (const user of expiredUsers) {
      await prisma.$transaction(async (tx) => {
        // Supprimer toutes les données liées
        await tx.cart.deleteMany({ where: { userId: user.id } });
        await tx.product.deleteMany({ where: { sellerId: user.id } });
        await tx.message.deleteMany({ where: { senderId: user.id } });
        
        // Supprimer les transactions (après le délai légal)
        await tx.transaction.deleteMany({
          where: {
            OR: [
              { buyerId: user.id },
              { sellerId: user.id }
            ]
          }
        });

        // Supprimer l'utilisateur
        await tx.user.delete({ where: { id: user.id } });
      });

      console.log(`[RGPD] Compte définitivement supprimé: ${user.email}`);
      deletedCount++;
    }

    console.log(`[RGPD] ${deletedCount} comptes anonymisés supprimés après ${daysToKeep} jours`);
    return deletedCount;
  } catch (error) {
    console.error('[RGPD] Erreur lors de la suppression des comptes expirés:', error);
    throw error;
  }
};

/**
 * RGPD: Obtenir le nombre de jours depuis l'anonymisation
 */
export const getDaysSinceAnonymization = (profile: any): number | null => {
  if (!profile || !profile.deletedAt) return null;
  
  const deletedAt = new Date(profile.deletedAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - deletedAt.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * RGPD: Anonymiser un utilisateur (suppression de compte)
 * Cette fonction est utilisée par:
 * - userController.deleteAccount (user deletes their own account)
 * - adminController.adminDeleteUser (admin deletes a user)
 * 
 * @param userId - ID de l'utilisateur à anonymiser
 * @param deletedBy - ID de l'administrateur qui effectue la suppression (optionnel, pour audit)
 */
export const anonymizeUser = async (
  userId: string,
  deletedBy?: string
): Promise<void> => {
  await prisma.$transaction(async (tx) => {
    // First, get all conversation IDs where user is a participant
    const conversations = await tx.conversation.findMany({
      where: { participantIds: { has: userId } },
      select: { id: true },
    });
    const conversationIds = conversations.map(c => c.id);

    // Delete all messages in those conversations to avoid orphaned messages
    if (conversationIds.length > 0) {
      await tx.message.deleteMany({
        where: { conversationId: { in: conversationIds } },
      });
    }

    // Now delete the conversations
    await tx.conversation.deleteMany({ where: { participantIds: { has: userId } } });

    const anonymizedEmail = `deleted-${userId}@anonymized.local`;
    const profileData: Record<string, unknown> = { 
      deleted: true, 
      deletedAt: new Date().toISOString() 
    };
    
    if (deletedBy) {
      profileData.deletedBy = deletedBy;
    }
    
    await tx.user.update({
      where: { id: userId },
      data: {
        email: anonymizedEmail,
        passwordHash: '',
        firstName: 'Utilisateur',
        lastName: 'Supprimé',
        phone: null,
        city: null,
        postalCode: null,
        profile: profileData as Prisma.InputJsonValue,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    
    await tx.cart.deleteMany({ where: { userId } });
    
    await tx.product.updateMany({
      where: { sellerId: userId, status: 'active' },
      data: { status: 'deleted' },
    });
    
    // Delete messages sent by the user (in conversations where user is not participant)
    await tx.message.deleteMany({ where: { senderId: userId } });
  });
};
