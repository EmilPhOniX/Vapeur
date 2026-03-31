const express = require("express");
const path = require("path");

class Middleware {
  static register(app) {
    // Middlewares de parsing
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Dossier des fichiers statiques
    app.use(express.static(path.join(__dirname, "../public")));
  }
}

module.exports = Middleware;
