# 🧪 Tests Unitaires - Social Network API

[![Tests](https://img.shields.io/badge/tests-27%20passed-success)](./VERIFICATION.md)
[![Coverage](https://img.shields.io/badge/coverage-100%25%20(classes)-success)](./coverage/index.html)
[![Jest](https://img.shields.io/badge/framework-Jest-red)](https://jestjs.io/)

## 📋 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Installation](#installation)
- [Exécution des Tests](#exécution-des-tests)
- [Structure](#structure)
- [Documentation](#documentation)
- [CI/CD avec Jenkins](#cicd-avec-jenkins)
- [Contribuer](#contribuer)

## 🎯 Vue d'ensemble

Ce projet contient **27 tests unitaires** couvrant :

- ✅ Classes d'erreur personnalisées (7 tests)
- ✅ Middleware d'authentification JWT (3 tests)
- ✅ Logique de contrôleur utilisateur (7 tests)
- ✅ Logique de contrôleur d'authentification (7 tests)
- ✅ Fonctions utilitaires bcrypt (3 tests)

### Résultats

```
Test Suites: 5 passed, 5 total
Tests:       27 passed, 27 total
Time:        ~2 seconds
Coverage:    100% (classes d'erreur)
```

## 🚀 Installation

Les dépendances de test sont déjà installées. Si vous clonez le projet :

```bash
# Installer toutes les dépendances
pnpm install

# Ou seulement les dépendances de dev
pnpm install --only=dev
```

### Dépendances de Test

- **jest** - Framework de test
- **supertest** - Tests HTTP (optionnel)
- **@types/jest** - Types TypeScript
- **cross-env** - Variables d'environnement cross-platform

## 🧪 Exécution des Tests

### Commandes Disponibles

```bash
# Exécuter tous les tests avec rapport de couverture
pnpm test

# Mode watch (développement)
pnpm run test:watch

# Mode CI/CD (utilisé par Jenkins)
pnpm run test:ci
```

### Exemples de Sortie

```
PASS __tests__/classes/ErrorClasses.test.js
  Error Classes
    UserError
      ✓ should create UserError with code and message (3 ms)
    AuthError
      ✓ should create AuthError with code and message (1 ms)
    ...

Test Suites: 5 passed, 5 total
Tests:       27 passed, 27 total
```

## 📁 Structure

```
social_network_back/
├── __tests__/                          # Tests unitaires
│   ├── setup.js                        # Configuration globale
│   ├── utils.test.js                   # Tests bcrypt
│   ├── README.md                       # Documentation des tests
│   ├── GUIDE_ADDING_TESTS.md          # Guide d'ajout de tests
│   ├── classes/
│   │   └── ErrorClasses.test.js       # Tests classes d'erreur
│   ├── controllers/
│   │   ├── AuthController.test.js     # Tests auth
│   │   └── UserController.test.js     # Tests user
│   └── middlewares/
│       └── auth.test.js               # Tests JWT
├── __mocks__/                          # Mocks pour les tests
│   └── bcrypt.js                       # Mock bcrypt
├── coverage/                           # Rapports de couverture (généré)
│   └── index.html                      # Rapport HTML interactif
├── jest.config.js                      # Configuration Jest
├── TESTS_SUMMARY.md                    # Résumé complet
├── VERIFICATION.md                     # Checklist de vérification
└── Jenkinsfile                         # Pipeline CI/CD mis à jour
```

## 📚 Documentation

### Documents Disponibles

1. **[TESTS_SUMMARY.md](./TESTS_SUMMARY.md)**
   - Résumé complet de tous les tests
   - Configuration et dépendances
   - Intégration Jenkins

2. **[VERIFICATION.md](./VERIFICATION.md)**
   - Checklist de vérification
   - Résultats détaillés
   - Problèmes connus et solutions

3. **[__tests__/README.md](./__tests__/README.md)**
   - Guide des tests
   - Structure des tests
   - Bonnes pratiques

4. **[__tests__/GUIDE_ADDING_TESTS.md](./__tests__/GUIDE_ADDING_TESTS.md)**
   - Comment ajouter de nouveaux tests
   - Exemples de code
   - Matchers Jest

## 🔄 CI/CD avec Jenkins

### Configuration Automatique

Le `Jenkinsfile` a été configuré pour :

1. **Cloner le repository**
2. **Installer les dépendances** (`npm install`)
3. **Exécuter les tests** (`npm run test:ci`)
4. **Publier le rapport de couverture** (HTML)

### Pipeline Jenkins

```groovy
stage("Run Tests") {
    steps {
        echo "Running unit tests..."
        nodejs('nodejs') {
            sh 'npm run test:ci'
        }
    }
    post {
        always {
            publishHTML([
                reportDir: 'coverage',
                reportFiles: 'index.html',
                reportName: 'Coverage Report'
            ])
        }
        success {
            echo "Tests passed successfully!"
        }
        failure {
            echo "Tests failed!"
        }
    }
}
```

### Accès au Rapport de Couverture

Dans Jenkins :
1. Ouvrir le build
2. Cliquer sur **"Coverage Report"**
3. Explorer le rapport HTML interactif

## 📊 Couverture de Code

### Statistiques Actuelles

```
File                  | Statements | Branches | Functions | Lines
----------------------|------------|----------|-----------|--------
src/classes/          |     100%   |    50%   |   100%    |  100%
  ArticleError.js     |     100%   |   100%   |   100%    |  100%
  AuthError.js        |     100%   |    50%   |   100%    |  100%
  CommentError.js     |     100%   |   100%   |   100%    |  100%
  MessageError.js     |     100%   |   100%   |   100%    |  100%
  RoomError.js        |     100%   |   100%   |   100%    |  100%
  SubscriptionError.js|     100%   |   100%   |   100%    |  100%
  UserError.js        |     100%   |   100%   |   100%    |  100%
```

### Visualiser la Couverture

```bash
# Générer et ouvrir le rapport
pnpm test
start coverage/index.html  # Windows
open coverage/index.html   # macOS
xdg-open coverage/index.html  # Linux
```

## 🛠️ Contribuer

### Ajouter de Nouveaux Tests

1. **Créer un fichier de test**
   ```bash
   touch __tests__/controllers/MonController.test.js
   ```

2. **Écrire les tests**
   ```javascript
   import { describe, test, expect } from '@jest/globals';
   
   describe('Mon Module', () => {
     test('devrait faire quelque chose', () => {
       expect(true).toBe(true);
     });
   });
   ```

3. **Exécuter les tests**
   ```bash
   pnpm test MonController.test.js
   ```

Consultez **[GUIDE_ADDING_TESTS.md](./__tests__/GUIDE_ADDING_TESTS.md)** pour plus de détails.

### Bonnes Pratiques

- ✅ Un test = une fonctionnalité testée
- ✅ Noms de tests descriptifs (commençant par "should")
- ✅ Structure AAA : Arrange, Act, Assert
- ✅ Tester les cas normaux ET les cas d'erreur
- ✅ Maintenir une couverture > 80%

## 🔍 Dépannage

### Problème : Tests ne passent pas sur Windows

**Solution** : Nous utilisons `cross-env` pour la compatibilité

### Problème : Erreur bcrypt bindings

**Solution** : Le mock dans `__mocks__/bcrypt.js` résout ce problème

### Problème : SQLite bindings manquants

**Solution** : Les tests unitaires n'utilisent pas la DB réelle

## 📞 Support

Pour toute question :

1. Consulter la [documentation](./__tests__/README.md)
2. Lire le [guide d'ajout de tests](./__tests__/GUIDE_ADDING_TESTS.md)
3. Vérifier la [checklist](./VERIFICATION.md)

## 📝 Changelog

### Version 1.0.0 (3 novembre 2025)

- ✅ Ajout de 27 tests unitaires
- ✅ Configuration Jest complète
- ✅ Intégration CI/CD Jenkins
- ✅ Rapports de couverture automatiques
- ✅ Documentation complète

## 📄 Licence

Ce projet fait partie du projet Social Network API.

---

**Créé avec ❤️ pour l'automatisation des tests via Jenkins**
