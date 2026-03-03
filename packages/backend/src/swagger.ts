const serverUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 4000}`;

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'GreenTrade API',
    version: '1.0.0',
    description: 'Documentation officielle de l\'API GreenTrade',
  },
  servers: [
    {
      url: serverUrl,
      description: 'Environnement actuel'
    }
  ],
  paths: {
    '/': {
      get: {
        summary: 'Vérifier que l\'API tourne',
        tags: ['System'],
        responses: {
          200: { description: 'Message de confirmation' }
        }
      }
    },
    '/health': {
      get: {
        summary: 'Vérifier la santé du serveur',
        tags: ['System'],
        responses: {
          200: { description: 'Statut, timestamp et environnement' }
        }
      }
    },
    '/api/auth/signup': {
      post: {
        summary: 'Inscrire un nouvel utilisateur',
        tags: ['Authentification'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'firstName', 'lastName'],
                properties: {
                  email: { type: 'string', example: 'jean.dupont@email.com' },
                  password: { type: 'string', example: 'MotDePasseSecret123!' },
                  firstName: { type: 'string', example: 'Jean' },
                  lastName: { type: 'string', example: 'Dupont' },
                  accountType: { type: 'string', example: 'USER' },
                  city: { type: 'string', example: 'Paris' },
                  postalCode: { type: 'string', example: '75001' },
                  phone: { type: 'string', example: '0612345678' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Utilisateur créé avec succès (retourne user et token)' },
          400: { description: 'Cet email est déjà utilisé' },
          500: { description: 'Erreur lors de l\'inscription' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Connecter un utilisateur',
        tags: ['Authentification'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'jean.dupont@email.com' },
                  password: { type: 'string', example: 'MotDePasseSecret123!' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Connexion réussie (retourne user et token)' },
          401: { description: 'Identifiants invalides' },
          500: { description: 'Erreur lors de la connexion' }
        }
      }
    }
  }
};