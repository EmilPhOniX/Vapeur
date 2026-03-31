const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const isApiRequest = (req) => req.originalUrl.startsWith("/api/");

// ============ ROUTES DE RENDU ============

// Afficher les détails d'un éditeur
exports.editeurDetail = async (req, res) => {
  try {
    const editeurId = parseInt(req.params.id);

    if (isNaN(editeurId)) {
      return res.status(400).render("404");
    }

    const editeur = await prisma.editeursDeJeux.findUnique({
      where: { idEditeur: editeurId },
      include: {
        jeux: {
          include: {
            genre: true,
          },
        },
      },
    });

    if (!editeur) {
      return res.status(404).render("404");
    }

    res.render("editeurDetail", { editeur, jeux: editeur.jeux });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'éditeur :", error);
    res.status(500).render("500");
  }
};

// ============ ROUTES API (JSON) ============

// Récupérer tous les éditeurs
exports.getAllEditeurs = async (req, res) => {
  try {
    const editeurs = await prisma.editeursDeJeux.findMany({
      include: {
        jeux: true,
      },
    });
    res.json(editeurs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Récupérer un éditeur par ID
exports.getEditeurById = async (req, res) => {
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
    if (!editeur) return res.status(404).json({ error: "Éditeur non trouvé" });
    res.json(editeur);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Créer un éditeur
exports.createEditeur = async (req, res) => {
  try {
    const { editeur } = req.body;

    if (!editeur || editeur.trim() === "") {
      if (isApiRequest(req)) {
        return res
          .status(400)
          .json({ error: "Le nom de l'éditeur est requis" });
      }

      return res.redirect("/");
    }

    const newEditeur = await prisma.editeursDeJeux.create({
      data: {
        editeur: editeur.trim(),
      },
    });
    if (isApiRequest(req)) {
      return res.status(201).json(newEditeur);
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

// Mettre à jour un éditeur
exports.updateEditeur = async (req, res) => {
  try {
    const editeurId = parseInt(req.params.id);
    const { editeur } = req.body;

    if (!editeur || editeur.trim() === "") {
      if (isApiRequest(req)) {
        return res
          .status(400)
          .json({ error: "Le nom de l'éditeur est requis" });
      }

      return res.redirect(`/publishers/${editeurId}/detail`);
    }

    const updatedEditeur = await prisma.editeursDeJeux.update({
      where: { idEditeur: editeurId },
      data: {
        editeur: editeur.trim(),
      },
    });
    if (isApiRequest(req)) {
      return res.json(updatedEditeur);
    }

    return res.redirect(`/publishers/${editeurId}/detail`);
  } catch (error) {
    console.error(error);
    if (isApiRequest(req)) {
      return res.status(500).json({ error: "Erreur serveur" });
    }

    return res.redirect("/500");
  }
};

// Supprimer un éditeur
exports.deleteEditeur = async (req, res) => {
  try {
    const editeurId = parseInt(req.params.id);
    await prisma.editeursDeJeux.delete({
      where: { idEditeur: editeurId },
    });
    if (isApiRequest(req)) {
      return res.json({ message: "Éditeur supprimé" });
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
