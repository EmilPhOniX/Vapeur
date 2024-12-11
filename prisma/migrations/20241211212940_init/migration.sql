/*
  Warnings:

  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Task";
PRAGMA foreign_keys=on;

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
