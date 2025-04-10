# Vapeur

**Vapeur** est une application web dédiée à la gestion de collections de jeux vidéo. Elle permet d’ajouter, modifier, supprimer et organiser des jeux par genres et éditeurs. L’interface met en avant des jeux sélectionnés et offre une expérience fluide.
Vapeur est une application web développée par **Emilien de Robert de Bousquet** et **Nathanaël Seitz**.

## Technologies utilisées

- **Backend** : Express.js
- **Base de données** : SQLite avec Prisma
- **Moteur de templates** : Handlebars (hbs)
- **Gestion des versions** : Git

## Installation

* Clonez le repository : 
```bash
git clone https://github.com/EmilPhOniX/Vapeur
```

Pour commencer avec le projet, exécutez la commande :

* Installez les dépendances :
    ```bash
    npm install
    ```

## Le script serveur.js se lance en postinstall

**Ce script permet :**

1. D'installer les dépendances

2. La création de l'environnement de variables .env

3. La création de la base de données .db 

4. D'exécuter les migrations de la base de données :

## Utilisation

Pour démarrer l'application, utilisez la commande :
```bash
npm start
```
L'application démarre avec nodemon

Tous droits libres © 2025 Emilien de Robert de Bousquet et Nathanaël Seitz.
Ce projet est open source. Vous êtes libre de l’utiliser, le modifier et le partager comme bon vous semble. La mention des auteurs originaux est fortement appréciée.
