const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ============ ROUTES DE RENDU ============

// Afficher les détails d'un genre
exports.genreDetail = async (req, res) => {
  try {
    const genreId = parseInt(req.params.idGenre);

    if (isNaN(genreId)) {
      return res.status(400).render("404");
    }

    const genre = await prisma.genreDeJeux.findUnique({
      where: { idGenre: genreId },
      include: {
        jeux: {
          include: {
            editeur: true,
          },
        },
      },
    });

    if (!genre) {
      return res.status(404).render("404");
    }

    res.render("genreDetail", { genre });
  } catch (error) {
    console.error("Erreur lors de la récupération du genre :", error);
    res.status(500).render("500");
  }
};

// ============ ROUTES API (JSON) ============

// Récupérer tous les genres
exports.getAllGenres = async (req, res) => {
  try {
    const genres = await prisma.genreDeJeux.findMany({
      include: {
        jeux: true,
      },
    });
    res.json(genres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Récupérer un genre par ID
exports.getGenreById = async (req, res) => {
  try {
    const genre = await prisma.genreDeJeux.findUnique({
      where: { idGenre: parseInt(req.params.id) },
      include: {
        jeux: {
          include: {
            editeur: true,
          },
        },
      },
    });
    if (!genre) return res.status(404).json({ error: "Genre non trouvé" });
    res.json(genre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Créer un genre
exports.createGenre = async (req, res) => {
  try {
    const { genre } = req.body;
    
    if (!genre || genre.trim() === "") {
      return res.status(400).json({ error: "Le nom du genre est requis" });
    }

    const newGenre = await prisma.genreDeJeux.create({
      data: {
        genre: genre.trim(),
      },
    });
    res.status(201).json(newGenre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Mettre à jour un genre
exports.updateGenre = async (req, res) => {
  try {
    const { genre } = req.body;

    if (!genre || genre.trim() === "") {
      return res.status(400).json({ error: "Le nom du genre est requis" });
    }

    const updatedGenre = await prisma.genreDeJeux.update({
      where: { idGenre: parseInt(req.params.id) },
      data: {
        genre: genre.trim(),
      },
    });
    res.json(updatedGenre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Supprimer un genre
exports.deleteGenre = async (req, res) => {
  try {
    await prisma.genreDeJeux.delete({
      where: { idGenre: parseInt(req.params.id) },
    });
    res.json({ message: "Genre supprimé" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
