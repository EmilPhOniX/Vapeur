const express = require("express");
const hbs = require("hbs");

// Importation de Prisma
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const { compileFunction } = require("vm");

// Création de l'application Express
const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

// Configuration de Handlebars pour Express
app.set("view engine", "hbs"); // On définit le moteur de template que Express va utiliser
app.set("views", path.join(__dirname, "views")); // On définit le dossier des vues (dans lequel se trouvent les fichiers .hbs)
hbs.registerPartials(path.join(__dirname, "views", "partials")); // On définit le dossier des partials (composants e.g. header, footer, menu...)

// Middleware pour parser les données entrantes
app.use(express.static("public")); // On définit le dossier des fichiers statiques (css, js, images...)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Route pour afficher l'index
app.get("/", async (req, res) => {
    // on passe seulement le nom du fichier .hbs sans l'extention.
    // Le chemin est relatif au dossier `views`.
    // On peut aller chercher des templates dans les sous-dossiers (e.g. `movies/details`).
    res.render("index");
});