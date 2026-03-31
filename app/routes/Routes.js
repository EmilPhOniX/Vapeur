const routeController = require("../controllers/routeController");
const gameController = require("../controllers/gameController");
const genreController = require("../controllers/genreController");
const editeurController = require("../controllers/editeurController");
const express = require("express");
const router = express.Router();

// ============ ROUTES INDEX ============
router.get("/", routeController.indexPage);

// ============ ROUTES JEUX ============
// Détail d'un jeu
router.get("/games/:id/detail", gameController.gameDetail);
router.get("/game/:id", gameController.gameDetail);

// ============ ROUTES GENRES ============
// Détail d'un genre
router.get("/genres/:idGenre/detail", genreController.genreDetail);
router.get("/genre/:id", genreController.genreDetail);

// ============ ROUTES EDITEURS ============
// Détail d'un éditeur
router.get("/editeur/:id", editeurController.editeurDetail);
router.get("/publishers/:id/detail", editeurController.editeurDetail);

// ============ ROUTES ERREURS ============
router.get("/404", routeController.notFoundPage);
router.get("/500", routeController.serverErrorPage);

module.exports = router;
