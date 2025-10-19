# 👥 Guide de collaboration - Green Trade

## 🎯 Pour les membres de l'équipe

### Premier setup

1. **Cloner le repository**
   ```bash
   git clone <url-du-repo>
   cd green_trade
   ```

2. **Installation et démarrage (rapide)**
   
   Les scripts d'installation ont été consolidés dans le README. Pour un démarrage rapide, utilisez les commandes ci‑dessous (cross‑platform) :
   
   ```bash
   # Copier les fichiers d'environnement
   cp .env.example .env
   cp packages/backend/.env.example packages/backend/.env

   # Installer les dépendances (pnpm recommandé)
   pnpm install

   # Démarrer MongoDB (replica set)
   pnpm docker:up
   # équivalent docker compose up -d

   # Initialiser Prisma (générer client et pousser le schéma)
   cd packages/backend
   pnpm prisma generate
   pnpm prisma db push

   # (Optionnel) Insérer les données de test
   pnpm prisma db seed
   ```
   
   Si vous préférez des scripts spécialisés (Windows / Unix), consultez la section « Démarrage rapide » du [`README.md`](green_trade/README.md:1).

3. **Vérifier que tout fonctionne**
   ```bash
   # Vérifier que MongoDB tourne
   docker-compose ps
   
   # Ouvrir Prisma Studio pour voir la DB
   cd packages/backend
   pnpm prisma studio
   ```

4. **Démarrer l'application**
   ```bash
   pnpm dev
   ```

## 📋 Workflow quotidien

### Démarrage du jour

```bash
# Démarrer MongoDB (si pas déjà lancé)
pnpm docker:mongo

# Vérifier l'état
docker-compose ps

# Démarrer l'app
pnpm dev
```

### Fin de journée

```bash
# Option 1 : Garder MongoDB actif (recommandé)
# Ne rien faire, Docker continuera à tourner en arrière-plan

# Option 2 : Tout arrêter
pnpm docker:down
```

## 🔄 Synchronisation avec l'équipe

### Après un pull avec des changements sur le schéma Prisma

```bash
cd packages/backend

# Régénérer le client Prisma
pnpm prisma generate

# Synchroniser le schéma avec votre DB locale
pnpm prisma db push
```

### Après un pull avec des changements sur les dépendances

```bash
# À la racine
pnpm install

# Si nécessaire, régénérer Prisma
cd packages/backend
pnpm prisma generate
```

## 🗃️ Gestion de la base de données

### Réinitialiser complètement la DB

```bash
# ⚠️ ATTENTION : Cela supprime toutes les données !
pnpm docker:clean

# Redémarrer et reconfigurer
pnpm docker:mongo
cd packages/backend
pnpm prisma db push
pnpm prisma db seed  # Si vous avez un seed
```

### Changer le schéma Prisma

1. **Modifier `packages/backend/prisma/schema.prisma`**

2. **Appliquer les changements**
   ```bash
   cd packages/backend
   pnpm prisma db push
   ```

3. **Commiter les changements**
   ```bash
   git add packages/backend/prisma/schema.prisma
   git commit -m "feat(db): ajout du champ X dans le modèle Y"
   ```

4. **Informer l'équipe** que le schéma a changé (Slack, Discord, etc.)

## 🐛 Dépannage courant

### MongoDB ne démarre pas

```bash
# Vérifier les logs
pnpm docker:logs

# Si le port 27017 est déjà utilisé, modifier dans .env :
# MONGO_PORT=27018

# Puis dans packages/backend/.env :
# DATABASE_URL="mongodb://admin:admin@localhost:27018/greentrade?authSource=admin"

# Redémarrer
pnpm docker:down
pnpm docker:mongo
```

### Erreur Prisma "Cannot connect to database"

1. Vérifier que MongoDB tourne :
   ```bash
   docker-compose ps
   ```

2. Vérifier le `DATABASE_URL` dans `packages/backend/.env`

3. Tester la connexion manuellement :
   ```bash
   docker exec -it greentrade-mongo mongosh -u admin -p admin
   ```

### Conflits de données après un merge

```bash
# Option 1 : Réinitialiser la DB locale
pnpm docker:clean
pnpm docker:mongo
cd packages/backend
pnpm prisma db push

# Option 2 : Utiliser Prisma Studio pour corriger manuellement
cd packages/backend
pnpm prisma studio
```

## 📝 Bonnes pratiques

### Variables d'environnement

- ✅ **Toujours** mettre à jour `.env.example` quand vous ajoutez une variable
- ❌ **Ne jamais** commiter les fichiers `.env`
- 💡 Utiliser des valeurs par défaut sécurisées pour le développement

### Schéma Prisma

- 🔍 Toujours tester les migrations localement avant de push
- 📢 Communiquer les changements de schéma à l'équipe
- 💾 Faire des commits atomiques (un changement = un commit)

### Docker

- 🚀 Utiliser les commandes npm scripts (`pnpm docker:*`) pour la cohérence
- 🗑️ Nettoyer régulièrement les volumes non utilisés :
  ```bash
  docker system prune -a --volumes
  ```
- 📊 Monitorer l'espace disque utilisé par Docker :
  ```bash
  docker system df
  ```

## 🆘 Qui contacter

### Problèmes techniques

- **Backend/Prisma** : [Nom du responsable backend]
- **Docker/DevOps** : [Nom du responsable DevOps]
- **Frontend** : [Nom du responsable frontend]

### Ressources utiles

- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation MongoDB](https://www.mongodb.com/docs/)
- [Documentation Docker](https://docs.docker.com/)
- [README-DOCKER.md](./README-DOCKER.md) - Guide Docker complet

## 🎓 Ressources d'apprentissage

### Pour apprendre Prisma
- [Prisma Quickstart](https://www.prisma.io/docs/getting-started/quickstart)
- [Prisma avec MongoDB](https://www.prisma.io/docs/concepts/database-connectors/mongodb)

### Pour apprendre Docker
- [Docker Getting Started](https://docs.docker.com/get-started/)
- [Docker Compose Tutorial](https://docs.docker.com/compose/gettingstarted/)

### Pour apprendre MongoDB
- [MongoDB University (gratuit)](https://university.mongodb.com/)
- [MongoDB Basics](https://www.mongodb.com/docs/manual/tutorial/getting-started/)

## 📞 Checklist avant de demander de l'aide

Avant de demander de l'aide, vérifiez que vous avez :

- [ ] Vérifié que Docker Desktop est bien lancé
- [ ] Vérifié que MongoDB tourne (`docker-compose ps`)
- [ ] Consulté les logs (`pnpm docker:logs`)
- [ ] Vérifié votre fichier `.env`
- [ ] Essayé de redémarrer les services (`pnpm docker:restart`)
- [ ] Cherché l'erreur dans la documentation ou sur Google
- [ ] Vérifié que vous êtes sur la bonne branche Git

Si après tout ça le problème persiste, contactez l'équipe avec :
1. Le message d'erreur complet
2. Les étapes pour reproduire le problème
3. Ce que vous avez déjà essayé
