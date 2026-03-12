import { Response } from 'express';
import Stripe from 'stripe';
import { CartPrismaRepository } from '../repositories/CartPrismaRepository.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

const cartRepository = new CartPrismaRepository();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: process.env.STRIPE_API_VERSION,
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
        unit_amount: Math.round(Number(item.price || item.product?.price) * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: line_items,
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5001'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5001'}/cart`,
    });

    return res.status(200).json({ url: session.url });

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Erreur Stripe :", error);
    return res.status(500).json({ message: 'Erreur lors de la création de la session de paiement.' });
  }
};
