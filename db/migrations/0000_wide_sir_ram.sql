CREATE TABLE `admins` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`username` varchar(20),
	`password` varchar(20),
	CONSTRAINT `admins_id` PRIMARY KEY(`id`)
);
