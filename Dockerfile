# Multi-stage build pour optimiser l'image Docker
FROM node:25-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json pnpm-lock.yaml ./

# Installer pnpm et les dépendances
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

# Copier le code source
COPY . .

# Stage de production
FROM node:25-alpine

# Installer pnpm
RUN npm install -g pnpm

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Définir le répertoire de travail
WORKDIR /app

# Copier les dépendances depuis le builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Copier le code source
COPY --chown=nodejs:nodejs . .

# Créer les répertoires nécessaires
RUN mkdir -p /app/src/data /app/public/uploads && \
    chown -R nodejs:nodejs /app

# Utiliser l'utilisateur non-root
USER nodejs

# Exposer le port de l'application
EXPOSE 3000

# Variables d'environnement par défaut
ENV NODE_ENV=production \
    PORT=3000

# Commande de démarrage
CMD ["node", "app.js"]
