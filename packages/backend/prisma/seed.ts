import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const password = "password+123";
const now = new Date();

const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

async function main() {
  console.log("[SEED] Réinitialisation des données de démonstration...\n");

  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.conversation.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash(password, 10);

  console.log("Création des utilisateurs...");

  const admin = await prisma.user.create({
    data: {
      email: "admin@greentrade.fr",
      passwordHash,
      firstName: "Aline",
      lastName: "Martin",
      role: "admin",
      phone: "+33600000001",
      city: "Nantes",
      postalCode: "44000",
      profile: {
        bio: "Compte administrateur de démonstration.",
        locale: "fr-FR",
      },
      favoriteProducts: [],
      rating: 5,
      createdAt: daysAgo(45),
    },
  });
  console.log("✓ Admin créé: Aline Martin (admin@greentrade.fr)");

  const sellerBio = await prisma.user.create({
    data: {
      email: "camille@ferme-camille.fr",
      passwordHash,
      firstName: "Camille",
      lastName: "Durand",
      role: "seller",
      phone: "+33600000002",
      city: "Angers",
      postalCode: "49000",
      profile: {
        bio: "Productrice de légumes bio en circuit court.",
        shopName: "Ferme Camille",
        deliveryRadiusKm: 35,
      },
      favoriteProducts: [],
      rating: 4.9,
      createdAt: daysAgo(38),
    },
  });
  console.log("✓ Vendeur créé: Camille Durand (camille@ferme-camille.fr)");

  const sellerTech = await prisma.user.create({
    data: {
      email: "thomas@atelier-thomas.fr",
      passwordHash,
      firstName: "Thomas",
      lastName: "Leclerc",
      role: "seller",
      phone: "+33600000003",
      city: "Lille",
      postalCode: "59000",
      profile: {
        bio: "Artisan spécialisé dans les produits reconditionnés et la seconde main.",
        shopName: "Atelier Thomas",
      },
      favoriteProducts: [],
      rating: 4.7,
      createdAt: daysAgo(32),
    },
  });
  console.log("✓ Vendeur créé: Thomas Leclerc (thomas@atelier-thomas.fr)");

  const buyerParis = await prisma.user.create({
    data: {
      email: "emma.dupont@example.com",
      passwordHash,
      firstName: "Emma",
      lastName: "Petit",
      role: "buyer",
      phone: "+33600000004",
      city: "Paris",
      postalCode: "75011",
      profile: {
        bio: "Acheteuse régulière, privilégie le bio et la seconde main.",
        preferences: ["bio", "local", "seconde main"],
      },
      favoriteProducts: [],
      rating: 4.6,
      createdAt: daysAgo(21),
    },
  });
  console.log("✓ Acheteur créé: Emma Petit (emma.dupont@example.com)");

  const buyerLyon = await prisma.user.create({
    data: {
      email: "lucas.moreau@example.com",
      passwordHash,
      firstName: "Lucas",
      lastName: "Moreau",
      role: "buyer",
      phone: "+33600000005",
      city: "Lyon",
      postalCode: "69003",
      profile: {
        bio: "Client occasionnel qui commande surtout des produits reconditionnés.",
        preferences: ["electronique", "mode", "sport"],
      },
      favoriteProducts: [],
      rating: 4.4,
      createdAt: daysAgo(16),
    },
  });
  console.log("✓ Acheteur créé: Lucas Moreau (lucas.moreau@example.com)");

  const archivedUser = await prisma.user.create({
    data: {
      email: "deleted-old-account@anonymized.local",
      passwordHash,
      firstName: "Utilisateur",
      lastName: "Supprimé",
      role: "buyer",
      phone: null,
      city: null,
      postalCode: null,
      profile: {
        deleted: true,
        deletedAt: daysAgo(45).toISOString(),
      },
      favoriteProducts: [],
      rating: null,
      createdAt: daysAgo(60),
    },
  });
  console.log("✓ Compte anonymisé de test créé: deleted-old-account@anonymized.local");

  console.log("\nCréation des produits...");

  const product1 = await prisma.product.create({
    data: {
      sellerId: sellerBio.id,
      title: "Panier de légumes bio - 5kg",
      description:
        "Sélection hebdomadaire de légumes de saison récoltés en circuit court. Contient 5 à 7 variétés selon la semaine.",
      price: 18,
      currency: "EUR",
      category: "alimentation",
      condition: "new",
      images: ["https://placehold.co/800x600?text=Panier+de+l%C3%A9gumes+bio"],
      location: { city: "Angers", region: "Pays de la Loire", lat: 47.4784, lng: -0.5632 },
      status: "active",
      tags: ["bio", "local", "legumes", "saisonnier"],
      createdAt: daysAgo(14),
    },
  });
  console.log("✓", product1.title);

  const product2 = await prisma.product.create({
    data: {
      sellerId: sellerBio.id,
      title: "Miel de fleurs 500g",
      description:
        "Miel artisanal récolté en Anjou. Texture fluide, goût floral, pot en verre recyclé.",
      price: 9.5,
      currency: "EUR",
      category: "alimentation",
      condition: "new",
      images: ["https://placehold.co/800x600?text=Miel+de+fleurs"],
      location: { city: "Angers", region: "Pays de la Loire", lat: 47.4784, lng: -0.5632 },
      status: "active",
      tags: ["miel", "artisanal", "local", "douceur"],
      createdAt: daysAgo(13),
    },
  });
  console.log("✓", product2.title);

  const product3 = await prisma.product.create({
    data: {
      sellerId: sellerBio.id,
      title: "Savon artisanal lavande",
      description:
        "Savon solide fabriqué à froid, parfum lavande, adapté aux peaux sensibles.",
      price: 6.5,
      currency: "EUR",
      category: "beaute",
      condition: "new",
      images: ["https://placehold.co/800x600?text=Savon+lavande"],
      location: { city: "Angers", region: "Pays de la Loire", lat: 47.4784, lng: -0.5632 },
      status: "active",
      tags: ["savon", "artisanat", "bien-etre"],
      createdAt: daysAgo(12),
    },
  });
  console.log("✓", product3.title);

  const product4 = await prisma.product.create({
    data: {
      sellerId: sellerTech.id,
      title: 'MacBook Pro 13" reconditionné',
      description:
        "MacBook Pro 13 pouces, 16 Go de RAM, 512 Go SSD. Batterie contrôlée et système réinstallé.",
      price: 999,
      currency: "EUR",
      category: "electronique",
      condition: "very_good",
      images: ["https://placehold.co/800x600?text=MacBook+Pro+reconditionn%C3%A9"],
      location: { city: "Lille", region: "Hauts-de-France", lat: 50.6292, lng: 3.0573 },
      status: "active",
      tags: ["apple", "ordinateur", "reconditionne", "tech"],
      createdAt: daysAgo(11),
    },
  });
  console.log("✓", product4.title);

  const product5 = await prisma.product.create({
    data: {
      sellerId: sellerTech.id,
      title: "Veste en jean vintage",
      description:
        "Veste en denim bleu, coupe droite, style vintage années 90. Très bon état.",
      price: 32,
      currency: "EUR",
      category: "vetements",
      condition: "good",
      images: ["https://placehold.co/800x600?text=Veste+en+jean+vintage"],
      location: { city: "Lille", region: "Hauts-de-France", lat: 50.6292, lng: 3.0573 },
      status: "active",
      tags: ["vintage", "mode", "denim", "seconde main"],
      createdAt: daysAgo(10),
    },
  });
  console.log("✓", product5.title);

  const product6 = await prisma.product.create({
    data: {
      sellerId: sellerTech.id,
      title: "Vélo ville reconditionné",
      description:
        "Vélo urbain révisé en atelier, éclairage neuf, pneus renforcés et antivol inclus.",
      price: 280,
      currency: "EUR",
      category: "sport",
      condition: "good",
      images: ["https://placehold.co/800x600?text=V%C3%A9lo+de+ville"],
      location: { city: "Lyon", region: "Auvergne-Rhône-Alpes", lat: 45.764, lng: 4.8357 },
      status: "active",
      tags: ["velo", "reconditionne", "ville", "mobilite"],
      createdAt: daysAgo(9),
    },
  });
  console.log("✓", product6.title);

  await prisma.user.update({
    where: { id: buyerParis.id },
    data: {
      favoriteProducts: [product1.id, product2.id, product4.id],
    },
  });

  await prisma.user.update({
    where: { id: buyerLyon.id },
    data: {
      favoriteProducts: [product4.id, product5.id, product6.id],
    },
  });

  console.log("\nCréation des conversations et messages...");

  const conversation = await prisma.conversation.create({
    data: {
      participantIds: [buyerParis.id, sellerBio.id],
      productId: product1.id,
      lastActivityAt: daysAgo(1),
      createdAt: daysAgo(2),
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: sellerBio.id,
      content: "Bonjour Emma, le panier est prêt pour une livraison jeudi matin.",
      isRead: true,
      createdAt: daysAgo(2),
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: buyerParis.id,
      content: "Parfait, je confirme la commande. Merci !",
      isRead: false,
      createdAt: daysAgo(1),
    },
  });

  console.log("✓ Conversation d\'exemple créée");

  console.log("\nCréation du panier et des articles...");

  const cart = await prisma.cart.create({
    data: {
      userId: buyerLyon.id,
      createdAt: daysAgo(3),
    },
  });

  await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: product4.id,
      quantity: 1,
      unitPriceSnapshot: 999,
    },
  });

  await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: product5.id,
      quantity: 2,
      unitPriceSnapshot: 32,
    },
  });

  console.log("✓ Panier de démonstration créé pour Lucas Moreau");

  console.log("\nCréation des commandes...");

  const deliveredOrder = await prisma.transaction.create({
    data: {
      buyerId: buyerParis.id,
      sellerId: sellerBio.id,
      productId: product2.id,
      amount: 28.5,
      quantity: 3,
      currency: "EUR",
      status: "delivered",
      trackingNumber: "FR-2026-000128",
      carrier: "Colissimo",
      trackingUrl: "https://tracking.colissimo.fr/FR-2026-000128",
      shippedAt: daysAgo(2),
      deliveredAt: daysAgo(1),
      createdAt: daysAgo(4),
    },
  });

  const pendingOrder = await prisma.transaction.create({
    data: {
      buyerId: buyerLyon.id,
      sellerId: sellerTech.id,
      productId: product5.id,
      amount: 32,
      quantity: 1,
      currency: "EUR",
      status: "pending",
      createdAt: daysAgo(1),
    },
  });

  console.log("✓ Commande livrée: ", deliveredOrder.id);
  console.log("✓ Commande en attente: ", pendingOrder.id);

  console.log("\n🎉 Seed terminé avec succès!\n");
  console.log("📊 Données créées:");
  console.log("  - 6 utilisateurs (dont 1 admin et 1 compte anonymisé de test)");
  console.log("  - 6 produits");
  console.log("  - 1 conversation et 2 messages");
  console.log("  - 1 panier et 2 articles de panier");
  console.log("  - 2 commandes\n");
  console.log("🔑 Comptes de démonstration:");
  console.log("  Admin: admin@greentrade.fr");
  console.log("  Vendeur bio: camille@ferme-camille.fr");
  console.log("  Vendeur tech: thomas@atelier-thomas.fr");
  console.log("  Acheteuse: emma.dupont@example.com");
  console.log("  Acheteur: lucas.moreau@example.com");
  console.log(`  Mot de passe: ${password}\n`);
  console.log("💡 Utilisez Prisma Studio pour voir les données:");
  console.log("  pnpm prisma studio\n");
}

main()
  .catch((e) => {
    console.error("\n❌ Erreur lors du seed:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
