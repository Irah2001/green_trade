import prisma from '../prismaClient.js';

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
