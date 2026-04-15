CREATE TABLE `counting_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`encuestadorId` int NOT NULL,
	`encuestadorName` varchar(255),
	`encuestadorIdentifier` varchar(32),
	`surveyPointCode` varchar(16) NOT NULL,
	`surveyPointName` varchar(255),
	`subPointCode` varchar(16),
	`subPointName` varchar(255),
	`startedAt` timestamp NOT NULL,
	`finishedAt` timestamp,
	`totalPersons` int NOT NULL DEFAULT 0,
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`gpsAccuracy` decimal(8,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `counting_sessions_id` PRIMARY KEY(`id`)
);
