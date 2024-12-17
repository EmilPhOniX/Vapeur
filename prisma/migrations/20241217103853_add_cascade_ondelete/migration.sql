/*
  Warnings:

  - The primary key for the `EditeursDeJeux` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `EditeursDeJeux` table. All the data in the column will be lost.
  - Added the required column `idEditeur` to the `EditeursDeJeux` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EditeursDeJeux" (
    "idEditeur" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "editeur" TEXT NOT NULL
);
INSERT INTO "new_EditeursDeJeux" ("editeur") SELECT "editeur" FROM "EditeursDeJeux";
DROP TABLE "EditeursDeJeux";
ALTER TABLE "new_EditeursDeJeux" RENAME TO "EditeursDeJeux";
CREATE TABLE "new_Jeux" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "releaseDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "genreId" INTEGER NOT NULL,
    "editeurId" INTEGER NOT NULL,
    CONSTRAINT "Jeux_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "GenreDeJeux" ("idGenre") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Jeux_editeurId_fkey" FOREIGN KEY ("editeurId") REFERENCES "EditeursDeJeux" ("idEditeur") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Jeux" ("description", "editeurId", "genreId", "id", "releaseDate", "title") SELECT "description", "editeurId", "genreId", "id", "releaseDate", "title" FROM "Jeux";
DROP TABLE "Jeux";
ALTER TABLE "new_Jeux" RENAME TO "Jeux";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
