const express = require("express");
const hbs = require("hbs");
const router = express.Router();

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

// Helpers Handlebars
hbs.registerHelper("eq", (a, b) => a === b); // Helper pour comparer des valeurs

// Helper pour trier les jeux par titre
hbs.registerHelper('sort', (array, key) => {
    return array.sort((a, b) => {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
    });
});

//mélangeur
router.get('/', async (req, res) => {
    try {
        // Récupérer tous les jeux
        const allGames = await prisma.game.findMany();

        // Mélanger les jeux et en sélectionner trois aléatoirement
        const shuffledGames = allGames.sort(() => 0.5 - Math.random()).slice(0, 3);

        res.render('index', {
            games: allGames,
            randomGames: shuffledGames
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur du serveur');
    }
});

module.exports = router;

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
                editeurId: editeurRecord.idEditeur, // Utilisation de l'ID de l'éditeur trouvé
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
    
    // Si le jeu n'existe pas, on renvoie vers la page 404
    if (!jeu) {
        return res.status(404).render("404", { message: "Jeu introuvable" });
    }
});

// Route READ détaillée pour afficher un jeu
app.get("/games/:id/detail", async (req, res) => {
    try {
        const jeu = await prisma.jeux.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { genre: true, editeur: true },
        });

        //Les dates
        const releaseDateFormatted = jeu.releaseDate.toISOString().split("T")[0]; // Formatage de la date pour l'input date (YYYY-MM-DD)
        const releaseDateFormattedString = new Date(jeu.releaseDate).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" }); // Autre formatage de la date Jour Mois Année pour l'affichage

        //Datas récupérées pour les réutiliser dans la vue
        const genres = await prisma.genreDeJeux.findMany(); //Les genres récupérés
        const editeurs = await prisma.editeursDeJeux.findMany(); //Les éditeurs récupérés

        // Passer toutes les variables nécessaires à la vue
        res.render("gameDetail", { jeu, releaseDateFormatted, releaseDateFormattedString, genres, editeurs });

    } catch (error) {
        console.error("Erreur lors de la récupération du jeu :", error);
        res.status(500).send("Une erreur est survenue.");
    }
});

// Route UPDATE pour modifier un jeu
app.post("/games/:id/update", async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);
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

        // Mise à jour du jeu dans la base
        await prisma.jeux.update({
            where: { id: gameId },
            data: {
                title: title.trim(),
                description: description.trim(),
                releaseDate: new Date(releaseDate),
                genreId: genreRecord.idGenre, // Utilisation de l'ID du genre trouvé
                editeurId: editeurRecord.idEditeur, // Utilisation de l'ID de l'éditeur trouvé
            },
        });

        res.redirect(`/games/${gameId}/detail`);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du jeu :", error);
        res.status(500).send("Une erreur est survenue.");
    }
});

// Route DELETE pour supprimer un jeu
app.get("/games/:id/delete", async (req, res) => {
    try {
        const gameId = parseInt(req.params.id);
        const deletedGame = await prisma.jeux.delete({
            where: { id: gameId },
        });
        // Rediriger vers la page d'accueil
        res.redirect("/");
    } catch (error) {
        console.error("Erreur lors de la suppression du jeu :", error);
        res.status(500).send("Une erreur est survenue.");
    }
});


/*-------------------------------------------------------------------------------------------*/
/*--------------------------------------Routes editeurs--------------------------------------*/
/*-------------------------------------------------------------------------------------------*/

// Route CREATE pour ajouter un éditeur
app.post("/publisher", async (req, res) => {
    try {
        const { editeur } = req.body; // Utilisez le nom correspondant au champ du formulaire

        if (!editeur || editeur.trim() === "") {
            return res.status(400).send("Le champ 'Editeur' est requis.");
        }

        await prisma.editeursDeJeux.create({
            data: { editeur: editeur.trim() } // Ajout avec nettoyage des espaces
        });

        res.redirect("/");
    } catch (error) {
        console.error("Erreur lors de la création de l'éditeur :", error);
        res.status(500).send("Une erreur est survenue lors de l'ajout de l'éditeur.");
    }
});

// Route READ pour afficher un éditeur
app.get("/publishers/:id", async (req, res) => {
    const publisher = await prisma.editeursDeJeux.findUnique({
        where: { id: parseInt(req.params.id) },
        include: { jeux: true }
    });
    res.render("publisher", { publisher });
});

// Route READ détaillée pour afficher un éditeur
app.get("/publishers/:id/detail", async (req, res) => {
    try {
        const publisherId = parseInt(req.params.id);

        if (isNaN(publisherId)) {
            return res.status(400).send("ID invalide.");
        }

        const editeur = await prisma.editeursDeJeux.findUnique({
            where: { idEditeur: publisherId }, // Correction ici
            include: { jeux: true },
        });

        if (!editeur) {
            return res.status(404).send("Éditeur introuvable.");
        }

        res.render("editeurDetail", { editeur, jeux: editeur.jeux });
    } catch (error) {
        console.error("Erreur lors de la récupération de l'éditeur :", error);
        res.status(500).send("Une erreur est survenue.");
    }
});

// Route UPDATE pour modifier un éditeur
app.post("/publishers/:id/update", async (req, res) => {
    try {
        const publisherId = parseInt(req.params.id);
        const { editeur } = req.body;

        if (!editeur || editeur.trim() === "") {
            return res.status(400).send("Le champ 'Editeur' est requis.");
        }

        // Mise à jour de l'éditeur dans la base
        await prisma.editeursDeJeux.update({
            where: { idEditeur: publisherId },
            data: { editeur: editeur.trim() },
        });

        res.redirect(`/publishers/${publisherId}/detail`);
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'éditeur :", error);
        res.status(500).send("Une erreur est survenue.");
    }
});

// Route DELETE pour supprimer un éditeur
app.get("/publishers/:id/delete", async (req, res) => {
    try {
        const publisherId = parseInt(req.params.id);

        // Utiliser le bon nom de champ pour la clé primaire
        const deletedPublisher = await prisma.editeursDeJeux.delete({
            where: { idEditeur: publisherId },
        });

        // Rediriger vers la page d'accueil
        res.redirect("/");
    } catch (error) {
        console.error("Erreur lors de la suppression de l'éditeur :", error);
        res.status(500).send("Une erreur est survenue.");
    }
});


/*-------------------------------------------------------------------------------------------*/
/*--------------------------------------Routes genres----------------------------------------*/
/*-------------------------------------------------------------------------------------------*/

// Route READ pour afficher les jeux d'un genre
app.get("/genres/:idGenre/detail", async (req, res) => {
    try {
        const genreId = parseInt(req.params.idGenre);

        if (isNaN(genreId)) {
            return res.status(400).send("ID invalide.");
        }

        // Récupérer le genre avec ses jeux
        const genre = await prisma.genreDeJeux.findUnique({
            where: { idGenre: genreId },
            include: {
                jeux: {
                    include: {
                        editeur: true, // Inclure l'éditeur des jeux
                    },
                },
            },
        });

        if (!genre) {
            return res.status(404).send("Genre introuvable.");
        }

        res.render("genresDetail", { genre });
    } catch (error) {
        console.error("Erreur lors de la récupération des jeux du genre :", error);
        res.status(500).send("Une erreur est survenue.");
    }
});

// Route READ pour afficher un genre
app.get("/genres/:idGenre", async (req, res) => {
    const genre = await prisma.genreDeJeux.findUnique({
        where: { idGenre: parseInt(req.params.idGenre) },
        include: { jeux: true }
    });
    res.render("genre", { genre });
});

 // Route READ pour afficher la liste des genres
app.get("/genres", async (req, res) => {
    const genres = await prisma.genreDeJeux.findMany();
    res.render("genres", { genres });
});

/*-------------------------------------------------------------------------------------------*/
/*---------------------------------Routes Gestions d'erreurs---------------------------------*/
/*-------------------------------------------------------------------------------------------*/

// Route pour la page 404
app.get("/404", (req, res) => {
    res.status(404).render("404");
});

// Route 404 redirigeant vers la page d'erreur
app.use((req, res, next) => {
    res.status(404).render("404");
});

// Route 500 pour gérer les erreurs serveur
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render("500", { message: "Une erreur serveur est survenue." });
});