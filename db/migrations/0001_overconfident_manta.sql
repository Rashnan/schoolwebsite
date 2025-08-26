CREATE TABLE `registrations` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`registrationName` varchar(255) NOT NULL,
	`totalAmount` int NOT NULL,
	`paymentStatus` varchar(50) DEFAULT 'pending',
	`paymentReference` varchar(255),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `registrations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `runners` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`registrationId` int NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`category` varchar(50) NOT NULL,
	`tshirtSize` varchar(10) NOT NULL,
	`includeTshirt` boolean DEFAULT true,
	`individualPrice` int NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `runners_id` PRIMARY KEY(`id`)
);
