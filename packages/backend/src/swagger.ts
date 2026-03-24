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
          200: { description: 'Liste des commandes (achetées et vendues)' },
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
    '/api/admin/stats': {
      get: {
        summary: 'Récupérer les statistiques globales de la plateforme',
        description: 'Retourne les statistiques complètes: utilisateurs, produits, commandes, revenus (Admin uniquement)',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Statistiques récupérées avec succès',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    totalUsers: { type: 'number', example: 156 },
                    totalProducts: { type: 'number', example: 423 },
                    totalOrders: { type: 'number', example: 89 },
                    totalRevenue: { type: 'number', example: 4567.89 },
                    ordersByStatus: {
                      type: 'object',
                      properties: {
                        pending: { type: 'number', example: 12 },
                        paid: { type: 'number', example: 34 },
                        shipped: { type: 'number', example: 28 },
                        delivered: { type: 'number', example: 15 }
                      }
                    },
                    recentOrders: { type: 'number', example: 23 }
                  }
                }
              }
            }
          },
          403: { description: 'Accès refusé (rôle admin requis)' },
          500: { description: 'Erreur serveur' }
        }
      }
    },
    '/api/admin/users': {
      get: {
        summary: 'Récupérer tous les utilisateurs',
        description: 'Liste tous les utilisateurs avec pagination et filtres (Admin uniquement)',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer', default: 1 },
            description: 'Numéro de page'
          },
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer', default: 20 },
            description: 'Nombre d\'éléments par page'
          },
          {
            in: 'query',
            name: 'role',
            schema: { type: 'string', enum: ['all', 'buyer', 'farmer', 'admin'] },
            description: 'Filtrer par rôle'
          },
          {
            in: 'query',
            name: 'search',
            schema: { type: 'string' },
            description: 'Rechercher par email, prénom ou nom'
          }
        ],
        responses: {
          200: { description: 'Liste des utilisateurs avec pagination' },
          403: { description: 'Accès refusé' },
          500: { description: 'Erreur serveur' }
        }
      }
    },
    '/api/admin/orders': {
      get: {
        summary: 'Récupérer toutes les commandes',
        description: 'Liste toutes les commandes avec pagination et filtres (Admin uniquement)',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer', default: 1 },
            description: 'Numéro de page'
          },
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer', default: 20 },
            description: 'Nombre d\'éléments par page'
          },
          {
            in: 'query',
            name: 'status',
            schema: { type: 'string', enum: ['all', 'pending', 'paid', 'shipped', 'delivered'] },
            description: 'Filtrer par statut'
          }
        ],
        responses: {
          200: { description: 'Liste des commandes avec pagination' },
          403: { description: 'Accès refusé' },
          500: { description: 'Erreur serveur' }
        }
      }
    },
    '/api/admin/products': {
      get: {
        summary: 'Récupérer tous les produits',
        description: 'Liste tous les produits y compris inactifs avec pagination (Admin uniquement)',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer', default: 1 },
            description: 'Numéro de page'
          },
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer', default: 20 },
            description: 'Nombre d\'éléments par page'
          },
          {
            in: 'query',
            name: 'status',
            schema: { type: 'string', enum: ['all', 'active', 'inactive', 'deleted'] },
            description: 'Filtrer par statut'
          }
        ],
        responses: {
          200: { description: 'Liste des produits avec pagination' },
          403: { description: 'Accès refusé' },
          500: { description: 'Erreur serveur' }
        }
      }
    },
    '/api/admin/users/{id}/ban': {
      patch: {
        summary: 'Bannir ou débannir un utilisateur',
        description: 'Bloque ou débloque l\'accès d\'un utilisateur à la plateforme (Admin uniquement)',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
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
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['isBanned'],
                properties: {
                  isBanned: {
                    type: 'boolean',
                    example: true,
                    description: 'true pour bannir, false pour débannir'
                  },
                  reason: {
                    type: 'string',
                    example: 'Violation des conditions d\'utilisation',
                    description: 'Raison du bannissement (optionnel)'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Utilisateur banni/débanni avec succès' },
          400: { description: 'Données invalides' },
          403: { description: 'Accès refusé ou tentative de bannir un admin' },
          404: { description: 'Utilisateur non trouvé' },
          500: { description: 'Erreur serveur' }
        }
      }
    },
    '/api/admin/rgpd/cleanup': {
      post: {
        summary: 'Nettoyage RGPD des comptes anonymisés',
        description: 'Supprime les comptes anonymisés après le délai de rétention (Admin uniquement)',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  daysToKeep: {
                    type: 'number',
                    default: 30,
                    example: 30,
                    description: 'Nombre de jours de rétention'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Nettoyage RGPD effectué avec succès' },
          403: { description: 'Accès refusé' },
          500: { description: 'Erreur serveur' }
        }
      }
    }
  }
};