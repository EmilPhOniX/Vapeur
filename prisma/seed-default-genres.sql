INSERT INTO `GenreDeJeux` (`idGenre`, `genre`) VALUES
  (1, 'Action'),
  (2, 'Aventure'),
  (3, 'RPG'),
  (4, 'Simulation'),
  (5, 'Sport'),
  (6, 'MMORPG')
ON DUPLICATE KEY UPDATE
  `genre` = VALUES(`genre`);
