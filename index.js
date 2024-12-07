const express = require("express");
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const { compileFunction } = require("vm");

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

// Middleware pour parser les données entrantes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Route pour afficher l'index
app.get("/", (req, res) => {
    res.send("Hello World!");;
});