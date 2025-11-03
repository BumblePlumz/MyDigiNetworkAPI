# Tests Unitaires - Social Network API

## Configuration des Tests

Ce projet utilise **Jest** comme framework de test avec **Supertest** pour tester les endpoints de l'API.

## Structure des Tests

```
__tests__/
├── setup.js                    # Configuration globale des tests
├── utils.test.js              # Tests des fonctions utilitaires
├── classes/
│   └── ErrorClasses.test.js   # Tests des classes d'erreur personnalisées
├── controllers/
│   ├── AuthController.test.js # Tests du contrôleur d'authentification
│   └── UserController.test.js # Tests du contrôleur utilisateur
└── middlewares/
    └── auth.test.js           # Tests du middleware d'authentification
```

## Scripts de Test Disponibles

### Exécution des tests

```bash
# Lancer tous les tests avec rapport de couverture
pnpm test

# Lancer les tests en mode watch (développement)
pnpm run test:watch

# Lancer les tests pour CI/CD (utilisé par Jenkins)
pnpm run test:ci
```

## Couverture de Code

Les rapports de couverture sont générés dans le dossier `coverage/` et incluent :
- **Text** : Affichage dans le terminal
- **LCOV** : Format pour les outils d'intégration continue
- **HTML** : Rapport visuel accessible via `coverage/index.html`

### Zones couvertes

Les tests couvrent :
- ✅ Fonctions utilitaires (cryptage, comparaison, mise à jour du temps)
- ✅ Contrôleurs (Auth, User)
- ✅ Classes d'erreur personnalisées
- ✅ Middleware d'authentification JWT
- ❌ Routes (non couvertes par configuration)
- ❌ WebSocket (non couvert par configuration)

## Intégration avec Jenkins

Le fichier `Jenkinsfile` a été configuré pour :

1. **Installer les dépendances** : `npm install`
2. **Exécuter les tests** : `npm run test:ci`
3. **Publier les rapports de couverture** : HTML Coverage Report

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
    }
}
```

## Ajout de Nouveaux Tests

Pour ajouter de nouveaux tests :

1. Créez un fichier `*.test.js` dans le dossier `__tests__/`
2. Importez les modules nécessaires :
   ```javascript
   import { describe, test, expect, jest, beforeEach } from '@jest/globals';
   ```
3. Écrivez vos tests avec la structure :
   ```javascript
   describe('Feature Name', () => {
     test('should do something', () => {
       // Arrange
       const input = 'test';
       
       // Act
       const result = someFunction(input);
       
       // Assert
       expect(result).toBe('expected');
     });
   });
   ```

## Bonnes Pratiques

- ✅ Un test = une fonctionnalité testée
- ✅ Utiliser des noms de tests descriptifs
- ✅ Mocker les dépendances externes (base de données, APIs)
- ✅ Tester les cas d'erreur et les cas limites
- ✅ Maintenir une couverture de code > 80%

## Dépannage

### Erreur : Cannot use import statement outside a module
Solution : Assurez-vous que `"type": "module"` est dans `package.json`

### Erreur : Jest did not exit one second after the test run
Solution : Ajoutez `forceExit: true` dans `jest.config.js`

### Les tests passent localement mais échouent sur Jenkins
Solution : Utilisez `npm run test:ci` qui limite les workers à 2 et active le mode CI

## Ressources

- [Documentation Jest](https://jestjs.io/)
- [Documentation Supertest](https://github.com/visionmedia/supertest)
- [Best Practices Testing](https://testingjavascript.com/)
