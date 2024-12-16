const express = require("express");
const hbs = require("hbs");

// Importation de Prisma
const { PrismaClient } = require("@prisma/client");
const path = require("path");

// Création de l'application Express
const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

// Configuration de Handlebars pour Express
app.set("view engine", "hbs"); // On définit le moteur de template que Express va utiliser
app.set("views", path.join(__dirname, "views")); // On définit le dossier des vues (dans lequel se trouvent les fichiers .hbs)
hbs.registerPartials(path.join(__dirname, "views", "partials")); // On définit le dossier des partials (composants e.g. header, footer, menu...)

// Middleware pour parser les données entrantes
app.use(express.static(path.join(__dirname, "public"))); // On définit le dossier des fichiers statiques (css, js, images...)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Helper pour comparer deux valeurs
hbs.registerHelper("eq", (a, b) => a === b);

// Démarrage du serveur
app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`); });

/*-------------------------------------------------------------------------------------------*/
/*---------------------------------------Routes Index----------------------------------------*/
/*-------------------------------------------------------------------------------------------*/

// Route pour afficher l'index
app.get("/", async (req, res) => {
    // on passe seulement le nom du fichier .hbs sans l'extention.
    // Le chemin est relatif au dossier `views`.
    const games = await prisma.jeux.findMany({
        include: {
            genre: true,
            editeur: true
        }
    });
    const genres = await prisma.genreDeJeux.findMany();
    const publishers = await prisma.editeursDeJeux.findMany();
    res.render("index", { genres, publishers, games });
});

/*-------------------------------------------------------------------------------------------*/
/*----------------------------------------Routes jeux----------------------------------------*/
/*-------------------------------------------------------------------------------------------*/

// Route CREATE pour ajouter un jeu à la liste
app.post("/games", async (req, res) => {
    try {
        const { title, description, releaseDate, genre, editeur } = req.body;

        // Recherche du genre par son nom
        const genreRecord = await prisma.genreDeJeux.findFirst({
            where: { genre: genre.trim() }, // Suppression des espaces inutiles
        });

        if (!genreRecord) { return res.status(400).send(`Le genre "${genre}" est introuvable.`); }

        // Recherche de l'éditeur par son nom
        const editeurRecord = await prisma.editeursDeJeux.findFirst({
            where: { editeur: editeur.trim() }, // Suppression des espaces inutiles
        });

        if (!editeurRecord) { return res.status(400).send(`L'éditeur "${editeur}" est introuvable.`); }

        // Création du jeu dans la base
        await prisma.jeux.create({
            data: {
                title: title.trim(),
                description: description.trim(),
                releaseDate: new Date(releaseDate),
                genreId: genreRecord.idGenre, // Utilisation de l'ID du genre trouvé
                editeurId: editeurRecord.id, // Utilisation de l'ID de l'éditeur trouvé
            },
        });

        res.redirect("/");
    } catch (error) {
        console.error("Erreur lors de la création du jeu :", error);
        res.status(500).send("Une erreur est survenue lors de la création du jeu.");
    }
});

// Route READ pour afficher un jeu dans ma liste
app.get("/games/:id", async (req, res) => {
    const jeu = await prisma.jeux.findUnique({
        where: { id: parseInt(req.params.id) },
        include: { genre: true, editeur: true },
    });

    if (!jeu) { return res.status(404).send("Jeu introuvable"); }
    res.render("game", { jeu });
});

// Route READ détaillée pour afficher un jeu dans ma liste
app.get("/games/:id/detail", async (req, res) => {
    const editMode = req.query.edit === "true"; // Activer le mode édition si "edit=true"

    try {
        const jeu = await prisma.jeux.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { genre: true, editeur: true },
        });

        if (!jeu) {
            return res.status(404).render("404", { message: "Jeu introuvable" });
        }

        // Passer la variable editMode à la vue
        res.render("gameDetail", { jeu, editMode });
    } catch (error) {
        console.error("Erreur lors de la récupération du jeu :", error);
        res.status(500).send("Une erreur est survenue.");
    }
});

// Route pour afficher la page d'édition
app.get("/games/:id/edit", async (req, res) => {
    const gameId = parseInt(req.params.id);

    try {
        // Récupérer les données du jeu
        const game = await prisma.jeux.findUnique({
            where: { id: gameId },
            include: { editeur: true, genre: true }, // Inclure les relations si nécessaire
        });

        // Récupérer les éditeurs (pour la liste déroulante)
        const publishers = await prisma.editeur.findMany();

        if (!game) {
            return res.status(404).render("404", { message: "Jeu introuvable" });
        }

        // Formatage de la date pour l'input date
        const formattedDate = game.releaseDate.toISOString().split("T")[0];

        // Rendre la vue avec les données nécessaires
        res.render("gamedetaileditable", {
            game,
            publishers,
            formattedDate,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération du jeu :", error);
        res.status(500).send("Une erreur est survenue.");
    }
});

// Route UPDATE pour modifier un jeu
app.post("/games/:id/update", async (req, res) => {
    const gameId = parseInt(req.params.id);
    try {
        // Récupérer les données du jeu
        const game = await prisma.jeux.findUnique({
            where: { id: gameId },
            include: { editeur: true, genre: true }, // Inclure les relations si nécessaire
        });

        // Récupérer les éditeurs (pour la liste déroulante)
        const publishers = await prisma.editeur.findMany();

        if (!game) {
            return res.status(404).render("404", { message: "Jeu introuvable" });
        }

        // Formatage de la date pour l'input date
        const formattedDate = game.releaseDate.toISOString().split("T")[0];

        // Rendre la vue avec les données nécessaires
        res.render("gamedetaileditable", {
            game,
            publishers,
            formattedDate,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération du jeu :", error);
        res.status(500).send("Une erreur est survenue.");
    }    
});

// Route DELETE pour supprimer un jeu
app.post("/games/:id/delete", async (req, res) => {
    await prisma.jeux.delete({
        where: { id: parseInt(req.params.id) }
    });
    res.status(204).send();
    res.redirect("/");
});

/*-------------------------------------------------------------------------------------------*/
/*---------------------------------------Routes genres---------------------------------------*/
/*--------On ne peux que lire les genres, on ne peux pas les modifier ou les supprimer-------*/
/*-------------------------------------------------------------------------------------------*/

// Route READ pour afficher la liste des genres
app.get("/genres", async (req, res) => {
    const genres = await prisma.genreDeJeux.findMany();
    res.render("genres", { genres });
});

// Route READ pour afficher un genre
app.get("/genres/:id", async (req, res) => {
    const genre = await prisma.genreDeJeux.findUnique({
        where: { id: parseInt(req.params.id) },
        include: { jeux: true }
    });
    res.render("genre", { genre });
});

/*-------------------------------------------------------------------------------------------*/
/*--------------------------------------Routes editeurs--------------------------------------*/
/*-------------------------------------------------------------------------------------------*/

// Route CREATE pour ajouter un éditeur

// Route READ pour afficher un éditeur

// Route READ/UPDATE pour afficher un formulaire de modification

// Route UPDATE pour modifier un éditeur

// Route DELETE pour supprimer un éditeur

/*-------------------------------------------------------------------------------------------*/
/*---------------------------------Routes Gestions d'erreurs---------------------------------*/
/*-------------------------------------------------------------------------------------------*/

// Route 404 redirigeant vers la page d'erreur
app.use((req, res) => {
    res.redirect("/404");
});