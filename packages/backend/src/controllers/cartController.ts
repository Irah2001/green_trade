import { Response } from 'express';
import prisma from '../prismaClient.js';
import { CartPrismaRepository } from '../repositories/CartPrismaRepository.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

const cartRepository = new CartPrismaRepository();

const getUserId = (req: AuthRequest) => req.userId as string;

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    const cart = await cartRepository.getOrCreateCart(userId);
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération du panier.' });
  }
};

export const addCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    const { productId, quantity } = req.body as { productId?: string; quantity?: number };

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'productId et quantity sont requis.' });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable.' });
    }

    await cartRepository.addItem(userId, productId, quantity, Number(product.price));

    const cart = await cartRepository.getOrCreateCart(userId);
    return res.status(201).json(cart);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de l\'ajout au panier.' });
  }
};

export const updateCartItemQuantity = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    const { productId } = req.params as { productId: string };
    const { quantity } = req.body as { quantity?: number };

    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: 'productId et quantity sont requis.' });
    }

    const updatedItem = await cartRepository.updateQuantity(userId, productId, quantity);
    if (!updatedItem) {
      return res.status(404).json({ message: 'Produit introuvable dans le panier.' });
    }
    const cart = await cartRepository.getOrCreateCart(userId);
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la mise à jour du panier.' });
  }
};

export const removeCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    const { productId } = req.params as { productId: string };

    if (!productId) {
      return res.status(400).json({ message: 'productId est requis.' });
    }

    const removedItem = await cartRepository.removeItem(userId, productId);
    if (!removedItem) {
      return res.status(404).json({ message: 'Produit introuvable dans le panier.' });
    }
    const cart = await cartRepository.getOrCreateCart(userId);
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la suppression du produit.' });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    await cartRepository.clearCart(userId);
    const cart = await cartRepository.getOrCreateCart(userId);
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors du vidage du panier.' });
  }
};

export const syncCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    const { localItems } = req.body as { localItems?: { productId: string; quantity: number }[] };

    if (!localItems || !Array.isArray(localItems) || localItems.length === 0) {
      const cart = await cartRepository.getOrCreateCart(userId);
      return res.status(200).json(cart);
    }

    await cartRepository.getOrCreateCart(userId);

    for (const item of localItems) {
      if (!item.productId || !item.quantity || item.quantity <= 0) continue;

      const product = await prisma.product.findUnique({ 
        where: { id: item.productId } 
      });

      if (!product || product.isDeleted) continue; 

      await cartRepository.addItem(userId, item.productId, item.quantity, Number(product.price));
    }

    const updatedCart = await cartRepository.getOrCreateCart(userId);
    return res.status(200).json(updatedCart);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la synchronisation du panier.' });
  }
};
