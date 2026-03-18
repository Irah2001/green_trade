import { Request, Response } from 'express';
import prisma from '../prismaClient.js';
import { sendOrderConfirmationEmail, sendProducerNotificationEmail, sendShipmentNotificationEmail } from '../services/email.service.js';

/**
 * Créer une nouvelle commande (Transaction)
 */
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const buyerId = (req as any).userId;

    if (!buyerId) {
      return res.status(401).json({ message: "Non authentifié." });
    }

    // Validation
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ 
        message: "Données invalides. Veuillez fournir un productId et une quantité valide." 
      });
    }

    // Récupérer le produit
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { seller: true },
    });

    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé." });
    }

    if (product.status !== 'active') {
      return res.status(400).json({ message: "Ce produit n'est plus disponible." });
    }

    // Récupérer l'acheteur
    const buyer = await prisma.user.findUnique({
      where: { id: buyerId },
    });

    if (!buyer) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Vérifier que l'acheteur n'achète pas son propre produit
    if (product.sellerId === buyerId) {
      return res.status(400).json({ message: "Vous ne pouvez pas acheter votre propre produit." });
    }

    // Calculer le montant total
    const totalAmount = product.price * quantity;

    // Créer la transaction
    const transaction = await prisma.transaction.create({
      data: {
        buyerId,
        sellerId: product.sellerId,
        productId: product.id,
        quantity: quantity,
        amount: totalAmount,
        currency: product.currency || 'EUR',
        status: 'pending',
      },
      include: {
        buyer: true,
        seller: true,
        product: true,
      },
    });

    // Envoyer l'email de confirmation au client
    try {
      await sendOrderConfirmationEmail(
        buyer.email,
        buyer.firstName || 'Client',
        {
          productName: product.title,
          quantity: quantity,
          total: totalAmount,
        }
      );
      console.log('[OK] Email de confirmation envoyé à:', buyer.email);
    } catch (emailError) {
      console.error('[ERREUR] Erreur envoi email confirmation:', emailError);
      // On continue même si l'email échoue
    }

    // Envoyer la notification au producteur
    if (transaction.seller) {
      try {
        await sendProducerNotificationEmail(
          transaction.seller.email,
          transaction.seller.firstName || 'Producteur',
          {
            productName: product.title,
            quantity: quantity,
            buyerName: buyer.firstName || buyer.email,
          }
        );
        console.log('[OK] Notification producteur envoyée à:', transaction.seller.email);
      } catch (emailError) {
        console.error('[ERREUR] Erreur envoi notification producteur:', emailError);
        // On continue même si l'email échoue
      }
    }

    res.status(201).json({
      message: "Commande créée avec succès.",
      transaction: {
        id: transaction.id,
        productTitle: product.title,
        quantity,
        totalAmount,
        status: transaction.status,
        createdAt: transaction.createdAt,
      },
    });
  } catch (error) {
    console.error('Erreur dans createOrder:', error);
    res.status(500).json({ message: "Erreur lors de la création de la commande." });
  }
};

/**
 * Récupérer toutes les commandes de l'utilisateur connecté
 */
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ message: "Non authentifié." });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { buyerId: userId },
          { sellerId: userId },
        ],
      },
      include: {
        buyer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        seller: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({ orders: transactions });
  } catch (error) {
    console.error('Erreur dans getMyOrders:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des commandes." });
  }
};

/**
 * Récupérer toutes les commandes (admin uniquement)
 */
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        buyer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        seller: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({ orders: transactions });
  } catch (error) {
    console.error('Erreur dans getAllOrders:', error);
    res.status(500).json({ message: "Erreur lors de la récupération des commandes." });
  }
};

/**
 * Récupérer une commande spécifique
 */
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ message: "Non authentifié." });
    }

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: "ID de commande invalide." });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        buyer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        seller: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        product: true,
      },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Commande non trouvée." });
    }

    // Vérifier que l'utilisateur a le droit de voir cette commande
    if (transaction.buyerId !== userId && transaction.sellerId !== userId) {
      return res.status(403).json({ message: "Accès non autorisé." });
    }

    res.status(200).json({ order: transaction });
  } catch (error) {
    console.error('Erreur dans getOrderById:', error);
    res.status(500).json({ message: "Erreur lors de la récupération de la commande." });
  }
};

/**
 * Mettre à jour le statut d'une commande (pour le vendeur)
 */
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
  const { id } = req.params;
  const { status, trackingNumber, carrier, trackingUrl } = req.body;
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ message: "Non authentifié." });
    }

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: "ID de commande invalide." });
    }

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Statut invalide. Valeurs acceptées: ${validStatuses.join(', ')}` 
      });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Commande non trouvée." });
    }

    // Seul le vendeur peut mettre à jour le statut
    if (transaction.sellerId !== userId) {
      return res.status(403).json({ 
        message: "Seul le vendeur peut mettre à jour le statut de la commande." 
      });
    }

    // Si on marque comme expédié, enregistrer les infos de suivi
    const updateData: any = { status };
    if (status === 'shipped') {
      updateData.trackingNumber = trackingNumber || null;
      updateData.carrier = carrier || null;
      updateData.trackingUrl = trackingUrl || null;
      updateData.shippedAt = new Date();
    }

    if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: updateData,
      include: {
        buyer: true,
        seller: true,
        product: true,
      },
    });

    // Si expédié, envoyer un email de suivi au client
    // determine shippedAt for email
    const shippedAtDate = updateData.shippedAt || new Date();

    if (status === 'shipped' && updatedTransaction.buyer) {
      try {
        await sendShipmentNotificationEmail(
          updatedTransaction.buyer.email,
          updatedTransaction.buyer.firstName || 'Client',
          {
            productName: updatedTransaction.product.title,
            quantity: updatedTransaction.quantity || 1,
            trackingNumber: trackingNumber || 'N/A',
            carrier: carrier,
            trackingUrl: trackingUrl,
            shippedAt: shippedAtDate.toLocaleString('fr-FR'),
          }
        );
        console.log('[OK] Email d\'expédition envoyé à:', updatedTransaction.buyer.email);
      } catch (emailError) {
        console.error('[ERREUR] Erreur envoi email expédition:', emailError);
      }
    }

    res.status(200).json({
      message: "Statut de la commande mis à jour.",
      order: updatedTransaction,
    });
  } catch (error) {
    console.error('Erreur dans updateOrderStatus:', error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut." });
  }
};

/**
 * Marquer une commande comme expédiée et envoyer un email de suivi
 */
export const shipOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { trackingNumber, carrier, trackingUrl } = req.body;
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ message: "Non authentifié." });
    }

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: "ID de commande invalide." });
    }

    if (!trackingNumber) {
      return res.status(400).json({ message: "Le numéro de suivi est obligatoire." });
    }

    // Récupérer la transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        buyer: true,
        seller: true,
        product: true,
      },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Commande non trouvée." });
    }

    // Seul le vendeur peut marquer la commande comme expédiée
    if (transaction.sellerId !== userId) {
      return res.status(403).json({ 
        message: "Seul le vendeur peut marquer la commande comme expédiée." 
      });
    }

    // Mettre à jour la transaction
    await prisma.transaction.update({
      where: { id },
      data: {
        status: 'shipped',
        shippedAt: new Date(),
      },
    });

    // Envoyer l'email de notification d'expédition à l'acheteur
    if (transaction.buyer) {
      try {
        await sendShipmentNotificationEmail(
          transaction.buyer.email,
          transaction.buyer.firstName || 'Client',
          {
            productName: transaction.product.title,
            quantity: transaction.quantity,
            trackingNumber,
            carrier: carrier || 'Non précisé',
            trackingUrl: trackingUrl || '#',
            shippedAt: new Date().toLocaleString('fr-FR'),
          }
        );
        console.log('[OK] Email d\'expédition envoyé à:', transaction.buyer.email);
      } catch (emailError) {
        console.error('[ERREUR] Erreur envoi email d\'expédition:', emailError);
        // On continue même si l'email échoue
      }
    }

    res.status(200).json({
      message: "Commande marquée comme expédiée. Email envoyé à l'acheteur.",
      order: {
        ...transaction,
        status: 'shipped',
        trackingNumber,
        carrier: carrier || 'Non précisé',
        trackingUrl,
        shippedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Erreur dans shipOrder:', error);
    res.status(500).json({ message: "Erreur lors de l'expédition de la commande." });
  }
};
