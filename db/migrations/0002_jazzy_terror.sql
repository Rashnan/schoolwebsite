CREATE TABLE `discounts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`code` varchar(50) NOT NULL,
	`type` varchar(20) NOT NULL,
	`value` decimal(10,2) NOT NULL,
	`minParticipants` int DEFAULT 1,
	`validFrom` timestamp NOT NULL,
	`validUntil` timestamp NOT NULL,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `discounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `discounts_code_unique` UNIQUE(`code`)
);
