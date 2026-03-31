// src/controllers/webhookController.ts
import { Request, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../prismaClient.js';
import { sendOrderConfirmationEmail, sendProducerNotificationEmail } from '../services/email.service.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: process.env.STRIPE_API_VERSION as "2026-02-25.clover",
});

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!sig || !endpointSecret) {
      return res.status(400).send('Webhook Error: Missing signature or secret');
    }
    
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const userId = session.metadata?.userId;

      if (!userId) {
        throw new Error("userId manquant dans les metadata de la session Stripe");
      }

      const buyer = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!buyer) throw new Error("Acheteur introuvable");

      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: { 
          items: { 
            include: { 
              product: {
                include: { seller: true }
              } 
            } 
          } 
        },
      });

      if (!cart || cart.items.length === 0) {
        return res.status(200).json({ received: true });
      }

      const processedOrders: any[] = [];

      await prisma.$transaction(async (tx) => {
        for (const item of cart.items) {
          const totalAmount = Number(item.unitPriceSnapshot || item.product.price) * item.quantity;

          await tx.transaction.create({
            data: {
              buyerId: userId,
              sellerId: item.product.sellerId,
              productId: item.productId,
              quantity: item.quantity,
              amount: totalAmount,
              currency: item.product.currency || 'EUR',
              status: 'confirmed',
              stripeSessionId: session.id,
            }
          });

          const newQuantity = Math.max(0, item.product.quantity - item.quantity);
          await tx.product.update({
            where: { id: item.productId },
            data: {
              quantity: newQuantity,
              status: newQuantity === 0 ? 'sold' : item.product.status 
            }
          });

          processedOrders.push({
            product: item.product,
            seller: item.product.seller,
            quantity: item.quantity,
            totalAmount: totalAmount
          });
        }

        await tx.cartItem.deleteMany({
          where: { cartId: cart.id }
        });
      });

      for (const order of processedOrders) {
        sendOrderConfirmationEmail(buyer.email, buyer.firstName || 'Client', {
          productName: order.product.title,
          quantity: order.quantity,
          total: order.totalAmount,
        }).catch((e) => console.error('[ERREUR] Webhook: Email confirmation acheteur échoué:', e));

        if (order.seller && order.seller.email) {
          sendProducerNotificationEmail(order.seller.email, order.seller.firstName || 'Producteur', {
            productName: order.product.title,
            quantity: order.quantity,
            buyerName: buyer.firstName || buyer.email,
          }).catch((e) => console.error('[ERREUR] Webhook: Email notification vendeur échoué:', e));
        }
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error processing webhook' });
    }
  }

  res.status(200).json({ received: true });
};
