const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Page d'accueil
exports.indexPage = async (req, res) => {
  try {
    const genres = await prisma.genreDeJeux.findMany();
    const editeurs = await prisma.editeursDeJeux.findMany();
    const games = await prisma.jeux.findMany({
      include: {
        genre: true,
        editeur: true,
      },
    });
    res.render("index", { genres, editeurs, games });
  } catch (error) {
    console.error(error);
    res.render("500");
  }
};

// Détail d'un jeu
exports.gameDetail = async (req, res) => {
  try {
    const game = await prisma.jeux.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        genre: true,
        editeur: true,
      },
    });
    if (!game) return res.render("404");
    res.render("gameDetail", { game });
  } catch (error) {
    console.error(error);
    res.render("500");
  }
};

// Détail d'un genre
exports.genreDetail = async (req, res) => {
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
    if (!genre) return res.render("404");
    res.render("genreDetail", { genre });
  } catch (error) {
    console.error(error);
    res.render("500");
  }
};

// Détail d'un éditeur
exports.editeurDetail = async (req, res) => {
  try {
    const editeur = await prisma.editeursDeJeux.findUnique({
      where: { idEditeur: parseInt(req.params.id) },
      include: {
        jeux: {
          include: {
            genre: true,
          },
        },
      },
    });
    if (!editeur) return res.render("404");
    res.render("editeurDetail", { editeur });
  } catch (error) {
    console.error(error);
    res.render("500");
  }
};

// Pages d'erreur
exports.notFoundPage = (req, res) => {
  res.render("404");
};

exports.serverErrorPage = (req, res) => {
  res.render("500");
};
