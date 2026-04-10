CREATE TABLE `survey_answers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`surveyId` int NOT NULL,
	`questionCode` varchar(16) NOT NULL,
	`questionId` int NOT NULL,
	`questionTextEs` text,
	`questionTextEn` text,
	`answerValue` text,
	`answerLabelEs` text,
	`answerLabelEn` text,
	`surveyType` enum('visitantes','residentes') NOT NULL,
	`surveyPoint` varchar(255),
	`encuestadorId` int NOT NULL,
	`encuestadorName` varchar(255),
	`encuestadorIdentifier` varchar(32),
	`recordedAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `survey_answers_id` PRIMARY KEY(`id`)
);
