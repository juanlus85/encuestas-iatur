ALTER TABLE `field_metrics` MODIFY COLUMN `timeSlot` enum('manana','mediodia','tarde','noche','fin_semana');--> statement-breakpoint
ALTER TABLE `pedestrian_sessions` MODIFY COLUMN `timeSlot` enum('manana','mediodia','tarde','noche','fin_semana');--> statement-breakpoint
ALTER TABLE `survey_responses` MODIFY COLUMN `timeSlot` enum('manana','mediodia','tarde','noche','fin_semana');