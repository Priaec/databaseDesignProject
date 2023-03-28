CREATE TABLE `user` (
  `username` varchar(50) NOT NULL,
  `password` varchar(300) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL
);INSERT INTO `user` (`username`, `password`, `firstName`, `lastName`, `email`) VALUES
('JoshuaCohen', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', 'Joshua', 'Cohen', 'notJoshCohen@yahoo.com'),
('Student1', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'student', 'person', 'student@yahoo.com'),
('admin', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', 'admin', 'person', 'admin@yahoo.com'),
('cassi123', 'c6be040f3fd060f9229167e545c7c7cf90507982ecb35aaf2226caab39f580e1', 'Cassidy', 'Smith', 'cassidy123@gmail.com');

