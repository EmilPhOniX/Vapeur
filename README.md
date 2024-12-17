# Vapeur

**Vapeur** est une application web dédiée à la gestion de collections de jeux vidéo. Elle permet d’ajouter, modifier, supprimer et organiser des jeux par genres et éditeurs. L’interface met en avant des jeux sélectionnés et offre une expérience fluide.
Vapeur est une application web développée par **Emilien de Robert de Bousquet** et **Nathanaël Seitz**.

## Technologies utilisées

- **Backend** : Express.js
- **Base de données** : SQLite avec Prisma
- **Moteur de templates** : Handlebars (hbs)
- **Gestion des versions** : Git

## Installation

Pour commencer avec le projet, executez les commandes suivantes :

1. Installez les dépendances :
    ```bash
    npm install
    ```

2. Crée l'environnement de base de donnée ! 
    ```bash
    echo 'DATABASE_URL="file:./TO_BE_REPLACED"' > .env
    ```

3. Dans le .env remplacez le "TO_BE_REPLACED" par l'URL de votre base de donnée

4. Exécutez les migrations de la base de  données :
    ```bash
    npx prisma migrate dev --name init
    ```

## Utilisation

Pour démarrer l'application, utilisez la commande :
```bash
npm start
```
L'application démarre avec nodemon
