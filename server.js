// Point d'entrée principal du serveur
const app = require("./app/server");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
      where: { id: parseInt(req.params.id) },
      include: { genre: true, editeur: true },
    });

    //Les dates
    const releaseDateFormatted = jeu.releaseDate.toISOString().split("T")[0]; // Formatage de la date pour l'input date (YYYY-MM-DD)
    const releaseDateFormattedString = new Date(
      jeu.releaseDate,
    ).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }); // Autre formatage de la date Jour Mois Année pour l'affichage

    //Datas récupérées pour les réutiliser dans la vue
    const genres = await prisma.genreDeJeux.findMany(); //Les genres récupérés
    const editeurs = await prisma.editeursDeJeux.findMany(); //Les éditeurs récupérés

    // Passer toutes les variables nécessaires à la vue
    res.render("gameDetail", {
      jeu,
      releaseDateFormatted,
      releaseDateFormattedString,
      genres,
      editeurs,
    });
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

    if (!genreRecord) {
      return res.status(400).send(`Le genre "${genre}" est introuvable.`);
    }

    // Recherche de l'éditeur par son nom
    const editeurRecord = await prisma.editeursDeJeux.findFirst({
      where: { editeur: editeur.trim() }, // Suppression des espaces inutiles
    });

    if (!editeurRecord) {
      return res.status(400).send(`L'éditeur "${editeur}" est introuvable.`);
    }

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
      data: { editeur: editeur.trim() }, // Ajout avec nettoyage des espaces
    });

    res.redirect("/");
  } catch (error) {
    console.error("Erreur lors de la création de l'éditeur :", error);
    res
      .status(500)
      .send("Une erreur est survenue lors de l'ajout de l'éditeur.");
  }
});

// Route READ pour afficher un éditeur
app.get("/publishers/:id", async (req, res) => {
  const publisher = await prisma.editeursDeJeux.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { jeux: true },
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
    include: { jeux: true },
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
  res
    .status(500)
    .render("500", { message: "Une erreur serveur est survenue." });
});
