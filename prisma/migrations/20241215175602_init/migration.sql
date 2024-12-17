-- CreateTable
CREATE TABLE "Jeux" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "releaseDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "genreId" INTEGER NOT NULL,
    "editeurId" INTEGER NOT NULL,
    CONSTRAINT "Jeux_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "GenreDeJeux" ("idGenre") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Jeux_editeurId_fkey" FOREIGN KEY ("editeurId") REFERENCES "EditeursDeJeux" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GenreDeJeux" (
    "idGenre" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "genre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "EditeursDeJeux" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "editeur" TEXT NOT NULL
);

INSERT INTO "GenreDeJeux" ("idGenre", "genre") VALUES
  (1, 'Action'),
  (2, 'Aventure'),
  (3, 'RPG'),
  (4, 'Simulation'),
  (5, 'Sport'),
  (6, 'MMORPG');
