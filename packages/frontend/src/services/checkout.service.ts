// src/services/checkout.service.ts
import { apiFetch } from './api';

/**
 * Service gérant le processus de paiement (Stripe).
 */
export const checkoutService = {
  /**
   * Crée une session de paiement Stripe pour le panier actuel.
   * Retourne généralement l'URL de redirection vers Stripe ou le sessionId.
   */
  createCheckoutSession: async () => {
    return apiFetch<any>('/api/checkout/create-session', {
      method: 'POST',
    });
  }
};