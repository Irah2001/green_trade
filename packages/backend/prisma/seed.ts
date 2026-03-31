import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

function getSeedPassword(): string {
  const seedPassword = process.env.SEED_PASSWORD;

  if (!seedPassword) {
  throw new Error("Missing SEED_PASSWORD environment variable.");
  }

  return seedPassword;
}

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

  const passwordHash = await bcrypt.hash(getSeedPassword(), 10);

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
      profile: { bio: "Compte administrateur de démonstration.", locale: "fr-FR" },
      favoriteProducts: [],
      rating: 5,
      createdAt: daysAgo(60),
    },
  });
  console.log("✓ Admin:", admin.email);

  const camille = await prisma.user.create({
    data: {
      email: "camille@ferme-camille.fr",
      passwordHash,
      firstName: "Camille",
      lastName: "Durand",
      role: "seller",
      phone: "+33600000002",
      city: "Angers",
      postalCode: "49000",
      profile: { bio: "Maraîchère bio en circuit court depuis 10 ans.", shopName: "Ferme Camille" },
      favoriteProducts: [],
      rating: 4.9,
      createdAt: daysAgo(50),
    },
  });

  const thomas = await prisma.user.create({
    data: {
      email: "thomas@atelier-thomas.fr",
      passwordHash,
      firstName: "Thomas",
      lastName: "Leclerc",
      role: "seller",
      phone: "+33600000003",
      city: "Lille",
      postalCode: "59000",
      profile: { bio: "Agriculteur spécialisé dans les légumes du Nord.", shopName: "Ferme du Nord" },
      favoriteProducts: [],
      rating: 4.7,
      createdAt: daysAgo(45),
    },
  });

  const sophie = await prisma.user.create({
    data: {
      email: "sophie@verger-soleil.fr",
      passwordHash,
      firstName: "Sophie",
      lastName: "Renard",
      role: "seller",
      phone: "+33600000006",
      city: "Montpellier",
      postalCode: "34000",
      profile: { bio: "Arboricultrice, spécialiste des fruits du Sud.", shopName: "Verger du Soleil" },
      favoriteProducts: [],
      rating: 4.8,
      createdAt: daysAgo(40),
    },
  });

  const marc = await prisma.user.create({
    data: {
      email: "marc@mas-provence.fr",
      passwordHash,
      firstName: "Marc",
      lastName: "Blanc",
      role: "seller",
      phone: "+33600000007",
      city: "Aix-en-Provence",
      postalCode: "13100",
      profile: { bio: "Producteur d'huiles et d'herbes aromatiques de Provence.", shopName: "Mas de Provence" },
      favoriteProducts: [],
      rating: 4.6,
      createdAt: daysAgo(35),
    },
  });

  const lea = await prisma.user.create({
    data: {
      email: "lea@ruche-bretagne.fr",
      passwordHash,
      firstName: "Léa",
      lastName: "Morin",
      role: "seller",
      phone: "+33600000008",
      city: "Rennes",
      postalCode: "35000",
      profile: { bio: "Apicultrice bio, miels et produits de la ruche.", shopName: "La Ruche Bretonne" },
      favoriteProducts: [],
      rating: 4.9,
      createdAt: daysAgo(30),
    },
  });

  const emma = await prisma.user.create({
    data: {
      email: "emma.dupont@example.com",
      passwordHash,
      firstName: "Emma",
      lastName: "Petit",
      role: "buyer",
      phone: "+33600000004",
      city: "Paris",
      postalCode: "75011",
      profile: { bio: "Acheteuse régulière, privilégie le bio et le local." },
      favoriteProducts: [],
      rating: 4.6,
      createdAt: daysAgo(21),
    },
  });

  const lucas = await prisma.user.create({
    data: {
      email: "lucas.moreau@example.com",
      passwordHash,
      firstName: "Lucas",
      lastName: "Moreau",
      role: "buyer",
      phone: "+33600000005",
      city: "Lyon",
      postalCode: "69003",
      profile: { bio: "Client occasionnel, fan de produits locaux." },
      favoriteProducts: [],
      rating: 4.4,
      createdAt: daysAgo(16),
    },
  });

  console.log("✓ 7 utilisateurs créés (1 admin, 5 vendeurs, 2 acheteurs)");
  console.log("\nCréation des 20 produits...");

  // --- Camille (Angers) — légumes ---
  const p1 = await prisma.product.create({ data: {
    sellerId: camille.id, title: "Panier de légumes bio - 5kg",
    description: "Sélection hebdomadaire de légumes de saison en circuit court. 5 à 7 variétés : courgettes, carottes, tomates, épinards...",
    price: 18, currency: "EUR", category: "baskets", condition: "new",
    images: ["https://placehold.co/800x600/4A7C59/white?text=Panier+legumes+bio"],
    location: { city: "Angers", region: "Pays de la Loire", lat: 47.4784, lng: -0.5632 },
    status: "active", tags: ["bio", "local", "légumes", "saisonnier"], quantity: 20, unit: "panier", createdAt: daysAgo(14),
  }});
  console.log("✓", p1.title);

  const p2 = await prisma.product.create({ data: {
    sellerId: camille.id, title: "Tomates cerises bio - 500g",
    description: "Tomates cerises cultivées sans pesticides, récoltées à maturité. Idéales en salade ou à grignoter.",
    price: 4.5, currency: "EUR", category: "vegetables", condition: "new",
    images: ["https://placehold.co/800x600/e74c3c/white?text=Tomates+cerises+bio"],
    location: { city: "Angers", region: "Pays de la Loire", lat: 47.4784, lng: -0.5632 },
    status: "active", tags: ["bio", "tomates", "local"], quantity: 50, unit: "barquette", createdAt: daysAgo(3),
  }});
  console.log("✓", p2.title);

  const p3 = await prisma.product.create({ data: {
    sellerId: camille.id, title: "Courgettes bio - 1kg",
    description: "Courgettes vertes récoltées à la main, tendres et savoureuses. Idéales pour ratatouilles et gratins.",
    price: 3.5, currency: "EUR", category: "vegetables", condition: "new",
    images: ["https://placehold.co/800x600/27ae60/white?text=Courgettes+bio"],
    location: { city: "Angers", region: "Pays de la Loire", lat: 47.4784, lng: -0.5632 },
    status: "active", tags: ["bio", "courgettes", "légumes"], quantity: 40, unit: "kg", createdAt: daysAgo(2),
  }});
  console.log("✓", p3.title);

  const p4 = await prisma.product.create({ data: {
    sellerId: camille.id, title: "Confiture de framboises maison - 350g",
    description: "Confiture artisanale avec des framboises du jardin, peu sucrée pour garder le goût du fruit.",
    price: 6.5, currency: "EUR", category: "baskets", condition: "new",
    images: ["https://placehold.co/800x600/c0392b/white?text=Confiture+framboises"],
    location: { city: "Angers", region: "Pays de la Loire", lat: 47.4784, lng: -0.5632 },
    status: "active", tags: ["confiture", "artisanal", "framboises", "maison"], quantity: 20, unit: "pot", createdAt: daysAgo(5),
  }});
  console.log("✓", p4.title);

  // --- Sophie (Montpellier) — fruits ---
  const p5 = await prisma.product.create({ data: {
    sellerId: sophie.id, title: "Abricots du Languedoc - 1kg",
    description: "Abricots Bergeron cueillis à pleine maturité. Goût sucré et parfumé, idéals pour confitures ou à déguster nature.",
    price: 5.5, currency: "EUR", category: "fruits", condition: "new",
    images: ["https://placehold.co/800x600/e67e22/white?text=Abricots+Languedoc"],
    location: { city: "Montpellier", region: "Occitanie", lat: 43.6117, lng: 3.8767 },
    status: "active", tags: ["fruits", "local", "été"], quantity: 60, unit: "kg", createdAt: daysAgo(5),
  }});
  console.log("✓", p5.title);

  const p6 = await prisma.product.create({ data: {
    sellerId: sophie.id, title: "Pêches blanches - 1kg",
    description: "Pêches blanches à chair fine, cueillies à la main sur notre verger familial en Occitanie.",
    price: 6, currency: "EUR", category: "fruits", condition: "new",
    images: ["https://placehold.co/800x600/f1948a/white?text=Peches+blanches"],
    location: { city: "Montpellier", region: "Occitanie", lat: 43.6117, lng: 3.8767 },
    status: "active", tags: ["fruits", "pêches", "été"], quantity: 45, unit: "kg", createdAt: daysAgo(4),
  }});
  console.log("✓", p6.title);

  const p7 = await prisma.product.create({ data: {
    sellerId: sophie.id, title: "Panier de fruits de saison - 3kg",
    description: "Assortiment de fruits cueillis dans notre verger : abricots, pêches, nectarines. Idéal pour une semaine fruitée.",
    price: 14, currency: "EUR", category: "baskets", condition: "new",
    images: ["https://placehold.co/800x600/f39c12/white?text=Panier+fruits+saison"],
    location: { city: "Montpellier", region: "Occitanie", lat: 43.6117, lng: 3.8767 },
    status: "active", tags: ["fruits", "panier", "local", "varié"], quantity: 15, unit: "panier", createdAt: daysAgo(6),
  }});
  console.log("✓", p7.title);

  const p8 = await prisma.product.create({ data: {
    sellerId: sophie.id, title: "Raisins muscat - 1kg",
    description: "Raisins muscat à grains dorés, très sucrés et parfumés. Cultivés sur les collines de l'Hérault.",
    price: 6.5, currency: "EUR", category: "fruits", condition: "new",
    images: ["https://placehold.co/800x600/9b59b6/white?text=Raisins+muscat"],
    location: { city: "Montpellier", region: "Occitanie", lat: 43.6117, lng: 3.8767 },
    status: "active", tags: ["raisins", "fruits", "muscat"], quantity: 30, unit: "kg", createdAt: daysAgo(1),
  }});
  console.log("✓", p8.title);

  // --- Marc (Aix-en-Provence) — huile/herbes ---
  const p9 = await prisma.product.create({ data: {
    sellerId: marc.id, title: "Huile d'olive extra vierge - 50cl",
    description: "Huile d'olive première pression à froid, variété Aglandau. Notes de fruits verts, légèrement poivrée.",
    price: 12, currency: "EUR", category: "baskets", condition: "new",
    images: ["https://placehold.co/800x600/d4ac0d/white?text=Huile+olive+vierge"],
    location: { city: "Aix-en-Provence", region: "PACA", lat: 43.5297, lng: 5.4474 },
    status: "active", tags: ["huile", "olive", "bio", "provence"], quantity: 30, unit: "bouteille", createdAt: daysAgo(10),
  }});
  console.log("✓", p9.title);

  const p10 = await prisma.product.create({ data: {
    sellerId: marc.id, title: "Herbes de Provence séchées - 100g",
    description: "Mélange artisanal de thym, romarin, origan, sarriette et basilic séchés. Récolte manuelle en altitude.",
    price: 4, currency: "EUR", category: "baskets", condition: "new",
    images: ["https://placehold.co/800x600/7dcea0/white?text=Herbes+de+Provence"],
    location: { city: "Aix-en-Provence", region: "PACA", lat: 43.5297, lng: 5.4474 },
    status: "active", tags: ["herbes", "aromatiques", "provence", "séché"], quantity: 80, unit: "sachet", createdAt: daysAgo(8),
  }});
  console.log("✓", p10.title);

  const p11 = await prisma.product.create({ data: {
    sellerId: marc.id, title: "Ail rose de Provence - 500g",
    description: "Ail rose tressé à la main, séché naturellement. Variété locale à conservation longue durée.",
    price: 5, currency: "EUR", category: "vegetables", condition: "new",
    images: ["https://placehold.co/800x600/fadbd8/white?text=Ail+rose+Provence"],
    location: { city: "Aix-en-Provence", region: "PACA", lat: 43.5297, lng: 5.4474 },
    status: "active", tags: ["ail", "légumes", "provence"], quantity: 35, unit: "tresse", createdAt: daysAgo(7),
  }});
  console.log("✓", p11.title);

  // --- Léa (Rennes) — miel ---
  const p12 = await prisma.product.create({ data: {
    sellerId: lea.id, title: "Miel de fleurs sauvages - 500g",
    description: "Miel polyfloral récolté sur les prairies bretonnes. Texture crémeuse, arômes floraux complexes. Non chauffé.",
    price: 9.5, currency: "EUR", category: "baskets", condition: "new",
    images: ["https://placehold.co/800x600/f9ca24/white?text=Miel+fleurs+sauvages"],
    location: { city: "Rennes", region: "Bretagne", lat: 48.1173, lng: -1.6778 },
    status: "active", tags: ["miel", "apiculture", "bio", "bretagne"], quantity: 40, unit: "pot", createdAt: daysAgo(12),
  }});
  console.log("✓", p12.title);

  const p13 = await prisma.product.create({ data: {
    sellerId: lea.id, title: "Miel de sarrasin - 500g",
    description: "Miel foncé au goût puissant et malté, issu des champs de sarrasin breton. Riche en antioxydants.",
    price: 11, currency: "EUR", category: "baskets", condition: "new",
    images: ["https://placehold.co/800x600/6c5ce7/white?text=Miel+de+sarrasin"],
    location: { city: "Rennes", region: "Bretagne", lat: 48.1173, lng: -1.6778 },
    status: "active", tags: ["miel", "sarrasin", "bretagne"], quantity: 25, unit: "pot", createdAt: daysAgo(9),
  }});
  console.log("✓", p13.title);

  const p14 = await prisma.product.create({ data: {
    sellerId: lea.id, title: "Cire d'abeille naturelle - 100g",
    description: "Cire d'abeille pure, idéale pour fabriquer des emballages alimentaires réutilisables ou entretenir le bois.",
    price: 6, currency: "EUR", category: "baskets", condition: "new",
    images: ["https://placehold.co/800x600/f0b429/white?text=Cire+d+abeille"],
    location: { city: "Rennes", region: "Bretagne", lat: 48.1173, lng: -1.6778 },
    status: "active", tags: ["cire", "abeille", "naturel", "zérodéchet"], quantity: 50, unit: "bloc", createdAt: daysAgo(11),
  }});
  console.log("✓", p14.title);

  // --- Thomas (Lille) — légumes du Nord ---
  const p15 = await prisma.product.create({ data: {
    sellerId: thomas.id, title: "Pommes de terre Bintje - 5kg",
    description: "Pommes de terre variété Bintje, cultivées en Flandres. Idéales pour les frites et purées.",
    price: 7, currency: "EUR", category: "vegetables", condition: "new",
    images: ["https://placehold.co/800x600/d4a017/white?text=Pommes+de+terre"],
    location: { city: "Lille", region: "Hauts-de-France", lat: 50.6292, lng: 3.0573 },
    status: "active", tags: ["légumes", "pommes de terre", "local"], quantity: 30, unit: "sac", createdAt: daysAgo(6),
  }});
  console.log("✓", p15.title);

  const p16 = await prisma.product.create({ data: {
    sellerId: thomas.id, title: "Endives fraîches - 1kg",
    description: "Endives blanches et craquantes, cultivées en cave selon la méthode traditionnelle du Nord.",
    price: 4, currency: "EUR", category: "vegetables", condition: "new",
    images: ["https://placehold.co/800x600/bdc3c7/white?text=Endives+fraiches"],
    location: { city: "Lille", region: "Hauts-de-France", lat: 50.6292, lng: 3.0573 },
    status: "active", tags: ["endives", "légumes", "nord"], quantity: 45, unit: "kg", createdAt: daysAgo(3),
  }});
  console.log("✓", p16.title);

  const p17 = await prisma.product.create({ data: {
    sellerId: thomas.id, title: "Panier du Nord - légumes racines",
    description: "Assortiment de légumes racines : carottes, navets, poireaux, betteraves rouges. Idéal pour potées et soupes.",
    price: 15, currency: "EUR", category: "baskets", condition: "new",
    images: ["https://placehold.co/800x600/e74c3c/white?text=Panier+du+Nord"],
    location: { city: "Lille", region: "Hauts-de-France", lat: 50.6292, lng: 3.0573 },
    status: "active", tags: ["panier", "légumes", "nord", "hiver"], quantity: 20, unit: "panier", createdAt: daysAgo(4),
  }});
  console.log("✓", p17.title);

  const p18 = await prisma.product.create({ data: {
    sellerId: thomas.id, title: "Poireaux bio - botte de 6",
    description: "Poireaux cultivés sans herbicides, en pleine terre. Saveur douce, idéaux en vinaigrette ou au gratin.",
    price: 3.5, currency: "EUR", category: "vegetables", condition: "new",
    images: ["https://placehold.co/800x600/27ae60/white?text=Poireaux+bio"],
    location: { city: "Lille", region: "Hauts-de-France", lat: 50.6292, lng: 3.0573 },
    status: "active", tags: ["poireaux", "bio", "légumes"], quantity: 35, unit: "botte", createdAt: daysAgo(2),
  }});
  console.log("✓", p18.title);

  const p19 = await prisma.product.create({ data: {
    sellerId: thomas.id, title: "Carottes fanes bio - 1kg",
    description: "Carottes orange récoltées avec leurs fanes, cultivées en pleine terre. Croquantes et sucrées.",
    price: 3, currency: "EUR", category: "vegetables", condition: "new",
    images: ["https://placehold.co/800x600/e67e22/white?text=Carottes+fanes+bio"],
    location: { city: "Lille", region: "Hauts-de-France", lat: 50.6292, lng: 3.0573 },
    status: "active", tags: ["carottes", "bio", "légumes", "local"], quantity: 60, unit: "kg", createdAt: daysAgo(1),
  }});
  console.log("✓", p19.title);

  const p20 = await prisma.product.create({ data: {
    sellerId: marc.id, title: "Tapenade d'olives noires - 180g",
    description: "Tapenade artisanale préparée avec des olives noires, câpres et anchois. Recette provençale traditionnelle.",
    price: 7.5, currency: "EUR", category: "baskets", condition: "new",
    images: ["https://placehold.co/800x600/2c3e50/white?text=Tapenade+olives"],
    location: { city: "Aix-en-Provence", region: "PACA", lat: 43.5297, lng: 5.4474 },
    status: "active", tags: ["tapenade", "olives", "provence", "artisanal"], quantity: 25, unit: "pot", createdAt: daysAgo(3),
  }});
  console.log("✓", p20.title);

  await prisma.user.update({ where: { id: emma.id }, data: { favoriteProducts: [p1.id, p5.id, p12.id] } });
  await prisma.user.update({ where: { id: lucas.id }, data: { favoriteProducts: [p9.id, p15.id, p17.id] } });

  console.log("\nCréation d'une conversation exemple...");
  const conv = await prisma.conversation.create({
    data: { participantIds: [emma.id, camille.id], productId: p1.id, lastActivityAt: daysAgo(1), createdAt: daysAgo(2) },
  });
  await prisma.message.create({ data: { conversationId: conv.id, senderId: camille.id, content: "Bonjour Emma, le panier est prêt pour jeudi matin.", isRead: true, createdAt: daysAgo(2) } });
  await prisma.message.create({ data: { conversationId: conv.id, senderId: emma.id, content: "Parfait, je confirme ! À jeudi.", isRead: false, createdAt: daysAgo(1) } });

  console.log("\n🎉 Seed terminé avec succès!\n");
  console.log("📊 Données créées :");
  console.log("  - 7 utilisateurs (1 admin, 5 vendeurs, 2 acheteurs)");
  console.log("  - 20 produits répartis sur 5 producteurs");
  console.log("  - 1 conversation de démonstration");
  console.log("\n🔑 Comptes (mot de passe via SEED_PASSWORD) :");
  console.log("  admin@greentrade.fr");
  console.log("  camille@ferme-camille.fr  — Angers (légumes bio)");
  console.log("  sophie@verger-soleil.fr   — Montpellier (fruits)");
  console.log("  marc@mas-provence.fr      — Aix-en-Provence (huile, herbes)");
  console.log("  lea@ruche-bretagne.fr     — Rennes (miel)");
  console.log("  thomas@atelier-thomas.fr  — Lille (légumes du Nord)");
}

try {
  await main();
} catch (e) {
  const error = e instanceof Error ? e : new Error(String(e));
  console.error("\n❌ Erreur lors du seed:", error.message);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
