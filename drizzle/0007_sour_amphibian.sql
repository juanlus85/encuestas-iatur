CREATE TABLE `shift_closures` (
	`id` int AUTO_INCREMENT NOT NULL,
	`encuestadorId` int NOT NULL,
	`encuestadorName` varchar(255),
	`shiftId` int,
	`closedAt` timestamp NOT NULL,
	`totalEncuestas` int NOT NULL DEFAULT 0,
	`totalConteos` int DEFAULT 0,
	`totalRechazos` int DEFAULT 0,
	`surveyPoint` varchar(255),
	`surveyType` enum('visitantes','residentes','conteo'),
	`incidencias` text,
	`valoracion` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `shift_closures_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shifts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`encuestadorId` int NOT NULL,
	`shiftDate` varchar(10) NOT NULL,
	`startTime` varchar(5) NOT NULL,
	`endTime` varchar(5) NOT NULL,
	`surveyPoint` varchar(255),
	`surveyType` enum('visitantes','residentes','conteo'),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shifts_id` PRIMARY KEY(`id`)
);
