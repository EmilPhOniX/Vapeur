-- CreateTable
CREATE TABLE `Jeux` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `releaseDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `genreId` INTEGER NOT NULL,
    `editeurId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GenreDeJeux` (
    `idGenre` INTEGER NOT NULL AUTO_INCREMENT,
    `genre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idGenre`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EditeursDeJeux` (
    `idEditeur` INTEGER NOT NULL AUTO_INCREMENT,
    `editeur` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idEditeur`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Jeux` ADD CONSTRAINT `Jeux_genreId_fkey` FOREIGN KEY (`genreId`) REFERENCES `GenreDeJeux`(`idGenre`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Jeux` ADD CONSTRAINT `Jeux_editeurId_fkey` FOREIGN KEY (`editeurId`) REFERENCES `EditeursDeJeux`(`idEditeur`) ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO `GenreDeJeux` (`idGenre`, `genre`) VALUES
  (1, 'Action'),
  (2, 'Aventure'),
  (3, 'RPG'),
  (4, 'Simulation'),
  (5, 'Sport'),
  (6, 'MMORPG');