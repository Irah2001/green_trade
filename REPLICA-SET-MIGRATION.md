# 🔄 Migration vers MongoDB Replica Set

## MongoDB est configuré en Replica Set

MongoDB est configuré en **replica set**, ce qui permet d'utiliser toutes les fonctionnalités de Prisma (transactions, `upsert`, `deleteMany`, etc.).

## 📊 Résumé de la configuration

### Ce qui a été fait :

1. ✅ MongoDB configuré en replica set (`rs0`)
2. ✅ Schéma Prisma poussé sur la base de données
3. ✅ Données de test insérées (3 utilisateurs, 5 produits)
4. ✅ URL de connexion mise à jour

### Données de test créées :

**Utilisateurs :**
- seller@example.com (Alice Seller) - Vendeur
- buyer@example.com (Bob Buyer) - Acheteur
- marie@example.com (Marie Dupont) - Vendeuse

**Mot de passe pour tous :** `password+123`

**Produits :**
1. Veste vintage en cuir (45€)
2. Chaussures running Nike (30€)
3. Vélo électrique VTT (800€)
4. MacBook Pro 2020 (950€)
5. Table basse scandinave (120€)

## 🔧 Utilisation

### Démarrer MongoDB (replica set)

```bash
docker-compose -f docker-compose.replicaset.yml up -d
```

Ou ajoutez un script dans `package.json` :
```bash
pnpm docker:replica
```

### URL de connexion

**Prisma (dans `.env`) :**
```env
DATABASE_URL="mongodb://localhost:27017/greentrade?replicaSet=rs0&directConnection=true"
```

**MongoDB Compass :**
```
mongodb://localhost:27017/greentrade?replicaSet=rs0&directConnection=true
```

### Commandes utiles

```bash
# Vérifier l'état du replica set
docker exec greentrade-mongo mongosh --eval "rs.status()" --quiet

# Voir les collections
docker exec greentrade-mongo mongosh greentrade --eval "db.getCollectionNames()" --quiet

# Compter les documents
docker exec greentrade-mongo mongosh greentrade --eval "db.User.countDocuments()" --quiet

# Prisma Studio (interface graphique)
cd packages/backend && pnpm prisma studio

# Re-seeder la base
cd packages/backend && pnpm tsx prisma/seed-new.ts
```

## 🤝 Pour l'équipe

### Mise à jour pour les autres développeurs

Quand vos collègues vont pull le projet, ils devront :

1. **Arrêter l'ancien MongoDB**
   ```bash
   docker-compose down -v
   ```

2. **Démarrer le nouveau (replica set)**
   ```bash
   docker-compose -f docker-compose.replicaset.yml up -d
   ```

3. **Mettre à jour leur `.env`**
   ```bash
   cp packages/backend/.env.example packages/backend/.env
   ```
   
   Ou manuellement mettre à jour `DATABASE_URL` :
   ```env
   DATABASE_URL="mongodb://localhost:27017/greentrade?replicaSet=rs0&directConnection=true"
   ```

4. **Pousser le schéma et seed**
   ```bash
   cd packages/backend
   pnpm prisma db push
   pnpm tsx prisma/seed.ts
   ```

## 📁 Fichiers modifiés/créés

- ✅ `docker-compose.replicaset.yml` - MongoDB en replica set
- ✅ `packages/backend/.env` - URL de connexion mise à jour
- ✅ `packages/backend/prisma/seed.ts` - Script de seed qui fonctionne
- ✅ `REPLICA-SET-MIGRATION.md` - Ce fichier

## 🔄 Différences avec l'ancienne configuration

| Aspect | Avant | Maintenant |
|--------|-------|------------|
| **Type** | Standalone | Replica Set |
| **Auth** | admin/admin | Pas d'auth (dev local) |
| **URL** | `mongodb://admin:admin@localhost:27017/...` | `mongodb://localhost:27017/...?replicaSet=rs0` |
| **Transactions** | ❌ Non supportées | ✅ Supportées |
| **Upsert** | ❌ Ne fonctionne pas | ✅ Fonctionne |
| **DeleteMany** | ❌ Ne fonctionne pas | ✅ Fonctionne |

## ⚠️ Important

### Pour le développement local :
- ✅ Pas d'authentification (OK, car accessible uniquement en local)
- ✅ Replica set à 1 membre (suffisant pour le dev)

### Pour la production :
- ❌ Ne pas utiliser cette config !
- ✅ Utilisez MongoDB Atlas ou un replica set multi-nœuds avec authentification
- ✅ Configurez SSL/TLS
- ✅ Utilisez des credentials forts

## 🎯 Next Steps

1. **Tester l'application** avec les nouvelles données
2. **Mettre à jour la documentation** de l'équipe
3. **Commit et push** les changements :
   ```bash
   git add .
   git commit -m "feat(db): configure MongoDB replica set for transactions support"
   git push
   ```

## 📚 Ressources

- [MongoDB Replica Sets](https://www.mongodb.com/docs/manual/replication/)
- [Prisma with MongoDB](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
- [Transactions in MongoDB](https://www.mongodb.com/docs/manual/core/transactions/)
