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
    '/api/auth/forgot-password': {
      post: {
        summary: 'Demander la réinitialisation du mot de passe',
        tags: ['Authentification'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', example: 'jean.dupont@email.com' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Email de réinitialisation envoyé (si l\'email existe)' },
          500: { description: 'Erreur lors de l\'envoi de l\'email' }
        }
      }
    },
    '/api/auth/reset-password': {
      post: {
        summary: 'Réinitialiser le mot de passe avec le token',
        tags: ['Authentification'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token', 'newPassword'],
                properties: {
                  token: { type: 'string', example: 'abc123def456...' },
                  newPassword: { type: 'string', example: 'NouveauMotDePasse123!' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Mot de passe réinitialisé avec succès' },
          400: { description: 'Token invalide ou expiré / Mot de passe non conforme' },
          500: { description: 'Erreur lors de la réinitialisation' }
        }
      }
    },
    '/api/cart': {
      get: {
        summary: 'Récupérer le panier de l\'utilisateur connecté',
        tags: ['Panier'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Panier récupéré',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                    userId: { type: 'string', example: '507f1f77bcf86cd799439012' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          cartId: { type: 'string' },
                          productId: { type: 'string' },
                          quantity: { type: 'integer', example: 2 },
                          unitPriceSnapshot: { type: 'number', example: 12.5 },
                          product: { type: 'object' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
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
    '/api/cart/sync': {
      post: {
        summary: 'Synchroniser le panier local avec le panier du serveur (à la connexion)',
        tags: ['Panier'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  localItems: {
                    type: 'array',
                    description: 'Liste des articles du panier local (localStorage) à fusionner',
                    items: {
                      type: 'object',
                      required: ['productId', 'quantity'],
                      properties: {
                        productId: { type: 'string', example: '60f7c1f77bcf86cd79943901' },
                        quantity: { type: 'integer', example: 2 }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Panier synchronisé avec succès. Retourne le panier mis à jour.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                    userId: { type: 'string', example: '507f1f77bcf86cd799439012' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          cartId: { type: 'string' },
                          productId: { type: 'string' },
                          quantity: { type: 'integer', example: 3 },
                          unitPriceSnapshot: { type: 'number', example: 12.5 },
                          product: { type: 'object' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          401: { description: 'Non autorisé' },
          500: { description: 'Erreur serveur lors de la synchronisation' }
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
        summary: 'Mettre à jour la quantité d\'un produit dans le panier',
        tags: ['Panier'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'productId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: '507f1f77bcf86cd799439011'
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
                  quantity: { type: 'integer', example: 3 }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Quantité mise à jour' },
          400: { description: 'Requête invalide' },
          401: { description: 'Non autorisé' },
          404: { description: 'Produit introuvable dans le panier' },
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
            schema: { type: 'string' },
            example: '507f1f77bcf86cd799439011'
          }
        ],
        responses: {
          200: { description: 'Produit supprimé' },
          400: { description: 'Requête invalide' },
          401: { description: 'Non autorisé' },
          404: { description: 'Produit introuvable dans le panier' },
          500: { description: 'Erreur serveur' }
        }
      }
    },
    '/api/orders': {
      post: {
        summary: 'Créer une nouvelle commande',
        tags: ['Commandes'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['productId', 'quantity'],
                properties: {
                  productId: { type: 'string', example: '507f1f77bcf86cd799439011' },
                  quantity: { type: 'integer', example: 2 }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Commande créée avec succès, emails envoyés' },
          400: { description: 'Données invalides ou produit indisponible' },
          401: { description: 'Non authentifié' },
          404: { description: 'Produit non trouvé' },
          500: { description: 'Erreur lors de la création de la commande' }
        }
      },
      get: {
        summary: 'Récupérer toutes mes commandes',
        tags: ['Commandes'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Liste des commandes (achetées et vendues)',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    orders: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          buyerId: { type: 'string' },
                          sellerId: { type: 'string' },
                          productId: { type: 'string' },
                          amount: { type: 'number', example: 25 },
                          quantity: { type: 'integer', example: 2 },
                          currency: { type: 'string', example: 'EUR' },
                          status: { type: 'string', example: 'pending' },
                          createdAt: { type: 'string', format: 'date-time' },
                          updatedAt: { type: 'string', format: 'date-time' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          401: { description: 'Non authentifié' },
          500: { description: 'Erreur serveur' }
        }
      }
    },
    '/api/orders/{id}': {
      get: {
        summary: 'Récupérer une commande spécifique',
        tags: ['Commandes'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: { description: 'Détails de la commande' },
          400: { description: 'ID invalide' },
          401: { description: 'Non authentifié' },
          403: { description: 'Accès non autorisé' },
          404: { description: 'Commande non trouvée' },
          500: { description: 'Erreur serveur' }
        }
      }
    },
    '/api/orders/{id}/status': {
      patch: {
        summary: 'Mettre à jour le statut d\'une commande (vendeur uniquement)',
        tags: ['Commandes'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
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
                required: ['status'],
                properties: {
                  status: {
                    type: 'string',
                    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
                    example: 'confirmed'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Statut mis à jour avec succès' },
          400: { description: 'Statut invalide' },
          401: { description: 'Non authentifié' },
          403: { description: 'Seul le vendeur peut mettre à jour le statut' },
          404: { description: 'Commande non trouvée' },
          500: { description: 'Erreur serveur' }
        }
      }
    },
    '/api/orders/{id}/ship': {
      post: {
        summary: 'Marquer une commande comme expédiée (vendeur uniquement)',
        tags: ['Commandes'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
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
                required: ['trackingNumber'],
                properties: {
                  trackingNumber: {
                    type: 'string',
                    example: 'FR123456789'
                  },
                  carrier: {
                    type: 'string',
                    example: 'Colissimo'
                  },
                  trackingUrl: {
                    type: 'string',
                    example: 'https://tracking.colissimo.fr/FR123456789'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Commande expédiée, email envoyé à l\'acheteur' },
          400: { description: 'Numéro de suivi manquant' },
          401: { description: 'Non authentifié' },
          403: { description: 'Seul le vendeur peut expédier' },
          404: { description: 'Commande non trouvée' },
          500: { description: 'Erreur serveur' }
        }
      }
    },
    '/api/users/me': {
      get: {
        summary: 'Récupérer son profil utilisateur',
        tags: ['Utilisateurs'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Profil utilisateur récupéré',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                    email: { type: 'string', example: 'user@example.com' },
                    firstName: { type: 'string', example: 'Marie' },
                    lastName: { type: 'string', example: 'Dupont' },
                    role: { type: 'string', example: 'buyer' },
                    phone: { type: 'string', example: '+33612345678' },
                    city: { type: 'string', example: 'Paris' },
                    postalCode: { type: 'string', example: '75001' },
                    profile: { type: 'object' },
                    rating: { type: 'number', example: 4.5 },
                    createdAt: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          },
          401: { description: 'Non authentifié' },
          404: { description: 'Utilisateur non trouvé' },
          500: { description: 'Erreur serveur' }
        }
      },
      patch: {
        summary: 'Modifier son profil utilisateur',
        tags: ['Utilisateurs'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  firstName: { type: 'string', example: 'Marie' },
                  lastName: { type: 'string', example: 'Dupont' },
                  phone: { type: 'string', example: '+33612345678' },
                  city: { type: 'string', example: 'Paris' },
                  postalCode: { type: 'string', example: '75001' },
                  profile: {
                    type: 'object',
                    description: 'Données JSON personnalisées (bio, préférences, etc.)'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Profil mis à jour avec succès' },
          400: { description: 'Aucune donnée fournie' },
          401: { description: 'Non authentifié' },
          500: { description: 'Erreur serveur' }
        }
      },
      delete: {
        summary: 'Supprimer son compte utilisateur',
        tags: ['Utilisateurs'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['password'],
                properties: {
                  password: {
                    type: 'string',
                    example: 'Test1234!',
                    description: 'Mot de passe actuel pour confirmer la suppression'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Compte supprimé avec succès' },
          400: { description: 'Mot de passe manquant' },
          401: { description: 'Non authentifié ou mot de passe incorrect' },
          404: { description: 'Utilisateur non trouvé' },
          500: { description: 'Erreur serveur' }
        }
      }
    },
    '/api/users': {
      get: {
        summary: 'Récupérer tous les utilisateurs (admin uniquement)',
        tags: ['Utilisateurs', 'Administration'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Liste des utilisateurs récupérée',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                      email: { type: 'string', example: 'user@example.com' },
                      firstName: { type: 'string', example: 'Marie' },
                      lastName: { type: 'string', example: 'Dupont' },
                      role: { type: 'string', example: 'seller' },
                      phone: { type: 'string', example: '+33612345678' },
                      city: { type: 'string', example: 'Paris' },
                      postalCode: { type: 'string', example: '75001' },
                      profile: { type: 'object' },
                      rating: { type: 'number', example: 4.5 },
                      createdAt: { type: 'string', format: 'date-time' }
                    }
                  }
                }
              }
            }
          },
          401: { description: 'Non authentifié' },
          403: { description: 'Accès réservé aux administrateurs' },
          500: { description: 'Erreur serveur' }
        }
      }
    },
    '/api/users/{id}': {
      get: {
        summary: 'Récupérer le profil public d\'un utilisateur (vendeur)',
        tags: ['Utilisateurs'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'ID de l\'utilisateur',
            example: '507f1f77bcf86cd799439011'
          }
        ],
        responses: {
          200: {
            description: 'Profil public récupéré',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    role: { type: 'string' },
                    city: { type: 'string' },
                    rating: { type: 'number' },
                    createdAt: { type: 'string', format: 'date-time' },
                    stats: {
                      type: 'object',
                      properties: {
                        activeProducts: { type: 'number', example: 12 },
                        completedSales: { type: 'number', example: 45 }
                      },
                      description: 'Statistiques (si vendeur)'
                    }
                  }
                }
              }
            }
          },
          400: { description: 'ID manquant' },
          404: { description: 'Utilisateur non trouvé' },
          500: { description: 'Erreur serveur' }
        }
      }
    },
    '/api/admin/rgpd/cleanup': {
      post: {
        summary: 'Nettoyer les comptes anonymisés expirés',
        tags: ['Administration'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  daysToKeep: {
                    type: 'integer',
                    example: 30,
                    description: 'Nombre de jours avant suppression des comptes anonymisés'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Nettoyage RGPD terminé',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Nettoyage RGPD terminé.' },
                    deletedCount: { type: 'integer', example: 12 },
                    daysToKeep: { type: 'integer', example: 30 }
                  }
                }
              }
            }
          },
          401: { description: 'Non authentifié' },
          403: { description: 'Accès refusé. Admin requis' },
          500: { description: 'Erreur serveur' }
        }
      }
    },
    '/api/admin/users/{id}': {
      patch: {
        summary: 'Admin: modifier un utilisateur',
        tags: ['Administration'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: '507f1f77bcf86cd799439011'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  firstName: { type: 'string', example: 'Marie' },
                  lastName: { type: 'string', example: 'Dupont' },
                   role: { type: 'string', enum: ['buyer', 'seller', 'admin'], example: 'seller' },
                  phone: { type: 'string', example: '+33612345678' },
                  city: { type: 'string', example: 'Paris' },
                  postalCode: { type: 'string', example: '75001' },
                  profile: { type: 'object', description: 'Données JSON personnalisées' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Utilisateur mis à jour',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Utilisateur mis à jour.' },
                    user: { type: 'object' }
                  }
                }
              }
            }
          },
          400: { description: 'Aucune donnée fournie ou rôle invalide' },
          401: { description: 'Non authentifié' },
          403: { description: 'Accès réservé aux administrateurs' },
          404: { description: 'Utilisateur non trouvé' },
          500: { description: 'Erreur serveur' }
        }
      },
      delete: {
        summary: 'Admin: supprimer un utilisateur (RGPD)',
        tags: ['Administration'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            example: '507f1f77bcf86cd799439011'
          }
        ],
        responses: {
          200: {
            description: 'Utilisateur supprimé (anonymisé RGPD)',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Utilisateur supprimé (anonymisé RGPD).' }
                  }
                }
              }
            }
          },
          400: { description: 'ID manquant ou tentative de suppression de son propre compte' },
          401: { description: 'Non authentifié' },
          403: { description: 'Accès réservé aux administrateurs' },
          404: { description: 'Utilisateur non trouvé' },
          500: { description: 'Erreur serveur' }
        }
      }
    },
    '/api/checkout/create-session': {
      post: {
        summary: 'Créer une session de paiement Stripe',
        description: 'Génère un lien de paiement Stripe Checkout basé sur le panier actuel de l\'utilisateur connecté.',
        tags: ['Paiement'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Session créée avec succès. Retourne l\'URL vers laquelle rediriger l\'utilisateur.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    url: {
                      type: 'string',
                      example: 'https://checkout.stripe.com/c/pay/cs_test_a1b2c3d4e5f6g7h8i9j0...'
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Panier vide',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Votre panier est vide.' }
                  }
                }
              }
            }
          },
          401: {
            description: 'Non autorisé (Token manquant ou invalide)'
          },
          500: {
            description: 'Erreur serveur lors de la communication avec Stripe'
          }
        }
      }
    },
    '/api/upload': {
      post: {
        summary: 'Uploader une image sur Cloudinary',
        tags: ['Médias'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Le fichier image à uploader (jpg, png, webp)'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Image uploadée avec succès (retourne l\'URL Cloudinary)' },
          400: { description: 'Aucun fichier fourni' },
          500: { description: 'Erreur serveur lors de l\'upload' }
        }
      }
    }
  }
};
