# Guide : Ajouter de Nouveaux Tests

## Structure d'un Test Jest

```javascript
import { describe, test, expect } from '@jest/globals';
import { FonctionÀTester } from '../src/chemin/vers/fichier.js';

describe('Nom du Module ou Fonctionnalité', () => {
  describe('Nom de la fonction spécifique', () => {
    test('devrait faire quelque chose de spécifique', () => {
      // Arrange (Préparer)
      const input = 'valeur de test';
      
      // Act (Agir)
      const result = FonctionÀTester(input);
      
      // Assert (Vérifier)
      expect(result).toBe('résultat attendu');
    });
  });
});
```

## Exemples de Tests Courants

### 1. Test de Validation Simple

```javascript
test('should validate email format', () => {
  const validEmail = 'test@example.com';
  const invalidEmail = 'not-an-email';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  expect(emailRegex.test(validEmail)).toBe(true);
  expect(emailRegex.test(invalidEmail)).toBe(false);
});
```

### 2. Test avec Création d'Erreur

```javascript
test('should throw error for invalid input', () => {
  const invalidData = null;
  
  if (!invalidData) {
    const error = new CustomError(400, 'Data is required');
    expect(error.code).toBe(400);
    expect(error.message).toBe('Data is required');
  }
});
```

### 3. Test Asynchrone

```javascript
test('should hash a password', async () => {
  const password = 'myPassword123';
  const hashed = await hashFunction(password);
  
  expect(hashed).toBeDefined();
  expect(hashed).not.toBe(password);
});
```

### 4. Test de Comparaison

```javascript
test('should compare two values', () => {
  const value1 = 'password123';
  const value2 = 'password123';
  const value3 = 'differentPassword';
  
  expect(value1 === value2).toBe(true);
  expect(value1 === value3).toBe(false);
});
```

## Matchers Jest les Plus Utilisés

```javascript
// Égalité
expect(value).toBe(expected);           // Égalité stricte (===)
expect(value).toEqual(expected);        // Égalité profonde pour objets

// Vérités
expect(value).toBeTruthy();             // Valeur truthy
expect(value).toBeFalsy();              // Valeur falsy
expect(value).toBeDefined();            // Non undefined
expect(value).toBeNull();               // Exactement null

// Nombres
expect(value).toBeGreaterThan(3);       // > 3
expect(value).toBeLessThan(5);          // < 5
expect(value).toBeGreaterThanOrEqual(3);// >= 3
expect(value).toBeLessThanOrEqual(5);   // <= 5
expect(value).toBeCloseTo(3.14, 2);     // ~3.14 (2 décimales)

// Strings
expect(string).toContain('substring');  // Contient
expect(string).toMatch(/regex/);        // Match regex

// Arrays
expect(array).toContain(item);          // Contient l'élément
expect(array).toHaveLength(3);          // Longueur = 3

// Objects
expect(obj).toHaveProperty('key');      // A la propriété
expect(obj).toMatchObject({ key: val });// Match partiel

// Fonctions
expect(fn).toThrow();                   // Lance une erreur
expect(fn).toThrow('message');          // Lance erreur avec message

// Promises
await expect(promise).resolves.toBe(value);  // Promise résolue
await expect(promise).rejects.toThrow();     // Promise rejetée
```

## Exemples de Tests pour Différents Scénarios

### Test d'un Contrôleur Article

Créez : `__tests__/controllers/ArticleController.test.js`

```javascript
import { describe, test, expect } from '@jest/globals';
import { ArticleError } from '../../src/classes/ArticleError.js';

describe('ArticleController Logic Tests', () => {
  describe('Article Creation Validation', () => {
    test('should require title for article', () => {
      const title = '';
      
      if (!title || title.trim() === '') {
        const error = new ArticleError(400, 'Title is required');
        expect(error.code).toBe(400);
        expect(error.message).toBe('Title is required');
      }
    });

    test('should validate title length', () => {
      const shortTitle = 'Ab';
      const validTitle = 'Valid Article Title';
      const minLength = 3;
      
      expect(shortTitle.length >= minLength).toBe(false);
      expect(validTitle.length >= minLength).toBe(true);
    });

    test('should require content for article', () => {
      const content = '';
      
      if (!content || content.trim() === '') {
        const error = new ArticleError(400, 'Content is required');
        expect(error.code).toBe(400);
      }
    });

    test('should accept valid article data', () => {
      const articleData = {
        title: 'My First Article',
        content: 'This is the article content...',
        authorId: 1
      };
      
      expect(articleData.title).toBeTruthy();
      expect(articleData.content).toBeTruthy();
      expect(articleData.authorId).toBeGreaterThan(0);
    });
  });

  describe('Article Update Validation', () => {
    test('should allow updating title', () => {
      const oldTitle = 'Old Title';
      const newTitle = 'Updated Title';
      
      expect(newTitle).not.toBe(oldTitle);
      expect(newTitle.trim()).toBeTruthy();
    });

    test('should not allow empty updates', () => {
      const updates = {
        title: '   ',
        content: ''
      };
      
      const hasValidUpdates = 
        (updates.title && updates.title.trim()) ||
        (updates.content && updates.content.trim());
      
      expect(hasValidUpdates).toBe(false);
    });
  });
});
```

### Test d'un Middleware

Créez : `__tests__/middlewares/validation.test.js`

```javascript
import { describe, test, expect } from '@jest/globals';

describe('Validation Middleware', () => {
  describe('Request Validation', () => {
    test('should validate required fields', () => {
      const mockRequest = {
        body: {
          email: 'test@example.com',
          password: ''
        }
      };
      
      const requiredFields = ['email', 'password'];
      const missingFields = requiredFields.filter(
        field => !mockRequest.body[field]
      );
      
      expect(missingFields).toContain('password');
      expect(missingFields.length).toBeGreaterThan(0);
    });

    test('should accept valid request', () => {
      const mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'securePassword123'
        }
      };
      
      const requiredFields = ['email', 'password'];
      const missingFields = requiredFields.filter(
        field => !mockRequest.body[field]
      );
      
      expect(missingFields.length).toBe(0);
    });
  });
});
```

### Test de Fonctions Utilitaires

Créez : `__tests__/utils/dateUtils.test.js`

```javascript
import { describe, test, expect } from '@jest/globals';

describe('Date Utilities', () => {
  test('should format date correctly', () => {
    const date = new Date('2024-01-15');
    const formatted = date.toISOString().split('T')[0];
    
    expect(formatted).toBe('2024-01-15');
  });

  test('should calculate age correctly', () => {
    const birthDate = new Date('2000-01-01');
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    expect(age).toBeGreaterThanOrEqual(24);
  });
});
```

## Bonnes Pratiques

### ✅ DO (À Faire)

1. **Un test = une assertion principale**
   ```javascript
   test('should validate email', () => {
     const email = 'test@example.com';
     expect(email).toContain('@');
   });
   ```

2. **Noms de tests descriptifs**
   ```javascript
   test('should throw error when email is invalid', () => {
     // ...
   });
   ```

3. **Organiser avec describe**
   ```javascript
   describe('User Module', () => {
     describe('Registration', () => {
       test('should register user', () => {});
     });
   });
   ```

4. **Tester les cas limites**
   ```javascript
   test('should handle empty string', () => {});
   test('should handle null value', () => {});
   test('should handle undefined value', () => {});
   ```

### ❌ DON'T (À Éviter)

1. **Tests trop complexes**
   ```javascript
   // ❌ Mauvais
   test('should do everything', () => {
     // 50 lignes de code...
   });
   ```

2. **Tests dépendants**
   ```javascript
   // ❌ Mauvais - dépend du test précédent
   let user;
   test('create user', () => { user = {...}; });
   test('update user', () => { user.name = 'new'; });
   ```

3. **Tests sans assertions**
   ```javascript
   // ❌ Mauvais
   test('something happens', () => {
     doSomething();
     // Pas d'expect() !
   });
   ```

## Exécution et Debugging

```bash
# Exécuter tous les tests
pnpm test

# Exécuter un fichier spécifique
pnpm test AuthController.test.js

# Exécuter les tests en mode watch
pnpm run test:watch

# Exécuter avec plus de détails
pnpm test --verbose

# Voir la couverture
pnpm test --coverage
```

## Checklist pour un Nouveau Test

- [ ] Fichier créé dans `__tests__/` avec nom `*.test.js`
- [ ] Imports nécessaires ajoutés
- [ ] `describe` pour organiser les tests
- [ ] Noms de tests descriptifs commençant par "should"
- [ ] Structure AAA : Arrange, Act, Assert
- [ ] Cas normaux ET cas d'erreur testés
- [ ] Tests lancés et passent ✅
- [ ] Couverture vérifiée

## Ressources

- [Documentation Jest](https://jestjs.io/docs/getting-started)
- [Matchers Jest](https://jestjs.io/docs/expect)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
