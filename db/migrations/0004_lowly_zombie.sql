ALTER TABLE `runners` ADD `tshirtSize` varchar(10) DEFAULT 'M' NOT NULL;--> statement-breakpoint
ALTER TABLE `runners` DROP COLUMN `includeTshirt`;