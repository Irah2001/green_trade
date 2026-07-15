# 🌱 GreenTrade — Guide minimalisé

[![CI Backend & Frontend](https://github.com/Irah2001/green_trade/actions/workflows/ci.yml/badge.svg)](https://github.com/Irah2001/green_trade/actions)
[![Vercel](https://vercelbadge.vercel.app/api/Irah2001/green_trade)](https://green-trade-frontend.vercel.app)

But : GreenTrade est une marketplace d'occasion pour le projet école. Ce README contient l'essentiel pour démarrer rapidement et développer.

Prerequis
- Node.js v18+
- pnpm
- Docker Desktop (avec Docker Compose)
- MongoDB Compass (optionnel)

Démarrage rapide

1) Copier les fichiers d'environnement
```bash
cp .env.example .env
cp packages/backend/.env.example packages/backend/.env
```

2) Démarrer MongoDB (replica set)
```bash
pnpm docker:up
# équivalent : docker compose up -d
```

3) Installer les dépendances
```bash
pnpm install
```

4) Configurer Prisma et initialiser la base
```bash
cd packages/backend
pnpm prisma generate
pnpm prisma db push
pnpm seed
```

Commandes essentielles
- pnpm docker:up        # démarre Docker (mongo replica set)
- pnpm docker:down      # arrête les services
- pnpm docker:logs      # logs en temps réel
- pnpm docker:clean     # down -v (supprime volumes)
- pnpm dev              # démarrer l'app en dev

Prisma Studio
```bash
cd packages/backend
pnpm prisma studio
# ouvre http://localhost:5555
```

Connexion MongoDB (MongoDB Compass)
- URI recommandé :
mongodb://localhost:27017/greentrade?replicaSet=rs0&directConnection=true

Structure minimale du projet
```
green_trade/
├── docker-compose.yml           # configuration Docker (replica set)
├── README.md                    # ce fichier
├── ARCHITECTURE.md              # architecture projet
├── CONTRIBUTING.md              # guide collaboration
├── packages/
│   ├── backend/                 # API Node + Prisma
│   └── frontend/                # Next.js
└── .env.example
```

Fichiers de référence et historique
- Anciennes variantes de configuration et guides ont été consolidées. Si besoin d'historique, voir le fichier original de migration [`REPLICA-SET-MIGRATION.md`](green_trade/REPLICA-SET-MIGRATION.md:1).

Bonnes pratiques
- Ne jamais commiter les fichiers `.env`
- Chaque développeur crée son propre `.env` à partir de `.env.example`
- Utiliser Docker pour garantir un environnement identique entre les membres

Dépannage rapide
- Vérifier que Docker est démarré : `docker compose ps`
- Si port 27017 pris : modifier `MONGO_PORT` et la variable `DATABASE_URL` dans `packages/backend/.env`
- Pour reset complet : `pnpm docker:clean && pnpm docker:up && cd packages/backend && pnpm prisma db push && pnpm seed`

Script d'initialisation (Unix/macOS)
Ce script automatise les étapes d'initialisation courantes (création des fichiers .env, démarrage de MongoDB, vérification de la disponibilité et génération Prisma). Contenu du script (bash) :

```bash
#!/bin/bash

# 🚀 Script d'initialisation de l'environnement Green Trade

set -e

echo "🌱 Initialisation de l'environnement Green Trade..."
echo ""

# Couleurs pour l'affichage
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker n'est pas installé. Veuillez l'installer d'abord.${NC}"
    echo "Téléchargez Docker Desktop: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose n'est pas installé.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker et Docker Compose sont installés${NC}"
echo ""

# Créer les fichiers .env s'ils n'existent pas
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Création du fichier .env à la racine...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Fichier .env créé${NC}"
else
    echo -e "${GREEN}✓ Le fichier .env existe déjà${NC}"
fi

if [ ! -f packages/backend/.env ]; then
    echo -e "${YELLOW}📝 Création du fichier .env dans le backend...${NC}"
    cp packages/backend/.env.example packages/backend/.env
    echo -e "${GREEN}✓ Fichier backend/.env créé${NC}"
else
    echo -e "${GREEN}✓ Le fichier backend/.env existe déjà${NC}"
fi

echo ""
echo -e "${YELLOW}🐳 Démarrage de MongoDB avec Docker...${NC}"

# Arrêter les conteneurs existants
docker-compose down 2>/dev/null || true

# Démarrer MongoDB
docker-compose up -d mongo

echo ""
echo -e "${YELLOW}⏳ Attente que MongoDB soit prêt...${NC}"

# Attendre que MongoDB soit prêt (max 30 secondes)
COUNTER=0
until docker exec greentrade-mongo mongosh --eval "db.adminCommand('ping')" -u admin -p admin --quiet &>/dev/null; do
    COUNTER=$((COUNTER+1))
    if [ $COUNTER -gt 30 ]; then
        echo -e "${RED}❌ MongoDB n'a pas démarré dans les temps${NC}"
        echo "Vérifiez les logs avec: docker-compose logs mongo"
        exit 1
    fi
    echo -n "."
    sleep 1
done

echo ""
echo -e "${GREEN}✓ MongoDB est prêt !${NC}"
echo ""

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ] || [ ! -d "packages/backend/node_modules" ]; then
    echo -e "${YELLOW}📦 Installation des dépendances...${NC}"
    if command -v pnpm &> /dev/null; then
        pnpm install
    elif command -v npm &> /dev/null; then
        npm install
    else
        echo -e "${RED}❌ pnpm ou npm n'est pas installé${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Dépendances installées${NC}"
else
    echo -e "${GREEN}✓ Dépendances déjà installées${NC}"
fi

echo ""
echo -e "${YELLOW}🔧 Configuration de Prisma...${NC}"

cd packages/backend

# Générer le client Prisma
if command -v pnpm &> /dev/null; then
    pnpm prisma generate
    echo ""
    echo -e "${YELLOW}📊 Synchronisation du schéma avec la base de données...${NC}"
    pnpm prisma db push
else
    npx prisma generate
    echo ""
    echo -e "${YELLOW}📊 Synchronisation du schéma avec la base de données...${NC}"
    npx prisma db push
fi

echo ""
echo -e "${GREEN}✅ Configuration terminée avec succès !${NC}"
echo ""
echo "📋 Prochaines étapes :"
echo ""
echo "  1. Vérifier que MongoDB fonctionne :"
echo "     docker-compose ps"
echo ""
echo "  2. (Optionnel) Insérer des données de test :"
echo "     cd packages/backend && pnpm prisma db seed"
echo ""
echo "  3. Ouvrir Prisma Studio pour voir les données :"
echo "     cd packages/backend && pnpm prisma studio"
echo ""
echo "  4. Se connecter avec MongoDB Compass :"
echo "     mongodb://admin:admin@localhost:27017/?authSource=admin"
echo ""
echo "  5. Démarrer l'application :"
echo "     pnpm dev"
echo ""
echo "Pour plus d'informations, consultez REPLICA-SET-MIGRATION.md"
```

Après extraction, le fichier `scripts/setup-env.sh` sera supprimé du dépôt pour garder le repo minimal.

## Scalabilité et résilience (Kubernetes)

Le service backend-api (`green-trade-catalog-api` et `green-trade-orders-api`) est déployé avec **2 replicas minimum** et géré par un **Horizontal Pod Autoscaler (HPA)** basé sur la métrique CPU (seuil de 50%).
Les requêtes CPU (`resources.requests.cpu`) sont définies à `200m` pour permettre au HPA de prendre des décisions cohérentes basées sur les métriques remontées par le `metrics-server`.

Commandes de vérification :
```bash
# Consulter l'état du HPA
kubectl get hpa -n green-trade

# Suivre la charge CPU/Mémoire des pods en direct
kubectl top pods -n green-trade
```

Un scénario de résilience (self-healing) est assuré en direct par la suppression manuelle d'un pod backend. Le Deployment recrée automatiquement le pod supprimé, tandis que le Service maintient la continuité de service en redirigeant le trafic vers le replica actif restant.
De plus, un **PodDisruptionBudget (PDB)** garantit qu'au moins 1 replica reste disponible pendant toute opération de maintenance volontaire (ex: `kubectl drain`).

Commandes de test :
```bash
# Supprimer un pod pour valider le self-healing
kubectl delete pod <nom-du-pod> -n green-trade

# Suivre la création du nouveau pod
kubectl get pods -n green-trade -w
```

---

## Observabilité

L’observabilité repose sur trois niveaux clés :

1. **Logs applicatifs JSON** : Formatés automatiquement en JSON structuré lorsque la variable `LOG_FORMAT=json` est configurée. Consultables en ligne de commande :
   ```bash
   kubectl logs -n green-trade deployment/green-trade-catalog-api --tail=50
   ```
2. **Métriques Kubernetes** : Suivi direct de la consommation de ressources avec `kubectl top pods/nodes`.
3. **Monitoring complet (Prometheus & Grafana)** :
   * L'application expose un endpoint compatible `/metrics` collectant l'uptime, l'usage mémoire et le compte des requêtes par route/statut.
   * Un `ServiceMonitor` Kubernetes permet à Prometheus de découvrir et de scraper automatiquement cet endpoint toutes les 15 secondes.
   * Une règle d'alerte `PrometheusRule` déclenche une alerte critique si aucun replica backend n'est disponible pendant plus d'une minute ou si la charge CPU d'un pod dépasse 80% pendant plus de 5 minutes.

Le port-forward pour accéder à Grafana et suivre les tableaux de bord se fait par :
```bash
kubectl port-forward svc/monitoring-grafana 3001:80 -n monitoring
```

---

Support
- Documentation technique : [`ARCHITECTURE.md`](green_trade/ARCHITECTURE.md:1)
- Guide de migration replica set : [`REPLICA-SET-MIGRATION.md`](green_trade/REPLICA-SET-MIGRATION.md:1)

