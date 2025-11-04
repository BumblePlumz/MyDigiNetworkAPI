# API Documentation

Bienvenue dans la documentation de notre API. Cette API offre des fonctionnalités robustes pour interagir avec notre système.

## Swagger Documentation
Vous pouvez accéder à la documentation Swagger de l'API en visitant l'URL suivante :
[http://localhost:3000/api/docs](http://localhost:3000/api/docs)
Cette documentation interactive vous permet de tester les différentes endpoints et de voir les détails des requêtes et réponses.

## Interface GraphQL
Pour utiliser l'interface de requête GraphQL, rendez-vous à l'URL suivante :
[http://localhost:3000/graphql](http://localhost:3000/graphql)
Cette interface vous permet d'exécuter des requêtes GraphQL et de manipuler les données de manière flexible.

### Exemple de query :

```graphql
query {
    articles {
        id
        title
        content
        comments {
            id
            content
            author {
                id
                firstname
                lastname
                email
            }
        }
        author {
            id
            firstname
            lastname
        }
    }
}
```

# Installation et Démarrage

Pour installer et démarrer l'API, suivez les étapes ci-dessous :
NB: Ce projet utilise pnpm.

1. Clonez le dépôt :
    ```bash
    git clone [TODO](https://github.com/votre-repo.git)
    ```
2. Installez les dépendances :
    ```bash
    cd votre-repo
    pnpm install
    ```
3. Démarrez le serveur :
    ```bash
    pnpm dev
    ```
4. l'url de base est : http://localhost:3000

## Utilisation

Démarrer le projet react associé.
NB: Ce projet utilise pnpm.


1. Clonez le dépôt :
    ```bash
    git clone [TODO](https://github.com/votre-repo.git)
    ```
2. Installez les dépendances :
    ```bash
    cd votre-repo
    pnpm install
    ```
3. Démarrez le serveur :
    ```bash
    pnpm dev
    ```
4. L'url de base est : http://localhost:5173
5. Créer un compte utilisateur ou connecter vous.
6. Aller dans la section Chat M


### Requêtes REST
Utilisez les endpoints documentés dans Swagger pour effectuer des requêtes REST.

### Requêtes GraphQL
Utilisez l'interface GraphQL pour exécuter des requêtes et des mutations.

## Support

Pour toute question ou problème, veuillez ouvrir une issue sur le dépôt GitHub ou contacter notre équipe de support.

Merci d'utiliser notre API !

<!-- Modification pour CI/CD -->