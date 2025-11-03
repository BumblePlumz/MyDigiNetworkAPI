# 🚀 Guide Complet - Pipeline Jenkins avec Docker et GitHub Packages

## 📋 Vue d'ensemble du Pipeline

Votre Jenkinsfile est maintenant configuré pour un pipeline CI/CD complet :

```
┌─────────────┐
│  Checkout   │  📥 Clone le repository GitHub
└──────┬──────┘
       │
┌──────▼──────┐
│Dependencies │  📦 npm install
└──────┬──────┘
       │
┌──────▼──────┐
│   Build     │  🔨 Vérification du projet
└──────┬──────┘
       │
┌──────▼──────┐
│   Tests     │  🧪 27 tests unitaires + coverage
└──────┬──────┘
       │
┌──────▼──────┐
│Docker Build │  🐳 Création de l'image Docker
└──────┬──────┘
       │
┌──────▼──────┐
│  Git Tag    │  🏷️  Tag v1.0.{BUILD_NUMBER}
└──────┬──────┘
       │
┌──────▼──────┐
│GitHub Pkg   │  📤 Push vers ghcr.io
└──────┬──────┘
       │
┌──────▼──────┐
│   Deploy    │  🚀 Déploiement du container
└──────┬──────┘
       │
┌──────▼──────┐
│   Verify    │  ✅ Vérification
└─────────────┘
```

## 📦 Fichiers Créés

### 1. Dockerfile
- **Multi-stage build** pour optimiser la taille
- **Image de base** : `node:18-alpine` (légère)
- **Utilisateur non-root** pour la sécurité
- **Port exposé** : 3000

### 2. .dockerignore
- Exclut les fichiers inutiles (node_modules, tests, etc.)
- Optimise la taille de l'image

### 3. Jenkinsfile Complet
Avec 10 stages :
1. ✅ Checkout
2. ✅ Install Dependencies
3. ✅ Compile/Build
4. ✅ Run Tests
5. ✅ Build Docker Image
6. ✅ Tag Repository
7. ✅ Push to GitHub Packages
8. ✅ Deploy
9. ✅ Verify Deployment
10. ✅ Post Actions

## 🔑 Configuration des Credentials

Votre credential ID est déjà configuré : `efabefe9-b7dd-477c-afec-b748dd7e60a5`

### Ce credential est utilisé pour :
1. **Checkout** du repository GitHub
2. **Tag** et push vers GitHub
3. **Push** de l'image Docker vers GitHub Container Registry (ghcr.io)

### Important : Permissions GitHub

Assurez-vous que votre token GitHub a ces permissions :

- ✅ `repo` - Accès complet au repository
- ✅ `write:packages` - Écrire dans GitHub Packages
- ✅ `read:packages` - Lire depuis GitHub Packages
- ✅ `delete:packages` - (Optionnel) Supprimer des packages

#### Comment vérifier/mettre à jour le token :

1. Allez sur GitHub : https://github.com/settings/tokens
2. Trouvez votre token (ou créez-en un nouveau)
3. Cochez ces scopes :
   - `repo` (tout)
   - `write:packages`
   - `read:packages`
4. Mettez à jour le credential dans Jenkins avec le nouveau token

## 🐳 Images Docker Créées

Le pipeline crée **3 tags** pour chaque build :

```bash
ghcr.io/bumbleplumz/mydiginetworkapi:42        # Numéro de build
ghcr.io/bumbleplumz/mydiginetworkapi:latest    # Dernière version
ghcr.io/bumbleplumz/mydiginetworkapi:abc1234   # Hash du commit
```

### Utilisation des Images

```bash
# Récupérer la dernière version
docker pull ghcr.io/bumbleplumz/mydiginetworkapi:latest

# Récupérer une version spécifique
docker pull ghcr.io/bumbleplumz/mydiginetworkapi:42

# Lancer l'application
docker run -d \
  --name social-network \
  -p 3000:3000 \
  -e NODE_ENV=production \
  ghcr.io/bumbleplumz/mydiginetworkapi:latest
```

## 🏷️ Tags Git Créés

Format : `v1.0.{BUILD_NUMBER}`

Exemples :
- `v1.0.1` - Premier build
- `v1.0.42` - Build numéro 42

### Message du Tag

Le tag contient des informations détaillées :
```
Release v1.0.42

Build Information:
- Build Number: #42
- Commit: abc1234
- Date: 2025-11-03 14:30:25
- Tests: ✅ Passed (27/27)
- Docker Image: ghcr.io/bumbleplumz/mydiginetworkapi:42
- Status: Ready for deployment 🚀
```

## 📤 GitHub Packages

### Où Trouver Vos Images

Vos images Docker sont disponibles sur :
```
https://github.com/BumblePlumz/MyDigiNetworkAPI/pkgs/container/mydiginetworkapi
```

### Rendre l'Image Publique (Optionnel)

1. Allez sur https://github.com/BumblePlumz?tab=packages
2. Cliquez sur `mydiginetworkapi`
3. **Package settings** → **Change visibility** → **Public**

### Pull une Image depuis GitHub Packages

```bash
# Si publique
docker pull ghcr.io/bumbleplumz/mydiginetworkapi:latest

# Si privée (authentification requise)
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u BumblePlumz --password-stdin
docker pull ghcr.io/bumbleplumz/mydiginetworkapi:latest
```

## 🚀 Déploiement

### Déploiement Local (Actuel)

Le pipeline déploie automatiquement sur le serveur Jenkins :
- **Container** : `social-network-api`
- **Port** : 3000
- **URL** : http://localhost:3000

### Déploiement Distant (À configurer)

Pour déployer sur un serveur distant, décommentez et modifiez cette section dans le Jenkinsfile (stage "Deploy") :

```groovy
ssh user@your-server.com 'docker pull ghcr.io/bumbleplumz/mydiginetworkapi:${IMAGE_TAG} && \
    docker stop social-network-api || true && \
    docker rm social-network-api || true && \
    docker run -d --name social-network-api -p 3000:3000 \
        ghcr.io/bumbleplumz/mydiginetworkapi:${IMAGE_TAG}'
```

## 🔧 Variables d'Environnement

Définies au début du Jenkinsfile :

```groovy
environment {
    DOCKER_IMAGE = 'ghcr.io/bumbleplumz/mydiginetworkapi'
    GITHUB_REGISTRY = 'ghcr.io'
    GITHUB_REPO = 'BumblePlumz/MyDigiNetworkAPI'
    IMAGE_TAG = "${env.BUILD_NUMBER}"
    LATEST_TAG = 'latest'
}
```

### Personnalisation

Si vous voulez changer le nom de l'image Docker :
```groovy
DOCKER_IMAGE = 'ghcr.io/votre-username/votre-app'
```

## 🧪 Tests

Les tests s'exécutent automatiquement :
- **Commande** : `npm run test:ci`
- **Nombre de tests** : 27
- **Rapport de coverage** : Publié dans Jenkins

### Si les Tests Échouent

Le pipeline s'arrête et :
- ❌ Aucune image Docker n'est créée
- ❌ Aucun tag Git n'est créé
- ❌ Rien n'est déployé

## 📊 Workflow Complet

### Exemple de Build Réussi

```
1. Developer push code to GitHub
   ↓
2. Jenkins détecte le changement
   ↓
3. Checkout du code
   ✅ Success
   ↓
4. Installation des dépendances
   ✅ Success
   ↓
5. Build du projet
   ✅ Success
   ↓
6. Exécution des tests (27/27 passed)
   ✅ Success
   ↓
7. Build de l'image Docker
   ✅ Image créée: ghcr.io/bumbleplumz/mydiginetworkapi:42
   ↓
8. Création du tag Git
   ✅ Tag créé: v1.0.42
   ↓
9. Push vers GitHub Packages
   ✅ Image disponible sur ghcr.io
   ↓
10. Déploiement
    ✅ Container démarré sur port 3000
    ↓
11. Vérification
    ✅ Application fonctionne
```

## 📝 Commandes Utiles

### Vérifier les Images Docker

```bash
# Lister toutes les images
docker images | grep mydiginetworkapi

# Voir les détails d'une image
docker inspect ghcr.io/bumbleplumz/mydiginetworkapi:latest
```

### Vérifier le Container

```bash
# Status du container
docker ps | grep social-network-api

# Logs du container
docker logs social-network-api

# Logs en temps réel
docker logs -f social-network-api
```

### Tester l'Application

```bash
# Test basique
curl http://localhost:3000

# Tester une route spécifique
curl http://localhost:3000/api/health
```

### Gérer les Tags Git

```bash
# Lister tous les tags
git tag -l

# Voir un tag spécifique
git show v1.0.42

# Fetch tous les tags
git fetch --tags
```

## 🐛 Dépannage

### Problème : Docker login échoue

**Solution** : Vérifiez que votre token GitHub a les permissions `write:packages`

### Problème : Push vers GitHub Packages échoue

**Solution** : 
```bash
# Vérifiez manuellement le login
echo YOUR_TOKEN | docker login ghcr.io -u BumblePlumz --password-stdin
```

### Problème : Container ne démarre pas

**Solution** :
```bash
# Voir les logs
docker logs social-network-api

# Vérifier les variables d'environnement
docker inspect social-network-api | grep -A 10 Env
```

### Problème : Port 3000 déjà utilisé

**Solution** :
```bash
# Trouver le processus
lsof -i :3000  # Linux/Mac
netstat -ano | findstr :3000  # Windows

# Ou changer le port dans le Jenkinsfile
docker run -p 8080:3000 ...
```

## 🔐 Sécurité

### Bonnes Pratiques Implémentées

- ✅ Multi-stage Docker build
- ✅ Utilisateur non-root dans le container
- ✅ Credentials sécurisés via Jenkins
- ✅ .dockerignore pour exclure les fichiers sensibles
- ✅ Variables d'environnement pour les secrets

### À Ajouter (Recommandé)

```dockerfile
# Dans le Dockerfile, ajouter des health checks
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health')"
```

## 📚 Ressources

- **GitHub Packages** : https://docs.github.com/en/packages
- **Docker Documentation** : https://docs.docker.com/
- **Jenkins Pipeline** : https://www.jenkins.io/doc/book/pipeline/

## ✅ Checklist de Démarrage

- [x] Dockerfile créé
- [x] .dockerignore créé
- [x] Jenkinsfile complet configuré
- [x] Tests unitaires (27 tests)
- [ ] Token GitHub avec permissions correctes
- [ ] Docker installé sur le serveur Jenkins
- [ ] Tester le pipeline manuellement

## 🚀 Prêt à Démarrer !

1. **Commitez et pushez** :
   ```bash
   git add Dockerfile .dockerignore Jenkinsfile
   git commit -m "feat: add complete CI/CD pipeline with Docker and GitHub Packages"
   git push origin main
   ```

2. **Vérifiez dans Jenkins** :
   - Le build démarre automatiquement
   - Tous les stages passent en vert
   - L'image est poussée vers GitHub Packages

3. **Vérifiez l'image** :
   - Allez sur https://github.com/BumblePlumz?tab=packages
   - Vous devriez voir `mydiginetworkapi`

**Tout est prêt ! 🎉**
