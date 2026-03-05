const serverUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 4000}`;

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'GreenTrade API',
    version: '1.0.0',
    description: 'Documentation officielle de l\'API GreenTrade',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
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
    },
    '/api/cart': {
      get: {
        summary: 'Récupérer le panier de l\'utilisateur connecté',
        tags: ['Panier'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Panier récupéré' },
          401: { description: 'Non autorisé' },
          500: { description: 'Erreur serveur' }
        }
      },
      delete: {
        summary: 'Vider le panier de l\'utilisateur connecté',
        tags: ['Panier'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Panier vidé' },
          401: { description: 'Non autorisé' },
          500: { description: 'Erreur serveur' }
        }
      }
    },
    '/api/cart/items': {
      post: {
        summary: 'Ajouter un produit au panier',
        tags: ['Panier'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['productId', 'quantity'],
                properties: {
                  productId: { type: 'string', example: '60f7c1f77bcf86cd79943901' },
                  quantity: { type: 'integer', example: 2 }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Produit ajouté' },
          400: { description: 'Requête invalide' },
          401: { description: 'Non autorisé' },
          404: { description: 'Produit introuvable' },
          500: { description: 'Erreur serveur' }
        }
      }
    },
    '/api/cart/items/{productId}': {
      put: {
        summary: 'Mettre à jour la quantité d\'un produit',
        tags: ['Panier'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'productId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['quantity'],
                properties: {
                  quantity: { type: 'integer', example: 1 }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Quantité mise à jour' },
          400: { description: 'Requête invalide' },
          401: { description: 'Non autorisé' },
          500: { description: 'Erreur serveur' }
        }
      },
      delete: {
        summary: 'Supprimer un produit du panier',
        tags: ['Panier'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'productId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: { description: 'Produit supprimé' },
          400: { description: 'Requête invalide' },
          401: { description: 'Non autorisé' },
          500: { description: 'Erreur serveur' }
        }
      }
    }
  }
};