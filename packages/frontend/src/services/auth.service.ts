const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const authService = {
  async login(credentials: { email: string; password: any }) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Identifiants invalides');
    }
    return response.json(); // Retourne { user, token }
  },

  async signup(userData: any) {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erreur lors de l'inscription");
    }
    return response.json();
  },

  async forgotPassword(email: string) {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erreur lors de l'envoi de l'email");
    }
    return response.json();
  },

  async resetPassword(token: string, newPassword: string) {
    const response = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erreur lors de la réinitialisation");
    }
    return response.json();
  }
};