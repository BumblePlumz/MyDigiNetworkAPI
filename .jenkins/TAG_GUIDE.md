# 🏷️ Guide de Tagging Jenkins

## 📋 Configuration Actuelle

Votre Jenkinsfile inclut maintenant une étape de tagging automatique qui :

- ✅ S'exécute après les tests réussis
- ✅ Crée un tag au format : `build-{numero}-{date}-{heure}`
- ✅ Push automatiquement vers GitHub
- ✅ Uniquement sur la branche `main`

### Exemple de Tag Créé

```
Tag: build-42-20251103-143025
Message: Build #42 - Tests passed ✅
```

## 🎯 Stratégies de Tagging Disponibles

### 1. Tag avec Numéro de Build (ACTUEL) ✅

**Format** : `build-42-20251103-143025`

**Avantages** :
- Unique pour chaque build
- Inclut la date et l'heure
- Facile à tracer

**Code dans Jenkinsfile** :
```groovy
def tagName = "build-${env.BUILD_NUMBER}-${new Date().format('yyyyMMdd-HHmmss')}"
```

### 2. Tag Sémantique (Version)

**Format** : `v1.0.0-build.42`

**Utilisation** : Pour les releases officielles

**Comment l'activer** :
Remplacez la ligne du tagName par :
```groovy
def packageJson = readJSON file: 'package.json'
def tagName = "v${packageJson.version}-build.${env.BUILD_NUMBER}"
```

### 3. Tag Simple par Date

**Format** : `2025-11-03-build42`

**Utilisation** : Pour un suivi quotidien

**Code** :
```groovy
def tagName = "${new Date().format('yyyy-MM-dd')}-build${env.BUILD_NUMBER}"
```

### 4. Tag par Environnement

**Format** : `production-20251103-42`

**Utilisation** : Pour distinguer les environnements

**Code** :
```groovy
def environment = env.BRANCH_NAME == 'main' ? 'production' : 'staging'
def tagName = "${environment}-${new Date().format('yyyyMMdd')}-${env.BUILD_NUMBER}"
```

## 🔧 Personnalisation du Tag

### Modifier le Format du Tag

Éditez cette ligne dans le Jenkinsfile (ligne ~51) :

```groovy
// Format actuel
def tagName = "build-${env.BUILD_NUMBER}-${new Date().format('yyyyMMdd-HHmmss')}"

// Formats alternatifs :

// Simple
def tagName = "v${env.BUILD_NUMBER}"

// Avec version npm
def packageJson = readJSON file: 'package.json'
def tagName = "v${packageJson.version}"

// Avec branche
def tagName = "${env.BRANCH_NAME}-build-${env.BUILD_NUMBER}"

// Avec date courte
def tagName = "release-${new Date().format('yyyy.MM.dd')}.${env.BUILD_NUMBER}"
```

### Modifier le Message du Tag

Éditez cette ligne dans le Jenkinsfile (ligne ~60) :

```groovy
// Message actuel
git tag -a ${tagName} -m "Build #${env.BUILD_NUMBER} - Tests passed ✅"

// Messages alternatifs :

// Simple
git tag -a ${tagName} -m "Release ${tagName}"

// Avec détails
git tag -a ${tagName} -m "Build #${env.BUILD_NUMBER}\\nDate: ${new Date()}\\nTests: ✅\\nCoverage: 100%"

// Avec commit
def commitMsg = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
git tag -a ${tagName} -m "Build #${env.BUILD_NUMBER}\\n${commitMsg}"
```

## 🎨 Exemples Pratiques

### Exemple 1 : Tag de Release Majeure

Pour créer un tag `v2.0.0` quand vous faites une release :

```groovy
stage("Create Release Tag") {
    when {
        branch 'main'
        expression { 
            return sh(
                script: 'git log -1 --pretty=%B',
                returnStdout: true
            ).contains('[release]')
        }
    }
    steps {
        script {
            def packageJson = readJSON file: 'package.json'
            def tagName = "v${packageJson.version}"
            
            withCredentials([usernamePassword(
                credentialsId: 'efabefe9-b7dd-477c-afec-b748dd7e60a5',
                usernameVariable: 'GIT_USERNAME',
                passwordVariable: 'GIT_PASSWORD'
            )]) {
                sh """
                    git tag -a ${tagName} -m "🚀 Release ${packageJson.version}"
                    git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/BumblePlumz/MyDigiNetworkAPI.git ${tagName}
                """
            }
        }
    }
}
```

**Utilisation** : Committez avec `[release]` dans le message

### Exemple 2 : Tag avec Informations de Test

```groovy
stage("Create Tag With Test Info") {
    steps {
        script {
            def tagName = "tested-${env.BUILD_NUMBER}"
            def testsPassed = "27/27"
            def coverage = "100%"
            
            withCredentials([usernamePassword(
                credentialsId: 'efabefe9-b7dd-477c-afec-b748dd7e60a5',
                usernameVariable: 'GIT_USERNAME',
                passwordVariable: 'GIT_PASSWORD'
            )]) {
                sh """
                    git tag -a ${tagName} -m "Build #${env.BUILD_NUMBER}
Tests: ${testsPassed} ✅
Coverage: ${coverage} 📊
Date: ${new Date().format('yyyy-MM-dd HH:mm:ss')}"
                    git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/BumblePlumz/MyDigiNetworkAPI.git ${tagName}
                """
            }
        }
    }
}
```

## 📊 Consulter les Tags

### Dans GitHub

1. Allez sur votre repo : https://github.com/BumblePlumz/MyDigiNetworkAPI
2. Cliquez sur "**X tags**" ou "**Releases**"
3. Vous verrez tous les tags créés par Jenkins

### En Ligne de Commande

```bash
# Lister tous les tags
git tag -l

# Voir les détails d'un tag
git show build-42-20251103-143025

# Récupérer tous les tags depuis le serveur
git fetch --tags

# Lister les tags avec leurs messages
git tag -n
```

### Dans Jenkins

Les tags seront visibles dans :
- Console Output du build
- Étape "Create Tag"

## 🛠️ Gestion des Tags

### Désactiver le Tagging

Si vous voulez désactiver temporairement le tagging, commentez l'étape dans le Jenkinsfile :

```groovy
/*
stage("Create Tag") {
    // ...
}
*/
```

### Supprimer un Tag

```bash
# Supprimer localement
git tag -d build-42-20251103-143025

# Supprimer sur GitHub
git push origin --delete build-42-20251103-143025
```

### Conditions de Tagging

Le tag est créé uniquement si :
- ✅ La branche est `main`
- ✅ Le build est réussi (`SUCCESS`)
- ✅ Les tests sont passés

## 🔐 Sécurité

Les credentials utilisés :
- **ID** : `efabefe9-b7dd-477c-afec-b748dd7e60a5`
- **Usage** : Push des tags vers GitHub
- **Sécurisé** : Les credentials sont stockés dans Jenkins, jamais exposés dans les logs

## 📝 Bonnes Pratiques

### ✅ DO (À Faire)

1. **Utiliser des tags significatifs**
   ```groovy
   def tagName = "v${version}-build.${env.BUILD_NUMBER}"
   ```

2. **Ajouter des messages descriptifs**
   ```groovy
   git tag -a ${tagName} -m "Detailed message with context"
   ```

3. **Tagger uniquement les builds réussis**
   ```groovy
   when {
       expression { currentBuild.result == 'SUCCESS' }
   }
   ```

### ❌ DON'T (À Éviter)

1. **Ne pas tagger chaque commit**
   - Réservez les tags pour les builds importants

2. **Ne pas utiliser de noms génériques**
   - ❌ `tag1`, `tag2`, `test`
   - ✅ `build-42-20251103`, `v1.0.0`

3. **Ne pas oublier de pusher le tag**
   - Toujours inclure `git push origin ${tagName}`

## 🚀 Workflow Recommandé

### Pour les Développements Quotidiens

```
Commit → Push → Jenkins Build → Tests → Tag Automatique
                                          ↓
                                    build-42-20251103-143025
```

### Pour les Releases

```
Commit [release] → Push → Jenkins Build → Tests → Tag Sémantique
                                                    ↓
                                                v1.0.0
```

## 📚 Ressources

- **Fichier d'exemples** : `.jenkins/tag-examples.groovy`
- **Documentation Git Tags** : https://git-scm.com/book/en/v2/Git-Basics-Tagging
- **Jenkins Pipeline Syntax** : https://www.jenkins.io/doc/book/pipeline/syntax/

## 🎯 Résumé

Votre Jenkinsfile est maintenant configuré pour :
- ✅ Créer automatiquement des tags après tests réussis
- ✅ Format : `build-{numero}-{date}-{heure}`
- ✅ Push automatique vers GitHub
- ✅ Uniquement sur la branche `main`

Pour modifier le comportement, éditez l'étape "Create Tag" dans le Jenkinsfile (lignes 48-69).
