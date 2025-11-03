# 🐳 Docker Quick Start Guide

## 🚀 Démarrage Rapide

### Pull l'image depuis GitHub Packages

```bash
# Dernière version
docker pull ghcr.io/bumbleplumz/mydiginetworkapi:latest

# Version spécifique
docker pull ghcr.io/bumbleplumz/mydiginetworkapi:42
```

### Lancer l'application

```bash
docker run -d \
  --name social-network-api \
  -p 3000:3000 \
  -e NODE_ENV=production \
  ghcr.io/bumbleplumz/mydiginetworkapi:latest
```

### Vérifier que ça fonctionne

```bash
# Voir les logs
docker logs social-network-api

# Tester l'application
curl http://localhost:3000
```

## 🛠️ Build Local (Optionnel)

Si vous voulez construire l'image localement :

```bash
# Build
docker build -t mydiginetworkapi:local .

# Run
docker run -d -p 3000:3000 --name social-network-api mydiginetworkapi:local
```

## 🔧 Variables d'Environnement

```bash
docker run -d \
  --name social-network-api \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e JWT_SECRET=your-secret-key \
  -e JWT_DURATION=24h \
  ghcr.io/bumbleplumz/mydiginetworkapi:latest
```

## 📦 Docker Compose (Recommandé)

Créez un fichier `docker-compose.yml` :

```yaml
version: '3.8'

services:
  api:
    image: ghcr.io/bumbleplumz/mydiginetworkapi:latest
    container_name: social-network-api
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    volumes:
      - ./data:/app/src/data
      - ./uploads:/app/public/uploads
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Puis :

```bash
# Démarrer
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

## 📊 Gestion du Container

```bash
# Voir les containers actifs
docker ps

# Voir tous les containers
docker ps -a

# Arrêter
docker stop social-network-api

# Démarrer
docker start social-network-api

# Redémarrer
docker restart social-network-api

# Supprimer
docker rm social-network-api

# Voir les logs
docker logs social-network-api
docker logs -f social-network-api  # Temps réel
docker logs --tail 100 social-network-api  # Dernières 100 lignes
```

## 🔍 Debugging

```bash
# Entrer dans le container
docker exec -it social-network-api sh

# Vérifier les fichiers
docker exec social-network-api ls -la /app

# Vérifier les processus
docker top social-network-api

# Statistiques en temps réel
docker stats social-network-api

# Inspecter le container
docker inspect social-network-api
```

## 🧹 Nettoyage

```bash
# Supprimer les images inutilisées
docker image prune -a

# Supprimer tous les containers arrêtés
docker container prune

# Nettoyage complet
docker system prune -a --volumes
```

## 🔐 Authentification GitHub Packages

Si l'image est privée :

```bash
# Se connecter
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u BumblePlumz --password-stdin

# Pull
docker pull ghcr.io/bumbleplumz/mydiginetworkapi:latest

# Se déconnecter
docker logout ghcr.io
```

## 🚀 Déploiement en Production

### Option 1 : Docker Swarm

```bash
# Initialiser Swarm
docker swarm init

# Déployer
docker stack deploy -c docker-compose.yml social-network

# Voir les services
docker service ls

# Scaler
docker service scale social-network_api=3
```

### Option 2 : Kubernetes

```bash
# Pull l'image
docker pull ghcr.io/bumbleplumz/mydiginetworkapi:latest

# Déployer
kubectl create deployment social-network-api \
  --image=ghcr.io/bumbleplumz/mydiginetworkapi:latest

# Exposer
kubectl expose deployment social-network-api \
  --type=LoadBalancer \
  --port=3000
```

## 🔄 Mise à Jour

```bash
# Pull la nouvelle version
docker pull ghcr.io/bumbleplumz/mydiginetworkapi:latest

# Arrêter l'ancien container
docker stop social-network-api
docker rm social-network-api

# Démarrer le nouveau
docker run -d \
  --name social-network-api \
  -p 3000:3000 \
  ghcr.io/bumbleplumz/mydiginetworkapi:latest
```

Ou avec Docker Compose :

```bash
docker-compose pull
docker-compose up -d
```

## 📋 Checklist de Déploiement

- [ ] Pull l'image depuis GitHub Packages
- [ ] Configurer les variables d'environnement
- [ ] Configurer les volumes (données, uploads)
- [ ] Exposer le bon port
- [ ] Configurer le health check
- [ ] Tester l'application
- [ ] Configurer les logs
- [ ] Configurer le restart automatique
- [ ] (Optionnel) Configurer un reverse proxy (nginx)
- [ ] (Optionnel) Configurer HTTPS

## 🌐 Production avec Nginx (Reverse Proxy)

```nginx
server {
    listen 80;
    server_name api.votredomaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🆘 Troubleshooting

### Container ne démarre pas

```bash
# Voir les logs d'erreur
docker logs social-network-api

# Vérifier l'état
docker inspect social-network-api | grep Status
```

### Port déjà utilisé

```bash
# Changer le port
docker run -d -p 8080:3000 --name social-network-api ...
```

### Problème de permissions

```bash
# Le Dockerfile utilise déjà un user non-root
# Vérifier les volumes
docker run -v $(pwd)/data:/app/src/data ...
```

## 📚 Ressources

- **Docker Docs** : https://docs.docker.com/
- **GitHub Packages** : https://docs.github.com/en/packages
- **Best Practices** : https://docs.docker.com/develop/dev-best-practices/

---

**Ready to deploy! 🚀**
