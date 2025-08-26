-- Replace includeTshirt boolean with tshirtSize varchar
ALTER TABLE `runners` DROP COLUMN `includeTshirt`;
ALTER TABLE `runners` ADD COLUMN `tshirtSize` varchar(10) NOT NULL DEFAULT 'M';
