const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const isApiRequest = (req) => req.originalUrl.startsWith("/api/");

// ============ ROUTES DE RENDU ============

// Afficher les détails d'un jeu
exports.gameDetail = async (req, res) => {
  try {
    const jeu = await prisma.jeux.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { genre: true, editeur: true },
    });

    if (!jeu) {
      return res.status(404).render("404", { message: "Jeu introuvable" });
    }

    // Formatage des dates
    const releaseDateFormatted = jeu.releaseDate.toISOString().split("T")[0];
    const releaseDateFormattedString = new Date(
      jeu.releaseDate,
    ).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const genres = await prisma.genreDeJeux.findMany();
    const editeurs = await prisma.editeursDeJeux.findMany();

    res.render("gameDetail", {
      jeu,
      releaseDateFormatted,
      releaseDateFormattedString,
      genres,
      editeurs,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du jeu :", error);
    res.status(500).render("500");
  }
};

// ============ ROUTES API (JSON) ============

// Récupérer tous les jeux
exports.getAllGames = async (req, res) => {
  try {
    const games = await prisma.jeux.findMany({
      include: {
        genre: true,
        editeur: true,
      },
    });
    res.json(games);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Récupérer un jeu par ID
exports.getGameById = async (req, res) => {
  try {
    const game = await prisma.jeux.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        genre: true,
        editeur: true,
      },
    });
    if (!game) return res.status(404).json({ error: "Jeu non trouvé" });
    res.json(game);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Créer un jeu
exports.createGame = async (req, res) => {
  try {
    const { title, description, releaseDate, genre, editeur } = req.body;

    // Recherche du genre par son nom
    const genreRecord = await prisma.genreDeJeux.findFirst({
      where: { genre: genre.trim() },
    });

    if (!genreRecord) {
      if (isApiRequest(req)) {
        return res
          .status(400)
          .json({ error: `Le genre "${genre}" est introuvable.` });
      }

      return res.redirect("/");
    }

    // Recherche de l'éditeur par son nom
    const editeurRecord = await prisma.editeursDeJeux.findFirst({
      where: { editeur: editeur.trim() },
    });

    if (!editeurRecord) {
      if (isApiRequest(req)) {
        return res
          .status(400)
          .json({ error: `L'éditeur "${editeur}" est introuvable.` });
      }

      return res.redirect("/");
    }

    const game = await prisma.jeux.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        releaseDate: new Date(releaseDate),
        genreId: genreRecord.idGenre,
        editeurId: editeurRecord.idEditeur,
      },
      include: {
        genre: true,
        editeur: true,
      },
    });
    if (isApiRequest(req)) {
      return res.status(201).json(game);
    }

    return res.redirect("/");
  } catch (error) {
    console.error(error);
    if (isApiRequest(req)) {
      return res.status(500).json({ error: "Erreur serveur" });
    }

    return res.redirect("/500");
  }
};

// Mettre à jour un jeu
exports.updateGame = async (req, res) => {
  try {
    const gameId = parseInt(req.params.id);
    const { title, description, releaseDate, genre, editeur } = req.body;

    // Recherche du genre par son nom
    const genreRecord = await prisma.genreDeJeux.findFirst({
      where: { genre: genre.trim() },
    });

    if (!genreRecord) {
      if (isApiRequest(req)) {
        return res
          .status(400)
          .json({ error: `Le genre "${genre}" est introuvable.` });
      }

      return res.redirect(`/games/${gameId}/detail`);
    }

    // Recherche de l'éditeur par son nom
    const editeurRecord = await prisma.editeursDeJeux.findFirst({
      where: { editeur: editeur.trim() },
    });

    if (!editeurRecord) {
      if (isApiRequest(req)) {
        return res
          .status(400)
          .json({ error: `L'éditeur "${editeur}" est introuvable.` });
      }

      return res.redirect(`/games/${gameId}/detail`);
    }

    const game = await prisma.jeux.update({
      where: { id: gameId },
      data: {
        title: title.trim(),
        description: description.trim(),
        releaseDate: new Date(releaseDate),
        genreId: genreRecord.idGenre,
        editeurId: editeurRecord.idEditeur,
      },
      include: {
        genre: true,
        editeur: true,
      },
    });
    if (isApiRequest(req)) {
      return res.json(game);
    }

    return res.redirect(`/games/${gameId}/detail`);
  } catch (error) {
    console.error(error);
    if (isApiRequest(req)) {
      return res.status(500).json({ error: "Erreur serveur" });
    }

    return res.redirect("/500");
  }
};

// Supprimer un jeu
exports.deleteGame = async (req, res) => {
  try {
    const gameId = parseInt(req.params.id);
    await prisma.jeux.delete({
      where: { id: gameId },
    });
    if (isApiRequest(req)) {
      return res.json({ message: "Jeu supprimé" });
    }

    return res.redirect("/");
  } catch (error) {
    console.error(error);
    if (isApiRequest(req)) {
      return res.status(500).json({ error: "Erreur serveur" });
    }

    return res.redirect("/500");
  }
};
