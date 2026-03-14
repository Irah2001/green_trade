import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("[SEED] Démarrage...\n");

  const sellerPassword = await bcrypt.hash("password+123", 10);
  const buyerPassword = await bcrypt.hash("password+123", 10);
  const seller2Password = await bcrypt.hash("password+123", 10);

  // Créer les utilisateurs
  console.log("Création des utilisateurs...");
  
  const seller = await prisma.user.upsert({
    where: { email: "seller@example.com" },
    update: {
      passwordHash: sellerPassword,
      firstName: "Alice",
      lastName: "Seller",
      profile: { bio: "Vendeur passionné d'objets vintage" },
      favoriteProducts: [],
      rating: 4.8,
    },
    create: {
      email: "seller@example.com",
      passwordHash: sellerPassword,
      firstName: "Alice",
      lastName: "Seller",
      profile: { bio: "Vendeur passionné d'objets vintage" },
      favoriteProducts: [],
      rating: 4.8,
    },
  });
  console.log("✓ Vendeur créé: Alice Seller (seller@example.com)");

  const buyer = await prisma.user.upsert({
    where: { email: "buyer@example.com" },
    update: {
      passwordHash: buyerPassword,
      firstName: "Bob",
      lastName: "Buyer",
      profile: { bio: "À la recherche de bonnes affaires" },
      favoriteProducts: [],
      rating: 4.5,
    },
    create: {
      email: "buyer@example.com",
      passwordHash: buyerPassword,
      firstName: "Bob",
      lastName: "Buyer",
      profile: { bio: "À la recherche de bonnes affaires" },
      favoriteProducts: [],
      rating: 4.5,
    },
  });
  console.log("✓ Acheteur créé: Bob Buyer (buyer@example.com)");

  // Créer un autre vendeur
  const seller2 = await prisma.user.upsert({
    where: { email: "marie@example.com" },
    update: {
      passwordHash: seller2Password,
      firstName: "Marie",
      lastName: "Dupont",
      profile: { bio: "Vente d'articles de sport" },
      favoriteProducts: [],
      rating: 4.9,
    },
    create: {
      email: "marie@example.com",
      passwordHash: seller2Password,
      firstName: "Marie",
      lastName: "Dupont",
      profile: { bio: "Vente d'articles de sport" },
      favoriteProducts: [],
      rating: 4.9,
    },
  });
  console.log("✓ Vendeur créé: Marie Dupont (marie@example.com)");

  // Créer les produits
  console.log("\nCréation des produits...");
  
  const existingProduct1 = await prisma.product.findFirst({ where: { title: "Veste vintage en cuir" } });
  let product1;
  if (existingProduct1) {
    product1 = existingProduct1;
  } else {
    product1 = await prisma.product.create({
      data: {
        sellerId: seller.id,
        title: "Veste vintage en cuir",
        description: "Belle veste en cuir véritable, style années 80. Taille M. Parfait état.",
        price: 45,
        currency: "EUR",
        category: "vetements",
        condition: "used",
        images: [],
        location: { city: "Paris", lat: 48.8566, lng: 2.3522 },
        status: "active",
        tags: ["vintage", "cuir", "veste", "mode"],
      },
    });
  }
  console.log("✓", product1.title);

  const existingProduct2 = await prisma.product.findFirst({ where: { title: "Chaussures running Nike" } });
  let product2;
  if (existingProduct2) {
    product2 = existingProduct2;
  } else {
    product2 = await prisma.product.create({
      data: {
        sellerId: seller.id,
        title: "Chaussures running Nike",
        description: "Chaussures de running confortables, taille 42. Peu utilisées, excellent état.",
        price: 30,
        currency: "EUR",
        category: "chaussures",
        condition: "used",
        images: [],
        location: { city: "Lyon", lat: 45.764, lng: 4.8357 },
        status: "active",
        tags: ["running", "sport", "nike"],
      },
    });
  }
  console.log("✓", product2.title);

  const existingProduct3 = await prisma.product.findFirst({ where: { title: "Vélo électrique VTT" } });
  let product3;
  if (existingProduct3) {
    product3 = existingProduct3;
  } else {
    product3 = await prisma.product.create({
      data: {
        sellerId: seller2.id,
        title: "Vélo électrique VTT",
        description: "VTT électrique en excellent état. Batterie neuve (autonomie 80km). Freins à disque.",
        price: 800,
        currency: "EUR",
        category: "sport",
        condition: "very_good",
        images: [],
        location: { city: "Marseille", lat: 43.2965, lng: 5.3698 },
        status: "active",
        tags: ["vélo", "électrique", "sport", "vtt"],
      },
    });
  }
  console.log("✓", product3.title);

  const product4 = await prisma.product.create({
    data: {
      sellerId: seller2.id,
      title: "MacBook Pro 2020",
      description: "MacBook Pro 13 pouces, 16Go RAM, 512Go SSD. État impeccable, jamais eu de problème.",
      price: 950,
      currency: "EUR",
      category: "electronique",
      condition: "very_good",
      images: [],
      location: { city: "Toulouse", lat: 43.6047, lng: 1.4442 },
      status: "active",
      tags: ["ordinateur", "apple", "macbook", "informatique"],
    },
  });
  console.log("✓", product4.title);

  const product5 = await prisma.product.create({
    data: {
      sellerId: seller.id,
      title: "Table basse scandinave",
      description: "Table basse en bois clair, style scandinave. Dimensions: 100x60cm.",
      price: 120,
      currency: "EUR",
      category: "mobilier",
      condition: "good",
      images: [],
      location: { city: "Bordeaux", lat: 44.8378, lng: -0.5792 },
      status: "active",
      tags: ["meuble", "scandinave", "table", "déco"],
    },
  });
  console.log("✓", product5.title);

  console.log("\n🎉 Seed terminé avec succès!\n");
  console.log("📊 Données créées:");
  console.log("  - 3 utilisateurs");
  console.log("  - 5 produits\n");
  console.log("🔑 Identifiants de connexion:");
  console.log("  Email: seller@example.com | buyer@example.com | marie@example.com");
  console.log("  Mot de passe: password+123\n");
  console.log("💡 Utilisez Prisma Studio pour voir les données:");
  console.log("  pnpm prisma studio\n");
  console.log("🔌 Connectez MongoDB Compass avec:");
  console.log("  mongodb://localhost:27017/greentrade?replicaSet=rs0&directConnection=true\n");
}

main()
  .catch((e) => {
    console.error("\n❌ Erreur lors du seed:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
