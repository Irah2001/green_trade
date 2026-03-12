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
    '/api/products': {
      get: {
        summary: 'Lister et rechercher les produits',
        tags: ['Produits'],
        parameters: [
          { name: 'text', in: 'query', schema: { type: 'string' }, description: 'Recherche textuelle (titre, description)' },
          { name: 'category', in: 'query', schema: { type: 'string', enum: ['fruits', 'vegetables', 'baskets'] } },
          { name: 'minPrice', in: 'query', schema: { type: 'number' } },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } }
        ],
        responses: {
          200: { description: 'Liste des produits ({ items, total })' },
          500: { description: 'Erreur serveur' }
        }
      },
      post: {
        summary: 'Créer un produit',
        tags: ['Produits'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'description', 'price', 'category'],
                properties: {
                  title: { type: 'string', example: 'Pommes bio du verger' },
                  description: { type: 'string', example: 'Pommes non traitées, récoltées hier.' },
                  price: { type: 'number', example: 2.5 },
                  category: { type: 'string', enum: ['fruits', 'vegetables', 'baskets'], example: 'fruits' },
                  condition: { type: 'string', enum: ['neuf', 'excellent', 'bon', 'acceptable'], example: 'bon' },
                  images: { type: 'array', items: { type: 'string' } },
                  tags: { type: 'array', items: { type: 'string' }, example: ['bio', 'surplus'] },
                  status: { type: 'string', enum: ['active', 'sold', 'reserved', 'archived'], example: 'active' },
                  location: {
                    type: 'object',
                    properties: {
                      type: { type: 'string', example: 'Point' },
                      coordinates: { type: 'array', items: { type: 'number' }, example: [-1.5536, 47.2184] },
                      city: { type: 'string', example: 'Nantes' },
                      postalCode: { type: 'string', example: '44000' }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Produit créé' },
          400: { description: 'Données invalides' },
          401: { description: 'Non autorisé' }
        }
      }
    },
    '/api/products/seller/{sellerId}': {
      get: {
        summary: 'Lister les produits d\'un vendeur',
        tags: ['Produits'],
        parameters: [
          { name: 'sellerId', in: 'path', required: true, schema: { type: 'string' }, description: 'ID du vendeur' },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } }
        ],
        responses: {
          200: { description: 'Liste des produits du vendeur ({ items, total })' },
          500: { description: 'Erreur serveur' }
        }
      }
    },
    '/api/products/{id}': {
      get: {
        summary: 'Récupérer un produit par ID',
        tags: ['Produits'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Produit trouvé' },
          404: { description: 'Produit non trouvé' },
          500: { description: 'Erreur serveur' }
        }
      },
      put: {
        summary: 'Mettre à jour un produit',
        tags: ['Produits'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  price: { type: 'number' },
                  category: { type: 'string', enum: ['fruits', 'vegetables', 'baskets'] },
                  condition: { type: 'string', enum: ['neuf', 'excellent', 'bon', 'acceptable'] },
                  status: { type: 'string', enum: ['active', 'sold', 'reserved', 'archived'] },
                  images: { type: 'array', items: { type: 'string' } },
                  tags: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Produit mis à jour' },
          400: { description: 'Données invalides' },
          401: { description: 'Non autorisé' },
          403: { description: 'Accès interdit (pas propriétaire)' },
          404: { description: 'Produit non trouvé' }
        }
      },
      delete: {
        summary: 'Supprimer un produit',
        tags: ['Produits'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          204: { description: 'Produit supprimé' },
          401: { description: 'Non autorisé' },
          403: { description: 'Accès interdit (pas propriétaire)' },
          404: { description: 'Produit non trouvé' }
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