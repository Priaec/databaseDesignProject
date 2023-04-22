CREATE TABLE `user` (
  `username` varchar(50) NOT NULL PRIMARY KEY,
  `password` varchar(300) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL
);INSERT INTO `user` (`username`, `password`, `firstName`, `lastName`, `email`) VALUES
('JoshuaCohen', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', 'Joshua', 'Cohen', 'notJoshCohen@yahoo.com'),
('Student1', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'student', 'person', 'student@yahoo.com'),
('admin', '38a81e87e79631e602bf5fbd307ce2fcd382b1670c585ea09032aac778a80531', 'admin', 'person', 'admin@yahoo.com'),
('cassi123', 'c6be040f3fd060f9229167e545c7c7cf90507982ecb35aaf2226caab39f580e1', 'Cassidy', 'Smith', 'cassidy123@gmail.com'
);CREATE TABLE `items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `category` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `username` VARCHAR(50) NOT NULL
);ALTER TABLE `items` ADD CONSTRAINT `fk_username` FOREIGN KEY (`username`) REFERENCES `user`(`username`
);CREATE TABLE `reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `rating` ENUM('excellent', 'good', 'fair', 'poor') NOT NULL,
  `description` TEXT NOT NULL,
  `username` VARCHAR(50) NOT NULL,
  `item_id` INT NOT NULL
);ALTER TABLE `reviews` ADD CONSTRAINT `fk_reviews_id` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`
);ALTER TABLE `reviews` ADD CONSTRAINT `fk_reviews_username` FOREIGN KEY (`username`) REFERENCES `items`(`username`
);INSERT INTO `items` (`title`, `description`, `category`, `price`, `username`) VALUES
('Iphone 14', 'Produced 2023', 'Electronics', '899', 'admin'),
('Ninja Blender', 'Wonderful for making shakes and smoothies', 'Appliances', '199.89', 'Student1'),
('Intel core I9 12900K', 'The strongest processor on the market', 'Electronics', '799.89', 'JoshuaCohen'),
('SurfBoard', 'Used to go surfing in the ocean', 'Outdoor', '249.79', 'admin'),
('Large Suitcase', 'Used for domestic and international travel and color is Blue', 'Travel', '149.99', 'cassi123'
);INSERT INTO `reviews` (`item_id`, `rating`, `description`, `username`) VALUES
('3', 'fair', 'These processors have issues with overclocking. Also quite a high price.', 'admin'),
('1', 'good', 'Great quality, however, it is a high price.', 'Student1'),
('4', 'excellent', 'Durable and has lasted a long time.', 'admin'),
('2', 'poor', 'Broke on me within the first 2 days. Quite upsetting!', 'JoshuaCohen'),
('5', 'excellent', 'Durable and has lasted a long time. Very affordable!', 'cassi123'
);SET FOREIGN_KEY_CHECKS = 1;
