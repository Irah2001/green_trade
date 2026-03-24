// src/services/auth.service.ts
import { apiFetch } from './api';

/**
 * Service gérant l'authentification en utilisant la fonction utilitaire apiFetch.
 * Le token est automatiquement ajouté aux headers via apiFetch s'il est présent.
 */
export const authService = {
  /**
   * Connecte l'utilisateur et retourne ses informations ainsi que le token.
   */
  async login(credentials: { email: string; password: any }) {
    return apiFetch<any>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Inscrit un nouvel utilisateur.
   */
  async signup(userData: any) {
    return apiFetch<any>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Demande un lien de réinitialisation de mot de passe par email.
   */
  async forgotPassword(email: string) {
    return apiFetch<any>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Réinitialise le mot de passe à l'aide d'un token reçu par email.
   */
  async resetPassword(token: string, newPassword: string) {
    return apiFetch<any>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }
};