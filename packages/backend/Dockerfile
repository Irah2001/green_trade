# Stage 1 : Builder
FROM node:25-alpine AS builder

# Installer pnpm
RUN npm install -g pnpm

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration de workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/shared/package.json ./packages/shared/

# Installer les dépendances
RUN pnpm install --frozen-lockfile

# Copier le code source
COPY packages/backend ./packages/backend
COPY packages/shared ./packages/shared

# Générer le client Prisma
WORKDIR /app/packages/backend
RUN pnpm prisma generate

# Builder l'application
RUN pnpm build

# Stage 2 : Production
FROM node:25-alpine AS production

# Installer pnpm
RUN npm install -g pnpm

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY --chown=nodejs:nodejs package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=nodejs:nodejs packages/backend/package.json ./packages/backend/
COPY --chown=nodejs:nodejs packages/shared/package.json ./packages/shared/

# Installer uniquement les dépendances de production
RUN pnpm install --frozen-lockfile --prod

# Copier les fichiers buildés depuis le stage builder
COPY --from=builder --chown=nodejs:nodejs /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder --chown=nodejs:nodejs /app/packages/backend/node_modules ./packages/backend/node_modules
COPY --from=builder --chown=nodejs:nodejs /app/packages/backend/prisma ./packages/backend/prisma

# Changer vers l'utilisateur non-root
USER nodejs

# Exposer le port
EXPOSE 4000

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=4000

# Démarrer l'application
WORKDIR /app/packages/backend
CMD ["node", "dist/index.js"]
