require("dotenv").config();
const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const Middleware = require("./middleware/middleware");
const Helpers = require("./Helpers/Healpers");
const connectDB = require("./config/db");

const indexRouter = require("./routes/Routes");
const apiRouter = require("./routes/api");

const PORT = process.env.PORT;
const app = express();

// Enregistrer les middlewares
Middleware.register(app);

// Configurer Handlebars avec les helpers
app.engine(
  "hbs",
  engine({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/components"),
    helpers: {
      eq: Helpers.eq,
      sort: Helpers.sort,
    },
  }),
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Connexion à la base de données
connectDB();

// Enregistrer les routes
app.use(indexRouter);
app.use(apiRouter);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
