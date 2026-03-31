const gameController = require("../controllers/gameController");
const genreController = require("../controllers/genreController");
const editeurController = require("../controllers/editeurController");
const express = require("express");
const router = express.Router();

// ============ ROUTES JEUX ============
// API JSON
router.get("/api/games", gameController.getAllGames);
router.get("/api/games/:id", gameController.getGameById);
router.post("/api/games", gameController.createGame);
router.put("/api/games/:id", gameController.updateGame);
router.delete("/api/games/:id", gameController.deleteGame);

// Formulaire HTML (POST)
router.post("/games", gameController.createGame);
router.post("/games/:id/update", gameController.updateGame);
router.get("/games/:id/delete", gameController.deleteGame);

// ============ ROUTES GENRES ============
// API JSON
router.get("/api/genres", genreController.getAllGenres);
router.get("/api/genres/:id", genreController.getGenreById);
router.post("/api/genres", genreController.createGenre);
router.put("/api/genres/:id", genreController.updateGenre);
router.delete("/api/genres/:id", genreController.deleteGenre);

// ============ ROUTES EDITEURS ============
// API JSON
router.get("/api/editeurs", editeurController.getAllEditeurs);
router.get("/api/editeurs/:id", editeurController.getEditeurById);
router.post("/api/editeurs", editeurController.createEditeur);
router.put("/api/editeurs/:id", editeurController.updateEditeur);
router.delete("/api/editeurs/:id", editeurController.deleteEditeur);

// Formulaire HTML (POST)
router.post("/publisher", editeurController.createEditeur);
router.post("/publishers/:id/update", editeurController.updateEditeur);
router.get("/publishers/:id/delete", editeurController.deleteEditeur);

module.exports = router;
