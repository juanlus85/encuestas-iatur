CREATE TABLE `field_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`encuestadorId` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`templateId` int,
	`surveyPoint` varchar(255),
	`timeSlot` enum('manana','tarde','noche','fin_semana'),
	`completed` int NOT NULL DEFAULT 0,
	`rejected` int NOT NULL DEFAULT 0,
	`substituted` int NOT NULL DEFAULT 0,
	`incomplete` int NOT NULL DEFAULT 0,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `field_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `photos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`responseId` int NOT NULL,
	`questionId` int,
	`fileKey` varchar(512) NOT NULL,
	`url` text NOT NULL,
	`mimeType` varchar(64) DEFAULT 'image/jpeg',
	`sizeBytes` bigint,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `photos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`templateId` int NOT NULL,
	`order` int NOT NULL DEFAULT 0,
	`type` enum('single_choice','multiple_choice','text','scale','yes_no','number') NOT NULL,
	`text` text NOT NULL,
	`textEn` text,
	`options` json,
	`isRequired` boolean NOT NULL DEFAULT true,
	`requiresPhoto` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `survey_responses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`templateId` int NOT NULL,
	`encuestadorId` int NOT NULL,
	`encuestadorName` varchar(255),
	`encuestadorIdentifier` varchar(32),
	`deviceInfo` text,
	`surveyPoint` varchar(255),
	`timeSlot` enum('manana','tarde','noche','fin_semana'),
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`gpsAccuracy` decimal(8,2),
	`startedAt` timestamp NOT NULL,
	`finishedAt` timestamp,
	`language` enum('es','en') NOT NULL DEFAULT 'es',
	`answers` json NOT NULL,
	`status` enum('completa','incompleta','rechazada','sustitucion') NOT NULL DEFAULT 'completa',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `survey_responses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `survey_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`nameEn` varchar(255),
	`type` enum('residentes','visitantes') NOT NULL,
	`description` text,
	`descriptionEn` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`targetCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `survey_templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','encuestador','revisor','user') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `identifier` varchar(32);--> statement-breakpoint
ALTER TABLE `users` ADD `isActive` boolean DEFAULT true NOT NULL;