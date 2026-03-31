import { Response } from 'express';
import Stripe from 'stripe';
import prisma from '../prismaClient.js';
import { CartPrismaRepository } from '../repositories/CartPrismaRepository.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

const cartRepository = new CartPrismaRepository();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: process.env.STRIPE_API_VERSION as "2026-02-25.clover",
});

const getUserId = (req: AuthRequest) => req.userId as string;

export const createCheckoutSession = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    const cart = await cartRepository.getOrCreateCart(userId);

    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: 'Votre panier est vide.' });
    }

    const line_items = cart.items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.product?.title || item.product?.name || "Produit GreenTrade",
        },
        unit_amount: Math.round(Number(item.unitPriceSnapshot || item.product?.price) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: line_items,
      metadata: {
        userId: userId 
      },
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5001'}/success`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5001'}/?return=cart`,
    });

    return res.status(200).json({ url: session.url });

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Erreur Stripe :", error);
    return res.status(500).json({ message: 'Erreur lors de la création de la session de paiement.' });
  }
};
